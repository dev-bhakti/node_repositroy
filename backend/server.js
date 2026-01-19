const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const appConfig = require('./config/app.config');
const db = require('./models');
const routes = require('./routes');

const app = express();

// Middleware code to not allowing website outside the server 
app.use(cors({
  origin: appConfig.corsOrigin,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);


// Middleware related Error handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: appConfig.nodeEnv === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database sync and server start
const PORT = appConfig.port;

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database is not connected:', err);
    process.exit(1);
  });

module.exports = app;

