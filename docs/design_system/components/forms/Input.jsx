import React from 'react';

/** Single-line text input with optional label, hint, and error state. */
export function Input({ label, hint, error, value, onChange, placeholder, type = 'text', icon = null, disabled = false, style: styleOverride, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label && <label htmlFor={id} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: `1px solid ${error ? 'var(--db-danger-500)' : focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)', padding: '0 12px', height: 40,
        background: disabled ? 'var(--db-slate-50)' : 'var(--surface-card)',
        boxShadow: focus ? 'var(--shadow-focus)' : 'none',
        transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
      }}>
        {icon}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
          style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-primary)', fontFamily: 'inherit', ...styleOverride }}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--db-danger-500)' : 'var(--text-tertiary)' }}>{error || hint}</span>
      )}
    </div>
  );
}
