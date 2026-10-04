const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

// @desc Send message
// @route POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, replyToId } = req.body;
    let mediaUrl = '';
    let mediaType = 'text';

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    if (!text && !mediaUrl) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text || '',
      mediaUrl,
      mediaType,
      replyTo: replyToId || null,
      readBy: [req.user._id]
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const populated = await Message.findById(message._id)
      .populate('sender', 'name username avatar')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name username' }
      });

    // Send notifications to other participants
    for (const participantId of conversation.participants) {
      if (participantId.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: participantId,
          sender: req.user._id,
          type: 'message',
          messageText: text ? text.substring(0, 40) : 'Sent a file'
        });
      }
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get messages in a conversation
// @route GET /api/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name username avatar')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name username' }
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete message
// @route DELETE /api/messages/:id
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await Message.deleteOne({ _id: message._id });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc React to message
// @route POST /api/messages/:id/react
const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    const userId = req.user._id;
    const existingIndex = message.reactions.findIndex(r => r.user.toString() === userId.toString());

    if (existingIndex > -1) {
      if (message.reactions[existingIndex].emoji === emoji) {
        message.reactions.splice(existingIndex, 1);
      } else {
        message.reactions[existingIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ user: userId, emoji });
    }

    await message.save();
    const updated = await Message.findById(message._id).populate('sender', 'name username avatar');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage, reactToMessage };
