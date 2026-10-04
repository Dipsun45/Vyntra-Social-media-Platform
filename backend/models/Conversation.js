const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    unreadCounts: { type: Map, of: Number, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
