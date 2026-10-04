const Report = require('../models/Report');

// @desc Submit report
// @route POST /api/reports
const submitReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: 'Target type, target ID and reason are required' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      details: details || ''
    });

    res.status(201).json({ message: 'Report submitted successfully for admin review', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitReport };
