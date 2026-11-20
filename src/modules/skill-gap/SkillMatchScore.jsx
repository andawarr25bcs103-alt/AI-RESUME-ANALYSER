import React from 'react';
import { CheckCircle2, AlertTriangle, GitMerge, TrendingUp, Hash } from 'lucide-react';

/**
 * SkillMatchScore
 * ───────────────
 * Displays the overall skill match percentage and its breakdown stats:
 *   - Overall match %  (large visual score)
 *   - Total required skills
 *   - Matching skills count
 *   - Missing skills count
 *   - Partially matching count
 *
 * Also renders the animated skill-coverage progress bar.
 *
 * Props:
 *   results {object} – the skillAnalysisResults object from AppContext
 */
export function SkillMatchScore({ results }) {
  const {
    overallMatchPercentage = 0,
    totalRequiredSkills    = 0,
    matchingSkillsCount    = 0,
    missingSkillsCount     = 0,
    partialSkillsCount     = 0,
    skillCoverage          = null
  } = results;

  /* Colour helpers */
  const matchColor =
    overallMatchPercentage >= 70
      ? 'var(--color-success)'
      : overallMatchPercentage >= 40
      ? 'var(--color-warning)'
      : 'var(--color-danger)';

  const coverageColor =
    skillCoverage !== null
      ? skillCoverage >= 70
        ? 'var(--color-success)'
        : skillCoverage >= 40
        ? 'var(--color-warning)'
        : 'var(--color-danger)'
      : 'var(--color-text-muted)';

  const coverageLabel =
    skillCoverage === null
      ? 'N/A'
      : skillCoverage >= 70
      ? 'Strong'
      : skillCoverage >= 40
      ? 'Moderate'
      : 'Low';

  /* Stat cards config */
  const stats = [
    {
      icon: Hash,
      value: totalRequiredSkills,
      label: 'Required Skills',
      color: 'var(--color-primary)'
    },
    {
      icon: CheckCircle2,
      value: matchingSkillsCount,
      label: 'Matching',
      color: 'var(--color-success)'
    },
    {
      icon: AlertTriangle,
      value: missingSkillsCount,
      label: 'Missing',
      color: 'var(--color-danger)'
    },
    {
      icon: GitMerge,
      value: partialSkillsCount,
      label: 'Partial Match',
      color: 'var(--color-warning)'
    }
  ];

  return (
    <div className="sga-section-card">
      <div className="sga-section-header">
        <span className="sga-section-title">
          <TrendingUp size={20} color="var(--color-primary)" />
          Skill Match Score
        </span>
        <span className="badge badge-primary">Overall Assessment</span>
      </div>

      {/* ── Overall match percentage – large display ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >
        {/* Big donut-style number */}
        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: `6px solid ${matchColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 20px ${matchColor}22`
          }}
        >
          <span
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: matchColor,
              lineHeight: 1
            }}
          >
            {overallMatchPercentage}%
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '2px'
            }}
          >
            Match
          </span>
        </div>

        {/* Stat cards */}
        <div className="sga-score-row" style={{ flex: 1 }}>
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="sga-score-card">
              <Icon size={18} color={color} style={{ margin: '0 auto 4px' }} />
              <div className="sga-score-card__value" style={{ color }}>
                {value}
              </div>
              <div className="sga-score-card__label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skill Coverage Bar ── */}
      {skillCoverage !== null ? (
        <div className="sga-coverage-bar-wrap">
          <div className="sga-coverage-bar-header">
            <span className="sga-coverage-bar-label" style={{ color: coverageColor }}>
              {coverageLabel} Skill Coverage
            </span>
            <span className="sga-coverage-bar-pct" style={{ color: coverageColor }}>
              {skillCoverage}%
            </span>
          </div>
          <div className="sga-coverage-track">
            <div
              className="sga-coverage-fill"
              style={{ width: `${skillCoverage}%`, backgroundColor: coverageColor }}
            />
          </div>
          <p className="sga-coverage-footnote">
            Skill coverage = matched required skills ÷ total required skills × 100
          </p>
          <div className="sga-coverage-pills">
            <span className="badge badge-success">
              <CheckCircle2 size={11} /> {matchingSkillsCount} Matched
            </span>
            <span className="badge badge-danger">
              <AlertTriangle size={11} /> {missingSkillsCount} Not Demonstrated
            </span>
            {partialSkillsCount > 0 && (
              <span className="badge badge-warning">
                <GitMerge size={11} /> {partialSkillsCount} Partial
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="alert alert-info" style={{ marginTop: 0 }}>
          <span style={{ fontSize: 'var(--font-xs)' }}>
            Skill coverage requires a job description. Add one in the Job Matching module for a
            precise percentage.
          </span>
        </div>
      )}
    </div>
  );
}

export default SkillMatchScore;
