import React from 'react';
import { Code2, HeartHandshake, Key, Wrench, AlertCircle } from 'lucide-react';

/**
 * SkillsAnalysis Component
 * Displays separate card sections for:
 * - Technical Skills
 * - Soft Skills
 * - Tools & Frameworks
 * - Resume Keywords
 * Clearly identifies information that is not available in the resume.
 */
export const SkillsAnalysis = ({ skills = {}, keywords = [] }) => {
  const technical = Array.isArray(skills?.technical) ? skills.technical : [];
  const soft = Array.isArray(skills?.soft) ? skills.soft : [];
  const tools = Array.isArray(skills?.toolsAndFrameworks) ? skills.toolsAndFrameworks : [];
  const resumeKeywords = Array.isArray(keywords) && keywords.length > 0
    ? keywords
    : (Array.isArray(skills?.keywords) ? skills.keywords : []);

  const totalCount = technical.length + soft.length + tools.length + resumeKeywords.length;

  return (
    <div className="ai-card">
      <div className="ai-card-header">
        <h2 className="ai-card-title">
          <Code2 size={20} color="var(--color-primary, #6366F1)" />
          Skills & ATS Keywords Inventory
        </h2>
        {totalCount > 0 && (
          <span className="badge badge-primary">{totalCount} Terms Identified</span>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="ai-not-found-banner">
          <AlertCircle size={16} color="var(--color-warning, #F59E0B)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>No Skills or Keywords Detected in Resume</strong>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
              Ensure your resume includes a dedicated 'Skills' section listing your technical proficiencies, frameworks, and domain competencies.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {/* Technical Skills */}
          <div className="skills-group-block">
            <h3 className="skills-group-title">
              <Code2 size={14} color="var(--color-primary, #6366F1)" />
              Technical Skills ({technical.length})
            </h3>
            {technical.length > 0 ? (
              <div className="skills-badge-wrap">
                {technical.map((skill, idx) => (
                  <span key={idx} className="skill-pill technical">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="ai-not-found-banner">
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>Technical skills not explicitly specified in the resume.</span>
              </div>
            )}
          </div>

          {/* Soft Skills */}
          <div className="skills-group-block">
            <h3 className="skills-group-title">
              <HeartHandshake size={14} color="var(--color-secondary, #8B5CF6)" />
              Soft & Interpersonal Skills ({soft.length})
            </h3>
            {soft.length > 0 ? (
              <div className="skills-badge-wrap">
                {soft.map((skill, idx) => (
                  <span key={idx} className="skill-pill soft">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="ai-not-found-banner">
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>Soft skills (leadership, communication, problem solving) not detected in the resume.</span>
              </div>
            )}
          </div>

          {/* Resume Keywords */}
          {resumeKeywords.length > 0 && (
            <div className="skills-group-block">
              <h3 className="skills-group-title">
                <Key size={14} color="#059669" />
                Detected ATS Resume Keywords ({resumeKeywords.length})
              </h3>
              <div className="skills-badge-wrap">
                {resumeKeywords.map((kw, idx) => (
                  <span key={idx} className="skill-pill keyword">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Frameworks */}
          {tools.length > 0 && (
            <div className="skills-group-block" style={{ marginBottom: 0 }}>
              <h3 className="skills-group-title">
                <Wrench size={14} color="#475569" />
                Tools, Platforms & Ecosystems ({tools.length})
              </h3>
              <div className="skills-badge-wrap">
                {tools.map((tool, idx) => (
                  <span key={idx} className="skill-pill tool">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsAnalysis;
