const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage, reactToMessage } = require('../controllers/messageController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protectUser, upload.single('media'), sendMessage);
router.get('/:conversationId', protectUser, getMessages);
router.delete('/:id', protectUser, deleteMessage);
router.post('/:id/react', protectUser, reactToMessage);

module.exports = router;
