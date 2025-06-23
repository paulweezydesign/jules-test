const jwt = require('jsonwebtoken');
const userModel = require('../models/user'); // Adjust path as needed

// TODO: IMPORTANT: Centralize JWT_SECRET or ensure it's identical to the one in index.js
// It's best to use process.env.JWT_SECRET consistently.
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-and-not-public-secret-key-for-dev';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided or token is malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB to ensure they still exist and get fresh data
    // The userModel.findUserById function should be available
    const user = await userModel.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Access denied. User not found.' });
    }

    // Attach user to request object (excluding password)
    // Ensure user._id is converted to string if it's an ObjectId
    req.user = {
      id: user._id.toString(),
      username: user.username,
      name: user.name
      // Add other non-sensitive fields if needed
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access denied. Token expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
    console.error('Authentication error (middleware/authMiddleware.js):', error.message);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

module.exports = authMiddleware;
