import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  Layers,
  Info
} from 'lucide-react';

/**
 * SkillCoverage Component
 * Calculates and visualizes the candidate's skill coverage against job requirements.
 *
 * Requirements:
 * - Skill Coverage Percentage
 * - Matched Skills Count
 * - Missing Skills Count
 * - Partially Matching Skills Count
 * - Total Required Skills Count
 * - Progress bar with dynamic coloring
 * - Clarification that this is skill match coverage, not an ATS formatting or overall resume score.
 */
export const SkillCoverage = ({
  coveragePercentage = 0,
  totalRequired = 0,
  matchedCount = 0,
  missingCount = 0,
  partialCount = 0
}) => {
  const hasRequirements = totalRequired > 0;

  // Determine color theme based on score thresholds
  const getColor = (pct) => {
    if (pct >= 75) return 'var(--color-success)';
    if (pct >= 45) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getTierLabel = (pct) => {
    if (pct >= 85) return 'Exceptional Match';
    if (pct >= 70) return 'Strong Alignment';
    if (pct >= 45) return 'Moderate Coverage';
    return 'Substantial Gap';
  };

  const scoreColor = getColor(coveragePercentage);
  const tierLabel = getTierLabel(coveragePercentage);

  return (
    <div className="sg-card">
      <div className="sg-card-header">
        <h2 className="sg-card-title">
          <TrendingUp size={20} color="var(--color-primary)" />
          Skill Gap Score &amp; Coverage
        </h2>
        <span className="badge badge-primary">
          Weighted Alignment
        </span>
      </div>

      <div className="sg-coverage-container">
        <div className="sg-coverage-stats-row">
          {/* Main Circular Gauge Card */}
          <div className="sg-gauge-card">
            <div
              className="sg-gauge-circle"
              style={{ borderColor: scoreColor, boxShadow: `0 0 20px ${scoreColor}25` }}
            >
              <span className="sg-gauge-value" style={{ color: scoreColor }}>
                {hasRequirements ? `${coveragePercentage}%` : 'N/A'}
              </span>
              <span className="sg-gauge-label">Coverage</span>
            </div>
            <strong style={{ fontSize: 'var(--font-sm)', color: scoreColor }}>
              {hasRequirements ? tierLabel : 'No Required Skills Set'}
            </strong>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Target Job Skills Match
            </span>
          </div>

          {/* Metric Tiles Grid */}
          <div className="sg-metrics-grid">
            <div className="sg-metric-tile">
              <Layers size={18} color="var(--color-primary)" className="sg-metric-icon" />
              <span className="sg-metric-num" style={{ color: 'var(--color-text-main)' }}>
                {totalRequired}
              </span>
              <span className="sg-metric-desc">Required Skills</span>
            </div>

            <div className="sg-metric-tile">
              <CheckCircle2 size={18} color="var(--color-success)" className="sg-metric-icon" />
              <span className="sg-metric-num" style={{ color: 'var(--color-success)' }}>
                {matchedCount}
              </span>
              <span className="sg-metric-desc">Matched Skills</span>
            </div>

            <div className="sg-metric-tile">
              <GitMerge size={18} color="var(--color-warning)" className="sg-metric-icon" />
              <span className="sg-metric-num" style={{ color: 'var(--color-warning)' }}>
                {partialCount}
              </span>
              <span className="sg-metric-desc">Partial Matches</span>
            </div>

            <div className="sg-metric-tile">
              <AlertTriangle size={18} color="var(--color-danger)" className="sg-metric-icon" />
              <span className="sg-metric-num" style={{ color: 'var(--color-danger)' }}>
                {missingCount}
              </span>
              <span className="sg-metric-desc">Not Demonstrated</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 'var(--font-xs)', fontWeight: 600 }}>
            <span>Skill Requirement Fulfilment</span>
            <span style={{ color: scoreColor }}>{coveragePercentage}%</span>
          </div>
          <div className="sg-bar-track">
            <div
              className="sg-bar-fill"
              style={{
                width: `${hasRequirements ? Math.min(100, Math.max(0, coveragePercentage)) : 0}%`,
                backgroundColor: scoreColor
              }}
            />
          </div>
        </div>

        {/* Evaluation Clarification Note */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '10px 14px',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--font-xs)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border)'
        }}>
          <Info size={14} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Note on Calculation:</strong> Skill coverage represents matched and partially matched required skills divided by total identified job skills (weighted towards essential qualifications). It measures competency fit for this specific target job, and is distinct from formatting or overall ATS resume scoring.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkillCoverage;
