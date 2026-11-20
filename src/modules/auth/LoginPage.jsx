import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 16px' }}>
      <PageHeader
        title="Welcome Back"
        description="Sign in to your ResuMate AI account to analyze resumes and track job fit."
        badge="Module 1: Auth"
        icon={LogIn}
      />

      {!isConfigured && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Developer Mode Active:</strong> Firebase credentials are not yet configured in <code>.env</code>.
            You can still navigate all modules freely during local development!
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
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="developer@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: 'var(--font-xs)' }}>
                Forgot Password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={LogIn}
            isLoading={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: 'var(--font-sm)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create an Account
          </Link>
        </div>
      </div>

      {/* Developer Contract Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <ShieldCheck size={16} /> Module 1: Auth Integration Notes
          </span>
          <span className="badge badge-secondary">Assigned: Auth Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Service:</strong> Uses <code>src/services/firebase.js</code> via <code>useAuth()</code>.</li>
          <li><strong>Functions:</strong> <code>login(email, password)</code>, <code>register()</code>, <code>logout()</code>.</li>
          <li><strong>State Provided:</strong> <code>currentUser</code>, <code>loading</code>, <code>isConfigured</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
