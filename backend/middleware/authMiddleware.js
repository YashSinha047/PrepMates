// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// JWT secret from environment variables (set in .env file)
const JWT_SECRET = process.env.SECRET;  // Ensure this is set correctly

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  
  // Check if Authorization header is present and has the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user information to request (this is decoded from the token)
    req.user = decoded.userId;
    
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails, return a 401 error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

