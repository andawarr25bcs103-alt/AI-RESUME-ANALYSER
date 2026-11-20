import React from 'react';

/**
 * Reusable Page Header Component
 * Provides clean title, description, category badge, icon, and action buttons.
 */
export const PageHeader = ({
  title,
  description,
  badge,
  icon: Icon = null,
  actions = null
}) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-header-title-row">
          {Icon && (
            <div className="page-header-icon">
              <Icon size={22} />
            </div>
          )}
          <h1 className="page-header-title">{title}</h1>
          {badge && <span className="badge badge-primary">{badge}</span>}
        </div>
        {description && <p className="page-header-desc">{description}</p>}
      </div>

      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
};

export default PageHeader;
