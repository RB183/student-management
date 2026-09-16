const express = require('express');
const router = express.Router();

// 1. Add getStudentById to your imports
const { 
  getDashboardStats, 
  getAllStudents, 
  getStudentById,
  getMyProfile,
  createStudent, 
  updateStudent, 
  deleteStudent 
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware'); 

// Dashboard & Search views: Accessible by BOTH Admins and Students
router.get('/dashboard', protect, getDashboardStats);
router.get('/me', protect, authorize('student'), getMyProfile);
router.get('/', protect, getAllStudents);

// 2. Add the new route right here
router.get('/:id', protect, getStudentById);

// Mutation endpoints: Restricted exclusively to ADMIN
router.post('/', protect, authorize('admin'), upload.single('profileImage'), createStudent);
router.put('/:id', protect, authorize('admin'), upload.single('profileImage'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;