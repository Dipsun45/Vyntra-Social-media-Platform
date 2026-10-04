const express = require('express');
const router = express.Router();
const { submitReport } = require('../controllers/reportController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/', protectUser, submitReport);

module.exports = router;
