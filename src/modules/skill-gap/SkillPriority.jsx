import React from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Flag,
  ShieldAlert
} from 'lucide-react';

/**
 * SkillPriority Component
 * Classifies skill gaps into 3 distinct operational priorities:
 * - High Priority (Critical skills: blocking or core job requirements)
 * - Medium Priority (Important skills: valuable competencies that strengthen profile)
 * - Low Priority (Nice-to-have or secondary skills)
 */
export const SkillPriority = ({
  highPriority = [],
  mediumPriority = [],
  lowPriority = []
}) => {
  return (
    <div className="sg-card">
      <div className="sg-card-header">
        <h2 className="sg-card-title">
          <Flag size={20} color="var(--color-primary)" />
          Skill Priority Classification
        </h2>
        <span className="badge badge-warning">
          Urgency Matrix
        </span>
      </div>

      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)', marginTop: '-8px', marginBottom: '16px' }}>
        Identified gaps and areas for improvement organized by their impact on hiring decisions for this target role.
      </p>

      <div className="sg-priority-grid">
        {/* High Priority Tier */}
        <div className="sg-priority-col sg-priority-col--high">
          <div className="sg-priority-header">
            <span className="sg-priority-title" style={{ color: 'var(--color-danger)' }}>
              <ShieldAlert size={16} />
              High Priority
            </span>
            <span className="badge badge-danger">
              {highPriority.length} Critical
            </span>
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
            Core requirements with direct weight on qualification screening.
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {highPriority.length > 0 ? (
              highPriority.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.skill || item.name;
                const reason = typeof item === 'object' ? item.reason || item.impact : null;
                return (
                  <div key={idx} className="sg-priority-item" style={{ borderLeft: '3px solid var(--color-danger)' }}>
                    <span className="sg-priority-item__name">{name}</span>
                    <span className="sg-priority-item__reason">
                      {reason || 'Non-negotiable primary technical requirement for candidate selection.'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', padding: '12px 0' }}>
                No critical high-priority gaps found.
              </div>
            )}
          </div>
        </div>

        {/* Medium Priority Tier */}
        <div className="sg-priority-col sg-priority-col--medium">
          <div className="sg-priority-header">
            <span className="sg-priority-title" style={{ color: 'var(--color-warning)' }}>
              <Clock size={16} />
              Medium Priority
            </span>
            <span className="badge badge-warning">
              {mediumPriority.length} Important
            </span>
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
            Significant competencies that substantially improve candidacy.
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mediumPriority.length > 0 ? (
              mediumPriority.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.skill || item.name;
                const reason = typeof item === 'object' ? item.reason || item.impact : null;
                return (
                  <div key={idx} className="sg-priority-item" style={{ borderLeft: '3px solid var(--color-warning)' }}>
                    <span className="sg-priority-item__name">{name}</span>
                    <span className="sg-priority-item__reason">
                      {reason || 'Frequently utilized in day-to-day role activities.'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', padding: '12px 0' }}>
                No medium-priority gaps identified.
              </div>
            )}
          </div>
        </div>

        {/* Low Priority Tier */}
        <div className="sg-priority-col sg-priority-col--low">
          <div className="sg-priority-header">
            <span className="sg-priority-title" style={{ color: 'var(--color-primary)' }}>
              <CheckCircle size={16} />
              Low Priority
            </span>
            <span className="badge badge-primary">
              {lowPriority.length} Optional
            </span>
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
            Secondary or nice-to-have tools that round out the profile.
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lowPriority.length > 0 ? (
              lowPriority.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.skill || item.name;
                const reason = typeof item === 'object' ? item.reason || item.impact : null;
                return (
                  <div key={idx} className="sg-priority-item" style={{ borderLeft: '3px solid var(--color-primary)' }}>
                    <span className="sg-priority-item__name">{name}</span>
                    <span className="sg-priority-item__reason">
                      {reason || 'Helpful bonus asset or complementary framework.'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', padding: '12px 0' }}>
                No low-priority items recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillPriority;
