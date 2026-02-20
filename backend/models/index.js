const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database.config');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize( //creating postgres instance
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

// Imported models here
db.User = require('./user.model')(sequelize, Sequelize);
db.Blog = require('./blog.model')(sequelize, Sequelize);
db.Book = require('./book.model')(sequelize, Sequelize);

// Define associations with db
db.User.hasMany(db.Blog, { //single user create many blogs
  foreignKey: 'userId',
  as: 'blogs'
});

db.User.hasMany(db.Book, { //single user create many blogs
  foreignKey: 'userId',
  as: 'book'
});


db.Blog.belongsTo(db.User, { //To check blog created by which user
  foreignKey: 'userId',
  as: 'author'
});


// db.Book.belongsTo(db.User, { //To check blog created by which user
//   foreignKey: 'userid',
//   as: 'author'
// });

module.exports = db;

