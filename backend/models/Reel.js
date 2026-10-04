const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    caption: { type: String, default: '' },
    hashtags: [{ type: String, lowercase: true, index: true }],
    music: { type: String, default: 'Original Audio' },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reel', reelSchema);
