import React from 'react';
import {
  UserCheck,
  Target,
  Code2,
  Users,
  GraduationCap,
  FolderGit2,
  Briefcase,
  Award,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

const SECTION_ICONS = {
  'Professional Summary': UserCheck,
  'Career Objective': Target,
  'Technical Skills': Code2,
  'Soft Skills': Users,
  'Education': GraduationCap,
  'Projects': FolderGit2,
  'Work Experience': Briefcase,
  'Certifications': Award,
  'Grammar and Readability': CheckCheck
};

export const ResumeReview = ({ reviews = [] }) => {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>
          Comprehensive Section-by-Section Review
        </h3>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
          Detailed diagnostic analysis across all 9 critical resume areas.
        </p>
      </div>

      <div className="review-grid">
        {reviews.map((item, idx) => {
          const Icon = SECTION_ICONS[item.section] || AlertCircle;
          const statusClass = (item.status || 'needs-work')
            .toLowerCase()
            .replace(/\s+/g, '-');

          return (
            <div key={idx} className="review-card">
              <div>
                <div className="review-card-header">
                  <div className="review-title-group">
                    <Icon size={18} className="review-icon" />
                    <span className="review-title">{item.section}</span>
                  </div>
                  <span className={`review-status-badge status-${statusClass}`}>
                    {item.status}
                  </span>
                </div>

                <p className="review-finding">{item.finding}</p>
              </div>

              <div className="review-takeaway">
                <strong>Key Action:</strong> {item.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeReview;
