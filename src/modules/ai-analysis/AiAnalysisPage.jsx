import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  BookOpen,
  AlertCircle,
  Code2,
  FileSearch
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeResumeWithGemini, isGeminiConfigured } from '../../services/geminiService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

export const AiAnalysisPage = () => {
  const {
    resumeText,
    resumeFile,
    analysisResults,
    setAnalysisResults,
    isAnalyzing,
    setIsAnalyzing
  } = useApp();

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // If no resume is uploaded, prompt user to go to upload module
  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="AI Resume Analysis"
          description="In-depth resume parsing, ATS scoring, section classification, and strength/weakness audit."
          badge="Module 3"
          icon={Sparkles}
        />
        <EmptyState
          icon={FileSearch}
          title="No Resume Active for Analysis"
          description="Upload a candidate resume or paste resume text to initiate Gemini AI parsing and ATS scoring."
          actionLabel="Go to Resume Upload"
          onAction={() => navigate('/upload-resume')}
        />
      </div>
    );
  }

  const handleRunAnalysis = async () => {
    setErrorMsg('');
    setIsAnalyzing(true);

    try {
      const results = await analyzeResumeWithGemini(resumeText);
      setAnalysisResults(results);
    } catch (err) {
      console.error('Gemini Analysis Error:', err);
      setErrorMsg(
        err.message || 'Failed to complete AI analysis. Check your Gemini API key in .env.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Resume Analysis"
        description="Comprehensive resume audit powered by Google Gemini API (@google/genai)."
        badge="Module 3"
        icon={Sparkles}
        actions={
          <Button
            variant="primary"
            icon={Sparkles}
            isLoading={isAnalyzing}
            onClick={handleRunAnalysis}
          >
            {analysisResults ? 'Re-Analyze with Gemini' : 'Run Gemini Analysis'}
          </Button>
        }
      />

      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!isGeminiConfigured() && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Gemini API Key Required:</strong> Set <code>VITE_GEMINI_API_KEY</code> in your <code>.env</code> file to enable live AI parsing.
          </div>
        </div>
      )}

      {/* Active Resume Bar */}
      <div
        className="resumate-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          marginBottom: '24px'
        }}
      >
        <div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
            ANALYSIS TARGET
          </span>
          <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
            {resumeFile?.name || 'Pasted Resume Text'} (~{resumeText.trim().split(/\s+/).length} words)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/upload-resume')}>
          Change Resume
        </Button>
      </div>

      {isAnalyzing && (
        <Loader
          size="lg"
          message="Google Gemini is extracting sections, calculating ATS score, and evaluating strengths..."
        />
      )}

      {/* When analysis has been executed */}
      {!isAnalyzing && analysisResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Score Banner */}
          <div className="grid-3">
            <div className="resumate-card" style={{ textAlign: 'center' }}>
              <span className="badge badge-primary">ATS Score</span>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  margin: '10px 0'
                }}
              >
                {analysisResults.atsScore || 0}%
              </div>
              <p style={{ fontSize: 'var(--font-xs)' }}>Applicant Tracking System Compatibility</p>
            </div>

            <div className="resumate-card">
              <h3 className="card-title" style={{ fontSize: 'var(--font-sm)', marginBottom: '12px' }}>
                <Award size={16} color="var(--color-success)" /> Key Strengths
              </h3>
              <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-xs)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(analysisResults.keyStrengths || []).map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="resumate-card">
              <h3 className="card-title" style={{ fontSize: 'var(--font-sm)', marginBottom: '12px' }}>
                <AlertCircle size={16} color="var(--color-warning)" /> Critical Weaknesses
              </h3>
              <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-xs)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(analysisResults.criticalWeaknesses || []).map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Parsed Sections */}
          <div className="resumate-card">
            <div className="card-header">
              <h3 className="card-title">
                <BookOpen size={18} color="var(--color-primary)" /> Candidate Summary
              </h3>
            </div>
            <p style={{ fontSize: 'var(--font-sm)' }}>{analysisResults.summary}</p>
          </div>
        </div>
      )}

      {/* Initial state before analysis button is clicked */}
      {!isAnalyzing && !analysisResults && (
        <div className="resumate-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Sparkles size={40} color="var(--color-primary)" style={{ margin: '0 auto 12px auto' }} />
          <h3>Ready for AI Analysis</h3>
          <p style={{ maxWidth: '520px', margin: '8px auto 20px auto' }}>
            Click <strong>Run Gemini Analysis</strong> to send the parsed text to Google Gemini via <code>@google/genai</code>.
            Results will be saved in <code>AppContext.analysisResults</code> and made available to all subsequent modules.
          </p>
          <Button variant="primary" icon={Sparkles} onClick={handleRunAnalysis}>
            Run Gemini Analysis
          </Button>
        </div>
      )}

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 3 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: AI Analysis Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Input:</strong> Reads <code>resumeText</code> from <code>AppContext</code>.</li>
          <li><strong>Service Call:</strong> <code>analyzeResumeWithGemini(resumeText)</code> in <code>src/services/geminiService.js</code>.</li>
          <li><strong>State Output:</strong> Sets <code>analysisResults</code> in <code>AppContext</code>.</li>
          <li><strong>Next Step for Owner:</strong> Polish sections rendering (Skills tag cloud, Work history timeline, Education cards).</li>
        </ul>
      </div>
    </div>
  );
};

export default AiAnalysisPage;
