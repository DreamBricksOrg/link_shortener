import React from 'react';

/** Horizontal tab bar for switching between views within a page. */
export function Tabs({ items = [], value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)' }}>
      {items.map(item => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange && onChange(item.value)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '10px 4px', marginBottom: -1,
              fontSize: 'var(--text-sm)', fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              color: active ? 'var(--db-blue-600)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${active ? 'var(--db-blue-500)' : 'transparent'}`,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color var(--duration-fast)',
            }}
          >
            {item.label}
            {item.count != null && (
              <span style={{
                background: active ? 'var(--db-blue-50)' : 'var(--db-slate-100)',
                color: active ? 'var(--db-blue-700)' : 'var(--text-tertiary)',
                fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 'var(--radius-pill)',
              }}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
