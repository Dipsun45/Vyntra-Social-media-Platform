const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel' },
    collectionName: { type: String, default: 'All Posts' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedPost', savedPostSchema);
