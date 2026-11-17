import React from 'react';

/** Native-backed select dropdown, styled to match Input. */
export function Select({ label, value, onChange, options = [], placeholder = 'Select…', disabled = false }) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label && <label htmlFor={id} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)' }}>{label}</label>}
      <div style={{
        position: 'relative', border: `1px solid ${focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)', height: 40, background: disabled ? 'var(--db-slate-50)' : 'var(--surface-card)',
        boxShadow: focus ? 'var(--shadow-focus)' : 'none', transition: 'border-color var(--duration-fast)',
      }}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none', border: 'none', outline: 'none', background: 'transparent',
            width: '100%', height: '100%', padding: '0 36px 0 12px', fontSize: 'var(--text-base)',
            color: 'var(--text-primary)', fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
