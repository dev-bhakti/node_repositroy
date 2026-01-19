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
      max: 5, //number of max connections
      min: 0, // when not in use keep connection 0 
      acquire: 30000, //request for connection time 30s
      idle: 10000 //unused connection for 10s
    },
    logging: console.log
  }
};

