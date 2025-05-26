# Deep Research Agent

This project implements a "Deep Research Agent" with a Python FastAPI backend and a Next.js (React) frontend. It uses the OpenAI API for research capabilities (though it can run in a simulated mode if no API key is provided).

## Project Structure

-   `/backend`: Contains the FastAPI application.
    -   `main.py`: The main FastAPI application code.
    -   `Dockerfile`: For containerizing the backend.
    -   `requirements.txt`: Python dependencies.
    -   `tests/`: Backend tests.
-   `/frontend-next`: Contains the Next.js application.
    -   `src/app/page.tsx`: The main page component.
    -   `Dockerfile`: For containerizing the frontend.
    -   `package.json`: Node.js dependencies.
    -   `jest.config.mjs`, `jest.setup.js`: Jest test configurations.
-   `docker-compose.yml`: For running both services together.

## Prerequisites for Dockerized Setup

-   Docker
-   Docker Compose

## Running with Docker Compose (Recommended)

This is the easiest way to get both the backend and frontend services running together.

1.  **Clone the repository (if you haven't already).**

2.  **Environment Variables (Optional but Recommended):**
    If you have an OpenAI API key, create a `.env` file in the project root:
    ```env
    # .env (in project root)
    OPENAI_API_KEY="your_actual_openai_api_key"
    ```
    The `docker-compose.yml` file is set up to read this variable and pass it to the backend service. If not provided, the backend will use simulated OpenAI responses.

3.  **Build and start the services:**
    Navigate to the project root directory (where `docker-compose.yml` is located) and run:
    ```bash
    docker-compose up --build
    ```
    -   `--build` ensures the images are built the first time or if Dockerfiles have changed.
    -   To run in detached mode, add `-d`: `docker-compose up --build -d`.

4.  **Access the application:**
    -   Frontend: `http://localhost:3000`
    -   Backend API: `http://localhost:8000` (e.g., `http://localhost:8000/docs` for API documentation)

## Stopping the Services

-   If running in the foreground (without `-d`), press `Ctrl+C`.
-   If running in detached mode, use:
    ```bash
    docker-compose down
    ```

## Development

See the README files in the `/backend` and `/frontend-next` directories for instructions on running each service independently for development.

The Docker Compose setup includes volume mounts, so changes to your local code should reflect in the running containers for easier development (may require a restart of the specific service or a page refresh).

## Testing

-   **Backend Tests:**
    ```bash
    cd backend
    # Ensure virtual env is active and dev dependencies installed
    pytest
    ```
    Or via Docker:
    ```bash
    docker-compose exec backend pytest
    ```

-   **Frontend Tests:**
    ```bash
    cd frontend-next
    npm test
    ```
    Or via Docker:
    ```bash
    docker-compose exec frontend npm test
    ```

---
# Express App with Astro, MongoDB, and React

## Overview

This project is a full-stack application demonstrating the integration of an Express.js backend with an Astro frontend. The frontend utilizes React components, and the backend connects to a MongoDB database.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm**: [Download Node.js](https://nodejs.org/) (npm is included).
*   **MongoDB**: A MongoDB instance must be running. You can install it locally or use a cloud service like MongoDB Atlas. [Install MongoDB](https://docs.mongodb.com/manual/installation/).

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install root dependencies**:
    These include Express, MongoDB driver, CORS, etc.
    ```bash
    npm install
    ```

3.  **Install frontend dependencies**:
    These include Astro and React.
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Configuration

### MongoDB

The MongoDB connection URI is defined in `index.js`:
```javascript
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
```
*   By default, it attempts to connect to a local MongoDB instance at `mongodb://localhost:27017/mydatabase`.
*   For production or different development environments, it's recommended to set the `MONGO_URI` environment variable to your MongoDB connection string.

    Example for Linux/macOS:
    ```bash
    export MONGO_URI="your_mongodb_connection_string"
    ```
    Example for Windows (PowerShell):
    ```powershell
    $env:MONGO_URI="your_mongodb_connection_string"
    ```

## Development

1.  **Run the Express server**:
    This command starts the backend server using `nodemon` for automatic restarts on file changes.
    ```bash
    npm run dev
    ```
    If you don't have `nodemon` globally or prefer the standard start:
    ```bash
    npm start
    ```

2.  **Access the application**:
    *   The server will be available at `http://localhost:3000` (or the port specified by `process.env.PORT`).
    *   The Astro frontend (with React components) will be served on the root path.
    *   API test endpoint: `http://localhost:3000/api/test-mongo` (This endpoint tests the MongoDB connection).

## Building the Frontend

The frontend is built using Astro. The Express server is configured to serve the static files generated by the Astro build process.

1.  **To build the Astro static site**:
    ```bash
    npm run build:astro
    ```
    This command executes `cd frontend && astro build`, placing the output in the `frontend/dist` directory.

## Running in Production (Conceptual)

For a production deployment:

1.  **Ensure `MONGO_URI` is set**: Set the `MONGO_URI` environment variable to point to your production MongoDB instance.
2.  **Build the frontend**:
    ```bash
    npm run build:astro
    ```
3.  **Start the server**:
    ```bash
    npm start
    ```
    This will start the Express server, which serves the pre-built Astro frontend from `frontend/dist` and handles API requests. Ensure your server environment is configured for production (e.g., `NODE_ENV=production`).
