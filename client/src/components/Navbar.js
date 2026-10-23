import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiLogOut, FiLogIn, FiUserPlus,
  FiBarChart2, FiMenu, FiX, FiBook,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/dashboard', icon: <FiBarChart2 />, label: 'Dashboard' },
        { to: '/students', icon: <FiUsers />, label: 'Students' },
      ]
    : [
        { to: '/', icon: <FiHome />, label: 'Home' },
      ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-icon"><FiBook /></div>
          <span className="logo-text">
            Stud<span className="logo-accent">Rec</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-chip">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <FiUserPlus /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div className="mobile-divider" />
          {user ? (
            <>
              <div className="mobile-user">
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span>{user.name}</span>
              </div>
              <button className="btn btn-danger" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                <FiUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
