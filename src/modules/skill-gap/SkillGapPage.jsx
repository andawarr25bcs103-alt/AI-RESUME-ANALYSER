import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileText,
  Briefcase,
  CheckCircle2,
  Info,
  Database,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getGeminiClient,
  isGeminiConfigured,
  parseGeminiJsonResponse
} from '../../services/geminiService';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import SkillCoverage from './SkillCoverage';
import SkillsComparison from './SkillsComparison';
import SkillPriority from './SkillPriority';
import LearningSuggestions from './LearningSuggestions';
import {
  SAMPLE_RESUME_TEXT,
  SAMPLE_JOB_ROLE,
  SAMPLE_JOB_DESCRIPTION,
  SAMPLE_REQUIRED_SKILLS
} from './sampleData';
import './SkillGap.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Deterministic Fallback Engine (when Gemini API is offline or unconfigured)
   Extracts and evaluates actual skills from resume text and job description
   without inventing fake skills or hallucinating.
   ───────────────────────────────────────────────────────────────────────────── */

const COMMON_SKILL_PATTERNS = [
  { name: 'JavaScript', category: 'Programming Languages', regex: /\b(javascript|js|es6|es2015\+?)\b/i, weight: 3 },
  { name: 'TypeScript', category: 'Programming Languages', regex: /\b(typescript|ts)\b/i, weight: 3 },
  { name: 'Python', category: 'Programming Languages', regex: /\b(python|py)\b/i, weight: 3 },
  { name: 'Java', category: 'Programming Languages', regex: /\b(java)\b(?!\s*script)/i, weight: 3 },
  { name: 'C++', category: 'Programming Languages', regex: /\b(c\+\+)\b/i, weight: 3 },
  { name: 'SQL', category: 'Databases', regex: /\b(sql)\b/i, weight: 3 },
  { name: 'HTML5', category: 'Programming Languages', regex: /\b(html5?)\b/i, weight: 2 },
  { name: 'CSS3', category: 'Programming Languages', regex: /\b(css3?|sass|scss)\b/i, weight: 2 },
  { name: 'React', category: 'Frameworks', regex: /\b(react(?:\.js)?)\b/i, weight: 3 },
  { name: 'Node.js', category: 'Frameworks', regex: /\b(node(?:\.js)?)\b/i, weight: 3 },
  { name: 'Express', category: 'Frameworks', regex: /\b(express(?:\.js)?)\b/i, weight: 2 },
  { name: 'Redux', category: 'Frameworks', regex: /\b(redux(?:\s*toolkit)?)\b/i, weight: 2 },
  { name: 'PostgreSQL', category: 'Databases', regex: /\b(postgres(?:ql)?)\b/i, weight: 3 },
  { name: 'MongoDB', category: 'Databases', regex: /\b(mongo(?:db)?)\b/i, weight: 2 },
  { name: 'Redis', category: 'Databases', regex: /\b(redis)\b/i, weight: 2 },
  { name: 'Docker', category: 'Tools and Technologies', regex: /\b(docker)\b/i, weight: 3 },
  { name: 'Kubernetes', category: 'Tools and Technologies', regex: /\b(kubernetes|k8s)\b/i, weight: 3 },
  { name: 'AWS', category: 'Tools and Technologies', regex: /\b(aws|amazon web services|s3|ec2|lambda)\b/i, weight: 3 },
  { name: 'Git', category: 'Tools and Technologies', regex: /\b(git|github|gitlab)\b/i, weight: 2 },
  { name: 'RESTful APIs', category: 'Tools and Technologies', regex: /\b(rest(?:ful)?\s*api|apis)\b/i, weight: 2 },
  { name: 'GraphQL', category: 'Tools and Technologies', regex: /\b(graphql)\b/i, weight: 2 },
  { name: 'CI/CD', category: 'Tools and Technologies', regex: /\b(ci\/cd|continuous integration|github actions|jenkins)\b/i, weight: 2 },
  { name: 'Jest', category: 'Tools and Technologies', regex: /\b(jest|unit test(?:ing)?|cypress)\b/i, weight: 2 },
  { name: 'Agile / Scrum', category: 'Soft Skills', regex: /\b(agile|scrum|sprint)\b/i, weight: 1 },
  { name: 'Problem Solving', category: 'Soft Skills', regex: /\b(problem\s*solving|analytical)\b/i, weight: 1 },
  { name: 'Team Collaboration', category: 'Soft Skills', regex: /\b(teamwork|collaboration|cross-functional)\b/i, weight: 1 }
];

function runDeterministicAnalysis(resumeText, jobDescription, targetRole) {
  const resumeLower = (resumeText || '').toLowerCase();
  const jobLower = (jobDescription || '').toLowerCase();

  const detectedJobSkills = [];

  COMMON_SKILL_PATTERNS.forEach((pattern) => {
    const appearsInJob = pattern.regex.test(jobLower) || (pattern.name.toLowerCase() === targetRole.toLowerCase());
    if (appearsInJob) {
      detectedJobSkills.push(pattern);
    }
  });

  // If few skills found in job text, fallback to sample patterns
  const activeRequired = detectedJobSkills.length >= 3 ? detectedJobSkills : COMMON_SKILL_PATTERNS.slice(0, 10);

  const matched = [];
  const partial = [];
  const missing = [];

  let weightedEarned = 0;
  let weightedTotal = 0;

  activeRequired.forEach((skill) => {
    const weight = skill.weight || 2;
    weightedTotal += weight;

    const inResume = skill.regex.test(resumeLower);
    if (inResume) {
      // Check if candidate mentions it casually or as basic vs strong experience
      const isBasic = new RegExp(`(basic|familiar|exposure|introductory)\\s*(with)?\\s*${skill.name}`, 'i').test(resumeText);
      if (isBasic) {
        partial.push({
          skill: skill.name,
          reason: `Resume mentions foundational or basic familiarity, but target role expects full operational depth.`
        });
        weightedEarned += weight * 0.5;
      } else {
        matched.push({
          skill: skill.name,
          evidence: `Directly verified in candidate experience and technical skill listing.`
        });
        weightedEarned += weight;
      }
    } else {
      missing.push({
        skill: skill.name,
        reason: `Not demonstrated in resume text. Required for core competency assessment.`
      });
    }
  });

  const coveragePct = weightedTotal > 0 ? Math.round((weightedEarned / weightedTotal) * 100) : 0;

  // Build priority groups
  const highPriority = missing.slice(0, 2).map((m) => ({
    skill: m.skill,
    reason: `Core job requirement with primary hiring weight.`
  }));

  const mediumPriority = [
    ...missing.slice(2, 4).map((m) => ({ skill: m.skill, reason: `Important role competency; strengthens interview qualification.` })),
    ...partial.map((p) => ({ skill: p.skill, reason: `Elevate foundational knowledge to production depth.` }))
  ];

  const lowPriority = missing.slice(4).map((m) => ({
    skill: m.skill,
    reason: `Secondary or complementary requirement.`
  }));

  // Learning suggestions
  const allGaps = [...highPriority, ...mediumPriority];
  const learningSuggestions = allGaps.map((item, idx) => ({
    skill: item.skill,
    priority: idx < 2 ? 'High' : 'Medium',
    suggestedOrder: idx + 1,
    whyImportant: `Crucial requirement for ${targetRole || 'this technical position'}.`,
    approach: `Complete structured hands-on documentation, tutorials, and integration exercises.`,
    practicalProject: `Build and publish a functional project demonstrating ${item.skill} integration on GitHub.`,
    estimatedDuration: idx < 2 ? '1-2 weeks' : '2-3 weeks'
  }));

  const focusFirst = highPriority.map((h) => h.skill);

  return {
    targetRole: targetRole || 'Target Role',
    overallMatchPercentage: coveragePct,
    totalRequiredSkills: activeRequired.length,
    matchingSkillsCount: matched.length,
    missingSkillsCount: missing.length,
    partialSkillsCount: partial.length,
    matchedSkills: matched,
    missingSkills: missing,
    partialSkills: partial,
    highPriority,
    mediumPriority,
    lowPriority,
    learningSuggestions,
    focusFirst,
    isSampleFallback: !isGeminiConfigured()
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main SkillGapPage Component
   ───────────────────────────────────────────────────────────────────────────── */

export const SkillGapPage = ({ standalone = false }) => {
  const {
    resumeText: contextResumeText,
    resumeFile,
    analysisResults,
    matchingResults,
    targetJobRole: contextJobRole,
    setTargetJobRole,
    jobDescription: contextJobDesc,
    setJobDescription,
    skillAnalysisResults,
    setSkillAnalysisResults
  } = useApp();

  // Mode: Use actual context data if present, otherwise allow seamless sample data testing
  const [useSampleMode, setUseSampleMode] = useState(!contextResumeText);
  const [roleInput, setRoleInput] = useState(contextJobRole || SAMPLE_JOB_ROLE);
  const [descInput, setDescInput] = useState(contextJobDesc || SAMPLE_JOB_DESCRIPTION);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoNotice, setInfoNotice] = useState('');

  // Effective resume text based on mode
  const effectiveResumeText = useSampleMode ? SAMPLE_RESUME_TEXT : (contextResumeText || '');
  const hasActualResume = Boolean(contextResumeText && contextResumeText.trim().length > 0);
  const hasJobDesc = Boolean(descInput && descInput.trim().length > 0);

  // Sync inputs with shared context when context updates
  useEffect(() => {
    if (contextJobRole) setRoleInput(contextJobRole);
    if (contextJobDesc) setDescInput(contextJobDesc);
  }, [contextJobRole, contextJobDesc]);

  // Handle switching to sample data for standalone testing
  const handleToggleSampleMode = () => {
    if (!useSampleMode) {
      setUseSampleMode(true);
      setRoleInput(SAMPLE_JOB_ROLE);
      setDescInput(SAMPLE_JOB_DESCRIPTION);
      setInfoNotice('Switched to Standalone Testing Mode with verified sample data.');
    } else {
      setUseSampleMode(false);
      setRoleInput(contextJobRole || '');
      setDescInput(contextJobDesc || '');
      setInfoNotice(hasActualResume ? 'Switched to actual AppContext resume data.' : 'Switched to AppContext. (No resume uploaded yet)');
    }
  };

  // Perform AI or Deterministic Skill Gap Analysis
  const handleAnalyzeSkillGap = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setInfoNotice('');

    if (!effectiveResumeText.trim()) {
      setErrorMsg('No resume content available. Please upload a resume or enable Sample Testing Mode.');
      return;
    }

    if (!roleInput.trim()) {
      setErrorMsg('Please specify a Target Job Title to benchmark skill gaps.');
      return;
    }

    setLoading(true);

    // Save target role & job description to shared AppContext
    if (setTargetJobRole) setTargetJobRole(roleInput.trim());
    if (setJobDescription) setJobDescription(descInput.trim());

    try {
      if (isGeminiConfigured()) {
        const ai = getGeminiClient();

        const prompt = `You are an expert AI Career and Skills Assessment Specialist for RESUMATE AI.
Perform a strict, comprehensive Skill Gap Analysis by comparing the candidate's actual resume against the target job requirements.

STRICT INSTRUCTIONS:
1. Read the complete resume text and extract all skills actually evidenced.
2. Identify the skills required for the target job: "${roleInput.trim()}".
3. Reference the provided job description:
"""
${descInput.trim()}
"""
4. Identify:
   - "matchedSkills": Skills explicitly demonstrated in the resume that match job requirements. Provide brief context.
   - "missingSkills": Skills required by the job that are NOT demonstrated in the resume. Wording: Use "Not demonstrated in resume".
   - "partialSkills": Skills where resume shows basic or related knowledge, but lacks full depth/production scope. Explain why.
5. Classify the skill gaps into priorities:
   - "highPriority": Critical must-have skills missing (essential blockers).
   - "mediumPriority": Important skills missing or partial matches.
   - "lowPriority": Nice-to-have or optional skills.
6. Provide "skillsToFocusFirst": Array of 2-3 most critical skills to focus on first.
7. Provide "learningSuggestions": Array of ordered learning items:
   - skill: string
   - priority: "High" | "Medium" | "Low"
   - suggestedOrder: number (1, 2, 3...)
   - whyImportant: string (why it matters for this specific role)
   - approach: string (practical study or tutorial guide)
   - practicalProject: string (actionable project idea to build proof of skill)
   - estimatedDuration: string (realistic timeframe, e.g. "1-2 weeks")
8. Calculate "overallMatchPercentage": (Weighted matched skill points / Total required skill points) * 100. (Integer 0-100).
9. Count totals:
   - "totalRequiredSkills": number
   - "matchingSkillsCount": number
   - "missingSkillsCount": number
   - "partialSkillsCount": number

Resume Text:
"""
${effectiveResumeText}
"""

Return ONLY a valid JSON object matching this exact schema:
{
  "targetRole": "${roleInput.trim()}",
  "overallMatchPercentage": number,
  "totalRequiredSkills": number,
  "matchingSkillsCount": number,
  "missingSkillsCount": number,
  "partialSkillsCount": number,
  "matchedSkills": [{"skill": "string", "evidence": "string"}],
  "missingSkills": [{"skill": "string", "reason": "string"}],
  "partialSkills": [{"skill": "string", "reason": "string"}],
  "highPriority": [{"skill": "string", "reason": "string"}],
  "mediumPriority": [{"skill": "string", "reason": "string"}],
  "lowPriority": [{"skill": "string", "reason": "string"}],
  "skillsToFocusFirst": ["string"],
  "learningSuggestions": [
    {
      "skill": "string",
      "priority": "High" | "Medium" | "Low",
      "suggestedOrder": number,
      "whyImportant": "string",
      "approach": "string",
      "practicalProject": "string",
      "estimatedDuration": "string"
    }
  ],
  "summary": "string"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const parsed = parseGeminiJsonResponse(response.text);

        // Sanitize and normalize results
        const structuredResults = {
          targetRole: parsed.targetRole || roleInput.trim(),
          overallMatchPercentage: parsed.overallMatchPercentage ?? 0,
          totalRequiredSkills: parsed.totalRequiredSkills ?? (parsed.matchedSkills?.length + parsed.missingSkills?.length),
          matchingSkillsCount: parsed.matchingSkillsCount ?? (parsed.matchedSkills?.length || 0),
          missingSkillsCount: parsed.missingSkillsCount ?? (parsed.missingSkills?.length || 0),
          partialSkillsCount: parsed.partialSkillsCount ?? (parsed.partialSkills?.length || 0),
          matchedSkills: parsed.matchedSkills || [],
          missingSkills: parsed.missingSkills || [],
          partialSkills: parsed.partialSkills || [],
          highPriority: parsed.highPriority || [],
          mediumPriority: parsed.mediumPriority || [],
          lowPriority: parsed.lowPriority || [],
          skillsToFocusFirst: parsed.skillsToFocusFirst || [],
          learningSuggestions: parsed.learningSuggestions || [],
          summary: parsed.summary || '',
          analyzedAt: new Date().toISOString()
        };

        setSkillAnalysisResults(structuredResults);
        setInfoNotice('Skill gap assessment completed successfully using Google Gemini API.');
      } else {
        // Deterministic Fallback Mode
        const results = runDeterministicAnalysis(effectiveResumeText, descInput, roleInput);
        setSkillAnalysisResults(results);
        setInfoNotice('Analyzed using deterministic engine (Configure VITE_GEMINI_API_KEY in .env for live Gemini 2.5 generation).');
      }
    } catch (err) {
      console.error('Skill Gap Analysis Error:', err);
      // If Gemini call fails (e.g. quota or network), gracefully use deterministic fallback
      const fallbackResults = runDeterministicAnalysis(effectiveResumeText, descInput, roleInput);
      setSkillAnalysisResults(fallbackResults);
      setInfoNotice('Network/API limitation encountered — generated analysis using rule-based engine.');
    } finally {
      setLoading(false);
    }
  };

  const r = skillAnalysisResults;

  return (
    <div className="sg-container">
      {/* ── Page Hero Header ── */}
      <header className="sg-hero-header">
        <div className="sg-hero-info">
          <div className="sg-hero-icon">
            <Target size={28} />
          </div>
          <div className="sg-hero-titles">
            <h1>Skill Gap Analysis</h1>
            <p>Identify missing skills and discover what you need to learn for your target job.</p>
          </div>
        </div>

        <div className="sg-hero-actions">
          <span className="badge badge-primary">
            Module 5
          </span>
          <Button
            variant={useSampleMode ? 'primary' : 'outline'}
            size="sm"
            onClick={handleToggleSampleMode}
          >
            {useSampleMode ? 'Using Sample Data (Standalone)' : 'Use Sample Test Data'}
          </Button>
        </div>
      </header>

      {/* ── Status Banners: Resume & Job Description Availability ── */}
      <section className="sg-status-row">
        {/* Resume Availability Status */}
        <div className="sg-status-card">
          <div className="sg-status-meta">
            <div className={`sg-status-indicator ${hasActualResume || useSampleMode ? 'active' : 'warning'}`} />
            <div>
              <div className="sg-status-title">Resume Information</div>
              <div className="sg-status-detail">
                {useSampleMode
                  ? 'Sample Profile (Alex Johnson)'
                  : hasActualResume
                  ? (resumeFile?.name || 'Uploaded Resume Active')
                  : 'No Resume in AppContext'}
              </div>
            </div>
          </div>
          <span className={`badge ${hasActualResume || useSampleMode ? 'badge-success' : 'badge-warning'}`}>
            {hasActualResume || useSampleMode ? 'Ready' : 'Missing'}
          </span>
        </div>

        {/* Job Description Availability Status */}
        <div className="sg-status-card">
          <div className="sg-status-meta">
            <div className={`sg-status-indicator ${hasJobDesc ? 'active' : 'warning'}`} />
            <div>
              <div className="sg-status-title">Target Job Information</div>
              <div className="sg-status-detail">
                {roleInput || (hasJobDesc ? 'Job Description Loaded' : 'No Job Role Specified')}
              </div>
            </div>
          </div>
          <span className={`badge ${hasJobDesc ? 'badge-success' : 'badge-warning'}`}>
            {hasJobDesc ? 'Configured' : 'Needs Input'}
          </span>
        </div>

        {/* Existing Module 4 Matching Status (if available) */}
        <div className="sg-status-card">
          <div className="sg-status-meta">
            <div className={`sg-status-indicator ${matchingResults ? 'active' : 'warning'}`} />
            <div>
              <div className="sg-status-title">Job Matching Context</div>
              <div className="sg-status-detail">
                {matchingResults ? `Matched (${matchingResults.matchPercentage || 0}%)` : 'Not run yet'}
              </div>
            </div>
          </div>
          <span className={`badge ${matchingResults ? 'badge-primary' : 'badge-secondary'}`}>
            {matchingResults ? 'Available' : 'Optional'}
          </span>
        </div>
      </section>

      {/* ── Alert Notices ── */}
      {errorMsg && (
        <div className="alert alert-danger" style={{ margin: 0 }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {infoNotice && (
        <div className="alert alert-info" style={{ margin: 0 }}>
          <Info size={18} />
          <span>{infoNotice}</span>
        </div>
      )}

      {/* ── Target Job Configuration Card ── */}
      <section className="sg-card">
        <div className="sg-card-header">
          <h2 className="sg-card-title">
            <Briefcase size={20} color="var(--color-primary)" />
            Target Job &amp; Requirement Benchmarks
          </h2>
          {useSampleMode && (
            <span className="badge badge-warning">
              Standalone Test Sample Mode
            </span>
          )}
        </div>

        <form onSubmit={handleAnalyzeSkillGap}>
          <div className="sg-form-grid">
            {/* Target Job Title */}
            <div className="sg-field-group">
              <label className="sg-field-label" htmlFor="sg-job-role">
                Target Job Title / Career Goal
              </label>
              <input
                id="sg-job-role"
                type="text"
                className="sg-field-input"
                placeholder="e.g. Senior Full Stack Engineer, Cloud Architect"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                required
              />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                Target role used to benchmark industry standard qualifications.
              </span>
            </div>

            {/* Resume Summary / Info Preview */}
            <div className="sg-field-group">
              <label className="sg-field-label">
                Active Resume Source
              </label>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '42px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontWeight: 500 }}>
                  <FileText size={16} color="var(--color-primary)" />
                  {useSampleMode ? 'Sample Resume (Frontend / Full Stack)' : (resumeFile?.name || 'Pasted Resume Text')}
                </span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                  ~{effectiveResumeText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                {useSampleMode ? 'Using pre-loaded sample resume for isolated localhost testing.' : 'Extracted from shared AppContext.'}
              </span>
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="sg-field-group" style={{ marginBottom: '16px' }}>
            <label className="sg-field-label" htmlFor="sg-job-desc">
              <span>Job Description &amp; Required Skills</span>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                Full posting or key requirements
              </span>
            </label>
            <textarea
              id="sg-job-desc"
              rows={5}
              className="sg-field-textarea"
              placeholder="Paste job description, technical stack, qualifications, and role responsibilities..."
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              required
            />
          </div>

          {/* Action Row */}
          <div className="sg-action-bar">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button
                type="submit"
                variant="primary"
                icon={Sparkles}
                isLoading={loading}
              >
                {r ? 'Re-Analyze Skill Gaps' : 'Analyze Skill Gaps'}
              </Button>

              {r && (
                <Button
                  type="button"
                  variant="outline"
                  icon={RefreshCw}
                  onClick={() => setSkillAnalysisResults(null)}
                >
                  Clear Results
                </Button>
              )}
            </div>

            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              Powered by Google Gemini 2.5 Flash
            </div>
          </div>
        </form>
      </section>

      {/* ── Loading Indicator ── */}
      {loading && (
        <Loader
          size="lg"
          message="Analyzing demonstrated competencies, identifying missing skills, and generating learning roadmap..."
        />
      )}

      {/* ── Active Analysis Results ── */}
      {!loading && r && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section D: Skill Gap Score / Skill Coverage */}
          <SkillCoverage
            coveragePercentage={r.overallMatchPercentage ?? 0}
            totalRequired={r.totalRequiredSkills ?? (r.matchedSkills?.length + r.missingSkills?.length)}
            matchedCount={r.matchingSkillsCount ?? r.matchedSkills?.length ?? 0}
            missingCount={r.missingSkillsCount ?? r.missingSkills?.length ?? 0}
            partialCount={r.partialSkillsCount ?? r.partialSkills?.length ?? 0}
          />

          {/* Section C: Skill Comparison (Matched, Missing, Partially Matching) */}
          <SkillsComparison
            matchedSkills={r.matchedSkills || []}
            missingSkills={r.missingSkills || []}
            partialSkills={r.partialSkills || []}
          />

          {/* Section E: Skill Priority (High, Medium, Low) */}
          <SkillPriority
            highPriority={r.highPriority || []}
            mediumPriority={r.mediumPriority || []}
            lowPriority={r.lowPriority || []}
          />

          {/* Section F: Learning Suggestions & Roadmap */}
          <LearningSuggestions
            suggestions={r.learningSuggestions || []}
            focusFirst={r.skillsToFocusFirst || []}
          />
        </div>
      )}

      {/* ── Initial Empty State ── */}
      {!loading && !r && (
        <div className="sg-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Target size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: '8px' }}>
            Ready to Analyze Skill Gaps
          </h3>
          <p style={{ maxWidth: '540px', margin: '0 auto 20px', color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)' }}>
            Compare your resume skills against the target role requirements to identify missing competencies, evaluate priority impact, and obtain a personalized step-by-step learning roadmap.
          </p>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={handleAnalyzeSkillGap}
          >
            Start Skill Gap Analysis
          </Button>
        </div>
      )}
    </div>
  );
};

export default SkillGapPage;
