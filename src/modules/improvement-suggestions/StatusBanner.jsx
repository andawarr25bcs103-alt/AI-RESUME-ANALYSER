import React from 'react';
import {
  FileText,
  Sparkles,
  Briefcase,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

/**
 * StatusBanner
 * Displays the uploaded resume filename and execution status of
 * AI Resume Analysis, Job Matching, and Skill Gap Analysis modules.
 */
export const StatusBanner = ({
  resumeFileName = 'Uploaded Resume',
  analysisResults = null,
  matchingResults = null,
  skillAnalysisResults = null
}) => {
  const statuses = [
    {
      id: 'analysis',
      name: 'Resume Analysis',
      module: 'Module 3',
      icon: Sparkles,
      completed: Boolean(analysisResults),
      label: analysisResults?.atsScore !== undefined
        ? `ATS Score: ${analysisResults.atsScore}/100`
        : analysisResults
        ? 'Analysis Complete'
        : 'Pending (Module 3)'
    },
    {
      id: 'matching',
      name: 'Job Matching',
      module: 'Module 4',
      icon: Briefcase,
      completed: Boolean(matchingResults),
      label: matchingResults?.matchPercentage !== undefined
        ? `${matchingResults.matchPercentage}% Match Calculated`
        : matchingResults
        ? 'Match Complete'
        : 'Pending (Module 4)'
    },
    {
      id: 'skills',
      name: 'Skill Gap Analysis',
      module: 'Module 5',
      icon: Target,
      completed: Boolean(skillAnalysisResults),
      label: skillAnalysisResults?.readinessScore !== undefined
        ? `${skillAnalysisResults.readinessScore}% Role Readiness`
        : skillAnalysisResults
        ? 'Roadmap Ready'
        : 'Pending (Module 5)'
    }
  ];

  const pendingModules = statuses.filter((s) => !s.completed);

  return (
    <div className="status-banner-card">
      <div className="status-banner-header">
        <div className="status-file-info">
          <div className="status-file-icon">
            <FileText size={20} />
          </div>
          <div>
            <div className="status-file-label">Active Resume Document</div>
            <h3 className="status-file-name" title={resumeFileName}>
              {resumeFileName}
            </h3>
          </div>
        </div>

        <div className="status-chips-row">
          {statuses.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`status-chip ${
                  item.completed ? 'status-chip-complete' : 'status-chip-pending'
                }`}
                title={`${item.name} (${item.module}): ${item.label}`}
              >
                <Icon size={14} />
                <span className="status-chip-name">{item.name}:</span>
                <span className="status-chip-value">{item.label}</span>
                {item.completed ? (
                  <CheckCircle2 size={12} className="status-indicator-icon" />
                ) : (
                  <Clock size={12} className="status-indicator-icon" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {pendingModules.length > 0 && (
        <div className="status-banner-notice">
          <AlertCircle size={14} className="notice-icon" />
          <span>
            <strong>Note on Optional Data:</strong> {pendingModules.map((p) => p.name).join(' and ')}{' '}
            {pendingModules.length === 1 ? 'has' : 'have'} not been run yet. AI suggestions will be
            personalized directly from your resume text, and running those modules will unlock even
            deeper alignment insights.
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusBanner;
