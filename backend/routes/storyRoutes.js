const express = require('express');
const router = express.Router();
const { createStory, getActiveStories, viewStory, toggleLikeStory, getStoryViewers } = require('../controllers/storyController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protectUser, upload.single('media'), createStory);
router.get('/', protectUser, getActiveStories);
router.post('/:id/view', protectUser, viewStory);
router.post('/:id/like', protectUser, toggleLikeStory);
router.get('/:id/viewers', protectUser, getStoryViewers);

module.exports = router;
