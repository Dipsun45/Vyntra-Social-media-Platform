const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protectUser } = require('../middleware/authMiddleware');

router.get('/', protectUser, getNotifications);
router.put('/read', protectUser, markAsRead);

module.exports = router;
