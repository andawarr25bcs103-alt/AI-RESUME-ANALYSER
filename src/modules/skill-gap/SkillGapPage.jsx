import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Code2,
  AlertCircle,
  FileSearch,
  Sparkles,
  TrendingUp,
  Layers,
  Database,
  Wrench,
  Users,
  Info,
  RefreshCw
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { analyzeSkillGapWithGemini, isGeminiConfigured } from '../../services/geminiService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

/* ─────────────────────────── helpers ─────────────────────────── */

/**
 * Maps Gemini's raw skill-gap response into the required result shape:
 * { matchedSkills, missingSkills, skillCategories, skillCoverage, priorityAnalysis, learningSuggestions }
 */
function buildSkillAnalysisResults(raw, matchingResults, analysisResults) {
  /* ── 1. Gather all demonstrated skills from the resume ── */
  const acquiredSet = new Set(
    (raw.acquiredSkills || []).map((s) => s.toLowerCase().trim())
  );

  /* Pull extra skill hints from analysisResults if available */
  if (analysisResults?.skills) {
    const { technical = [], soft = [], toolsAndFrameworks = [] } = analysisResults.skills;
    [...technical, ...soft, ...toolsAndFrameworks].forEach((s) =>
      acquiredSet.add(s.toLowerCase().trim())
    );
  }

  /* ── 2. Gather required skills (from matching + gemini output) ── */
  const requiredFromMatching = matchingResults
    ? [
        ...(matchingResults.matchingKeywords || []),
        ...(matchingResults.missingKeywords || []),
        ...(matchingResults.keyRoleRequirements || [])
      ]
    : [];

  const requiredFromGemini = [
    ...(raw.missingCriticalSkills || []),
    ...(raw.missingOptionalSkills || []),
    ...(raw.acquiredSkills || [])
  ];

  const allRequiredSkills = [
    ...new Set(
      [...requiredFromMatching, ...requiredFromGemini].map((s) =>
        s.toLowerCase().trim()
      )
    )
  ].filter(Boolean);

  /* ── 3. Matched vs missing ── */
  const matchedSkills = allRequiredSkills.filter((s) => acquiredSet.has(s));
  const missingSkills = allRequiredSkills.filter((s) => !acquiredSet.has(s));

  /* ── 4. Skill coverage ── */
  const skillCoverage =
    allRequiredSkills.length > 0
      ? Math.round((matchedSkills.length / allRequiredSkills.length) * 100)
      : null; // null = no required skills identified

  /* ── 5. Categorise ALL identified skills ── */
  const programmingLangPatterns =
    /\b(python|java(?:script)?|typescript|c\+\+|c#|go|rust|ruby|swift|kotlin|php|r|scala|perl|bash|shell|sql|html|css)\b/i;
  const frameworkPatterns =
    /\b(react|angular|vue|next\.?js|nuxt|svelte|django|flask|fastapi|spring|express|nest\.?js|rails|laravel|\.net|pytorch|tensorflow|keras|scikit[\- ]?learn|hugging[\s-]?face)\b/i;
  const databasePatterns =
    /\b(mysql|postgresql|postgres|mongodb|redis|sqlite|oracle|cassandra|dynamodb|elasticsearch|firebase|supabase|prisma|sequelize)\b/i;
  const toolPatterns =
    /\b(git|docker|kubernetes|k8s|aws|azure|gcp|google cloud|jenkins|github actions|ci\/cd|terraform|ansible|linux|unix|jira|figma|postman|graphql|rest|api|webpack|vite|babel|eslint)\b/i;
  const softSkillPatterns =
    /\b(communication|leadership|teamwork|problem[\s-]?solving|critical thinking|collaboration|adaptability|time management|creativity|mentoring|agile|scrum|project management|analytical|interpersonal)\b/i;

  const categorise = (skills) => {
    const categories = {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      toolsAndTechnologies: [],
      softSkills: []
    };
    skills.forEach((skill) => {
      const s = skill.toLowerCase();
      if (softSkillPatterns.test(s)) categories.softSkills.push(skill);
      else if (databasePatterns.test(s)) categories.databases.push(skill);
      else if (frameworkPatterns.test(s)) categories.frameworks.push(skill);
      else if (programmingLangPatterns.test(s)) categories.programmingLanguages.push(skill);
      else if (toolPatterns.test(s)) categories.toolsAndTechnologies.push(skill);
      else categories.toolsAndTechnologies.push(skill); // fallback bucket
    });
    return categories;
  };

  const matchedCats = categorise(matchedSkills.map((s) => toTitle(s)));
  const missingCats = categorise(missingSkills.map((s) => toTitle(s)));

  const skillCategories = {
    programmingLanguages: {
      matched: matchedCats.programmingLanguages,
      missing: missingCats.programmingLanguages
    },
    frameworks: {
      matched: matchedCats.frameworks,
      missing: missingCats.frameworks
    },
    databases: {
      matched: matchedCats.databases,
      missing: missingCats.databases
    },
    toolsAndTechnologies: {
      matched: matchedCats.toolsAndTechnologies,
      missing: missingCats.toolsAndTechnologies
    },
    softSkills: {
      matched: matchedCats.softSkills,
      missing: missingCats.softSkills
    }
  };

  /* ── 6. Priority analysis ── */
  const criticalSet = new Set(
    (raw.missingCriticalSkills || []).map((s) => s.toLowerCase().trim())
  );
  const optionalSet = new Set(
    (raw.missingOptionalSkills || []).map((s) => s.toLowerCase().trim())
  );

  const priorityAnalysis = {
    high: missingSkills.filter((s) => criticalSet.has(s)).map((s) => toTitle(s)),
    medium: missingSkills
      .filter((s) => !criticalSet.has(s) && optionalSet.has(s))
      .map((s) => toTitle(s)),
    low: missingSkills
      .filter((s) => !criticalSet.has(s) && !optionalSet.has(s))
      .map((s) => toTitle(s))
  };

  /* ── 7. Learning suggestions (from roadmap) ── */
  const learningSuggestions = (raw.learningRoadmap || []).map((item) => ({
    skill: item.skill,
    priority: item.importance || 'Medium',
    resource: item.learningResource || 'Search online for courses and tutorials',
    certification: (raw.recommendedCertifications || []).find((c) =>
      c.toLowerCase().includes(item.skill.toLowerCase())
    ) || null
  }));

  /* Append skills that are missing but not in roadmap */
  const roadmapSkillSet = new Set(
    (raw.learningRoadmap || []).map((i) => i.skill.toLowerCase().trim())
  );
  missingSkills.forEach((s) => {
    if (!roadmapSkillSet.has(s)) {
      const priority = criticalSet.has(s)
        ? 'High'
        : optionalSet.has(s)
        ? 'Medium'
        : 'Low';
      learningSuggestions.push({
        skill: toTitle(s),
        priority,
        resource: 'Search online for courses and tutorials',
        certification: null
      });
    }
  });

  return {
    targetRole: raw.targetRole || '',
    readinessScore: raw.readinessScore || 0,
    matchedSkills: matchedSkills.map((s) => toTitle(s)),
    missingSkills: missingSkills.map((s) => toTitle(s)),
    skillCategories,
    skillCoverage,
    priorityAnalysis,
    learningSuggestions,
    recommendedCertifications: raw.recommendedCertifications || []
  };
}

function toTitle(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─────────────────────────── sub-components ─────────────────────────── */

/** Animated progress bar */
function CoverageBar({ coverage }) {
  if (coverage === null) {
    return (
      <div className="alert alert-info" style={{ marginTop: 0 }}>
        <Info size={16} />
        <span>
          No required skills could be identified from the job description or matching results.
          Coverage calculation requires a job description to be provided in the Job Matching module.
        </span>
      </div>
    );
  }

  const color =
    coverage >= 70
      ? 'var(--color-success)'
      : coverage >= 40
      ? 'var(--color-warning)'
      : 'var(--color-danger)';

  const label =
    coverage >= 70 ? 'Strong Coverage' : coverage >= 40 ? 'Moderate Coverage' : 'Low Coverage';

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}
      >
        <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 700,
            color
          }}
        >
          {coverage}%
        </span>
      </div>
      <div
        style={{
          height: '12px',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${coverage}%`,
            backgroundColor: color,
            borderRadius: 'var(--radius-pill)',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
      <p
        style={{
          fontSize: 'var(--font-xs)',
          color: 'var(--color-text-muted)',
          marginTop: '6px'
        }}
      >
        Matched {/* dynamically calculated from the data above */}
        required skills vs total identified required skills
      </p>
    </div>
  );
}

/** Skill chip with matched/missing variant */
function SkillChip({ label, variant }) {
  const styles = {
    matched: { className: 'badge badge-success', prefix: '✓' },
    missing: { className: 'badge badge-danger', prefix: '○' }
  };
  const s = styles[variant] || styles.matched;
  return (
    <span className={s.className} title={variant === 'missing' ? 'Not demonstrated in resume' : 'Demonstrated in resume'}>
      {s.prefix} {label}
    </span>
  );
}

/** Category section with matched + missing chips */
function CategorySection({ icon: Icon, label, matched, missing, iconColor }) {
  if (matched.length === 0 && missing.length === 0) return null;
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <Icon size={16} color={iconColor || 'var(--color-primary)'} />
        <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {label}
        </span>
        <span
          className="badge badge-primary"
          style={{ marginLeft: 'auto', fontSize: '10px' }}
        >
          {matched.length}/{matched.length + missing.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {matched.map((s, i) => (
          <SkillChip key={`m-${i}`} label={s} variant="matched" />
        ))}
        {missing.map((s, i) => (
          <SkillChip key={`x-${i}`} label={s} variant="missing" />
        ))}
      </div>
    </div>
  );
}

/** Priority badge helper */
function PriorityBadge({ priority }) {
  const map = {
    High: 'badge-danger',
    Medium: 'badge-warning',
    Low: 'badge-primary'
  };
  return <span className={`badge ${map[priority] || 'badge-primary'}`}>{priority} Priority</span>;
}

/* ─────────────────────────── radar chart data builder ─────────────────────────── */
function buildRadarData(skillCategories) {
  const catMap = {
    'Programming': skillCategories.programmingLanguages,
    'Frameworks': skillCategories.frameworks,
    'Databases': skillCategories.databases,
    'Tools': skillCategories.toolsAndTechnologies,
    'Soft Skills': skillCategories.softSkills
  };

  return Object.entries(catMap)
    .filter(([, cat]) => cat.matched.length + cat.missing.length > 0)
    .map(([name, cat]) => {
      const total = cat.matched.length + cat.missing.length;
      const coverage = total > 0 ? Math.round((cat.matched.length / total) * 100) : 0;
      return { subject: name, coverage, fullMark: 100 };
    });
}

/* ─────────────────────────── main page ─────────────────────────── */

export const SkillGapPage = () => {
  const {
    resumeText,
    analysisResults,
    matchingResults,
    targetJobRole,
    setTargetJobRole,
    jobDescription,
    skillAnalysisResults,
    setSkillAnalysisResults
  } = useApp();

  const [roleInput, setRoleInput] = useState(targetJobRole || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  /* ── empty state: no resume ── */
  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="Skill Gap Analysis"
          description="Identify missing competencies, categorize skills, and get a personalized learning roadmap."
          badge="Module 5"
          icon={Target}
        />
        <EmptyState
          icon={FileSearch}
          title="Resume Required for Skill Gap Analysis"
          description="Upload a candidate resume first to diagnose missing proficiencies for your target career path."
          actionLabel="Upload Resume"
          onAction={() => navigate('/upload-resume')}
        />
      </div>
    );
  }

  /* ── run analysis ── */
  const handleRunSkillGap = async (e) => {
    e.preventDefault();
    if (!roleInput.trim()) {
      setErrorMsg('Please specify a target role.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setTargetJobRole(roleInput.trim());

    try {
      const raw = await analyzeSkillGapWithGemini(
        resumeText,
        roleInput.trim(),
        jobDescription || ''
      );

      const structured = buildSkillAnalysisResults(raw, matchingResults, analysisResults);
      setSkillAnalysisResults(structured);
    } catch (err) {
      console.error('Skill Gap Analysis Error:', err);
      setErrorMsg(
        err.message ||
          'Failed to analyze skill gap. Verify your Gemini API key in the .env file.'
      );
    } finally {
      setLoading(false);
    }
  };

  const r = skillAnalysisResults;
  const radarData = r?.skillCategories ? buildRadarData(r.skillCategories) : [];

  const categoryConfig = [
    {
      key: 'programmingLanguages',
      label: 'Programming Languages',
      icon: Code2,
      iconColor: 'var(--color-primary)'
    },
    {
      key: 'frameworks',
      label: 'Frameworks & Libraries',
      icon: Layers,
      iconColor: 'var(--color-secondary)'
    },
    {
      key: 'databases',
      label: 'Databases',
      icon: Database,
      iconColor: 'var(--color-info)'
    },
    {
      key: 'toolsAndTechnologies',
      label: 'Tools & Technologies',
      icon: Wrench,
      iconColor: 'var(--color-warning)'
    },
    {
      key: 'softSkills',
      label: 'Soft Skills',
      icon: Users,
      iconColor: 'var(--color-success)'
    }
  ];

  return (
    <div>
      <PageHeader
        title="Skill Gap Analysis"
        description="Diagnose missing competencies, calculate role readiness, and generate an upskilling roadmap."
        badge="Module 5"
        icon={Target}
      />

      {/* ── Error alert ── */}
      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── API key warning ── */}
      {!isGeminiConfigured() && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Gemini API Key Required:</strong> Set{' '}
            <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to generate
            real skill matrix evaluations.
          </div>
        </div>
      )}

      {/* ── Info: matching results available ── */}
      {matchingResults && (
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          <Info size={16} />
          <span>
            Job matching results detected — required skills will be pulled from
            matching analysis for more accurate coverage calculation.
          </span>
        </div>
      )}

      {/* ── Target Role Form ── */}
      <div className="resumate-card" style={{ marginBottom: '24px' }}>
        <form
          onSubmit={handleRunSkillGap}
          style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <div style={{ flex: 1, minWidth: '260px' }}>
            <label className="form-label" htmlFor="skill-role-input">
              Target Career Role
            </label>
            <input
              id="skill-role-input"
              type="text"
              className="form-input"
              placeholder="e.g. Full Stack Developer, Data Scientist, Cloud Architect"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              required
            />
            {!jobDescription && (
              <p className="form-helper" style={{ marginTop: '4px' }}>
                💡 Tip: Run Job Matching first to get more precise skill coverage data.
              </p>
            )}
          </div>
          <Button type="submit" variant="primary" icon={Sparkles} isLoading={loading}>
            {r ? 'Re-Run Analysis' : 'Run Skill Gap Analysis'}
          </Button>
          {r && (
            <Button
              type="button"
              variant="outline"
              icon={RefreshCw}
              onClick={() => setSkillAnalysisResults(null)}
            >
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <Loader
          size="lg"
          message="Benchmarking resume competencies against industry standards..."
        />
      )}

      {/* ── Results ── */}
      {!loading && r && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Row 1: Readiness + Coverage ── */}
          <div className="grid-2">
            {/* Readiness Score */}
            <div className="resumate-card" style={{ textAlign: 'center' }}>
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
                Role Readiness Index
              </span>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: 1,
                  margin: '8px 0 4px'
                }}
              >
                {r.readinessScore ?? 0}%
              </div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Target:{' '}
                <strong style={{ color: 'var(--color-text-main)' }}>{r.targetRole}</strong>
              </p>
            </div>

            {/* Skill Coverage */}
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <TrendingUp size={18} color="var(--color-primary)" />
                  Skill Coverage
                </h3>
              </div>
              <CoverageBar coverage={r.skillCoverage} />
              {r.skillCoverage !== null && (
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginTop: '14px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> {r.matchedSkills.length} Matched
                  </span>
                  <span className="badge badge-danger">
                    <AlertTriangle size={12} /> {r.missingSkills.length} Not Demonstrated
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 2: Matched Skills + Missing Skills ── */}
          <div className="grid-2">
            {/* Matched Skills */}
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--font-md)' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  Skills Demonstrated in Resume
                </h3>
              </div>
              {r.matchedSkills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {r.matchedSkills.map((sk, i) => (
                    <span key={i} className="badge badge-success">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                  No required skills matched in the resume based on the available data.
                </p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--font-md)' }}>
                  <AlertTriangle size={18} color="var(--color-danger)" />
                  Not Demonstrated in Resume
                </h3>
              </div>
              {r.missingSkills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {r.missingSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="badge badge-danger"
                      title="Not demonstrated in resume"
                    >
                      ○ {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-success)' }}>
                  🎉 All identified required skills are demonstrated in the resume!
                </p>
              )}
            </div>
          </div>

          {/* ── Row 3: Skill Categories ── */}
          <div className="resumate-card">
            <div className="card-header">
              <h3 className="card-title">
                <Layers size={18} color="var(--color-primary)" />
                Skill Categories
              </h3>
              <span className="badge badge-primary">By Domain</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '12px'
              }}
            >
              {categoryConfig.map(({ key, label, icon, iconColor }) => (
                <CategorySection
                  key={key}
                  icon={icon}
                  label={label}
                  matched={r.skillCategories[key]?.matched || []}
                  missing={r.skillCategories[key]?.missing || []}
                  iconColor={iconColor}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                fontSize: 'var(--font-xs)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <span>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>✓ Matched</span>{' '}
                Demonstrated in resume
              </span>
              <span>
                <span className="badge badge-danger" style={{ fontSize: '10px' }}>○ Missing</span>{' '}
                Not demonstrated in resume
              </span>
            </div>
          </div>

          {/* ── Row 4: Radar Chart ── */}
          {radarData.length >= 3 && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <TrendingUp size={18} color="var(--color-primary)" />
                  Skill Coverage by Category
                </h3>
                <span className="badge badge-secondary">Radar View</span>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fontSize: 12,
                        fill: 'var(--color-text-secondary)',
                        fontFamily: 'inherit'
                      }}
                    />
                    <Radar
                      name="Coverage"
                      dataKey="coverage"
                      stroke="var(--color-primary)"
                      fill="var(--color-primary)"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <RechartsTooltip
                      formatter={(val) => [`${val}%`, 'Coverage']}
                      contentStyle={{
                        fontSize: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── Row 5: Priority Analysis ── */}
          <div className="resumate-card">
            <div className="card-header">
              <h3 className="card-title">
                <AlertTriangle size={18} color="var(--color-warning)" />
                Skill Priority Analysis
              </h3>
              <span className="badge badge-warning">Gap Prioritization</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px'
              }}
            >
              {/* High */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger-border)'
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-danger)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🔴 High Priority
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)' }}>
                    ({r.priorityAnalysis.high.length})
                  </span>
                </div>
                {r.priorityAnalysis.high.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {r.priorityAnalysis.high.map((s, i) => (
                      <span
                        key={i}
                        className="badge badge-danger"
                        title="Not demonstrated in resume"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                    No high-priority gaps identified.
                  </p>
                )}
              </div>

              {/* Medium */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-warning-bg)',
                  border: '1px solid var(--color-warning-border)'
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-warning)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🟡 Medium Priority
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)' }}>
                    ({r.priorityAnalysis.medium.length})
                  </span>
                </div>
                {r.priorityAnalysis.medium.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {r.priorityAnalysis.medium.map((s, i) => (
                      <span
                        key={i}
                        className="badge badge-warning"
                        title="Not demonstrated in resume"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                    No medium-priority gaps identified.
                  </p>
                )}
              </div>

              {/* Low */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid var(--color-primary-subtle)'
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-primary)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🔵 Low Priority
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)' }}>
                    ({r.priorityAnalysis.low.length})
                  </span>
                </div>
                {r.priorityAnalysis.low.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {r.priorityAnalysis.low.map((s, i) => (
                      <span
                        key={i}
                        className="badge badge-primary"
                        title="Not demonstrated in resume"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                    No low-priority gaps identified.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Row 6: Learning Suggestions ── */}
          {r.learningSuggestions.length > 0 && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <BookOpen size={18} color="var(--color-primary)" />
                  Learning Suggestions & Roadmap
                </h3>
                <span className="badge badge-primary">{r.learningSuggestions.length} skills</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {r.learningSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <strong
                        style={{
                          fontSize: 'var(--font-sm)',
                          color: 'var(--color-text-main)',
                          display: 'block',
                          marginBottom: '4px'
                        }}
                      >
                        {item.skill}
                      </strong>
                      <p
                        style={{
                          fontSize: 'var(--font-xs)',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          lineHeight: 1.5
                        }}
                      >
                        📚 {item.resource}
                      </p>
                      {item.certification && (
                        <p
                          style={{
                            fontSize: 'var(--font-xs)',
                            color: 'var(--color-info)',
                            marginTop: '4px',
                            margin: '4px 0 0'
                          }}
                        >
                          🏅 Certification: {item.certification}
                        </p>
                      )}
                    </div>
                    <PriorityBadge priority={item.priority} />
                  </div>
                ))}
              </div>

              {r.recommendedCertifications?.length > 0 && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '14px',
                    backgroundColor: 'var(--color-info-bg)',
                    border: '1px solid var(--color-info-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <strong
                    style={{
                      fontSize: 'var(--font-sm)',
                      color: 'var(--color-info)',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    🏅 Recommended Certifications
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {r.recommendedCertifications.map((cert, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-info-border)',
                          color: 'var(--color-info)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: 'var(--font-xs)',
                          fontWeight: 500
                        }}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Empty: no gaps ── */}
          {r.missingSkills.length === 0 && r.learningSuggestions.length === 0 && (
            <div className="resumate-card" style={{ textAlign: 'center', padding: '32px' }}>
              <CheckCircle2 size={40} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: 'var(--color-success)', marginBottom: '8px' }}>
                No Skill Gaps Detected
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-sm)' }}>
                The resume demonstrates all identified required skills for this role. Consider running
                analysis with a specific job description for more precise gap detection.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SkillGapPage;
