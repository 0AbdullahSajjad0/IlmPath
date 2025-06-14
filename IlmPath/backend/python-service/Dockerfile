FROM python:3.9-slim
WORKDIR /app

RUN apt-get update && apt-get install -y curl ffmpeg && rm -rf /var/lib/apt/lists/*

ENV TRANSFORMERS_CACHE=/app/cache \
    NLTK_DATA=/usr/local/nltk_data

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --default-timeout=8000 -r requirements.txt

COPY . .

RUN mkdir -p /usr/local/nltk_data \
    && python - <<'PY' \
    import nltk; nltk.download('punkt', download_dir='/usr/local/nltk_data'); \
    nltk.download('punkt_tab', download_dir='/usr/local/nltk_data') \
    PY

RUN mkdir -p uploads

EXPOSE 8000

# bind to $PORT if Render gives one, otherwise 8000; log at debug level
CMD ["bash","-c","gunicorn app:app --bind 0.0.0.0:${PORT:-8000} --log-level debug"]
