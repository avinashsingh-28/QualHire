import { Inbox } from 'lucide-react';
import './EmptyState.css';

/**
 * EmptyState component
 * @param {React.ReactNode} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ReactNode} props.action - CTA button or element
 * @param {React.ReactNode} props.secondaryAction
 * @param {'sm'|'md'|'lg'} props.size
 */
const EmptyState = ({
  icon = <Inbox size={32} />,
  title = 'Nothing here yet',
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
}) => (
  <div className={`empty-state empty-state-${size} ${className}`} aria-live="polite">
    <div className="empty-state-icon-wrapper" aria-hidden="true">
      {icon}
    </div>

    <div className="empty-state-content">
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
    </div>

    {(action || secondaryAction) && (
      <div className="empty-state-actions">
        {action}
        {secondaryAction}
      </div>
    )}
  </div>
);

export default EmptyState;
