const express = require('express');
const router = express.Router();
const { searchAll, getHashtagDetail, getExploreContent } = require('../controllers/searchController');
const { protectUser } = require('../middleware/authMiddleware');

router.get('/', protectUser, searchAll);
router.get('/explore', protectUser, getExploreContent);
router.get('/hashtag/:tag', protectUser, getHashtagDetail);

module.exports = router;
