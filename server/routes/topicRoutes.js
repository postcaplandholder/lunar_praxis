// server/routes/topicRoutes.js
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Routes
router.post('/topics', topicController.createTopic);
router.get('/topics', topicController.getAllTopics);
router.get('/topics/:id', topicController.getTopicById);
router.put('/topics/:id', topicController.updateTopic);
router.delete('/topics/:id', topicController.deleteTopic);

module.exports = router;
