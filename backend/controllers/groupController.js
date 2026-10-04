const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc Create group
// @route POST /api/groups
const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    let members = Array.isArray(memberIds) ? memberIds : JSON.parse(memberIds || '[]');

    if (!name) return res.status(400).json({ message: 'Group name is required' });

    const creatorId = req.user._id;
    if (!members.includes(creatorId.toString())) {
      members.push(creatorId.toString());
    }

    let avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const group = await Group.create({
      name,
      description: description || '',
      creator: creatorId,
      admins: [creatorId],
      members,
      avatar
    });

    const conversation = await Conversation.create({
      type: 'group',
      participants: members,
      group: group._id
    });

    group.conversation = conversation._id;
    await group.save();

    for (const mId of members) {
      await GroupMember.create({
        group: group._id,
        user: mId,
        role: mId === creatorId.toString() ? 'admin' : 'member'
      });
    }

    const populated = await Group.findById(group._id)
      .populate('members', 'name username avatar')
      .populate('admins', 'name username avatar')
      .populate('conversation');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Group Details (Admin Only)
// @route PUT /api/groups/:id
const updateGroupDetails = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isAdmin = group.admins.some(a => a.toString() === req.user._id.toString());
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only Group Admin can make changes to group info' });
    }

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (req.file) group.avatar = `/uploads/${req.file.filename}`;

    await group.save();

    const updated = await Group.findById(group._id)
      .populate('members', 'name username avatar')
      .populate('admins', 'name username avatar');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Set / Transfer Group Admin Role (Admin Only)
// @route PUT /api/groups/:id/admin
const setGroupAdmin = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isAdmin = group.admins.some(a => a.toString() === req.user._id.toString());
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only current Group Admin can change group admin role' });
    }

    if (!group.members.some(m => m.toString() === targetUserId)) {
      return res.status(400).json({ message: 'Target user must be a member of the group' });
    }

    // Set 1 primary admin
    group.admins = [targetUserId];
    await group.save();

    await GroupMember.updateMany({ group: group._id }, { role: 'member' });
    await GroupMember.findOneAndUpdate({ group: group._id, user: targetUserId }, { role: 'admin' });

    const updated = await Group.findById(group._id)
      .populate('members', 'name username avatar')
      .populate('admins', 'name username avatar');

    res.json({ message: 'Group admin role updated successfully', group: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add member to group (Admin Only)
// @route POST /api/groups/:id/members
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isAdmin = group.admins.some(a => a.toString() === req.user._id.toString());
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only Group Admin can add members' });
    }

    if (!group.members.some(m => m.toString() === userId)) {
      group.members.push(userId);
      await group.save();

      await GroupMember.create({ group: group._id, user: userId, role: 'member' });
      await Conversation.findByIdAndUpdate(group.conversation, { $addToSet: { participants: userId } });
    }

    const updated = await Group.findById(group._id)
      .populate('members', 'name username avatar')
      .populate('admins', 'name username avatar');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove member from group (Admin Only or Self Leave)
// @route DELETE /api/groups/:id/members/:userId
const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isAdmin = group.admins.some(a => a.toString() === req.user._id.toString());
    if (!isAdmin && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Only Group Admin can remove members' });
    }

    group.members = group.members.filter(m => m.toString() !== userId);
    group.admins = group.admins.filter(a => a.toString() !== userId);

    // If no admin left and members exist, assign first member as admin
    if (group.admins.length === 0 && group.members.length > 0) {
      group.admins.push(group.members[0]);
    }

    await group.save();

    await GroupMember.deleteOne({ group: group._id, user: userId });
    await Conversation.findByIdAndUpdate(group.conversation, { $pull: { participants: userId } });

    res.json({ message: 'Member removed from group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGroup, updateGroupDetails, setGroupAdmin, addMember, removeMember };
