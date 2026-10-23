import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiGithub, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '24px 0',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--gradient-blue)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.85rem',
          }}>
            <FiBook />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-secondary)' }}>
            StudRec
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          Built with <FiHeart style={{ color: 'var(--accent-rose)' }} /> using MERN Stack
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Student Records System
        </p>
      </div>
    </footer>
  );
}
