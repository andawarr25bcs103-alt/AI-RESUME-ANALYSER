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
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeSkillGapWithGemini, isGeminiConfigured } from '../../services/geminiService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

export const SkillGapPage = () => {
  const {
    resumeText,
    targetJobRole,
    setTargetJobRole,
    jobDescription,
    skillAnalysisResults,
    setSkillAnalysisResults
  } = useApp();

  const [roleInput, setRoleInput] = useState(targetJobRole || 'Full Stack Software Engineer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="Skill Gap & Keyword Analysis"
          description="Identify critical missing technical and soft skills and generate a targeted learning roadmap."
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

  const handleRunSkillGap = async (e) => {
    e.preventDefault();
    if (!roleInput.trim()) {
      setErrorMsg('Please specify a target role.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setTargetJobRole(roleInput);

    try {
      const results = await analyzeSkillGapWithGemini(resumeText, roleInput, jobDescription);
      setSkillAnalysisResults(results);
    } catch (err) {
      console.error('Skill Gap Analysis Error:', err);
      setErrorMsg(err.message || 'Failed to analyze skill gap. Verify your Gemini API key in .env.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Skill Gap & Keyword Analysis"
        description="Diagnose missing competencies, calculate role readiness, and generate an upskilling roadmap."
        badge="Module 5"
        icon={Target}
      />

      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!isGeminiConfigured() && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Gemini API Key Required:</strong> Set <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to generate real skill matrix evaluations.
          </div>
        </div>
      )}

      {/* Target Role Selector */}
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
              placeholder="e.g. Cloud Architect, React Native Developer, AI/ML Engineer"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={Sparkles}
            isLoading={loading}
          >
            Run Skill Gap Audit
          </Button>
        </form>
      </div>

      {loading && (
        <Loader size="lg" message="Benchmarking resume competencies against industry standards..." />
      )}

      {/* Analysis Results View */}
      {!loading && skillAnalysisResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-3">
            {/* Readiness Card */}
            <div className="resumate-card" style={{ textAlign: 'center' }}>
              <span className="badge badge-primary">Readiness Index</span>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  margin: '10px 0'
                }}
              >
                {skillAnalysisResults.readinessScore || 0}%
              </div>
              <p style={{ fontSize: 'var(--font-xs)' }}>
                Target: <strong>{skillAnalysisResults.targetRole}</strong>
              </p>
            </div>

            {/* Acquired Skills */}
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
                  <CheckCircle2 size={16} color="var(--color-success)" /> Acquired Skills
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(skillAnalysisResults.acquiredSkills || []).map((sk, idx) => (
                  <span key={idx} className="badge badge-success">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Skills */}
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
                  <AlertTriangle size={16} color="var(--color-danger)" /> Missing Critical Skills
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(skillAnalysisResults.missingCriticalSkills || []).map((sk, idx) => (
                  <span key={idx} className="badge badge-danger">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Roadmap */}
          {skillAnalysisResults.learningRoadmap && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <BookOpen size={18} color="var(--color-primary)" />
                  Targeted Learning Roadmap
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skillAnalysisResults.learningRoadmap.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-main)' }}>
                        {item.skill}
                      </strong>
                      <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        Resource: {item.learningResource}
                      </p>
                    </div>
                    <span
                      className={`badge ${
                        item.importance === 'High'
                          ? 'badge-danger'
                          : item.importance === 'Medium'
                          ? 'badge-warning'
                          : 'badge-primary'
                      }`}
                    >
                      {item.importance} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 5 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: Skill Gap Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Inputs:</strong> Reads <code>resumeText</code> and optional <code>jobDescription</code> from <code>AppContext</code>.</li>
          <li><strong>Service Call:</strong> <code>analyzeSkillGapWithGemini(resumeText, targetRole, jobDescription)</code>.</li>
          <li><strong>State Output:</strong> Sets <code>skillAnalysisResults</code> in <code>AppContext</code>.</li>
          <li><strong>Next Step for Owner:</strong> Build radar chart / skill matrix visualization using Recharts.</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillGapPage;
