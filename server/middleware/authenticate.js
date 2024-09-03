// server/middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Points to the user model
const BlacklistedToken = require('../models/blacklistedToken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is blacklisted
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
        return res.status(401).send({ error: 'Authentication failed', reason: 'Token is blacklisted' });
    }
    
    // Find the user based on _id only
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(401).send({ error: 'Authentication failed', reason: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    let message = 'Failed to authenticate';

    if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
      message = 'Token has expired';
    }

    res.status(401).send({ error: 'Authentication failed', reason: message });
  }
};


module.exports = authenticate;
