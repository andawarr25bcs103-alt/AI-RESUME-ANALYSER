
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

// Module 3: AI Resume Analysis
import AiAnalysisPage from './modules/ai-analysis/AiAnalysisPage';

// Module 4: Job Matching
import JobMatchingPage from './modules/job-matching/JobMatchingPage';

// Module 5: Skill Gap Analysis
import SkillGapPage from './modules/skill-gap/SkillGapPage';

// Module 6: Improvement Suggestions
import ImprovementSuggestionsPage from './modules/improvement-suggestions/ImprovementSuggestionsPage';
import ResumeImprovementPage from './modules/resume-improvement/ResumeImprovementPage';

// Module 7: Dashboard & Reports
import DashboardPage from './modules/dashboard-reports/DashboardPage';
import ReportsPage from './modules/dashboard-reports/ReportsPage';
import LandingPage from './modules/dashboard-reports/LandingPage';

/**
 * DEVELOPMENT CONFIGURATION
 *
 * true  = Open Module 6 directly on localhost
 * false = Run the complete application with routing
 */
const STANDALONE_MODULE_6 = true;

function App() {
  // Module 6 standalone development mode
  if (STANDALONE_MODULE_6) {
    return (
      <AppProvider>
        <ResumeImprovementPage />
      </AppProvider>
    );
  }

  // Complete integrated application
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />

            {/* Protected application routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/upload-resume"
                element={<ResumeUploadPage />}
              />
              <Route
                path="/ai-analysis"
                element={<AiAnalysisPage />}
              />
              <Route
                path="/job-matching"
                element={<JobMatchingPage />}
              />
              <Route
                path="/skill-gap"
                element={<SkillGapPage />}
              />
              <Route
                path="/improvements"
                element={<ResumeImprovementPage />}
              />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Unknown routes */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
