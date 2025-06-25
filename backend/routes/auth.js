const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev_secret_key';

// LOGIN: username + password, then send 2FA code to email
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: 'Invalid username or password.' });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ message: 'Invalid username or password.' });

  // Generate JWT token
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Login successful (2FA disabled).', user: { username: user.username, email: user.email }, token });
});

// REGISTER: username, email, password, then send 2FA code
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ message: 'All fields required.' });

  const exists = await User.findOne({ $or: [{ username }, { email }] });

  if (exists) return res.status(409).json({ message: 'Username or email already exists.' });

  const hash = await bcrypt.hash(password, 10);
  req.body.password = hash;
  // 2FA DISABLED: Directly register
  const user = await User.create({ username, email, password: hash });
  // Generate JWT token
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Registration successful (2FA disabled).', user: { username: user.username, email: user.email }, token });
});

// VERIFY 2FA: email + code (DISABLED)
router.post('/verify-2fa', (req, res) => {
  res.status(200).json({ message: '2FA is currently disabled.' });
});

module.exports = router;
