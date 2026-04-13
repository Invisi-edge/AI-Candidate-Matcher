import { parseExperience } from "@/lib/experience/experience-parser";

export type RedFlagSeverity = "high" | "medium" | "low";

export type RedFlag = {
  type: string;
  severity: RedFlagSeverity;
  description: string;
  details: string;
};

export type RedFlagAnalysis = {
  flags: RedFlag[];
  riskScore: number; // 0-100, higher = more risk
  summary: string;
};

// Patterns for detecting issues
const JOB_HOPPING_THRESHOLD_MONTHS = 18; // Less than 18 months = short stint
const EMPLOYMENT_GAP_THRESHOLD_MONTHS = 6; // More than 6 months = gap
const MAX_SHORT_STINTS = 2; // More than 2 short stints = job hopping pattern

type DatePrecision = "month" | "year" | "present";

type ParsedResumeDate = {
  value: Date;
  label: string;
  precision: DatePrecision;
};

type RoleRange = {
  title: string;
  start: ParsedResumeDate;
  end: ParsedResumeDate;
  durationMonths: number | null;
};

function parseDate(dateStr: string): ParsedResumeDate | null {
  if (!dateStr) return null;

  const normalized = dateStr.toLowerCase().trim().replace(/\s+/g, " ");

  if (/present|current|now/i.test(normalized)) {
    return {
      value: new Date(),
      label: "Present",
      precision: "present",
    };
  }

  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
    "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  // "Jan 2023" or "January 2023"
  const monthYearMatch = normalized.match(
    new RegExp(`(${months.join("|")})\\s*(\\d{4})`, "i")
  );
  if (monthYearMatch) {
    const monthIndex = months.indexOf(monthYearMatch[1].toLowerCase()) % 12;
    const year = parseInt(monthYearMatch[2], 10);
    return {
      value: new Date(year, monthIndex),
      label: `${monthYearMatch[1]} ${year}`,
      precision: "month",
    };
  }

  // "2023" alone
  const yearOnlyMatch = normalized.match(/\b(20\d{2}|19\d{2})\b/);
  if (yearOnlyMatch) {
    const year = parseInt(yearOnlyMatch[1], 10);
    return {
      value: new Date(year, 0),
      label: String(year),
      precision: "year",
    };
  }

  return null;
}

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function getRoleRanges(text: string): RoleRange[] {
  const roles = parseExperience(text).roles;
  const unique = new Map<string, RoleRange>();

  for (const role of roles) {
    const start = role.startDate ? parseDate(role.startDate) : null;
    const end = role.endDate ? parseDate(role.endDate) : null;

    if (!start || !end) {
      continue;
    }

    const key = `${role.title}|${role.company ?? ""}|${role.startDate ?? ""}|${role.endDate ?? ""}`;

    unique.set(key, {
      title: role.title,
      start,
      end,
      durationMonths: role.durationMonths,
    });
  }

  return Array.from(unique.values());
}

function hasReliableMonthPrecision(range: RoleRange): boolean {
  return range.start.precision === "month" && range.end.precision !== "year";
}

function formatRoleRange(range: RoleRange): string {
  return `${range.title}: ${range.start.label} - ${range.end.label}`;
}

function detectJobHopping(text: string): RedFlag | null {
  const roleRanges = getRoleRanges(text).filter(
    (range) =>
      hasReliableMonthPrecision(range) &&
      range.durationMonths !== null &&
      range.durationMonths > 0
  );
  const shortStints = roleRanges.filter(
    (range) => (range.durationMonths ?? 0) < JOB_HOPPING_THRESHOLD_MONTHS
  );

  if (
    roleRanges.length >= 3 &&
    shortStints.length > MAX_SHORT_STINTS &&
    shortStints.length / roleRanges.length >= 0.5
  ) {
    return {
      type: "job_hopping",
      severity: shortStints.length >= 5 ? "high" : "medium",
      description: "Multiple short tenures detected",
      details: `${shortStints.length} of ${roleRanges.length} roles appear shorter than ${JOB_HOPPING_THRESHOLD_MONTHS} months. Verify whether these were contract, consulting, internship, or project-based positions before treating them as a risk signal.`,
    };
  }

  return null;
}

function detectEmploymentGaps(text: string): RedFlag[] {
  const flags: RedFlag[] = [];
  const dateRanges = getRoleRanges(text)
    .filter(hasReliableMonthPrecision)
    .sort((a, b) => a.start.value.getTime() - b.start.value.getTime());

  if (dateRanges.length < 2) {
    return flags;
  }

  let activeRange = dateRanges[0];

  for (let i = 1; i < dateRanges.length; i++) {
    const nextRange = dateRanges[i];
    const gapMonths = monthsBetween(activeRange.end.value, nextRange.start.value);

    if (gapMonths > EMPLOYMENT_GAP_THRESHOLD_MONTHS) {
      const years = Math.floor(gapMonths / 12);
      const months = gapMonths % 12;
      const duration = years > 0
        ? `${years} year${years > 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`
        : `${months} month${months !== 1 ? "s" : ""}`;

      flags.push({
        type: "employment_gap",
        severity: gapMonths > 18 ? "high" : "medium",
        description: `Possible employment gap of ${duration}`,
        details: `Timeline suggests a gap between ${formatRoleRange(activeRange)} and ${formatRoleRange(nextRange)}. Verify whether this reflects leave, education, concurrent work, or partial dates on the resume.`,
      });
    }

    if (nextRange.end.value.getTime() > activeRange.end.value.getTime()) {
      activeRange = nextRange;
    }
  }

  return flags;
}

function detectCareerRegression(text: string): RedFlag | null {
  const seniorityKeywords = [
    { level: 10, words: ["ceo", "cto", "cfo", "chief"] },
    { level: 9, words: ["vp", "vice president"] },
    { level: 8, words: ["director"] },
    { level: 7, words: ["senior manager", "head of"] },
    { level: 6, words: ["manager"] },
    { level: 5, words: ["lead", "principal", "staff"] },
    { level: 4, words: ["senior", "sr."] },
    { level: 3, words: ["mid-level", "intermediate"] },
    { level: 2, words: ["junior", "jr.", "associate"] },
    { level: 1, words: ["intern", "trainee", "entry"] },
  ];

  const lines = text.toLowerCase().split("\n");
  const detectedLevels: number[] = [];

  for (const line of lines) {
    for (const { level, words } of seniorityKeywords) {
      if (words.some((word) => line.includes(word))) {
        detectedLevels.push(level);
        break;
      }
    }
  }

  // Check if there's a significant downward trend
  if (detectedLevels.length >= 2) {
    const recentLevel = detectedLevels[0];
    const olderLevels = detectedLevels.slice(1);
    const maxOlderLevel = Math.max(...olderLevels);

    if (maxOlderLevel - recentLevel >= 2) {
      return {
        type: "career_regression",
        severity: "medium",
        description: "Possible decrease in seniority level",
        details: "Recent roles appear to be at a lower level than previous positions. Consider asking about career goals and reasons for transition.",
      };
    }
  }

  return null;
}

function detectVagueDescriptions(text: string): RedFlag | null {
  const vaguePatterns = [
    /responsible for various/i,
    /helped with/i,
    /assisted in/i,
    /participated in/i,
    /was involved in/i,
    /worked on different/i,
  ];

  const vagueCount = vaguePatterns.filter((p) => p.test(text)).length;

  if (vagueCount >= 3) {
    return {
      type: "vague_descriptions",
      severity: "low",
      description: "Vague job descriptions",
      details: "Resume contains non-specific language without measurable achievements. Consider asking for specific examples and metrics.",
    };
  }

  return null;
}

function detectMissingInformation(text: string): RedFlag[] {
  const flags: RedFlag[] = [];

  // Check for missing dates
  const hasDatePattern = /\b(20\d{2}|19\d{2})\b/;
  if (!hasDatePattern.test(text)) {
    flags.push({
      type: "missing_dates",
      severity: "high",
      description: "No dates found in resume",
      details: "Resume does not contain clear employment dates. This makes it difficult to verify experience and detect gaps.",
    });
  }

  // Check for missing contact info patterns
  const hasEmail = /@.*\.(com|org|net|edu|io)/i.test(text);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);

  if (!hasEmail && !hasPhone) {
    flags.push({
      type: "missing_contact",
      severity: "low",
      description: "Missing contact information",
      details: "No email or phone number detected in resume.",
    });
  }

  return flags;
}

function detectOverqualification(text: string, jobDescription: string): RedFlag | null {
  // Extract required years from JD
  const jdYearsMatch = jobDescription.match(/(\d{1,2})\+?\s*years?/i);
  if (!jdYearsMatch) {
    return null; // No experience requirement in JD
  }

  const requiredYears = parseInt(jdYearsMatch[1], 10);

  // Calculate actual years of experience from work history
  const roleRanges = getRoleRanges(text);
  if (roleRanges.length === 0) {
    return null; // Can't determine experience without dates
  }

  // Get the earliest start date and latest end date
  const sortedRanges = roleRanges.sort((a, b) => a.start.value.getTime() - b.start.value.getTime());
  const earliestStart = sortedRanges[0].start.value;
  const latestEnd = sortedRanges[sortedRanges.length - 1].end.value;

  // Calculate total years of experience (approximate)
  const totalYears = (latestEnd.getFullYear() - earliestStart.getFullYear());

  // Flag as overqualified if:
  // 1. Total experience is more than 3x the requirement
  // 2. Total experience is at least 15 years
  // 3. Requirement is for junior-mid level (< 8 years)
  if (totalYears > requiredYears * 3 && totalYears >= 15 && requiredYears < 8) {
    return {
      type: "overqualification",
      severity: "low",
      description: "Candidate may be overqualified",
      details: `Resume shows approximately ${totalYears} years of work history for a role requiring ${requiredYears} years. Consider discussing long-term fit, expectations, and what attracts them to this level.`,
    };
  }

  return null;
}

export function analyzeRedFlags(resumeText: string, jobDescription: string): RedFlagAnalysis {
  const flags: RedFlag[] = [];

  // Run all detectors
  const jobHopping = detectJobHopping(resumeText);
  if (jobHopping) flags.push(jobHopping);

  const gaps = detectEmploymentGaps(resumeText);
  flags.push(...gaps);

  const regression = detectCareerRegression(resumeText);
  if (regression) flags.push(regression);

  const vague = detectVagueDescriptions(resumeText);
  if (vague) flags.push(vague);

  const missing = detectMissingInformation(resumeText);
  flags.push(...missing);

  const overqualified = detectOverqualification(resumeText, jobDescription);
  if (overqualified) flags.push(overqualified);

  // Calculate risk score
  const severityWeights = { high: 20, medium: 10, low: 4 };
  const riskScore = Math.min(
    100,
    flags.reduce((sum, flag) => sum + severityWeights[flag.severity], 0)
  );

  // Generate summary
  let summary: string;
  if (flags.length === 0) {
    summary = "No red flags detected. Resume appears consistent and complete.";
  } else if (riskScore >= 50) {
    summary = `${flags.length} concerns identified requiring attention before proceeding.`;
  } else if (riskScore >= 20) {
    summary = `${flags.length} minor concerns noted. Recommend discussing during interview.`;
  } else {
    summary = `${flags.length} minor observation(s). Generally low risk.`;
  }

  return {
    flags: flags.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    }),
    riskScore,
    summary,
  };
}
