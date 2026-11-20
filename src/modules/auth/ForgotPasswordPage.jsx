import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import AuthInput from './components/AuthInput';
import { validateResetPasswordForm, getAuthErrorMessage } from './authUtils';
import './AuthForm.css';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const { resetPassword, currentUser, isConfigured } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  // Cooldown timer to prevent spam
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;

    setFormError('');
    setSuccessMsg('');

    // Input Validation
    const validation = validateResetPasswordForm({ email });
    if (!validation.isValid) {
      setFormError(validation.error);
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSuccessMsg(
        `Password reset instructions have been sent to ${email.trim()}. Please check your inbox (and spam folder).`
      );
      setCooldown(60); // 60-second cooldown
    } catch (err) {
      const friendlyMsg = getAuthErrorMessage(err.code);
      setFormError(friendlyMsg || err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
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
          <h1>Reset Password</h1>
          <p>Enter your registered email to receive password recovery instructions.</p>
        </div>

        {/* Dev Mode Warning */}
        {!isConfigured && (
          <div className="alert alert-warning" role="alert">
            <AlertCircle size={18} />
            <div>
              <strong>Developer Mode:</strong> Connect Firebase in <code>.env</code> to test live password reset emails.
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

          <form onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="forgot-email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Mail}
              isLoading={loading}
              disabled={loading || cooldown > 0}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Reset Link'}
            </Button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
