const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
// Load env vars
dotenv.config();
connectDB();

const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.send("Inventory Backend is Live 🚀");
});

// Routes
app.use('/api/', require('./routes/indexRoute'))

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
