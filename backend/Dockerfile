# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install Poetry (or just pip if you prefer, but requirements.txt was created)
# Using pip directly with requirements.txt for simplicity here
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
