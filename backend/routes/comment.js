const express = require('express');
const {
  createComment,
  getComments,
  deleteComment
} = require('../controllers/commentControllers');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a comment (authenticated)
router.post('/', authenticateToken, createComment);

// Get all comments for a blog (public)
router.get('/:blogId', getComments);

// Delete a comment (authenticated)
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;