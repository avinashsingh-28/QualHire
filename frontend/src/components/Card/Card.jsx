import './Card.css';

/**
 * Card component
 * @param {'none'|'sm'|'md'|'lg'} props.padding
 * @param {'none'|'sm'|'md'|'lg'} props.shadow
 * @param {boolean} props.hoverable
 * @param {boolean} props.highlighted
 * @param {'default'|'glass'|'flat'} props.variant
 */
const Card = ({
  children,
  padding = 'md',
  shadow = 'sm',
  hoverable = false,
  highlighted = false,
  variant = 'default',
  className = '',
  as: Tag = 'div',
  ...props
}) => {
  const classes = [
    'card',
    `card-padding-${padding}`,
    `card-shadow-${shadow}`,
    hoverable    ? 'card-hoverable'    : '',
    highlighted  ? 'card-highlighted'  : '',
    variant !== 'default' ? `card-${variant}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

/**
 * StatCard component for dashboard metrics
 */
const StatCard = ({
  label,
  value,
  icon,
  iconBg = 'rgba(99,102,241,0.12)',
  iconColor = 'var(--color-primary)',
  trend,
  trendDirection = 'up',
  trendLabel,
}) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
      <div
        className="stat-card-icon"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`stat-card-trend ${trendDirection}`}>
        <span>{trendDirection === 'up' ? '↑' : '↓'} {trend}</span>
        {trendLabel && <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>{trendLabel}</span>}
      </div>
    )}
  </div>
);

export { StatCard };
export default Card;
