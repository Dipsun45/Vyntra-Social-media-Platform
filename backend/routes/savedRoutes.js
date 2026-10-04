const express = require('express');
const router = express.Router();
const { getSavedContent, createCollection, deleteCollection } = require('../controllers/savedController');
const { protectUser } = require('../middleware/authMiddleware');

router.get('/', protectUser, getSavedContent);
router.post('/collections', protectUser, createCollection);
router.delete('/collections/:id', protectUser, deleteCollection);

module.exports = router;
