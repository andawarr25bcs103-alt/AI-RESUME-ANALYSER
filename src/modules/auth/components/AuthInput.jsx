import React from 'react';

/**
 * Reusable Auth Input with optional icon, accessible label, and validation error message.
 */
export const AuthInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  autoComplete,
  ...rest
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <span
            className="auth-input-icon"
            style={{
              position: 'absolute',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none'
            }}
          >
            <Icon size={18} />
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`form-input ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          style={Icon ? { paddingLeft: '40px' } : undefined}
          {...rest}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default AuthInput;
