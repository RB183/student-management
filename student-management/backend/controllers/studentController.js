const Student = require('../models/Student');
const { cloudinary } = require('../middleware/uploadMiddleware');

// @desc    Create a new student
exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;

    // Attach Cloudinary file info if uploaded
    if (req.file) {
      studentData.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const student = await Student.create(studentData);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    // Cleanup uploaded image if database insert fails
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update student (handles image replacement)
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      // Delete previous image from Cloudinary if it exists
      if (student.profileImage?.public_id) {
        await cloudinary.uploader.destroy(student.profileImage.public_id);
      }
      updateData.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete student & remove image from Cloudinary
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete image from Cloudinary
    if (student.profileImage?.public_id) {
      await cloudinary.uploader.destroy(student.profileImage.public_id);
    }

    await student.deleteOne();
    res.status(200).json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics (Total, Active, Inactive, Recent)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const inactiveStudents = await Student.countDocuments({ status: 'Inactive' });
    
    // Fetch the 5 most recently added students
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        recentStudents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students (with optional Search and Filters)
exports.getAllStudents = async (req, res) => {
  try {
    const { search, course, status } = req.query;
    let query = {};

    // 1. Search by Full Name OR Email (Case-insensitive)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Filter by Course
    if (course) {
      query.course = course;
    }

    // 3. Filter by Status
    if (status) {
      query.status = status;
    }

    // Fetch matching students, newest first
    const students = await Student.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    // Check if the student actually exists in the database
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    // Handle invalid MongoDB ID formats gracefully
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get the authenticated student's own profile
exports.getMyProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.student });
};