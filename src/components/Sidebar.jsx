import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Sparkles,
  Briefcase,
  Target,
  Lightbulb,
  FileText,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

/**
 * Sidebar Navigation Component
 * Provides direct links to all 7 modules, tracks active resume state,
 * and displays active user session with quick logout option.
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const { resumeFile, resumeText, resetAnalysis } = useApp();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/upload-resume', label: 'Resume Upload', icon: UploadCloud, badge: 'Mod 2' },
    { to: '/ai-analysis', label: 'AI Analysis', icon: Sparkles, badge: 'Mod 3' },
    { to: '/job-matching', label: 'Job Matching', icon: Briefcase, badge: 'Mod 4' },
    { to: '/skill-gap', label: 'Skill Gap', icon: Target, badge: 'Mod 5' },
    { to: '/improvements', label: 'Suggestions', icon: Lightbulb, badge: 'Mod 6' },
    { to: '/reports', label: 'Reports & Summary', icon: FileText, badge: 'Mod 7' }
  ];

  const handleReset = () => {
    if (window.confirm('Reset current resume and all analysis data?')) {
      resetAnalysis();
      navigate('/upload-resume');
      if (onClose) onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) onClose();
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
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <span className="brand-name">
              RESUMATE <span>AI</span>
            </span>
          </div>

          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Analysis Modules</span>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* Active Resume Status Card */}
          <div className="resume-status-card">
            <div className="resume-status-header">
              <span>ACTIVE RESUME</span>
              {resumeText ? (
                <CheckCircle size={14} color="var(--color-success)" />
              ) : (
                <AlertCircle size={14} color="var(--color-warning)" />
              )}
            </div>

            {resumeFile || resumeText ? (
              <div>
                <p className="resume-status-name" title={resumeFile?.name || 'Parsed Resume'}>
                  {resumeFile?.name || 'Text Resume Loaded'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  ~{resumeText ? resumeText.trim().split(/\s+/).length : 0} words parsed
                </p>
                <div style={{ marginTop: '8px' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={handleReset}
                    style={{ width: '100%', fontSize: '11px', padding: '4px 8px' }}
                  >
                    Reset Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                  No resume loaded yet.
                </p>
                <div style={{ marginTop: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigate('/upload-resume');
                      if (onClose) onClose();
                    }}
                    style={{ width: '100%', fontSize: '11px', padding: '4px 8px' }}
                  >
                    Upload Resume
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Session & Logout in Sidebar */}
          {currentUser && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                  {getInitials(currentUser.displayName, currentUser.email)}
                </div>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {currentUser.displayName || 'User'}
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
                title="Sign Out"
                style={{ padding: '6px' }}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
