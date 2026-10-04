const express = require('express');
const router = express.Router();
const { createReel, getReels, toggleLikeReel, recordReelView } = require('../controllers/reelController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protectUser, upload.single('video'), createReel);
router.get('/', protectUser, getReels);
router.post('/:id/like', protectUser, toggleLikeReel);
router.post('/:id/view', protectUser, recordReelView);

module.exports = router;
