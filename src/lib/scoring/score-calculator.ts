import { extractSkillsDetailed, ExtractedSkill } from "../skills/skill-extractor";
import { SKILL_ALIASES } from "../skills/skill-aliases";
import { parseExperience, compareSeniority, SeniorityLevel } from "../experience/experience-parser";
import {
  parseRequirements,
  parseJobDescription,
  ParsedRequirement,
  ParsedJobDescription,
} from "../requirements/requirement-parser";

export type ScoreWeights = {
  requirements: number;
  skills: number;
  experience: number;
  title: number;
  education: number;
  certifications: number;
};

export type ScoreFactor = {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  details: string;
};

export type ScoreBreakdown = {
  totalScore: number;
  factors: ScoreFactor[];
  penalties: Array<{ reason: string; amount: number }>;
  bonuses: Array<{ reason: string; amount: number }>;
  summary: string;
};

export type SkillMatchResult = {
  matched: string[];
  missing: string[];
  extra: string[];
  ratio: number;
};

export type RequirementMatchResult = {
  ratio: number;
  matched: string[];
  missing: string[];
  mustMissingCount: number;
};

const DEFAULT_WEIGHTS: ScoreWeights = {
  requirements: 0.40,
  skills: 0.25,
  experience: 0.15,
  title: 0.08,
  education: 0.07,
  certifications: 0.05,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^\w\s.+/-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  const stopWords = new Set([
    "and", "with", "for", "the", "this", "that", "from", "your", "their", "into",
    "will", "have", "has", "are", "able", "ability", "good", "strong", "experience",
    "years", "year", "plus", "using", "work", "working", "build", "building", "role", "team", "teams",
  ]);
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function getRequirementEvidence(
  requirement: ParsedRequirement,
  resumeText: string,
  resumeSkills: string[]
): { score: number; matchedSkills: string[]; matchedKeywords: string[] } {
  const normalizedResume = normalizeText(resumeText);

  const matchedSkills = requirement.skills.filter((skill) => {
    const aliases = SKILL_ALIASES[skill] ?? [skill];
    return aliases.some((alias) => normalizedResume.includes(alias.toLowerCase()));
  });

  const matchedKeywords = requirement.keywords.filter((keyword) =>
    normalizedResume.includes(keyword)
  );

  const skillCoverage = requirement.skills.length
    ? matchedSkills.length / requirement.skills.length
    : 0;
  const keywordCoverage = requirement.keywords.length
    ? matchedKeywords.length / requirement.keywords.length
    : 0;
  const exactPhraseBonus = normalizedResume.includes(normalizeText(requirement.text)) ? 0.2 : 0;

  const score = clamp(skillCoverage * 0.6 + keywordCoverage * 0.4 + exactPhraseBonus, 0, 1);

  return { score, matchedSkills, matchedKeywords };
}

function scoreRequirements(
  requirements: ParsedRequirement[],
  resumeText: string,
  resumeSkills: string[]
): RequirementMatchResult {
  const scored = requirements.map((requirement) => ({
    requirement,
    evidence: getRequirementEvidence(requirement, resumeText, resumeSkills),
  }));

  const must = scored.filter((item) => item.requirement.priority === "must");
  const preferred = scored.filter((item) => item.requirement.priority === "preferred");
  const general = scored.filter((item) => item.requirement.priority === "general");

  const average = (items: typeof scored, fallback = 0.45) =>
    items.length ? items.reduce((sum, item) => sum + item.evidence.score, 0) / items.length : fallback;

  const overallRatio =
    average(must, 0.5) * 0.55 + average(general, 0.5) * 0.3 + average(preferred, 0.45) * 0.15;

  const matched = scored
    .filter((item) => item.evidence.score >= 0.55)
    .sort((a, b) => b.evidence.score - a.evidence.score)
    .slice(0, 6)
    .map((item) => item.requirement.text);

  const missing = scored
    .filter((item) => item.evidence.score < 0.4)
    .sort((a, b) => {
      const priorityWeight = { must: 0, general: 1, preferred: 2 };
      return (
        priorityWeight[a.requirement.priority] - priorityWeight[b.requirement.priority] ||
        a.evidence.score - b.evidence.score
      );
    })
    .slice(0, 6)
    .map((item) => item.requirement.text);

  return {
    ratio: overallRatio,
    matched,
    missing,
    mustMissingCount: must.filter((item) => item.evidence.score < 0.4).length,
  };
}

function scoreSkills(jdSkills: string[], resumeSkills: string[]): SkillMatchResult {
  const matched = jdSkills.filter((skill) => resumeSkills.includes(skill));
  const missing = jdSkills.filter((skill) => !resumeSkills.includes(skill));
  const extra = resumeSkills.filter((skill) => !jdSkills.includes(skill));

  return {
    matched,
    missing,
    extra,
    ratio: jdSkills.length ? matched.length / jdSkills.length : 0.5,
  };
}

function scoreExperience(
  jd: ParsedJobDescription,
  resumeYears: number | null,
  resumeSeniority: SeniorityLevel
): { ratio: number; details: string } {
  const requiredYears = jd.yearsRequired ?? 0;
  const candidateYears = resumeYears ?? 0;

  let yearsRatio = 0.5;
  if (requiredYears > 0) {
    yearsRatio = clamp(candidateYears / requiredYears, 0, 1.15);
  } else if (candidateYears > 0) {
    yearsRatio = 0.7;
  }

  // Seniority comparison bonus/penalty
  const seniorityDiff = compareSeniority(resumeSeniority, jd.inferredSeniority);
  let seniorityAdjust = 0;
  if (seniorityDiff >= 0) {
    seniorityAdjust = 0.1; // Candidate meets or exceeds seniority
  } else if (seniorityDiff >= -1) {
    seniorityAdjust = 0; // Slightly below
  } else {
    seniorityAdjust = -0.1; // Significantly below
  }

  const ratio = clamp(yearsRatio + seniorityAdjust, 0, 1);
  const details = `${candidateYears} years (required: ${requiredYears || "N/A"}), seniority: ${resumeSeniority}`;

  return { ratio, details };
}

function scoreTitleAlignment(jdTitle: string | null, resumeText: string): number {
  if (!jdTitle) return 0.5;

  const titleTokens = tokenize(jdTitle).slice(0, 5);
  if (!titleTokens.length) return 0.5;

  const resumeNormalized = normalizeText(resumeText);
  const hits = titleTokens.filter((token) => resumeNormalized.includes(token)).length;
  return hits / titleTokens.length;
}

function scoreEducation(jd: ParsedJobDescription, resumeText: string): number {
  if (!jd.education) return 0.6; // No education requirement, give moderate score

  const normalizedResume = normalizeText(resumeText);
  const educationLevels = ["high-school", "associate", "bachelor", "master", "phd"] as const;
  const levelRank = { "high-school": 1, associate: 2, bachelor: 3, master: 4, phd: 5, any: 0 };

  // Check if candidate has the required level
  const requiredRank = levelRank[jd.education.level];
  let candidateRank = 0;

  for (const level of educationLevels) {
    const patterns: Record<string, RegExp[]> = {
      "high-school": [/high school|ged|diploma/i],
      associate: [/associate'?s?|a\.?s\.?/i],
      bachelor: [/bachelor'?s?|b\.?s\.?|b\.?a\.?|undergraduate/i],
      master: [/master'?s?|m\.?s\.?|m\.?a\.?|mba/i],
      phd: [/ph\.?d\.?|doctorate/i],
    };

    if (patterns[level]?.some((p) => p.test(normalizedResume))) {
      candidateRank = Math.max(candidateRank, levelRank[level]);
    }
  }

  if (candidateRank >= requiredRank) {
    return 1.0;
  } else if (candidateRank === requiredRank - 1) {
    return jd.education.required ? 0.6 : 0.8;
  } else {
    return jd.education.required ? 0.3 : 0.5;
  }
}

function scoreCertifications(jdCerts: string[], resumeText: string): number {
  if (jdCerts.length === 0) return 0.6;

  const normalizedResume = normalizeText(resumeText);
  const matched = jdCerts.filter((cert) => normalizedResume.includes(cert));

  return jdCerts.length ? matched.length / jdCerts.length : 0.6;
}

export function calculateScore(
  jobDescription: string,
  resumeText: string,
  weights: Partial<ScoreWeights> = {}
): ScoreBreakdown {
  const finalWeights = { ...DEFAULT_WEIGHTS, ...weights };

  // Parse inputs
  const jd = parseJobDescription(jobDescription);
  const requirements = parseRequirements(jobDescription);
  const resumeSkillsDetailed = extractSkillsDetailed(resumeText);
  const resumeSkills = resumeSkillsDetailed.map((s) => s.canonical);
  const jdSkills = extractSkillsDetailed(jobDescription).map((s) => s.canonical);
  const experience = parseExperience(resumeText);

  // Calculate individual scores
  const requirementScore = scoreRequirements(requirements, resumeText, resumeSkills);
  const skillScore = scoreSkills(jdSkills, resumeSkills);
  const experienceScore = scoreExperience(jd, experience.totalYears, experience.seniority);
  const titleScore = scoreTitleAlignment(jd.title, resumeText);
  const educationScore = scoreEducation(jd, resumeText);
  const certScore = scoreCertifications(jd.certifications, resumeText);

  // Build factors
  const factors: ScoreFactor[] = [
    {
      name: "Requirements",
      score: requirementScore.ratio,
      weight: finalWeights.requirements,
      contribution: requirementScore.ratio * finalWeights.requirements * 100,
      details: `${requirementScore.matched.length} matched, ${requirementScore.missing.length} missing`,
    },
    {
      name: "Skills",
      score: skillScore.ratio,
      weight: finalWeights.skills,
      contribution: skillScore.ratio * finalWeights.skills * 100,
      details: `${skillScore.matched.length}/${jdSkills.length} required skills`,
    },
    {
      name: "Experience",
      score: experienceScore.ratio,
      weight: finalWeights.experience,
      contribution: experienceScore.ratio * finalWeights.experience * 100,
      details: experienceScore.details,
    },
    {
      name: "Title Alignment",
      score: titleScore,
      weight: finalWeights.title,
      contribution: titleScore * finalWeights.title * 100,
      details: titleScore >= 0.66 ? "Good alignment" : titleScore >= 0.34 ? "Partial" : "Weak",
    },
    {
      name: "Education",
      score: educationScore,
      weight: finalWeights.education,
      contribution: educationScore * finalWeights.education * 100,
      details: jd.education ? `Required: ${jd.education.level}` : "No requirement",
    },
    {
      name: "Certifications",
      score: certScore,
      weight: finalWeights.certifications,
      contribution: certScore * finalWeights.certifications * 100,
      details: jd.certifications.length ? `${jd.certifications.length} required` : "None required",
    },
  ];

  // Calculate base score
  const baseScore = factors.reduce((sum, f) => sum + f.contribution, 0);

  // Penalties (reduced for better accuracy)
  const penalties: Array<{ reason: string; amount: number }> = [];
  if (requirementScore.mustMissingCount > 2) {
    const penalty = (requirementScore.mustMissingCount - 2) * 3;
    penalties.push({ reason: `${requirementScore.mustMissingCount} must-have requirements missing`, amount: penalty });
  }
  if (skillScore.missing.length > 4) {
    const penalty = (skillScore.missing.length - 4) * 1.5;
    penalties.push({ reason: `${skillScore.missing.length} required skills missing`, amount: penalty });
  }

  // Bonuses
  const bonuses: Array<{ reason: string; amount: number }> = [];
  if (skillScore.extra.length > 3) {
    bonuses.push({ reason: "Has additional relevant skills", amount: 2 });
  }
  if (experience.progression === "ascending") {
    bonuses.push({ reason: "Shows career progression", amount: 2 });
  }

  const totalPenalty = penalties.reduce((sum, p) => sum + p.amount, 0);
  const totalBonus = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const totalScore = Math.round(clamp(baseScore - totalPenalty + totalBonus, 0, 100));

  // Generate summary
  let summary: string;
  if (totalScore >= 85) {
    summary = "Strong fit with clear evidence across must-have requirements.";
  } else if (totalScore >= 70) {
    summary = "Good fit overall, with some gaps that should be reviewed.";
  } else if (totalScore >= 55) {
    summary = "Partial fit. The resume covers some requirements but leaves important gaps.";
  } else {
    summary = "Weak fit based on the current resume evidence.";
  }

  return {
    totalScore,
    factors,
    penalties,
    bonuses,
    summary,
  };
}

export function getScoreLabel(score: number): "excellent" | "good" | "fair" | "weak" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "fair";
  return "weak";
}

export { DEFAULT_WEIGHTS };
