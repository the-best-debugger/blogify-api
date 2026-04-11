const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());
// Parse cookies (needed for auth via HttpOnly cookies)
app.use(cookieParser());

// Middlewares
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

app.use(logger);

// 1. Import our new post router
const postRouter = require('./routes/posts.routes.js');
const userRouter = require('./routes/users.routes.js');

// Main welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Blogify API!');
});

// 2. Mount the router
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

// Error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });