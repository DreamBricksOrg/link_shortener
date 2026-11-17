import React from 'react';

/** Toggle switch for boolean settings. */
export function Switch({ label, checked, onChange, disabled = false }) {
  const id = React.useId();
  return (
    <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span style={{
        width: 38, height: 22, borderRadius: 'var(--radius-pill)', position: 'relative', flexShrink: 0,
        background: checked ? 'var(--db-blue-500)' : 'var(--db-slate-300)',
        transition: 'background var(--duration-base) var(--ease-standard)',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: '50%',
          background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'left var(--duration-base) var(--ease-standard)',
        }} />
      </span>
      <input id={id} type="checkbox" checked={!!checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
