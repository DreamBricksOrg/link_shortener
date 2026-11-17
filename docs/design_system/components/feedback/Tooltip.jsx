import React from 'react';

/** Hover tooltip — wraps a trigger element and shows a small label above it. */
export function Tooltip({ children, label, position = 'top' }) {
  const [show, setShow] = React.useState(false);
  const posStyle = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
  }[position] || {};
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: 'absolute', ...posStyle, whiteSpace: 'nowrap', zIndex: 1000,
          background: 'var(--db-slate-900)', color: '#fff', fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)', padding: '5px 9px', borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)', pointerEvents: 'none',
        }}>
          {label}
        </span>
      )}
    </span>
  );
}
