import React from 'react';
import {
  Search,
  X,
  Filter,
  Layers,
  Flame,
  CheckCircle2,
  FileEdit,
  RotateCcw
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Resume Content',
  'Professional Summary',
  'Technical Skills',
  'Projects',
  'Work Experience',
  'Education & Certifications',
  'Job-Specific',
  'Career Development'
];

export const SuggestionFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  completionFilter,
  onSelectCompletionFilter,
  viewMode,
  onSelectViewMode,
  counts = {},
  onResetFilters
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedPriority !== 'All' ||
    completionFilter !== 'all';

  return (
    <div className="filters-container-card">
      {/* Top Row: Search and View Mode Selector */}
      <div className="filters-top-row">
        <div className="filter-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search suggestions by keyword, technology, or action..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'category' ? 'active' : ''}`}
            onClick={() => onSelectViewMode('category')}
            title="Group recommendations by resume section"
          >
            <Layers size={14} />
            <span>Category View</span>
          </button>

          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'priority' ? 'active' : ''}`}
            onClick={() => onSelectViewMode('priority')}
            title="Group recommendations by High, Medium, Low urgency"
          >
            <Flame size={14} />
            <span>Priority View</span>
          </button>

          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => onSelectViewMode('all')}
            title="View all recommendations in a unified list"
          >
            <Filter size={14} />
            <span>All Items</span>
          </button>
        </div>
      </div>

      {/* Second Row: Filters for Priority, Category, and Completion */}
      <div className="filters-bottom-row">
        {/* Priority Filter Pills */}
        <div className="filter-group">
          <span className="filter-group-label">Priority:</span>
          {['All', 'High', 'Medium', 'Low'].map((prio) => {
            const count =
              prio === 'All'
                ? counts.total || 0
                : prio === 'High'
                ? counts.high || 0
                : prio === 'Medium'
                ? counts.medium || 0
                : counts.low || 0;

            return (
              <button
                key={prio}
                type="button"
                className={`filter-pill-btn ${selectedPriority === prio ? 'active' : ''}`}
                onClick={() => onSelectPriority(prio)}
              >
                <span>{prio}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        <div className="filter-group">
          <span className="filter-group-label">Category:</span>
          <select
            className="category-dropdown-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
                {cat !== 'All Categories' && counts.byCategory?.[cat] !== undefined
                  ? ` (${counts.byCategory[cat]})`
                  : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Completion Status Pills */}
        <div className="filter-group">
          <span className="filter-group-label">Status:</span>
          {[
            { id: 'all', label: 'All', count: counts.total || 0 },
            { id: 'pending', label: 'Pending', count: counts.pending || 0 },
            { id: 'completed', label: 'Implemented', count: counts.completed || 0 }
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              className={`filter-pill-btn ${completionFilter === st.id ? 'active' : ''}`}
              onClick={() => onSelectCompletionFilter(st.id)}
            >
              <span>{st.label}</span>
              <span className="pill-count">{st.count}</span>
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onResetFilters}
            title="Reset all search and filter conditions"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SuggestionFilters;
