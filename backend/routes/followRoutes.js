const express = require('express');
const router = express.Router();
const { toggleFollowUser, getFollowers, getFollowing } = require('../controllers/followController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/:userId', protectUser, toggleFollowUser);
router.get('/:userId/followers', protectUser, getFollowers);
router.get('/:userId/following', protectUser, getFollowing);

module.exports = router;
