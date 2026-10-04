const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getDashboardStats,
  getAllUsersAdmin,
  toggleBlockUserAdmin,
  toggleVerifyUserAdmin,
  deleteUserAdmin,
  getAllPostsAdmin,
  toggleHidePostAdmin,
  deletePostAdmin,
  getAllReelsAdmin,
  deleteReelAdmin,
  getAllStoriesAdmin,
  deleteStoryAdmin,
  getReportsAdmin,
  updateReportStatusAdmin,
  getSettingsAdmin,
  updateSettingsAdmin
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/users', protectAdmin, getAllUsersAdmin);
router.put('/users/:id/block', protectAdmin, toggleBlockUserAdmin);
router.put('/users/:id/verify', protectAdmin, toggleVerifyUserAdmin);
router.delete('/users/:id', protectAdmin, deleteUserAdmin);
router.get('/posts', protectAdmin, getAllPostsAdmin);
router.put('/posts/:id/toggle-hide', protectAdmin, toggleHidePostAdmin);
router.delete('/posts/:id', protectAdmin, deletePostAdmin);
router.get('/reels', protectAdmin, getAllReelsAdmin);
router.delete('/reels/:id', protectAdmin, deleteReelAdmin);
router.get('/stories', protectAdmin, getAllStoriesAdmin);
router.delete('/stories/:id', protectAdmin, deleteStoryAdmin);
router.get('/reports', protectAdmin, getReportsAdmin);
router.put('/reports/:id', protectAdmin, updateReportStatusAdmin);
router.get('/settings', protectAdmin, getSettingsAdmin);
router.put('/settings', protectAdmin, updateSettingsAdmin);

module.exports = router;
