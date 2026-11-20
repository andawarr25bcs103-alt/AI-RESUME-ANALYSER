import { GoogleGenAI } from '@google/genai';

/**
 * Google Gemini API Client Service
 * Configured using @google/genai SDK
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Checks if the Gemini API key has been configured
 */
export const isGeminiConfigured = () => {
  return Boolean(apiKey && apiKey !== 'YOUR_GEMINI_API_KEY');
};

let genAIInstance = null;

/**
 * Lazy initializer for GoogleGenAI client instance
 */
export const getGeminiClient = () => {
  if (!isGeminiConfigured()) {
    throw new Error(
      'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.'
    );
  }

  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({ apiKey });
  }

  return genAIInstance;
};

/**
 * Clean and parse JSON response from Gemini
 */
export const parseGeminiJsonResponse = (responseText) => {
  try {
    // Strip markdown code fences if Gemini wraps json in ```json ... ```
    const cleaned = responseText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', error, responseText);
    throw new Error('AI returned an invalid JSON response format.');
  }
};

/**
 * Module 3 Integration Helper: AI Resume Analysis
 * Extracts candidate details, sections, ATS score, strengths, and weakness analysis.
 *
 * @param {string} resumeText
 * @param {object} options
 * @returns {Promise<object>} Structured resume analysis
 */
export const analyzeResumeWithGemini = async (resumeText, options = {}) => {
  const ai = getGeminiClient();
  const modelName = options.model || 'gemini-2.5-flash';

  const prompt = `You are an expert AI Resume Analyst and ATS Auditor for RESUMATE AI.
Analyze the following resume text thoroughly.

Return ONLY a valid JSON object matching this schema:
{
  "candidate": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string"
  },
  "summary": "string",
  "atsScore": number (0-100),
  "atsScoreBreakdown": {
    "formatting": number (0-100),
    "keywordRelevance": number (0-100),
    "impactAndMetrics": number (0-100),
    "sectionsCompleteness": number (0-100)
  },
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "toolsAndFrameworks": ["string"]
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "keyStrengths": ["string"],
  "criticalWeaknesses": ["string"]
}

Resume Text:
"""
${resumeText}
"""`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt
  });

  return parseGeminiJsonResponse(response.text);
};

/**
 * Module 4 Integration Helper: Job Matching & Compatibility
 * Compares candidate resume with a target Job Description.
 *
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Promise<object>}
 */
export const matchJobWithGemini = async (resumeText, jobDescription) => {
  const ai = getGeminiClient();

  const prompt = `You are a recruitment specialist and job matching engine.
Compare the following resume text against the target job description.

Return ONLY a valid JSON object matching this schema:
{
  "matchPercentage": number (0-100),
  "verdict": "Strong Fit" | "Moderate Fit" | "Low Fit",
  "matchingKeywords": ["string"],
  "missingKeywords": ["string"],
  "keyRoleRequirements": ["string"],
  "compatibilitySummary": "string",
  "recommendations": ["string"]
}

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText}
"""`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return parseGeminiJsonResponse(response.text);
};

/**
 * Module 5 Integration Helper: Skill Gap Analysis
 * Identifies missing technical and soft skills for a given target role.
 *
 * @param {string} resumeText
 * @param {string} targetRole
 * @param {string} [optionalJobDesc]
 * @returns {Promise<object>}
 */
export const analyzeSkillGapWithGemini = async (resumeText, targetRole, optionalJobDesc = '') => {
  const ai = getGeminiClient();

  const prompt = `You are a career path and skill matrix specialist.
Analyze the resume for the target role: "${targetRole}".
${optionalJobDesc ? `Reference Job Description:\n"""\n${optionalJobDesc}\n"""\n` : ''}

Return ONLY a valid JSON object matching this schema:
{
  "targetRole": "${targetRole}",
  "readinessScore": number (0-100),
  "acquiredSkills": ["string"],
  "missingCriticalSkills": ["string"],
  "missingOptionalSkills": ["string"],
  "recommendedCertifications": ["string"],
  "learningRoadmap": [
    {
      "skill": "string",
      "importance": "High" | "Medium" | "Low",
      "learningResource": "string"
    }
  ]
}

Resume Text:
"""
${resumeText}
"""`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return parseGeminiJsonResponse(response.text);
};

/**
 * Module 6 Integration Helper: Improvement Suggestions
 * Generates tailored action-oriented resume enhancements.
 *
 * @param {string} resumeText
 * @param {object} [existingAnalysis]
 * @returns {Promise<object>}
 */
export const generateImprovementSuggestionsWithGemini = async (resumeText, existingAnalysis = null) => {
  const ai = getGeminiClient();

  const analysisContext = existingAnalysis
    ? `\nReference Existing Analysis:\n${JSON.stringify(existingAnalysis, null, 2)}\n`
    : '';

  const prompt = `You are an elite career coach and executive resume writer.
Review this resume and propose high-impact improvements.
${analysisContext}
Return ONLY a valid JSON object matching this schema:
{
  "executiveSummarySuggestion": "string",
  "actionVerbEnhancements": [
    {
      "originalPhrase": "string",
      "suggestedRewrite": "string",
      "reason": "string"
    }
  ],
  "formattingAndStructureTips": ["string"],
  "atsOptimizationTips": ["string"],
  "projectPortfolioAdvice": ["string"],
  "quantifiableMetricsAdvice": ["string"]
}

Resume Text:
"""
${resumeText}
"""`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return parseGeminiJsonResponse(response.text);
};
