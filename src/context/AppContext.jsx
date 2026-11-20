import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Shared state for Resume text & parsed file metadata
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  // Module Analysis Results
  const [analysisResults, setAnalysisResults] = useState(null);
  const [matchingResults, setMatchingResults] = useState(null);
  const [skillAnalysisResults, setSkillAnalysisResults] = useState(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState(null);

  // Job matching & skill gap parameters
  const [targetJobRole, setTargetJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Global loading/processing status
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Clears all analysis data when a new resume is uploaded.
   * Ensures that previous results do not linger or corrupt new resume reviews.
   */
  const resetAnalysis = () => {
    setResumeText('');
    setResumeFile(null);
    setAnalysisResults(null);
    setMatchingResults(null);
    setSkillAnalysisResults(null);
    setImprovementSuggestions(null);
    setTargetJobRole('');
    setJobDescription('');
    setIsAnalyzing(false);
  };

  /**
   * Helper function to load a new resume:
   * automatically clears old analysis and establishes the new resume.
   */
  const setNewResume = (fileData, extractedText) => {
    // Flush stale analysis first
    setAnalysisResults(null);
    setMatchingResults(null);
    setSkillAnalysisResults(null);
    setImprovementSuggestions(null);

    // Set new resume state
    setResumeFile(fileData);
    setResumeText(extractedText);
  };

  const value = {
    // State
    resumeText,
    resumeFile,
    analysisResults,
    matchingResults,
    skillAnalysisResults,
    improvementSuggestions,
    targetJobRole,
    jobDescription,
    isAnalyzing,

    // State Setters
    setResumeText,
    setResumeFile,
    setAnalysisResults,
    setMatchingResults,
    setSkillAnalysisResults,
    setImprovementSuggestions,
    setTargetJobRole,
    setJobDescription,
    setIsAnalyzing,

    // Core Actions
    resetAnalysis,
    setNewResume
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
