import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../api';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'Engineering', 'Business', 'Arts', 'Literature', 'Psychology',
];

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

const EMPTY_FORM = {
  studentId: '',
  name: '',
  email: '',
  phone: '',
  department: 'Computer Science',
  year: '1',
  gpa: '0',
  status: 'Active',
  address: '',
  dateOfBirth: '',
  subjects: [],
};

export default function StudentFormModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!student;

  useEffect(() => {
    if (student) {
      setForm({
        studentId: student.studentId || '',
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        department: student.department || 'Computer Science',
        year: String(student.year || '1'),
        gpa: String(student.gpa || '0'),
        status: student.status || 'Active',
        address: student.address || '',
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split('T')[0]
          : '',
        subjects: student.subjects || [],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.department) errs.department = 'Department is required';
    if (!form.year || form.year < 1 || form.year > 5) errs.year = 'Year must be 1-5';
    if (form.gpa < 0 || form.gpa > 4) errs.gpa = 'GPA must be 0-4';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        gpa: Number(form.gpa),
      };

      if (isEdit) {
        await studentsAPI.update(student._id, payload);
        toast.success('Student updated successfully! ✏️');
      } else {
        await studentsAPI.create(payload);
        toast.success('Student added successfully! 🎉');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Subject helpers
  const addSubject = () => {
    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: '', grade: 'A', credits: 3 }],
    }));
  };

  const updateSubject = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      ),
    }));
  };

  const removeSubject = (idx) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '✏️ Edit Student' : '🎓 Add New Student'}
          </h2>
          <button className="btn-close" onClick={onClose}><FiX /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Section: Basic Info */}
            <div className="modal-section-label">Basic Information</div>

            <div className="form-grid form-grid-2" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="form-studentId">Student ID <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(auto if blank)</span></label>
                <input
                  id="form-studentId"
                  name="studentId"
                  type="text"
                  className="form-control"
                  placeholder="e.g. STU0001"
                  value={form.studentId}
                  onChange={handleChange}
                  disabled={isEdit}
                  style={isEdit ? { opacity: 0.6 } : {}}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="form-status">Status</label>
                <select id="form-status" name="status" className="form-control" value={form.status} onChange={handleChange}>
                  {['Active', 'Inactive', 'Graduated', 'Suspended'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" htmlFor="form-name">Full Name *</label>
              <input
                id="form-name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-grid form-grid-2" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="form-email">Email *</label>
                <input
                  id="form-email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'input-error' : ''}`}
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="form-phone">Phone</label>
                <input
                  id="form-phone"
                  name="phone"
                  type="text"
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section: Academic */}
            <div className="modal-section-label" style={{ marginTop: 20 }}>Academic Details</div>

            <div className="form-grid form-grid-3" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="form-department">Department *</label>
                <select
                  id="form-department"
                  name="department"
                  className={`form-control ${errors.department ? 'input-error' : ''}`}
                  value={form.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="form-year">Year *</label>
                <select
                  id="form-year"
                  name="year"
                  className={`form-control ${errors.year ? 'input-error' : ''}`}
                  value={form.year}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="form-gpa">GPA (0–4.0)</label>
                <input
                  id="form-gpa"
                  name="gpa"
                  type="number"
                  min="0" max="4" step="0.01"
                  className={`form-control ${errors.gpa ? 'input-error' : ''}`}
                  placeholder="3.50"
                  value={form.gpa}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section: Personal */}
            <div className="modal-section-label" style={{ marginTop: 20 }}>Personal Details (Optional)</div>

            <div className="form-grid form-grid-2" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="form-dob">Date of Birth</label>
                <input
                  id="form-dob"
                  name="dateOfBirth"
                  type="date"
                  className="form-control"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="form-address">Address</label>
                <input
                  id="form-address"
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="City, State"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Subjects */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="modal-section-label" style={{ margin: 0 }}>Subjects & Grades</div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addSubject}>
                  <FiPlus /> Add Subject
                </button>
              </div>

              {form.subjects.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0', textAlign: 'center' }}>
                  No subjects added yet. Click "Add Subject" to add one.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.subjects.map((sub, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject name"
                        value={sub.name}
                        onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <select
                        className="form-control"
                        value={sub.grade}
                        onChange={(e) => updateSubject(idx, 'grade', e.target.value)}
                        style={{ flex: 1 }}
                      >
                        {GRADES.map((g) => <option key={g}>{g}</option>)}
                      </select>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Credits"
                        min="1" max="6"
                        value={sub.credits}
                        onChange={(e) => updateSubject(idx, 'credits', Number(e.target.value))}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSubject(idx)}
                        style={{ flexShrink: 0 }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <FiSave />}
              {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-section-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent-blue);
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(59,130,246,0.2);
        }
        .input-error { border-color: var(--accent-rose) !important; }
        .field-error { color: var(--accent-rose); font-size: 0.75rem; margin-top: 2px; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
      `}</style>
    </div>
  );
}
