const User = require('../models/User');
const Hashtag = require('../models/Hashtag');
const Post = require('../models/Post');
const Reel = require('../models/Reel');

// @desc Unified Search
// @route GET /api/search
const searchAll = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) {
      return res.json({ users: [], hashtags: [], posts: [], reels: [] });
    }

    const regex = new RegExp(q, 'i');

    const users = await User.find({
      $or: [{ name: regex }, { username: regex }],
      status: 'active'
    })
      .select('name username avatar isVerified bio followersCount')
      .limit(10);

    const hashtags = await Hashtag.find({ name: regex })
      .limit(10);

    const posts = await Post.find({
      caption: regex,
      isHidden: false
    })
      .populate('author', 'name username avatar isVerified')
      .limit(10);

    const reels = await Reel.find({
      caption: regex,
      isHidden: false
    })
      .populate('author', 'name username avatar isVerified')
      .limit(10);

    res.json({ users, hashtags, posts, reels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Hashtag detail page data
// @route GET /api/search/hashtag/:tag
const getHashtagDetail = async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase().replace('#', '');
    const hashtag = await Hashtag.findOne({ name: tag });

    const posts = await Post.find({ hashtags: tag, isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: -1 });

    const reels = await Reel.find({ hashtags: tag, isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: -1 });

    res.json({
      tag,
      postsCount: posts.length,
      reelsCount: reels.length,
      posts,
      reels,
      hashtag
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Explore content
// @route GET /api/search/explore
const getExploreContent = async (req, res) => {
  try {
    const trendingPosts = await Post.find({ isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(12);

    const popularReels = await Reel.find({ isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ viewsCount: -1, likesCount: -1 })
      .limit(8);

    const trendingHashtags = await Hashtag.find()
      .sort({ postsCount: -1 })
      .limit(10);

    const recommendedUsers = await User.find({ status: 'active' })
      .sort({ followersCount: -1 })
      .limit(6)
      .select('name username avatar isVerified bio followersCount');

    res.json({
      trendingPosts,
      popularReels,
      trendingHashtags,
      recommendedUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchAll, getHashtagDetail, getExploreContent };
