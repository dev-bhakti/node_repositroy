require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'blog_platform',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234567890',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: console.log
  }
};

