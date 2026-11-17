import React from 'react';

/** Generic content container — the base surface for dashboard panels, list rows, etc. */
export function Card({ children, padding = 'var(--space-6)', hoverable = false, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </div>
  );
}
