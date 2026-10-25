const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/students
// @desc    Get all students with pagination, search and filter
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      status = '',
      year = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter query
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (year) filter.year = Number(year);

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name email'),
      Student.countDocuments(filter),
    ]);

    res.json({
      success: true,
      students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/students/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      graduatedStudents,
      inactiveStudents,
      suspendedStudents,
      departmentStats,
      avgGpa,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'Active' }),
      Student.countDocuments({ status: 'Graduated' }),
      Student.countDocuments({ status: 'Inactive' }),
      Student.countDocuments({ status: 'Suspended' }),
      Student.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Student.aggregate([
        { $group: { _id: null, avgGpa: { $avg: '$gpa' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        graduatedStudents,
        inactiveStudents,
        suspendedStudents,
        departmentStats,
        avgGpa: avgGpa[0]?.avgGpa ? avgGpa[0].avgGpa.toFixed(2) : '0.00',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/students
// @desc    Create a new student
// @access  Private
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Student name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('year').isInt({ min: 1, max: 5 }).withMessage('Year must be between 1 and 5'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      // Check for duplicate email or studentId
      if (req.body.email) {
        const existing = await Student.findOne({ email: req.body.email });
        if (existing) {
          return res.status(400).json({ message: 'A student with this email already exists' });
        }
      }
      if (req.body.studentId && req.body.studentId.trim()) {
        const existing = await Student.findOne({ studentId: req.body.studentId.trim().toUpperCase() });
        if (existing) {
          return res.status(400).json({ message: 'A student with this ID already exists' });
        }
      } else {
        delete req.body.studentId;
      }

      const student = await Student.create({
        ...req.body,
        createdBy: req.user._id,
      });

      res.status(201).json({ success: true, message: 'Student added successfully', student });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Student ID or email already exists' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   PUT /api/students/:id
// @desc    Update student record
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for duplicate email/studentId (excluding current student)
    if (req.body.email && req.body.email !== student.email) {
      const existing = await Student.findOne({ email: req.body.email });
      if (existing) {
        return res.status(400).json({ message: 'A student with this email already exists' });
      }
    }

    if (req.body.studentId && req.body.studentId.trim().toUpperCase() !== student.studentId) {
      const existing = await Student.findOne({ studentId: req.body.studentId.trim().toUpperCase() });
      if (existing) {
        return res.status(400).json({ message: 'A student with this ID already exists' });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({ success: true, message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Student ID or email already exists' });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student record
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
