import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  HelpCircle,
  Sparkles
} from 'lucide-react';

/**
 * SkillsComparison Component
 * Displays the 3 mandatory skill comparison sections:
 * 1. Matched Skills (Demonstrated in resume and required by job)
 * 2. Missing Skills (Required by job, but not demonstrated in resume)
 * 3. Partially Matching Skills (Related experience present, but full depth/requirement not demonstrated)
 */
export const SkillsComparison = ({
  matchedSkills = [],
  missingSkills = [],
  partialSkills = []
}) => {
  return (
    <div className="sg-card">
      <div className="sg-card-header">
        <h2 className="sg-card-title">
          <Sparkles size={20} color="var(--color-primary)" />
          Skill Comparison Matrix
        </h2>
        <span className="badge badge-primary">
          Resume vs Target Job
        </span>
      </div>

      <div className="sg-comparison-grid">
        {/* Section 1: Matched Skills */}
        <div className="sg-compare-col sg-compare-col--matched">
          <div className="sg-compare-header">
            <h3 className="sg-compare-title" style={{ color: 'var(--color-success)' }}>
              <CheckCircle2 size={18} />
              Matched Skills
            </h3>
            <span className="badge badge-success">
              {matchedSkills.length}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Skills verified in the resume that directly fulfill the job requirements.
          </p>

          <div className="sg-skill-pill-list">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.skill || item.name;
                const context = typeof item === 'object' ? item.context || item.evidence : null;
                return (
                  <div key={idx} className="sg-skill-pill sg-skill-pill--matched">
                    <div className="sg-skill-pill__top">
                      <span className="sg-skill-pill__name">
                        <CheckCircle2 size={14} />
                        {name}
                      </span>
                      <span style={{ fontSize: '10px', opacity: 0.85, fontWeight: 700 }}>
                        DEMONSTRATED
                      </span>
                    </div>
                    {context && (
                      <span className="sg-skill-pill__sub">{context}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                No direct skill matches identified for the given target requirements.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Missing Skills (Not Demonstrated in Resume) */}
        <div className="sg-compare-col sg-compare-col--missing">
          <div className="sg-compare-header">
            <h3 className="sg-compare-title" style={{ color: 'var(--color-danger)' }}>
              <AlertTriangle size={18} />
              Missing Skills
            </h3>
            <span className="badge badge-danger">
              {missingSkills.length}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Required by the target job but <strong>not demonstrated in the resume</strong>.
          </p>

          <div className="sg-skill-pill-list">
            {missingSkills.length > 0 ? (
              missingSkills.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.skill || item.name;
                const reason = typeof item === 'object' ? item.reason || item.impact : null;
                return (
                  <div key={idx} className="sg-skill-pill sg-skill-pill--missing">
                    <div className="sg-skill-pill__top">
                      <span className="sg-skill-pill__name">
                        <AlertTriangle size={14} />
                        {name}
                      </span>
                      <span style={{ fontSize: '10px', opacity: 0.9, fontWeight: 700 }}>
                        NOT IN RESUME
                      </span>
                    </div>
                    {reason ? (
                      <span className="sg-skill-pill__sub">{reason}</span>
                    ) : (
                      <span className="sg-skill-pill__sub">Required proficiency not evidenced in candidate profile.</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--color-success)' }}>
                🎉 Great news! All required skills appear to be demonstrated in the resume.
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Partially Matching Skills */}
        <div className="sg-compare-col sg-compare-col--partial">
          <div className="sg-compare-header">
            <h3 className="sg-compare-title" style={{ color: 'var(--color-warning)' }}>
              <GitMerge size={18} />
              Partially Matching
            </h3>
            <span className="badge badge-warning">
              {partialSkills.length}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Related knowledge shown, but lacks complete scope or production depth.
          </p>

          <div className="sg-skill-pill-list">
            {partialSkills.length > 0 ? (
              partialSkills.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.skill || item.name;
                const reason = typeof item === 'object' ? item.reason || item.gap : null;
                return (
                  <div key={idx} className="sg-skill-pill sg-skill-pill--partial">
                    <div className="sg-skill-pill__top">
                      <span className="sg-skill-pill__name">
                        <GitMerge size={14} />
                        {name}
                      </span>
                      <span style={{ fontSize: '10px', opacity: 0.9, fontWeight: 700 }}>
                        PARTIAL
                      </span>
                    </div>
                    {reason ? (
                      <span className="sg-skill-pill__sub">{reason}</span>
                    ) : (
                      <span className="sg-skill-pill__sub">Candidate has foundational exposure but needs deeper hands-on experience.</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                No borderline or partially matching skills identified.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsComparison;
