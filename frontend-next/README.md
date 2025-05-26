# Frontend Service - Deep Research Agent (Next.js)

This directory contains the Next.js (React) frontend for the Deep Research Agent.

## Prerequisites

- Node.js (version specified in `frontend-next/Dockerfile`, e.g., v18)
- npm (or yarn/pnpm if you prefer, though `package-lock.json` is present for npm)

## Setup and Running Locally

1.  **Navigate to this directory:**
    ```bash
    cd frontend-next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    The application expects the backend API to be running. By default, it tries to connect to `http://localhost:8000/research`.
    You can configure this via `NEXT_PUBLIC_API_URL` if needed, but for local development with the backend also running locally, the default should work.

4.  **Run the Next.js development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts a production server (after building).
-   `npm run lint`: Lints the codebase.
-   `npm test`: Runs the test suite using Jest.

## Docker

This service can also be run via Docker. See the main project README for `docker-compose` instructions.
To build and run this service standalone with Docker:
```bash
# Make sure next.config.ts (or .mjs) has output: 'standalone'
docker build -t research-agent-frontend .
docker run -p 3000:3000 research-agent-frontend
```
