import { SKILL_DEFINITIONS, getCanonicalSkill, SkillCategory, getSkillCategory } from "./skill-aliases";

export type SkillConfidence = "high" | "medium" | "low";

export type ExtractedSkill = {
  canonical: string;
  category: SkillCategory;
  confidence: SkillConfidence;
  yearsOfExperience: number | null;
  context: string;
};

type ExperiencePattern = {
  pattern: RegExp;
  extractYears: (match: RegExpMatchArray) => number;
};

const EXPERIENCE_PATTERNS: ExperiencePattern[] = [
  // "5+ years of Python" or "5 years of experience with React"
  {
    pattern: /(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience\s+(?:with|in|using))?\s*(\w[\w\s.+#/-]*)/gi,
    extractYears: (match) => parseInt(match[1], 10),
  },
  // "Python (5 years)" or "React (3+ years)"
  {
    pattern: /(\w[\w\s.+#/-]*)\s*\(\s*(\d{1,2})\+?\s*(?:years?|yrs?)\s*\)/gi,
    extractYears: (match) => parseInt(match[2], 10),
  },
  // "Expert in React" or "Advanced Python"
  {
    pattern: /(?:expert|advanced|senior|proficient|strong)\s+(?:in\s+|level\s+)?(\w[\w\s.+#/-]*)/gi,
    extractYears: () => 0, // Mark as expert but unknown years
  },
];

const CONFIDENCE_BOOSTERS: RegExp[] = [
  /(?:expert|advanced|senior|proficient|strong|extensive|deep|solid)\s+(?:in|with|knowledge|experience)/i,
  /\d+\+?\s*(?:years?|yrs?)/i,
  /certified/i,
  /lead|architect|principal/i,
];

const CONFIDENCE_REDUCERS: RegExp[] = [
  /(?:basic|beginner|entry|junior|learning|familiar|exposure|some)/i,
  /(?:interested|curious|want to learn)/i,
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s.+#/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fuzzyMatch(text: string, term: string): boolean {
  // Direct match
  if (text.includes(term)) return true;

  // Handle common variations
  const variations = [
    term,
    term.replace(/\./g, ""),      // "node.js" -> "nodejs"
    term.replace(/\./g, " "),     // "node.js" -> "node js"
    term.replace(/-/g, " "),      // "react-native" -> "react native"
    term.replace(/ /g, ""),       // "node js" -> "nodejs"
  ];

  return variations.some((v) => text.includes(v));
}

function extractContext(text: string, position: number, windowSize = 50): string {
  const start = Math.max(0, position - windowSize);
  const end = Math.min(text.length, position + windowSize);
  return text.slice(start, end).trim();
}

function determineConfidence(context: string): SkillConfidence {
  const hasBooster = CONFIDENCE_BOOSTERS.some((pattern) => pattern.test(context));
  const hasReducer = CONFIDENCE_REDUCERS.some((pattern) => pattern.test(context));

  if (hasBooster && !hasReducer) return "high";
  if (hasReducer && !hasBooster) return "low";
  return "medium";
}

function extractYearsFromContext(context: string): number | null {
  for (const { pattern, extractYears } of EXPERIENCE_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(context);
    if (match) {
      const years = extractYears(match);
      if (years > 0) return years;
    }
  }
  return null;
}

export function extractSkillsDetailed(text: string): ExtractedSkill[] {
  const normalizedText = normalizeText(text);
  const foundSkills = new Map<string, ExtractedSkill>();

  for (const skillDef of SKILL_DEFINITIONS) {
    for (const alias of skillDef.aliases) {
      const aliasLower = alias.toLowerCase();

      // Use fuzzy matching for better detection
      if (!fuzzyMatch(normalizedText, aliasLower)) continue;

      let position = normalizedText.indexOf(aliasLower);
      if (position === -1) {
        // Try without dots/dashes
        const cleanAlias = aliasLower.replace(/[.-]/g, "");
        position = normalizedText.indexOf(cleanAlias);
      }

      while (position !== -1) {
        // Ensure it's a word boundary match
        const before = position > 0 ? normalizedText[position - 1] : " ";
        const after = position + aliasLower.length < normalizedText.length
          ? normalizedText[position + aliasLower.length]
          : " ";

        const isWordBoundary = /[\s.+#/-]/.test(before) || position === 0;
        const isWordEnd = /[\s.+#/-]/.test(after) || position + aliasLower.length === normalizedText.length;

        if (isWordBoundary && isWordEnd) {
          const context = extractContext(text, position, 80);
          const existing = foundSkills.get(skillDef.canonical);

          const confidence = determineConfidence(context);
          const years = extractYearsFromContext(context);

          // Keep the entry with highest confidence or most years
          if (
            !existing ||
            confidence === "high" ||
            (years && (!existing.yearsOfExperience || years > existing.yearsOfExperience))
          ) {
            foundSkills.set(skillDef.canonical, {
              canonical: skillDef.canonical,
              category: skillDef.category,
              confidence,
              yearsOfExperience: years ?? existing?.yearsOfExperience ?? null,
              context: context.slice(0, 100),
            });
          }
        }

        position = normalizedText.indexOf(aliasLower, position + 1);
      }
    }
  }

  return Array.from(foundSkills.values()).sort((a, b) => {
    // Sort by confidence (high > medium > low), then by years
    const confidenceOrder = { high: 0, medium: 1, low: 2 };
    const confDiff = confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    if (confDiff !== 0) return confDiff;

    const yearsA = a.yearsOfExperience ?? 0;
    const yearsB = b.yearsOfExperience ?? 0;
    return yearsB - yearsA;
  });
}

// Backward-compatible simple extraction
export function extractSkills(text: string): string[] {
  return extractSkillsDetailed(text).map((skill) => skill.canonical);
}

export function extractSkillsByCategory(text: string): Record<SkillCategory, string[]> {
  const skills = extractSkillsDetailed(text);
  const result: Record<SkillCategory, string[]> = {
    frontend: [],
    backend: [],
    database: [],
    cloud: [],
    devops: [],
    "data-science": [],
    mobile: [],
    design: [],
    "soft-skill": [],
    certification: [],
    language: [],
    testing: [],
    security: [],
    other: [],
  };

  for (const skill of skills) {
    result[skill.category].push(skill.canonical);
  }

  return result;
}

export function getSkillsWithExperience(text: string): Array<{ skill: string; years: number }> {
  return extractSkillsDetailed(text)
    .filter((s) => s.yearsOfExperience !== null && s.yearsOfExperience > 0)
    .map((s) => ({ skill: s.canonical, years: s.yearsOfExperience! }));
}

export function getHighConfidenceSkills(text: string): string[] {
  return extractSkillsDetailed(text)
    .filter((s) => s.confidence === "high")
    .map((s) => s.canonical);
}
