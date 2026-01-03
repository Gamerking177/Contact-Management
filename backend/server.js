const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db.config');
const contactRoutes = require('./routes/contact.route');

const app = express();

// Connect DB (cached)
connectDB();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://contact-management-rust.vercel.app'
  ],
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json());

// Routes
app.use('/api/contacts', contactRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ❌ DO NOT use app.listen on Vercel
module.exports = app;
