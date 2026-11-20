import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Target,
  AlertCircle,
  Code2,
  Percent,
  Search,
  FileSearch
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { matchJobWithGemini, isGeminiConfigured } from '../../services/geminiService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

export const JobMatchingPage = () => {
  const {
    resumeText,
    targetJobRole,
    setTargetJobRole,
    jobDescription,
    setJobDescription,
    matchingResults,
    setMatchingResults
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="Job Description Matching"
          description="Compare resume qualifications against job postings and measure ATS keyword alignment."
          badge="Module 4"
          icon={Briefcase}
        />
        <EmptyState
          icon={FileSearch}
          title="Resume Required for Job Matching"
          description="Please upload or input a candidate resume before matching against a target job role."
          actionLabel="Upload Resume"
          onAction={() => navigate('/upload-resume')}
        />
      </div>
    );
  }

  const handleRunMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setErrorMsg('Please paste a job description to perform matching.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const results = await matchJobWithGemini(resumeText, jobDescription);
      setMatchingResults(results);
    } catch (err) {
      console.error('Job Matching Error:', err);
      setErrorMsg(err.message || 'Failed to match job with Gemini. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Job Description Matching"
        description="Evaluate resume fit against real job specifications using Gemini AI semantics."
        badge="Module 4"
        icon={Briefcase}
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
            <strong>Gemini API Key Required:</strong> Set <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to perform AI matching.
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Job Input Form */}
        <div className="resumate-card">
          <div className="card-header">
            <h2 className="card-title">
              <Briefcase size={20} color="var(--color-primary)" />
              Target Position Details
            </h2>
          </div>

          <form onSubmit={handleRunMatch}>
            <div className="form-group">
              <label className="form-label" htmlFor="target-role-input">
                Target Job Role / Title
              </label>
              <input
                id="target-role-input"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Frontend Engineer, Data Analyst"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="job-desc-input">
                Job Description (Paste Full Posting)
              </label>
              <textarea
                id="job-desc-input"
                rows={9}
                className="form-textarea"
                placeholder="Paste responsibilities, required qualifications, and tech stack here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Target}
              isLoading={loading}
              style={{ width: '100%' }}
            >
              Analyze Job Fit
            </Button>
          </form>
        </div>

        {/* Match Results or Instructions */}
        <div className="resumate-card">
          <div className="card-header">
            <h2 className="card-title">
              <Percent size={20} color="var(--color-primary)" />
              Compatibility Score & Verdict
            </h2>
            {matchingResults && (
              <span className="badge badge-success">{matchingResults.verdict}</span>
            )}
          </div>

          {loading && (
            <Loader size="md" message="Comparing candidate resume against job requirements..." />
          )}

          {!loading && matchingResults && (
            <div>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <span style={{ fontSize: '52px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {matchingResults.matchPercentage}%
                </span>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                  Overall Match Compatibility
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
                  Matching Keywords Found
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(matchingResults.matchingKeywords || []).map((kw, i) => (
                    <span key={i} className="badge badge-success">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
                  Missing Role Keywords
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(matchingResults.missingKeywords || []).map((kw, i) => (
                    <span key={i} className="badge badge-danger">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 'var(--font-xs)', marginTop: '12px', color: 'var(--color-text-secondary)' }}>
                {matchingResults.compatibilitySummary}
              </p>
            </div>
          )}

          {!loading && !matchingResults && (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-text-secondary)' }}>
              <Search size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 10px auto' }} />
              <p style={{ fontSize: 'var(--font-sm)' }}>
                Paste the job description and click <strong>Analyze Job Fit</strong> to compare keyword density and role alignment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Developer & Team Integration Guidance Card */}
      <div className="dev-guidance-card">
        <div className="dev-guidance-header">
          <span className="dev-guidance-title">
            <Code2 size={16} /> Module 4 Integration Contract
          </span>
          <span className="badge badge-primary">Owner: Job Matching Specialist</span>
        </div>
        <ul className="dev-guidance-list">
          <li><strong>Inputs:</strong> Reads <code>resumeText</code>, <code>targetJobRole</code>, and <code>jobDescription</code> from <code>AppContext</code>.</li>
          <li><strong>Service Call:</strong> <code>matchJobWithGemini(resumeText, jobDescription)</code> in <code>src/services/geminiService.js</code>.</li>
          <li><strong>State Output:</strong> Sets <code>matchingResults</code> in <code>AppContext</code>.</li>
          <li><strong>Next Step for Owner:</strong> Build interactive keyword comparison bars and Recharts fit visualization.</li>
        </ul>
      </div>
    </div>
  );
};

export default JobMatchingPage;
