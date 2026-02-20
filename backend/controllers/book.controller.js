const db = require('../models');
const Book = db.Book;
const User = db.User;


// Get all blogs
exports.getAllBook = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit; //data returned before returning result for the user

    const whereClause = {}; //dynamic object to filter particular book
    
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'published'; // By Default it shows published book
    }

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { title: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { content: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { summary: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdat', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        book: rows,
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
      message: 'Error fetching books.',
      error: error.message
    });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book.',
      error: error.message
    });
  }
};

// Create new book
exports.createBook = async (req, res) => {
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

    // Generate slug  which shows the readable url eg./book/15
    let slug = generateSlug(title);
    let slugExists = await Book.findOne({ where: { slug } });
    let counter = 1;
    
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await Book.findOne({ where: { slug } });
      counter++;
    }

    // Create book
    const book = await Book.create({
      title,
      // content,
      summary,
      // slug,
      userId,
      status: status || 'draft',
      tags: tags || [],
      publishedat: status === 'published' ? new Date() : null
    });

    // Fetch book with author details
    const createdBook = await Blog.findByPk(book.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully.',
      data: {
        book: createdBook
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book.',
      error: error.message
    });
  }
};

// Update book
// exports.updateBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, summary, status, tags } = req.body;
//     const userid = req.user.id;

//     // Find book
//     const book = await Book.findByPk(id);

//     if (!book) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found.'
//       });
//     }

//     // Check if user is the author
//     if (book.userid !== userid) {
//       return res.status(403).json({
//         success: false,
//         message: 'You are not authorized to update this book.'
//       });
//     }


//     // Update book
//     const updateData = {};
//     if (title) updateData.title = title;
//     // if (content) updateData.content = content;
//     if (summary !== undefined) updateData.summary = summary;
//     if (status) {
//       updateData.status = status;
//       if (status === 'published' && !book.publishedat) {
//         updateData.publishedat = new Date();
//       }
//     }
//     if (tags) updateData.tags = tags;
//     // if (slug !== book.slug) updateData.slug = slug;

//     await book.update(updateData);

//     // Fetch updated book with author details
//     const updatedBook = await Book.findByPk(id, {
//       include: [{
//         model: User,
//         as: 'author',
//         attributes: ['id', 'username', 'email', 'firstName', 'lastName']
//       }]
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Book updated successfully.',
//       data: {
//         book: updatedBook
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating book.',
//       error: error.message
//     });
//   }
// };

// Delete book
// exports.deleteBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userid = req.user.id;

//     // Find book
//     const book = await Book.findByPk(id);

//     if (!book) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found.'
//       });
//     }

//     // Check if user is the author
//     if (book.userid !== userid) {
//       return res.status(403).json({
//         success: false,
//         message: 'You are not authorized to delete this book.'
//       });
//     }

//     // Delete book
//     await book.destroy();

//     res.status(200).json({
//       success: true,
//       message: 'Book deleted successfully.'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting book.',
//       error: error.message
//     });
//   }
// };

// Get user's book
// exports.getUserBook = async (req, res) => {
//   try {
//     const userid = req.user.id;
//     const { page = 1, limit = 10, status } = req.query;
//     const offset = (page - 1) * limit;

//     const whereClause = { userid };
    
//     if (status) {
//       whereClause.status = status;
//     }

//     const { count, rows } = await Book.findAndCountAll({
//       where: whereClause,
//       include: [{
//         model: User,
//         as: 'author',
//         attributes: ['id', 'username', 'email', 'firstName', 'lastName']
//       }],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order: [['createdat', 'DESC']]
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         book: rows,
//         pagination: {
//           total: count,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(count / limit)
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user books.',
//       error: error.message
//     });
//   }
// };

