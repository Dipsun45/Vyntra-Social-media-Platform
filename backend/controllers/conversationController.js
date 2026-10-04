const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc Get or create direct conversation with target user
// @route POST /api/conversations/direct
const getOrCreateDirectConversation = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    let conv = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [currentUserId, targetUserId] }
    }).populate('participants', 'name username avatar isVerified');

    if (!conv) {
      conv = await Conversation.create({
        type: 'direct',
        participants: [currentUserId, targetUserId]
      });
      conv = await Conversation.findById(conv._id).populate('participants', 'name username avatar isVerified');
    }

    res.json(conv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all conversations for current user
// @route GET /api/conversations
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name username avatar isVerified')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name username avatar' }
      })
      .populate('group')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrCreateDirectConversation, getUserConversations };
