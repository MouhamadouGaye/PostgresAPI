// authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware to verify token and attach user data to the request
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach decoded user information to the request
    next(); // Call next middleware or route handler
  });
}

module.exports = verifyToken;
