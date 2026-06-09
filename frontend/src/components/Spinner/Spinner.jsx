import './Spinner.css';

/**
 * Spinner component
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size
 * @param {'primary'|'white'|'gray'|'success'} props.color
 * @param {string} props.label - accessible label
 * @param {boolean} props.centered - centers in container
 * @param {boolean} props.fullPage - fullscreen overlay
 * @param {'spin'|'dots'} props.variant
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  label = 'Loading…',
  centered = false,
  fullPage = false,
  variant = 'spin',
}) => {
  if (fullPage) {
    return (
      <div className="spinner-page" role="status" aria-label={label}>
        <div className={`spinner spinner-${size} spinner-${color}`} />
        <p className="spinner-page-text">{label}</p>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        className={centered ? 'spinner-centered' : 'spinner-wrapper'}
        role="status"
        aria-label={label}
      >
        <div className="spinner-dots">
          <div className="spinner-dot" />
          <div className="spinner-dot" />
          <div className="spinner-dot" />
        </div>
        {centered && <span className="spinner-label">{label}</span>}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (centered) {
    return (
      <div className="spinner-centered" role="status" aria-label={label}>
        <div className={`spinner spinner-${size} spinner-${color}`} aria-hidden="true" />
        <span className="spinner-label">{label}</span>
      </div>
    );
  }

  return (
    <div className="spinner-wrapper" role="status" aria-label={label}>
      <div
        className={`spinner spinner-${size} spinner-${color}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
