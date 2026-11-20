import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  FileEdit,
  Sparkles,
  AlertCircle,
  Code2,
  FileSearch
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  generateImprovementSuggestionsWithGemini,
  isGeminiConfigured
} from '../../services/geminiService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

export const ImprovementSuggestionsPage = () => {
  const {
    resumeText,
    analysisResults,
    improvementSuggestions,
    setImprovementSuggestions
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="AI Improvement Suggestions"
          description="Actionable resume rewrite recommendations, impact metrics, and phrasing upgrades."
          badge="Module 6"
          icon={Lightbulb}
        />
        <EmptyState
          icon={FileSearch}
          title="Resume Required for Suggestions"
          description="Upload a candidate resume first to receive tailored bullet point rewrites and ATS optimization tips."
          actionLabel="Upload Resume"
          onAction={() => navigate('/upload-resume')}
        />
      </div>
    );
  }

  const handleGenerateSuggestions = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const results = await generateImprovementSuggestionsWithGemini(
        resumeText,
        analysisResults
      );
      setImprovementSuggestions(results);
    } catch (err) {
      console.error('Improvement Suggestions Error:', err);
      setErrorMsg(
        err.message || 'Failed to generate suggestions. Verify your Gemini API key in .env.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Resume Improvement Suggestions"
        description="Transform passive resume bullet points into measurable, high-impact achievements."
        badge="Module 6"
        icon={Lightbulb}
        actions={
          <Button
            variant="primary"
            icon={Sparkles}
            isLoading={loading}
            onClick={handleGenerateSuggestions}
          >
            {improvementSuggestions ? 'Regenerate Suggestions' : 'Generate Suggestions'}
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
            <strong>Gemini API Key Required:</strong> Set <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to generate live recommendations.
          </div>
        </div>
      )}

      {loading && (
        <Loader size="lg" message="Gemini AI is reviewing phrasing and composing high-impact rewrites..." />
      )}

      {/* Improvement Suggestions Output */}
      {!loading && improvementSuggestions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Summary Upgrade */}
          {improvementSuggestions.executiveSummarySuggestion && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Sparkles size={18} color="var(--color-primary)" />
                  Proposed Executive Summary
                </h3>
              </div>
              <p style={{ fontSize: 'var(--font-sm)', fontStyle: 'italic', lineHeight: '1.7' }}>
                "{improvementSuggestions.executiveSummarySuggestion}"
              </p>
            </div>
          )}

          {/* Action Verb & Metric Bullet Rewrites */}
          <div className="resumate-card">
            <div className="card-header">
              <h3 className="card-title">
                <FileEdit size={18} color="var(--color-primary)" />
                Bullet Point Rewrites (Before & After)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(improvementSuggestions.actionVerbEnhancements || []).map((enhancement, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)'
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>
                      ORIGINAL:
                    </span>
                    <p style={{ fontSize: 'var(--font-xs)', textDecoration: 'line-through', color: 'var(--color-text-secondary)' }}>
                      {enhancement.originalPhrase}
                    </p>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                      SUGGESTED REWRITE:
                    </span>
                    <p style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--color-text-main)' }}>
                      {enhancement.suggestedRewrite}
                    </p>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    <strong>Why:</strong> {enhancement.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ATS & Formatting Tips */}
          <div className="grid-2">
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
                  ATS Optimization Tips
                </h3>
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-xs)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(improvementSuggestions.atsOptimizationTips || []).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
                  Structure & Formatting
                </h3>
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: 'var(--font-xs)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(improvementSuggestions.formattingAndStructureTips || []).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Initial state before button is clicked */}
      {!loading && !improvementSuggestions && (
        <div className="resumate-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Lightbulb size={40} color="var(--color-primary)" style={{ margin: '0 auto 12px auto' }} />
          <h3>Generate Actionable Improvements</h3>
          <p style={{ maxWidth: '520px', margin: '8px auto 20px auto' }}>
            Click <strong>Generate Suggestions</strong> to have Google Gemini rewrite weak bullet points and suggest ATS-friendly action verbs.
          </p>
          <Button variant="primary" icon={Sparkles} onClick={handleGenerateSuggestions}>
            Generate Suggestions
          </Button>
        </div>
      )}

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 6 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: Suggestions Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Inputs:</strong> Reads <code>resumeText</code> and optional <code>analysisResults</code> from <code>AppContext</code>.</li>
          <li><strong>Service Call:</strong> <code>generateImprovementSuggestionsWithGemini(resumeText, analysisResults)</code>.</li>
          <li><strong>State Output:</strong> Sets <code>improvementSuggestions</code> in <code>AppContext</code>.</li>
          <li><strong>Next Step for Owner:</strong> Build interactive "Copy Rewrite" buttons and before/after diff views.</li>
        </ul>
      </div>
    </div>
  );
};

export default ImprovementSuggestionsPage;
