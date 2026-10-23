import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiBarChart2, FiShield, FiArrowRight,
  FiDatabase, FiCode, FiLayers, FiCheckCircle,
} from 'react-icons/fi';

const features = [
  { icon: <FiUsers />, title: 'Student Management', desc: 'Add, update, and remove student records with ease. Full CRUD operations supported.', color: 'blue' },
  { icon: <FiBarChart2 />, title: 'Analytics Dashboard', desc: 'Visual insights into enrollment, GPA distribution, and department statistics.', color: 'purple' },
  { icon: <FiShield />, title: 'Secure Auth', desc: 'JWT-based authentication with bcrypt password hashing keeps your data safe.', color: 'emerald' },
  { icon: <FiDatabase />, title: 'MongoDB Storage', desc: 'All data persisted in MongoDB with Mongoose ODM for reliable data management.', color: 'amber' },
];

const stack = [
  { name: 'MongoDB', color: '#10b981', desc: 'Database' },
  { name: 'Express.js', color: '#f59e0b', desc: 'Backend' },
  { name: 'React.js', color: '#3b82f6', desc: 'Frontend' },
  { name: 'Node.js', color: '#8b5cf6', desc: 'Runtime' },
];

const stats = [
  { label: 'CRUD Operations', value: '5+' },
  { label: 'API Endpoints', value: '10+' },
  { label: 'React Components', value: '15+' },
  { label: 'Departments', value: '10' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>StudRec – Student Records System | MERN Stack App</title>
        <meta name="description" content="A full-stack MERN application for managing student records with CRUD operations, authentication, and real-time analytics." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="container hero-content">
          <div className="hero-badge fade-in">
            <FiCode />
            <span>MERN Stack Application</span>
          </div>

          <h1 className="hero-title fade-in-delay-1">
            Manage Student Records<br />
            <span className="hero-gradient-text">with Confidence</span>
          </h1>

          <p className="hero-desc fade-in-delay-2">
            A complete full-stack web application built with MongoDB, Express.js,
            React.js & Node.js. Featuring authentication, CRUD operations,
            and real-time analytics.
          </p>

          <div className="hero-actions fade-in-delay-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  <FiBarChart2 /> Go to Dashboard <FiArrowRight />
                </Link>
                <Link to="/students" className="btn btn-secondary btn-lg">
                  <FiUsers /> View Students
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="hero-stats fade-in-delay-3">
            {stats.map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MERN Stack Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Built with the MERN Stack</h2>
            <p>Industry-standard technologies for modern web development</p>
          </div>
          <div className="mern-stack">
            {stack.map((tech) => (
              <div key={tech.name} className="mern-card">
                <div className="mern-dot" style={{ background: tech.color }} />
                <h3 className="mern-name">{tech.name}</h3>
                <p className="mern-desc">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need</h2>
            <p>All the features required to manage student records efficiently</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className={`feature-card card`}>
                <div className={`feature-icon stat-icon ${f.color}`}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="section cta-section">
          <div className="container">
            <div className="cta-card">
              <div className="cta-orb" />
              <FiLayers className="cta-icon-bg" />
              <h2 className="cta-title">Ready to get started?</h2>
              <p className="cta-desc">
                Create your account and start managing student records today.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Account <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </div>
              <div className="cta-checks">
                {['Free to use', 'Secure & private', 'Full CRUD support'].map((t) => (
                  <span key={t} className="cta-check">
                    <FiCheckCircle /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <style>{`
        /* Hero */
        .hero-section {
          position: relative;
          padding: 100px 0 80px;
          overflow: hidden;
          text-align: center;
        }
        .hero-bg-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: pulse 4s ease-in-out infinite;
        }
        .hero-orb-1 { width: 400px; height: 400px; background: rgba(59,130,246,0.12); top: -100px; left: -100px; }
        .hero-orb-2 { width: 350px; height: 350px; background: rgba(139,92,246,0.1); bottom: -80px; right: -80px; animation-delay: 2s; }
        .hero-content { position: relative; z-index: 1; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: 999px;
          font-size: 0.8rem; font-weight: 600; color: var(--accent-blue);
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          color: var(--text-primary);
        }
        .hero-gradient-text {
          background: var(--gradient-blue);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-desc {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto 32px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px;
        }
        .hero-stats {
          display: flex; gap: 0; justify-content: center;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          overflow: hidden;
          display: inline-flex;
        }
        .hero-stat {
          display: flex; flex-direction: column;
          padding: 16px 32px;
          border-right: 1px solid var(--border);
          text-align: center;
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat-value { font-size: 1.5rem; font-weight: 800; color: var(--accent-blue); }
        .hero-stat-label { font-size: 0.75rem; color: var(--text-muted); }

        /* Sections */
        .section { padding: 80px 0; }
        .section-dark { background: var(--bg-secondary); }
        .section-header { text-align: center; margin-bottom: 48px; }
        .section-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .section-header p { color: var(--text-secondary); font-size: 0.95rem; }

        /* MERN Stack */
        .mern-stack {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .mern-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px 20px;
          text-align: center;
          transition: var(--transition);
        }
        .mern-card:hover { transform: translateY(-4px); border-color: var(--border-light); box-shadow: var(--shadow-md); }
        .mern-dot { width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 16px; opacity: 0.85; }
        .mern-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
        .mern-desc { font-size: 0.8rem; color: var(--text-muted); }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .feature-card { display: flex; flex-direction: column; gap: 12px; }
        .feature-title { font-size: 1rem; font-weight: 700; }
        .feature-desc { color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; flex: 1; }

        /* CTA */
        .cta-section { padding: 60px 0 80px; }
        .cta-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 60px 40px;
          text-align: center;
          overflow: hidden;
          box-shadow: var(--shadow-glow-blue);
        }
        .cta-orb {
          position: absolute; top: -100px; right: -100px;
          width: 300px; height: 300px;
          background: rgba(139,92,246,0.1);
          border-radius: 50%; filter: blur(60px);
          pointer-events: none;
        }
        .cta-icon-bg {
          position: absolute; top: 20px; left: 20px;
          font-size: 6rem; color: rgba(59,130,246,0.04);
          pointer-events: none;
        }
        .cta-title { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
        .cta-desc { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 28px; }
        .cta-checks { display: flex; gap: 20px; justify-content: center; margin-top: 24px; flex-wrap: wrap; }
        .cta-check { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.85rem; }
        .cta-check svg { color: var(--accent-emerald); }

        @media (max-width: 768px) {
          .mern-stack { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .hero-stats { flex-wrap: wrap; }
          .hero-stat { flex: 1; min-width: 120px; }
          .cta-card { padding: 40px 20px; }
        }
        @media (max-width: 480px) {
          .mern-stack { grid-template-columns: 1fr 1fr; }
          .hero-section { padding: 60px 0 50px; }
        }
      `}</style>
    </>
  );
}
