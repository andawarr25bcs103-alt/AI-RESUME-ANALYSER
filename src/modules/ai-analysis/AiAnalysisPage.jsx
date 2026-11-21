import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeResumeWithGemini, isGeminiConfigured } from '../../services/geminiService';
import { getRealisticAnalysisFromResume } from './sampleAnalysisData';

// Component imports
import ResumeSummary from './ResumeSummary';
import SkillsAnalysis from './SkillsAnalysis';
import ExperienceAnalysis from './ExperienceAnalysis';
import AnalysisResults from './AnalysisResults';
import Loader from '../../components/Loader';

// Scoped Stylesheet for Module 3
import './AIAnalysis.css';

/**
 * AIAnalysisPage Component
 * RESUMATE AI - MODULE 3: AI RESUME ANALYSIS
 *
 * Fully independent module displaying only AI Resume Analysis on localhost.
 */
export const AIAnalysisPage = () => {
  const {
    resumeText,
    setResumeText,
    resumeFile,
    analysisResults,
    setAnalysisResults,
    isAnalyzing,
    setIsAnalyzing
  } = useApp();

  const [localError, setLocalError] = useState('');
  const [usingSampleMode, setUsingSampleMode] = useState(!isGeminiConfigured());

  const handleAnalyze = async () => {
    if (!resumeText || !resumeText.trim()) {
      setLocalError('Please paste or provide resume text before analyzing.');
      return;
    }

    setLocalError('');
    setIsAnalyzing(true);

    try {
      if (isGeminiConfigured()) {
        // Run live Google Gemini AI Model
        const results = await analyzeResumeWithGemini(resumeText);
        setAnalysisResults(results);
        setUsingSampleMode(false);
      } else {
        // Fallback to sample mode when API key is not configured in .env
        // Clearly labeled as sample mode, analyzing actual provided text
        await new Promise((resolve) => setTimeout(resolve, 800)); // Brief simulated AI thinking time
        const sampleResults = getRealisticAnalysisFromResume(resumeText, resumeFile?.name);
        setAnalysisResults(sampleResults);
        setUsingSampleMode(true);
      }
    } catch (err) {
      console.error('AI Resume Analysis error:', err);
      // If live Gemini fails (e.g. invalid key, quota, or network), provide clear message with fallback
      setLocalError(
        `${err.message || 'Failed to complete Gemini analysis.'} Falling back to sample evaluation mode.`
      );
      try {
        const fallback = getRealisticAnalysisFromResume(resumeText, resumeFile?.name);
        setAnalysisResults(fallback);
        setUsingSampleMode(true);
      } catch {
        setLocalError(err.message || 'Failed to complete analysis.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="ai-analysis-container">
      {/* Module 3 Status Banner if in Sample Mode */}
      {usingSampleMode && !isGeminiConfigured() && (
        <div
          className="alert alert-warning"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>
              <strong>Sample Mode:</strong> Live Gemini API key (<code>VITE_GEMINI_API_KEY</code>) is not detected in <code>.env</code>. The module is operating in local deterministic evaluation mode.
            </span>
          </div>
        </div>
      )}

      {/* A & B. Resume Input, Standalone Testing, & Candidate Overview */}
      <ResumeSummary
        resumeText={resumeText}
        setResumeText={setResumeText}
        fileName={resumeFile?.name}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        isLiveGemini={isGeminiConfigured() && !usingSampleMode}
        analysis={analysisResults}
        error={localError}
      />

      {/* Loading State Indicator */}
      {isAnalyzing && (
        <div style={{ margin: '30px 0' }}>
          <Loader
            size="lg"
            message={
              isGeminiConfigured()
                ? 'Google Gemini is parsing sections, auditing ATS keywords, and calculating weighted resume score...'
                : 'Evaluating resume structure, identifying skills, and computing quality score...'
            }
          />
        </div>
      )}

      {/* Analysis Results Display (Shown when analysis is complete and not loading) */}
      {!isAnalyzing && analysisResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
          {/* D & E. Resume Quality Score, Strengths, Weaknesses, Missing Sections, and AI Insights */}
          <AnalysisResults analysis={analysisResults} />

          {/* Technical Skills, Soft Skills, Tools, and Resume Keywords */}
          <SkillsAnalysis
            skills={analysisResults.skills}
            keywords={analysisResults.resumeKeywords || analysisResults.keywords}
          />

          {/* Work Experience, Projects, Education, and Certifications */}
          <ExperienceAnalysis
            experience={analysisResults.experience}
            projects={analysisResults.projects}
            education={analysisResults.education}
            certifications={analysisResults.certifications}
          />
        </div>
      )}
    </div>
  );
};

export { AIAnalysisPage as AiAnalysisPage };
export default AIAnalysisPage;
