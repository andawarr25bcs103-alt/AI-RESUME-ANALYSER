import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileSearch,
  Code2,
  Layers,
  Flame,
  CheckCheck,
  FileText,
  UserCheck,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Target,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isGeminiConfigured } from '../../services/geminiService';
import { generateSuggestions } from './suggestionService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

import StatusBanner from './StatusBanner';
import SuggestionCard from './SuggestionCard';
import SuggestionFilters from './SuggestionFilters';
import SummaryImprovement from './SummaryImprovement';
import './ImprovementSuggestions.css';

const CATEGORY_CONFIG = [
  { key: 'resumeImprovements', title: 'Resume Content Improvements', icon: FileText },
  { key: 'technicalSkillImprovements', title: 'Technical Skills Improvements', icon: Code2 },
  { key: 'projectImprovements', title: 'Project Improvements', icon: FolderGit2 },
  { key: 'experienceImprovements', title: 'Work Experience Improvements', icon: Briefcase },
  { key: 'educationImprovements', title: 'Education and Certification Improvements', icon: GraduationCap },
  { key: 'jobSpecificRecommendations', title: 'Job-Specific Recommendations', icon: Target },
  { key: 'careerDevelopment', title: 'Career Development Recommendations', icon: Compass }
];

export const ImprovementSuggestions = () => {
  const {
    resumeText,
    resumeFile,
    analysisResults,
    matchingResults,
    skillAnalysisResults,
    improvementSuggestions,
    setImprovementSuggestions
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering & View states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [completionFilter, setCompletionFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [viewMode, setViewMode] = useState('category'); // 'category' | 'priority' | 'all'

  // Session-based completion tracking
  const [completedMap, setCompletedMap] = useState({});

  const navigate = useNavigate();

  // Resume document filename
  const resumeFileName = resumeFile?.name || 'Uploaded Resume';

  // Toggle completion of recommendation
  const handleToggleComplete = (id) => {
    setCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Generate suggestions using the shared Gemini service via suggestionService
  const handleGenerate = async () => {
    if (isGenerating) return;

    setErrorMsg('');
    setSuccessMsg('');
    setIsGenerating(true);

    try {
      const results = await generateSuggestions({
        resumeText,
        analysisResults,
        matchingResults,
        skillAnalysisResults,
        resumeFileName
      });

      // Save complete structured result into AppContext
      setImprovementSuggestions(results);
      setSuccessMsg(
        `Successfully generated ${results.allRecommendations.length} personalized improvement suggestions!`
      );
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error('Improvement Suggestions generation failed:', err);
      setErrorMsg(
        err.message ||
          'Failed to generate suggestions. Verify your Gemini API key in your .env file.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Flattened recommendation list extracted from structured data
  const allList = useMemo(() => {
    if (!improvementSuggestions) return [];
    if (Array.isArray(improvementSuggestions.allRecommendations)) {
      return improvementSuggestions.allRecommendations;
    }
    // Fallback if data was saved as raw array
    if (Array.isArray(improvementSuggestions)) {
      return improvementSuggestions;
    }
    return [];
  }, [improvementSuggestions]);

  // Aggregate counters
  const counts = useMemo(() => {
    const total = allList.length;
    let high = 0;
    let medium = 0;
    let low = 0;
    let completed = 0;
    let pending = 0;
    const byCategory = {};

    allList.forEach((r) => {
      if (r.priority === 'High') high += 1;
      else if (r.priority === 'Medium') medium += 1;
      else if (r.priority === 'Low') low += 1;

      if (completedMap[r.id]) completed += 1;
      else pending += 1;

      const catName = r.category || 'Resume Content';
      byCategory[catName] = (byCategory[catName] || 0) + 1;
    });

    return { total, high, medium, low, completed, pending, byCategory };
  }, [allList, completedMap]);

  // Filter recommendations based on search, category, priority, and completion
  const filteredList = useMemo(() => {
    return allList.filter((item) => {
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = (item.title || '').toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inAction = (item.action || '').toLowerCase().includes(q);
        const inReason = (item.reason || '').toLowerCase().includes(q);
        const inBenefit = (item.expectedBenefit || '').toLowerCase().includes(q);
        const inCategory = (item.category || '').toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inAction && !inReason && !inBenefit && !inCategory) {
          return false;
        }
      }

      // Priority Filter
      if (selectedPriority !== 'All' && item.priority !== selectedPriority) {
        return false;
      }

      // Category Filter
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false;
      }

      // Completion Status Filter
      if (completionFilter === 'completed' && !completedMap[item.id]) {
        return false;
      }
      if (completionFilter === 'pending' && completedMap[item.id]) {
        return false;
      }

      return true;
    });
  }, [allList, searchQuery, selectedPriority, selectedCategory, completionFilter, completedMap]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriority('All');
    setSelectedCategory('All Categories');
    setCompletionFilter('all');
  };

  // Empty State: No resume uploaded
  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="AI Improvement Suggestions"
          description="Personalized recommendations to help improve your resume and career readiness."
          badge="Module 6"
          icon={Lightbulb}
        />

        <EmptyState
          icon={FileSearch}
          title="Resume Required for Suggestions"
          description="Upload a candidate resume first to generate personalized resume improvements, executive summary rewrites, and career readiness roadmaps."
          actionLabel="Upload Resume"
          onAction={() => navigate('/upload-resume')}
        />
      </div>
    );
  }

  const completionPercentage =
    counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="AI Improvement Suggestions"
        description="Personalized recommendations to help users improve their resumes and career readiness using Gemini AI."
        badge="Module 6: Suggestions"
        icon={Lightbulb}
        actions={
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              icon={allList.length > 0 ? RefreshCw : Sparkles}
              isLoading={isGenerating}
              disabled={isGenerating}
              onClick={handleGenerate}
            >
              {allList.length > 0 ? 'Re-generate Suggestions' : 'Generate Suggestions'}
            </Button>
          </div>
        }
      />

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>{errorMsg}</span>
            <button
              type="button"
              className="btn-action btn-action-ghost"
              style={{ fontSize: '11px', padding: '0 4px' }}
              onClick={handleGenerate}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* API Key Missing Warning */}
      {!isGeminiConfigured() && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div>
            <strong>Gemini API Key Required:</strong> Set <code>VITE_GEMINI_API_KEY</code> in your{' '}
            <code>.env</code> file to enable live AI resume analysis.
          </div>
        </div>
      )}

      {/* Document & Module Execution Status Banner */}
      <StatusBanner
        resumeFileName={resumeFileName}
        analysisResults={analysisResults}
        matchingResults={matchingResults}
        skillAnalysisResults={skillAnalysisResults}
      />

      {/* Loading Processing State */}
      {isGenerating && (
        <Loader
          size="lg"
          message="Gemini AI is reviewing your full resume text and cross-referencing analysis results to build personalized improvements..."
        />
      )}

      {/* Initial Empty State: Resume loaded but suggestions not generated yet */}
      {!isGenerating && !improvementSuggestions && (
        <div className="initial-generator-card">
          <div className="generator-hero-icon">
            <Lightbulb size={36} />
          </div>
          <h2 className="generator-heading">AI-Powered Resume Optimization</h2>
          <p className="generator-subtitle">
            Generate practical, personalized recommendations across your professional summary,
            experience, technical skills, projects, and career development using verified data from
            your resume.
          </p>

          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            Generate Suggestions
          </Button>

          <div className="feature-cards-grid">
            <div className="feature-mini-card">
              <FileText size={20} className="feature-mini-icon" />
              <h4 className="feature-mini-title">Resume Content</h4>
              <p className="feature-mini-desc">
                Identify weak sections, vague bullet points, and formatting inconsistencies.
              </p>
            </div>

            <div className="feature-mini-card">
              <UserCheck size={20} className="feature-mini-icon" />
              <h4 className="feature-mini-title">Summary Rewrite</h4>
              <p className="feature-mini-desc">
                Receive an ATS-optimized executive summary crafted strictly from verified credentials.
              </p>
            </div>

            <div className="feature-mini-card">
              <Code2 size={20} className="feature-mini-icon" />
              <h4 className="feature-mini-title">Skills & Projects</h4>
              <p className="feature-mini-desc">
                Highlight impact, problem statements, and missing complementary technologies.
              </p>
            </div>

            <div className="feature-mini-card">
              <Compass size={20} className="feature-mini-icon" />
              <h4 className="feature-mini-title">Career Readiness</h4>
              <p className="feature-mini-desc">
                Targeted upskilling, certification paths, and technical communication advice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Generated Suggestions Display */}
      {!isGenerating && improvementSuggestions && (
        <div>
          {/* Overall Improvement Summary Card */}
          <div className="overall-summary-card">
            <div className="overall-summary-header">
              <div className="summary-title-group">
                <div className="summary-icon-box">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3>Overall Improvement Summary</h3>
                  <p>Synthesized evaluation from uploaded resume and active audit findings</p>
                </div>
              </div>

              <span
                className={`overall-priority-pill overall-priority-${(
                  improvementSuggestions.overallPriority || 'high'
                ).toLowerCase()}`}
              >
                <Flame size={13} />
                Overall Urgency: {improvementSuggestions.overallPriority || 'High'}
              </span>
            </div>

            <div className="overall-narrative-text">
              {improvementSuggestions.overallSummary}
            </div>

            {/* Implementation Progress Bar */}
            <div className="progress-ribbon-card">
              <div className="progress-ribbon-header">
                <span className="progress-label">
                  <CheckCheck size={14} color="var(--color-primary)" />
                  Session Implementation Progress:
                </span>
                <span className="progress-ratio">
                  {counts.completed} of {counts.total} implemented ({completionPercentage}%)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* KPI Summary Ribbon */}
          <div className="kpi-stats-ribbon">
            <div className="kpi-card">
              <span className="kpi-label">Total Suggestions</span>
              <span className="kpi-value">{counts.total}</span>
            </div>
            <div className="kpi-card kpi-card-high">
              <span className="kpi-label">High Priority</span>
              <span className="kpi-value" style={{ color: 'var(--color-danger)' }}>
                {counts.high}
              </span>
            </div>
            <div className="kpi-card kpi-card-medium">
              <span className="kpi-label">Medium Priority</span>
              <span className="kpi-value" style={{ color: 'var(--color-warning)' }}>
                {counts.medium}
              </span>
            </div>
            <div className="kpi-card kpi-card-low">
              <span className="kpi-label">Low Priority</span>
              <span className="kpi-value" style={{ color: 'var(--color-info)' }}>
                {counts.low}
              </span>
            </div>
            <div className="kpi-card kpi-card-completed">
              <span className="kpi-label">Implemented</span>
              <span className="kpi-value" style={{ color: 'var(--color-success)' }}>
                {counts.completed}
              </span>
            </div>
          </div>

          {/* Section B: Professional Summary Rewrite & Evaluation */}
          {improvementSuggestions.summaryImprovements && (
            <SummaryImprovement
              summaryData={improvementSuggestions.summaryImprovements}
            />
          )}

          {/* Filter and View Mode Toolbar */}
          <SuggestionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedPriority={selectedPriority}
            onSelectPriority={setSelectedPriority}
            completionFilter={completionFilter}
            onSelectCompletionFilter={setCompletionFilter}
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
            counts={counts}
            onResetFilters={handleResetFilters}
          />

          {/* Render Recommendations Based on Selected View Mode */}
          {filteredList.length === 0 ? (
            <div
              className="resumate-card"
              style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}
            >
              <Lightbulb size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <h4>No Recommendations Match Your Filter Criteria</h4>
              <p style={{ fontSize: 'var(--font-sm)', margin: '6px 0 16px 0' }}>
                Try adjusting your search query, priority filter, or category selection.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : viewMode === 'category' ? (
            /* Category Grouped View */
            <div>
              {CATEGORY_CONFIG.map((catConfig) => {
                const CategoryIcon = catConfig.icon;
                const itemsInCat = filteredList.filter(
                  (item) => item.category === catConfig.title || item.category === catConfig.title.replace(' Recommendations', '').replace(' Improvements', '')
                );

                if (itemsInCat.length === 0) return null;

                return (
                  <div key={catConfig.key} className="category-section-block">
                    <div className="category-section-header">
                      <div className="category-title-left">
                        <div className="category-section-icon">
                          <CategoryIcon size={18} />
                        </div>
                        <h3 className="category-section-title">{catConfig.title}</h3>
                      </div>
                      <span className="category-count-badge">
                        {itemsInCat.length} recommendation{itemsInCat.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="category-cards-list">
                      {itemsInCat.map((rec) => (
                        <SuggestionCard
                          key={rec.id}
                          recommendation={rec}
                          isCompleted={Boolean(completedMap[rec.id])}
                          onToggleComplete={handleToggleComplete}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : viewMode === 'priority' ? (
            /* Priority Grouped View */
            <div>
              {['High', 'Medium', 'Low'].map((prioLevel) => {
                const itemsInPriority = filteredList.filter((item) => item.priority === prioLevel);
                if (itemsInPriority.length === 0) return null;

                return (
                  <div key={prioLevel} className="category-section-block">
                    <div className="category-section-header">
                      <div className="category-title-left">
                        <Flame
                          size={20}
                          color={
                            prioLevel === 'High'
                              ? 'var(--color-danger)'
                              : prioLevel === 'Medium'
                              ? 'var(--color-warning)'
                              : 'var(--color-info)'
                          }
                        />
                        <h3 className="category-section-title">{prioLevel} Priority Recommendations</h3>
                      </div>
                      <span className="category-count-badge">
                        {itemsInPriority.length} item{itemsInPriority.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="category-cards-list">
                      {itemsInPriority.map((rec) => (
                        <SuggestionCard
                          key={rec.id}
                          recommendation={rec}
                          isCompleted={Boolean(completedMap[rec.id])}
                          onToggleComplete={handleToggleComplete}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Flat All Recommendations View */
            <div className="category-cards-list">
              {filteredList.map((rec) => (
                <SuggestionCard
                  key={rec.id}
                  recommendation={rec}
                  isCompleted={Boolean(completedMap[rec.id])}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Module 6 Integration Guidance Card */}
      <div className="module6-guidance-card">
        <div className="guidance-header">
          <span className="guidance-title">
            <Code2 size={16} /> Module 6 Architecture & Team Integration
          </span>
          <span className="badge badge-primary">Owner: Suggestions Specialist</span>
        </div>
        <ul className="guidance-list">
          <li>
            <strong>Data Sources Ingested:</strong> <code>resumeText</code>, <code>resumeFile</code>,{' '}
            <code>analysisResults</code>, <code>matchingResults</code>, and{' '}
            <code>skillAnalysisResults</code> via shared <code>AppContext</code>.
          </li>
          <li>
            <strong>Shared Service:</strong> Uses <code>geminiService.js</code> (via{' '}
            <code>suggestionService.js</code>) without modifying shared core files.
          </li>
          <li>
            <strong>Result Structure:</strong> Stored in <code>AppContext</code> via{' '}
            <code>setImprovementSuggestions</code> with priority-based arrays, summary rewrites, and
            categorized recommendations.
          </li>
          <li>
            <strong>Zero-Fabrication Policy:</strong> Strictly prohibits generating fake credentials,
            false metrics, or unearned qualifications.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImprovementSuggestions;
