const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['User', 'Post', 'Reel', 'Comment', 'Message'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: {
      type: String,
      enum: ['Spam', 'Harassment', 'Hate speech', 'Violence', 'Nudity', 'Fake account', 'Scam', 'Other'],
      default: 'Spam'
    },
    details: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'rejected'], default: 'pending' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
