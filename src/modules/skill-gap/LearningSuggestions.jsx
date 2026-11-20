import React from 'react';
import {
  BookOpen,
  Rocket,
  Compass,
  Code2,
  Clock,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

/**
 * LearningSuggestions Component
 * Generates structured, actionable learning suggestions:
 * - Skills to focus on first (Immediate high-priority blockers)
 * - Suggested learning order (Step-by-step sequential progression)
 * - Recommended learning topics (Core concepts & reasons)
 * - Practical project ideas (Demonstrable portfolio artifacts)
 * - Estimated realistic learning duration
 */
export const LearningSuggestions = ({
  suggestions = [],
  focusFirst = []
}) => {
  return (
    <div className="sg-card">
      <div className="sg-card-header">
        <h2 className="sg-card-title">
          <BookOpen size={20} color="var(--color-primary)" />
          Personalized Learning Roadmap &amp; Suggestions
        </h2>
        <span className="badge badge-primary">
          Actionable Career Plan
        </span>
      </div>

      {/* Immediate Focus First Callout Banner */}
      {focusFirst && focusFirst.length > 0 && (
        <div className="sg-focus-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-hover)', fontWeight: 700 }}>
            <Zap size={18} color="var(--color-primary)" />
            <span>Skills to Focus on First:</span>
          </div>
          <div className="sg-focus-pills">
            {focusFirst.map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-danger"
                style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none' }}
              >
                🔥 {typeof skill === 'string' ? skill : skill.name || skill.skill}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>
            Addressing these first delivers maximum impact for job qualification.
          </span>
        </div>
      )}

      {/* Sequential Learning Path */}
      <div className="sg-learning-list">
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => {
            const stepNum = item.suggestedOrder || item.order || index + 1;
            const skillName = item.skill || item.name || 'Core Competency';
            const why = item.whyImportant || item.importance || item.reason;
            const approach = item.approach || item.suggestedApproach || item.learningResource;
            const project = item.practicalProject || item.project || item.exercise;
            const duration = item.estimatedDuration || item.duration;

            return (
              <div key={index} className="sg-learning-item">
                <div className="sg-step-badge" title={`Step ${stepNum} in learning order`}>
                  {stepNum}
                </div>

                <div className="sg-learning-body">
                  <div className="sg-learning-top">
                    <span className="sg-learning-skill">{skillName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.priority && (
                        <span className={`badge ${item.priority === 'High' ? 'badge-danger' : item.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}`}>
                          {item.priority} Priority
                        </span>
                      )}
                      {duration && (
                        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {why && (
                    <p className="sg-learning-why">
                      <strong>Why it matters:</strong> {why}
                    </p>
                  )}

                  {approach && (
                    <div className="sg-learning-approach">
                      <Compass size={13} style={{ flexShrink: 0 }} />
                      <span><strong>Suggested Approach:</strong> {approach}</span>
                    </div>
                  )}

                  {project && (
                    <div className="sg-learning-project">
                      <Code2 size={14} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: 'var(--color-text-main)' }}>Recommended Project:</strong>{' '}
                        <span>{project}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="sg-empty-box">
            <Rocket size={36} color="var(--color-primary)" style={{ margin: '0 auto 10px' }} />
            <h4>No Learning Suggestions Needed</h4>
            <p>Your resume matches all identified skills for this target position.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningSuggestions;
