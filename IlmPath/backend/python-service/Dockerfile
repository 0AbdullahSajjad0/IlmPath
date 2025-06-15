FROM python:3.9-slim

WORKDIR /app

# Install necessary system packages including curl and ffmpeg (for ffprobe)
RUN apt-get update && apt-get install -y curl ffmpeg && rm -rf /var/lib/apt/lists/*

# Set up the Transformers cache directory
ENV TRANSFORMERS_CACHE=/app/cache
RUN mkdir -p /app/cache

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --default-timeout=8000 -r requirements.txt

# Copy the application code
COPY . .

# Download NLTK data into a dedicated folder
RUN mkdir -p /usr/local/nltk_data && \
    python -c "import nltk; nltk.download('punkt', download_dir='/usr/local/nltk_data'); nltk.download('punkt_tab', download_dir='/usr/local/nltk_data')"

ENV NLTK_DATA=/usr/local/nltk_data

# Create an uploads folder for temporary files
RUN mkdir -p uploads

EXPOSE 8000

CMD ["python", "app.py"]
