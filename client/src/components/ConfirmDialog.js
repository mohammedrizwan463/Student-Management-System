import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn-close" onClick={onCancel}><FiX /></button>
        </div>
        <div className="confirm-dialog-body">
          <div className="confirm-icon">
            <FiAlertTriangle style={{ color: 'var(--accent-rose)', fontSize: '2.5rem' }} />
          </div>
          <p className="confirm-desc">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="btn-spinner" /> : null}
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <style>{`
        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
      `}</style>
    </div>
  );
}
