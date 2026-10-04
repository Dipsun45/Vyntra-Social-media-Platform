const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const Story = require('../models/Story');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Message = require('../models/Message');
const Report = require('../models/Report');
const Settings = require('../models/Settings');
const generateToken = require('../utils/generateToken');

// @desc Admin Login
// @route POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Fallback check in User model if user is marked as admin
      const userAdmin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
      if (userAdmin && (await bcrypt.compare(password, userAdmin.password))) {
        return res.json({
          _id: userAdmin._id,
          name: userAdmin.name,
          email: userAdmin.email,
          role: 'admin',
          token: generateToken(userAdmin._id, 'admin')
        });
      }
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Dashboard Overview Stats
// @route GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalPosts = await Post.countDocuments();
    const totalReels = await Reel.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      activeUsers,
      totalPosts,
      totalReels,
      totalStories,
      totalComments,
      totalLikes,
      totalMessages,
      totalReports,
      pendingReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Users List (Admin)
// @route GET /api/admin/users
const getAllUsersAdmin = async (req, res) => {
  try {
    const { search, status, role } = req.query;
    const filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { username: regex }, { email: regex }];
    }
    if (status) filter.status = status;
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle User Block Status
// @route PUT /api/admin/users/:id/block
const toggleBlockUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();

    res.json({ message: `User status changed to ${user.status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Verification Badge
// @route PUT /api/admin/users/:id/verify
const toggleVerifyUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ message: `User verification updated to ${user.isVerified}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete User
// @route DELETE /api/admin/users/:id
const deleteUserAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.deleteOne({ _id: userId });
    await Post.deleteMany({ author: userId });
    await Reel.deleteMany({ author: userId });
    await Story.deleteMany({ author: userId });
    await Comment.deleteMany({ author: userId });
    await Like.deleteMany({ user: userId });

    res.json({ message: 'User and all associated content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Manage Posts (Admin)
// @route GET /api/admin/posts
const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name username email avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Hide/Restore Post (Admin)
// @route PUT /api/admin/posts/:id/toggle-hide
const toggleHidePostAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.isHidden = !post.isHidden;
    await post.save();

    res.json({ message: `Post isHidden set to ${post.isHidden}`, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Post (Admin)
// @route DELETE /api/admin/posts/:id
const deletePostAdmin = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    await Comment.deleteMany({ post: req.params.id });
    res.json({ message: 'Post permanently removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Manage Reels (Admin)
// @route GET /api/admin/reels
const getAllReelsAdmin = async (req, res) => {
  try {
    const reels = await Reel.find().populate('author', 'name username avatar').sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Reel (Admin)
// @route DELETE /api/admin/reels/:id
const deleteReelAdmin = async (req, res) => {
  try {
    await Reel.deleteOne({ _id: req.params.id });
    res.json({ message: 'Reel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Manage Stories (Admin)
// @route GET /api/admin/stories
const getAllStoriesAdmin = async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'name username avatar').sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Story (Admin)
// @route DELETE /api/admin/stories/:id
const deleteStoryAdmin = async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id });
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Manage Reports (Admin)
// @route GET /api/admin/reports
const getReportsAdmin = async (req, res) => {
  try {
    const reports = await Report.find().populate('reporter', 'name username avatar email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Report Status
// @route PUT /api/admin/reports/:id
const updateReportStatusAdmin = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (status) report.status = status;
    if (notes) report.notes = notes;
    await report.save();

    res.json({ message: `Report status updated to ${report.status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Settings
// @route GET /api/admin/settings
const getSettingsAdmin = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Settings
// @route PUT /api/admin/settings
const updateSettingsAdmin = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    const { siteName, description, maintenanceMode, registrationEnabled, commentSystemEnabled, adminEmail, newPassword } = req.body;

    if (siteName) settings.siteName = siteName;
    if (description !== undefined) settings.description = description;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (registrationEnabled !== undefined) settings.registrationEnabled = registrationEnabled;
    if (commentSystemEnabled !== undefined) settings.commentSystemEnabled = commentSystemEnabled;
    if (adminEmail) settings.adminEmail = adminEmail;

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await Admin.findOneAndUpdate({}, { password: hashedPassword, email: adminEmail || settings.adminEmail }, { upsert: true });
    }

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
