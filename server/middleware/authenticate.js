// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Update the path as necessary to correctly point to your User model

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assuming your User model doesn't store tokens in an array, adjust as necessary
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token; // Optional: If you're using token in your request handlers
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = authenticate;
