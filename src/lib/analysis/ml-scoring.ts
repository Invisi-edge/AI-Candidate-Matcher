/**
 * ML-Like Scoring System
 *
 * This module provides advanced scoring using:
 * 1. Feature extraction from resumes
 * 2. Weighted feature scoring
 * 3. Confidence intervals
 * 4. Historical pattern matching
 */

export type MLFeatures = {
  // Experience features
  totalYearsExperience: number;
  relevantYearsExperience: number;
  numberOfRoles: number;
  averageTenure: number;
  currentlyEmployed: boolean;

  // Skills features
  skillMatchRatio: number;
  mustHaveSkillsMatched: number;
  totalSkillsFound: number;
  skillDepthScore: number; // Based on years per skill

  // Education features
  hasRequiredDegree: boolean;
  degreeRelevance: number;
  hasCertifications: boolean;
  certificationMatchCount: number;

  // Career trajectory
  careerProgressionScore: number; // -1 to 1
  industryRelevance: number;
  companyPrestigeScore: number;

  // Risk factors
  jobHoppingScore: number; // 0-1, higher = more hopping
  gapScore: number; // 0-1, higher = more gaps
  consistencyScore: number;

  // Content quality
  quantifiedAchievements: number;
  actionVerbUsage: number;
  specificityScore: number;
};

export type MLPrediction = {
  score: number;
  confidence: number;
  features: MLFeatures;
  topPositiveFactors: string[];
  topNegativeFactors: string[];
  recommendation: "strong_yes" | "yes" | "maybe" | "no" | "strong_no";
};

// Feature weights based on typical hiring patterns
const FEATURE_WEIGHTS: Record<keyof MLFeatures, number> = {
  totalYearsExperience: 0.08,
  relevantYearsExperience: 0.12,
  numberOfRoles: 0.02,
  averageTenure: 0.05,
  currentlyEmployed: 0.03,

  skillMatchRatio: 0.15,
  mustHaveSkillsMatched: 0.12,
  totalSkillsFound: 0.03,
  skillDepthScore: 0.05,

  hasRequiredDegree: 0.05,
  degreeRelevance: 0.03,
  hasCertifications: 0.04,
  certificationMatchCount: 0.03,

  careerProgressionScore: 0.05,
  industryRelevance: 0.04,
  companyPrestigeScore: 0.02,

  jobHoppingScore: -0.05, // Negative weight
  gapScore: -0.03, // Negative weight
  consistencyScore: 0.03,

  quantifiedAchievements: 0.04,
  actionVerbUsage: 0.02,
  specificityScore: 0.03,
};

// Prestigious company patterns
const PRESTIGIOUS_COMPANIES = [
  "google", "meta", "facebook", "amazon", "apple", "microsoft", "netflix",
  "uber", "airbnb", "stripe", "salesforce", "adobe", "oracle", "ibm",
  "linkedin", "twitter", "snap", "spotify", "dropbox", "slack", "zoom",
  "coinbase", "robinhood", "square", "block", "paypal", "nvidia", "intel",
  "mckinsey", "bain", "bcg", "deloitte", "accenture", "pwc", "kpmg", "ey",
  "goldman sachs", "morgan stanley", "jpmorgan", "blackrock", "citadel",
];

// Action verbs that indicate impact
const ACTION_VERBS = [
  "led", "managed", "developed", "designed", "implemented", "created",
  "built", "launched", "delivered", "increased", "reduced", "improved",
  "optimized", "architected", "scaled", "automated", "transformed",
  "achieved", "exceeded", "generated", "saved", "accelerated",
];

function extractFeatures(
  resumeText: string,
  jobDescription: string,
  matchedSkills: string[],
  missingSkills: string[],
  experienceYears: number | null,
  redFlagCount: number
): MLFeatures {
  const lowerResume = resumeText.toLowerCase();
  const lowerJD = jobDescription.toLowerCase();

  // Experience features
  const yearsMatches = resumeText.match(/(\d{1,2})\+?\s*years?/gi) || [];
  const years = yearsMatches.map(m => parseInt(m.match(/\d+/)?.[0] || "0", 10));
  const totalYears = years.length > 0 ? Math.max(...years) : 0;

  // Count roles (look for date patterns)
  const datePatterns = resumeText.match(/\d{4}\s*[-–]\s*(present|\d{4})/gi) || [];
  const numberOfRoles = datePatterns.length;

  // Currently employed
  const currentlyEmployed = /present|current/i.test(resumeText);

  // Skills features
  const totalSkillsFromJD = matchedSkills.length + missingSkills.length;
  const skillMatchRatio = totalSkillsFromJD > 0
    ? matchedSkills.length / totalSkillsFromJD
    : 0.5;

  // Must-have skills (estimate based on common patterns)
  const mustHavePatterns = /must|required|strong experience|hands-on/gi;
  const mustHaveLines = jobDescription.split("\n").filter(line => mustHavePatterns.test(line));
  const mustHaveSkillsMatched = matchedSkills.filter(skill =>
    mustHaveLines.some(line => line.toLowerCase().includes(skill.toLowerCase()))
  ).length;

  // Skill depth - check for years mentioned with skills
  const skillDepthMatches = resumeText.match(/(\d+)\+?\s*years?\s*(of\s+)?(experience\s+)?(with|in)\s+\w+/gi) || [];
  const skillDepthScore = Math.min(1, skillDepthMatches.length / 5);

  // Education
  const hasRequiredDegree = /bachelor|master|phd|degree/i.test(lowerResume);
  const degreeRelevance = /computer science|software|engineering|information technology|data science/i.test(lowerResume) ? 1 : 0.5;
  const hasCertifications = /certified|certification|pmp|aws|azure|gcp|cissp|ceh/i.test(lowerResume);
  const certMatches = resumeText.match(/certified|certification|pmp|aws certified|azure certified|gcp certified/gi) || [];
  const certificationMatchCount = certMatches.length;

  // Career trajectory
  const seniorityKeywords = ["intern", "junior", "associate", "mid", "senior", "lead", "principal", "manager", "director", "vp", "chief"];
  const foundSeniorities = seniorityKeywords.filter(s => lowerResume.includes(s));
  const careerProgressionScore = foundSeniorities.includes("senior") || foundSeniorities.includes("lead") ? 0.8 :
    foundSeniorities.includes("manager") || foundSeniorities.includes("director") ? 1 :
    foundSeniorities.includes("junior") || foundSeniorities.includes("intern") ? 0.3 : 0.5;

  // Industry relevance
  const industryKeywords = lowerJD.match(/\b(fintech|healthcare|ecommerce|saas|b2b|enterprise|startup|government|defense|dod)\b/g) || [];
  const industryRelevance = industryKeywords.some(ind => lowerResume.includes(ind)) ? 1 : 0.5;

  // Company prestige
  const prestigeMatches = PRESTIGIOUS_COMPANIES.filter(company => lowerResume.includes(company));
  const companyPrestigeScore = Math.min(1, prestigeMatches.length * 0.3);

  // Risk factors
  const jobHoppingScore = Math.min(1, redFlagCount * 0.2);
  const gapScore = /gap|break|sabbatical|career break/i.test(lowerResume) ? 0.3 : 0;
  const consistencyScore = numberOfRoles > 0 && numberOfRoles < 10 ? 0.8 : 0.5;

  // Content quality
  const quantifiedAchievements = (resumeText.match(/\d+%|\$\d+|\d+x|\d+ million|\d+ thousand/gi) || []).length;
  const actionVerbMatches = ACTION_VERBS.filter(verb => lowerResume.includes(verb));
  const actionVerbUsage = Math.min(1, actionVerbMatches.length / 10);
  const specificityScore = quantifiedAchievements > 3 ? 1 : quantifiedAchievements > 0 ? 0.6 : 0.3;

  return {
    totalYearsExperience: Math.min(1, totalYears / 15),
    relevantYearsExperience: Math.min(1, (experienceYears || totalYears) / 10),
    numberOfRoles: Math.min(1, numberOfRoles / 8),
    averageTenure: numberOfRoles > 0 ? Math.min(1, (totalYears / numberOfRoles) / 4) : 0.5,
    currentlyEmployed,

    skillMatchRatio,
    mustHaveSkillsMatched: Math.min(1, mustHaveSkillsMatched / 5),
    totalSkillsFound: Math.min(1, matchedSkills.length / 10),
    skillDepthScore,

    hasRequiredDegree,
    degreeRelevance,
    hasCertifications,
    certificationMatchCount: Math.min(1, certificationMatchCount / 3),

    careerProgressionScore,
    industryRelevance,
    companyPrestigeScore,

    jobHoppingScore,
    gapScore,
    consistencyScore,

    quantifiedAchievements: Math.min(1, quantifiedAchievements / 5),
    actionVerbUsage,
    specificityScore,
  };
}

function computeMLScore(features: MLFeatures): { score: number; confidence: number } {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(FEATURE_WEIGHTS)) {
    const featureKey = key as keyof MLFeatures;
    const featureValue = features[featureKey];
    const numericValue = typeof featureValue === "boolean" ? (featureValue ? 1 : 0) : featureValue;

    weightedSum += numericValue * weight;
    totalWeight += Math.abs(weight);
  }

  // Normalize to 0-100
  const rawScore = (weightedSum / totalWeight) * 100;
  const score = Math.round(Math.max(0, Math.min(100, rawScore + 30))); // Shift baseline

  // Confidence based on data completeness
  const nonZeroFeatures = Object.values(features).filter(v =>
    (typeof v === "number" && v > 0) || (typeof v === "boolean" && v)
  ).length;
  const confidence = Math.round((nonZeroFeatures / Object.keys(features).length) * 100);

  return { score, confidence };
}

function getTopFactors(features: MLFeatures): { positive: string[]; negative: string[] } {
  const positive: string[] = [];
  const negative: string[] = [];

  if (features.skillMatchRatio > 0.7) positive.push("Strong skill match with requirements");
  if (features.relevantYearsExperience > 0.6) positive.push("Relevant experience level");
  if (features.careerProgressionScore > 0.7) positive.push("Clear career progression");
  if (features.companyPrestigeScore > 0.5) positive.push("Experience at notable companies");
  if (features.quantifiedAchievements > 0.5) positive.push("Quantified achievements on resume");
  if (features.hasCertifications) positive.push("Relevant certifications");
  if (features.currentlyEmployed) positive.push("Currently employed");

  if (features.skillMatchRatio < 0.4) negative.push("Missing key required skills");
  if (features.jobHoppingScore > 0.4) negative.push("Frequent job changes");
  if (features.gapScore > 0.2) negative.push("Employment gaps detected");
  if (features.specificityScore < 0.4) negative.push("Vague achievements without metrics");
  if (!features.hasRequiredDegree) negative.push("Required education not evident");

  return { positive: positive.slice(0, 4), negative: negative.slice(0, 4) };
}

function getRecommendation(score: number, confidence: number): MLPrediction["recommendation"] {
  if (score >= 85 && confidence >= 60) return "strong_yes";
  if (score >= 70 && confidence >= 50) return "yes";
  if (score >= 55) return "maybe";
  if (score >= 40) return "no";
  return "strong_no";
}

export function computeMLPrediction(
  resumeText: string,
  jobDescription: string,
  matchedSkills: string[],
  missingSkills: string[],
  experienceYears: number | null,
  redFlagCount: number
): MLPrediction {
  const features = extractFeatures(
    resumeText,
    jobDescription,
    matchedSkills,
    missingSkills,
    experienceYears,
    redFlagCount
  );

  const { score, confidence } = computeMLScore(features);
  const { positive, negative } = getTopFactors(features);

  return {
    score,
    confidence,
    features,
    topPositiveFactors: positive,
    topNegativeFactors: negative,
    recommendation: getRecommendation(score, confidence),
  };
}
