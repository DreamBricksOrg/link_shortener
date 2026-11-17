import React from 'react';

/** Checkbox with label, indeterminate support. */
export function Checkbox({ label, checked, indeterminate = false, onChange, disabled = false }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  const id = React.useId();
  return (
    <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 'var(--radius-sm)', flexShrink: 0,
        border: `1.5px solid ${checked || indeterminate ? 'var(--db-blue-500)' : 'var(--border-strong)'}`,
        background: checked || indeterminate ? 'var(--db-blue-500)' : 'var(--surface-card)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background var(--duration-fast), border-color var(--duration-fast)',
      }}>
        {checked && !indeterminate && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="m5 13 5 5 9-9" /></svg>
        )}
        {indeterminate && <span style={{ width: 8, height: 2, background: 'white', borderRadius: 1 }} />}
      </span>
      <input id={id} type="checkbox" checked={!!checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} ref={ref} />
      {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
