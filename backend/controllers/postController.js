const Post = require('../models/Post');
const Like = require('../models/Like');
const SavedPost = require('../models/SavedPost');
const Hashtag = require('../models/Hashtag');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to extract hashtags
const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};

// @desc Create a post
// @route POST /api/posts
const createPost = async (req, res) => {
  try {
    const { caption, location, privacy, musicTrack } = req.body;
    let images = [];
    let video = '';

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fileUrl = `/uploads/${file.filename}`;
        if (file.mimetype.startsWith('video/')) {
          video = fileUrl;
        } else {
          images.push(fileUrl);
        }
      });
    }

    if (images.length === 0 && !video && !caption) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    const hashtags = extractHashtags(caption);

    const post = await Post.create({
      author: req.user._id,
      images,
      video,
      caption: caption || '',
      hashtags,
      location: location || '',
      privacy: privacy || 'public',
      musicTrack: musicTrack || ''
    });

    // Update Hashtag collection counts
    for (const tag of hashtags) {
      await Hashtag.findOneAndUpdate(
        { name: tag },
        { $inc: { postsCount: 1 } },
        { upsert: true, new: true }
      );
    }

    // Increment user posts count
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

    const populatedPost = await Post.findById(post._id).populate('author', 'name username avatar isVerified');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Home Feed Posts
// @route GET /api/posts/feed
const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Attach current user's like & saved state
    const userId = req.user._id;
    const postIds = posts.map(p => p._id);

    const userLikes = await Like.find({ user: userId, targetId: { $in: postIds }, targetType: 'Post' });
    const likedPostIds = new Set(userLikes.map(l => l.targetId.toString()));

    const userSaved = await SavedPost.find({ user: userId, post: { $in: postIds } });
    const savedPostIds = new Set(userSaved.map(s => s.post.toString()));

    const formattedPosts = posts.map(post => ({
      ...post.toObject(),
      isLiked: likedPostIds.has(post._id.toString()),
      isSaved: savedPostIds.has(post._id.toString())
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Post by ID
// @route GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name username avatar isVerified');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Increment view count
    post.viewsCount += 1;
    await post.save();

    const isLiked = req.user ? !!(await Like.findOne({ user: req.user._id, targetId: post._id, targetType: 'Post' })) : false;
    const isSaved = req.user ? !!(await SavedPost.findOne({ user: req.user._id, post: post._id })) : false;

    res.json({
      ...post.toObject(),
      isLiked,
      isSaved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get User Posts
// @route GET /api/posts/user/:username
const getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id, isHidden: false })
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: -1 });

    const userId = req.user ? req.user._id : null;
    let likedPostIds = new Set();
    let savedPostIds = new Set();

    if (userId) {
      const postIds = posts.map(p => p._id);
      const likes = await Like.find({ user: userId, targetId: { $in: postIds }, targetType: 'Post' });
      likedPostIds = new Set(likes.map(l => l.targetId.toString()));

      const saved = await SavedPost.find({ user: userId, post: { $in: postIds } });
      savedPostIds = new Set(saved.map(s => s.post.toString()));
    }

    const formatted = posts.map(p => ({
      ...p.toObject(),
      isLiked: likedPostIds.has(p._id.toString()),
      isSaved: savedPostIds.has(p._id.toString())
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Like Post
// @route POST /api/posts/:id/like
const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingLike = await Like.findOne({ user: userId, targetId: postId, targetType: 'Post' });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
      res.json({ liked: false, likesCount: post.likesCount });
    } else {
      await Like.create({ user: userId, targetId: postId, targetType: 'Post' });
      post.likesCount += 1;
      await post.save();

      // Create notification if not self-like
      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'like',
          post: post._id
        });
      }

      res.json({ liked: true, likesCount: post.likesCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Save Post
// @route POST /api/posts/:id/save
const toggleSavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const existing = await SavedPost.findOne({ user: userId, post: postId });

    if (existing) {
      await SavedPost.deleteOne({ _id: existing._id });
      res.json({ saved: false, message: 'Removed from saved posts' });
    } else {
      await SavedPost.create({ user: userId, post: postId, collectionName: 'All Posts' });
      res.json({ saved: true, message: 'Saved to collection' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Post
// @route DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: post._id });
    await User.findByIdAndUpdate(post.author, { $inc: { postsCount: -1 } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getPostById,
  getUserPosts,
  toggleLikePost,
  toggleSavePost,
  deletePost
};
