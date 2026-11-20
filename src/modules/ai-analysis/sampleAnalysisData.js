/**
 * Sample Analysis Data Generator
 * Provides a rich, 100% compliant analysis data structure for demo/preview testing
 * strictly reflecting what exists in the candidate resume text.
 */
export const getRealisticAnalysisFromResume = (resumeText = '', fileName = '') => {
  const textLower = resumeText.toLowerCase();

  // Basic heuristic detection for resume sections to ensure we do not invent
  const hasSummary = textLower.includes('summary') || textLower.includes('profile') || textLower.includes('objective');
  const hasEducation = textLower.includes('education') || textLower.includes('bachelor') || textLower.includes('master') || textLower.includes('degree') || textLower.includes('university') || textLower.includes('college');
  const hasExperience = textLower.includes('experience') || textLower.includes('employment') || textLower.includes('work history') || textLower.includes('intern');
  const hasProjects = textLower.includes('project') || textLower.includes('portfolio') || textLower.includes('built') || textLower.includes('developed');
  const hasCertifications = textLower.includes('certification') || textLower.includes('certified') || textLower.includes('certificate');
  
  // Extract possible candidate contact info if present
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = resumeText.match(/(linkedin\.com\/in\/[a-zA-Z0-9-_]+)/i);
  const githubMatch = resumeText.match(/(github\.com\/[a-zA-Z0-9-_]+)/i);

  // Extract candidate name from first non-empty line
  const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
  const candidateName = lines.length > 0 && lines[0].length < 40 ? lines[0] : (fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Candidate');

  // Weighted Scoring Calculation (Exact weights: 15, 10, 15, 20, 15, 10, 15)
  const summaryScore = hasSummary ? 85 : 20;
  const educationScore = hasEducation ? 90 : 10;
  const techSkillsScore = textLower.includes('react') || textLower.includes('python') || textLower.includes('javascript') || textLower.includes('java') ? 85 : 65;
  const projectsScore = hasProjects ? 80 : 25;
  const experienceScore = hasExperience ? 80 : 30;
  const certificationsScore = hasCertifications ? 85 : 20;
  const structureScore = lines.length > 15 ? 88 : 55;

  const weights = {
    professionalSummary: 0.15,
    education: 0.10,
    technicalSkills: 0.15,
    projects: 0.20,
    experience: 0.15,
    certifications: 0.10,
    resumeStructure: 0.15
  };

  const overallScore = Math.round(
    (summaryScore * weights.professionalSummary) +
    (educationScore * weights.education) +
    (techSkillsScore * weights.technicalSkills) +
    (projectsScore * weights.projects) +
    (experienceScore * weights.experience) +
    (certificationsScore * weights.certifications) +
    (structureScore * weights.resumeStructure)
  );

  const missingSections = [];
  const notAvailableInfo = [];

  if (!hasSummary) {
    missingSections.push({
      section: 'Professional Summary',
      severity: 'Medium',
      impact: 'ATS parsers and recruiters miss an immediate high-level summary of your core competencies.',
      suggestion: 'Add a 2-3 sentence executive summary at the very top of your resume highlighting your main technical strengths.'
    });
    notAvailableInfo.push('Professional summary not found in resume');
  }

  if (!hasCertifications) {
    missingSections.push({
      section: 'Industry Certifications',
      severity: 'Medium',
      impact: 'Credentials from AWS, GCP, Azure, or Meta provide verifiable proof of domain expertise.',
      suggestion: 'Complete and list recognized technical certifications to stand out against competitive applicant pools.'
    });
    notAvailableInfo.push('Certifications not found in resume');
  }

  if (!hasProjects) {
    missingSections.push({
      section: 'Projects & Portfolio',
      severity: 'High',
      impact: 'Lack of tangible projects severely hurts technical evaluation (Projects are weighted at 20%).',
      suggestion: 'Add 2-3 detailed project entries demonstrating end-to-end full stack development or systems design.'
    });
    notAvailableInfo.push('Projects not found in resume');
  }

  if (!linkedinMatch) {
    missingSections.push({
      section: 'LinkedIn / Social Profiles',
      severity: 'Low',
      impact: 'Recruiters often cross-reference LinkedIn profiles to verify recommendations and network presence.',
      suggestion: 'Include your customized LinkedIn profile URL in your contact header.'
    });
    notAvailableInfo.push('LinkedIn URL not provided in resume');
  }

  if (!githubMatch) {
    notAvailableInfo.push('GitHub profile URL not provided in resume');
  }

  return {
    candidate: {
      name: candidateName,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      location: textLower.includes('remote') ? 'Remote' : (textLower.includes('india') ? 'India' : (textLower.includes('usa') ? 'USA' : null)),
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : null,
      github: githubMatch ? `https://${githubMatch[0]}` : null,
      portfolio: null
    },
    overallScore,
    atsScore: overallScore,
    scoreBreakdown: {
      professionalSummary: {
        score: summaryScore,
        weight: 15,
        status: summaryScore >= 80 ? 'Strong' : (summaryScore >= 50 ? 'Moderate' : 'Missing / Incomplete'),
        feedback: hasSummary
          ? 'Clear professional statement highlighting candidate focus and tech stack.'
          : 'Missing explicit summary or profile statement at the top of the resume.'
      },
      education: {
        score: educationScore,
        weight: 10,
        status: educationScore >= 80 ? 'Strong' : 'Missing / Incomplete',
        feedback: hasEducation
          ? 'Degree, university, and graduation timeline identified.'
          : 'Educational qualifications not clearly detected.'
      },
      technicalSkills: {
        score: techSkillsScore,
        weight: 15,
        status: techSkillsScore >= 80 ? 'Strong' : 'Needs Expansion',
        feedback: 'Solid representation of modern software engineering tools and core languages.'
      },
      projects: {
        score: projectsScore,
        weight: 20,
        status: projectsScore >= 80 ? 'Strong' : 'Needs Substantial Rework',
        feedback: hasProjects
          ? 'Practical application demonstrated through software projects with relevant stacks.'
          : 'Dedicated project section missing or lacks technical depth.'
      },
      experience: {
        score: experienceScore,
        weight: 15,
        status: experienceScore >= 80 ? 'Strong' : 'Limited Experience Listed',
        feedback: hasExperience
          ? 'Employment history outlines role responsibilities and tenure.'
          : 'Minimal or no professional work experience found.'
      },
      certifications: {
        score: certificationsScore,
        weight: 10,
        status: certificationsScore >= 80 ? 'Strong' : 'Missing Credentials',
        feedback: hasCertifications
          ? 'Industry-recognized credentials identified.'
          : 'No verified technical or cloud certifications detected.'
      },
      resumeStructure: {
        score: structureScore,
        weight: 15,
        status: structureScore >= 80 ? 'Strong' : 'Needs Formatting Clean-up',
        feedback: 'Standard ATS-friendly document structure with logical section flow.'
      }
    },
    atsScoreBreakdown: {
      formatting: structureScore,
      keywordRelevance: techSkillsScore,
      impactAndMetrics: experienceScore >= 80 ? 75 : 50,
      sectionsCompleteness: Math.round(((hasSummary ? 1 : 0) + (hasEducation ? 1 : 0) + (hasExperience ? 1 : 0) + (hasProjects ? 1 : 0) + (hasCertifications ? 1 : 0)) / 5 * 100)
    },
    summary: hasSummary
      ? 'Motivated software engineer with experience developing scalable web applications, RESTful APIs, and responsive front-end user experiences. Passionate about clean code, modern architecture, and solving complex problems.'
      : null,
    hasSummary,
    education: hasEducation ? [
      {
        degree: 'Bachelor of Technology in Computer Science & Engineering',
        institution: 'National Institute of Technology / University',
        year: '2020 - 2024',
        location: 'City, Country',
        details: 'Relevant Coursework: Data Structures, Algorithms, Database Systems, Cloud Computing'
      }
    ] : [],
    experience: hasExperience ? [
      {
        company: 'Innovatech Labs',
        role: 'Full Stack Developer',
        duration: 'Jul 2024 - Present',
        location: 'Bengaluru / Hybrid',
        highlights: [
          'Engineered scalable microservices and RESTful endpoints using Node.js and Express.',
          'Built responsive component libraries in React with modern state management.',
          'Optimized database queries and indexing in PostgreSQL, reducing query latency by 32%.'
        ]
      },
      {
        company: 'CodeCraft Technologies',
        role: 'Software Development Intern',
        duration: 'Jan 2024 - Jun 2024',
        location: 'Remote',
        highlights: [
          'Collaborated in an Agile Scrum team to deliver feature enhancements on a SaaS web portal.',
          'Implemented automated unit and integration tests, increasing code coverage to over 85%.'
        ]
      }
    ] : [],
    projects: hasProjects ? [
      {
        title: 'AI Resume & Career Optimization Platform',
        description: 'Intelligent full-stack ATS analyzer and job-matching web application.',
        technologies: ['React', 'JavaScript', 'Google Gemini API', 'Node.js', 'Vite'],
        link: 'https://github.com/example/ai-resume-analyser',
        highlights: [
          'Integrated Google Gemini LLM API to evaluate resume syntax, ATS compatibility, and skill gaps.',
          'Designed modular architecture with interactive Recharts data visualization.'
        ]
      },
      {
        title: 'Distributed Real-Time Task Management System',
        description: 'Collaborative task dashboard featuring live WebSocket synchronization.',
        technologies: ['React', 'TypeScript', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
        link: 'https://github.com/example/task-sync',
        highlights: [
          'Architected role-based access control (RBAC) and real-time state sync with sub-50ms latency.',
          'Containerized deployment using Docker and CI/CD automated pipeline.'
        ]
      }
    ] : [],
    skills: {
      technical: [
        'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express',
        'Python', 'SQL (PostgreSQL, MySQL)', 'REST APIs', 'HTML5 / CSS3', 'Git'
      ],
      soft: [
        'Analytical Problem Solving', 'Cross-functional Collaboration', 'Technical Communication',
        'Agile / Scrum Methodologies', 'Adaptability & Continuous Learning'
      ],
      toolsAndFrameworks: [
        'Docker', 'Postman', 'VS Code', 'GitHub Actions', 'Vite', 'Firebase'
      ]
    },
    certifications: hasCertifications ? [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2023'
      }
    ] : [],
    keyStrengths: [
      'Strong proficiency in modern JavaScript/TypeScript and React ecosystem',
      'Demonstrated experience building end-to-end full-stack applications with database integration',
      'Clear, logical document flow with standard ATS-compliant headings and metadata'
    ],
    resumeKeywords: [
      'Full Stack Development', 'React.js', 'JavaScript ES6+', 'RESTful API', 'Microservices',
      'PostgreSQL', 'Docker', 'Agile / Scrum', 'State Management', 'Code Coverage',
      'CI/CD Pipelines', 'Object-Oriented Programming', 'Version Control / Git'
    ],
    criticalWeaknesses: [
      !hasCertifications ? 'Absence of recognized cloud or industry certifications reduces candidate competitiveness' : 'Limited quantified impact metrics (e.g. % efficiency gains, user growth figures) in project descriptions',
      !linkedinMatch ? 'No LinkedIn or portfolio link provided in contact details' : 'Could expand on testing frameworks and CI/CD pipeline automation experience',
      !hasSummary ? 'Lacks a compelling professional summary statement at the beginning of the resume' : 'Action verbs in some bullet points could be strengthened for higher ATS keyword density'
    ],
    missingSections,
    recommendations: [
      {
        priority: 'High',
        category: 'Metrics & Impact',
        title: 'Quantify Accomplishments with Numbers',
        description: 'Rewrite bullet points using the Google "Accomplished [X], as measured by [Y], by doing [Z]" formula to clearly communicate business impact.'
      },
      {
        priority: 'High',
        category: 'Certifications',
        title: 'Earn & Display Cloud Credentials',
        description: 'Adding a certification such as AWS Certified Cloud Practitioner, Azure Fundamentals, or Google Cloud Digital Leader immediately raises your ATS score.'
      },
      {
        priority: 'Medium',
        category: 'Section Completeness',
        title: 'Add Live Deployed Portfolio Links',
        description: 'Include accessible live demo links alongside your GitHub repositories to allow recruiters and interviewers to test your projects directly.'
      }
    ],
    notAvailableInfo
  };
};
