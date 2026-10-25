import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { studentsAPI } from '../api';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye,
  FiFilter, FiX, FiChevronLeft, FiChevronRight,
  FiUsers, FiRefreshCw,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import StudentFormModal from '../components/StudentFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'Engineering', 'Business', 'Arts', 'Literature', 'Psychology',
];

const getGpaClass = (gpa) => {
  if (gpa >= 3.5) return 'gpa-high';
  if (gpa >= 2.5) return 'gpa-mid';
  return 'gpa-low';
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '', year: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search,
        ...filters,
      };
      const res = await studentsAPI.getAll(params);
      setStudents(res.data.students);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchStudents(1), 400);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  const handleEdit = (student) => {
    setEditStudent(student);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studentsAPI.delete(deleteTarget._id);
      toast.success(`${deleteTarget.name} deleted successfully`);
      setDeleteTarget(null);
      fetchStudents(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditStudent(null);
    fetchStudents(pagination.page);
  };

  const clearFilters = () => {
    setFilters({ department: '', status: '', year: '' });
    setSearch('');
  };

  const hasFilters = search || filters.department || filters.status || filters.year;

  const getStatusBadge = (status) => {
    const map = {
      Active: 'badge-active', Inactive: 'badge-inactive',
      Graduated: 'badge-graduated', Suspended: 'badge-suspended',
    };
    return map[status] || 'badge-inactive';
  };

  return (
    <>
      <Helmet>
        <title>Students – StudRec</title>
        <meta name="description" content="View and manage all student records. Add, edit, or delete student information." />
      </Helmet>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Page Header */}
        <div className="flex-between fade-in" style={{ marginBottom: 24 }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem', fontWeight: 800, marginBottom: 4,
              background: 'var(--gradient-blue)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Student Records
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {pagination.total} student{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => fetchStudents(pagination.page)}>
              <FiRefreshCw />
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setEditStudent(null); setShowForm(true); }}
            >
              <FiPlus /> Add Student
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card fade-in-delay-1" style={{ marginBottom: 20, padding: '16px 20px' }}>
          <div className="flex-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            {/* Search */}
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                id="student-search"
                className="form-control search-input"
                placeholder="Search by name, ID or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {hasFilters && (
                <button className="btn btn-danger btn-sm" onClick={clearFilters}>
                  <FiX /> Clear
                </button>
              )}
              <button
                className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> Filters
                {(filters.department || filters.status || filters.year) && (
                  <span style={{
                    background: 'var(--accent-rose)', color: 'white',
                    width: 16, height: 16, borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700,
                  }}>!</span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Row */}
          {showFilters && (
            <div className="form-grid form-grid-3" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-control"
                  id="filter-department"
                  value={filters.department}
                  onChange={(e) => setFilters((p) => ({ ...p, department: e.target.value }))}
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="">All Statuses</option>
                  {['Active', 'Inactive', 'Graduated', 'Suspended'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <select
                  className="form-control"
                  id="filter-year"
                  value={filters.year}
                  onChange={(e) => setFilters((p) => ({ ...p, year: e.target.value }))}
                >
                  <option value="">All Years</option>
                  {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="card fade-in-delay-2" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              <span>Loading students...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FiUsers /></div>
              <p className="empty-title">No students found</p>
              <p className="empty-desc">
                {hasFilters ? 'Try adjusting your search or filters.' : 'Add your first student to get started.'}
              </p>
              {!hasFilters && (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => setShowForm(true)}
                >
                  <FiPlus /> Add Student
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>GPA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td><span className="td-id">{s.studentId}</span></td>
                      <td>
                        <div>
                          <div className="td-name">{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </td>
                      <td>{s.department}</td>
                      <td>Year {s.year}</td>
                      <td><span className={getGpaClass(s.gpa)}>{s.gpa?.toFixed(2)}</span></td>
                      <td><span className={`badge ${getStatusBadge(s.status)}`}>{s.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link
                            to={`/students/${s._id}`}
                            className="btn btn-secondary btn-sm"
                            title="View details"
                          >
                            <FiEye />
                          </Link>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Edit student"
                            onClick={() => handleEdit(s)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            title="Delete student"
                            onClick={() => setDeleteTarget(s)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', borderTop: '1px solid var(--border)',
              flexWrap: 'wrap', gap: 12,
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Showing {((pagination.page - 1) * 10) + 1}–{Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
              </span>
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => fetchStudents(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - pagination.page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === pagination.page ? 'active' : ''}`}
                      onClick={() => fetchStudents(p)}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  className="page-btn"
                  onClick={() => fetchStudents(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <StudentFormModal
          student={editStudent}
          onSave={handleFormSave}
          onClose={() => { setShowForm(false); setEditStudent(null); }}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Student"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
