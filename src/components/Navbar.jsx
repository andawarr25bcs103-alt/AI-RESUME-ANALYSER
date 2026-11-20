import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Sparkles, LogOut, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

/**
 * Top Application Navbar
 * Displays branding, mobile navigation toggle, and user authentication status.
 */
export const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, logout, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span className="brand-name">
            RESUMATE <span>AI</span>
          </span>
        </Link>
      </div>

      <div className="navbar-right">
        {!isConfigured && (
          <span className="badge badge-warning" title="Configure .env with Firebase credentials for live auth">
            Dev Mode
          </span>
        )}

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-profile-pill">
              <div className="user-avatar">
                {getInitials(currentUser.displayName, currentUser.email)}
              </div>
              <span style={{ fontWeight: 500, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.displayName || currentUser.email}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              title="Sign Out"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="ghost"
              size="sm"
              icon={LogIn}
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={User}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
