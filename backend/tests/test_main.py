# backend/tests/test_main.py
import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient

# Import the FastAPI app instance from your main application file
# Assuming your FastAPI instance is named 'app' in 'backend.main'
from main import app # Adjusted import as per subtask instructions

# It's common to use TestClient for synchronous tests if your app allows,
# but for async endpoints, AsyncClient with asgi is more direct for FastAPI.
# However, FastAPI's TestClient handles the event loop for you.

# @pytest.fixture(scope="module") # Use module scope if setup is expensive
# def client():
#     with TestClient(app) as c:
#         yield c

# Using pytest-asyncio might be needed if we were doing async fixtures,
# but for TestClient, it's usually not required.
# For now, let's use the straightforward TestClient.

def test_read_root():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Deep Research Agent API"}

def test_conduct_research_success_simulated():
    client = TestClient(app)
    # This test relies on the simulated response because OPENAI_API_KEY is not set in test env
    response = client.post("/research", json={"query": "What is FastAPI?"})
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["query"] == "What is FastAPI?"
    assert "Simulated research summary for query" in json_response["summary"]
    assert "OpenAI API key not configured" in json_response["summary"]

def test_conduct_research_empty_query():
    client = TestClient(app)
    response = client.post("/research", json={"query": ""})
    assert response.status_code == 400 # HTTP 400 for Bad Request
    assert response.json() == {"detail": "Query cannot be empty."}

def test_conduct_research_missing_query_field():
    client = TestClient(app)
    response = client.post("/research", json={}) # Missing 'query' field
    # This should result in a 422 Unprocessable Entity from Pydantic validation
    assert response.status_code == 422
    # The detail would be more complex, so just checking status code is fine for this basic test
    # Example of what it might contain:
    # {'detail': [{'loc': ['body', 'query'], 'msg': 'field required', 'type': 'value_error.missing'}]}

# To run these tests:
# 1. Ensure you are in the `backend` directory.
# 2. Install dev dependencies: `pip install -r requirements.txt` (if not already done)
# 3. Run pytest: `pytest`
