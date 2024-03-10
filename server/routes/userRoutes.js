// routes/userRoutes.js
const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate'); // Adjust the path based on your project structure
const router = express.Router();

// POST /users/register to register a new user
router.post('/register', async (req, res) => {
  try {
   // console.error(error);
    const newUser = new User(req.body);
    await newUser.save();
  //  console.log(req.body); // Log the incoming request body to the console
    res.status(201).send({ user: newUser._id });
  } catch (error) {
    console.error("Error saving user:", error); // Log the full error
    if (error.name === 'ValidationError') {
      res.status(400).send({ error: "Validation Error", details: error.message });
    } else {
      res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
  }
});

  // Example: Authenticate user and generate a token
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '72h' });
            // Add the token to the user's sessions
            user.sessions.push({ token });
            await user.save();

            const sessionId = user.sessions[user.sessions.length - 1].sessionId; // Get the newly added session's ID
            res.send({ user, token,sessionId });
    } catch (error) {
        res.status(400).send({ error: 'Login failed' });
    }
});

  // Access user from req.user
router.get('/user/profile', authenticate, (req, res) => {
  res.send(req.user);
});

    // Remove the token used for the current session from the user's sessions array
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.sessions = req.user.sessions.filter(session => session.Id !== req.token);
    await req.user.save();
    res.send({ message: 'Logged out from the current session successfully' });
  } catch (error) {
    console.error("Error logging out from the session:", error);
    res.status(500).send({ error: 'Logout failed' });
  }
});

  // logout from all sessions
router.post('/logoutAll', authenticate, async (req, res) => {
  try {
    req.user.sessions = []; // Clear all sessions
    await req.user.save();
    res.send({ message: 'Logged out from all sessions' });
  } catch (error) {
    res.status(500).send({ error: 'Logout failed' });
  }
});


module.exports = router;
