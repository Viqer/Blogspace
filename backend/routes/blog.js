const express = require('express');
const {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog
} = require('../controllers/blogControllers');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Only authenticated users can create or delete blogs
router.post('/', authenticateToken, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.delete('/:id', authenticateToken, deleteBlog);

module.exports = router;