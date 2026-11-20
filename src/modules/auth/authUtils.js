/**
 * Auth Module Utilities
 * Validation helpers, password strength calculator, and Firebase Auth error message mappings.
 */

/**
 * Validates an email address format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Translate Firebase error codes to friendly, human-readable messages
 * @param {string} errorCode
 * @returns {string}
 */
export const getAuthErrorMessage = (errorCode) => {
  const errorMap = {
    // Sign In & General Auth Errors
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please check your email or register.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/invalid-credential': 'Invalid email or password. Please verify your credentials and try again.',
    'auth/invalid-login-credentials': 'Invalid email or password. Please verify your credentials and try again.',
    'auth/too-many-requests': 'Too many unsuccessful attempts. Please wait a moment and try again, or reset your password.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',

    // Registration Errors
    'auth/email-already-in-use': 'An account with this email address already exists. Please sign in instead.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled. Please contact support.',

    // Popup & Third-Party Auth Errors
    'auth/popup-closed-by-user': 'Sign-in window was closed before completing. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in request was cancelled. Please try again.',
    'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in provider.',

    // Password Reset
    'auth/expired-action-code': 'This password reset link has expired. Please request a new one.',
    'auth/invalid-action-code': 'This password reset link is invalid or has already been used.',
  };

  return errorMap[errorCode] || null;
};

/**
 * Calculate password strength score and label
 * @param {string} password
 * @returns {{ level: 'weak'|'fair'|'good'|'strong'|'', label: string, score: number }}
 */
export const getPasswordStrength = (password) => {
  if (!password) return { level: '', label: '', score: 0 };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 'weak', label: 'Weak', score };
  if (score <= 2) return { level: 'fair', label: 'Fair', score };
  if (score <= 3) return { level: 'good', label: 'Good', score };
  return { level: 'strong', label: 'Strong', score };
};

/**
 * Validate Login Form inputs
 * @param {{ email?: string, password?: string }} fields
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateLoginForm = ({ email, password }) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Please enter your email address.' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  if (!password) {
    return { isValid: false, error: 'Please enter your password.' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate Registration Form inputs
 * @param {{ fullName?: string, email?: string, password?: string, confirmPassword?: string, agreeTerms?: boolean }} fields
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateRegisterForm = ({ fullName, email, password, confirmPassword, agreeTerms = true }) => {
  if (!fullName || !fullName.trim()) {
    return { isValid: false, error: 'Please enter your full name.' };
  }

  if (fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long.' };
  }

  if (!email || !email.trim()) {
    return { isValid: false, error: 'Please enter your email address.' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  if (!password) {
    return { isValid: false, error: 'Please enter a password.' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match. Please re-enter.' };
  }

  if (!agreeTerms) {
    return { isValid: false, error: 'You must accept the Terms and Conditions to proceed.' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate Password Reset Form inputs
 * @param {{ email?: string }} fields
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateResetPasswordForm = ({ email }) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Please enter your email address.' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  return { isValid: true, error: '' };
};
