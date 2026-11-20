import React from 'react';

/**
 * Reusable Button Component
 * Supports multiple variants, sizes, icon prefixes, and loading state.
 */
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`resumate-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {isLoading ? (
        <span className="spinner spinner-sm" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
