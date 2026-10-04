const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    images: [{ type: String }],
    video: { type: String, default: '' },
    caption: { type: String, default: '' },
    hashtags: [{ type: String, lowercase: true, index: true }],
    location: { type: String, default: '' },
    privacy: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    musicTrack: { type: String, default: '' },
    isHidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
