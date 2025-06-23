const express = require('express');
const cors = require('cors');
const path = require('path'); // Require path module
const { MongoClient } = require('mongodb');
const userModel = require('./models/user');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware'); // Added

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing application/json
app.use(express.json()); // Added

// Serve static files from Astro's build output
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-and-not-public-secret-key-for-dev'; // TODO: IMPORTANT: Use a strong, environment-specific secret in production!
const JWT_EXPIRES_IN = '1h'; // Token expiration time, e.g., 1 hour

// MongoDB setup
// IMPORTANT: This URI should be configurable in a real application (e.g., via environment variables).
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
const client = new MongoClient(mongoUri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // If your database name is part of the URI, client.db() is fine. Otherwise, client.db('yourDatabaseName')
    userModel.init(db); // Added: Initialize userModel with db
    console.log('Successfully connected to MongoDB and initialized user model');
  } catch (err) {
    console.error('Failed to connect to MongoDB or initialize user model', err);
    process.exit(1); // Exit if cannot connect to DB
  }
}

// API routes (should be defined before the catch-all HTML serving)
app.get('/api/test-mongo', async (req, res) => {
  if (!db) {
    res.status(500).send('Database not connected');
    return;
  }
  try {
    const collection = db.collection('testCollection');
    // Example: insert a document on first hit, then find it
    await collection.updateOne({ testKey: 'testValue' }, { $set: { lastUpdated: new Date() } }, { upsert: true });
    const items = await collection.find({}).toArray();
    res.json({ message: 'MongoDB connection test successful', data: items });
  } catch (err) {
    console.error('Error interacting with MongoDB', err);
    res.status(500).json({ message: 'Error interacting with MongoDB', error: err.message });
  }
});

// All other GET requests serve the Astro index.html
// This should be after API routes
// app.get('/', (req, res) => { // Commented out or moved, as / is now for index.html from static middleware
//   res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
// });


// REGISTRATION ROUTE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Basic validation
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username, and password are required' });
    }

    // Check if user already exists
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await userModel.hashPassword(password);

    // Create user
    const userId = await userModel.createUser(name, username, hashedPassword);

    // Respond
    res.status(201).json({ message: 'User registered successfully', userId });

  } catch (error) {
    console.error('Error during registration (index.js):', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      // Use a generic message for security reasons (don't reveal if username exists)
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await userModel.comparePassword(password, user.password);
    if (!isMatch) {
      // Use a generic message for security reasons
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      userId: user._id,
      username: user.username
      // Add other non-sensitive, useful info if needed (e.g., name, roles)
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Respond
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { // Send back some non-sensitive user info
        id: user._id.toString(), // Ensure this is a string if it's an ObjectId
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error during login (index.js):', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// SAMPLE PROTECTED ROUTE
app.get('/api/user/profile', authMiddleware, (req, res) => {
  // If authMiddleware succeeds, req.user will be populated
  // req.user contains { id, username, name } as set by the middleware
  res.status(200).json({
    message: 'Profile access successful',
    user: req.user
  });
});


// The main catch-all route for serving Astro's index.html for any non-API, non-file GET requests.
// This needs to be AFTER all other API routes and static file serving.
app.get('*', (req, res, next) => {
  // Check if the request is for an API route or a file that might have been missed by static serving.
  // This simple check assumes API routes start with /api.
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next(); // Pass to 404 handler or other specific middleware
  }
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});


// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
    console.log('Serving Astro frontend from ./frontend/dist');
    console.log('Available API routes: /api/test-mongo, /api/auth/register, /api/auth/login, /api/user/profile (protected)');
  });
}).catch(err => {
  console.error('Failed to start the server due to DB connection error:', err);
});
