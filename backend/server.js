const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.config');
const contactRoutes = require('./routes/contact.route');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json());

//Routes
app.use('/api/contacts', contactRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});