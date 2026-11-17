import React from 'react';

const sizes = { sm: 28, md: 36, lg: 44 };

/** Square icon-only button for compact toolbars and card actions. */
export function IconButton({ icon, size = 'md', variant = 'ghost', label, onClick, disabled = false, style: styleOverride, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const dim = sizes[size] || sizes.md;
  const bgMap = {
    ghost: hover ? 'var(--db-slate-100)' : 'transparent',
    primary: hover ? 'var(--db-blue-600)' : 'var(--db-blue-500)',
    secondary: hover ? 'var(--db-slate-50)' : 'var(--surface-card)',
  };
  const colorMap = { ghost: 'var(--text-secondary)', primary: '#fff', secondary: 'var(--text-primary)' };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
      style={{
        width: dim, height: dim,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: variant === 'secondary' ? '1px solid var(--border-default)' : '1px solid transparent',
        background: bgMap[variant],
        color: colorMap[variant],
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard)',
        ...styleOverride,
      }}
    >
      {icon}
    </button>
  );
}
