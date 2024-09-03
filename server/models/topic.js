// models/topic.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Message', 'Support', 'Proposal', 'Financial'] },
  content: { type: String, required: false }, // Optional content, e.g., for initial message or proposal description
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Relevant for Conversation type
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null }, // Parent topic for nested structure
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subtopics
topicSchema.virtual('subtopics', {
  ref: 'Topic',
  localField: '_id',
  foreignField: 'parent'
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
