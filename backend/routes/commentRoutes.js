const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment, toggleLikeComment } = require('../controllers/commentController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/', protectUser, addComment);
router.get('/', protectUser, getComments);
router.delete('/:id', protectUser, deleteComment);
router.post('/:id/like', protectUser, toggleLikeComment);

module.exports = router;
