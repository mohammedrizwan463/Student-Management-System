import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  FiMail, FiLock, FiUser, FiUserPlus, FiBook,
  FiAlertCircle, FiShield,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const roles = [
  { value: 'admin', label: 'Admin', desc: 'Full access' },
  { value: 'teacher', label: 'Teacher', desc: 'Standard access' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'teacher' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account – StudRec</title>
        <meta name="description" content="Create your free StudRec account to start managing student records." />
      </Helmet>

      <div className="auth-wrapper">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-card card fade-in" style={{ maxWidth: 520 }}>
          <div className="auth-header">
            <div className="auth-logo" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
              <FiBook />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join StudRec and start managing records</p>
          </div>

          {error && (
            <div className="auth-error">
              <FiAlertCircle /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className="form-control input-with-icon"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="form-control input-with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">
                <FiShield style={{ display: 'inline', marginRight: 4 }} />
                Role
              </label>
              <div className="role-picker">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span className="role-name">{r.label}</span>
                    <span className="role-desc">{r.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    className="form-control input-with-icon"
                    placeholder="Min. 6 chars"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type="password"
                    className="form-control input-with-icon"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 15px rgba(139,92,246,0.35)' }}
            >
              {loading ? <span className="btn-spinner" /> : <FiUserPlus />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-wrapper {
          min-height: calc(100vh - 130px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 16px; position: relative;
        }
        .auth-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
        .auth-orb-1 { width: 350px; height: 350px; background: rgba(139,92,246,0.08); top: 5%; right: 5%; }
        .auth-orb-2 { width: 300px; height: 300px; background: rgba(236,72,153,0.06); bottom: 5%; left: 5%; }
        .auth-card {
          width: 100%; position: relative; z-index: 1;
          padding: 40px; box-shadow: var(--shadow-lg); border-color: var(--border-light);
        }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-logo {
          width: 56px; height: 56px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; color: white; margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(139,92,246,0.3);
        }
        .auth-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 6px; }
        .auth-subtitle { color: var(--text-muted); font-size: 0.875rem; }
        .auth-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25);
          border-radius: var(--radius-md); padding: 10px 14px;
          color: var(--accent-rose); font-size: 0.875rem; margin-bottom: 20px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .input-icon-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%); color: var(--text-muted); font-size: 0.95rem; pointer-events: none;
        }
        .input-with-icon { padding-left: 38px !important; }
        .role-picker { display: flex; gap: 8px; }
        .role-option {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 8px; border-radius: var(--radius-md);
          border: 1.5px solid var(--border); background: var(--bg-input);
          cursor: pointer; transition: var(--transition); text-align: center;
        }
        .role-option:hover { border-color: var(--border-light); }
        .role-option.selected { border-color: #8b5cf6; background: rgba(139,92,246,0.1); }
        .role-name { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
        .role-desc { font-size: 0.7rem; color: var(--text-muted); }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0; color: var(--text-muted); font-size: 0.8rem;
        }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .auth-footer-text { text-align: center; color: var(--text-muted); font-size: 0.875rem; }
        .auth-link { color: var(--accent-purple); font-weight: 600; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}
