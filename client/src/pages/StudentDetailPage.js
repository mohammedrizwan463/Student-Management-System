import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { studentsAPI } from '../api';
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiMail, FiPhone,
  FiMapPin, FiCalendar, FiBook, FiUser, FiStar,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import StudentFormModal from '../components/StudentFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

const getGpaClass = (gpa) => {
  if (gpa >= 3.5) return 'gpa-high';
  if (gpa >= 2.5) return 'gpa-mid';
  return 'gpa-low';
};

const getStatusBadge = (status) => {
  const map = {
    Active: 'badge-active', Inactive: 'badge-inactive',
    Graduated: 'badge-graduated', Suspended: 'badge-suspended',
  };
  return map[status] || 'badge-inactive';
};

const DetailRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
    <div style={{ color: 'var(--accent-blue)', marginTop: 2, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</div>
    </div>
  </div>
);

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await studentsAPI.getById(id);
      setStudent(res.data.student);
    } catch (err) {
      toast.error('Student not found');
      navigate('/students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudent(); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentsAPI.delete(id);
      toast.success('Student deleted successfully');
      navigate('/students');
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <span>Loading student details...</span>
    </div>
  );

  if (!student) return null;

  return (
    <>
      <Helmet>
        <title>{student.name} – StudRec</title>
        <meta name="description" content={`View detailed information for student ${student.name} in the StudRec system.`} />
      </Helmet>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Back Link */}
        <Link
          to="/students"
          className="btn btn-secondary btn-sm fade-in"
          style={{ marginBottom: 20 }}
        >
          <FiArrowLeft /> Back to Students
        </Link>

        <div className="detail-layout fade-in-delay-1">
          {/* Profile Card */}
          <div className="card profile-card">
            {/* Avatar */}
            <div className="profile-avatar">
              {student.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{student.name}</h2>
            <span className="td-id" style={{ margin: '8px auto', display: 'inline-block' }}>{student.studentId}</span>
            <span className={`badge ${getStatusBadge(student.status)}`} style={{ margin: '8px auto', display: 'inline-flex' }}>
              {student.status}
            </span>

            <div style={{ margin: '20px 0', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div className="profile-stat">
                <span className={`profile-stat-value ${getGpaClass(student.gpa)}`}>
                  {student.gpa?.toFixed(2)}
                </span>
                <span className="profile-stat-label">GPA</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value" style={{ color: 'var(--accent-blue)' }}>
                  {student.year}
                </span>
                <span className="profile-stat-label">Year</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value" style={{ color: 'var(--accent-purple)' }}>
                  {student.subjects?.length || 0}
                </span>
                <span className="profile-stat-label">Subjects</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button className="btn btn-primary" onClick={() => setShowEdit(true)}>
                <FiEdit2 /> Edit Student
              </button>
              <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
                <FiTrash2 /> Delete Student
              </button>
            </div>
          </div>

          {/* Detail Cards */}
          <div className="detail-main">
            {/* Personal Info */}
            <div className="card detail-section">
              <h3 className="section-card-title"><FiUser /> Personal Information</h3>
              <DetailRow icon={<FiMail />} label="Email" value={student.email} />
              <DetailRow icon={<FiPhone />} label="Phone" value={student.phone} />
              <DetailRow icon={<FiMapPin />} label="Address" value={student.address} />
              <DetailRow
                icon={<FiCalendar />}
                label="Date of Birth"
                value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : null}
              />
              <DetailRow
                icon={<FiCalendar />}
                label="Enrollment Date"
                value={student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : null}
              />
            </div>

            {/* Academic Info */}
            <div className="card detail-section">
              <h3 className="section-card-title"><FiBook /> Academic Information</h3>
              <DetailRow icon={<FiBook />} label="Department" value={student.department} />
              <DetailRow icon={<FiStar />} label="GPA" value={student.gpa?.toFixed(2)} />
              <DetailRow icon={<FiUser />} label="Year" value={`Year ${student.year}`} />
              <DetailRow
                icon={<FiCalendar />}
                label="Added"
                value={new Date(student.createdAt).toLocaleString()}
              />
              {student.createdBy && (
                <DetailRow icon={<FiUser />} label="Added by" value={student.createdBy?.name} />
              )}
            </div>

            {/* Subjects */}
            {student.subjects?.length > 0 && (
              <div className="card detail-section">
                <h3 className="section-card-title"><FiBook /> Subjects & Grades</h3>
                <div className="table-wrapper" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subject</th>
                        <th>Grade</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.subjects.map((sub, i) => (
                        <tr key={i}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td className="td-name">{sub.name}</td>
                          <td>
                            <span className="badge badge-active" style={{ fontFamily: 'monospace' }}>
                              {sub.grade || '—'}
                            </span>
                          </td>
                          <td>{sub.credits || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <StudentFormModal
          student={student}
          onSave={() => { setShowEdit(false); fetchStudent(); }}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showDelete && (
        <ConfirmDialog
          title="Delete Student"
          message={`Are you sure you want to delete "${student.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}

      <style>{`
        .detail-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          align-items: start;
        }
        .profile-card {
          text-align: center;
          position: sticky;
          top: 88px;
        }
        .profile-avatar {
          width: 80px; height: 80px;
          background: var(--gradient-blue);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-weight: 800; color: white;
          margin: 0 auto 12px;
          box-shadow: 0 8px 24px rgba(59,130,246,0.35);
        }
        .profile-name { font-size: 1.1rem; font-weight: 700; }
        .profile-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 8px 0; border-bottom: 1px solid var(--border);
        }
        .profile-stat:last-child { border-bottom: none; }
        .profile-stat-value { font-size: 1.4rem; font-weight: 800; }
        .profile-stat-label { font-size: 0.75rem; color: var(--text-muted); }
        .detail-main { display: flex; flex-direction: column; gap: 16px; }
        .detail-section { padding: 20px; }
        .section-card-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .detail-layout { grid-template-columns: 1fr; }
          .profile-card { position: static; }
        }
      `}</style>
    </>
  );
}
