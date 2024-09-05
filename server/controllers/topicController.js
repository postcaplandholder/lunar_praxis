// server/controllers/topicController.js
const Topic = require('../models/topic');

// Create a new topic
exports.createTopic = async (req, res) => {
  try {
    const { title, type, content, participants, parent, createdBy } = req.body;
    const newTopic = new Topic({ title, type, content, participants, parent, createdBy });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: "Error creating topic", error: error.message });
  }
};

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('createdBy').populate('participants');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching topics", error: error.message });
  }
};

// Get a topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('createdBy').populate('participants');
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Error fetching topic", error: error.message });
  }
};

// Update a topic
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: "Error updating topic", error: error.message });
  }
};

// Delete a topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting topic", error: error.message });
  }
};
