// models/user.js
const bcrypt = require('bcryptjs'); // Added

// This module will be initialized with the db object from index.js
let db;

function init(database) {
  db = database;
}

async function hashPassword(password) { // Added
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function comparePassword(candidatePassword, hashedPassword) { // Added
  return await bcrypt.compare(candidatePassword, hashedPassword);
}

async function createUser(name, username, hashedPassword) {
  if (!db) throw new Error('Database not initialized for user model');
  const usersCollection = db.collection('users');
  // It's good practice to ensure username is unique at DB level if possible,
  // or check before inserting. The route handler will also check.
  const result = await usersCollection.insertOne({
    name,
    username,
    password: hashedPassword, // Store the already hashed password
    createdAt: new Date()
  });
  return result.insertedId; // Or return the whole document if needed
}

async function findUserByUsername(username) {
  if (!db) throw new Error('Database not initialized for user model');
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ username });
  return user;
}

// You might also want an findUserById function later for JWT payload
async function findUserById(userId) {
  if (!db) throw new Error('Database not initialized for user model');
  const { ObjectId } = require('mongodb'); // Correctly require ObjectId
  const usersCollection = db.collection('users');
  // Ensure userId is a valid ObjectId if your IDs are ObjectIds
  try {
    // Attempt to convert string ID to ObjectId if it's not already one
    const o_id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const user = await usersCollection.findOne({ _id: o_id });
    return user;
  } catch (error) {
    // Handle cases where userId might not be a valid ObjectId string
    console.error("Error finding user by ID (models/user.js):", error.message);
    return null;
  }
}


module.exports = {
  init,
  createUser,
  findUserByUsername,
  findUserById,
  hashPassword, // Added
  comparePassword // Added
};
