export type RedFlagSeverity = "high" | "medium" | "low";

export type RedFlag = {
  type: string;
  severity: RedFlagSeverity;
  description: string;
  details: string;
};

export type InterviewQuestion = {
  category: "skills" | "experience" | "behavioral" | "red_flag" | "role_specific";
  question: string;
  purpose: string;
  followUp?: string;
};

export type InterviewQuestionSource = "ai" | "heuristic";

export type MLPrediction = {
  score: number;
  confidence: number;
  recommendation: "strong_yes" | "yes" | "maybe" | "no" | "strong_no";
  topPositiveFactors: string[];
  topNegativeFactors: string[];
};

export type CandidateResult = {
  id: string;
  name: string;
  score: number;
  summary: string;
  matchedRequirements: string[];
  missingRequirements: string[];
  strengths: string[];
  concerns: string[];
  extractedSkills: string[];
  experienceSignals: string[];
  // Enhanced analysis
  redFlags?: RedFlag[];
  riskScore?: number;
  interviewQuestions?: InterviewQuestion[];
  interviewQuestionSource?: InterviewQuestionSource;
  mlPrediction?: MLPrediction;
};

export type RecentAnalysis = {
  analysisRunId: string;
  jobId: string;
  title: string;
  provider: string;
  model: string | null;
  totalCandidates: number;
  topScore: number;
  createdAt: string;
  candidates: CandidateResult[];
};

export type HeuristicCandidateAnalysis = {
  score: number;
  matchedRequirements: string[];
  missingRequirements: string[];
  strengths: string[];
  concerns: string[];
  extractedSkills: string[];
  experienceSignals: string[];
  summary: string;
  // Enhanced analysis
  redFlags: RedFlag[];
  riskScore: number;
  interviewQuestions: InterviewQuestion[];
  mlPrediction: MLPrediction;
};

// Enhanced types for detailed analysis
export type SkillConfidence = "high" | "medium" | "low";

export type SkillMatch = {
  skill: string;
  category: string;
  confidence: SkillConfidence;
  yearsOfExperience: number | null;
  matched: boolean;
};

export type SeniorityLevel =
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "staff"
  | "principal"
  | "lead"
  | "manager"
  | "director"
  | "vp"
  | "c-level"
  | "unknown";

export type ExperienceProfile = {
  totalYears: number | null;
  maxYearsInRole: number;
  seniority: SeniorityLevel;
  industries: string[];
  progression: "ascending" | "lateral" | "descending" | "mixed" | "unknown";
};

export type ScoreFactor = {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  details: string;
};

export type EnhancedCandidateAnalysis = HeuristicCandidateAnalysis & {
  skillMatches: SkillMatch[];
  experienceProfile: ExperienceProfile;
  scoreBreakdown: {
    factors: ScoreFactor[];
    penalties: Array<{ reason: string; amount: number }>;
    bonuses: Array<{ reason: string; amount: number }>;
  };
  education: {
    detected: string | null;
    meetsRequirement: boolean;
  } | null;
  certifications: {
    found: string[];
    required: string[];
    matched: string[];
  };
};
