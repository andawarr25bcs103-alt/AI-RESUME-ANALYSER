import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import AuthInput from './components/AuthInput';
import PasswordInput from './components/PasswordInput';
import { validateRegisterForm, getPasswordStrength, getAuthErrorMessage } from './authUtils';
import './AuthForm.css';

/**
 * Google Logo SVG Component
 */
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, loginWithGoogle, currentUser, isConfigured } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || googleLoading) return; // Prevent duplicate submissions

    setFormError('');
    setSuccessMsg('');

    // Input Validation
    const validation = validateRegisterForm({
      fullName,
      email,
      password,
      confirmPassword,
      agreeTerms
    });

    if (!validation.isValid) {
      setFormError(validation.error);
      return;
    }

    try {
      setLoading(true);
      await register(email.trim(), password, fullName.trim());
      setSuccessMsg('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err.code);
      setFormError(friendlyMsg || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    setFormError('');
    setSuccessMsg('');

    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        const friendlyMsg = getAuthErrorMessage(err.code);
        setFormError(friendlyMsg || err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand" aria-label="Go to RESUMATE AI homepage">
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <span className="brand-name">
              RESUMATE <span>AI</span>
            </span>
          </Link>
          <h1>Create Account</h1>
          <p>Register to begin analyzing resumes and optimizing for ATS systems.</p>
        </div>

        {/* Dev Mode Warning */}
        {!isConfigured && (
          <div className="alert alert-warning" role="alert">
            <AlertCircle size={18} />
            <div>
              <strong>Developer Mode Active:</strong> Firebase credentials are not yet configured in <code>.env</code>.
              You can explore all modules freely during local development!
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div className="auth-card auth-form-card">
          {/* Error Message */}
          {formError && (
            <div className="alert alert-danger" role="alert">
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="alert alert-success" role="status">
              <CheckCircle size={18} className="auth-success-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-In */}
          {isConfigured && (
            <>
              <button
                type="button"
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <span className="spinner spinner-sm" aria-hidden="true" />
                ) : (
                  <GoogleLogo />
                )}
                Continue with Google
              </button>

              <div className="auth-divider">or</div>
            </>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="register-name"
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
              disabled={loading || googleLoading}
            />

            <AuthInput
              id="register-email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading || googleLoading}
            />

            <PasswordInput
              id="register-password"
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading || googleLoading}
              strength={passwordStrength}
            />

            <PasswordInput
              id="register-confirm-password"
              label="Confirm Password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading || googleLoading}
              matchHint={
                confirmPassword && password !== confirmPassword ? (
                  <span className="form-error">Passwords do not match</span>
                ) : confirmPassword && password === confirmPassword && password.length >= 6 ? (
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-success)', fontWeight: 500 }}>
                    ✓ Passwords match
                  </span>
                ) : null
              }
            />

            {/* Terms and Conditions Checkbox */}
            <div className="auth-terms-row">
              <input
                id="register-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading || googleLoading}
                required
              />
              <label htmlFor="register-terms" className="auth-checkbox-label">
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={UserPlus}
              isLoading={loading}
              disabled={loading || googleLoading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              Create Free Account
            </Button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
