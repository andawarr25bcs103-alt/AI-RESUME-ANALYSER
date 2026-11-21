import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  FileEdit
} from 'lucide-react';

export const SummaryImprovement = ({ summaryData }) => {
  const [copied, setCopied] = useState(false);

  if (!summaryData) return null;

  const {
    currentSummaryCritique,
    issues = [],
    strengths = [],
    suggestedSummary = ''
  } = summaryData;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(suggestedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy rewritten summary:', err);
    }
  };

  return (
    <div className="summary-improvement-card">
      <div className="summary-card-header">
        <div className="summary-header-title">
          <div className="summary-header-icon">
            <UserCheck size={20} />
          </div>
          <div>
            <h3>Professional Summary Optimization</h3>
            <p>
              Evaluation of your executive introduction with an ATS-aligned rewrite using only verified credentials.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`btn-copy-summary ${copied ? 'copied-success' : ''}`}
          onClick={handleCopySummary}
          title="Copy rewritten summary to clipboard"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Rewritten Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="summary-card-grid">
        {/* Left Column: Critique & Issues */}
        <div className="summary-critique-pane">
          <div className="pane-header-row">
            <span className="pane-tag critique-tag">Current Summary Critique</span>
          </div>

          <p className="critique-narrative">{currentSummaryCritique}</p>

          {issues.length > 0 && (
            <div className="critique-issues-box">
              <div className="issues-title">
                <AlertTriangle size={13} color="var(--color-warning)" />
                <span>Identified Weaknesses:</span>
              </div>
              <ul className="issues-list">
                {issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {strengths.length > 0 && (
            <div className="critique-strengths-box">
              <div className="strengths-title">
                <CheckCircle2 size={13} color="var(--color-success)" />
                <span>Existing Strengths to Retain:</span>
              </div>
              <ul className="strengths-list">
                {strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Suggested Rewritten Summary */}
        <div className="summary-rewrite-pane">
          <div className="pane-header-row">
            <span className="pane-tag rewrite-tag">
              <Sparkles size={12} />
              AI Rewritten Executive Summary
            </span>
            <span className="verified-badge">
              <ShieldCheck size={12} />
              Verified Facts Only
            </span>
          </div>

          <div className="rewritten-summary-content">
            <p>"{suggestedSummary}"</p>
          </div>

          <div className="summary-action-footer">
            <div className="ethical-note">
              <strong>Zero-Fabrication Guarantee:</strong> This rewrite is composed strictly from your
              demonstrated work history and skills without inflated claims or fictitious achievements.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryImprovement;
