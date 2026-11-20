import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { resetPassword, isConfigured } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccessMsg('Password reset instructions have been sent to your email.');
    } catch (err) {
      setFormError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 16px' }}>
      <PageHeader
        title="Reset Password"
        description="Enter your registered email address to receive password reset instructions."
        badge="Module 1: Auth"
        icon={KeyRound}
      />

      {!isConfigured && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Developer Mode:</strong> Connect Firebase in <code>.env</code> to test live password reset emails.
          </div>
        </div>
      )}

      <div className="resumate-card">
        {formError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              className="form-input"
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Mail}
            isLoading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Send Reset Link
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: 'var(--font-sm)' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Back to Sign In
          </Link>
        </div>
      </div>

      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <ShieldCheck size={16} /> Module 1: Password Reset
          </span>
          <span className="badge badge-secondary">Module 1</span>
        </div>
        <ul className="dev-guidance-list">
          <li>Triggers Firebase <code>sendPasswordResetEmail(auth, email)</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
