const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeedPosts,
  getPostById,
  getUserPosts,
  toggleLikePost,
  toggleSavePost,
  deletePost
} = require('../controllers/postController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protectUser, upload.array('files', 10), createPost);
router.get('/feed', protectUser, getFeedPosts);
router.get('/user/:username', protectUser, getUserPosts);
router.get('/:id', protectUser, getPostById);
router.post('/:id/like', protectUser, toggleLikePost);
router.post('/:id/save', protectUser, toggleSavePost);
router.delete('/:id', protectUser, deletePost);

module.exports = router;
