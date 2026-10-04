const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const Notification = require('../models/Notification');

// @desc Add comment to Post or Reel
// @route POST /api/comments
const addComment = async (req, res) => {
  try {
    const { postId, reelId, text, parentCommentId } = req.body;

    if (!text || (!postId && !reelId)) {
      return res.status(400).json({ message: 'Comment text and target Post/Reel ID required' });
    }

    const comment = await Comment.create({
      post: postId || undefined,
      reel: reelId || undefined,
      author: req.user._id,
      text,
      parentComment: parentCommentId || null
    });

    if (postId) {
      const post = await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
      if (post && post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'comment',
          post: postId,
          messageText: text.substring(0, 50)
        });
      }
    }

    if (reelId) {
      await Reel.findByIdAndUpdate(reelId, { $inc: { commentsCount: 1 } });
    }

    const populated = await Comment.findById(comment._id).populate('author', 'name username avatar isVerified');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get comments for Post or Reel
// @route GET /api/comments
const getComments = async (req, res) => {
  try {
    const { postId, reelId } = req.query;
    const filter = { isHidden: false };
    if (postId) filter.post = postId;
    if (reelId) filter.reel = reelId;

    const comments = await Comment.find(filter)
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete comment
// @route DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    if (comment.post) {
      await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    }
    if (comment.reel) {
      await Reel.findByIdAndUpdate(comment.reel, { $inc: { commentsCount: -1 } });
    }

    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Like Comment
// @route POST /api/comments/:id/like
const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const userId = req.user._id;
    const index = comment.likes.indexOf(userId);

    if (index > -1) {
      comment.likes.splice(index, 1);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      comment.likes.push(userId);
      comment.likesCount += 1;
    }

    await comment.save();
    res.json({ liked: index === -1, likesCount: comment.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment, toggleLikeComment };
