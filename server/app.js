// Environment configuration
require('dotenv').config();

// External dependencies
const express = require('express');
const mongoose = require('mongoose');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/topicRoutes');
const topicRoutes = require('./routes/topicRoutes');
const userRoutes = require('./routes/userRoutes');

// Application setup
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json

// Routes
app.use('/admin', adminRoutes);
app.use('/tests', testRoutes);
app.use('/topics', topicRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => { // Root route
  res.send('Hello World!');
});

// MongoDB connection and server startup
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected successfully to MongoDB Atlas');
    // Start the Express server inside the connection success callback
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if the database connection fails
  });
