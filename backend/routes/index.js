const express = require('express');
const routes = express.Router();

const blogRoutes = require('./blog');
const commentRoutes = require('./comment');
const userRoutes = require('./user');
const authRoutes = require('./auth');

routes.use('/blogs', blogRoutes);
routes.use('/comments', commentRoutes);
routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);

// 404 handler for unmatched API routes
routes.use((req, res, next) => {
  res.status(404).json({ error: 'Request not found' });
});

// Error handling middleware for 500 and 505
routes.use((err, req, res, next) => {
  if (err.status === 505) {
    res.status(505).json({ error: 'HTTP Version Not Supported' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = routes;