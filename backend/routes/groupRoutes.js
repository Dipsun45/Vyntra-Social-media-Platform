const express = require('express');
const router = express.Router();
const { createGroup, updateGroupDetails, setGroupAdmin, addMember, removeMember } = require('../controllers/groupController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protectUser, upload.single('avatar'), createGroup);
router.put('/:id', protectUser, upload.single('avatar'), updateGroupDetails);
router.put('/:id/admin', protectUser, setGroupAdmin);
router.post('/:id/members', protectUser, addMember);
router.delete('/:id/members/:userId', protectUser, removeMember);

module.exports = router;
