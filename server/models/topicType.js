// server/models/topicType.js

const mongoose = require('mongoose');

const topicTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // This is the unique identifier, e.g., 'Message'
  title: { type: String, required: true } // This is the human-readable title, e.g., 'Conversations'
});

const TopicType = mongoose.model('TopicType', topicTypeSchema);
module.exports = TopicType;
