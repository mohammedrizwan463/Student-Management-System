const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Computer Science',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Engineering',
        'Business',
        'Arts',
        'Literature',
        'Psychology',
      ],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1, 'Year must be at least 1'],
      max: [5, 'Year cannot exceed 5'],
    },
    gpa: {
      type: Number,
      min: [0, 'GPA cannot be negative'],
      max: [4.0, 'GPA cannot exceed 4.0'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
      default: 'Active',
    },
    subjects: [
      {
        name: { type: String, required: true },
        grade: { type: String, enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'] },
        credits: { type: Number },
      },
    ],
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Auto-generate student ID if not provided
studentSchema.pre('save', async function (next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
