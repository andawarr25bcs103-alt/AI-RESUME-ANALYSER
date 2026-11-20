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

// Module 3: AI Resume Parsing & Scoring
import AIAnalysisPage, { AiAnalysisPage } from './modules/ai-analysis/AIAnalysisPage';

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
 * DEVELOPMENT ISOLATION FLAG
 * When set to true: ONLY Module 3 – AI Resume Analysis is rendered on localhost.
 * Set to false: Restores the full multi-module shared application routing.
 */
const ISOLATE_MODULE_3 = true;

function App() {
  // Standalone isolated development entry for Module 3 – AI Resume Analysis
  if (ISOLATE_MODULE_3) {
    return (
      <AppProvider>
        <AIAnalysisPage />
      </AppProvider>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
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
