const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database.config');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: config.pool,
    logging: config.logging
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Blog = require('./blog.model')(sequelize, Sequelize);

// Define associations
db.User.hasMany(db.Blog, {
  foreignKey: 'userId',
  as: 'blogs'
});

db.Blog.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'author'
});

module.exports = db;

