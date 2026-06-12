import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

/**
 * SearchBar with debounce and clear button
 * @param {function} props.onSearch - called with the current query after debounce
 * @param {number}   props.debounce - ms delay (default 300)
 * @param {'sm'|'md'|'lg'} props.size
 * @param {'default'|'filled'} props.variant
 */
const SearchBar = ({
  placeholder = 'Search…',
  onSearch,
  debounce: debounceMs = 300,
  size = 'md',
  variant = 'default',
  defaultValue = '',
  className = '',
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef(null);

  const handleChange = useCallback((e) => {
    const q = e.target.value;
    setValue(q);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch?.(q);
    }, debounceMs);
  }, [onSearch, debounceMs]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch?.('');
  }, [onSearch]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const wrapperClasses = [
    'searchbar-wrapper',
    `searchbar-${size}`,
    variant !== 'default' ? `searchbar-${variant}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <span className="searchbar-icon" aria-hidden="true">
        <Search size={16} />
      </span>

      <input
        type="search"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label={placeholder}
        {...props}
      />

      {value && (
        <button
          className="searchbar-clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
