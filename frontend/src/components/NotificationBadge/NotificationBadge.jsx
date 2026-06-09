import './NotificationBadge.css';

const MAX_COUNT = 99;

/**
 * NotificationBadge wraps any element with a positioned badge
 * @param {number}  props.count - notification count (0 hides badge)
 * @param {boolean} props.dot   - show dot instead of count
 * @param {boolean} props.ping  - animated ping ring
 * @param {'top-right'|'top-left'|'bottom-right'} props.position
 * @param {'danger'|'primary'|'success'|'warning'|'info'} props.color
 * @param {boolean} props.inline - render as inline element (no absolute)
 */
const NotificationBadge = ({
  children,
  count = 0,
  dot = false,
  ping = false,
  position = 'top-right',
  color = 'danger',
  inline = false,
}) => {
  const showBadge = dot || count > 0;
  const displayCount = count > MAX_COUNT ? `${MAX_COUNT}+` : count;
  const isLarge = count > 9;

  return (
    <div className="notification-badge-wrapper">
      {children}

      {showBadge && (
        <span
          className={[
            'notification-badge',
            dot
              ? 'notification-badge-dot'
              : `notification-badge-count ${isLarge ? 'badge-large' : ''}`,
            `notification-badge-${position}`,
            `notification-badge-${color}`,
            ping ? 'notification-badge-ping' : '',
            inline ? 'notification-badge-inline' : '',
          ].filter(Boolean).join(' ')}
          aria-label={dot ? 'New notification' : `${displayCount} notifications`}
          role="status"
        >
          {!dot && displayCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
