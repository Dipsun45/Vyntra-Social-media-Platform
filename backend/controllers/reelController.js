const Reel = require('../models/Reel');
const Like = require('../models/Like');
const SavedPost = require('../models/SavedPost');
const Hashtag = require('../models/Hashtag');
const User = require('../models/User');

const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};

// @desc Create Reel (Photo or Video)
// @route POST /api/reels
const createReel = async (req, res) => {
  try {
    const { caption, music } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Photo or Video file is required for Reel' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const isImage = req.file.mimetype ? req.file.mimetype.startsWith('image/') : false;
    const hashtags = extractHashtags(caption);

    const defaultPosters = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'
    ];
    const randomPoster = defaultPosters[Math.floor(Math.random() * defaultPosters.length)];

    const reel = await Reel.create({
      author: req.user._id,
      videoUrl: fileUrl,
      thumbnailUrl: isImage ? fileUrl : randomPoster,
      caption: caption || '',
      hashtags,
      music: music || 'Original Audio'
    });

    for (const tag of hashtags) {
      await Hashtag.findOneAndUpdate(
        { name: tag },
        { $inc: { reelsCount: 1 } },
        { upsert: true, new: true }
      );
    }

    const populated = await Reel.findById(reel._id).populate('author', 'name username avatar isVerified');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Reels stream
// @route GET /api/reels
const getReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reels = await Reel.find({ isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const userId = req.user ? req.user._id : null;
    let likedSet = new Set();
    let savedSet = new Set();

    if (userId) {
      const reelIds = reels.map(r => r._id);
      const likes = await Like.find({ user: userId, targetId: { $in: reelIds }, targetType: 'Reel' });
      likedSet = new Set(likes.map(l => l.targetId.toString()));

      const saved = await SavedPost.find({ user: userId, reel: { $in: reelIds } });
      savedSet = new Set(saved.map(s => s.reel.toString()));
    }

    const formatted = reels.map(r => ({
      ...r.toObject(),
      isLiked: likedSet.has(r._id.toString()),
      isSaved: savedSet.has(r._id.toString())
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Like Reel
// @route POST /api/reels/:id/like
const toggleLikeReel = async (req, res) => {
  try {
    const reelId = req.params.id;
    const userId = req.user._id;

    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const existing = await Like.findOne({ user: userId, targetId: reelId, targetType: 'Reel' });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      reel.likesCount = Math.max(0, reel.likesCount - 1);
      await reel.save();
      res.json({ liked: false, likesCount: reel.likesCount });
    } else {
      await Like.create({ user: userId, targetId: reelId, targetType: 'Reel' });
      reel.likesCount += 1;
      await reel.save();
      res.json({ liked: true, likesCount: reel.likesCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Record view count on Reel
// @route POST /api/reels/:id/view
const recordReelView = async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } }, { new: true });
    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    res.json({ viewsCount: reel.viewsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReel, getReels, toggleLikeReel, recordReelView };
