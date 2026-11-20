import React from 'react';
import { UploadCloud } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State Component
 * Displayed when data (e.g. Resume, Analysis, Suggestions) has not yet been loaded.
 */
export const EmptyState = ({
  icon: Icon = UploadCloud,
  title = 'No Data Available',
  description = 'Upload a resume to generate insights and view detailed metrics.',
  actionLabel = 'Upload Resume',
  onAction = null,
  actionIcon: ActionIcon = null,
  secondaryAction = null
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-box">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionLabel && onAction && (
          <Button variant="primary" icon={ActionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryAction}
      </div>
    </div>
  );
};

export default EmptyState;
