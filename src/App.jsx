
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Authentication Module
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';

// Resume Upload Module
import ResumeUploadPage from './modules/resume-upload/ResumeUploadPage';
import StandaloneUploadApp from './modules/resume-upload/StandaloneUploadApp';

// AI Analysis Module
import AiAnalysisPage from './modules/ai-analysis/AiAnalysisPage';

// Job Matching Module
import JobMatchingPage from './modules/job-matching/JobMatchingPage';

// Skill Gap Analysis Module
import SkillGapPage from './modules/skill-gap/SkillGapPage';

// Improvement Suggestions Module
import ImprovementSuggestionsPage from './modules/improvement-suggestions/ImprovementSuggestionsPage';

// Dashboard & Reports Module
import DashboardReportPage from './modules/dashboard-report/DashboardReportPage';
import DashboardPage from './modules/dashboard-reports/DashboardPage';
import ReportsPage from './modules/dashboard-reports/ReportsPage';
import LandingPage from './modules/dashboard-reports/LandingPage';

// Standalone Module 2 Configuration
const STANDALONE_MODULE_2 = false;

function App() {

  // Standalone Resume Upload Development Mode
  if (STANDALONE_MODULE_2) {
    return (
      <AppProvider>
        <StandaloneUploadApp />
      </AppProvider>
    );
  }

  // Complete Team Application
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>

            {/* Main Dashboard */}
            <Route
              path="/"
              element={<DashboardReportPage />}
            />

            <Route
              path="/dashboard-report"
              element={<DashboardReportPage />}
            />

            {/* Public Routes */}
            <Route
              path="/landing"
              element={<LandingPage />}
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >

              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              {/* Resume Upload Module */}
              <Route
                path="/upload-resume"
                element={<ResumeUploadPage />}
              />

              {/* AI Analysis Module */}
              <Route
                path="/ai-analysis"
                element={<AiAnalysisPage />}
              />

              {/* Job Matching Module */}
              <Route
                path="/job-matching"
                element={<JobMatchingPage />}
              />

              {/* Skill Gap Module */}
              <Route
                path="/skill-gap"
                element={<SkillGapPage />}
              />

              {/* Improvement Suggestions */}
              <Route
                path="/improvements"
                element={<ImprovementSuggestionsPage />}
              />

              {/* Reports */}
              <Route
                path="/reports"
                element={<ReportsPage />}
              />

            </Route>

            {/* 404 Fallback */}
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
