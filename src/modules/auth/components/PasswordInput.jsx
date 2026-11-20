import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * Reusable Password Input with show/hide toggle, leading lock icon,
 * and optional strength indicator.
 */
export const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  error,
  required = false,
  disabled = false,
  autoComplete = 'current-password',
  rightHeaderAction = null,
  strength = null,
  matchHint = null,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {label && (
          <label className="form-label" htmlFor={id}>
            {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
          </label>
        )}
        {rightHeaderAction}
      </div>

      <div className="password-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
          <Lock size={18} />
        </span>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`form-input ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          style={{ paddingLeft: '40px', paddingRight: '44px' }}
          {...rest}
        />

        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Optional Strength Bar */}
      {strength && value && (
        <div className="password-strength">
          <div className="password-strength-bar">
            <div className={`password-strength-fill strength-${strength.level}`} />
          </div>
          <span className={`password-strength-label strength-${strength.level}`}>
            Strength: {strength.label}
          </span>
        </div>
      )}

      {/* Match Hint */}
      {matchHint}

      {/* Error */}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default PasswordInput;
