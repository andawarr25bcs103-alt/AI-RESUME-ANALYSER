import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Target,
  Compass
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Resume Content': FileText,
  'Professional Summary': UserCheck,
  'Technical Skills': Code2,
  'Projects': FolderGit2,
  'Work Experience': Briefcase,
  'Education & Certifications': GraduationCap,
  'Job-Specific': Target,
  'Career Development': Compass
};

export const SuggestionCard = ({
  recommendation,
  isCompleted = false,
  onToggleComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    id,
    title,
    category,
    description,
    reason,
    action,
    priority = 'Medium',
    expectedBenefit
  } = recommendation;

  const CategoryIcon = CATEGORY_ICONS[category] || Lightbulb;

  const handleCopyAction = async (e) => {
    e.stopPropagation();
    const copyText = `[${category} - ${priority} Priority]\nRecommendation: ${title}\nAction: ${action}\nBenefit: ${expectedBenefit}`;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy recommendation:', err);
    }
  };

  const priorityLower = (priority || 'medium').toLowerCase();

  return (
    <div
      className={`recommendation-card ${isCompleted ? 'is-completed' : ''} priority-border-${priorityLower}`}
    >
      {/* Card Header */}
      <div className="recommendation-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          {/* Completion Checkbox Button */}
          <button
            type="button"
            className="completion-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(id);
            }}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as implemented'}
          >
            {isCompleted ? (
              <CheckCircle2 size={20} className="check-icon-active" />
            ) : (
              <Circle size={20} className="check-icon-idle" />
            )}
          </button>

          <div className="title-and-badges">
            <div className="badges-row">
              <span className="category-badge">
                <CategoryIcon size={12} />
                <span>{category}</span>
              </span>

              <span className={`priority-badge priority-badge-${priorityLower}`}>
                <AlertCircle size={11} />
                <span>{priority} Priority</span>
              </span>

              {isCompleted && (
                <span className="status-implemented-badge">
                  <Check size={11} />
                  <span>Implemented</span>
                </span>
              )}
            </div>

            <h4 className={`recommendation-title ${isCompleted ? 'text-strikethrough' : ''}`}>
              {title}
            </h4>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className={`card-copy-btn ${copied ? 'copied-active' : ''}`}
            onClick={handleCopyAction}
            title="Copy recommendation and action"
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="card-expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            title={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Main Description */}
      <p className="recommendation-description">{description}</p>

      {/* Recommended Action Preview (Always visible) */}
      <div className="action-highlight-box">
        <div className="action-label">
          <ArrowRight size={13} className="action-icon" />
          <span>Recommended Action:</span>
        </div>
        <div className="action-text">{action}</div>
      </div>

      {/* Expandable Deep Details */}
      {isExpanded && (
        <div className="recommendation-expanded-details">
          {reason && (
            <div className="detail-item">
              <div className="detail-label">
                <Lightbulb size={13} />
                <span>Why this matters:</span>
              </div>
              <p className="detail-text">{reason}</p>
            </div>
          )}

          {expectedBenefit && (
            <div className="detail-item detail-benefit">
              <div className="detail-label">
                <TrendingUp size={13} />
                <span>Expected Benefit:</span>
              </div>
              <p className="detail-text">{expectedBenefit}</p>
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse Toggle Footer Text */}
      <div className="card-footer-bar">
        <button
          type="button"
          className="toggle-details-link"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide explanation & expected benefit' : 'View explanation & expected benefit'}
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
