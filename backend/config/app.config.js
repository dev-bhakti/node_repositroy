require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  jwt: {
    secret: process.env.JWT_SECRET || 'qwertyuiop',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};

