import os, json, time, sys, gc
import numpy as np
import faiss
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

os.environ["TRANSFORMERS_CACHE"] = "/app/cache"

chatbot_data_loaded = False
faiss_index = None
ayah_data = None
chatbot_embedding_model = None

def drop_vars(*vars_):          # optional – frees RAM after each request
    for v in vars_:
        globals()[v] = None
    gc.collect()

def load_chatbot_data():
    global chatbot_data_loaded, faiss_index, ayah_data, chatbot_embedding_model
    if chatbot_data_loaded:
        return

    chatbot_embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', cache_folder="/app/cache", device='cpu')
    # now compress to 8-bit *after* the model is built
    chatbot_embedding_model.quantize(  dtype='int8', gpu=False )

    embeddings_file = "quranic_ayahs.index"
    ayah_data_file  = "ayah_data.json"

    if not (os.path.exists(embeddings_file) and os.path.exists(ayah_data_file)):
        raise RuntimeError(
            "❌ Pre-built FAISS index or ayah_data.json missing in image")

    faiss_index = faiss.read_index(embeddings_file)
    with open(ayah_data_file, "r") as f:
        ayah_data = json.load(f)

    chatbot_data_loaded = True
    print("DEBUG: Chatbot index loaded OK", flush=True)


def search_chatbot(query, top_k=5):
    load_chatbot_data()
    query_emb = chatbot_embedding_model.encode([query], convert_to_numpy=True)
    _, I = faiss_index.search(np.asarray(query_emb), top_k)
    return [
        {
            "ayah":        ayah_data["texts"][i],
            "reference":   ayah_data["references"][i],
            "surah_name":  ayah_data["surah_names"][i],
            "ayah_no":     ayah_data["ayah_numbers"][i],
            "surah_no":    ayah_data["surah_numbers"][i],
        }
        for i in I[0]
    ]

app = Flask(__name__)

@app.route("/")
def index():             # optional
    return "Hello, world!", 200

@app.route("/health")
def health():
    return "OK", 200

@app.route("/chatbot", methods=["POST"])
def chatbot_endpoint():
    try:
        data = request.get_json(silent=True) or {}
        query = data.get("query")
        if not query:
            return jsonify({"error": "Query is required"}), 400
        results = search_chatbot(query, top_k=5)
        return jsonify({"results": results}), 200
    finally:
        # free memory between requests (not strictly required)
        drop_vars("chatbot_embedding_model", "faiss_index", "ayah_data")

