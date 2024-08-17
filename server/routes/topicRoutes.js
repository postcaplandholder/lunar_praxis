// server/routes/topicRoutes.js
const express = require('express');
const router = express.Router();
const Topic = require('../models/topic');

// POST /topics/start a new topic
router.post('/topics', async (req, res) => {
    try {
      const { title, type, content, participants, parent, createdBy } = req.body;
      const newTopic = new Topic({ title, type, content, participants, parent, createdBy });
      await newTopic.save();
      res.status(201).json(newTopic);
    } catch (error) {
      res.status(400).json({ message: "Error creating topic", error: error.message });
    }
  });
  

module.exports = router;
