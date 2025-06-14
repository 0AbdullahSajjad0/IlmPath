FROM python:3.9-slim
WORKDIR /app

RUN apt-get update && apt-get install -y curl ffmpeg && rm -rf /var/lib/apt/lists/*

ENV TRANSFORMERS_CACHE=/app/cache \
    NLTK_DATA=/usr/local/nltk_data
RUN mkdir -p /app/cache

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --default-timeout=8000 -r requirements.txt

COPY . .

# download punkt + punkt_tab
RUN python - <<'EOF'
import nltk, os
target = '/usr/local/nltk_data'
os.makedirs(target, exist_ok=True)
nltk.download('punkt', download_dir=target)
nltk.download('punkt_tab', download_dir=target)
EOF

RUN mkdir -p uploads
EXPOSE 8000

CMD ["gunicorn","app:app", "--bind","0.0.0.0:${PORT:-8000}", "--workers","1", "--preload","false", "--log-level","info"]
