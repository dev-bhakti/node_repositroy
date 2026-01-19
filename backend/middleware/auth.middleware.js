const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const db = require('../models');
const User = db.User;

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log(authHeader,'authHeader is ');
    
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Get the  token 
    const token = authHeader.split(' ')[1];

    // Verify token added in auth
    const decoded = jwt.verify(token, appConfig.jwt.secret);
    console.log(decoded,'decoded token');
    

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) { //When user entered ivalid token
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive.'
      });
    }

    console.log(req.user);
    
    // Attach user to request object
    req.user = user;
    console.log(req.user);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message
    });
  }
};

module.exports = authMiddleware;

