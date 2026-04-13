import { extractSkills } from "../skills/skill-extractor";
import { detectSeniorityFromTitle, SeniorityLevel } from "../experience/experience-parser";

export type RequirementPriority = "must" | "preferred" | "general";

export type RequirementCategory =
  | "technical"
  | "experience"
  | "education"
  | "soft-skill"
  | "certification"
  | "other";

export type ParsedRequirement = {
  text: string;
  priority: RequirementPriority;
  category: RequirementCategory;
  keywords: string[];
  skills: string[];
};

export type JDSection = {
  type: "requirements" | "responsibilities" | "benefits" | "about" | "other";
  content: string;
  startLine: number;
};

export type EducationRequirement = {
  level: "high-school" | "associate" | "bachelor" | "master" | "phd" | "any";
  fields: string[];
  required: boolean;
};

export type ParsedJobDescription = {
  title: string | null;
  inferredSeniority: SeniorityLevel;
  sections: JDSection[];
  requirements: ParsedRequirement[];
  education: EducationRequirement | null;
  certifications: string[];
  yearsRequired: number | null;
};

const SECTION_HEADERS: Record<JDSection["type"], RegExp[]> = {
  requirements: [
    /^(?:requirements?|qualifications?|what (?:you|we)'(?:ll|re) (?:need|looking for)|must have|skills?\s*(?:&|and)?\s*experience)/i,
  ],
  responsibilities: [
    /^(?:responsibilities?|what you'(?:ll|re) do(?:ing)?|role|duties|the job)/i,
  ],
  benefits: [
    /^(?:benefits?|perks?|what we offer|compensation|why (?:join|work))/i,
  ],
  about: [
    /^(?:about (?:us|the (?:company|team|role))|who we are|our (?:company|team|mission))/i,
  ],
  other: [],
};

const STOP_WORDS = new Set([
  "and", "with", "for", "the", "this", "that", "from", "your", "their", "into",
  "will", "have", "has", "are", "able", "ability", "good", "strong", "experience",
  "years", "year", "plus", "using", "work", "working", "build", "building", "role", "team", "teams",
]);

const EDUCATION_PATTERNS: Array<{ level: EducationRequirement["level"]; pattern: RegExp }> = [
  { level: "phd", pattern: /\b(ph\.?d\.?|doctorate|doctoral)\b/i },
  { level: "master", pattern: /\b(master'?s?|m\.?s\.?|m\.?a\.?|mba|graduate degree)\b/i },
  { level: "bachelor", pattern: /\b(bachelor'?s?|b\.?s\.?|b\.?a\.?|undergraduate|4[- ]year degree)\b/i },
  { level: "associate", pattern: /\b(associate'?s?|a\.?s\.?|2[- ]year degree)\b/i },
  { level: "high-school", pattern: /\b(high school|ged|diploma)\b/i },
];

const EDUCATION_FIELDS = [
  "computer science", "software engineering", "information technology", "data science",
  "mathematics", "statistics", "physics", "engineering", "business", "economics",
  "design", "marketing", "communications", "psychology", "finance", "accounting",
];

const CERTIFICATION_PATTERNS = [
  /\b(aws certified|azure certified|gcp certified|google cloud certified)\b/i,
  /\b(pmp|csm|scrum master|agile certified)\b/i,
  /\b(cissp|ceh|comptia|ccna|ccnp)\b/i,
  /\b(cka|ckad|kubernetes certified)\b/i,
  /\b(terraform certified|hashicorp certified)\b/i,
  /\bcertified\s+\w+\s*(?:professional|engineer|developer|architect)\b/i,
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^\w\s.+/-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function inferPriority(line: string): RequirementPriority {
  const lower = line.toLowerCase();

  if (/(must|required|mandatory|need to|needs to|strong experience|hands-on|required:)/.test(lower)) {
    return "must";
  }

  if (/(plus|nice to have|preferred|bonus|exposure to|familiarity with|ideally|advantageous)/.test(lower)) {
    return "preferred";
  }

  return "general";
}

function inferCategory(line: string, skills: string[]): RequirementCategory {
  const lower = line.toLowerCase();

  // Check for education
  if (EDUCATION_PATTERNS.some(({ pattern }) => pattern.test(lower))) {
    return "education";
  }

  // Check for certification
  if (CERTIFICATION_PATTERNS.some((pattern) => pattern.test(lower))) {
    return "certification";
  }

  // Check for experience years
  if (/\d+\+?\s*(?:years?|yrs?)\s*(?:of\s+)?experience/i.test(lower)) {
    return "experience";
  }

  // Check for soft skills
  const softSkillKeywords = [
    "communication", "leadership", "teamwork", "collaboration", "presentation",
    "problem solving", "analytical", "interpersonal", "self-motivated", "attention to detail",
  ];
  if (softSkillKeywords.some((keyword) => lower.includes(keyword))) {
    return "soft-skill";
  }

  // If has technical skills, it's technical
  if (skills.length > 0) {
    return "technical";
  }

  return "other";
}

function detectSections(text: string): JDSection[] {
  const lines = text.split(/\n/);
  const sections: JDSection[] = [];
  let currentSection: JDSection | null = null;
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if this line is a section header
    let detectedType: JDSection["type"] | null = null;
    for (const [type, patterns] of Object.entries(SECTION_HEADERS)) {
      if (patterns.some((pattern) => pattern.test(line))) {
        detectedType = type as JDSection["type"];
        break;
      }
    }

    if (detectedType) {
      // Save previous section
      if (currentSection && contentLines.length > 0) {
        currentSection.content = contentLines.join("\n");
        sections.push(currentSection);
      }

      // Start new section
      currentSection = { type: detectedType, content: "", startLine: i };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(line);
    } else {
      // Content before any section header - treat as "about" or first section
      if (!currentSection) {
        currentSection = { type: "about", content: "", startLine: 0 };
      }
      contentLines.push(line);
    }
  }

  // Don't forget the last section
  if (currentSection && contentLines.length > 0) {
    currentSection.content = contentLines.join("\n");
    sections.push(currentSection);
  }

  return sections;
}

function extractEducationRequirement(text: string): EducationRequirement | null {
  const lower = text.toLowerCase();

  let detectedLevel: EducationRequirement["level"] = "any";
  let isRequired = false;

  for (const { level, pattern } of EDUCATION_PATTERNS) {
    if (pattern.test(lower)) {
      detectedLevel = level;
      // Check if it's required or preferred
      const match = lower.match(new RegExp(`(required|must have|mandatory).*${pattern.source}|${pattern.source}.*(required|must|mandatory)`, "i"));
      isRequired = !!match;
      break;
    }
  }

  if (detectedLevel === "any") return null;

  const fields = EDUCATION_FIELDS.filter((field) => lower.includes(field));

  return {
    level: detectedLevel,
    fields,
    required: isRequired,
  };
}

function extractCertifications(text: string): string[] {
  const certs: string[] = [];
  for (const pattern of CERTIFICATION_PATTERNS) {
    const matches = text.match(new RegExp(pattern, "gi"));
    if (matches) {
      certs.push(...matches.map((m) => m.toLowerCase()));
    }
  }
  return unique(certs);
}

function extractYearsRequired(text: string): number | null {
  // Look for "X+ years" or "X years of experience"
  const match = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|in)/i);
  return match ? parseInt(match[1], 10) : null;
}

function extractTitle(text: string): string | null {
  const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
  // First non-empty line is usually the title
  if (lines.length > 0) {
    const firstLine = lines[0];
    // Skip if it looks like a section header
    const isHeader = Object.values(SECTION_HEADERS).flat().some((pattern) => pattern.test(firstLine));
    if (!isHeader && firstLine.length < 100) {
      return firstLine;
    }
  }
  return null;
}

export function parseRequirements(jobDescription: string): ParsedRequirement[] {
  const lines = jobDescription
    .split(/\n|;/)
    .map((line) => line.trim().replace(/^[-*•]\s*/, ""))
    .filter((line) => line.length > 15);

  return lines
    .filter((line) => !/^(requirements|responsibilities|job description)[:]?$/i.test(line))
    .map((line) => {
      const skills = extractSkills(line);
      return {
        text: line,
        priority: inferPriority(line),
        category: inferCategory(line, skills),
        keywords: unique(tokenize(line)).slice(0, 8),
        skills,
      };
    })
    .filter((item) => item.keywords.length > 0 || item.skills.length > 0);
}

export function parseJobDescription(text: string): ParsedJobDescription {
  const title = extractTitle(text);
  const sections = detectSections(text);
  const requirements = parseRequirements(text);
  const education = extractEducationRequirement(text);
  const certifications = extractCertifications(text);
  const yearsRequired = extractYearsRequired(text);

  // Infer seniority from title
  const inferredSeniority = title ? detectSeniorityFromTitle(title) : "unknown";

  return {
    title,
    inferredSeniority,
    sections,
    requirements,
    education,
    certifications,
    yearsRequired,
  };
}

export function getRequirementsByPriority(
  requirements: ParsedRequirement[],
  priority: RequirementPriority
): ParsedRequirement[] {
  return requirements.filter((r) => r.priority === priority);
}

export function getRequirementsByCategory(
  requirements: ParsedRequirement[],
  category: RequirementCategory
): ParsedRequirement[] {
  return requirements.filter((r) => r.category === category);
}

export function getTechnicalRequirements(requirements: ParsedRequirement[]): ParsedRequirement[] {
  return requirements.filter((r) => r.category === "technical" || r.skills.length > 0);
}
