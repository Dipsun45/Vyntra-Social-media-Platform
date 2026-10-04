const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Vyntra' },
    logo: { type: String, default: '' },
    description: { type: String, default: 'Connect. Create. Share.' },
    maintenanceMode: { type: Boolean, default: false },
    registrationEnabled: { type: Boolean, default: true },
    commentSystemEnabled: { type: Boolean, default: true },
    verificationAutoApprove: { type: Boolean, default: false },
    adminEmail: { type: String, default: 'admin@gmail.com' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
