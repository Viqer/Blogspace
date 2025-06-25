const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userControllers');
const router = express.Router();


const { authenticateToken } = require('../middleware/auth'); // Import the auth middleware
const { encryptUserPassword } = require('../middleware/encrypt');

// Middleware to block non-frontend requests
function frontendOnly(req, res, next) {
  // If user is admin, skip the X-Requested-By check
  if (req.user && req.user.isAdmin) {
    return next();
  }
  if (req.get('X-Requested-By') !== 'frontend') {
    return res.status(403).json({ error: 'Access denied: Only frontend allowed.' });
  }
  next();
}

// Apply the auth middleware before frontendOnly so req.user is set
router.post('/', encryptUserPassword, createUser);
router.use(authenticateToken);
router.use(frontendOnly);

router.get('/', getUsers);

// Add a route for /me to get and update the current user's profile
router.get('/me', async (req, res) => {
  try {
    const user = await require('../models/Users').findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', encryptUserPassword, async (req, res) => {
  try {
    const updatedUser = await require('../models/Users').findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;