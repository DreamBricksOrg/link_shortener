import React from 'react';

/** Modal dialog overlay for confirmations and focused tasks. */
export function Dialog({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'var(--surface-overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          width: 420, maxWidth: '90vw', padding: 'var(--space-6)', fontFamily: 'var(--font-body)',
        }}
      >
        {title && <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--weight-semibold)' }}>{title}</h3>}
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)' }}>{children}</div>
        {actions && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>{actions}</div>}
      </div>
    </div>
  );
}
