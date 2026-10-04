const express = require('express');
const router = express.Router();
const { getUserByUsername, updateProfile, changePassword, getSuggestedUsers } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile/:username', protectUser, getUserByUsername);
router.put('/profile', protectUser, upload.single('avatar'), updateProfile);
router.put('/change-password', protectUser, changePassword);
router.get('/suggested', protectUser, getSuggestedUsers);

module.exports = router;
