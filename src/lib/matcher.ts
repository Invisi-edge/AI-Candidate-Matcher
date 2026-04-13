import { HeuristicCandidateAnalysis, RedFlag, InterviewQuestion, MLPrediction } from "@/lib/types";
import { extractSkills, extractSkillsDetailed } from "./skills/skill-extractor";
import { SKILL_ALIASES } from "./skills/skill-aliases";
import { parseExperience } from "./experience/experience-parser";
import { parseRequirements, parseJobDescription } from "./requirements/requirement-parser";
import { calculateScore, getScoreLabel } from "./scoring/score-calculator";
import { analyzeRedFlags } from "./analysis/red-flags";
import { generateInterviewQuestions } from "./analysis/interview-questions";
import { computeMLPrediction } from "./analysis/ml-scoring";

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^\w\s.+/-]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreSkills(jobDescription: string, resumeText: string) {
  const requiredSkills = extractSkills(jobDescription);
  const candidateSkills = extractSkills(resumeText);
  const matched = requiredSkills.filter((skill) => candidateSkills.includes(skill));
  const missing = requiredSkills.filter((skill) => !candidateSkills.includes(skill));

  return {
    matched,
    missing,
    candidateSkills,
    ratio: requiredSkills.length ? matched.length / requiredSkills.length : 0.5,
  };
}

function getRequirementEvidence(
  requirement: { text: string; skills: string[]; keywords: string[] },
  resumeText: string
) {
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

  return {
    score: Math.min(1, skillCoverage * 0.6 + keywordCoverage * 0.4 + exactPhraseBonus),
    matchedSkills,
    matchedKeywords,
  };
}

function scoreRequirements(jobDescription: string, resumeText: string) {
  const requirements = parseRequirements(jobDescription);
  const scored = requirements.map((requirement) => ({
    requirement,
    evidence: getRequirementEvidence(requirement, resumeText),
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

function scoreTitleAlignment(jobDescription: string, resumeText: string): number {
  const jd = parseJobDescription(jobDescription);
  if (!jd.title) return 0.5;

  const stopWords = new Set([
    "and", "with", "for", "the", "this", "that", "from", "your", "their",
  ]);
  const titleTokens = normalizeText(jd.title)
    .split(" ")
    .filter((t) => t.length > 2 && !stopWords.has(t))
    .slice(0, 5);

  if (!titleTokens.length) return 0.5;

  const resumeNormalized = normalizeText(resumeText);
  const hits = titleTokens.filter((token) => resumeNormalized.includes(token)).length;
  return hits / titleTokens.length;
}

export function runHeuristicAnalysis(
  jobDescription: string,
  resumeText: string
): HeuristicCandidateAnalysis {
  const requirementScore = scoreRequirements(jobDescription, resumeText);
  const skillsScore = scoreSkills(jobDescription, resumeText);
  const experience = parseExperience(resumeText);
  const titleScore = scoreTitleAlignment(jobDescription, resumeText);

  // Use new scoring calculator
  const scoreBreakdown = calculateScore(jobDescription, resumeText);
  const score = scoreBreakdown.totalScore;

  const strengths = unique(
    [
      requirementScore.matched.length
        ? `Evidence found for ${requirementScore.matched.length} job requirements`
        : "",
      skillsScore.matched.length
        ? `Matched core skills: ${skillsScore.matched.slice(0, 4).join(", ")}`
        : "",
      experience.totalYears
        ? `Resume shows up to ${experience.totalYears} years of experience`
        : "",
      titleScore >= 0.66 ? "Previous role titles appear aligned with the target role" : "",
      experience.progression === "ascending" ? "Shows clear career progression" : "",
    ].filter(Boolean)
  );

  const concerns = unique(
    [
      requirementScore.mustMissingCount
        ? `${requirementScore.mustMissingCount} must-have requirements are weak or missing`
        : "",
      skillsScore.missing.length
        ? `Missing or unclear skills: ${skillsScore.missing.slice(0, 4).join(", ")}`
        : "",
      experience.totalYears !== null && experience.totalYears < 2
        ? "Limited professional experience detected"
        : "",
      titleScore < 0.34 ? "Previous role titles do not strongly align with the target role" : "",
    ].filter(Boolean)
  );

  // Analyze red flags
  const redFlagAnalysis = analyzeRedFlags(resumeText, jobDescription);

  // Generate interview questions
  const jd = parseJobDescription(jobDescription);
  // Extract key technical skills from JD for targeted questions
  const jdRequiredSkills = extractSkills(jobDescription);
  const interviewQs = generateInterviewQuestions(
    skillsScore.matched,
    skillsScore.missing,
    redFlagAnalysis.flags,
    jd.title || "this position",
    jdRequiredSkills.slice(0, 8) // Pass top 8 JD-required skills
  );

  // ML-based prediction
  const mlPrediction = computeMLPrediction(
    resumeText,
    jobDescription,
    skillsScore.matched,
    skillsScore.missing,
    experience.totalYears,
    redFlagAnalysis.flags.length
  );

  // Combine heuristic and ML scores (weighted average)
  const finalScore = Math.round(score * 0.4 + mlPrediction.score * 0.6);

  return {
    score: finalScore,
    matchedRequirements: unique([
      ...skillsScore.matched.map((item) => `Skill match: ${item}`),
      ...requirementScore.matched,
    ]).slice(0, 6),
    missingRequirements: unique([
      ...skillsScore.missing.map((item) => `Missing skill: ${item}`),
      ...requirementScore.missing,
    ]).slice(0, 6),
    strengths: strengths.slice(0, 4),
    concerns: concerns.slice(0, 4),
    extractedSkills: skillsScore.candidateSkills.slice(0, 14),
    experienceSignals: experience.experienceSignals.slice(0, 6),
    summary: scoreBreakdown.summary,
    redFlags: redFlagAnalysis.flags,
    riskScore: redFlagAnalysis.riskScore,
    interviewQuestions: interviewQs.questions,
    mlPrediction: {
      score: mlPrediction.score,
      confidence: mlPrediction.confidence,
      recommendation: mlPrediction.recommendation,
      topPositiveFactors: mlPrediction.topPositiveFactors,
      topNegativeFactors: mlPrediction.topNegativeFactors,
    },
  };
}
