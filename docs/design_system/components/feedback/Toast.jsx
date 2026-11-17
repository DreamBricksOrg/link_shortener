import React from 'react';

const toneColor = {
  info: 'var(--db-blue-500)',
  success: 'var(--db-success-500)',
  warning: 'var(--db-warning-500)',
  danger: 'var(--db-danger-500)',
};

/** Transient notification, typically stacked bottom-right or top-right. */
export function Toast({ tone = 'info', title, message, onClose }) {
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
      background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
      padding: 'var(--space-4)', width: 320, fontFamily: 'var(--font-body)',
      borderLeft: `3px solid ${toneColor[tone]}`,
    }}>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>}
        {message && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{message}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" style={{ border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
