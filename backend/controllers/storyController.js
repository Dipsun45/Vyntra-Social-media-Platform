const Story = require('../models/Story');
const User = require('../models/User');

// @desc Create story
// @route POST /api/stories
const createStory = async (req, res) => {
  try {
    const { textOverlay, sticker, music, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required for story' });
    }

    const mediaUrl = `/uploads/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    const story = await Story.create({
      author: req.user._id,
      mediaUrl,
      mediaType,
      textOverlay: textOverlay || '',
      sticker: sticker || '',
      music: music || '',
      location: location || '',
      expiresAt
    });

    const populatedStory = await Story.findById(story._id).populate('author', 'name username avatar');
    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get active stories grouped by user
// @route GET /api/stories
const getActiveStories = async (req, res) => {
  try {
    const now = new Date();
    const stories = await Story.find({ expiresAt: { $gt: now } })
      .populate('author', 'name username avatar isVerified')
      .sort({ createdAt: 1 });

    // Group stories by author
    const grouped = {};
    stories.forEach(story => {
      const authorId = story.author._id.toString();
      if (!grouped[authorId]) {
        grouped[authorId] = {
          user: story.author,
          stories: []
        };
      }
      const isViewed = story.views.some(v => v.toString() === req.user._id.toString());
      const isLiked = story.likes.some(l => l.toString() === req.user._id.toString());
      grouped[authorId].stories.push({
        ...story.toObject(),
        isViewed,
        isLiked
      });
    });

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Record view on story
// @route POST /api/stories/:id/view
const viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const userId = req.user._id;
    if (!story.views.includes(userId)) {
      story.views.push(userId);
      await story.save();
    }

    res.json({ message: 'Story view recorded', viewsCount: story.views.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Like story
// @route POST /api/stories/:id/like
const toggleLikeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const userId = req.user._id;
    const index = story.likes.indexOf(userId);

    if (index > -1) {
      story.likes.splice(index, 1);
      await story.save();
      return res.json({ liked: false });
    } else {
      story.likes.push(userId);
      await story.save();
      return res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get story viewers
// @route GET /api/stories/:id/viewers
const getStoryViewers = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('views', 'name username avatar');
    if (!story) return res.status(404).json({ message: 'Story not found' });

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only story owner can see viewers' });
    }

    res.json(story.views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStory, getActiveStories, viewStory, toggleLikeStory, getStoryViewers };
