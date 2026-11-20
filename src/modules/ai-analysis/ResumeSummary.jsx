import React from 'react';
import {
  Sparkles,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Code,
  Quote,
  AlertCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

/**
 * Sample resume text for instant standalone testing
 */
const SAMPLE_TEST_RESUME = `ALEXANDER RIVERS
alex.rivers@email.com | +1 (555) 382-9012 | San Francisco, CA
linkedin.com/in/alexrivers-dev | github.com/alexrivers

PROFESSIONAL SUMMARY
Senior Full Stack Software Engineer with 5+ years of experience designing and deploying high-throughput cloud architectures, microservices, and reactive web applications. Proficient in React, Node.js, TypeScript, and AWS cloud solutions with a track record of driving 35% performance optimizations and mentoring engineering teams.

TECHNICAL SKILLS
- Programming Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
- Frameworks & Libraries: React.js, Next.js, Redux Toolkit, Node.js, Express, Tailwind CSS, Jest
- Cloud & Databases: AWS (Lambda, S3, RDS, ECS), PostgreSQL, MongoDB, Redis, Docker
- Developer Tools: Git, GitHub Actions, Docker, Webpack, Vite, Postman, Linux

WORK EXPERIENCE
Senior Full Stack Engineer | CloudScale Tech Solutions | San Francisco, CA
Jan 2022 - Present
- Architected enterprise SaaS customer analytics platform processing 10M+ daily events using React, Node.js, and AWS ECS.
- Cut client-side initial load times by 42% through code-splitting, lazy-loading, and CDN asset caching.
- Spearheaded migration from monolithic REST API to microservices, boosting service uptime to 99.98%.
- Mentored 6 junior and mid-level software engineers through weekly architectural reviews and pair programming.

Software Engineer | Apex Digital Innovations | Austin, TX
Jun 2019 - Dec 2021
- Developed interactive web portals in React and Redux consumed by over 250,000 active monthly business users.
- Designed secure authentication protocols using OAuth 2.0 and JWT, reducing authorization failures by 60%.
- Authored 120+ unit and integration tests using Jest and React Testing Library, achieving 88% overall code coverage.

PROJECTS
AI Career Coach & Resume Intelligence Engine
- Engineered an automated resume analysis tool utilizing Google Gemini LLM API and React to calculate ATS readiness.
- Implemented real-time keyword matching against job descriptions, achieving sub-200ms parsing latency.
- Tech Stack: React, Vite, Node.js, Google Gemini API, PostgreSQL

Distributed Event-Driven Order Processing System
- Built a fault-tolerant microservice pipeline utilizing Redis Pub/Sub, Node.js, and Docker handling 5,000 requests/sec.
- Deployed automated CI/CD pipeline using GitHub Actions to AWS ECS with zero-downtime rolling deployments.
- Tech Stack: TypeScript, Node.js, Redis, Docker, AWS

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin
Graduated: May 2019 | GPA: 3.82 / 4.0

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (Amazon Web Services, 2023)
- Meta Front-End Developer Professional Certificate (Meta, 2022)`;

/**
 * ResumeSummary Component
 * Manages:
 * A. Page Header (AI Resume Analysis & Subtitle)
 * B. Resume Input (AppContext text, filename, standalone text input, quick sample loader, Analyze button)
 * C. Candidate Overview & Professional Summary Card (if analysis exists)
 */
export const ResumeSummary = ({
  resumeText = '',
  setResumeText,
  fileName = '',
  onAnalyze,
  isAnalyzing = false,
  isLiveGemini = false,
  analysis = null,
  error = ''
}) => {
  const wordCount = resumeText ? resumeText.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleLoadSample = () => {
    if (setResumeText) {
      setResumeText(SAMPLE_TEST_RESUME);
    }
  };

  const handleClear = () => {
    if (setResumeText) {
      setResumeText('');
    }
  };

  const candidate = analysis?.candidate;
  const summary = analysis?.summary;

  return (
    <div>
      {/* Page Header */}
      <div className="ai-page-header">
        <div className="ai-header-top">
          <div className="ai-header-title-group">
            <div className="ai-header-icon">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="ai-page-title">AI Resume Analysis</h1>
              <p className="ai-page-subtitle">
                Get intelligent insights into your resume and professional profile.
              </p>
            </div>
          </div>

          <div>
            {isLiveGemini ? (
              <span className="ai-mode-badge live" title="Live Google Gemini API is configured and active">
                ● Live Gemini 2.5 Active
              </span>
            ) : (
              <span className="ai-mode-badge sample" title="Set VITE_GEMINI_API_KEY in .env for live Gemini calls">
                ⚡ Sample Mode Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* A. Resume Input Section */}
      <div className="ai-card">
        <div className="ai-card-header">
          <h2 className="ai-card-title">
            <FileText size={20} color="var(--color-primary, #6366F1)" />
            Resume Input & Standalone Testing
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {fileName && (
              <span className="resume-file-pill">
                📄 {fileName}
              </span>
            )}
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #94A3B8)', fontWeight: 600 }}>
              {wordCount} words
            </span>
          </div>
        </div>

        <div className="resume-input-wrapper">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #475569)', margin: 0 }}>
            {fileName
              ? 'Using extracted resume text from your uploaded document. You can also edit or paste additional text below for testing:'
              : 'Paste candidate resume text below, or load the pre-filled sample resume to test the analysis engine:'}
          </p>

          <textarea
            className="resume-textarea-box"
            rows={7}
            placeholder="Paste your raw resume text here (including contact info, summary, skills, experience, education, projects, and certifications)..."
            value={resumeText}
            onChange={(e) => setResumeText && setResumeText(e.target.value)}
            disabled={isAnalyzing}
          />

          <div className="resume-input-actions">
            <div className="resume-quick-tools">
              <button
                type="button"
                className="resumate-btn btn-outline btn-sm"
                onClick={handleLoadSample}
                disabled={isAnalyzing}
                title="Populate input with an authentic sample technical resume"
              >
                <BookOpen size={14} /> Load Sample Resume
              </button>

              {resumeText && (
                <button
                  type="button"
                  className="resumate-btn btn-ghost btn-sm"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                  title="Clear text input"
                >
                  <RotateCcw size={14} /> Clear Text
                </button>
              )}
            </div>

            {/* B. Analyze Resume Button */}
            <button
              type="button"
              className="resumate-btn btn-primary btn-md"
              onClick={onAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              style={{ minWidth: '180px' }}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {analysis ? 'Re-Analyze Resume' : 'Analyze Resume'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* C. Candidate Profile & Professional Summary Card (when analysis exists) */}
      {analysis && (
        <div className="ai-card">
          <div className="ai-card-header">
            <h2 className="ai-card-title">
              <User size={20} color="var(--color-primary, #6366F1)" />
              Candidate Profile & Professional Summary
            </h2>
            <span className="badge badge-primary">Extracted Profile</span>
          </div>

          <div className="candidate-header-row">
            <div className="candidate-avatar">
              {candidate?.name ? candidate.name.charAt(0).toUpperCase() : <User size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--color-text-main, #0F172A)' }}>
                {candidate?.name || 'Candidate Name (Not specified in resume)'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #475569)', margin: '2px 0 0 0' }}>
                Profile Extracted via Gemini AI Semantic Parser
              </p>
            </div>
          </div>

          {/* Contact Details Tags */}
          <div className="candidate-tags-row">
            {candidate?.email ? (
              <span className="candidate-tag-item">
                <Mail size={13} color="var(--color-primary, #6366F1)" />
                <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
              </span>
            ) : (
              <span className="candidate-tag-item not-found">
                <Mail size={13} /> Email not found
              </span>
            )}

            {candidate?.phone ? (
              <span className="candidate-tag-item">
                <Phone size={13} color="var(--color-primary, #6366F1)" />
                {candidate.phone}
              </span>
            ) : (
              <span className="candidate-tag-item not-found">
                <Phone size={13} /> Phone not found
              </span>
            )}

            {candidate?.location ? (
              <span className="candidate-tag-item">
                <MapPin size={13} color="var(--color-primary, #6366F1)" />
                {candidate.location}
              </span>
            ) : (
              <span className="candidate-tag-item not-found">
                <MapPin size={13} /> Location not found
              </span>
            )}

            {candidate?.linkedin ? (
              <span className="candidate-tag-item">
                <Globe size={13} color="#0A66C2" />
                <a
                  href={candidate.linkedin.startsWith('http') ? candidate.linkedin : `https://${candidate.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile
                </a>
              </span>
            ) : (
              <span className="candidate-tag-item not-found">
                <Globe size={13} /> LinkedIn not linked
              </span>
            )}

            {candidate?.github && (
              <span className="candidate-tag-item">
                <Code size={13} />
                <a
                  href={candidate.github.startsWith('http') ? candidate.github : `https://${candidate.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </span>
            )}
          </div>

          {/* Professional Summary */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary, #475569)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Quote size={14} color="var(--color-primary, #6366F1)" />
              Professional Summary
            </h4>

            {summary ? (
              <div className="summary-content-box">
                <p style={{ margin: 0 }}>{summary}</p>
              </div>
            ) : (
              <div className="ai-not-found-banner">
                <AlertCircle size={16} color="var(--color-warning, #F59E0B)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Professional Summary Not Detected in Resume</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
                    The candidate resume does not contain a clear summary or objective statement. Adding a concise 2-3 sentence overview at the top gives recruiters immediate context.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSummary;
