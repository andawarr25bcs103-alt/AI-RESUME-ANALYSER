import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FileUp, Sparkles, ShieldCheck } from 'lucide-react';
import ResumeUploadPage from './ResumeUploadPage';
import AiAnalysisPage from '../ai-analysis/AiAnalysisPage';

/**
 * Standalone Development Shell for Module 2: Resume Upload & Text Extraction.
 * Renders ONLY Module 2 in strict isolation without Dashboard, Login, Sidebar,
 * or unrelated modules, while preserving router capability for "Continue to AI Analysis".
 */
export const StandaloneUploadApp = () => {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-family-sans, Inter, sans-serif)'
        }}
      >
        {/* Module Header Bar - Blue & Purple Accent Brand Styling */}
        <header
          style={{
            height: '68px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          {/* Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)'
              }}
            >
              <FileUp size={20} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                RESUMATE <span style={{ color: '#6366F1' }}>AI</span>
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  fontWeight: 500
                }}
              >
                Module 2 &bull; Standalone Resume Upload &amp; Text Extraction
              </div>
            </div>
          </div>

          {/* Module Mode & Privacy Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0'
              }}
            >
              <ShieldCheck size={14} /> Client-Side Privacy
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                border: '1px solid #E0E7FF'
              }}
            >
              <Sparkles size={14} /> Standalone Dev Mode
            </span>
          </div>
        </header>

        {/* Main Workspace Container */}
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 24px 48px 24px'
          }}
        >
          <Routes>
            {/* Direct default route opens Resume Upload Module */}
            <Route path="/" element={<ResumeUploadPage />} />
            <Route path="/upload-resume" element={<ResumeUploadPage />} />
            {/* Allow continuation to AI Analysis when user clicks Continue */}
            <Route path="/ai-analysis" element={<AiAnalysisPage />} />
            {/* Catch-all redirect to upload */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default StandaloneUploadApp;
