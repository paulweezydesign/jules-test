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

### JWT Secret
The application uses JSON Web Tokens (JWT) for authentication. The `JWT_SECRET` used for signing these tokens is defined in `index.js`:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-and-not-public-secret-key-for-dev'; // TODO: IMPORTANT: Use a strong, environment-specific secret in production!
```
*   For development, a default secret is provided.
*   **Important for Production**: You **must** override this with a strong, unique secret key via the `JWT_SECRET` environment variable. Refer to security best practices for generating and managing secret keys.

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

## Authentication API Endpoints

The following endpoints are available for user authentication:

### `POST /api/auth/register`

*   **Description**: Registers a new user.
*   **Request Body**: JSON object
    ```json
    {
      "name": "Your Name",
      "username": "yourusername",
      "password": "yourpassword"
    }
    ```
*   **Success Response (201)**:
    ```json
    {
      "message": "User registered successfully",
      "userId": "mongodb_object_id"
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If `name`, `username`, or `password` are missing.
    *   `409 Conflict`: If the `username` already exists.
    *   `500 Internal Server Error`: For other server-side errors.
*   **Example `curl` command**:
    ```bash
    curl -X POST -H "Content-Type: application/json" \
         -d '{"name":"Test User","username":"testuser","password":"password123"}' \
         http://localhost:3000/api/auth/register
    ```

### `POST /api/auth/login`

*   **Description**: Logs in an existing user and returns a JWT.
*   **Request Body**: JSON object
    ```json
    {
      "username": "yourusername",
      "password": "yourpassword"
    }
    ```
*   **Success Response (200)**:
    ```json
    {
      "message": "Login successful",
      "token": "YOUR_JWT_TOKEN",
      "user": {
        "id": "mongodb_object_id",
        "username": "yourusername",
        "name": "Your Name"
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If `username` or `password` are missing.
    *   `401 Unauthorized`: If credentials are invalid (user not found or password incorrect).
    *   `500 Internal Server Error`: For other server-side errors.
*   **Example `curl` command**:
    ```bash
    curl -X POST -H "Content-Type: application/json" \
         -d '{"username":"testuser","password":"password123"}' \
         http://localhost:3000/api/auth/login
    ```

### `GET /api/user/profile` (Protected Route)

*   **Description**: Retrieves the profile of the currently authenticated user. Requires a valid JWT to be passed in the `Authorization` header.
*   **Headers**:
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
*   **Success Response (200)**:
    ```json
    {
      "message": "Profile access successful",
      "user": {
        "id": "mongodb_object_id",
        "username": "yourusername",
        "name": "Your Name"
      }
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: If the token is missing, malformed, invalid, expired, or the user associated with the token is not found.
    *   `500 Internal Server Error`: For other server-side errors.
*   **Example `curl` command** (replace `<YOUR_JWT_TOKEN>` with an actual token obtained from login):
    ```bash
    curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
         http://localhost:3000/api/user/profile
    ```

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
