import React from 'react';
import { Award, TrendingUp, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ImprovementScore = ({
  score = 72,
  potentialScore = 92,
  explanation = 'Your resume demonstrates solid foundational technical experience, but lacks quantified metrics in work experience and contains passive phrasing that limits your ATS match score.',
  breakdown = {
    impactAndMetrics: 62,
    keywordRelevance: 70,
    grammarAndClarity: 85,
    sectionCompleteness: 75
  }
}) => {
  const angle = Math.round((score / 100) * 360);

  const getVerdict = (val) => {
    if (val >= 85) return { text: 'Competitive Profile', color: 'var(--color-success)', bg: 'var(--color-success-bg)' };
    if (val >= 70) return { text: 'Needs Optimization', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' };
    return { text: 'Critical Gaps', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' };
  };

  const verdict = getVerdict(score);

  return (
    <div className="score-card">
      {/* Dial Column */}
      <div className="score-visual-col">
        <div className="score-dial" style={{ '--score-angle': `${angle}deg` }}>
          <div className="score-dial-inner">
            <span className="score-number">{score}</span>
            <span className="score-total">/ 100</span>
          </div>
        </div>
        <span
          className="score-verdict-badge"
          style={{ color: verdict.color, backgroundColor: verdict.bg }}
        >
          {verdict.text}
        </span>
      </div>

      {/* Details Column */}
      <div className="score-details-col">
        <div className="score-heading-box">
          <h3>Resume Improvement Score</h3>
          <p>{explanation}</p>
        </div>

        {/* Sub-Metric Bars */}
        <div className="score-breakdown-grid">
          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span>Impact & Measurable Metrics</span>
              <strong>{breakdown.impactAndMetrics || 65}%</strong>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${breakdown.impactAndMetrics || 65}%` }}
              />
            </div>
          </div>

          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span>ATS Keyword Relevance</span>
              <strong>{breakdown.keywordRelevance || 70}%</strong>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${breakdown.keywordRelevance || 70}%` }}
              />
            </div>
          </div>

          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span>Grammar & Technical Clarity</span>
              <strong>{breakdown.grammarAndClarity || 85}%</strong>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${breakdown.grammarAndClarity || 85}%` }}
              />
            </div>
          </div>

          <div className="metric-bar-item">
            <div className="metric-bar-label">
              <span>Section Completeness</span>
              <strong>{breakdown.sectionCompleteness || 75}%</strong>
            </div>
            <div className="metric-bar-track">
              <div
                className="metric-bar-fill"
                style={{ width: `${breakdown.sectionCompleteness || 75}%` }}
              />
            </div>
          </div>
        </div>

        {/* Potential Score Callout */}
        <div className="potential-score-callout">
          <TrendingUp size={16} />
          <span>
            <strong>Projected Potential: {potentialScore}/100</strong> (+{potentialScore - score} pts) upon
            implementing the action items below.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImprovementScore;
