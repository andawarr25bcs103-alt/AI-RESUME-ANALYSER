import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Sparkles,
  Briefcase,
  Target,
  Lightbulb,
  FileText,
  ArrowRight,
  Code2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';

export const DashboardPage = () => {
  const {
    resumeFile,
    resumeText,
    analysisResults,
    matchingResults,
    skillAnalysisResults,
    improvementSuggestions
  } = useApp();

  const navigate = useNavigate();

  // Metrics summary
  const metrics = [
    {
      title: 'Resume Status',
      value: resumeText ? 'Loaded & Parsed' : 'No Resume',
      subtitle: resumeFile ? resumeFile.name : 'Upload via Module 2',
      status: resumeText ? 'success' : 'warning',
      link: '/upload-resume',
      icon: UploadCloud
    },
    {
      title: 'ATS Audit Score',
      value: analysisResults?.atsScore ? `${analysisResults.atsScore}/100` : 'Not Analyzed',
      subtitle: analysisResults ? 'AI Audit Completed' : 'Run via Module 3',
      status: analysisResults ? 'primary' : 'muted',
      link: '/ai-analysis',
      icon: Sparkles
    },
    {
      title: 'Job Match Fit',
      value: matchingResults?.matchPercentage ? `${matchingResults.matchPercentage}%` : 'Not Matched',
      subtitle: matchingResults?.verdict || 'Run via Module 4',
      status: matchingResults ? 'success' : 'muted',
      link: '/job-matching',
      icon: Briefcase
    },
    {
      title: 'Missing Skills',
      value: skillAnalysisResults?.missingCriticalSkills
        ? `${skillAnalysisResults.missingCriticalSkills.length} identified`
        : 'Not Audited',
      subtitle: skillAnalysisResults ? 'Roadmap Generated' : 'Run via Module 5',
      status: skillAnalysisResults ? 'danger' : 'muted',
      link: '/skill-gap',
      icon: Target
    }
  ];

  const moduleCards = [
    {
      id: 2,
      name: 'Resume Upload & Extraction',
      route: '/upload-resume',
      icon: UploadCloud,
      desc: 'Upload PDF or DOCX documents. Extract raw text with PDF.js and Mammoth.',
      status: resumeText ? 'Completed' : 'Pending'
    },
    {
      id: 3,
      name: 'AI Parsing & Scoring',
      route: '/ai-analysis',
      icon: Sparkles,
      desc: 'Google Gemini ATS scoring, section classification, strengths and weaknesses.',
      status: analysisResults ? 'Completed' : 'Pending'
    },
    {
      id: 4,
      name: 'Job Description Matching',
      route: '/job-matching',
      icon: Briefcase,
      desc: 'Compare candidate resume with specific job requirements and keyword coverage.',
      status: matchingResults ? 'Completed' : 'Pending'
    },
    {
      id: 5,
      name: 'Skill Gap & Roadmap',
      route: '/skill-gap',
      icon: Target,
      desc: 'Detect missing critical proficiencies and build a prioritized learning plan.',
      status: skillAnalysisResults ? 'Completed' : 'Pending'
    },
    {
      id: 6,
      name: 'Improvement Suggestions',
      route: '/improvements',
      icon: Lightbulb,
      desc: 'Action-verb rewrites, metric enhancements, and ATS formatting guidelines.',
      status: improvementSuggestions ? 'Completed' : 'Pending'
    },
    {
      id: 7,
      name: 'Consolidated Reports',
      route: '/reports',
      icon: FileText,
      desc: 'Exportable full-spectrum career dossier and comprehensive performance report.',
      status: 'Ready'
    }
  ];

  return (
    <div>
      <PageHeader
        title="Project Dashboard"
        description="Unified hub monitoring candidate resume parsing, Gemini analysis, job alignment, and exportable reports."
        badge="Module 7"
        icon={LayoutDashboard}
        actions={
          <Button
            variant="primary"
            icon={UploadCloud}
            onClick={() => navigate('/upload-resume')}
          >
            {resumeText ? 'Change Resume' : 'Upload Resume'}
          </Button>
        }
      />

      {/* KPI Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="resumate-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {m.title}
                </span>
                <Icon size={18} color="var(--color-primary)" />
              </div>

              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                {m.value}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
                  {m.subtitle}
                </span>
                <Link to={m.link} style={{ fontSize: 'var(--font-xs)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  Open <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Navigation Grid */}
      <h2 style={{ fontSize: 'var(--font-lg)', marginBottom: '16px' }}>Project Modules Pipeline</h2>
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        {moduleCards.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className="resumate-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}
                >
                  <Icon size={20} />
                </div>
                <span className={`badge ${mod.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                  {mod.status}
                </span>
              </div>

              <h3 style={{ fontSize: 'var(--font-md)', marginBottom: '6px' }}>{mod.name}</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', flex: 1, marginBottom: '16px' }}>
                {mod.desc}
              </p>

              <Button
                variant="outline"
                size="sm"
                icon={ArrowRight}
                onClick={() => navigate(mod.route)}
                style={{ width: '100%' }}
              >
                Access Module
              </Button>
            </div>
          );
        })}
      </div>

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 7 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: Dashboard & Reports Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Role:</strong> Master Dashboard & Reports Module aggregates state across all other 6 modules.</li>
          <li><strong>Recharts:</strong> Use <code>recharts</code> (already installed) to render ATS score trend and skill radar charts.</li>
          <li><strong>Export:</strong> Integrate exportable PDF or print view in <code>/reports</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
