import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Module 1: Authentication
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';

// Module 2: Resume Upload & Extraction
import ResumeUploadPage from './modules/resume-upload/ResumeUploadPage';
import StandaloneUploadApp from './modules/resume-upload/StandaloneUploadApp';

// Module 3: AI Resume Parsing & Scoring
import AiAnalysisPage from './modules/ai-analysis/AiAnalysisPage';

// Module 4: Job Matching
import JobMatchingPage from './modules/job-matching/JobMatchingPage';

// Module 5: Skill Gap Analysis
import SkillGapPage from './modules/skill-gap/SkillGapPage';

// Module 6: Improvement Suggestions
import ImprovementSuggestionsPage from './modules/improvement-suggestions/ImprovementSuggestionsPage';

// Module 7: Master Dashboard & Reports
import DashboardPage from './modules/dashboard-reports/DashboardPage';
import ReportsPage from './modules/dashboard-reports/ReportsPage';
import LandingPage from './modules/dashboard-reports/LandingPage';

/**
 * ============================================================================
 * MODULE 2 STANDALONE DEVELOPMENT CONFIGURATION
 * ============================================================================
 * Set to `true` to launch localhost directly into Module 2 (Resume Upload & Text Extraction)
 * in strict isolation (without Dashboard, Login, or other modules).
 *
 * Set to `false` to restore the complete multi-module application shell and routing.
 */
const STANDALONE_MODULE_2 = true;

function App() {
  // Standalone Development Mode: Renders ONLY Module 2
  if (STANDALONE_MODULE_2) {
    return (
      <AppProvider>
        <StandaloneUploadApp />
      </AppProvider>
    );
  }

  // Full Multi-Module Application Shell (Preserved intact for team integration)
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Module 5 Isolated Dev Entry: Display ONLY Skill Gap Analysis on localhost root */}
            <Route path="/" element={<SkillGapPage standalone={true} />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated Application Shell (With Navbar & Sidebar Layout) */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload-resume" element={<ResumeUploadPage />} />
              <Route path="/ai-analysis" element={<AiAnalysisPage />} />
              <Route path="/job-matching" element={<JobMatchingPage />} />
              <Route path="/skill-gap" element={<SkillGapPage />} />
              <Route path="/improvements" element={<ImprovementSuggestionsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
