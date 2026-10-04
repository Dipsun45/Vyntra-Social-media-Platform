const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const bcrypt = require('bcryptjs');

// @desc Get user profile by username
// @route GET /api/users/profile/:username
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isFollowing = false;
    let isSelf = false;

    if (req.user) {
      isSelf = req.user._id.toString() === user._id.toString();
      const followExists = await Follow.findOne({ follower: req.user._id, following: user._id });
      isFollowing = !!followExists;
    }

    res.json({
      ...user.toObject(),
      isFollowing,
      isSelf
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, username, bio, location, website, phone, dateOfBirth, gender, isPrivate } = req.body;

    if (username && username.toLowerCase() !== user.username) {
      const exists = await User.findOne({ username: username.toLowerCase() });
      if (exists) return res.status(400).json({ message: 'Username already taken' });
      user.username = username.toLowerCase();
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (gender) user.gender = gender;
    if (isPrivate !== undefined) user.isPrivate = isPrivate;

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Change Password
// @route PUT /api/users/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get recommended/suggested users
// @route GET /api/users/suggested
const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const followingDoc = await Follow.find({ follower: currentUserId }).select('following');
    const followingIds = followingDoc.map(f => f.following.toString());
    followingIds.push(currentUserId.toString());

    const suggested = await User.find({ _id: { $nin: followingIds }, status: 'active' })
      .limit(10)
      .select('-password');

    res.json(suggested);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserByUsername, updateProfile, changePassword, getSuggestedUsers };
