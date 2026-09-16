const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');
const Student = require('../models/Student.js'); // Import Student model to look up student profiles

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check the role inside the token payload
      if (decoded.role === 'admin') {
        req.admin = await Admin.findById(decoded.id).select('-password');
        req.user = req.admin;
        req.userRole = 'admin';
      } else if (decoded.role === 'student') {
        req.student = await Student.findById(decoded.id).select('-password');
        
        // Block students whose accounts were changed to inactive after token issue
        if (!req.student || req.student.status === 'Inactive') {
          return res.status(403).json({ message: 'Access denied. Account is inactive or non-existent.' });
        }
        
        req.user = req.student;
        req.userRole = 'student';
      } else {
        // Fallback fallback if role is missing from legacy tokens
        req.admin = await Admin.findById(decoded.id).select('-password');
        if (req.admin) {
          req.user = req.admin;
          req.userRole = 'admin';
        } else {
          return res.status(401).json({ message: 'Not authorized, invalid role assignment' });
        }
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, access token missing' });
  }
};

// New Middleware helper to restrict routes to specific roles (e.g., admin only)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        message: `Forbidden: Role '${req.userRole || 'Guest'}' is not allowed to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
