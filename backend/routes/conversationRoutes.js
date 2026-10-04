const express = require('express');
const router = express.Router();
const { getOrCreateDirectConversation, getUserConversations } = require('../controllers/conversationController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/direct', protectUser, getOrCreateDirectConversation);
router.get('/', protectUser, getUserConversations);

module.exports = router;
