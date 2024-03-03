// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

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

module.exports = router;
