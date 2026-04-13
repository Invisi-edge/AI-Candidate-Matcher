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

export type RoleEntry = {
  title: string;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  durationMonths: number | null;
  seniority: SeniorityLevel;
};

export type CareerProgression = "ascending" | "lateral" | "descending" | "mixed" | "unknown";

export type ExperienceProfile = {
  totalYears: number | null;
  maxYearsInRole: number;
  seniority: SeniorityLevel;
  roles: RoleEntry[];
  progression: CareerProgression;
  industries: string[];
  experienceSignals: string[];
};

const SENIORITY_PATTERNS: Array<{ level: SeniorityLevel; patterns: RegExp[] }> = [
  { level: "c-level", patterns: [/\b(ceo|cto|cfo|coo|cio|chief\s+\w+\s+officer)\b/i] },
  { level: "vp", patterns: [/\b(vp|vice\s*president)\b/i] },
  { level: "director", patterns: [/\bdirector\b/i, /\bhead\s+of\b/i] },
  { level: "manager", patterns: [/\bmanager\b/i, /\bteam\s+lead(?:er)?\b/i, /\beng(?:ineering)?\s+manager\b/i] },
  { level: "lead", patterns: [/\blead\b/i, /\btech\s*lead\b/i, /\barchitect\b/i] },
  { level: "principal", patterns: [/\bprincipal\b/i, /\bstaff\s+\w*\s*engineer\b/i] },
  { level: "staff", patterns: [/\bstaff\b/i] },
  { level: "senior", patterns: [/\bsenior\b/i, /\bsr\.?\b/i] },
  { level: "mid", patterns: [/\b(mid-?level|intermediate)\b/i] },
  { level: "junior", patterns: [/\bjunior\b/i, /\bjr\.?\b/i, /\bentry[\s-]?level\b/i] },
  { level: "intern", patterns: [/\bintern(?:ship)?\b/i, /\btrainee\b/i] },
];

const SENIORITY_RANK: Record<SeniorityLevel, number> = {
  intern: 1,
  junior: 2,
  mid: 3,
  senior: 4,
  staff: 5,
  principal: 6,
  lead: 7,
  manager: 8,
  director: 9,
  vp: 10,
  "c-level": 11,
  unknown: 3, // Default to mid-level
};

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  fintech: ["fintech", "financial technology", "banking", "payments", "trading", "investment"],
  healthcare: ["healthcare", "healthtech", "medical", "pharma", "biotech", "clinical"],
  ecommerce: ["ecommerce", "e-commerce", "retail", "marketplace", "shopping"],
  saas: ["saas", "b2b", "enterprise software", "software as a service"],
  gaming: ["gaming", "game development", "video games"],
  edtech: ["edtech", "education", "e-learning", "learning platform"],
  media: ["media", "entertainment", "streaming", "content"],
  adtech: ["adtech", "advertising", "marketing technology"],
  cybersecurity: ["cybersecurity", "security", "infosec"],
  ai: ["artificial intelligence", "machine learning", "ai/ml", "ai startup"],
  crypto: ["crypto", "blockchain", "web3", "defi"],
  logistics: ["logistics", "supply chain", "transportation", "shipping"],
};

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^\w\s./-]/g, " ").replace(/\s+/g, " ").trim();
}

function detectSeniority(title: string): SeniorityLevel {
  const normalizedTitle = normalizeText(title);
  for (const { level, patterns } of SENIORITY_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(normalizedTitle))) {
      return level;
    }
  }
  return "unknown";
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const normalized = dateStr.toLowerCase().trim();

  // "Present" or "Current"
  if (/present|current|now/i.test(normalized)) {
    return new Date();
  }

  // "Jan 2023" or "January 2023"
  const monthYearMatch = normalized.match(
    new RegExp(`(${MONTH_NAMES.join("|")})\\s*(\\d{4})`, "i")
  );
  if (monthYearMatch) {
    const monthIndex = MONTH_NAMES.indexOf(monthYearMatch[1].toLowerCase()) % 12;
    return new Date(parseInt(monthYearMatch[2], 10), monthIndex);
  }

  // "2023" alone
  const yearOnlyMatch = normalized.match(/\b(20\d{2}|19\d{2})\b/);
  if (yearOnlyMatch) {
    return new Date(parseInt(yearOnlyMatch[1], 10), 0);
  }

  // "01/2023" or "2023/01"
  const numericMatch = normalized.match(/(\d{1,2})[\/\-](\d{4})/);
  if (numericMatch) {
    return new Date(parseInt(numericMatch[2], 10), parseInt(numericMatch[1], 10) - 1);
  }

  return null;
}

function calculateDurationMonths(start: Date | null, end: Date | null): number | null {
  if (!start || !end) return null;
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(0, months);
}

function extractRoleEntries(text: string): RoleEntry[] {
  const roles: RoleEntry[] = [];
  const lines = text.split(/\n/);

  // Pattern: Title at/@ Company, Date - Date
  const rolePattern = /^(.+?)(?:\s+(?:at|@|,)\s+)(.+?)(?:,?\s*|\s+)(\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})\s*[-–—to]+\s*(present|current|\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})/i;

  // Simpler pattern: Just title with dates on same or next line
  const simpleTitlePattern = /^([\w\s]+(?:engineer|developer|designer|manager|analyst|consultant|lead|architect|director|specialist|coordinator))/i;
  const dateRangePattern = /(\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})\s*[-–—to]+\s*(present|current|\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Try full pattern first
    const fullMatch = line.match(rolePattern);
    if (fullMatch) {
      const startDate = parseDate(fullMatch[3]);
      const endDate = parseDate(fullMatch[4]);
      roles.push({
        title: fullMatch[1].trim(),
        company: fullMatch[2].trim(),
        startDate: fullMatch[3],
        endDate: fullMatch[4],
        durationMonths: calculateDurationMonths(startDate, endDate),
        seniority: detectSeniority(fullMatch[1]),
      });
      continue;
    }

    // Try simple title pattern
    const titleMatch = line.match(simpleTitlePattern);
    if (titleMatch) {
      // Look for dates in same line or next line
      let dateMatch = line.match(dateRangePattern);
      if (!dateMatch && i + 1 < lines.length) {
        dateMatch = lines[i + 1].match(dateRangePattern);
      }

      if (dateMatch) {
        const startDate = parseDate(dateMatch[1]);
        const endDate = parseDate(dateMatch[2]);
        roles.push({
          title: titleMatch[1].trim(),
          company: null,
          startDate: dateMatch[1],
          endDate: dateMatch[2],
          durationMonths: calculateDurationMonths(startDate, endDate),
          seniority: detectSeniority(titleMatch[1]),
        });
      }
    }
  }

  return roles;
}

function determineProgression(roles: RoleEntry[]): CareerProgression {
  if (roles.length < 2) return "unknown";

  const seniorityLevels = roles
    .map((r) => SENIORITY_RANK[r.seniority])
    .filter((level) => level !== SENIORITY_RANK.unknown);

  if (seniorityLevels.length < 2) return "unknown";

  let ascending = 0;
  let descending = 0;

  for (let i = 1; i < seniorityLevels.length; i++) {
    if (seniorityLevels[i] > seniorityLevels[i - 1]) ascending++;
    else if (seniorityLevels[i] < seniorityLevels[i - 1]) descending++;
  }

  if (ascending > 0 && descending === 0) return "ascending";
  if (descending > 0 && ascending === 0) return "descending";
  if (ascending === 0 && descending === 0) return "lateral";
  return "mixed";
}

function extractIndustries(text: string): string[] {
  const normalizedText = normalizeText(text);
  const found: string[] = [];

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((keyword) => normalizedText.includes(keyword))) {
      found.push(industry);
    }
  }

  return found;
}

function extractExperienceSignals(text: string): string[] {
  const matches = text.match(/\b\d{1,2}\+?\s+years?\b/gi) ?? [];
  return Array.from(new Set(matches.map((item) => item.toLowerCase())));
}

function extractTotalYears(text: string): number | null {
  // Look for explicit total experience statements
  const totalPattern = /(?:total|overall|cumulative|combined)?\s*(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|in\s+the\s+industry)/i;
  const totalMatch = text.match(totalPattern);
  if (totalMatch) {
    return parseInt(totalMatch[1], 10);
  }

  // Extract all year mentions
  const yearMatches = [...text.matchAll(/(\d{1,2})\+?\s*(?:years?|yrs?)/gi)];
  if (yearMatches.length > 0) {
    const years = yearMatches.map((m) => parseInt(m[1], 10));
    return Math.max(...years);
  }

  return null;
}

export function parseExperience(text: string): ExperienceProfile {
  const roles = extractRoleEntries(text);
  const totalYears = extractTotalYears(text);
  const experienceSignals = extractExperienceSignals(text);
  const industries = extractIndustries(text);

  // Determine highest seniority from roles
  let highestSeniority: SeniorityLevel = "unknown";
  let highestRank = 0;
  for (const role of roles) {
    const rank = SENIORITY_RANK[role.seniority];
    if (rank > highestRank) {
      highestRank = rank;
      highestSeniority = role.seniority;
    }
  }

  // If no roles found, try to detect seniority from the whole text
  if (highestSeniority === "unknown") {
    highestSeniority = detectSeniority(text);
  }

  const maxYearsInRole = roles.reduce((max, role) => {
    const years = role.durationMonths ? role.durationMonths / 12 : 0;
    return Math.max(max, years);
  }, 0);

  return {
    totalYears,
    maxYearsInRole: Math.round(maxYearsInRole * 10) / 10,
    seniority: highestSeniority,
    roles,
    progression: determineProgression(roles),
    industries,
    experienceSignals,
  };
}

export function getSeniorityRank(level: SeniorityLevel): number {
  return SENIORITY_RANK[level];
}

export function compareSeniority(a: SeniorityLevel, b: SeniorityLevel): number {
  return SENIORITY_RANK[a] - SENIORITY_RANK[b];
}

export function detectSeniorityFromTitle(title: string): SeniorityLevel {
  return detectSeniority(title);
}
