import React, { useState } from 'react';
import {
  AlertTriangle,
  Layers,
  Search,
  CheckCheck,
  UserCheck,
  FolderGit2,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Copy,
  Check,
  Filter
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Missing Information': AlertTriangle,
  'Weak Resume Sections': Layers,
  'Keyword Improvements': Search,
  'Grammar and Clarity': CheckCheck,
  'Professional Summary Improvements': UserCheck,
  'Project Description Improvements': FolderGit2,
  'Experience Description Improvements': Briefcase
};

export const ImprovementSuggestions = ({ suggestions = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'All',
    'Missing Information',
    'Weak Resume Sections',
    'Keyword Improvements',
    'Grammar and Clarity',
    'Professional Summary Improvements',
    'Project Description Improvements',
    'Experience Description Improvements'
  ];

  const handleCopy = async (item) => {
    const text = `[${item.category} - ${item.priority} Priority]\nRecommendation: ${item.title}\nAction: ${item.action}\nBenefit: ${item.benefit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id || item.title);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy suggestion:', err);
    }
  };

  const filtered = selectedFilter === 'All'
    ? suggestions
    : suggestions.filter((s) => s.category === selectedFilter);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>
            Targeted Improvement Suggestions
          </h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
            Categorized recommendations across the 7 critical enhancement areas.
          </p>
        </div>

        {/* Filter dropdown / select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="var(--color-text-muted)" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--font-xs)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-main)',
              cursor: 'pointer'
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="suggestions-grid">
        {filtered.map((item, idx) => {
          const Icon = CATEGORY_ICONS[item.category] || Layers;
          const priorityLower = (item.priority || 'medium').toLowerCase();
          const isCopied = copiedId === (item.id || item.title);

          return (
            <div key={idx} className="suggestion-item-card">
              <div className="suggestion-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="suggestion-category-tag">
                    <Icon size={13} />
                    <span>{item.category}</span>
                  </span>

                  <span
                    className={`suggestion-priority-tag`}
                    style={{
                      backgroundColor:
                        priorityLower === 'high'
                          ? 'var(--color-danger-bg)'
                          : priorityLower === 'medium'
                          ? 'var(--color-warning-bg)'
                          : 'var(--color-info-bg)',
                      color:
                        priorityLower === 'high'
                          ? 'var(--color-danger)'
                          : priorityLower === 'medium'
                          ? 'var(--color-warning)'
                          : 'var(--color-info)',
                      border: `1px solid ${
                        priorityLower === 'high'
                          ? 'var(--color-danger-border)'
                          : priorityLower === 'medium'
                          ? 'var(--color-warning-border)'
                          : 'var(--color-info-border)'
                      }`
                    }}
                  >
                    <AlertCircle size={10} />
                    {item.priority} Priority
                  </span>
                </div>

                <button
                  type="button"
                  className="ri-btn ri-btn-outline ri-btn-sm"
                  onClick={() => handleCopy(item)}
                  title="Copy recommendation"
                >
                  {isCopied ? (
                    <>
                      <Check size={12} color="var(--color-success)" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <h4 className="suggestion-main-title">{item.title}</h4>

              <p className="suggestion-issue-desc">{item.description}</p>

              <div className="suggestion-action-box">
                <div className="suggestion-action-label">Recommended Action</div>
                <div>{item.action}</div>
              </div>

              {item.benefit && (
                <div className="suggestion-benefit-row">
                  <TrendingUp size={14} />
                  <span>
                    <strong>Expected Benefit:</strong> {item.benefit}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImprovementSuggestions;
