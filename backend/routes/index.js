const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const blogRoutes = require('./blog.routes');
const bookRoutes = require('./book.routes');

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/books', bookRoutes);
module.exports = router;

