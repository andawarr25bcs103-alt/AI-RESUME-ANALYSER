import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName || !email || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 16px' }}>
      <PageHeader
        title="Create Account"
        description="Register to begin analyzing resumes with ResuMate AI."
        badge="Module 1: Auth"
        icon={UserPlus}
      />

      {!isConfigured && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Developer Mode Active:</strong> Firebase credentials are not yet configured in <code>.env</code>.
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              placeholder="Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              className="form-input"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={UserPlus}
            isLoading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Create Free Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: 'var(--font-sm)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>

      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <ShieldCheck size={16} /> Module 1: Registration Flow
          </span>
          <span className="badge badge-secondary">Module 1</span>
        </div>
        <ul className="dev-guidance-list">
          <li>Creates Firebase auth account and updates profile <code>displayName</code>.</li>
          <li>Redirects directly to <code>/dashboard</code> on successful registration.</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterPage;
