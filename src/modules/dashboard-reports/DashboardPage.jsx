import React, { useMemo } from 'react';
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
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  FileSearch,
  UserCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export const DashboardPage = () => {
  const {
    resumeFile,
    resumeText,
    analysisResults,
    matchingResults,
    skillAnalysisResults,
    improvementSuggestions,
    targetJobRole,
    resetAnalysis
  } = useApp();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Reset analysis handler with confirmation
  const handleStartNewAnalysis = () => {
    if (
      window.confirm(
        'Start a completely new analysis? This will clear active resume data and current module outputs.'
      )
    ) {
      resetAnalysis();
      navigate('/upload-resume');
    }
  };

  // Pipeline completion calculation (no fake history - strictly current AppContext state)
  const pipelineSteps = useMemo(() => {
    return [
      {
        id: 2,
        name: 'Resume Upload',
        route: '/upload-resume',
        completed: Boolean(resumeText),
        detail: resumeText
          ? `${resumeText.trim().split(/\s+/).length} words parsed`
          : 'Awaiting file upload'
      },
      {
        id: 3,
        name: 'AI Parsing & ATS Audit',
        route: '/ai-analysis',
        completed: Boolean(analysisResults),
        detail: analysisResults
          ? `Score: ${analysisResults.atsScore || 0}/100`
          : 'Awaiting Gemini audit'
      },
      {
        id: 4,
        name: 'Job Matching',
        route: '/job-matching',
        completed: Boolean(matchingResults),
        detail: matchingResults
          ? `${matchingResults.matchPercentage || 0}% match fit`
          : 'Awaiting job description'
      },
      {
        id: 5,
        name: 'Skill Gap & Roadmap',
        route: '/skill-gap',
        completed: Boolean(skillAnalysisResults),
        detail: skillAnalysisResults
          ? `${skillAnalysisResults.readinessScore || 0}% role readiness`
          : 'Awaiting skill diagnosis'
      },
      {
        id: 6,
        name: 'Improvement Suggestions',
        route: '/improvements',
        completed: Boolean(improvementSuggestions),
        detail: improvementSuggestions
          ? `${improvementSuggestions.actionVerbEnhancements?.length || 0} rewrites ready`
          : 'Awaiting rewrite suggestions'
      }
    ];
  }, [resumeText, analysisResults, matchingResults, skillAnalysisResults, improvementSuggestions]);

  const completedStepsCount = pipelineSteps.filter((s) => s.completed).length;
  const pipelinePercentage = Math.round((completedStepsCount / pipelineSteps.length) * 100);

  // Next pending module recommendation
  const nextPendingStep = pipelineSteps.find((s) => !s.completed);

  // Synthesize Prioritized Improvement List from available analysis data
  const prioritizedImprovements = useMemo(() => {
    const list = [];

    // Critical Weaknesses from Module 3
    if (analysisResults?.criticalWeaknesses) {
      analysisResults.criticalWeaknesses.slice(0, 3).forEach((w) => {
        list.push({
          source: 'ATS Audit',
          text: w,
          priority: 'High'
        });
      });
    }

    // High Priority Skill Gaps from Module 5 Roadmap
    if (skillAnalysisResults?.learningRoadmap) {
      skillAnalysisResults.learningRoadmap
        .filter((item) => item.importance === 'High')
        .slice(0, 2)
        .forEach((item) => {
          list.push({
            source: 'Skill Gap',
            text: `Acquire ${item.skill} proficiency (${item.learningResource})`,
            priority: 'High'
          });
        });
    }

    // Missing critical keywords from Module 4
    if (matchingResults?.missingKeywords && matchingResults.missingKeywords.length > 0) {
      list.push({
        source: 'Job Matching',
        text: `Integrate missing target keywords: ${matchingResults.missingKeywords.slice(0, 4).join(', ')}`,
        priority: 'Medium'
      });
    }

    // Medium Priority roadmap items
    if (skillAnalysisResults?.learningRoadmap) {
      skillAnalysisResults.learningRoadmap
        .filter((item) => item.importance === 'Medium')
        .slice(0, 2)
        .forEach((item) => {
          list.push({
            source: 'Skill Gap',
            text: `Upskill in ${item.skill} (${item.learningResource})`,
            priority: 'Medium'
          });
        });
    }

    return list;
  }, [analysisResults, skillAnalysisResults, matchingResults]);

  // Chart data for ATS Breakdown (when available)
  const atsBreakdownData = useMemo(() => {
    if (!analysisResults?.atsScoreBreakdown) return null;
    const { formatting, keywordRelevance, impactAndMetrics, sectionsCompleteness } =
      analysisResults.atsScoreBreakdown;
    return [
      { name: 'Formatting', score: formatting || 0 },
      { name: 'Keywords', score: keywordRelevance || 0 },
      { name: 'Impact', score: impactAndMetrics || 0 },
      { name: 'Sections', score: sectionsCompleteness || 0 }
    ];
  }, [analysisResults]);

  // Seven Modules Pipeline Definition with real dynamic statuses
  const moduleCards = [
    {
      id: 1,
      num: 'Module 1',
      name: 'Authentication & Access',
      route: currentUser ? '/dashboard' : '/login',
      icon: UserCheck,
      desc: 'Secure identity management and protected session control via Firebase Auth.',
      status: currentUser ? 'Authenticated' : 'Guest / Dev',
      badgeClass: currentUser ? 'badge-success' : 'badge-warning',
      actionLabel: currentUser ? 'Active Session' : 'Sign In'
    },
    {
      id: 2,
      num: 'Module 2',
      name: 'Resume Upload & Extraction',
      route: '/upload-resume',
      icon: UploadCloud,
      desc: 'Upload PDF, DOCX or TXT files. Raw text extraction via PDF.js and Mammoth.',
      status: resumeText ? 'Completed' : 'Pending',
      badgeClass: resumeText ? 'badge-success' : 'badge-warning',
      actionLabel: resumeText ? 'Update Resume' : 'Upload Resume'
    },
    {
      id: 3,
      num: 'Module 3',
      name: 'AI Resume Parsing & Scoring',
      route: '/ai-analysis',
      icon: Sparkles,
      desc: 'Google Gemini ATS scoring, section classification, strengths and weakness audit.',
      status: analysisResults ? `Score: ${analysisResults.atsScore}/100` : 'Not Analyzed',
      badgeClass: analysisResults ? 'badge-success' : 'badge-primary',
      actionLabel: analysisResults ? 'View AI Audit' : 'Run AI Analysis'
    },
    {
      id: 4,
      num: 'Module 4',
      name: 'Job Description Matching',
      route: '/job-matching',
      icon: Briefcase,
      desc: 'Semantic comparison against job postings to calculate role compatibility and missing keywords.',
      status: matchingResults ? `Match: ${matchingResults.matchPercentage}%` : 'Not Matched',
      badgeClass: matchingResults ? 'badge-success' : 'badge-primary',
      actionLabel: matchingResults ? 'View Job Fit' : 'Match Job'
    },
    {
      id: 5,
      num: 'Module 5',
      name: 'Skill Gap & Roadmap',
      route: '/skill-gap',
      icon: Target,
      desc: 'Diagnose missing technical proficiencies and build a prioritized learning roadmap.',
      status: skillAnalysisResults
        ? `Readiness: ${skillAnalysisResults.readinessScore}%`
        : 'Not Audited',
      badgeClass: skillAnalysisResults ? 'badge-success' : 'badge-primary',
      actionLabel: skillAnalysisResults ? 'View Skills' : 'Analyze Skills'
    },
    {
      id: 6,
      num: 'Module 6',
      name: 'Improvement Suggestions',
      route: '/improvements',
      icon: Lightbulb,
      desc: 'Action-verb rewrites, measurable bullet improvements, and ATS compliance guidelines.',
      status: improvementSuggestions ? 'Rewrites Ready' : 'Pending',
      badgeClass: improvementSuggestions ? 'badge-success' : 'badge-primary',
      actionLabel: improvementSuggestions ? 'View Rewrites' : 'Get Rewrites'
    },
    {
      id: 7,
      num: 'Module 7',
      name: 'Consolidated Dossier & Reports',
      route: '/reports',
      icon: FileText,
      desc: 'Full-spectrum exportable career report with professional browser print-to-PDF formatting.',
      status: resumeText ? 'Ready to Export' : 'Awaiting Resume',
      badgeClass: resumeText ? 'badge-success' : 'badge-secondary',
      actionLabel: 'Open Reports'
    }
  ];

  return (
    <div>
      <PageHeader
        title="RESUMATE AI Dashboard"
        description="Unified career intelligence command center aggregating Google Gemini ATS audits, job matching, skill gap discovery, and exportable reports."
        badge="Module 7"
        icon={LayoutDashboard}
        actions={
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {resumeText && (
              <>
                <Button
                  variant="outline"
                  icon={Printer}
                  onClick={() => navigate('/reports')}
                  title="Open report preview and print"
                >
                  Report Preview / PDF
                </Button>
                <Button
                  variant="outline"
                  icon={RotateCcw}
                  onClick={handleStartNewAnalysis}
                  title="Clear active resume and start fresh"
                >
                  New Analysis
                </Button>
              </>
            )}
            <Button
              variant="primary"
              icon={UploadCloud}
              onClick={() => navigate('/upload-resume')}
            >
              {resumeText ? 'Change Resume' : 'Upload Resume'}
            </Button>
          </div>
        }
      />

      {/* Global Empty State Banner if no resume is loaded at all */}
      {!resumeText && (
        <EmptyState
          icon={FileSearch}
          title="No Resume Active in Session"
          description="Upload or paste your resume in Module 2 to begin the RESUMATE AI analysis pipeline. All scoring, job matching, skill gap diagnoses, and reports will populate automatically."
          actionLabel="Upload Candidate Resume"
          actionIcon={UploadCloud}
          onAction={() => navigate('/upload-resume')}
        />
      )}

      {/* CURRENT ACTIVE ANALYSIS OVERVIEW (Strictly active session state - No fake history) */}
      <div className="analysis-session-card">
        <div className="session-header">
          <div className="session-title-group">
            <div className="session-icon-badge">
              <Clock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, margin: 0 }}>
                Current Analysis Session Overview
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                Live session state managed in <code>AppContext</code> • No cached or mocked history
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className={`badge ${resumeText ? 'badge-success' : 'badge-warning'}`}
            >
              {resumeText ? 'Active Session' : 'Awaiting Input'}
            </span>
            {nextPendingStep && resumeText && (
              <Button
                variant="primary"
                size="sm"
                icon={ChevronRight}
                onClick={() => navigate(nextPendingStep.route)}
              >
                Next: {nextPendingStep.name}
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="session-meta-grid">
          <div className="session-meta-item">
            <span className="session-meta-label">Active Document</span>
            <span className="session-meta-value" title={resumeFile?.name || 'Raw Text Resume'}>
              {resumeFile?.name || (resumeText ? 'Pasted Text Resume' : 'None loaded')}
            </span>
          </div>

          <div className="session-meta-item">
            <span className="session-meta-label">Parsed Content</span>
            <span className="session-meta-value">
              {resumeText
                ? `${resumeText.trim().split(/\s+/).length} words`
                : '0 words'}
            </span>
          </div>

          <div className="session-meta-item">
            <span className="session-meta-label">Target Career Role</span>
            <span className="session-meta-value">
              {targetJobRole || skillAnalysisResults?.targetRole || 'Not specified'}
            </span>
          </div>

          <div className="session-meta-item">
            <span className="session-meta-label">Pipeline Completion</span>
            <span className="session-meta-value">
              {completedStepsCount} of {pipelineSteps.length} Steps ({pipelinePercentage}%)
            </span>
          </div>
        </div>

        {/* Pipeline Progress Indicator */}
        <div className="pipeline-progress-container">
          <div className="pipeline-progress-header">
            <span>Pipeline Progression</span>
            <span>{pipelinePercentage}% Completed</span>
          </div>
          <div className="pipeline-progress-bar-bg">
            <div
              className="pipeline-progress-bar-fill"
              style={{ width: `${pipelinePercentage}%` }}
            />
          </div>

          <div className="pipeline-steps-chips">
            {pipelineSteps.map((step) => (
              <Link
                key={step.id}
                to={step.route}
                className={`pipeline-chip ${step.completed ? 'completed' : 'pending'}`}
                title={`Module ${step.id}: ${step.detail}`}
              >
                {step.completed ? (
                  <CheckCircle2 size={12} color="var(--color-success)" />
                ) : (
                  <Clock size={12} />
                )}
                <span>
                  Mod {step.id}: {step.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CORE PERFORMANCE SCORECARDS (KPI Grid) */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {/* KPI 1: ATS Resume Score */}
        <div className="score-card">
          <div className="score-card-header">
            <span className="score-card-title">Resume ATS Score</span>
            <Sparkles size={18} color="var(--color-primary)" />
          </div>

          {analysisResults?.atsScore != null ? (
            <div>
              <div className="score-card-value-row">
                <span className="score-card-number primary">
                  {analysisResults.atsScore}
                </span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                  / 100
                </span>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {analysisResults.atsScore >= 80
                  ? 'High ATS Compliance'
                  : analysisResults.atsScore >= 60
                  ? 'Moderate ATS Compliance'
                  : 'Needs ATS Optimization'}
              </p>
            </div>
          ) : (
            <div className="mini-empty-state">
              <Sparkles size={20} className="mini-empty-icon" />
              <span className="mini-empty-title">Not Analyzed</span>
              <p className="mini-empty-desc">Run Module 3 for AI scoring & section breakdown</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
              >
                {resumeText ? 'Run ATS Audit' : 'Upload Resume'}
              </Button>
            </div>
          )}

          <div className="score-card-footer">
            <span style={{ color: 'var(--color-text-muted)' }}>Module 3</span>
            <Link to="/ai-analysis" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              Details <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* KPI 2: Job Match Fit */}
        <div className="score-card">
          <div className="score-card-header">
            <span className="score-card-title">Job Match Fit</span>
            <Briefcase size={18} color="var(--color-secondary)" />
          </div>

          {matchingResults?.matchPercentage != null ? (
            <div>
              <div className="score-card-value-row">
                <span className="score-card-number secondary">
                  {matchingResults.matchPercentage}%
                </span>
                {matchingResults.verdict && (
                  <span
                    className={`badge ${
                      matchingResults.verdict.toLowerCase().includes('strong')
                        ? 'badge-success'
                        : matchingResults.verdict.toLowerCase().includes('moderate')
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {matchingResults.verdict}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {matchingResults.matchingKeywords?.length || 0} matching keywords found
              </p>
            </div>
          ) : (
            <div className="mini-empty-state">
              <Briefcase size={20} className="mini-empty-icon" />
              <span className="mini-empty-title">No Job Matched</span>
              <p className="mini-empty-desc">Compare resume with a specific job posting</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/job-matching' : '/upload-resume')}
              >
                {resumeText ? 'Match Job' : 'Upload Resume'}
              </Button>
            </div>
          )}

          <div className="score-card-footer">
            <span style={{ color: 'var(--color-text-muted)' }}>Module 4</span>
            <Link to="/job-matching" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              Details <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* KPI 3: Skill Coverage / Readiness */}
        <div className="score-card">
          <div className="score-card-header">
            <span className="score-card-title">Skill Coverage</span>
            <Target size={18} color="var(--color-success)" />
          </div>

          {skillAnalysisResults?.readinessScore != null ? (
            <div>
              <div className="score-card-value-row">
                <span className="score-card-number success">
                  {skillAnalysisResults.readinessScore}%
                </span>
                <span className="badge badge-success">Ready</span>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Role: <strong>{skillAnalysisResults.targetRole || 'Target Role'}</strong>
              </p>
            </div>
          ) : (
            <div className="mini-empty-state">
              <Target size={20} className="mini-empty-icon" />
              <span className="mini-empty-title">Not Audited</span>
              <p className="mini-empty-desc">Evaluate competencies & roadmap for your target role</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/skill-gap' : '/upload-resume')}
              >
                {resumeText ? 'Run Skill Audit' : 'Upload Resume'}
              </Button>
            </div>
          )}

          <div className="score-card-footer">
            <span style={{ color: 'var(--color-text-muted)' }}>Module 5</span>
            <Link to="/skill-gap" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              Details <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* KPI 4: Improvement Suggestions */}
        <div className="score-card">
          <div className="score-card-header">
            <span className="score-card-title">Suggestions</span>
            <Lightbulb size={18} color="var(--color-warning)" />
          </div>

          {improvementSuggestions ? (
            <div>
              <div className="score-card-value-row">
                <span className="score-card-number warning">
                  {improvementSuggestions.actionVerbEnhancements?.length || 0}
                </span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                  Rewrites
                </span>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {(improvementSuggestions.atsOptimizationTips?.length || 0) +
                  (improvementSuggestions.formattingAndStructureTips?.length || 0)}{' '}
                ATS & formatting tips
              </p>
            </div>
          ) : (
            <div className="mini-empty-state">
              <Lightbulb size={20} className="mini-empty-icon" />
              <span className="mini-empty-title">Not Generated</span>
              <p className="mini-empty-desc">Produce high-impact bullet phrasing and ATS tips</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/improvements' : '/upload-resume')}
              >
                {resumeText ? 'Get Suggestions' : 'Upload Resume'}
              </Button>
            </div>
          )}

          <div className="score-card-footer">
            <span style={{ color: 'var(--color-text-muted)' }}>Module 6</span>
            <Link to="/improvements" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              Details <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* VISUAL ANALYTICS: ATS Breakdown Chart & Candidate Overview */}
      {atsBreakdownData && (
        <div className="resumate-card" style={{ marginBottom: '28px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={18} color="var(--color-primary)" />
              ATS Scoring Dimension Breakdown
            </h3>
            <span className="badge badge-primary">Gemini AI Audit</span>
          </div>

          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atsBreakdownData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val) => [`${val} / 100`, 'Score']}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {atsBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.score >= 80
                          ? 'var(--color-success)'
                          : entry.score >= 60
                          ? 'var(--color-primary)'
                          : 'var(--color-warning)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TWO-COLUMN SECTION: Key Strengths vs Improvement Priorities */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Column 1: Key Resume Strengths */}
        <div className="resumate-card">
          <div className="card-header">
            <h3 className="card-title">
              <Award size={18} color="var(--color-success)" />
              Key Resume Strengths
            </h3>
            {analysisResults?.keyStrengths && (
              <span className="badge badge-success">
                {analysisResults.keyStrengths.length} Identified
              </span>
            )}
          </div>

          {analysisResults?.keyStrengths && analysisResults.keyStrengths.length > 0 ? (
            <div className="strengths-list">
              {analysisResults.keyStrengths.map((str, idx) => (
                <div key={idx} className="strength-item-card">
                  <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mini-empty-state">
              <Award size={24} className="mini-empty-icon" />
              <span className="mini-empty-title">No Strengths Audited Yet</span>
              <p className="mini-empty-desc">
                Execute AI Resume Analysis (Module 3) to uncover candidate technical and structural strengths.
              </p>
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
              >
                {resumeText ? 'Run AI Analysis' : 'Upload Resume'}
              </Button>
            </div>
          )}
        </div>

        {/* Column 2: Improvement Priorities */}
        <div className="resumate-card">
          <div className="card-header">
            <h3 className="card-title">
              <AlertTriangle size={18} color="var(--color-danger)" />
              Improvement Priorities
            </h3>
            {prioritizedImprovements.length > 0 && (
              <span className="badge badge-danger">
                {prioritizedImprovements.length} Action Items
              </span>
            )}
          </div>

          {prioritizedImprovements.length > 0 ? (
            <div className="priorities-list">
              {prioritizedImprovements.map((item, idx) => (
                <div
                  key={idx}
                  className={`priority-item-card ${item.priority.toLowerCase()}`}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {item.source}
                    </span>
                    <span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>
                      {item.text}
                    </span>
                  </div>
                  <span
                    className={`badge ${
                      item.priority === 'High' ? 'badge-danger' : 'badge-warning'
                    }`}
                    style={{ flexShrink: 0 }}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mini-empty-state">
              <AlertCircle size={24} className="mini-empty-icon" />
              <span className="mini-empty-title">No Improvement Priorities Audited</span>
              <p className="mini-empty-desc">
                Weaknesses, keyword voids, and prioritized learning steps will consolidate here after running Modules 3, 4, and 5.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
              >
                {resumeText ? 'Begin Audit Pipeline' : 'Upload Resume'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* SKILL GAP INFORMATION & KEYWORD COVERAGE */}
      <div className="resumate-card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Target size={18} color="var(--color-primary)" />
            Skill Gap Diagnosis & Competency Overview
          </h3>
          {skillAnalysisResults && (
            <span className="badge badge-primary">
              Target: {skillAnalysisResults.targetRole}
            </span>
          )}
        </div>

        {skillAnalysisResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Acquired Skills */}
            <div>
              <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-success)', fontWeight: 700, marginBottom: '8px' }}>
                Acquired Proficiencies ({skillAnalysisResults.acquiredSkills?.length || 0})
              </h4>
              <div className="skill-tags-group">
                {(skillAnalysisResults.acquiredSkills || []).map((sk, idx) => (
                  <span key={idx} className="skill-tag skill-tag-acquired">
                    <CheckCircle2 size={12} /> {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Skills */}
            {skillAnalysisResults.missingCriticalSkills && skillAnalysisResults.missingCriticalSkills.length > 0 && (
              <div>
                <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-danger)', fontWeight: 700, marginBottom: '8px' }}>
                  Missing Critical Skills ({skillAnalysisResults.missingCriticalSkills.length})
                </h4>
                <div className="skill-tags-group">
                  {skillAnalysisResults.missingCriticalSkills.map((sk, idx) => (
                    <span key={idx} className="skill-tag skill-tag-missing">
                      <AlertTriangle size={12} /> {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Certifications */}
            {skillAnalysisResults.recommendedCertifications && skillAnalysisResults.recommendedCertifications.length > 0 && (
              <div>
                <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-secondary-hover)', fontWeight: 700, marginBottom: '8px' }}>
                  Recommended Certifications & Credentials
                </h4>
                <div className="skill-tags-group">
                  {skillAnalysisResults.recommendedCertifications.map((cert, idx) => (
                    <span key={idx} className="skill-tag skill-tag-cert">
                      <ShieldCheck size={12} /> {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mini-empty-state">
            <Target size={24} className="mini-empty-icon" />
            <span className="mini-empty-title">Skill Gap Analysis Not Completed</span>
            <p className="mini-empty-desc">
              Benchmark your resume against industry skill matrices and uncover missing proficiencies in Module 5.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={Target}
              onClick={() => navigate(resumeText ? '/skill-gap' : '/upload-resume')}
            >
              {resumeText ? 'Run Skill Gap Analysis' : 'Upload Resume'}
            </Button>
          </div>
        )}
      </div>

      {/* RESUME IMPROVEMENT SUGGESTIONS HIGHLIGHTS */}
      <div className="resumate-card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Lightbulb size={18} color="var(--color-primary)" />
            Resume Phrasing & Action-Verb Improvements
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/improvements')}
            style={{ fontSize: 'var(--font-xs)' }}
          >
            All Suggestions <ArrowRight size={12} />
          </Button>
        </div>

        {improvementSuggestions ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Executive Summary Suggestion if present */}
            {improvementSuggestions.executiveSummarySuggestion && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid var(--color-primary-subtle)',
                  fontSize: 'var(--font-xs)',
                  lineHeight: '1.6'
                }}
              >
                <strong style={{ color: 'var(--color-primary-hover)', display: 'block', marginBottom: '4px' }}>
                  Suggested Executive Summary:
                </strong>
                <p style={{ fontStyle: 'italic', margin: 0, color: 'var(--color-text-main)' }}>
                  "{improvementSuggestions.executiveSummarySuggestion}"
                </p>
              </div>
            )}

            {/* Sample Bullet Point Rewrites */}
            {improvementSuggestions.actionVerbEnhancements &&
              improvementSuggestions.actionVerbEnhancements.slice(0, 2).map((enh, idx) => (
                <div key={idx} className="bullet-diff-card">
                  <div className="bullet-diff-row">
                    <span className="bullet-label-before">Before (Passive Phrase)</span>
                    <span className="bullet-text-before">{enh.originalPhrase}</span>
                  </div>
                  <div className="bullet-diff-row">
                    <span className="bullet-label-after">After (Measurable Impact)</span>
                    <span className="bullet-text-after">{enh.suggestedRewrite}</span>
                  </div>
                  {enh.reason && (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      <strong>Why:</strong> {enh.reason}
                    </span>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="mini-empty-state">
            <Lightbulb size={24} className="mini-empty-icon" />
            <span className="mini-empty-title">Improvement Suggestions Not Generated</span>
            <p className="mini-empty-desc">
              Request AI rewrites for passive phrasing, quantified metrics, and ATS formatting guidelines in Module 6.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate(resumeText ? '/improvements' : '/upload-resume')}
            >
              {resumeText ? 'Generate AI Suggestions' : 'Upload Resume'}
            </Button>
          </div>
        )}
      </div>

      {/* SEVEN INTEGRATED MODULES NAVIGATION PIPELINE */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, margin: '0 0 4px 0' }}>
            Seven Modules System Navigation
          </h2>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Direct access to all seven integrated modules in the RESUMATE AI architecture.
          </p>
        </div>

        <div className="grid-3">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="module-nav-card">
                <div className="module-nav-top">
                  <div className="module-icon-box">
                    <Icon size={20} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {mod.num}
                    </span>
                    <span className={`badge ${mod.badgeClass}`}>
                      {mod.status}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: '6px' }}>
                  {mod.name}
                </h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', flex: 1, marginBottom: '16px', lineHeight: '1.5' }}>
                  {mod.desc}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate(mod.route)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {mod.actionLabel}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
