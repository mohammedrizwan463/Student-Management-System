import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiBook, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemo = () => {
    setForm({ email: 'admin@demo.com', password: 'password123' });
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Sign In – StudRec</title>
        <meta name="description" content="Sign in to your StudRec account to manage student records." />
      </Helmet>

      <div className="auth-wrapper">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-card card fade-in">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <FiBook />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input
                  id="login-email"
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

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  className="form-control input-with-icon"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? <span className="btn-spinner" /> : <FiLogIn />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo */}
          <div className="auth-demo">
            <p>Don't have credentials?</p>
            <button className="btn btn-secondary btn-sm" onClick={fillDemo}>
              Use demo account
            </button>
          </div>

          <div className="auth-divider"><span>or</span></div>

          {/* Footer */}
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-wrapper {
          min-height: calc(100vh - 130px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          position: relative;
        }
        .auth-orb {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none;
        }
        .auth-orb-1 { width: 350px; height: 350px; background: rgba(59,130,246,0.08); top: 10%; left: 5%; }
        .auth-orb-2 { width: 300px; height: 300px; background: rgba(139,92,246,0.08); bottom: 10%; right: 5%; }
        .auth-card {
          width: 100%; max-width: 440px;
          position: relative; z-index: 1;
          padding: 40px;
          box-shadow: var(--shadow-lg);
          border-color: var(--border-light);
        }
        .auth-header { text-align: center; margin-bottom: 28px; }
        .auth-logo {
          width: 56px; height: 56px;
          background: var(--gradient-blue);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; color: white;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(59,130,246,0.3);
        }
        .auth-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 6px; }
        .auth-subtitle { color: var(--text-muted); font-size: 0.875rem; }
        .auth-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.25);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          color: var(--accent-rose);
          font-size: 0.875rem;
          margin-bottom: 20px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .input-icon-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted); font-size: 0.95rem;
          pointer-events: none;
        }
        .input-with-icon { padding-left: 38px !important; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        .auth-demo {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 16px;
          font-size: 0.8rem; color: var(--text-muted);
        }
        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0;
          color: var(--text-muted); font-size: 0.8rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1;
          height: 1px; background: var(--border);
        }
        .auth-footer-text { text-align: center; color: var(--text-muted); font-size: 0.875rem; }
        .auth-link { color: var(--accent-blue); font-weight: 600; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}
