import express from 'express';
import { getDb, saveDb } from '../db.js';

const router = express.Router();

// Generate & send OTP
router.post('/send-otp', (req, res) => {
  const { channel, target } = req.body;
  const db = getDb();
  
  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  db.activeOtpStore = db.activeOtpStore || {};
  db.activeOtpStore[target || 'default'] = {
    code: otpCode,
    expiresAt,
    channel: channel || 'SMS'
  };

  saveDb(db);

  return res.json({
    success: true,
    message: `OTP sent successfully to ${target || 'your registered mobile/email'} via ${channel || 'SMS'}`,
    debugOtp: otpCode, // Provided for easy simulation testing
    expiresInSeconds: 300
  });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { code, target } = req.body;
  const db = getDb();

  const record = db.activeOtpStore ? db.activeOtpStore[target || 'default'] : null;

  // Master bypass code '123456' or exact code check
  if (code === '123456' || (record && record.code === code && record.expiresAt > Date.now())) {
    if (record) {
      delete db.activeOtpStore[target || 'default'];
      saveDb(db);
    }

    return res.json({
      success: true,
      verified: true,
      message: "OTP verification successful"
    });
  }

  return res.status(400).json({
    success: false,
    verified: false,
    message: "Invalid or expired OTP code. (Hint: Use '123456' or the code sent to your notification log)"
  });
});

export default router;
