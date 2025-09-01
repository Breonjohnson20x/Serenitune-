FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directories if they don't exist
RUN mkdir -p src/static/audio
RUN mkdir -p src/database

# Set environment variables
ENV FLASK_APP=src/main.py
ENV FLASK_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Run the application
CMD ["python", "src/main.py"]

