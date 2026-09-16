const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Load variables first!


const connectDB = require('./config/db.js');
const multer = require('multer'); // Added to intercept specific upload errors

const authRoutes = require('./routes/authRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: Removed the local '/uploads' static route since we use Cloudinary now

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Global Error Handler for Multer/System Exceptions
app.use((err, req, res, next) => {
  // 1. Catch Multer upload errors (e.g., file too large)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File size exceeds the 2 MB limit.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  } 
  
  // 2. Catch custom file filter errors (e.g., wrong file type) or generic errors
  return res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server executing live on port ${PORT}`));
}

module.exports = app;