const Follow = require('../models/Follow');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc Toggle Follow / Unfollow
// @route POST /api/follows/:userId
const toggleFollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });

      return res.json({ following: false, message: `Unfollowed ${targetUser.username}` });
    } else {
      await Follow.create({ follower: currentUserId, following: targetUserId, status: 'accepted' });
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } });

      // Send notification
      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow'
      });

      return res.json({ following: true, message: `Followed ${targetUser.username}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Followers list
// @route GET /api/follows/:userId/followers
const getFollowers = async (req, res) => {
  try {
    const follows = await Follow.find({ following: req.params.userId }).populate('follower', 'name username avatar bio isVerified');
    const followers = follows.map(f => f.follower);
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Following list
// @route GET /api/follows/:userId/following
const getFollowing = async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.params.userId }).populate('following', 'name username avatar bio isVerified');
    const following = follows.map(f => f.following);
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleFollowUser, getFollowers, getFollowing };
