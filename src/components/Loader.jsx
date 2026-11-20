import React from 'react';

/**
 * Reusable Animated Loader Component
 * Supports inline or full-screen overlay mode.
 */
export const Loader = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  message = '',
  fullScreen = false
}) => {
  const content = (
    <div className={`loader-wrapper ${fullScreen ? 'loader-fullscreen' : ''}`}>
      <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  return content;
};

export default Loader;
