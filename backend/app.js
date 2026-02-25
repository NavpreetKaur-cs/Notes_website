const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoute');
const noteRoutes = require('./routes/noteRoute');

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Notes API is running!');
});
module.exports = app;