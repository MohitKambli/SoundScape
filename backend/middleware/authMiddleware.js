// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in the database by decoded _id
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Error verifying token or fetching user:', err);
    return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
  }
};

module.exports = authMiddleware;
