const db = require('../models');
const Blog = db.Blog;
const User = db.User;

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit; //data returned before returning result for the user

    const whereClause = {}; //dynamic object to filter particular blog
    
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'published'; // By Default it shows published blogs
    }

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { title: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { content: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { summary: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Blog.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        blogs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs.',
      error: error.message
    });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }]
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        blog
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog.',
      error: error.message
    });
  }
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, summary, status, tags } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.'
      });
    }

    // Generate slug  which shows the readable url eg./blog/15
    let slug = generateSlug(title);
    let slugExists = await Blog.findOne({ where: { slug } });
    let counter = 1;
    
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await Blog.findOne({ where: { slug } });
      counter++;
    }

    // Create blog
    const blog = await Blog.create({
      title,
      content,
      summary,
      slug,
      userId,
      status: status || 'draft',
      tags: tags || [],
      publishedAt: status === 'published' ? new Date() : null
    });

    // Fetch blog with author details
    const createdBlog = await Blog.findByPk(blog.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully.',
      data: {
        blog: createdBlog
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog.',
      error: error.message
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, status, tags } = req.body;
    const userId = req.user.id;

    // Find blog
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Check if user is the author
    if (blog.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this blog.'
      });
    }

    // Update slug if title changed
    let slug = blog.slug;
    if (title && title !== blog.title) {
      slug = generateSlug(title);
      let slugExists = await Blog.findOne({ 
        where: { 
          slug,
          id: { [db.Sequelize.Op.ne]: id }
        } 
      });
      let counter = 1;
      
      while (slugExists) {
        slug = `${generateSlug(title)}-${counter}`;
        slugExists = await Blog.findOne({ 
          where: { 
            slug,
            id: { [db.Sequelize.Op.ne]: id }
          } 
        });
        counter++;
      }
    }

    // Update blog
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (status) {
      updateData.status = status;
      if (status === 'published' && !blog.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (tags) updateData.tags = tags;
    if (slug !== blog.slug) updateData.slug = slug;

    await blog.update(updateData);

    // Fetch updated blog with author details
    const updatedBlog = await Blog.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully.',
      data: {
        blog: updatedBlog
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog.',
      error: error.message
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find blog
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found.'
      });
    }

    // Check if user is the author
    if (blog.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this blog.'
      });
    }

    // Delete blog
    await blog.destroy();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog.',
      error: error.message
    });
  }
};

// Get user's blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId };
    
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Blog.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        blogs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user blogs.',
      error: error.message
    });
  }
};

