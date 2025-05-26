# Backend Service - Deep Research Agent

This directory contains the Python FastAPI backend for the Deep Research Agent.

## Prerequisites

- Python 3.9+
- Pip

## Setup and Running Locally

1.  **Navigate to this directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Environment Variables (Optional):**
    To connect to the actual OpenAI API, you need to set the `OPENAI_API_KEY`.
    ```bash
    export OPENAI_API_KEY="your_openai_api_key_here"
    ```
    If this is not set, the API will return simulated responses.

5.  **Run the FastAPI application:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API will be available at `http://localhost:8000`.

## API Endpoints

-   `GET /`: Welcome message.
-   `POST /research`: Accepts a JSON payload like `{"query": "your research topic"}` and returns a research summary.
    -   Request Body:
        ```json
        {
          "query": "string",
          "sources": ["string"] (optional)
        }
        ```
    -   Success Response (200):
        ```json
        {
          "query": "string",
          "summary": "string",
          "sources_consulted": ["string"] (optional)
        }
        ```

## Running Tests

1.  Ensure dependencies (including `pytest` and `httpx`) are installed.
2.  Navigate to the `backend` directory.
3.  Run:
    ```bash
    pytest
    ```

## Docker

This service can also be run via Docker. See the main project README for `docker-compose` instructions.
To build and run this service standalone with Docker:
```bash
docker build -t research-agent-backend .
docker run -p 8000:8000 -e OPENAI_API_KEY="your_api_key" research-agent-backend
```
