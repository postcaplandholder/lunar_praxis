// server/models/topic.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // Remove enum restriction for flexibility
  content: { type: String }, 
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

topicSchema.virtual('subtopics', {
  ref: 'Topic',
  localField: '_id',
  foreignField: 'parent'
});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
