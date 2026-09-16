const express = require('express');
const router = express.Router();
const { loginAdmin, loginStudent, changeStudentPassword } = require('../controllers/authController.js');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/student-login', loginStudent);
router.put('/student-password', protect, authorize('student'), changeStudentPassword);

module.exports = router;
