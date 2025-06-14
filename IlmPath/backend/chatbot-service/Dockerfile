FROM python:3.9-slim

WORKDIR /app

# If you no longer need ffmpeg you can drop it too; leaving it does no harm
RUN apt-get update && \
    apt-get install -y curl ffmpeg && \
    rm -rf /var/lib/apt/lists/*

ENV TRANSFORMERS_CACHE=/app/cache
RUN mkdir -p /app/cache

# Install only the libs this service needs
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --default-timeout=8000 -r requirements.txt

# Copy the trimmed chatbot code + assets
COPY . .

# (No NLTK download block anymore)

EXPOSE 8000

CMD ["bash","-c","gunicorn app:app --bind 0.0.0.0:${PORT:-8000} --workers 1 --timeout 300 --graceful-timeout 60 --log-level info"]

