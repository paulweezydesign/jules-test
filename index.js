const express = require('express');
const cors = require('cors');
const path = require('path'); // Require path module
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from Astro's build output
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// MongoDB setup
// IMPORTANT: This URI should be configurable in a real application (e.g., via environment variables).
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
const client = new MongoClient(mongoUri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // If your database name is part of the URI, client.db() is fine. Otherwise, client.db('yourDatabaseName')
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
    console.log('Serving Astro frontend from ./frontend/dist');
  });
}).catch(err => {
  console.error('Failed to start the server due to DB connection error:', err);
});
