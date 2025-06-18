import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# For OpenAI client, ideally API key comes from environment variables
# For local development, you might use a .env file (not committed)
# For this exercise, we'll use a placeholder and allow for a simulated response.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY_PLACEHOLDER")

# Initialize OpenAI client if the key is available
client = None
if OPENAI_API_KEY != "YOUR_OPENAI_API_KEY_PLACEHOLDER":
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(
    title="Deep Research Agent API",
    description="API for conducting research using OpenAI.",
    version="0.1.0",
)

class ResearchRequest(BaseModel):
    query: str
    sources: Optional[list[str]] = None # Optional: specify sources if needed

class ResearchResponse(BaseModel):
    query: str
    summary: str
    sources_consulted: Optional[list[str]] = None

@app.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    """
    Accepts a research query and returns a summary.
    Optionally, users can suggest sources.
    """
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    if client:
        try:
            # This is a simplified example. A real research agent would involve
            # more complex logic: breaking down the query, searching multiple sources,
            # synthesizing information, etc.
            # For now, we'll use a simple completion as a placeholder for the "deep research".

            # Example: Using chat completions (adapt as needed for your research task)
            # You might want to construct a more detailed prompt for the AI.
            prompt = f"Conduct a deep research on the following topic: {request.query}."
            if request.sources:
                prompt += f" Consider the following sources if possible: {', '.join(request.sources)}."

            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful research assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="gpt-3.5-turbo", # Or your preferred model
            )

            summary = chat_completion.choices[0].message.content.strip() if chat_completion.choices else "No summary generated."

            return ResearchResponse(
                query=request.query,
                summary=summary,
                sources_consulted=request.sources # Placeholder, actual sources consulted would be determined by the agent
            )

        except Exception as e:
            # Log the exception e
            raise HTTPException(status_code=500, detail=f"Error during OpenAI API call: {str(e)}")
    else:
        # Simulate API call if client is not initialized (e.g., API key missing)
        print("OpenAI client not initialized. Returning a simulated response.")
        simulated_summary = f"Simulated research summary for query: '{request.query}'. "
        simulated_summary += "OpenAI API key not configured."

        return ResearchResponse(
            query=request.query,
            summary=simulated_summary,
            sources_consulted=request.sources
        )

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Deep Research Agent API"}

# To run this app (from the 'backend' directory):
# 1. Ensure OPENAI_API_KEY is set in your environment (optional, will simulate if not set)
# 2. Install requirements: pip install -r requirements.txt
# 3. Run Uvicorn: uvicorn main:app --reload
