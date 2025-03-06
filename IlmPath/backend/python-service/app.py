import os
import pickle
import time
import sys

import torch
import librosa
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
from sentence_transformers import SentenceTransformer, util
from flask import Flask, request, jsonify

# Set the Transformers cache directory (used by Hugging Face)
os.environ["TRANSFORMERS_CACHE"] = "/app/cache"

# Download necessary NLTK data
nltk.download("punkt")
nltk.download("punkt_tab")

# --- Lazy-loaded models ---
lazy_loaded = False
processor = None
model = None
sbert_model = None

def lazy_load_models():
    global lazy_loaded, processor, model, sbert_model
    if not lazy_loaded:
        print("DEBUG: Loading Tarteel & SBERT models for the first time...", flush=True)
        # Use the persistent cache directory for faster reloads.
        processor = AutoProcessor.from_pretrained(
            "tarteel-ai/whisper-base-ar-quran", cache_dir="/app/cache"
        )
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            "tarteel-ai/whisper-base-ar-quran", cache_dir="/app/cache"
        )
        sbert_model = SentenceTransformer(
            'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
            cache_folder="/app/cache"
        )
        lazy_loaded = True
        print("DEBUG: Models loaded successfully.", flush=True)

def transcribe_audio(audio_path):
    print(f"DEBUG: transcribe_audio called with audio_path={audio_path}", flush=True)
    audio, sr = librosa.load(audio_path, sr=16000)  # Ensure audio is 16kHz
    input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features
    with torch.no_grad():
        predicted_ids = model.generate(input_features)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    return transcription

def exact_match_score(transcription_tokens, ayah_tokens):
    overlap = set(transcription_tokens).intersection(set(ayah_tokens))
    return len(overlap) / max(len(transcription_tokens), len(ayah_tokens))

def search_ayah(transcription, df, top_k=1, token_threshold=0.2):
    print("DEBUG: Starting search_ayah", flush=True)
    transcription_tokens = word_tokenize(transcription)
    transcription_embedding = sbert_model.encode(transcription, convert_to_tensor=True)
    candidates = []
    for idx, row in df.iterrows():
        token_score = exact_match_score(transcription_tokens, row["ayah_tokens"])
        if token_score < token_threshold:
            continue
        ayah_embedding = row["ayah_embedding"]
        semantic_score = util.pytorch_cos_sim(transcription_embedding, ayah_embedding).item()
        combined_score = (0.6 * token_score) + (0.4 * semantic_score)
        candidates.append({
            "index": idx,
            "surah_no": row["surah_no"],
            "ayah_no_surah": row["ayah_no_surah"],
            "ayah_ar": row["ayah_ar"],
            "ayah_en": row["ayah_en"],
            "token_score": token_score,
            "semantic_score": semantic_score,
            "combined_score": combined_score
        })
    candidates = sorted(candidates, key=lambda x: x["combined_score"], reverse=True)
    print(f"DEBUG: search_ayah completed, total candidates={len(candidates)}", flush=True)
    return candidates[:top_k]

def preprocess_dataset(file_path):
    print(f"DEBUG: Reading CSV file {file_path}", flush=True)
    df = pd.read_csv(file_path)
    print("DEBUG: Generating embeddings for Ayahs...", flush=True)
    df['ayah_embedding'] = df['ayah_ar'].apply(lambda ayah: sbert_model.encode(ayah, convert_to_tensor=True))
    df['ayah_tokens'] = df['ayah_ar'].apply(lambda ayah: word_tokenize(ayah))
    def generate_ngrams(ayah, n):
        words = ayah.split()
        return [" ".join(words[i:i+n]) for i in range(len(words)-n+1)]
    df['bigrams'] = df['ayah_ar'].apply(lambda ayah: generate_ngrams(ayah, 2))
    df['trigrams'] = df['ayah_ar'].apply(lambda ayah: generate_ngrams(ayah, 3))
    print("DEBUG: Done preprocessing dataset.", flush=True)
    return df

def preprocess_and_save(file_path, processed_file="processed_dataset.pkl"):
    if os.path.exists(processed_file):
        print("Processed dataset already exists. Loading it...", flush=True)
        with open(processed_file, "rb") as f:
            df = pickle.load(f)
    else:
        print("Processing dataset for the first time...", flush=True)
        global sbert_model
        if sbert_model is None:
            print("DEBUG: Loading SBERT model early for preprocessing dataset...", flush=True)
            sbert_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2', cache_folder="/app/cache", force_download=True)
        df = preprocess_dataset(file_path)
        with open(processed_file, "wb") as f:
            pickle.dump(df, f)
        print("Dataset processed and saved successfully.", flush=True)
    return df

DATASET_PATH = "The Quran Dataset.csv"
df_global = preprocess_and_save(DATASET_PATH, "processed_dataset.pkl")

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, world!", 200

@app.route("/health")
def health_check():
    return "OK", 200

@app.route("/transcribe", methods=["POST"])
def transcribe_endpoint():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided."}), 400
    lazy_load_models()
    file = request.files["audio"]
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    file.save(file_path)
    transcription = transcribe_audio(file_path)
    return jsonify({"transcription": transcription})

@app.route("/search", methods=["POST"])
def search_endpoint():
    try:
        data = request.get_json()
        if not data or "transcription" not in data:
            return jsonify({"error": "Transcription text is required."}), 400
        transcription = data["transcription"]
        lazy_load_models()
        start_time = time.time()
        results = search_ayah(transcription, df_global)
        duration = time.time() - start_time
        print("DEBUG: search_ayah completed in", duration, "seconds", flush=True)
        return jsonify({"results": results}), 200
    except Exception as e:
        print("Error in /search endpoint:", e, flush=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route("/audio-search", methods=["POST"])
def audio_search_endpoint():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided."}), 400
        lazy_load_models()
        file = request.files["audio"]
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        file.save(file_path)
        transcription = transcribe_audio(file_path)
        results = search_ayah(transcription, df_global)
        return jsonify({
            "transcription": transcription,
            "results": results
        }), 200
    except Exception as e:
        print("Error in /audio-search endpoint:", e, flush=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == "__main__":
    print("DEBUG: Starting Flask server on 0.0.0.0:8000", flush=True)
    app.run(host="0.0.0.0", port=8000, debug=False)
