import os
import pickle
import time
import sys
import json

import torch
import torch.nn as nn
import librosa
import pandas as pd
import numpy as np
import faiss
import nltk
from nltk.tokenize import word_tokenize
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq, Wav2Vec2FeatureExtractor, Wav2Vec2Model
from sentence_transformers import SentenceTransformer, util
from flask import Flask, request, jsonify
from pydub import AudioSegment
from pathlib import Path

# Set the Transformers cache directory so that models are cached persistently.
os.environ["TRANSFORMERS_CACHE"] = "/app/cache"

# Download necessary NLTK data
nltk.download("punkt")
nltk.download("punkt_tab")

# ------------------- Existing Transcription/Search/Chatbot Code -------------------

# Lazy-loaded models for transcription/search
lazy_loaded = False
processor = None
model = None
sbert_model = None

def lazy_load_models():
    global lazy_loaded, processor, model, sbert_model
    if not lazy_loaded:
        print("DEBUG: Loading Tarteel & SBERT models for transcription/search...", flush=True)
        processor = AutoProcessor.from_pretrained(
            "tarteel-ai/whisper-base-ar-quran", cache_dir="/app/cache"
        )
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            "tarteel-ai/whisper-base-ar-quran", cache_dir="/app/cache"
        )
        sbert_model = SentenceTransformer(
            'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2', cache_folder="/app/cache"
        )
        lazy_loaded = True
        print("DEBUG: Transcription/search models loaded successfully.", flush=True)

def transcribe_audio(audio_path):
    print(f"DEBUG: transcribe_audio called with audio_path={audio_path}", flush=True)
    audio, sr = librosa.load(audio_path, sr=16000)
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

# ------------------- Chatbot Endpoint Code -------------------
chatbot_data_loaded = False
faiss_index = None
ayah_data = None
chatbot_embedding_model = None  # A separate model for chatbot retrieval

def load_chatbot_data():
    global chatbot_data_loaded, faiss_index, ayah_data, chatbot_embedding_model
    if chatbot_data_loaded:
        return
    print("DEBUG: Loading chatbot dataset and embeddings...", flush=True)
    dataset_path = "ChatbotDataset.csv"
    df_chatbot = pd.read_csv(dataset_path)
    # Use a lightweight embedding model for chatbot queries
    chatbot_embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', cache_folder="/app/cache")
    embeddings_file = "quranic_ayahs.index"
    ayah_data_file = "ayah_data.json"
    if os.path.exists(embeddings_file) and os.path.exists(ayah_data_file):
        print("DEBUG: Using precomputed chatbot embeddings...", flush=True)
        faiss_index = faiss.read_index(embeddings_file)
        with open(ayah_data_file, "r") as f:
            ayah_data = json.load(f)
    else:
        print("DEBUG: Generating and storing chatbot embeddings...", flush=True)
        ayah_texts = df_chatbot["ayah_en"].tolist()
        ayah_references = df_chatbot.apply(lambda row: f"{row['surah_no']}:{row['ayah_no_surah']}", axis=1).tolist()
        ayah_surah_names = df_chatbot["surah_name_ar"].tolist()
        ayah_numbers = df_chatbot["ayah_no_surah"].tolist()
        surah_numbers = df_chatbot["surah_no"].tolist()
        embeddings = chatbot_embedding_model.encode(ayah_texts, convert_to_numpy=True)
        dimension = embeddings.shape[1]
        faiss_index = faiss.IndexFlatL2(dimension)
        faiss_index.add(embeddings)
        faiss.write_index(faiss_index, embeddings_file)
        ayah_data = {
            "texts": ayah_texts,
            "references": ayah_references,
            "surah_names": ayah_surah_names,
            "ayah_numbers": ayah_numbers,
            "surah_numbers": surah_numbers
        }
        with open(ayah_data_file, "w") as f:
            json.dump(ayah_data, f)
    chatbot_data_loaded = True
    print("DEBUG: Chatbot data loaded successfully.", flush=True)

def search_chatbot(query, top_k=5):
    load_chatbot_data()
    query_embedding = chatbot_embedding_model.encode([query], convert_to_numpy=True)
    D, I = faiss_index.search(np.array(query_embedding), top_k)
    results = []
    for i in I[0]:
        results.append({
            "ayah": ayah_data["texts"][i],
            "reference": ayah_data["references"][i],
            "surah_name": ayah_data["surah_names"][i],
            "ayah_no": ayah_data["ayah_numbers"][i],
            "surah_no": ayah_data["surah_numbers"][i]
        })
    return results

# ------------------- Tajweed Detection Endpoint Code -------------------
tajweed_loaded = False
lstm_model = None
wav2vec_model = None
feature_extractor = None
tajweed_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def lazy_load_tajweed():
    global tajweed_loaded, lstm_model, wav2vec_model, feature_extractor, tajweed_device
    if not tajweed_loaded:
        print("DEBUG: Loading Tajweed detection components...", flush=True)
        class TR_MODEL(nn.Module):
            def __init__(self):
                super(TR_MODEL, self).__init__()
                self.lstm = nn.LSTM(
                    input_size=512,
                    hidden_size=512,
                    batch_first=True,
                    bidirectional=True
                )
                self.linear_1 = nn.Linear(1024, 512)
                self.linear_2 = nn.Linear(512, 3)
                self.sigmoid_activation = nn.Sigmoid()
            def forward(self, x):
                x, _ = self.lstm(x)
                x = self.sigmoid_activation(self.linear_2(self.linear_1(x[:, -1, :])))
                return x
        # Update MODEL_PATH to point to your trained model file.
        MODEL_PATH = "TajweedDetectionModel.pt"
        lstm_model_local = TR_MODEL().float().to(tajweed_device)
        lstm_model_local.load_state_dict(torch.load(MODEL_PATH, map_location=tajweed_device))
        lstm_model_local.eval()
        lstm_model = lstm_model_local

        model_name = "facebook/wav2vec2-large-xlsr-53"
        wav2vec_model_local = Wav2Vec2Model.from_pretrained(model_name).to(tajweed_device)
        wav2vec_model_local.eval()
        wav2vec_model = wav2vec_model_local

        feature_extractor_local = Wav2Vec2FeatureExtractor(
            feature_size=1,
            sampling_rate=16000,
            return_tensors="pt",
            padding_value=0.0,
            do_normalize=True,
            return_attention_mask=False
        )
        feature_extractor = feature_extractor_local

        tajweed_loaded = True
        print("DEBUG: Tajweed detection components loaded successfully.", flush=True)

def ensure_wav(audio_file_path: str, desired_sample_rate: int = 16000) -> str:
    file_ext = Path(audio_file_path).suffix.lower()
    if file_ext != '.wav':
        audio_segment = AudioSegment.from_file(audio_file_path, format=file_ext.replace('.', ''))
        audio_segment = audio_segment.set_frame_rate(desired_sample_rate).set_channels(1)
        temp_path = str(Path(audio_file_path).with_suffix('')) + '_temp.wav'
        audio_segment.export(temp_path, format="wav")
        return temp_path
    else:
        return audio_file_path

def predict_tajweed(audio_file: str, sample_rate: int = 16000, target_rate: float = 6.69, max_length: int = 147515):
    wav_path = ensure_wav(audio_file, desired_sample_rate=sample_rate)
    audio, _ = librosa.load(wav_path, sr=sample_rate)
    original_duration = librosa.get_duration(y=audio)
    speed_ratio = original_duration / target_rate
    audio_processed = librosa.effects.time_stretch(audio, rate=speed_ratio)
    input_features = feature_extractor(
        [audio_processed],
        sampling_rate=sample_rate,
        padding='max_length',
        max_length=max_length,
        truncation=True,
        return_tensors='pt'
    ).input_values.to(tajweed_device)
    with torch.no_grad():
        wav2vec_output = wav2vec_model(input_features).extract_features
    with torch.no_grad():
        predictions = lstm_model(wav2vec_output)
    p_st, p_c, p_tn = predictions[0].tolist()
    pred_st_label = 1 if p_st >= 0.5 else 0
    pred_c_label  = 1 if p_c >= 0.5 else 0
    pred_tn_label = 1 if p_tn >= 0.5 else 0
    combined_confidence = (pred_st_label + pred_c_label + pred_tn_label) / 3.0
    return {
        "audio_file": audio_file,
        "processed_wav": wav_path,
        "original_duration": original_duration,
        "prob_separate_tide": p_st,
        "label_separate_tide": pred_st_label,
        "prob_concealment": p_c,
        "label_concealment": pred_c_label,
        "prob_tight_noon": p_tn,
        "label_tight_noon": pred_tn_label,
        "combined_confidence": combined_confidence
    }

# ------------------- Flask App Setup -------------------

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

@app.route("/chatbot", methods=["POST"])
def chatbot_endpoint():
    try:
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Query is required."}), 400
        query = data["query"]
        print("DEBUG: Chatbot endpoint received query:", query, flush=True)
        results = search_chatbot(query, top_k=5)
        return jsonify({"results": results}), 200
    except Exception as e:
        print("Error in /chatbot endpoint:", e, flush=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route("/tajweed", methods=["POST"])
def tajweed_endpoint():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided."}), 400
        lazy_load_tajweed()
        file = request.files["audio"]
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        file.save(file_path)
        result = predict_tajweed(file_path)
        return jsonify(result), 200
    except Exception as e:
        print("Error in /tajweed endpoint:", e, flush=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == "__main__":
    print("DEBUG: Starting Flask server on 0.0.0.0:8000", flush=True)
    app.run(host="0.0.0.0", port=8000, debug=False)
