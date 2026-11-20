import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getGeminiClient,
  isGeminiConfigured,
  parseGeminiJsonResponse
} from '../../services/geminiService';

import ImprovementScore from './ImprovementScore';
import ResumeReview from './ResumeReview';
import ImprovementSuggestions from './ImprovementSuggestions';
import BeforeAfter from './BeforeAfter';
import './ResumeImprovement.css';

// Realistic sample resume for standalone testing
const DEFAULT_SAMPLE_RESUME = `ALEX MORGAN
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Experienced software engineer with experience developing web applications. Skilled in JavaScript, React, Node.js, and working with team members to deliver code. Looking for a new software engineering position.

TECHNICAL SKILLS
- Languages: JavaScript, Python, HTML5, CSS3, SQL
- Frameworks & Libraries: React, Node.js, Express, Redux
- Databases: PostgreSQL, MongoDB
- Tools: Git, Docker, Postman

WORK EXPERIENCE
Software Developer | NexaTech Solutions | June 2022 - Present
- Responsible for building frontend features using React and JavaScript.
- Worked with backend team to integrate REST APIs for customer dashboard.
- Fixed bugs and helped test new application releases before deployment.
- Attended daily standups and sprint planning meetings.

Junior Web Developer | CloudPulse Inc. | January 2021 - May 2022
- Maintained web pages and updated content for client websites.
- Assisted senior engineers with database queries and bug fixes.
- Wrote unit tests for internal microservices.

PROJECTS
TaskFlow - Team Project Management Tool
- Built a web application using React and Node.js for tracking tasks.
- Included authentication and MongoDB database for storing user tasks.
- Deployed on Heroku.

EDUCATION
Bachelor of Science in Computer Science
University of California, Davis | 2017 - 2021

CERTIFICATIONS
- AWS Certified Cloud Practitioner`;

// Comprehensive verified baseline data for instant preview or offline sample mode
const SAMPLE_EVALUATION = {
  score: 72,
  potentialScore: 92,
  explanation:
    'Your resume demonstrates strong core technical proficiencies in React and Node.js. However, experience bullets rely on passive phrasing ("Responsible for") rather than quantifiable business impact, and your summary lacks target role positioning.',
  breakdown: {
    impactAndMetrics: 62,
    keywordRelevance: 74,
    grammarAndClarity: 85,
    sectionCompleteness: 72
  },
  reviews: [
    {
      section: 'Professional Summary',
      status: 'Needs Work',
      finding: 'Summary uses passive phrasing ("looking for a new position") and repeats words ("experienced... with experience").',
      recommendation: 'Position yourself by core specialty (e.g. "Full-Stack Software Engineer") and highlight scale or domains.'
    },
    {
      section: 'Career Objective',
      status: 'Weak',
      finding: 'No clear career objective or specialized value proposition is articulated.',
      recommendation: 'Incorporate your target trajectory (e.g., scalable distributed systems or cloud-native architecture).'
    },
    {
      section: 'Technical Skills',
      status: 'Optimized',
      finding: 'Clear logical grouping by Languages, Frameworks, Databases, and Tools.',
      recommendation: 'Add proficiency tiers or modern testing frameworks (Jest, Vitest) if applicable.'
    },
    {
      section: 'Soft Skills',
      status: 'Missing',
      finding: 'Cross-functional collaboration and agile ownership are only vaguely implied.',
      recommendation: 'Demonstrate agile sprint leadership, peer code reviews, and stakeholder communication.'
    },
    {
      section: 'Education',
      status: 'Optimized',
      finding: 'BS in Computer Science from UC Davis is clearly formatted with graduation year.',
      recommendation: 'Add relevant honors, GPA (if > 3.5), or key upper-division coursework if recent.'
    },
    {
      section: 'Projects',
      status: 'Needs Work',
      finding: 'TaskFlow project lists basic features without explaining user problems solved or scale.',
      recommendation: 'Specify architecture, state management patterns, and concurrent user handling.'
    },
    {
      section: 'Work Experience',
      status: 'Weak',
      finding: 'All bullets begin with passive duty statements ("Responsible for", "Worked with"). Zero metrics.',
      recommendation: 'Use strong action verbs ("Spearheaded", "Architected") and insert bracketed metric placeholders.'
    },
    {
      section: 'Certifications',
      status: 'Optimized',
      finding: 'AWS Certified Cloud Practitioner is verified and clearly listed.',
      recommendation: 'Consider adding AWS Solutions Architect Associate or Kubernetes (CKA) to show advanced cloud skills.'
    },
    {
      section: 'Grammar and Readability',
      status: 'Optimized',
      finding: 'Clean layout, readable bullet formatting, and free of grammatical errors.',
      recommendation: 'Maintain consistent past-tense action verbs across prior roles.'
    }
  ],
  suggestions: [
    {
      id: 'sugg-1',
      category: 'Missing Information',
      priority: 'High',
      title: 'Incorporate Measurable Business & Engineering Outcomes',
      description: 'Your work experience does not report any metrics, response times, or user counts.',
      action: 'Add quantified impact such as "[e.g., reduced page load time by 35%]" or "[e.g., supported 10,000+ daily active users]".',
      benefit: 'Demonstrates real business value to hiring managers and differentiates you from junior applicants.'
    },
    {
      id: 'sugg-2',
      category: 'Weak Resume Sections',
      priority: 'High',
      title: 'Eliminate Passive "Responsible For" Openers in Experience',
      description: 'Starting bullet points with "Responsible for" sounds like a job description rather than an achievement.',
      action: 'Replace with decisive verbs: "Engineered responsive UI components", "Streamlined customer dashboard workflows".',
      benefit: 'Captures recruiter attention in the first 6-second scan.'
    },
    {
      id: 'sugg-3',
      category: 'Keyword Improvements',
      priority: 'Medium',
      title: 'Integrate ATS Keywords for Cloud & Modern Tooling',
      description: 'Keywords like CI/CD, Automated Testing, and System Architecture are absent.',
      action: 'Naturally incorporate tools like GitHub Actions, Jest, RESTful API design, and Microservices if experienced.',
      benefit: 'Improves automated parsing and scoring across enterprise Applicant Tracking Systems.'
    },
    {
      id: 'sugg-4',
      category: 'Grammar and Clarity',
      priority: 'Low',
      title: 'Remove Redundancy in Professional Summary',
      description: 'The phrase "Experienced software engineer with experience developing..." is repetitive.',
      action: 'Rewrite to: "Full-Stack Software Engineer with 3+ years of expertise designing React applications and robust Node.js APIs."',
      benefit: 'Creates a crisp, polished first impression.'
    },
    {
      id: 'sugg-5',
      category: 'Professional Summary Improvements',
      priority: 'High',
      title: 'Remove Outdated "Looking for a position" Statement',
      description: 'Modern resumes omit "looking for an opportunity" because applying already communicates intent.',
      action: 'Replace the closing sentence with your core value proposition and specialized tech stack focus.',
      benefit: 'Maintains an executive, value-focused summary that aligns with industry standards.'
    },
    {
      id: 'sugg-6',
      category: 'Project Description Improvements',
      priority: 'Medium',
      title: 'Articulate Problem Solved in TaskFlow Project',
      description: 'TaskFlow describes what was built, but not the technical challenge or architecture.',
      action: 'Frame the project around state management, responsive UI design, and real-time task sync.',
      benefit: 'Proves independent engineering capability and thoughtful system design.'
    },
    {
      id: 'sugg-7',
      category: 'Experience Description Improvements',
      priority: 'High',
      title: 'Highlight API Integration Complexity & Ownership',
      description: '"Worked with backend team to integrate REST APIs" understates your collaboration and technical scope.',
      action: 'Rewrite to: "Engineered frontend data consumption layer across 12+ REST endpoints, optimizing state handling with Redux."',
      benefit: 'Showcases technical depth and end-to-end feature ownership.'
    }
  ],
  comparisons: [
    {
      section: 'Work Experience - NexaTech Solutions',
      before: 'Responsible for building frontend features using React and JavaScript.',
      after: 'Architected and shipped 8+ responsive React dashboard modules, accelerating user workflow efficiency by [e.g., 25%].',
      explanation: 'Replaces passive "Responsible for" with the active verb "Architected" and introduces a quantifiable metric template.'
    },
    {
      section: 'Work Experience - NexaTech Solutions',
      before: 'Worked with backend team to integrate REST APIs for customer dashboard.',
      after: 'Collaborated with backend engineers to integrate 15+ secure RESTful API endpoints, reducing dashboard latency by [e.g., 40ms].',
      explanation: 'Specifies endpoint volume, security focus, and tangible performance optimization.'
    },
    {
      section: 'Professional Summary',
      before: 'Experienced software engineer with experience developing web applications. Skilled in JavaScript, React, Node.js, and working with team members to deliver code. Looking for a new software engineering position.',
      after: 'Full-Stack Software Engineer with proven expertise building scalable React applications and Node.js microservices. Recognized for clean code architecture, cross-functional collaboration, and delivering high-availability cloud features.',
      explanation: 'Removes repetitive phrasing and passive job-hunting declarations while spotlighting high-demand technical strengths.'
    },
    {
      section: 'Projects - TaskFlow',
      before: 'Built a web application using React and Node.js for tracking tasks. Included authentication and MongoDB database for storing user tasks.',
      after: 'Engineered a full-stack project tracking tool utilizing React, Express, and MongoDB with JWT authentication and optimized indexing.',
      explanation: 'Highlights security mechanisms (JWT) and database performance (indexing) without inflating credentials.'
    }
  ],
  checklist: [
    { id: 'chk-1', title: 'Replace passive "Responsible for" openers with strong action verbs', done: false },
    { id: 'chk-2', title: 'Add 2-3 bracketed quantifiable impact metrics in work experience', done: false },
    { id: 'chk-3', title: 'Rewrite professional summary to remove redundant words and job-seeking phrases', done: true },
    { id: 'chk-4', title: 'Detail architectural approach and user problem in TaskFlow project', done: false },
    { id: 'chk-5', title: 'Add relevant testing frameworks (e.g. Jest / Vitest) to Technical Skills', done: false },
    { id: 'chk-6', title: 'Highlight cross-functional collaboration and sprint leadership', done: false },
    { id: 'chk-7', title: 'Verify chronological dates and consistent formatting across all sections', done: true }
  ]
};

export const ResumeImprovementPage = () => {
  const {
    resumeText: contextResumeText,
    analysisResults,
    improvementSuggestions,
    setImprovementSuggestions
  } = useApp();

  // Active resume text state (defaults to contextResumeText if available, or sample text)
  const [activeResumeText, setActiveResumeText] = useState(
    contextResumeText || DEFAULT_SAMPLE_RESUME
  );
  const [isSampleMode, setIsSampleMode] = useState(!contextResumeText);
  const [showResumePreview, setShowResumePreview] = useState(false);

  // Active Evaluation Data
  const [evaluation, setEvaluation] = useState(SAMPLE_EVALUATION);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'review' | 'suggestions' | 'beforeAfter' | 'checklist'
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checklistItems, setChecklistItems] = useState(SAMPLE_EVALUATION.checklist);

  // Sync with context resumeText when it changes
  useEffect(() => {
    if (contextResumeText && contextResumeText.trim()) {
      setActiveResumeText(contextResumeText);
      setIsSampleMode(false);
    }
  }, [contextResumeText]);

  // Toggle sample resume text
  const handleToggleSample = () => {
    if (isSampleMode) {
      if (contextResumeText) {
        setActiveResumeText(contextResumeText);
        setIsSampleMode(false);
      } else {
        setActiveResumeText('');
        setIsSampleMode(false);
      }
    } else {
      setActiveResumeText(DEFAULT_SAMPLE_RESUME);
      setIsSampleMode(true);
    }
  };

  // Toggle checklist item
  const handleToggleChecklist = (id) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  // Generate Suggestions via Google Gemini API
  const handleGenerateAiSuggestions = async () => {
    if (!activeResumeText.trim()) {
      setErrorMsg('Please provide resume text to analyze.');
      return;
    }

    if (!isGeminiConfigured()) {
      setErrorMsg(
        'Gemini API key is not configured in .env. Running in verified Sample Mode.'
      );
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    try {
      const ai = getGeminiClient();

      const prompt = `You are a Senior Executive Resume Strategist and Career Optimization Specialist.
Analyze the following resume and generate a complete, rigorous improvement evaluation.

CRITICAL INSTRUCTIONS:
- Base all feedback strictly on the actual resume text below.
- NEVER invent qualifications, experience, degrees, or certifications.
- If proposing metrics, use bracketed placeholders like "[e.g., X%]".
- Analyze all 9 sections: Professional Summary, Career Objective, Technical Skills, Soft Skills, Education, Projects, Work Experience, Certifications, Grammar and Readability.
- Provide 7 targeted recommendation cards covering:
  1. Missing Information
  2. Weak Resume Sections
  3. Keyword Improvements
  4. Grammar and Clarity
  5. Professional Summary Improvements
  6. Project Description Improvements
  7. Experience Description Improvements
- Provide 4 before-and-after sentence transformations with explanations.
- Provide an indicative score out of 100 with category breakdown.

Resume Text:
"""
${activeResumeText}
"""

${analysisResults ? `Existing ATS Analysis: ${JSON.stringify(analysisResults)}\n` : ''}

RETURN ONLY A VALID JSON OBJECT MATCHING THIS SCHEMA:
{
  "score": number (0-100),
  "potentialScore": number (0-100),
  "explanation": "string explaining score and primary improvement areas",
  "breakdown": {
    "impactAndMetrics": number (0-100),
    "keywordRelevance": number (0-100),
    "grammarAndClarity": number (0-100),
    "sectionCompleteness": number (0-100)
  },
  "reviews": [
    {
      "section": "Professional Summary" | "Career Objective" | "Technical Skills" | "Soft Skills" | "Education" | "Projects" | "Work Experience" | "Certifications" | "Grammar and Readability",
      "status": "Optimized" | "Needs Work" | "Weak" | "Missing",
      "finding": "string",
      "recommendation": "string"
    }
  ],
  "suggestions": [
    {
      "id": "string",
      "category": "Missing Information" | "Weak Resume Sections" | "Keyword Improvements" | "Grammar and Clarity" | "Professional Summary Improvements" | "Project Description Improvements" | "Experience Description Improvements",
      "priority": "High" | "Medium" | "Low",
      "title": "string",
      "description": "string",
      "action": "string",
      "benefit": "string"
    }
  ],
  "comparisons": [
    {
      "section": "string",
      "before": "string",
      "after": "string",
      "explanation": "string"
    }
  ],
  "checklist": [
    {
      "id": "string",
      "title": "string",
      "done": false
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const parsed = parseGeminiJsonResponse(response.text);

      if (parsed && parsed.score !== undefined) {
        setEvaluation(parsed);
        if (parsed.checklist?.length) {
          setChecklistItems(parsed.checklist);
        }
        setIsSampleMode(false);

        // Save to shared AppContext
        if (typeof setImprovementSuggestions === 'function') {
          setImprovementSuggestions(parsed);
        }
      }
    } catch (err) {
      console.error('Gemini Improvement Analysis Error:', err);
      setErrorMsg(
        err.message || 'Failed to complete AI analysis. Switched to verified sample mode.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = checklistItems.filter((i) => i.done).length;
  const checklistPercentage = checklistItems.length
    ? Math.round((completedCount / checklistItems.length) * 100)
    : 0;

  return (
    <div className="resume-improvement-container">
      {/* Page Header */}
      <div className="ri-header">
        <div className="ri-header-title-box">
          <div className="ri-header-icon-box">
            <Lightbulb size={28} />
          </div>
          <div>
            <span className="ri-badge">Module 6: Resume Improvement Suggestions</span>
            <h1 className="ri-title">Resume Improvement Suggestions</h1>
            <p className="ri-subtitle">
              Improve your resume with personalized AI-powered recommendations.
            </p>
          </div>
        </div>

        <div className="ri-header-actions">
          <button
            type="button"
            className="ri-btn ri-btn-primary"
            onClick={handleGenerateAiSuggestions}
            disabled={isGenerating || !activeResumeText.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="spinner spinner-sm" />
                <span>Analyzing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate AI Suggestions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Indicator Banner */}
      <div
        className={`ri-mode-banner ${
          isSampleMode ? 'ri-mode-banner-sample' : 'ri-mode-banner-live'
        }`}
      >
        <div className="ri-mode-left">
          {isSampleMode ? (
            <Info size={18} />
          ) : (
            <ShieldCheck size={18} />
          )}
          <span>
            {isSampleMode ? (
              <>
                <strong>Sample Mode Active:</strong> Evaluating standard Software Engineer resume. Click{' '}
                <strong>"Use My Resume"</strong> to analyze your uploaded resume or enter custom text.
              </>
            ) : (
              <>
                <strong>Live Resume Active:</strong> Connected to your loaded resume text and ready for
                personalized Gemini AI suggestions.
              </>
            )}
          </span>
        </div>

        <div className="ri-mode-actions">
          <button
            type="button"
            className="ri-btn ri-btn-outline ri-btn-sm"
            onClick={handleToggleSample}
          >
            {isSampleMode ? 'Use My Resume' : 'Load Sample Resume'}
          </button>

          <button
            type="button"
            className="ri-btn ri-btn-outline ri-btn-sm"
            onClick={() => setShowResumePreview(!showResumePreview)}
          >
            {showResumePreview ? (
              <>
                <EyeOff size={13} />
                <span>Hide Resume Text</span>
              </>
            ) : (
              <>
                <Eye size={13} />
                <span>View Resume Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Collapsible Resume Preview / Input */}
      {showResumePreview && (
        <div className="resume-input-card">
          <div className="resume-input-header">
            <div className="resume-input-title">
              <FileText size={18} color="var(--color-primary)" />
              <span>Active Resume Content ({activeResumeText.split(/\s+/).filter(Boolean).length} words)</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Read from AppContext
            </span>
          </div>
          <div className="resume-preview-box">{activeResumeText}</div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="ri-tabs-nav">
        <button
          type="button"
          className={`ri-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Award size={16} />
          <span>Improvement Score</span>
        </button>

        <button
          type="button"
          className={`ri-tab-btn ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          <CheckCircle2 size={16} />
          <span>9-Section Review</span>
        </button>

        <button
          type="button"
          className={`ri-tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          <Layers size={16} />
          <span>7 Recommendation Cards</span>
        </button>

        <button
          type="button"
          className={`ri-tab-btn ${activeTab === 'beforeAfter' ? 'active' : ''}`}
          onClick={() => setActiveTab('beforeAfter')}
        >
          <ArrowRight size={16} />
          <span>Before & After</span>
        </button>

        <button
          type="button"
          className={`ri-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          <CheckSquare size={16} />
          <span>Improvement Checklist ({checklistPercentage}%)</span>
        </button>
      </div>

      {/* Tab 1: Overview & Improvement Score */}
      {activeTab === 'overview' && (
        <div>
          <ImprovementScore
            score={evaluation.score}
            potentialScore={evaluation.potentialScore}
            explanation={evaluation.explanation}
            breakdown={evaluation.breakdown}
          />

          {/* Quick Preview of Top Suggestions */}
          <div style={{ marginTop: '28px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '14px' }}>
              Top Priority Action Items
            </h3>
            <div className="suggestions-grid">
              {(evaluation.suggestions || []).slice(0, 3).map((item, idx) => (
                <div key={idx} className="suggestion-item-card">
                  <div className="suggestion-card-top">
                    <span className="suggestion-category-tag">{item.category}</span>
                    <span
                      className="suggestion-priority-tag"
                      style={{
                        backgroundColor: 'var(--color-danger-bg)',
                        color: 'var(--color-danger)',
                        border: '1px solid var(--color-danger-border)'
                      }}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <h4 className="suggestion-main-title">{item.title}</h4>
                  <p className="suggestion-issue-desc">{item.description}</p>
                  <div className="suggestion-action-box">
                    <div className="suggestion-action-label">Recommended Action</div>
                    <div>{item.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 9-Section Resume Review */}
      {activeTab === 'review' && (
        <ResumeReview reviews={evaluation.reviews || []} />
      )}

      {/* Tab 3: 7 Category Improvement Suggestions */}
      {activeTab === 'suggestions' && (
        <ImprovementSuggestions suggestions={evaluation.suggestions || []} />
      )}

      {/* Tab 4: Before and After Comparison */}
      {activeTab === 'beforeAfter' && (
        <BeforeAfter comparisons={evaluation.comparisons || []} />
      )}

      {/* Tab 5: Interactive Improvement Checklist */}
      {activeTab === 'checklist' && (
        <div className="checklist-card">
          <div className="checklist-header">
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>
                Interactive Improvement Checklist
              </h3>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>
                Track and execute verified changes to elevate your resume.
              </p>
            </div>

            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {completedCount} of {checklistItems.length} Completed ({checklistPercentage}%)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="checklist-progress-bar-wrap">
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-pill)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)'
              }}
            >
              <div
                style={{
                  width: `${checklistPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  transition: 'width 300ms ease'
                }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="checklist-items-list">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`checklist-item-row ${item.done ? 'is-done' : ''}`}
                onClick={() => handleToggleChecklist(item.id)}
              >
                <input
                  type="checkbox"
                  className="checklist-checkbox"
                  checked={item.done}
                  onChange={() => handleToggleChecklist(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="checklist-text-group">
                  <div
                    className={`checklist-task-title ${
                      item.done ? 'done-text' : ''
                    }`}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeImprovementPage;
