import React from 'react';
import {
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  BarChart2
} from 'lucide-react';

/**
 * AnalysisResults Component
 * Manages:
 * D. Resume Quality Score (indicative score out of 100, explanation, strengths & improvement areas)
 * E. AI Insights (actionable recommendations based on the actual resume content)
 * Plus: Strengths & Weaknesses cards, Missing Sections audit
 */
export const AnalysisResults = ({ analysis = {} }) => {
  const score = Math.max(0, Math.min(100, Math.round(analysis?.overallScore || analysis?.atsScore || 0)));
  const breakdown = analysis?.scoreBreakdown || {};
  const strengths = Array.isArray(analysis?.keyStrengths) ? analysis.keyStrengths : [];
  const weaknesses = Array.isArray(analysis?.criticalWeaknesses) ? analysis.criticalWeaknesses : [];
  const missingSections = Array.isArray(analysis?.missingSections) ? analysis.missingSections : [];
  const recommendations = Array.isArray(analysis?.recommendations) ? analysis.recommendations : [];

  // Verdict config
  const getVerdict = (val) => {
    if (val >= 85) {
      return {
        label: 'Excellent',
        desc: 'Highly competitive and fully ATS compliant.',
        color: '#10B981',
        bg: '#ECFDF5',
        border: '#A7F3D0'
      };
    }
    if (val >= 70) {
      return {
        label: 'Good Foundation',
        desc: 'Competitive profile with minor optimization opportunities.',
        color: '#6366F1',
        bg: '#EEF2FF',
        border: '#E0E7FF'
      };
    }
    if (val >= 50) {
      return {
        label: 'Moderate Quality',
        desc: 'Notable gaps in structure, metrics, or certifications.',
        color: '#F59E0B',
        bg: '#FFFBEB',
        border: '#FDE68A'
      };
    }
    return {
      label: 'Needs Substantial Rework',
      desc: 'Critical sections or qualifications missing.',
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA'
    };
  };

  const verdict = getVerdict(score);

  // SVG circular gauge math
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // The 7 standard weighted criteria
  const weightItems = [
    { label: 'Professional Summary', weight: 15, key: 'professionalSummary' },
    { label: 'Education', weight: 10, key: 'education' },
    { label: 'Technical Skills', weight: 15, key: 'technicalSkills' },
    { label: 'Projects', weight: 20, key: 'projects' },
    { label: 'Work Experience', weight: 15, key: 'experience' },
    { label: 'Certifications', weight: 10, key: 'certifications' },
    { label: 'Resume Structure', weight: 15, key: 'resumeStructure' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* D. Resume Quality Score Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <BarChart2 size={20} color="var(--color-primary, #6366F1)" />
            Resume Quality Score
          </h2>
          <span className="badge badge-primary">Audited Out of 100</span>
        </div>

        <div className="score-overview-grid">
          {/* Circular Indicator */}
          <div className="score-circular-box">
            <div style={{ position: 'relative', width: size, height: size }}>
              <svg width={size} height={size} className="score-gauge-svg">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="#EDF2F7"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={verdict.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>

              <div className="score-center-text" style={{ inset: 0 }}>
                <span className="score-big-number" style={{ color: verdict.color }}>
                  {score}
                </span>
                <span className="score-max-label">OUT OF 100</span>
              </div>
            </div>

            <div
              className="score-verdict-pill"
              style={{
                backgroundColor: verdict.bg,
                color: verdict.color,
                border: `1px solid ${verdict.border}`
              }}
            >
              ● {verdict.label}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #475569)', marginTop: '8px' }}>
              {verdict.desc}
            </p>
          </div>

          {/* Score Explanation & Weighted Breakdown */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main, #0F172A)', marginBottom: '8px' }}>
              Score Explanation & Weights Distribution
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #475569)', lineHeight: '1.5', marginBottom: '14px' }}>
              This indicative quality score evaluates your resume against modern ATS parsing engines and hiring manager benchmarks across 7 weighted dimensions:
            </p>

            <div className="score-bars-list">
              {weightItems.map((item) => {
                const row = breakdown[item.key] || {};
                const itemScore = typeof row === 'object' && row !== null ? (row.score ?? 0) : (typeof row === 'number' ? row : 0);
                const points = ((itemScore * item.weight) / 100).toFixed(1);

                const getBarColor = (val) => {
                  if (val >= 80) return '#10B981';
                  if (val >= 60) return '#6366F1';
                  if (val >= 40) return '#F59E0B';
                  return '#EF4444';
                };

                return (
                  <div key={item.key} className="score-bar-row">
                    <div className="score-bar-top">
                      <span>{item.label} ({item.weight}%)</span>
                      <span style={{ color: getBarColor(itemScore) }}>
                        {itemScore}/100 <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #94A3B8)' }}>({points} pts)</span>
                      </span>
                    </div>

                    <div className="score-bar-track-outer">
                      <div
                        className="score-bar-track-inner"
                        style={{
                          width: `${itemScore}%`,
                          backgroundColor: getBarColor(itemScore)
                        }}
                      />
                    </div>

                    {row.feedback && (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #94A3B8)' }}>
                        {row.feedback}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Separate Cards */}
      <div className="sw-grid">
        {/* Strengths Card */}
        <div className="ai-card" style={{ marginBottom: 0 }}>
          <div className="ai-card-header">
            <h2 className="ai-card-title">
              <Award size={20} color="#10B981" />
              Identified Strengths
            </h2>
            <span className="badge badge-success">{strengths.length} Highlights</span>
          </div>

          {strengths.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #94A3B8)', fontStyle: 'italic' }}>
              No explicit strengths identified in the resume.
            </p>
          ) : (
            <ul className="sw-list">
              {strengths.map((str, idx) => (
                <li key={idx} className="sw-item strength">
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weaknesses Card */}
        <div className="ai-card" style={{ marginBottom: 0 }}>
          <div className="ai-card-header">
            <h2 className="ai-card-title">
              <AlertTriangle size={20} color="#F59E0B" />
              Areas Requiring Improvement
            </h2>
            <span className="badge badge-warning">{weaknesses.length} Flags</span>
          </div>

          {weaknesses.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #94A3B8)', fontStyle: 'italic' }}>
              No critical weaknesses detected in the resume text.
            </p>
          ) : (
            <ul className="sw-list">
              {weaknesses.map((w, idx) => (
                <li key={idx} className="sw-item weakness">
                  <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Missing or Incomplete Sections Audit Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <AlertOctagon size={20} color="var(--color-danger, #EF4444)" />
            Missing or Incomplete Resume Sections Audit
          </h2>
          <span className="badge badge-warning">
            {missingSections.length} {missingSections.length === 1 ? 'Omission' : 'Omissions'} Detected
          </span>
        </div>

        {missingSections.length === 0 ? (
          <div className="alert alert-success" style={{ margin: 0 }}>
            <CheckCircle2 size={18} />
            <span>All essential ATS resume sections were detected and formatted properly!</span>
          </div>
        ) : (
          <div className="missing-audit-list">
            {missingSections.map((sec, idx) => {
              const sev = (sec.severity || 'Medium').toLowerCase();
              return (
                <div key={idx} className={`missing-audit-item ${sev}`}>
                  <span
                    className="badge"
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      backgroundColor: sev === 'high' ? '#FEE2E2' : (sev === 'medium' ? '#FEF3C7' : '#E0F2FE'),
                      color: sev === 'high' ? '#B91C1C' : (sev === 'medium' ? '#B45309' : '#0369A1'),
                      flexShrink: 0
                    }}
                  >
                    {sec.severity || 'Medium'} Severity
                  </span>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-text-main, #0F172A)' }}>
                      Section: {sec.section}
                    </h4>
                    {sec.impact && (
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #475569)', margin: '0 0 4px 0' }}>
                        <strong>Impact:</strong> {sec.impact}
                      </p>
                    )}
                    {sec.suggestion && (
                      <p style={{ fontSize: '12px', color: 'var(--color-primary, #6366F1)', margin: 0, fontWeight: 500 }}>
                        💡 <strong>Action:</strong> {sec.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* E. AI Insights: Actionable Recommendations */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <Lightbulb size={20} color="var(--color-primary, #6366F1)" />
            AI Insights & Actionable Recommendations
          </h2>
          <span className="badge badge-primary">
            {recommendations.length} Action Items
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #475569)', margin: '0 0 16px 0' }}>
          Concrete, content-specific actions based on your actual resume to improve interview callbacks and ATS ranking:
        </p>

        {recommendations.length === 0 ? (
          <div className="alert alert-success" style={{ margin: 0 }}>
            <CheckCircle2 size={18} />
            <span>No critical adjustments required. Your resume is well balanced!</span>
          </div>
        ) : (
          <div className="insights-list">
            {recommendations.map((rec, idx) => {
              const priority = (rec.priority || 'Medium').toLowerCase();
              return (
                <div key={idx} className="insight-card-item">
                  <div className="insight-card-header">
                    <span style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main, #0F172A)' }}>
                      <Sparkles size={16} color="var(--color-primary, #6366F1)" />
                      {rec.title || `Recommendation #${idx + 1}`}
                    </span>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {rec.category && (
                        <span className="badge badge-secondary" style={{ fontSize: '10px' }}>
                          {rec.category}
                        </span>
                      )}
                      <span
                        className="badge"
                        style={{
                          fontSize: '10px',
                          backgroundColor: priority === 'high' ? '#FEE2E2' : (priority === 'medium' ? '#FEF3C7' : '#EEF2FF'),
                          color: priority === 'high' ? '#B91C1C' : (priority === 'medium' ? '#B45309' : '#4F46E5')
                        }}
                      >
                        {rec.priority || 'Medium'} Priority
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #475569)', lineHeight: '1.6', margin: '4px 0 0 0' }}>
                    {rec.description || (typeof rec === 'string' ? rec : '')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
