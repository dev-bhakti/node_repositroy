const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const db = require('../models');
const User = db.User;

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate  the input entered at time of registration
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.'
      });
    }

    // Check if user already exists in db
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists.'
      });
    }

    // Create new user and add it in db
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName
    });

    // Generate jsonwebtoken
    const token = jwt.sign(
      { id: user.id, email: user.email },
      appConfig.jwt.secret,
      { expiresIn: appConfig.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user.',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      appConfig.jwt.secret,
      { expiresIn: appConfig.jwt.expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in.',
      error: error.message
    });
  }
};

