import React from 'react';
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/**
 * ExperienceAnalysis Component
 * Displays separate card sections for:
 * - Work Experience
 * - Technical Projects
 * - Educational Qualifications
 * - Certifications
 * Clearly identifies information that is not available in the resume.
 */
export const ExperienceAnalysis = ({
  experience = [],
  projects = [],
  education = [],
  certifications = []
}) => {
  const hasExp = Array.isArray(experience) && experience.length > 0;
  const hasProj = Array.isArray(projects) && projects.length > 0;
  const hasEdu = Array.isArray(education) && education.length > 0;
  const hasCert = Array.isArray(certifications) && certifications.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Work Experience Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <Briefcase size={20} color="var(--color-primary, #6366F1)" />
            Work Experience
          </h2>
          {hasExp && (
            <span className="badge badge-primary">
              {experience.length} {experience.length === 1 ? 'Role' : 'Roles'} Identified
            </span>
          )}
        </div>

        {!hasExp ? (
          <div className="ai-not-found-banner">
            <AlertCircle size={16} color="var(--color-warning, #F59E0B)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Work Experience Not Mentioned in Resume</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
                No professional employment history or internships were found. For fresher or student resumes, emphasize open-source work, academic projects, or freelance engagements.
              </p>
            </div>
          </div>
        ) : (
          <div className="timeline-card-list">
            {experience.map((job, idx) => (
              <div key={idx} className="timeline-entry-card">
                <div className="timeline-entry-top">
                  <div>
                    <h3 className="timeline-role-title">{job.role || 'Job Title'}</h3>
                    <p className="timeline-company-name">{job.company || 'Company Name'}</p>
                  </div>
                  {job.duration && (
                    <span className="timeline-period-badge">
                      <Calendar size={12} /> {job.duration}
                    </span>
                  )}
                </div>

                {job.location && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted, #94A3B8)', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 8px 0' }}>
                    <MapPin size={12} /> {job.location}
                  </p>
                )}

                {Array.isArray(job.highlights) && job.highlights.length > 0 && (
                  <ul className="timeline-bullet-list">
                    {job.highlights.map((hl, hIdx) => (
                      <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 size={14} color="var(--color-primary, #6366F1)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Technical Projects Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <FolderGit2 size={20} color="var(--color-primary, #6366F1)" />
            Projects
          </h2>
          {hasProj && (
            <span className="badge badge-primary">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
            </span>
          )}
        </div>

        {!hasProj ? (
          <div className="ai-not-found-banner">
            <AlertCircle size={16} color="var(--color-warning, #F59E0B)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Projects Not Identified in Resume</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
                Projects are weighted at 20% of your total resume score. Demonstrating end-to-end applications with tangible tech stacks gives recruiters proof of ability.
              </p>
            </div>
          </div>
        ) : (
          <div className="projects-cards-grid">
            {projects.map((proj, idx) => (
              <div key={idx} className="project-item-card">
                <div>
                  <div className="project-item-title">
                    <span>{proj.title || 'Untitled Project'}</span>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-primary, #6366F1)', display: 'inline-flex', alignItems: 'center' }}
                        title="Open Project Link"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  {proj.description && (
                    <p className="project-item-desc">{proj.description}</p>
                  )}
                </div>

                {/* Tech Badges */}
                {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="badge badge-secondary" style={{ fontSize: '10px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {Array.isArray(proj.highlights) && proj.highlights.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {proj.highlights.map((hl, hIdx) => (
                      <li key={hIdx} style={{ fontSize: '12px', color: 'var(--color-text-secondary, #475569)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: 'var(--color-primary, #6366F1)' }}>•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Educational Qualifications Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <GraduationCap size={20} color="var(--color-primary, #6366F1)" />
            Educational Qualifications
          </h2>
          {hasEdu && (
            <span className="badge badge-primary">
              {education.length} {education.length === 1 ? 'Credential' : 'Credentials'}
            </span>
          )}
        </div>

        {!hasEdu ? (
          <div className="ai-not-found-banner">
            <AlertCircle size={16} color="var(--color-warning, #F59E0B)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Educational Qualifications Not Detected</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
                No academic degrees, colleges, or graduation dates were found in the resume text.
              </p>
            </div>
          </div>
        ) : (
          <div className="timeline-card-list">
            {education.map((edu, idx) => (
              <div key={idx} className="timeline-entry-card">
                <div className="timeline-entry-top">
                  <div>
                    <h3 className="timeline-role-title">{edu.degree || 'Degree Title'}</h3>
                    <p className="timeline-company-name">{edu.institution || 'University / Institution'}</p>
                  </div>
                  {edu.year && (
                    <span className="timeline-period-badge">
                      <Calendar size={12} /> {edu.year}
                    </span>
                  )}
                </div>

                {edu.location && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted, #94A3B8)', margin: '4px 0' }}>
                    <MapPin size={12} /> {edu.location}
                  </p>
                )}

                {edu.details && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #475569)', margin: '6px 0 0 0' }}>
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Certifications Card */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <Award size={20} color="var(--color-primary, #6366F1)" />
            Certifications & Industry Credentials
          </h2>
          {hasCert && (
            <span className="badge badge-success">{certifications.length} Verified</span>
          )}
        </div>

        {!hasCert ? (
          <div className="ai-not-found-banner">
            <AlertCircle size={16} color="var(--color-warning, #F59E0B)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>No Certifications Found in Resume</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
                Industry-recognized credentials (AWS, GCP, Azure, Meta, etc.) account for 10% of total score and provide verifiable credibility during ATS filtering.
              </p>
            </div>
          </div>
        ) : (
          <div className="cert-cards-grid">
            {certifications.map((cert, idx) => (
              <div key={idx} className="cert-item-card">
                <div className="cert-icon-box">
                  <Award size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--color-text-main, #0F172A)' }}>
                    {cert.name || 'Certification Name'}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #475569)', margin: '2px 0 0 0' }}>
                    {cert.issuer || 'Issuing Organization'}
                  </p>
                  {cert.year && (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #94A3B8)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                      <Calendar size={10} /> {cert.year}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceAnalysis;
