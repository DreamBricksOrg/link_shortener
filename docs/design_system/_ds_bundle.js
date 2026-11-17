/* @ds-bundle: {"format":4,"namespace":"DreamBricksDesignSystem_6b66b1","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"eb50ac87ddba","components/core/Button.jsx":"ca088c366912","components/core/IconButton.jsx":"234183a6b7f4","components/core/Tag.jsx":"1eec7a19771a","components/feedback/Dialog.jsx":"848828cf3cc2","components/feedback/Toast.jsx":"0ab45b963174","components/feedback/Tooltip.jsx":"86c63c36a354","components/forms/Checkbox.jsx":"ebaa59ca2080","components/forms/Input.jsx":"443889202cfb","components/forms/Radio.jsx":"462bf23741b2","components/forms/Select.jsx":"a646d04de838","components/forms/Switch.jsx":"de1082221729","components/layout/Card.jsx":"4198433e0eec","components/navigation/Tabs.jsx":"f7f17cf2baf5","ui_kits/dashboard/App.jsx":"9e772d567f60","ui_kits/dashboard/Icons.jsx":"7bbd9f494439","ui_kits/dashboard/data.js":"6eaa161de767"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DreamBricksDesignSystem_6b66b1 = window.DreamBricksDesignSystem_6b66b1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    bg: 'var(--db-slate-100)',
    fg: 'var(--db-slate-600)'
  },
  brand: {
    bg: 'var(--db-blue-50)',
    fg: 'var(--db-blue-700)'
  },
  success: {
    bg: 'var(--db-success-100)',
    fg: 'var(--db-success-500)'
  },
  warning: {
    bg: 'var(--db-warning-100)',
    fg: '#8a5a00'
  },
  danger: {
    bg: 'var(--db-danger-100)',
    fg: 'var(--db-danger-500)'
  }
};

/** Small status pill — for project/task states (e.g. "In progress", "Completed"). */
function Badge({
  children,
  tone = 'neutral',
  dot = false
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      lineHeight: 1.4
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.fg,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizeStyles = {
  sm: {
    padding: '0 var(--space-3)',
    height: 32,
    fontSize: 'var(--text-sm)',
    gap: 'var(--space-2)'
  },
  md: {
    padding: '0 var(--space-4)',
    height: 40,
    fontSize: 'var(--text-base)',
    gap: 'var(--space-2)'
  },
  lg: {
    padding: '0 var(--space-6)',
    height: 48,
    fontSize: 'var(--text-md)',
    gap: 'var(--space-3)'
  }
};
const variantStyles = {
  primary: {
    background: 'var(--db-blue-500)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'var(--db-danger-500)',
    color: '#fff',
    border: '1px solid transparent'
  }
};

/** Primary interactive control. Variants: primary, secondary, ghost, danger. Sizes: sm, md, lg. */
function Button({
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
    ...styleOverride
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest, {
    style: style
  }), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 28,
  md: 36,
  lg: 44
};

/** Square icon-only button for compact toolbars and card actions. */
function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  label,
  onClick,
  disabled = false,
  style: styleOverride,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dim = sizes[size] || sizes.md;
  const bgMap = {
    ghost: hover ? 'var(--db-slate-100)' : 'transparent',
    primary: hover ? 'var(--db-blue-600)' : 'var(--db-blue-500)',
    secondary: hover ? 'var(--db-slate-50)' : 'var(--surface-card)'
  };
  const colorMap = {
    ghost: 'var(--text-secondary)',
    primary: '#fff',
    secondary: 'var(--text-primary)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest, {
    style: {
      width: dim,
      height: dim,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      border: variant === 'secondary' ? '1px solid var(--border-default)' : '1px solid transparent',
      background: bgMap[variant],
      color: colorMap[variant],
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--duration-fast) var(--ease-standard)',
      ...styleOverride
    }
  }), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/** Removable label chip — for filters, categories, and multi-select tokens. */
function Tag({
  children,
  onRemove,
  color = 'var(--db-blue-500)'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: `1px solid var(--border-default)`,
      background: 'var(--surface-card)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      padding: '4px 6px 4px 10px',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: color,
      flexShrink: 0
    }
  }), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-tertiary)',
      width: 18,
      height: 18,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/** Modal dialog overlay for confirmations and focused tasks. */
function Dialog({
  open,
  onClose,
  title,
  children,
  actions
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      width: 420,
      maxWidth: '90vw',
      padding: 'var(--space-6)',
      fontFamily: 'var(--font-body)'
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-primary)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-normal)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-6)'
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const toneColor = {
  info: 'var(--db-blue-500)',
  success: 'var(--db-success-500)',
  warning: 'var(--db-warning-500)',
  danger: 'var(--db-danger-500)'
};

/** Transient notification, typically stacked bottom-right or top-right. */
function Toast({
  tone = 'info',
  title,
  message,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 'var(--space-4)',
      width: 320,
      fontFamily: 'var(--font-body)',
      borderLeft: `3px solid ${toneColor[tone]}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      marginBottom: 2
    }
  }, title), message && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--text-tertiary)',
      cursor: 'pointer',
      fontSize: 16,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Hover tooltip — wraps a trigger element and shows a small label above it. */
function Tooltip({
  children,
  label,
  position = 'top'
}) {
  const [show, setShow] = React.useState(false);
  const posStyle = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: 6
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: 6
    }
  }[position] || {};
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...posStyle,
      whiteSpace: 'nowrap',
      zIndex: 1000,
      background: 'var(--db-slate-900)',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)',
      pointerEvents: 'none'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox with label, indeterminate support. */
function Checkbox({
  label,
  checked,
  indeterminate = false,
  onChange,
  disabled = false
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 'var(--radius-sm)',
      flexShrink: 0,
      border: `1.5px solid ${checked || indeterminate ? 'var(--db-blue-500)' : 'var(--border-strong)'}`,
      background: checked || indeterminate ? 'var(--db-blue-500)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--duration-fast), border-color var(--duration-fast)'
    }
  }, checked && !indeterminate && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: "3"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 13 5 5 9-9"
  })), indeterminate && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 2,
      background: 'white',
      borderRadius: 1
    }
  })), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "checkbox",
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    },
    ref: ref
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Single-line text input with optional label, hint, and error state. */
function Input({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon = null,
  disabled = false,
  style: styleOverride,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      border: `1px solid ${error ? 'var(--db-danger-500)' : focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '0 12px',
      height: 40,
      background: disabled ? 'var(--db-slate-50)' : 'var(--surface-card)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)'
    }
  }, icon, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
      border: 'none',
      outline: 'none',
      flex: 1,
      background: 'transparent',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      ...styleOverride
    }
  }))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--db-danger-500)' : 'var(--text-tertiary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/** Single radio button, used within a RadioGroup-style mapped list. */
function Radio({
  label,
  checked,
  onChange,
  name,
  disabled = false
}) {
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      flexShrink: 0,
      border: `1.5px solid ${checked ? 'var(--db-blue-500)' : 'var(--border-strong)'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'border-color var(--duration-fast)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--db-blue-500)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "radio",
    name: name,
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Native-backed select dropdown, styled to match Input. */
function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  disabled = false
}) {
  const [focus, setFocus] = React.useState(false);
  const id = React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      border: `1px solid ${focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      height: 40,
      background: disabled ? 'var(--db-slate-50)' : 'var(--surface-card)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--duration-fast)'
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      width: '100%',
      height: '100%',
      padding: '0 36px 0 12px',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    hidden: true
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Toggle switch for boolean settings. */
function Switch({
  label,
  checked,
  onChange,
  disabled = false
}) {
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 22,
      borderRadius: 'var(--radius-pill)',
      position: 'relative',
      flexShrink: 0,
      background: checked ? 'var(--db-blue-500)' : 'var(--db-slate-300)',
      transition: 'background var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 18 : 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--duration-base) var(--ease-standard)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    id: id,
    type: "checkbox",
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
/** Generic content container — the base surface for dashboard panels, list rows, etc. */
function Card({
  children,
  padding = 'var(--space-6)',
  hoverable = false,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => hoverable && setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)'
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Horizontal tab bar for switching between views within a page. */
function Tabs({
  items = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)'
    }
  }, items.map(item => {
    const active = item.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: item.value,
      onClick: () => onChange && onChange(item.value),
      style: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 4px',
        marginBottom: -1,
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        color: active ? 'var(--db-blue-600)' : 'var(--text-secondary)',
        borderBottom: `2px solid ${active ? 'var(--db-blue-500)' : 'transparent'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'color var(--duration-fast)'
      }
    }, item.label, item.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        background: active ? 'var(--db-blue-50)' : 'var(--db-slate-100)',
        color: active ? 'var(--db-blue-700)' : 'var(--text-tertiary)',
        fontSize: 11,
        fontWeight: 600,
        padding: '1px 7px',
        borderRadius: 'var(--radius-pill)'
      }
    }, item.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/App.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  IconButton,
  Badge,
  Tag,
  Input,
  Select,
  Tabs,
  Card,
  Dialog,
  Toast,
  Tooltip
} = window.DreamBricksDesignSystem_6b66b1;
const Icons = window.DBIcons;
const {
  PROJECTS,
  ACTIVITY
} = window.DASHBOARD_DATA;
const STATUS_TONE = {
  active: 'brand',
  at_risk: 'warning',
  completed: 'success'
};
const STATUS_LABEL = {
  active: 'Active',
  at_risk: 'At risk',
  completed: 'Completed'
};
function Avatar({
  initials,
  size = 28
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--db-blue-100)',
      color: 'var(--db-blue-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 700,
      border: '2px solid var(--surface-card)',
      marginLeft: -8,
      fontFamily: 'var(--font-body)'
    }
  }, initials);
}
function Logo({
  variant = 'onblue',
  style
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: `../../assets/logos/dreambricks-horizontal-${variant}.svg`,
    style: {
      height: 28,
      ...style
    },
    alt: "DreamBricks"
  });
}

/* ---------------- Login ---------------- */
function LoginScreen({
  onLogin
}) {
  const [email, setEmail] = React.useState('ana@dreambricks.com');
  const [password, setPassword] = React.useState('••••••••');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--db-blue-500)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 48,
      boxSizing: 'border-box',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "onblue"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 380,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 40,
      fontWeight: 800,
      lineHeight: 1.15,
      margin: '0 0 12px'
    }
  }, "Every project, one clear picture."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      fontWeight: 300,
      opacity: 0.9
    }
  }, "Track what's underway and see what's already shipped \u2014 all in one dashboard.")), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/jobson-mascot-walking.png",
    style: {
      width: 150,
      opacity: 0.95,
      alignSelf: 'flex-end'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 440,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: '0 0 4px'
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      margin: '0 0 28px'
    }
  }, "Sign in to your DreamBricks account."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    icon: /*#__PURE__*/React.createElement(Icons.Mail, {
      size: 16,
      style: {
        color: 'var(--text-tertiary)'
      }
    }),
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    icon: /*#__PURE__*/React.createElement(Icons.Lock, {
      size: 16,
      style: {
        color: 'var(--text-tertiary)'
      }
    }),
    value: password,
    onChange: e => setPassword(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    onClick: onLogin,
    style: {
      marginTop: 8
    }
  }, "Sign in")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)',
      marginTop: 20,
      textAlign: 'center'
    }
  }, "Prototype \u2014 any credentials will work."))));
}

/* ---------------- Shell (sidebar + topbar) ---------------- */
function Sidebar({
  activeNav,
  onNav,
  onLogout
}) {
  const items = [{
    key: 'home',
    label: 'Overview',
    icon: Icons.Home
  }, {
    key: 'projects',
    label: 'Projects',
    icon: Icons.Folder
  }, {
    key: 'team',
    label: 'Team',
    icon: Icons.Users
  }, {
    key: 'settings',
    label: 'Settings',
    icon: Icons.Settings
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      flexShrink: 0,
      background: 'var(--db-blue-900)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      boxSizing: 'border-box',
      height: '100vh',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 8px 24px'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "onblue"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, items.map(item => {
    const active = activeNav === item.key;
    const Ico = item.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: item.key,
      onClick: () => onNav(item.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.72)',
        transition: 'background 120ms'
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      size: 17
    }), item.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/jobson-and-cat-small.png",
    style: {
      width: '100%',
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--font-body)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icons.LogOut, {
    size: 16
  }), "Log out")));
}
function TopBar({
  title,
  onSearch
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 32px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search projects\u2026",
    icon: /*#__PURE__*/React.createElement(Icons.Search, {
      size: 15,
      style: {
        color: 'var(--text-tertiary)'
      }
    })
  })), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Notifications"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: /*#__PURE__*/React.createElement(Icons.Bell, {
      size: 17
    }),
    label: "Notifications"
  })), /*#__PURE__*/React.createElement(Avatar, {
    initials: "AL",
    size: 34
  })));
}

/* ---------------- Dashboard home ---------------- */
function StatCard({
  label,
  value,
  sub,
  tone
}) {
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      fontWeight: 500,
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      color: tone || 'var(--text-primary)',
      lineHeight: 1
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)',
      marginTop: 6
    }
  }, sub));
}
function ProjectCard({
  project,
  onOpen
}) {
  return /*#__PURE__*/React.createElement(Card, {
    hoverable: true,
    onClick: () => onOpen(project)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[project.status],
    dot: true
  }, STATUS_LABEL[project.status]), /*#__PURE__*/React.createElement(Icons.ChevronRight, {
    size: 16,
    style: {
      color: 'var(--text-tertiary)'
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: '0 0 4px'
    }
  }, project.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      margin: '0 0 16px'
    }
  }, project.client), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'var(--db-slate-100)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${project.progress}%`,
      background: project.status === 'at_risk' ? 'var(--db-warning-500)' : 'var(--db-blue-500)',
      borderRadius: 'var(--radius-pill)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icons.Calendar, {
    size: 13
  }), project.due), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, project.team.map(t => /*#__PURE__*/React.createElement(Avatar, {
    key: t,
    initials: t,
    size: 24
  })))));
}
function DashboardHome({
  onOpenProject
}) {
  const [tab, setTab] = React.useState('all');
  const filtered = PROJECTS.filter(p => tab === 'all' ? true : tab === 'active' ? p.status !== 'completed' : p.status === 'completed');
  const activeCount = PROJECTS.filter(p => p.status !== 'completed').length;
  const completedCount = PROJECTS.filter(p => p.status === 'completed').length;
  const atRisk = PROJECTS.filter(p => p.status === 'at_risk').length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Active projects",
    value: activeCount,
    sub: "Across 5 clients"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Completed",
    value: completedCount,
    sub: "This quarter",
    tone: "var(--db-success-500)"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "At risk",
    value: atRisk,
    sub: "Needs attention",
    tone: "var(--db-warning-500)"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Team members",
    value: "6",
    sub: "3 currently assigned"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      value: 'all',
      label: 'All projects',
      count: PROJECTS.length
    }, {
      value: 'active',
      label: 'Active',
      count: activeCount
    }, {
      value: 'completed',
      label: 'Completed',
      count: completedCount
    }],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      marginTop: 20
    }
  }, filtered.map(p => /*#__PURE__*/React.createElement(ProjectCard, {
    key: p.id,
    project: p,
    onOpen: onOpenProject
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      margin: '0 0 14px',
      color: 'var(--text-primary)'
    }
  }, "Recent activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: a.who.split(' ').map(w => w[0]).join(''),
    size: 26
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("b", null, a.who), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, a.what), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--db-blue-600)'
    }
  }, a.project)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--text-tertiary)'
    }
  }, a.when))))));
}

/* ---------------- Project detail ---------------- */
function ProjectDetail({
  project,
  onBack
}) {
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      border: 'none',
      background: 'transparent',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      fontSize: 13,
      marginBottom: 16,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icons.ArrowLeft, {
    size: 15
  }), "Back to projects"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[project.status],
    dot: true
  }, STATUS_LABEL[project.status]), /*#__PURE__*/React.createElement(Tag, {
    color: "var(--db-blue-500)"
  }, project.client)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, project.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setToast({
      tone: 'success',
      title: 'Link copied',
      message: 'Shareable link copied to clipboard.'
    })
  }, "Share"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    icon: /*#__PURE__*/React.createElement(Icons.Trash, {
      size: 15
    }),
    onClick: () => setArchiveOpen(true)
  }, "Archive"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      margin: '0 0 8px'
    }
  }, "About"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.6,
      margin: 0
    }
  }, project.description)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      margin: '0 0 14px'
    }
  }, "Progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'var(--db-slate-100)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${project.progress}%`,
      background: project.status === 'at_risk' ? 'var(--db-warning-500)' : 'var(--db-blue-500)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, project.progress, "% complete \xB7 due ", project.due)), project.status === 'at_risk' && /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--db-warning-100)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icons.AlertTriangle, {
    size: 18,
    style: {
      color: '#8a5a00',
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: '#5c3d00'
    }
  }, "This project needs attention"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#5c3d00'
    }
  }, "Timeline slipped 6 days behind schedule. Review with the team."))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      margin: '0 0 14px'
    }
  }, "Team"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, project.team.map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: t,
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)'
    }
  }, t))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: archiveOpen,
    onClose: () => setArchiveOpen(false),
    title: "Archive this project?",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setArchiveOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => {
        setArchiveOpen(false);
        setToast({
          tone: 'info',
          title: 'Project archived'
        });
      }
    }, "Archive"))
  }, project.name, " will move to Archived. You can restore it from Settings within 30 days."), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      right: 24
    }
  }, /*#__PURE__*/React.createElement(Toast, _extends({}, toast, {
    onClose: () => setToast(null)
  }))));
}

/* ---------------- App shell ---------------- */
function App() {
  const [screen, setScreen] = React.useState('login');
  const [activeNav, setActiveNav] = React.useState('home');
  const [selectedProject, setSelectedProject] = React.useState(null);
  if (screen === 'login') return /*#__PURE__*/React.createElement(LoginScreen, {
    onLogin: () => setScreen('app')
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: 'var(--surface-page)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    activeNav: activeNav,
    onNav: key => {
      setActiveNav(key);
      setSelectedProject(null);
    },
    onLogout: () => setScreen('login')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, !selectedProject && /*#__PURE__*/React.createElement(TopBar, {
    title: activeNav === 'home' ? 'Overview' : activeNav === 'projects' ? 'Projects' : activeNav === 'team' ? 'Team' : 'Settings'
  }), selectedProject ? /*#__PURE__*/React.createElement(ProjectDetail, {
    project: selectedProject,
    onBack: () => setSelectedProject(null)
  }) : /*#__PURE__*/React.createElement(DashboardHome, {
    onOpenProject: setSelectedProject
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  path,
  size = 18,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, rest), path);
}
const Icons = {
  Home: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "m3 11 9-8 9 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    })
  })),
  Folder: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
    })
  })),
  Users: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "8",
      r: "3.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2.5 19c.7-3 3-4.7 6.5-4.7s5.8 1.7 6.5 4.7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17",
      cy: "9",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15.5 14.4c2.7.3 4.4 1.8 5 4.6"
    }))
  })),
  Settings: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10c.1.7.5 1.3 1.1 1.6H20a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z"
    }))
  })),
  Search: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m21 21-4.3-4.3"
    }))
  })),
  Bell: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 18a3 3 0 0 0 6 0"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 15v-5a7 7 0 0 1 14 0v5l1.7 2.5a1 1 0 0 1-.8 1.5H4.1a1 1 0 0 1-.8-1.5Z"
    }))
  })),
  Plus: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "M12 5v14M5 12h14"
    })
  })),
  ChevronRight: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "m9 18 6-6-6-6"
    })
  })),
  ChevronLeft: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "m15 18-6-6 6-6"
    })
  })),
  LogOut: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m16 17 5-5-5-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 12H9"
    }))
  })),
  Check: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "M20 6 9 17l-5-5"
    })
  })),
  AlertTriangle: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9v4M12 17h.01"
    }))
  })),
  Trash: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
    })
  })),
  Calendar: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4.5",
      width: "18",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 3v3M8 3v3M3 9.5h18"
    }))
  })),
  ArrowLeft: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement("path", {
      d: "m12 19-7-7 7-7M5 12h14"
    })
  })),
  Mail: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "5",
      width: "18",
      height: "14",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m3 7 9 6 9-6"
    }))
  })),
  Lock: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    path: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "10",
      width: "16",
      height: "10",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 10V7a4 4 0 0 1 8 0v3"
    }))
  }))
};
window.DBIcons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/data.js
try { (() => {
(function () {
  const PROJECTS = [{
    id: 'p1',
    name: 'Q3 Rebrand',
    client: 'Internal',
    status: 'active',
    progress: 62,
    due: 'Aug 14, 2026',
    team: ['AL', 'RM', 'JT'],
    description: 'Refresh the DreamBricks visual identity across web, deck, and product surfaces.'
  }, {
    id: 'p2',
    name: 'Mobile Onboarding Revamp',
    client: 'Internal',
    status: 'active',
    progress: 30,
    due: 'Sep 2, 2026',
    team: ['KP', 'AL'],
    description: 'Redesign first-run flow to reduce signup drop-off.'
  }, {
    id: 'p3',
    name: 'Bricko Retail — Storefront',
    client: 'Bricko Retail',
    status: 'active',
    progress: 81,
    due: 'Jul 22, 2026',
    team: ['JT', 'MS', 'RM', 'KP'],
    description: 'E-commerce storefront rebuild on the new component library.'
  }, {
    id: 'p4',
    name: 'Nimbus Health — Patient Portal',
    client: 'Nimbus Health',
    status: 'at_risk',
    progress: 45,
    due: 'Jul 18, 2026',
    team: ['AL', 'MS'],
    description: 'Patient-facing portal for appointment scheduling and records.'
  }, {
    id: 'p5',
    name: 'Atlas Freight — Ops Dashboard',
    client: 'Atlas Freight',
    status: 'completed',
    progress: 100,
    due: 'Jun 30, 2026',
    team: ['RM', 'JT'],
    description: 'Fleet tracking dashboard delivered and handed off.'
  }, {
    id: 'p6',
    name: 'Coral Bank — Statement Redesign',
    client: 'Coral Bank',
    status: 'completed',
    progress: 100,
    due: 'Jun 12, 2026',
    team: ['KP', 'AL', 'MS'],
    description: 'Monthly statement PDF + in-app equivalent redesign.'
  }, {
    id: 'p7',
    name: 'Internal — Design System v2',
    client: 'Internal',
    status: 'completed',
    progress: 100,
    due: 'May 28, 2026',
    team: ['JT'],
    description: 'Migrated component library to the new token architecture.'
  }];
  const ACTIVITY = [{
    who: 'Ana L.',
    what: 'marked "Wireframe review" complete',
    project: 'Q3 Rebrand',
    when: '2h ago'
  }, {
    who: 'Rafa M.',
    what: 'uploaded 4 new assets',
    project: 'Bricko Retail — Storefront',
    when: '5h ago'
  }, {
    who: 'Marina S.',
    what: 'flagged a blocker',
    project: 'Nimbus Health — Patient Portal',
    when: 'Yesterday'
  }, {
    who: 'Kaio P.',
    what: 'closed the project',
    project: 'Coral Bank — Statement Redesign',
    when: '2 days ago'
  }];
  window.DASHBOARD_DATA = {
    PROJECTS,
    ACTIVITY
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
