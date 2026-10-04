const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', protectAdmin, getAnalyticsData);

module.exports = router;
