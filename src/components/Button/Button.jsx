import './Button.css';

/**
 * Button component
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'outline'|'danger'|'success'} props.variant
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size
 * @param {boolean} props.loading
 * @param {boolean} props.fullWidth
 * @param {boolean} props.iconOnly
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 * @param {string} props.as - HTML element or component to render as
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconOnly = false,
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  as: Tag = 'button',
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading   ? 'btn-loading'   : '',
    fullWidth  ? 'btn-full'     : '',
    iconOnly   ? 'btn-icon-only': '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      disabled={Tag === 'button' ? (disabled || loading) : undefined}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="btn-icon" aria-hidden="true">{leftIcon}</span>
      ) : null}

      {!iconOnly && children}

      {!loading && rightIcon && (
        <span className="btn-icon" aria-hidden="true">{rightIcon}</span>
      )}
    </Tag>
  );
};

export default Button;
