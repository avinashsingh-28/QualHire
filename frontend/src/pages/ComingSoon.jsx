import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

/**
 * Reusable placeholder page for not-yet-built sub-pages
 */
const ComingSoon = ({
  icon,
  title = 'Coming Soon',
  description = 'This page is under construction. Check back soon!',
  backPath,
  backLabel = 'Go back',
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={
          backPath
            ? <Button variant="primary" onClick={() => navigate(backPath)}>{backLabel}</Button>
            : undefined
        }
      />
    </div>
  );
};

export default ComingSoon;
