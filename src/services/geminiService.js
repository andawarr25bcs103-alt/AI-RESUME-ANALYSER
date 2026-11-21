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
    // Fallback: extract the outermost JSON object if Gemini added pre/post text
    try {
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const potentialJson = responseText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(potentialJson);
      }
    } catch (innerError) {
      console.error('Failed fallback JSON parsing:', innerError);
    }
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

STRICT INSTRUCTIONS:
1. Extract factual information ONLY from the provided resume text. DO NOT invent, assume, or extrapolate any qualifications, degrees, companies, projects, or certifications that are not explicitly stated.
2. If any section or information (e.g. certifications, projects, work experience, summary, contact links) is missing or not mentioned, set that field to an empty array [] or null, assign appropriate low/zero score for that category, and document it under missingSections and notAvailableInfo.
3. Calculate the overall professional resume score (0-100) using the exact weighted criteria:
   - Professional Summary: 15% (0 if absent or poor)
   - Education: 10% (0 if absent)
   - Technical Skills: 15% (breadth & relevance of listed skills)
   - Projects: 20% (0 if absent; evaluate depth, outcomes, and technologies)
   - Experience: 15% (0 if absent; evaluate role progression and achievements)
   - Certifications: 10% (0 if absent; industry-recognized credentials)
   - Resume Structure: 15% (layout readability, contact details, standard headings)

Return ONLY a valid JSON object matching this schema:
{
  "candidate": {
    "name": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null",
    "linkedin": "string or null",
    "github": "string or null",
    "portfolio": "string or null"
  },
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "scoreBreakdown": {
    "professionalSummary": {
      "score": number (0-100),
      "weight": 15,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    },
    "education": {
      "score": number (0-100),
      "weight": 10,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    },
    "technicalSkills": {
      "score": number (0-100),
      "weight": 15,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    },
    "projects": {
      "score": number (0-100),
      "weight": 20,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    },
    "experience": {
      "score": number (0-100),
      "weight": 15,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    },
    "certifications": {
      "score": number (0-100),
      "weight": 10,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    },
    "resumeStructure": {
      "score": number (0-100),
      "weight": 15,
      "status": "Excellent | Good | Needs Improvement | Missing",
      "feedback": "string"
    }
  },
  "atsScoreBreakdown": {
    "formatting": number (0-100),
    "keywordRelevance": number (0-100),
    "impactAndMetrics": number (0-100),
    "sectionsCompleteness": number (0-100)
  },
  "summary": "string or null",
  "hasSummary": boolean,
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "location": "string",
      "details": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "location": "string",
      "highlights": ["string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string",
      "highlights": ["string"]
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "toolsAndFrameworks": ["string"]
  },
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ],
  "keyStrengths": ["string"],
  "criticalWeaknesses": ["string"],
  "resumeKeywords": ["string"],
  "missingSections": [
    {
      "section": "string",
      "severity": "High | Medium | Low",
      "impact": "string",
      "suggestion": "string"
    }
  ],
  "recommendations": [
    {
      "priority": "High | Medium | Low",
      "category": "string",
      "title": "string",
      "description": "string"
    }
  ],
  "notAvailableInfo": ["string"]
}

Resume Text:
"""
${resumeText}
"""`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt
  });

  const parsed = parseGeminiJsonResponse(response.text);

  // Normalize and calculate mathematically accurate weighted overallScore
  const weights = {
    professionalSummary: 0.15,
    education: 0.10,
    technicalSkills: 0.15,
    projects: 0.20,
    experience: 0.15,
    certifications: 0.10,
    resumeStructure: 0.15
  };

  let computedScore = 0;
  if (parsed.scoreBreakdown && typeof parsed.scoreBreakdown === 'object') {
    for (const [key, weight] of Object.entries(weights)) {
      const entry = parsed.scoreBreakdown[key];
      const itemScore = typeof entry === 'object' && entry !== null ? (entry.score ?? 0) : (typeof entry === 'number' ? entry : 0);
      computedScore += itemScore * weight;
    }
    computedScore = Math.round(computedScore);
  }

  const finalScore = computedScore || parsed.overallScore || parsed.atsScore || 70;
  parsed.overallScore = finalScore;
  parsed.atsScore = finalScore;

  // Ensure all collections are safely arrays
  parsed.education = Array.isArray(parsed.education) ? parsed.education : [];
  parsed.experience = Array.isArray(parsed.experience) ? parsed.experience : [];
  parsed.projects = Array.isArray(parsed.projects) ? parsed.projects : [];
  parsed.certifications = Array.isArray(parsed.certifications) ? parsed.certifications : [];
  parsed.keyStrengths = Array.isArray(parsed.keyStrengths) ? parsed.keyStrengths : [];
  parsed.criticalWeaknesses = Array.isArray(parsed.criticalWeaknesses) ? parsed.criticalWeaknesses : [];
  parsed.resumeKeywords = Array.isArray(parsed.resumeKeywords) ? parsed.resumeKeywords : (Array.isArray(parsed.keywords) ? parsed.keywords : []);
  parsed.missingSections = Array.isArray(parsed.missingSections) ? parsed.missingSections : [];
  parsed.recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  parsed.notAvailableInfo = Array.isArray(parsed.notAvailableInfo) ? parsed.notAvailableInfo : [];

  if (!parsed.skills) parsed.skills = {};
  parsed.skills.technical = Array.isArray(parsed.skills.technical) ? parsed.skills.technical : [];
  parsed.skills.soft = Array.isArray(parsed.skills.soft) ? parsed.skills.soft : [];
  parsed.skills.toolsAndFrameworks = Array.isArray(parsed.skills.toolsAndFrameworks) ? parsed.skills.toolsAndFrameworks : [];

  // Automatically record missing sections in notAvailableInfo if absent
  if (parsed.education.length === 0 && !parsed.notAvailableInfo.some(s => s.toLowerCase().includes('education'))) {
    parsed.notAvailableInfo.push('Education details not found in resume');
  }
  if (parsed.experience.length === 0 && !parsed.notAvailableInfo.some(s => s.toLowerCase().includes('experience'))) {
    parsed.notAvailableInfo.push('Work experience not found in resume');
  }
  if (parsed.projects.length === 0 && !parsed.notAvailableInfo.some(s => s.toLowerCase().includes('project'))) {
    parsed.notAvailableInfo.push('Projects not found in resume');
  }
  if (parsed.certifications.length === 0 && !parsed.notAvailableInfo.some(s => s.toLowerCase().includes('certification'))) {
    parsed.notAvailableInfo.push('Certifications not found in resume');
  }
  if (!parsed.summary && !parsed.notAvailableInfo.some(s => s.toLowerCase().includes('summary'))) {
    parsed.notAvailableInfo.push('Professional summary not found in resume');
  }

  return parsed;
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
