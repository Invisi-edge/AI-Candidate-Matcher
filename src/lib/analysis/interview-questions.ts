import { RedFlag } from "./red-flags";

export type InterviewQuestion = {
  category: "skills" | "experience" | "behavioral" | "red_flag" | "role_specific";
  question: string;
  purpose: string;
  followUp?: string;
};

export type InterviewQuestions = {
  questions: InterviewQuestion[];
  summary: string;
};

// Skill-specific technical questions
const SKILL_QUESTIONS: Record<string, InterviewQuestion> = {
  react: {
    category: "skills",
    question: "Can you explain how you've used React hooks like useState and useEffect in a recent project?",
    purpose: "Assess practical React knowledge and modern patterns",
    followUp: "How do you handle state management in larger applications?",
  },
  python: {
    category: "skills",
    question: "Describe a complex Python project you've built. What libraries did you use and why?",
    purpose: "Evaluate Python proficiency and ecosystem knowledge",
    followUp: "How do you ensure code quality and testing in Python projects?",
  },
  aws: {
    category: "skills",
    question: "Walk me through how you've architected an application on AWS. What services did you use?",
    purpose: "Assess cloud architecture experience",
    followUp: "How do you handle cost optimization and security on AWS?",
  },
  "project management": {
    category: "skills",
    question: "Describe how you manage competing priorities and stakeholder expectations on a complex project.",
    purpose: "Evaluate PM methodology and stakeholder management",
    followUp: "How do you handle scope creep and timeline risks?",
  },
  pmp: {
    category: "skills",
    question: "How has the PMP framework influenced your project management approach?",
    purpose: "Verify PMP knowledge application",
    followUp: "Give an example where you applied risk management techniques.",
  },
  leadership: {
    category: "behavioral",
    question: "Tell me about a time you had to lead a team through a difficult situation.",
    purpose: "Assess leadership style and conflict resolution",
    followUp: "How do you motivate underperforming team members?",
  },
  agile: {
    category: "skills",
    question: "How do you run sprint planning and retrospectives? What metrics do you track?",
    purpose: "Evaluate Agile/Scrum experience",
    followUp: "How do you handle stakeholders who want to add scope mid-sprint?",
  },
  sql: {
    category: "skills",
    question: "Describe a complex SQL query you've written. How did you optimize its performance?",
    purpose: "Assess database skills",
    followUp: "How do you approach database schema design?",
  },
  kubernetes: {
    category: "skills",
    question: "Walk me through how you've deployed and managed applications on Kubernetes.",
    purpose: "Evaluate container orchestration experience",
    followUp: "How do you handle monitoring and troubleshooting in K8s?",
  },
  security: {
    category: "skills",
    question: "What security best practices do you follow in your development/engineering work?",
    purpose: "Assess security awareness",
    followUp: "Describe a security issue you identified and how you resolved it.",
  },
  cisco: {
    category: "skills",
    question: "Describe your experience configuring Cisco routers and switches in an enterprise environment.",
    purpose: "Evaluate networking expertise",
    followUp: "How do you troubleshoot network connectivity issues?",
  },
  bgp: {
    category: "skills",
    question: "Explain how BGP peering works and describe a complex routing scenario you've handled.",
    purpose: "Assess advanced networking knowledge",
    followUp: "How do you handle BGP route optimization?",
  },
  // Java and JVM ecosystem
  java: {
    category: "skills",
    question: "Describe a Java application you've built or maintained. What frameworks did you use and how did you handle performance optimization?",
    purpose: "Evaluate Java proficiency and enterprise development experience",
    followUp: "How do you approach debugging memory issues or thread-safety problems in Java?",
  },
  "spring framework": {
    category: "skills",
    question: "How have you used Spring Framework in your projects? Describe your experience with Spring Boot, dependency injection, and REST API development.",
    purpose: "Assess Spring ecosystem expertise",
    followUp: "How do you handle transaction management and security in Spring applications?",
  },
  spring: {
    category: "skills",
    question: "How have you used Spring Framework in your projects? Describe your experience with Spring Boot, dependency injection, and REST API development.",
    purpose: "Assess Spring ecosystem expertise",
    followUp: "How do you handle transaction management and security in Spring applications?",
  },
  // Databases
  postgresql: {
    category: "skills",
    question: "Describe your experience with PostgreSQL. How have you handled database migrations, performance tuning, or complex queries?",
    purpose: "Evaluate PostgreSQL expertise and database administration skills",
    followUp: "Have you migrated databases between platforms (e.g., Oracle to PostgreSQL)? What challenges did you face?",
  },
  oracle: {
    category: "skills",
    question: "Walk me through your experience with Oracle databases. What administrative tasks have you performed and how do you optimize query performance?",
    purpose: "Assess Oracle database expertise",
    followUp: "How do you handle Oracle-specific features like PL/SQL or database partitioning?",
  },
  // Data integration tools
  informatica: {
    category: "skills",
    question: "Describe your experience with Informatica. What types of data mappings and ETL workflows have you created or maintained?",
    purpose: "Evaluate ETL and data integration skills",
    followUp: "How do you troubleshoot failed Informatica jobs and ensure data quality?",
  },
  // Web technologies
  angular: {
    category: "skills",
    question: "Describe a complex Angular application you've worked on. How did you structure components, services, and state management?",
    purpose: "Assess Angular expertise and frontend architecture skills",
    followUp: "How do you handle performance optimization and lazy loading in Angular?",
  },
  ".net": {
    category: "skills",
    question: "Describe your experience with .NET development. What types of applications have you built and what patterns do you follow?",
    purpose: "Evaluate .NET ecosystem proficiency",
    followUp: "How do you handle dependency injection and testing in .NET applications?",
  },
  dotnet: {
    category: "skills",
    question: "Describe your experience with .NET development. What types of applications have you built and what patterns do you follow?",
    purpose: "Evaluate .NET ecosystem proficiency",
    followUp: "How do you handle dependency injection and testing in .NET applications?",
  },
  // DevOps and infrastructure
  tomcat: {
    category: "skills",
    question: "Describe your experience deploying and managing applications on Apache Tomcat. How do you handle configuration, monitoring, and troubleshooting?",
    purpose: "Assess application server administration skills",
    followUp: "How do you approach Tomcat performance tuning and security hardening?",
  },
  "apache tomcat": {
    category: "skills",
    question: "Describe your experience deploying and managing applications on Apache Tomcat. How do you handle configuration, monitoring, and troubleshooting?",
    purpose: "Assess application server administration skills",
    followUp: "How do you approach Tomcat performance tuning and security hardening?",
  },
  devops: {
    category: "skills",
    question: "Describe your DevOps experience. What CI/CD pipelines have you built and how do you ensure reliable deployments?",
    purpose: "Evaluate DevOps practices and automation skills",
    followUp: "How do you handle rollbacks and incident response in production?",
  },
  secdevops: {
    category: "skills",
    question: "How do you integrate security into your DevOps pipeline? What tools and practices do you use for secure development?",
    purpose: "Assess security-focused DevOps practices",
    followUp: "How do you handle vulnerability scanning and security compliance in CI/CD?",
  },
  // Scripting and automation
  "shell scripts": {
    category: "skills",
    question: "Describe complex shell scripts you've written. What automation tasks have you accomplished with scripting?",
    purpose: "Evaluate scripting and automation capabilities",
    followUp: "How do you ensure your scripts are maintainable and handle errors gracefully?",
  },
  bash: {
    category: "skills",
    question: "Describe complex shell scripts you've written. What automation tasks have you accomplished with scripting?",
    purpose: "Evaluate scripting and automation capabilities",
    followUp: "How do you ensure your scripts are maintainable and handle errors gracefully?",
  },
  // Reporting tools
  "crystal reports": {
    category: "skills",
    question: "Describe your experience creating reports with Crystal Reports. What types of complex reports have you built?",
    purpose: "Assess reporting and data visualization skills",
    followUp: "How do you optimize report performance with large datasets?",
  },
  // Database migrations and cloud
  "database migration": {
    category: "skills",
    question: "Describe a database migration project you've led. How did you ensure data integrity and minimize downtime?",
    purpose: "Evaluate database migration experience and planning skills",
    followUp: "What tools and validation approaches do you use during migrations?",
  },
  "amazon rds": {
    category: "skills",
    question: "Describe your experience with Amazon RDS. How have you managed database instances, backups, and performance?",
    purpose: "Assess AWS database services expertise",
    followUp: "Have you migrated databases to Aurora? What was your approach?",
  },
  "aurora postgresql": {
    category: "skills",
    question: "What is your experience with Amazon Aurora PostgreSQL? How does it differ from standard PostgreSQL in terms of management?",
    purpose: "Evaluate Aurora-specific knowledge",
    followUp: "How do you approach Aurora performance tuning and high availability?",
  },
  // Certifications and standards
  "owasp": {
    category: "skills",
    question: "How familiar are you with OWASP security standards? Which vulnerabilities from the OWASP Top 10 have you addressed in your projects?",
    purpose: "Assess application security knowledge",
    followUp: "How do you implement security testing in your development workflow?",
  },
  // Technical leadership
  "technical leadership": {
    category: "skills",
    question: "Describe your approach to technical leadership. How do you guide architectural decisions and mentor team members?",
    purpose: "Evaluate technical leadership capabilities",
    followUp: "How do you balance technical debt with feature delivery?",
  },
  "code review": {
    category: "skills",
    question: "Describe your code review process. What do you look for and how do you provide constructive feedback?",
    purpose: "Assess code quality practices and mentoring skills",
    followUp: "How do you handle disagreements during code reviews?",
  },
  // Documentation and tools
  confluence: {
    category: "skills",
    question: "How do you use Confluence for technical documentation? What types of documents do you typically create and maintain?",
    purpose: "Evaluate documentation practices",
    followUp: "How do you ensure documentation stays current with code changes?",
  },
  jira: {
    category: "skills",
    question: "How do you use Jira for project tracking? Describe your workflow for managing sprints and prioritizing work.",
    purpose: "Assess project tracking and agile tooling experience",
    followUp: "How do you handle tickets that span multiple sprints or teams?",
  },
  // Testing and QA
  "software testing": {
    category: "skills",
    question: "Describe your approach to software testing. What types of tests do you write and what coverage targets do you aim for?",
    purpose: "Evaluate testing practices and quality assurance",
    followUp: "How do you balance test coverage with development velocity?",
  },
  "release management": {
    category: "skills",
    question: "Describe your experience with release management. How do you coordinate deployments and ensure production stability?",
    purpose: "Assess release management and deployment practices",
    followUp: "How do you handle hotfixes and emergency releases?",
  },
};

// Questions for red flags
function generateRedFlagQuestions(flags: RedFlag[]): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];

  for (const flag of flags) {
    switch (flag.type) {
      case "employment_gap":
        questions.push({
          category: "red_flag",
          question: "I noticed a gap in your employment history. Can you tell me what you were doing during that time?",
          purpose: "Understand employment gap reasons",
          followUp: "How did you stay current with industry developments during that period?",
        });
        break;

      case "job_hopping":
        questions.push({
          category: "red_flag",
          question: "I see you've had several short-term positions. What led to those transitions?",
          purpose: "Assess commitment and fit patterns",
          followUp: "What would make you stay long-term in a role?",
        });
        break;

      case "career_regression":
        questions.push({
          category: "red_flag",
          question: "Your recent role seems different from your previous seniority level. Can you walk me through that decision?",
          purpose: "Understand career trajectory choices",
          followUp: "Where do you see your career heading in the next 3-5 years?",
        });
        break;

      case "vague_descriptions":
        questions.push({
          category: "red_flag",
          question: "Can you give me specific examples and metrics from your recent projects?",
          purpose: "Get concrete evidence of accomplishments",
          followUp: "What was your specific contribution vs the team's?",
        });
        break;

      case "overqualification":
        questions.push({
          category: "red_flag",
          question: "With your extensive experience, what attracts you to this particular role?",
          purpose: "Assess long-term fit and expectations",
          followUp: "How do you see this role fitting into your career goals?",
        });
        break;
    }
  }

  return questions;
}

// Questions for missing skills
function generateMissingSkillQuestions(missingSkills: string[]): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];

  if (missingSkills.length > 0) {
    const skillList = missingSkills.slice(0, 3).join(", ");
    questions.push({
      category: "skills",
      question: `The role requires ${skillList}. What's your experience level with these, and how quickly could you get up to speed?`,
      purpose: "Assess learning ability and skill gaps",
      followUp: "Describe a time you had to learn a new technology quickly.",
    });
  }

  return questions;
}

// Standard behavioral questions
const BEHAVIORAL_QUESTIONS: InterviewQuestion[] = [
  {
    category: "behavioral",
    question: "Tell me about a project that didn't go as planned. What happened and what did you learn?",
    purpose: "Assess problem-solving and self-awareness",
    followUp: "What would you do differently?",
  },
  {
    category: "behavioral",
    question: "Describe a situation where you had to work with a difficult colleague or stakeholder.",
    purpose: "Evaluate interpersonal skills",
    followUp: "How did you maintain professionalism?",
  },
  {
    category: "behavioral",
    question: "Tell me about a time you had to make a decision with incomplete information.",
    purpose: "Assess decision-making under uncertainty",
    followUp: "How do you balance speed vs accuracy in decisions?",
  },
];

// Generate a dynamic question for skills not in SKILL_QUESTIONS
function generateDynamicSkillQuestion(skill: string, isMatched: boolean): InterviewQuestion {
  const skillCapitalized = skill.charAt(0).toUpperCase() + skill.slice(1);

  if (isMatched) {
    return {
      category: "skills",
      question: `Tell me about your experience with ${skill}. What specific projects have you used it in and what was your role?`,
      purpose: `Verify depth of ${skill} experience claimed on resume`,
      followUp: `What challenges have you faced with ${skill} and how did you overcome them?`,
    };
  } else {
    return {
      category: "skills",
      question: `The role requires ${skill}. What's your familiarity with it, and how would you approach getting up to speed?`,
      purpose: `Assess learning ability and ${skill} gap`,
      followUp: `Have you worked with similar technologies that would help you learn ${skill}?`,
    };
  }
}

// Generate questions for certifications if mentioned in JD
function generateCertificationQuestions(matchedSkills: string[], missingSkills: string[]): InterviewQuestion[] {
  const certKeywords = ["certified", "certification", "pmp", "cissp", "aws certified", "oracle certified", "scrum master"];
  const questions: InterviewQuestion[] = [];

  const allSkills = [...matchedSkills, ...missingSkills];
  const hasCertRequirement = allSkills.some(skill =>
    certKeywords.some(keyword => skill.toLowerCase().includes(keyword))
  );

  if (hasCertRequirement) {
    questions.push({
      category: "skills",
      question: "This role mentions specific certifications. Which relevant certifications do you hold, and how have they influenced your professional approach?",
      purpose: "Verify certifications and assess their practical application",
      followUp: "Are you currently pursuing any additional certifications?",
    });
  }

  return questions;
}

// Generate questions for federal/government experience if applicable
function generateGovernmentExperienceQuestions(jobTitle: string): InterviewQuestion[] {
  const govKeywords = ["federal", "government", "fec", "dod", "agency", "clearance", "hspd"];
  const isGovRole = govKeywords.some(keyword => jobTitle.toLowerCase().includes(keyword));

  if (isGovRole) {
    return [{
      category: "experience",
      question: "This is a federal government role. Describe your experience working with government agencies or in regulated environments.",
      purpose: "Assess government/compliance experience and cultural fit",
      followUp: "How do you handle the documentation and compliance requirements typical in government work?",
    }];
  }

  return [];
}

export function generateInterviewQuestions(
  matchedSkills: string[],
  missingSkills: string[],
  redFlags: RedFlag[],
  jobTitle: string,
  jdRequiredSkills: string[] = []
): InterviewQuestions {
  const questions: InterviewQuestion[] = [];
  const addedSkills = new Set<string>();

  // Clean up job title - remove "role" suffix if present to avoid "role role"
  const cleanTitle = jobTitle.replace(/\s+role$/i, "").trim() || "this position";

  // Add role-specific opener
  questions.push({
    category: "role_specific",
    question: `Walk me through your experience that's most relevant to the ${cleanTitle} position.`,
    purpose: "Get overall context and presentation skills",
    followUp: "What aspects of this role excite you most?",
  });

  // Add government experience question if applicable
  questions.push(...generateGovernmentExperienceQuestions(cleanTitle));

  // Prioritize JD required skills for questions (these are the most important)
  const prioritySkills = jdRequiredSkills.length > 0 ? jdRequiredSkills : matchedSkills;

  // Add questions for key JD-required skills first
  for (const skill of prioritySkills.slice(0, 4)) {
    const skillLower = skill.toLowerCase();
    if (addedSkills.has(skillLower)) continue;

    const isMatched = matchedSkills.some(s => s.toLowerCase() === skillLower);

    if (SKILL_QUESTIONS[skillLower]) {
      if (isMatched) {
        questions.push(SKILL_QUESTIONS[skillLower]);
      } else {
        // Skill is required by JD but not matched - probe for experience
        const baseQuestion = SKILL_QUESTIONS[skillLower];
        questions.push({
          ...baseQuestion,
          question: `This role requires ${skill}. ${baseQuestion.question}`,
          purpose: `Verify ${skill} experience for role requirements`,
        });
      }
    } else {
      questions.push(generateDynamicSkillQuestion(skill, isMatched));
    }
    addedSkills.add(skillLower);
  }

  // Add questions for matched skills not yet covered (verify depth)
  for (const skill of matchedSkills.slice(0, 3)) {
    const skillLower = skill.toLowerCase();
    if (addedSkills.has(skillLower)) continue;

    if (SKILL_QUESTIONS[skillLower]) {
      questions.push(SKILL_QUESTIONS[skillLower]);
    } else {
      questions.push(generateDynamicSkillQuestion(skill, true));
    }
    addedSkills.add(skillLower);
  }

  // Add questions for critical missing skills
  for (const skill of missingSkills.slice(0, 2)) {
    const skillLower = skill.toLowerCase();
    if (addedSkills.has(skillLower)) continue;

    if (SKILL_QUESTIONS[skillLower]) {
      const baseQuestion = SKILL_QUESTIONS[skillLower];
      questions.push({
        ...baseQuestion,
        question: `The role requires ${skill}, but we'd like to understand your background. ${baseQuestion.question}`,
        purpose: `Assess ${skill} gap and learning potential`,
      });
    } else {
      questions.push(generateDynamicSkillQuestion(skill, false));
    }
    addedSkills.add(skillLower);
  }

  // Add certification questions if relevant
  questions.push(...generateCertificationQuestions(matchedSkills, missingSkills));

  // Add red flag questions
  questions.push(...generateRedFlagQuestions(redFlags));

  // Add behavioral questions
  questions.push(...BEHAVIORAL_QUESTIONS.slice(0, 2));

  // Closing question
  questions.push({
    category: "role_specific",
    question: "What questions do you have for me about the role or the team?",
    purpose: "Assess candidate's interest and preparation",
  });

  const summary = `Generated ${questions.length} interview questions covering: role fit, ${matchedSkills.length > 0 ? "skill verification, " : ""}${missingSkills.length > 0 ? "gap assessment, " : ""}${redFlags.length > 0 ? "concern areas, " : ""}and behavioral assessment.`;

  return {
    questions,
    summary,
  };
}
