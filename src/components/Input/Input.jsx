import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import './Input.css';

/**
 * Input component
 * @param {object} props
 * @param {string}  props.label
 * @param {string}  props.id
 * @param {string}  props.error
 * @param {string}  props.helperText
 * @param {boolean} props.required
 * @param {'sm'|'md'|'lg'} props.size
 * @param {React.ReactNode} props.prefixIcon
 * @param {React.ReactNode} props.suffixIcon
 * @param {boolean} props.as - 'textarea' to render a textarea
 */
const Input = forwardRef(({
  label,
  id,
  error,
  helperText,
  required = false,
  size = 'md',
  prefixIcon,
  suffixIcon,
  as: Tag = 'input',
  className = '',
  ...props
}, ref) => {
  const fieldClasses = [
    'input-field',
    error ? 'input-error' : '',
    suffixIcon ? 'has-suffix' : '',
    Tag === 'textarea' ? 'input-textarea' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={`input-wrapper input-${size}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-field-wrapper">
        {prefixIcon && (
          <span className="input-prefix" aria-hidden="true">
            {prefixIcon}
          </span>
        )}

        <Tag
          ref={ref}
          id={id}
          className={fieldClasses}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        />

        {suffixIcon && (
          <span className="input-suffix" aria-hidden="true">
            {suffixIcon}
          </span>
        )}
      </div>

      {error && (
        <span id={`${id}-error`} className="input-error-text" role="alert">
          <AlertCircle size={12} />
          {error}
        </span>
      )}

      {helperText && !error && (
        <span id={`${id}-helper`} className="input-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
