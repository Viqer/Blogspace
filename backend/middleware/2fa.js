const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory store for 2FA codes (for demo; use Redis or DB in production)
const twoFACodes = {};

// Configure your transporter (update with your SMTP credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to send 2FA code
async function send2FA(req, res, next) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required for 2FA.' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  twoFACodes[email] = { code, expires: Date.now() + 10 * 60 * 1000 };
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Blogspace 2FA Code',
      text: `Your verification code is: ${code}`,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: 'Failed to send 2FA email.' });
  }
}

// Middleware to verify 2FA code
function verify2FA(req, res, next) {
  const { email, code } = req.body;
  const entry = twoFACodes[email];
  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(401).json({ message: 'Invalid or expired 2FA code.' });
  }
  delete twoFACodes[email];
  next();
}

module.exports = { send2FA, verify2FA };
