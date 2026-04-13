import { z } from "zod";

import { HeuristicCandidateAnalysis, InterviewQuestion } from "@/lib/types";

const aiInterviewQuestionSchema = z.object({
  category: z.enum(["skills", "experience", "behavioral", "red_flag", "role_specific"]),
  question: z.string(),
  purpose: z.string(),
  followUp: z.string().optional()
});

const aiSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  matchedRequirements: z.array(z.string()).max(6),
  missingRequirements: z.array(z.string()).max(6),
  strengths: z.array(z.string()).max(4),
  concerns: z.array(z.string()).max(4)
}).strict();

const aiInterviewQuestionsSchema = z.object({
  interviewQuestions: z.array(aiInterviewQuestionSchema).min(5).max(8)
}).strict();

type SupportedProvider = "openai" | "anthropic";

export function resolveAiProvider() {
  const configured = (process.env.AI_PROVIDER || "").toLowerCase();

  if (
    configured === "anthropic" &&
    process.env.ANTHROPIC_API_KEY
  ) {
    return {
      provider: "anthropic" as SupportedProvider,
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514"
    };
  }

  if (
    (configured === "openai" || !configured) &&
    process.env.OPENAI_API_KEY
  ) {
    return {
      provider: "openai" as SupportedProvider,
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini"
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai" as SupportedProvider,
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini"
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "anthropic" as SupportedProvider,
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514"
    };
  }

  return null;
}

async function callOpenAi(prompt: string, model: string) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You evaluate resume-to-job alignment for hiring teams. Return strict JSON only. Keep the score calibrated, evidence-based, and concise. Be conservative: missing must-have requirements should reduce the score materially."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.output_text as string;
}

async function callAnthropic(prompt: string, model: string) {
  const baseUrl = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0.2,
      system:
        "You evaluate resume-to-job alignment for hiring teams. Return strict JSON only. Keep the score calibrated, evidence-based, and concise. Be conservative: missing must-have requirements should reduce the score materially.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const textBlock = payload.content?.find?.((item: { type?: string }) => item.type === "text");
  return textBlock?.text as string;
}

function buildAnalysisPrompt(
  jobDescription: string,
  resumeText: string,
  fileName: string,
  heuristic: HeuristicCandidateAnalysis
) {
  return `Job description:
${jobDescription}

Candidate file: ${fileName}

Resume text:
${resumeText}

Heuristic baseline:
${JSON.stringify(heuristic)}

Scoring rubric:
- 85-100: strong fit with clear evidence for most must-have requirements
- 70-84: good fit with some notable gaps
- 55-69: partial fit with important gaps or uncertain evidence
- below 55: weak fit with limited direct evidence

Instructions:
- Base the score only on evidence present in the resume text
- Do not assume missing information is true
- Penalize missing must-have skills, missing years of experience, and weak role alignment
- Prefer exact requirement evidence over generic claims
- Keep summaries concise and recruiter-friendly

Return JSON with keys: score, summary, matchedRequirements, missingRequirements, strengths, concerns.`;
}

function buildInterviewQuestionsPrompt(
  jobDescription: string,
  resumeText: string,
  fileName: string,
  heuristic: HeuristicCandidateAnalysis
) {
  return `You are generating interview questions for a hiring team. Your questions MUST be directly relevant to the specific job requirements.

Job description (READ THIS CAREFULLY - questions must align with these requirements):
${jobDescription}

Candidate file:
${fileName}

Resume text:
${resumeText}

Heuristic context:
${JSON.stringify({
  matchedRequirements: heuristic.matchedRequirements,
  missingRequirements: heuristic.missingRequirements,
  strengths: heuristic.strengths,
  concerns: heuristic.concerns,
  redFlags: heuristic.redFlags,
  extractedSkills: heuristic.extractedSkills,
})}

CRITICAL Instructions:
- Generate 5 to 7 interview questions that directly address the JOB REQUIREMENTS listed in the job description
- Questions MUST reference specific technologies, skills, or requirements mentioned in the JD (e.g., if JD mentions Java, Spring, PostgreSQL, Informatica - ask about those specifically)
- For each key technical skill in the JD, create a targeted question to verify the candidate's depth
- If a JD requirement is missing from the resume, ask how they would approach learning it
- Cover: role-specific technical skills (primary focus), experience verification, and behavioral fit
- Each item must include: category, question, purpose, and optional followUp
- Allowed categories: skills, experience, behavioral, red_flag, role_specific
- Avoid generic questions like "tell me about yourself" or "what are your strengths"
- Do not mention "heuristic", "score", "AI", "red flag detector", or internal evaluation language

Return JSON with key: interviewQuestions.`;
}

export async function enrichWithAi(
  jobDescription: string,
  resumeText: string,
  fileName: string,
  heuristic: HeuristicCandidateAnalysis
) {
  const config = resolveAiProvider();

  if (!config) {
    return null;
  }

  const prompt = buildAnalysisPrompt(jobDescription, resumeText, fileName, heuristic);
  const raw =
    config.provider === "anthropic"
      ? await callAnthropic(prompt, config.model)
      : await callOpenAi(prompt, config.model);

  const parsed = aiSchema.parse(JSON.parse(raw));
  return {
    ...parsed,
    provider: config.provider,
    model: config.model
  };
}

export async function generateInterviewQuestionsWithAi(
  jobDescription: string,
  resumeText: string,
  fileName: string,
  heuristic: HeuristicCandidateAnalysis
): Promise<InterviewQuestion[] | null> {
  const config = resolveAiProvider();

  if (!config) {
    return null;
  }

  const prompt = buildInterviewQuestionsPrompt(jobDescription, resumeText, fileName, heuristic);
  const raw =
    config.provider === "anthropic"
      ? await callAnthropic(prompt, config.model)
      : await callOpenAi(prompt, config.model);

  const parsed = aiInterviewQuestionsSchema.parse(JSON.parse(raw));
  return parsed.interviewQuestions;
}
