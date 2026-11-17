import React from 'react';

/** Removable label chip — for filters, categories, and multi-select tokens. */
export function Tag({ children, onRemove, color = 'var(--db-blue-500)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      border: `1px solid var(--border-default)`, background: 'var(--surface-card)',
      color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
      padding: '4px 6px 4px 10px', borderRadius: 'var(--radius-sm)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)',
            width: 18, height: 18, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          }}
        >×</button>
      )}
    </span>
  );
}
