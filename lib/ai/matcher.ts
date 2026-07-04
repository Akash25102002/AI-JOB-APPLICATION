import { ParsedResume } from "./parser";

export interface MatchResult {
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  skillGap: string[];
  missingTechnologies: string[];
  suggestions: string[];
}

/**
 * Matches a parsed resume against a job description.
 * Utilizes the Gemini API if a key is available, else runs a high-fidelity local keyword intersection matrix.
 */
export async function matchJob(
  resume: ParsedResume,
  jobTitle: string,
  jobDescription: string,
  apiKey?: string
): Promise<MatchResult> {
  const activeKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (activeKey) {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + activeKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Compare the candidate resume details with the Job Title and Job Description below. 
Generate a comprehensive job fit analysis returning a strict JSON object with this exact shape:
{
  "matchPercentage": 85, // number from 0 to 100
  "strengths": ["Strong Node.js background", "Experience in high-throughput APIs"],
  "weaknesses": ["No experience in cloud migration", "Lacks Rust knowledge mentioned in nice-to-haves"],
  "skillGap": ["Rust", "Kubernetes", "AWS EKS"],
  "missingTechnologies": ["Rust", "Docker Swarm"],
  "suggestions": ["Add the Docker project to your main summary", "Highlight any cloud scaling experience"]
}

Candidate Resume:
${JSON.stringify(resume, null, 2)}

Job Title: ${jobTitle}
Job Description:
${jobDescription}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text) as MatchResult;
        }
      }
    } catch (e) {
      console.warn("AI Job Matching failed, falling back to local matcher", e);
    }
  }

  // Fallback to local heuristic matching
  return localMatch(resume, jobTitle, jobDescription);
}

/**
 * Heuristic fallback matching using skill intersection, keyword extraction, and title overlap.
 */
function localMatch(resume: ParsedResume, jobTitle: string, jobDescription: string): MatchResult {
  const jdLower = jobDescription.toLowerCase();
  const titleLower = jobTitle.toLowerCase();
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const skillGap: string[] = [];
  const missingTechnologies: string[] = [];
  const suggestions: string[] = [];

  // 1. Title Overlap
  const resumeRoles = resume.experience.map(e => e.role.toLowerCase());
  const hasTitleMatch = resumeRoles.some(role => {
    const roleWords = role.split(/\s+/);
    const titleWords = titleLower.split(/\s+/);
    return roleWords.some(w => w.length > 3 && titleWords.includes(w));
  });

  if (hasTitleMatch) {
    strengths.push(`Direct or highly related historical titles matching "${jobTitle}"`);
  } else {
    weaknesses.push(`Your past job titles do not explicitly contain keywords found in "${jobTitle}"`);
    suggestions.push(`Consider updating your target profile title to align more with "${jobTitle}"`);
  }

  // 2. Skill overlap
  const resumeSkills = resume.skills.map(s => s.toLowerCase());
  
  // Scan for common technologies in the JD
  const commonTechList = [
    "javascript", "typescript", "react", "next.js", "node.js", "express", "python",
    "django", "postgresql", "mongodb", "sql", "git", "docker", "aws", "tailwind",
    "prisma", "redis", "graphql", "kubernetes", "clerk", "stripe", "rust", "go",
    "gcp", "azure", "docker", "terraform", "sentry", "jest", "playwright", "vitest"
  ];

  const jdTechs = commonTechList.filter(tech => jdLower.includes(tech));
  const matchedTechs: string[] = [];
  const missingTechs: string[] = [];

  jdTechs.forEach(tech => {
    // Check if user has this skill in skills list or raw resume text
    const hasSkill = resumeSkills.some(s => s.includes(tech)) || 
                     resume.summary.toLowerCase().includes(tech) ||
                     resume.experience.some(exp => exp.description.toLowerCase().includes(tech) || exp.bulletPoints.some(b => b.toLowerCase().includes(tech)));
    
    if (hasSkill) {
      matchedTechs.push(tech);
    } else {
      missingTechs.push(tech);
    }
  });

  // Calculate score
  let score = 50; // baseline
  if (hasTitleMatch) score += 15;
  
  if (jdTechs.length > 0) {
    const techMatchRatio = matchedTechs.length / jdTechs.length;
    score += Math.round(techMatchRatio * 30);
  } else {
    score += 20; // default for thin JDs
  }

  // Clamp score
  score = Math.min(100, Math.max(0, score));

  // Populate strengths/weaknesses
  matchedTechs.slice(0, 3).forEach(tech => {
    const formatted = tech.toUpperCase();
    strengths.push(`Demonstrated hands-on experience with ${formatted}`);
  });

  missingTechs.slice(0, 3).forEach(tech => {
    const formatted = tech.toUpperCase();
    skillGap.push(formatted);
    missingTechnologies.push(formatted);
    weaknesses.push(`Missing explicit mention of ${formatted} in your profile history`);
    suggestions.push(`Integrate keywords for "${formatted}" within your project descriptions or skills panel.`);
  });

  if (resume.experience.length >= 2) {
    strengths.push("Solid career progression showing multi-year experience");
  } else {
    weaknesses.push("Relatively brief or single-employer professional footprint");
    suggestions.push("Expand on project logs or open source work to demonstrate tenure");
  }

  // default recommendations
  if (suggestions.length === 0) {
    suggestions.push("Tailor the summary section to mirror the core challenges of this posting.");
  }

  return {
    matchPercentage: score,
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : ["No glaring mismatches detected"],
    skillGap: skillGap.length > 0 ? skillGap : ["None"],
    missingTechnologies: missingTechnologies.length > 0 ? missingTechnologies : ["None"],
    suggestions
  };
}
