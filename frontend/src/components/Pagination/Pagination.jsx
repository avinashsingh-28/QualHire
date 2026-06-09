import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import './Pagination.css';

const DOTS = '...';

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const usePaginationRange = (current, total, siblings = 1) => {
  const totalPageNumbers = siblings * 2 + 5; // first + last + dots*2 + current + siblings*2

  if (total <= totalPageNumbers) return range(1, total);

  const leftSibling  = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftDots  = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblings;
    return [...range(1, leftCount), DOTS, total];
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblings;
    return [1, DOTS, ...range(total - rightCount + 1, total)];
  }

  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, total];
};

/**
 * Pagination component
 * @param {number} props.page - current page (1-based)
 * @param {number} props.totalPages
 * @param {function} props.onChange
 * @param {'sm'|'md'|'lg'} props.size
 * @param {boolean} props.showInfo
 * @param {number} props.total - total item count (for info display)
 * @param {number} props.pageSize
 */
const Pagination = ({
  page,
  totalPages,
  onChange,
  size = 'md',
  showInfo = false,
  total,
  pageSize,
  siblings = 1,
}) => {
  const pages = usePaginationRange(page, totalPages, siblings);

  if (totalPages <= 1) return null;

  return (
    <nav
      className={`pagination pagination-${size}`}
      role="navigation"
      aria-label="Pagination"
    >
      <button
        className="pagination-btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) =>
        p === DOTS ? (
          <span key={`dots-${idx}`} className="pagination-ellipsis" aria-hidden="true">
            <MoreHorizontal size={14} />
          </span>
        ) : (
          <button
            key={p}
            className={`pagination-btn ${p === page ? 'pagination-btn-active' : ''}`}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pagination-btn"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>

      {showInfo && total != null && pageSize && (
        <span className="pagination-info">
          {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
        </span>
      )}
    </nav>
  );
};

export default Pagination;
