import React from 'react';

const tones = {
  neutral: { bg: 'var(--db-slate-100)', fg: 'var(--db-slate-600)' },
  brand: { bg: 'var(--db-blue-50)', fg: 'var(--db-blue-700)' },
  success: { bg: 'var(--db-success-100)', fg: 'var(--db-success-500)' },
  warning: { bg: 'var(--db-warning-100)', fg: '#8a5a00' },
  danger: { bg: 'var(--db-danger-100)', fg: 'var(--db-danger-500)' },
};

/** Small status pill — for project/task states (e.g. "In progress", "Completed"). */
export function Badge({ children, tone = 'neutral', dot = false }) {
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: t.bg, color: t.fg,
      fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
      padding: '3px 10px', borderRadius: 'var(--radius-pill)', lineHeight: 1.4,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.fg, flexShrink: 0 }} />}
      {children}
    </span>
  );
}
