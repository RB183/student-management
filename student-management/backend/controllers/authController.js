const Admin = require('../models/Admin.js');
const Student = require('../models/Student.js'); // Import Student model to verify credentials
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Updated token generator to include user role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @desc    Authenticate an admin and get a token
// @route   POST /api/auth/login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }

    const user = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id, 'admin'),
      user: {
        id: user._id,
        name: user.fullName || 'Administrator',
        email: user.email,
        role: 'admin'
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error during login processing', error: error.message });
  }
};

const storedDatePassword = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getUTCDate()).padStart(2, '0')}${String(date.getUTCMonth() + 1).padStart(2, '0')}${date.getUTCFullYear()}`;
};

const datePasswordKey = (value) => {
  const cleanedValue = String(value || '').replace(/[^0-9]/g, '');

  if (/^\d{8}$/.test(cleanedValue)) {
    return cleanedValue;
  }

  const isoMatch = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return isoMatch ? `${isoMatch[3]}${isoMatch[2]}${isoMatch[1]}` : '';
};

// @desc    Authenticate a student using email, full name, and date of birth
// @route   POST /api/auth/student-login
exports.loginStudent = async (req, res) => {
  const { email, fullName, password, dateOfBirth } = req.body;

  if (!email || !fullName || !(password || dateOfBirth)) {
    return res.status(400).json({ message: 'Please provide your email, full name, and date-of-birth password' });
  }

  try {
    const student = await Student.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

    const enteredPassword = password || dateOfBirth;
    const passwordMatches = student?.passwordHash
      ? await bcrypt.compare(enteredPassword, student.passwordHash)
      : storedDatePassword(student?.dateOfBirth) === datePasswordKey(enteredPassword);

    if (!student || student.fullName.toLowerCase() !== fullName.trim().toLowerCase() || !passwordMatches) {
      return res.status(401).json({ message: 'The provided student details do not match our records' });
    }

    if (student.status === 'Inactive') {
      return res.status(403).json({ message: 'Your student account is inactive. Contact Admin.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: generateToken(student._id, 'student'),
      user: {
        id: student._id,
        name: student.fullName,
        email: student.email,
        role: 'student'
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during student login', error: error.message });
  }
};

// @desc    Change the authenticated student's password
// @route   PUT /api/auth/student-password
exports.changeStudentPassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const studentId = req.student?._id || req.user?._id;
    const student = await Student.findById(studentId).select('+passwordHash');

    if (!student) {
      return res.status(404).json({ message: 'Student account was not found' });
    }

    student.passwordHash = await bcrypt.hash(newPassword, 10);
    await student.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to change password' });
  }
};
