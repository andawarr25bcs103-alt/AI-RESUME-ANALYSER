import React from 'react';
import {
  BookOpen,
  Lightbulb,
  Clock,
  Rocket,
  Star,
  ArrowUpCircle,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

/**
 * Priority badge helper
 */
function PriorityBadge({ priority }) {
  const map = {
    High:   'badge-danger',
    Medium: 'badge-warning',
    Low:    'badge-primary'
  };
  const cls = map[priority] || 'badge-primary';
  return <span className={`badge ${cls}`}>{priority} Priority</span>;
}

/**
 * Status badge helper
 */
function StatusBadge({ status }) {
  if (!status) return null;
  const lower = status.toLowerCase();
  const cls =
    lower.includes('missing')  ? 'badge-danger'
    : lower.includes('partial') ? 'badge-warning'
    : lower.includes('improve') ? 'badge-secondary'
    :                              'badge-primary';
  return <span className={`badge ${cls}`} style={{ fontSize: '10px' }}>{status}</span>;
}

/**
 * LearningRecommendations
 * ───────────────────────
 * Renders two panels:
 *   1. Skills Requiring Improvement  (from results.skillsToImprove)
 *   2. Personalized Learning Recommendations  (from results.learningRecommendations)
 *
 * Each recommendation shows:
 *   - Skill name + priority badge + status badge
 *   - Why the skill matters (whyImportant)
 *   - Suggested learning approach
 *   - Practical project / exercise
 *   - Estimated learning duration
 *
 * Props:
 *   results {object} – skillAnalysisResults from AppContext
 */
export function LearningRecommendations({ results }) {
  const {
    skillsToImprove        = [],
    learningRecommendations = []
  } = results;

  if (skillsToImprove.length === 0 && learningRecommendations.length === 0) {
    return (
      <div className="sga-no-gap-card">
        <CheckCircle2 size={40} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ color: 'var(--color-success)', marginBottom: '8px' }}>
          No Learning Gaps Detected
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)' }}>
          The resume demonstrates all identified required skills for this role. Try running
          analysis with a detailed job description for a more precise assessment.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Skills Requiring Improvement ── */}
      {skillsToImprove.length > 0 && (
        <div className="sga-section-card">
          <div className="sga-section-header">
            <span className="sga-section-title">
              <ArrowUpCircle size={18} color="var(--color-secondary)" />
              Skills Requiring Improvement
            </span>
            <span className="badge badge-secondary">{skillsToImprove.length} skills</span>
          </div>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: '14px'
            }}
          >
            Existing skills where stronger practical experience or deeper knowledge is recommended.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {skillsToImprove.map((item, i) => {
              const name   = typeof item === 'string' ? item : item.skill   || item.name   || '';
              const reason = typeof item === 'string' ? ''   : item.reason  || item.note   || '';
              const prio   = typeof item === 'string' ? null : item.priority || null;
              return (
                <div key={i} className="sga-improve-item">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
                  >
                    <span className="sga-improve-item__name">
                      <AlertTriangle
                        size={12}
                        style={{ marginRight: 4 }}
                        color="var(--color-secondary)"
                      />
                      {name}
                    </span>
                    {prio && <PriorityBadge priority={prio} />}
                  </div>
                  {reason && (
                    <span className="sga-improve-item__reason">{reason}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Personalized Learning Recommendations ── */}
      {learningRecommendations.length > 0 && (
        <div className="sga-section-card">
          <div className="sga-section-header">
            <span className="sga-section-title">
              <BookOpen size={18} color="var(--color-primary)" />
              Learning Recommendations
            </span>
            <span className="badge badge-primary">
              {learningRecommendations.length} skills
            </span>
          </div>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: '14px'
            }}
          >
            Personalised upskilling roadmap based on the resume and target job requirements.
          </p>

          <div className="sga-rec-list">
            {learningRecommendations.map((item, idx) => {
              const skill    = typeof item === 'string' ? item : item.skill    || item.name     || '';
              const why      = typeof item === 'string' ? ''   : item.whyImportant || item.why  || item.reason || '';
              const status   = typeof item === 'string' ? ''   : item.currentStatus || item.status || '';
              const priority = typeof item === 'string' ? 'Medium' : item.recommendedLearningPriority || item.priority || item.importance || 'Medium';
              const approach = typeof item === 'string' ? ''   : item.suggestedLearningApproach  || item.learningResource || item.resource || '';
              const project  = typeof item === 'string' ? ''   : item.practicalProjectOrExercise || item.project || '';
              const duration = typeof item === 'string' ? ''   : item.estimatedLearningDuration  || item.duration || '';

              return (
                <div key={idx} className="sga-rec-card">
                  <div className="sga-rec-card__icon-wrap">
                    <Lightbulb size={18} />
                  </div>
                  <div className="sga-rec-card__body">
                    {/* Title row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '6px'
                      }}
                    >
                      <span className="sga-rec-card__skill">{skill}</span>
                      <PriorityBadge priority={priority} />
                      <StatusBadge status={status} />
                    </div>

                    {/* Why important */}
                    {why && (
                      <p className="sga-rec-card__why">
                        <Star size={11} style={{ marginRight: 4 }} color="var(--color-warning)" />
                        {why}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="sga-rec-card__meta">
                      {approach && (
                        <span className="sga-rec-card__approach">
                          <Rocket size={11} style={{ marginRight: 4 }} color="var(--color-primary)" />
                          {approach}
                        </span>
                      )}
                      {duration && (
                        <span className="sga-rec-card__duration">
                          <Clock size={11} /> {duration}
                        </span>
                      )}
                    </div>

                    {/* Practical project */}
                    {project && (
                      <p
                        style={{
                          fontSize: 'var(--font-xs)',
                          color: 'var(--color-info)',
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '4px'
                        }}
                      >
                        <BookOpen
                          size={11}
                          style={{ marginTop: '2px', flexShrink: 0 }}
                          color="var(--color-info)"
                        />
                        {project}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningRecommendations;
