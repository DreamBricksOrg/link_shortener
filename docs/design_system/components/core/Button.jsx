import React from 'react';

const sizeStyles = {
  sm: { padding: '0 var(--space-3)', height: 32, fontSize: 'var(--text-sm)', gap: 'var(--space-2)' },
  md: { padding: '0 var(--space-4)', height: 40, fontSize: 'var(--text-base)', gap: 'var(--space-2)' },
  lg: { padding: '0 var(--space-6)', height: 48, fontSize: 'var(--text-md)', gap: 'var(--space-3)' },
};

const variantStyles = {
  primary: {
    background: 'var(--db-blue-500)', color: 'var(--text-on-brand)', border: '1px solid transparent',
  },
  secondary: {
    background: 'var(--surface-card)', color: 'var(--text-primary)', border: '1px solid var(--border-default)',
  },
  ghost: {
    background: 'transparent', color: 'var(--text-primary)', border: '1px solid transparent',
  },
  danger: {
    background: 'var(--db-danger-500)', color: '#fff', border: '1px solid transparent',
  },
};

/** Primary interactive control. Variants: primary, secondary, ghost, danger. Sizes: sm, md, lg. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style: styleOverride,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const base = variantStyles[variant] || variantStyles.primary;
  const sz = sizeStyles[size] || sizeStyles.md;

  let bg = base.background;
  if (!disabled && variant === 'primary') bg = active ? 'var(--db-blue-700)' : hover ? 'var(--db-blue-600)' : base.background;
  if (!disabled && variant === 'secondary') bg = active ? 'var(--db-slate-100)' : hover ? 'var(--db-slate-50)' : base.background;
  if (!disabled && variant === 'ghost') bg = active ? 'var(--db-slate-100)' : hover ? 'var(--db-slate-50)' : base.background;
  if (!disabled && variant === 'danger') bg = active ? 'oklch(0.5 0.2 25)' : hover ? 'oklch(0.54 0.2 25)' : base.background;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
    width: fullWidth ? '100%' : undefined,
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-semibold)',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
    transform: active && !disabled ? 'scale(0.98)' : 'scale(1)',
    ...sz,
    ...base,
    background: bg,
    ...styleOverride,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
      style={style}
    >
      {icon}
      {children}
    </button>
  );
}
