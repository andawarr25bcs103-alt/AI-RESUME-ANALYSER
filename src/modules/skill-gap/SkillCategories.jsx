import React from 'react';
import {
  Code2,
  Layers,
  Database,
  Wrench,
  Users,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  Star,
  ArrowUpCircle
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

/* ─── domain configuration ─── */
const DOMAIN_CONFIG = [
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

/* ─── individual domain block ─── */
function DomainBlock({ config, categoryData }) {
  const { label, icon: Icon, iconColor } = config;
  const matched  = categoryData?.matched  || [];
  const missing  = categoryData?.missing  || [];
  const partial  = categoryData?.partial  || [];

  if (matched.length === 0 && missing.length === 0 && partial.length === 0) return null;

  const total = matched.length + missing.length + partial.length;

  return (
    <div className="sga-domain-block">
      <div className="sga-domain-block__header">
        <Icon size={15} color={iconColor} />
        <span className="sga-domain-block__label">{label}</span>
        <span className="badge badge-primary" style={{ fontSize: '10px' }}>
          {matched.length}/{total}
        </span>
      </div>
      <div className="sga-domain-block__chips">
        {matched.map((s, i) => (
          <span
            key={`m-${i}`}
            className="sga-chip sga-chip--matched"
            title="Demonstrated in resume"
          >
            <CheckCircle2 size={10} /> {s}
          </span>
        ))}
        {partial.map((s, i) => (
          <span
            key={`p-${i}`}
            className="sga-chip sga-chip--partial"
            title="Partially demonstrated in resume"
          >
            <GitMerge size={10} /> {s}
          </span>
        ))}
        {missing.map((s, i) => (
          <span
            key={`x-${i}`}
            className="sga-chip sga-chip--missing"
            title="Not demonstrated in resume"
          >
            <AlertTriangle size={10} /> {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── radar data builder ─── */
function buildRadarData(skillCategories) {
  const labels = {
    programmingLanguages: 'Programming',
    frameworks:           'Frameworks',
    databases:            'Databases',
    toolsAndTechnologies: 'Tools',
    softSkills:           'Soft Skills'
  };

  return Object.entries(labels)
    .map(([key, subject]) => {
      const cat     = skillCategories[key] || {};
      const matched = (cat.matched  || []).length;
      const partial = (cat.partial  || []).length;
      const missing = (cat.missing  || []).length;
      const total   = matched + partial + missing;
      if (total === 0) return null;
      const coverage = Math.round(((matched + partial * 0.5) / total) * 100);
      return { subject, coverage, fullMark: 100 };
    })
    .filter(Boolean);
}

/* ─── main export ─── */
/**
 * SkillCategories
 * ───────────────
 * Renders:
 *   1. Existing skills chip cloud (all skills found in resume)
 *   2. Skill categories domain grid (matched / partial / missing per domain)
 *   3. Radar chart when ≥ 3 domains have data
 *   4. Legend
 *
 * Props:
 *   results {object} – skillAnalysisResults from AppContext
 */
export function SkillCategories({ results }) {
  const {
    existingSkills   = [],
    skillCategories  = {},
    partialSkills    = []
  } = results;

  const radarData = buildRadarData(skillCategories);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Existing Skills (from resume) ── */}
      {existingSkills.length > 0 && (
        <div className="sga-section-card">
          <div className="sga-section-header">
            <span className="sga-section-title">
              <Star size={18} color="var(--color-primary)" />
              Existing Skills
            </span>
            <span className="badge badge-primary">{existingSkills.length} identified</span>
          </div>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: '14px'
            }}
          >
            Skills clearly demonstrated or mentioned in the uploaded resume.
          </p>
          <div className="sga-chip-cloud">
            {existingSkills.map((s, i) => (
              <span key={i} className="sga-chip sga-chip--existing">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Skill Categories by Domain ── */}
      <div className="sga-section-card">
        <div className="sga-section-header">
          <span className="sga-section-title">
            <Layers size={18} color="var(--color-primary)" />
            Skill Categories
          </span>
          <span className="badge badge-primary">By Domain</span>
        </div>

        <div className="sga-domain-grid">
          {DOMAIN_CONFIG.map((cfg) => (
            <DomainBlock
              key={cfg.key}
              config={cfg}
              categoryData={skillCategories[cfg.key]}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="sga-legend">
          <span>
            <span className="sga-chip sga-chip--matched" style={{ fontSize: '10px' }}>
              <CheckCircle2 size={9} /> Matched
            </span>{' '}
            Demonstrated in resume
          </span>
          <span>
            <span className="sga-chip sga-chip--partial" style={{ fontSize: '10px' }}>
              <GitMerge size={9} /> Partial
            </span>{' '}
            Partially demonstrated
          </span>
          <span>
            <span className="sga-chip sga-chip--missing" style={{ fontSize: '10px' }}>
              <AlertTriangle size={9} /> Missing
            </span>{' '}
            Not demonstrated in resume
          </span>
        </div>
      </div>

      {/* ── Radar Chart ── */}
      {radarData.length >= 3 && (
        <div className="sga-section-card">
          <div className="sga-section-header">
            <span className="sga-section-title">
              <ArrowUpCircle size={18} color="var(--color-primary)" />
              Coverage by Domain
            </span>
            <span className="badge badge-secondary">Radar View</span>
          </div>
          <div className="sga-radar-wrap">
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
                  fillOpacity={0.22}
                  strokeWidth={2}
                />
                <RechartsTooltip
                  formatter={(val) => [`${val}%`, 'Coverage']}
                  contentStyle={{
                    fontSize: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontFamily: 'inherit'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Partially Matching Skills detail ── */}
      {partialSkills.length > 0 && (
        <div className="sga-section-card">
          <div className="sga-section-header">
            <span className="sga-section-title">
              <GitMerge size={18} color="var(--color-warning)" />
              Partially Matching Skills
            </span>
            <span className="badge badge-warning">{partialSkills.length} skills</span>
          </div>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: '14px'
            }}
          >
            Resume shows related experience but does not fully demonstrate the job requirement.
          </p>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {partialSkills.map((item, i) => {
              const name   = typeof item === 'string' ? item : item.skill   || item.name || '';
              const reason = typeof item === 'string' ? ''   : item.reason  || item.note || '';
              return (
                <div key={i} className="sga-improve-item">
                  <span className="sga-improve-item__name">
                    <GitMerge size={12} style={{ marginRight: 4 }} color="var(--color-warning)" />
                    {name}
                  </span>
                  {reason && (
                    <span className="sga-improve-item__reason">{reason}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillCategories;
