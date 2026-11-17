import React from 'react';

/** Single radio button, used within a RadioGroup-style mapped list. */
export function Radio({ label, checked, onChange, name, disabled = false }) {
  const id = React.useId();
  return (
    <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--db-blue-500)' : 'var(--border-strong)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color var(--duration-fast)',
      }}>
        {checked && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--db-blue-500)' }} />}
      </span>
      <input id={id} type="radio" name={name} checked={!!checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
