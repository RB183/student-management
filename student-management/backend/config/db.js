const mongoose = require('mongoose');
const AdminModel = require('../models/Admin.js'); // Renamed to AdminModel to completely avoid conflicts

const connectDB = async () => {
  try {
    // Print connection debug status
    console.log("DEBUG: Current MONGO_URI value is ->", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from process.env!");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Use AdminModel safely without variable scope overriding conflicts
    const adminExists = await AdminModel.findOne({ email: 'admin@system.com' });
    
    if (!adminExists) {
      await AdminModel.create({
        email: 'admin@system.com',
        password: 'password123' // The Admin schema pre-save hook will hash this automatically
      });
      console.log('--------------------------------------------------');
      console.log('SUCCESS: Admin user created automatically on launch!');
      console.log('Email: admin@system.com');
      console.log('Password: password123');
      console.log('--------------------------------------------------');
    } else {
      console.log('Database Status: Admin user already exists. Ready.');
    }

  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
