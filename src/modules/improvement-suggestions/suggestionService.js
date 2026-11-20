import {
  getGeminiClient,
  isGeminiConfigured,
  parseGeminiJsonResponse
} from '../../services/geminiService';

/**
 * Validates and normalizes an individual recommendation object.
 * Ensures all required fields exist with valid fallbacks.
 */
const normalizeRecommendation = (item, defaultCategory = 'Resume Content', index = 0) => {
  const priority = ['High', 'Medium', 'Low'].includes(item?.priority)
    ? item.priority
    : 'Medium';

  return {
    id: item?.id || `rec-${defaultCategory.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    title: item?.title || 'Resume Improvement Recommendation',
    category: item?.category || defaultCategory,
    description: item?.description || '',
    reason: item?.reason || '',
    action: item?.action || '',
    priority,
    expectedBenefit: item?.expectedBenefit || ''
  };
};

/**
 * Generates comprehensive AI-powered improvement suggestions using Gemini.
 * Synthesizes resumeText, analysisResults, matchingResults, and skillAnalysisResults.
 *
 * @param {object} params
 * @param {string} params.resumeText - Extracted text of uploaded resume
 * @param {object|null} params.analysisResults - Module 3 ATS and section analysis
 * @param {object|null} params.matchingResults - Module 4 Job description matching
 * @param {object|null} params.skillAnalysisResults - Module 5 Skill gap roadmap
 * @param {string} [params.resumeFileName] - Name of uploaded resume file
 * @returns {Promise<object>} Structured improvement suggestions
 */
export const generateSuggestions = async ({
  resumeText,
  analysisResults = null,
  matchingResults = null,
  skillAnalysisResults = null,
  resumeFileName = 'Uploaded Resume'
}) => {
  if (!isGeminiConfigured()) {
    throw new Error(
      'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.'
    );
  }

  if (!resumeText || !resumeText.trim()) {
    throw new Error('No resume text available for analysis. Please upload a resume first.');
  }

  const ai = getGeminiClient();

  // Construct contextual findings from available modules
  let contextualPromptSection = '';

  if (analysisResults) {
    contextualPromptSection += `\n--- [MODULE 3] AI RESUME ANALYSIS & ATS AUDIT ---\n`;
    if (analysisResults.atsScore !== undefined) {
      contextualPromptSection += `ATS Score: ${analysisResults.atsScore}/100\n`;
    }
    if (analysisResults.atsScoreBreakdown) {
      contextualPromptSection += `ATS Breakdown: ${JSON.stringify(analysisResults.atsScoreBreakdown)}\n`;
    }
    if (analysisResults.keyStrengths?.length) {
      contextualPromptSection += `Identified Key Strengths: ${analysisResults.keyStrengths.join(', ')}\n`;
    }
    if (analysisResults.criticalWeaknesses?.length) {
      contextualPromptSection += `Identified Critical Weaknesses: ${analysisResults.criticalWeaknesses.join(', ')}\n`;
    }
    if (analysisResults.skills) {
      contextualPromptSection += `Parsed Skills: ${JSON.stringify(analysisResults.skills)}\n`;
    }
  } else {
    contextualPromptSection += `\n--- [MODULE 3] AI RESUME ANALYSIS: Not executed yet (generate suggestions directly from resume text).\n`;
  }

  if (matchingResults) {
    contextualPromptSection += `\n--- [MODULE 4] JOB DESCRIPTION MATCHING ---\n`;
    if (matchingResults.matchPercentage !== undefined) {
      contextualPromptSection += `Target Role Compatibility Match: ${matchingResults.matchPercentage}%\n`;
    }
    if (matchingResults.verdict) {
      contextualPromptSection += `Fit Verdict: ${matchingResults.verdict}\n`;
    }
    if (matchingResults.matchingKeywords?.length) {
      contextualPromptSection += `Covered Keywords: ${matchingResults.matchingKeywords.join(', ')}\n`;
    }
    if (matchingResults.missingKeywords?.length) {
      contextualPromptSection += `Missing Target Keywords to naturally incorporate: ${matchingResults.missingKeywords.join(', ')}\n`;
    }
    if (matchingResults.recommendations?.length) {
      contextualPromptSection += `Matcher Recommendations: ${matchingResults.recommendations.join(', ')}\n`;
    }
  } else {
    contextualPromptSection += `\n--- [MODULE 4] JOB DESCRIPTION MATCHING: Not executed yet (no target job description provided).\n`;
  }

  if (skillAnalysisResults) {
    contextualPromptSection += `\n--- [MODULE 5] SKILL GAP & ROADMAP ---\n`;
    if (skillAnalysisResults.targetRole) {
      contextualPromptSection += `Target Role: ${skillAnalysisResults.targetRole}\n`;
    }
    if (skillAnalysisResults.readinessScore !== undefined) {
      contextualPromptSection += `Role Readiness: ${skillAnalysisResults.readinessScore}%\n`;
    }
    if (skillAnalysisResults.missingCriticalSkills?.length) {
      contextualPromptSection += `Missing Critical Skills: ${skillAnalysisResults.missingCriticalSkills.join(', ')}\n`;
    }
    if (skillAnalysisResults.missingOptionalSkills?.length) {
      contextualPromptSection += `Missing Optional Skills: ${skillAnalysisResults.missingOptionalSkills.join(', ')}\n`;
    }
    if (skillAnalysisResults.recommendedCertifications?.length) {
      contextualPromptSection += `Recommended Upskilling Certifications: ${skillAnalysisResults.recommendedCertifications.join(', ')}\n`;
    }
  } else {
    contextualPromptSection += `\n--- [MODULE 5] SKILL GAP ANALYSIS: Not executed yet.\n`;
  }

  const prompt = `You are an elite Senior Executive Resume Coach, ATS Optimization Specialist, and Technical Career Advisor for RESUMATE AI.
Your objective is to provide actionable, personalized, and practical improvement suggestions to help this candidate dramatically enhance their resume and career readiness.

Document Filename: "${resumeFileName}"

Available Candidate Context:
${contextualPromptSection}

Resume Content:
"""
${resumeText}
"""

TASK INSTRUCTIONS:
1. Thoroughly read the uploaded resume and understand the candidate's actual qualifications and experience.
2. Review the existing analysis results provided above.
3. Identify genuine resume weaknesses, vague descriptions, passive voice, missing information, and structural shortcomings.
4. Suggest concrete improvements across all required categories:
   - Resume Content Improvements (structure, formatting, missing sections, clarity)
   - Professional Summary Improvements (critique existing summary or suggest creating one if missing, identify issues, and write a high-impact rewritten summary)
   - Technical Skills Improvements (skills needing stronger demonstration, missing complementary tools, ATS alignment)
   - Project Improvements (improving problem statements, architecture, tools used, results)
   - Work Experience Improvements (responsibilities, active verbs, measurable impact framing)
   - Education and Certification Improvements (clarity of education, recommended industry certifications)
   - Job-Specific Improvements (aligning with target job if matching data exists, or general role targeting)
   - Career Development Recommendations (practical technical readiness, portfolio development, interview preparation)

STRICT ANTI-FABRICATION AND ETHICAL RULES:
- NEVER invent or fabricate achievements, company names, job titles, university degrees, certifications, or numerical metrics that the candidate does not have.
- If suggesting quantifiable impact (e.g. metrics), provide bracketed placeholders like "[e.g., reduced response latency by X%]" or "[e.g., increased conversion by X%]" so the user knows where to supply their own true numbers.
- The suggested rewritten professional summary must be based ONLY on verified information present in the resume.
- Any suggested certifications must be clearly labeled as recommendations to pursue, not qualifications the candidate already holds.
- Do not make false recruitment guarantees.

RETURN ONLY A VALID JSON OBJECT MATCHING THIS EXACT SCHEMA:
{
  "overallSummary": "A concise 2-3 sentence personalized summary of the resume's current state and highest-impact growth areas.",
  "overallPriority": "High" | "Medium" | "Low",
  "summaryImprovements": {
    "currentSummaryCritique": "Evaluation of candidate's existing summary (or note that it was missing)",
    "issues": [
      "Issue 1 with current summary (e.g. lacks target role clarity, contains passive buzzwords)"
    ],
    "strengths": [
      "Any positive elements present in current summary"
    ],
    "suggestedSummary": "A polished, active-voice, professional summary rewritten strictly using the candidate's verified skills and experience."
  },
  "resumeImprovements": [
    {
      "title": "Clear concise title",
      "category": "Resume Content",
      "description": "Clear explanation of the weakness or gap",
      "reason": "Why this specific issue hurts resume effectiveness or ATS parsing",
      "action": "Concrete step the user should take to fix it",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "What this change achieves"
    }
  ],
  "technicalSkillImprovements": [
    {
      "title": "Clear title",
      "category": "Technical Skills",
      "description": "Explanation of skill presentation weakness or missing complementary skills",
      "reason": "Why this improves ATS keyword match or technical credibility",
      "action": "Specific action to categorize or demonstrate skills",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "Benefit to candidate"
    }
  ],
  "projectImprovements": [
    {
      "title": "Clear title",
      "category": "Projects",
      "description": "Explanation of project description weakness",
      "reason": "Why problem statements and tech stack clarity matter",
      "action": "Actionable way to rewrite project bullets without inventing false facts",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "Benefit"
    }
  ],
  "experienceImprovements": [
    {
      "title": "Clear title",
      "category": "Work Experience",
      "description": "Explanation of passive duties or unclear outcomes",
      "reason": "Why active verbs and business context matter",
      "action": "Recommended rewrite or action verb enhancement",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "Benefit"
    }
  ],
  "educationImprovements": [
    {
      "title": "Clear title",
      "category": "Education & Certifications",
      "description": "Education presentation or missing certifications",
      "reason": "Why industry credentials or clear formatting helps",
      "action": "Recommended course, certification to pursue, or formatting fix",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "Benefit"
    }
  ],
  "jobSpecificRecommendations": [
    {
      "title": "Clear title",
      "category": "Job-Specific",
      "description": "Tailoring advice for target role or keywords",
      "reason": "Why aligning with role requirements boosts interview chances",
      "action": "Specific tailoring adjustment",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "Benefit"
    }
  ],
  "careerDevelopment": [
    {
      "title": "Clear title",
      "category": "Career Development",
      "description": "Practical professional readiness suggestion",
      "reason": "Why building this project or practicing this skill accelerates career growth",
      "action": "Actionable learning step or portfolio advice",
      "priority": "High" | "Medium" | "Low",
      "expectedBenefit": "Benefit"
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const parsed = parseGeminiJsonResponse(response.text);

  // Validate and normalize all recommendation categories
  const resumeImprovements = (parsed.resumeImprovements || []).map((item, i) =>
    normalizeRecommendation(item, 'Resume Content', i)
  );

  const technicalSkillImprovements = (parsed.technicalSkillImprovements || []).map((item, i) =>
    normalizeRecommendation(item, 'Technical Skills', i)
  );

  const projectImprovements = (parsed.projectImprovements || []).map((item, i) =>
    normalizeRecommendation(item, 'Projects', i)
  );

  const experienceImprovements = (parsed.experienceImprovements || []).map((item, i) =>
    normalizeRecommendation(item, 'Work Experience', i)
  );

  const educationImprovements = (parsed.educationImprovements || []).map((item, i) =>
    normalizeRecommendation(item, 'Education & Certifications', i)
  );

  const jobSpecificRecommendations = (parsed.jobSpecificRecommendations || []).map((item, i) =>
    normalizeRecommendation(item, 'Job-Specific', i)
  );

  const careerDevelopment = (parsed.careerDevelopment || []).map((item, i) =>
    normalizeRecommendation(item, 'Career Development', i)
  );

  // Normalize summary improvements
  const summaryImprovements = {
    currentSummaryCritique:
      parsed.summaryImprovements?.currentSummaryCritique ||
      'Review of current professional summary alignment.',
    issues: Array.isArray(parsed.summaryImprovements?.issues)
      ? parsed.summaryImprovements.issues
      : [],
    strengths: Array.isArray(parsed.summaryImprovements?.strengths)
      ? parsed.summaryImprovements.strengths
      : [],
    suggestedSummary:
      parsed.summaryImprovements?.suggestedSummary ||
      'Results-driven professional with proven skills in software development and project execution.'
  };

  // Combine all recommendations into a flat collection for priority grouping & filtering
  const allRecommendations = [
    ...resumeImprovements,
    ...technicalSkillImprovements,
    ...projectImprovements,
    ...experienceImprovements,
    ...educationImprovements,
    ...jobSpecificRecommendations,
    ...careerDevelopment
  ];

  // Group by priority
  const highPriority = allRecommendations.filter((r) => r.priority === 'High');
  const mediumPriority = allRecommendations.filter((r) => r.priority === 'Medium');
  const lowPriority = allRecommendations.filter((r) => r.priority === 'Low');

  return {
    generatedAt: new Date().toISOString(),
    resumeFileName,
    overallSummary:
      parsed.overallSummary ||
      'Comprehensive resume evaluation focusing on impactful wording, ATS keywords, and verified achievements.',
    overallPriority: ['High', 'Medium', 'Low'].includes(parsed.overallPriority)
      ? parsed.overallPriority
      : 'High',
    summaryImprovements,
    resumeImprovements,
    technicalSkillImprovements,
    projectImprovements,
    experienceImprovements,
    educationImprovements,
    jobSpecificRecommendations,
    careerDevelopment,
    highPriority,
    mediumPriority,
    lowPriority,
    allRecommendations,
    // Context snapshot for auditability
    contextSnapshot: {
      hasResumeText: Boolean(resumeText),
      hasAnalysis: Boolean(analysisResults),
      hasMatching: Boolean(matchingResults),
      hasSkillGap: Boolean(skillAnalysisResults),
      atsScore: analysisResults?.atsScore ?? null,
      matchPercentage: matchingResults?.matchPercentage ?? null,
      readinessScore: skillAnalysisResults?.readinessScore ?? null
    }
  };
};

export default {
  generateSuggestions
};
