export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { saveAnalysis } from "@/lib/db";
import { extractTextFromFile } from "@/lib/extract-text";
import { enrichWithAi, generateInterviewQuestionsWithAi, resolveAiProvider } from "@/lib/llm";
import { runHeuristicAnalysis } from "@/lib/matcher";
import { CandidateResult } from "@/lib/types";

const DEFAULT_ANALYSIS_CONCURRENCY = 3;

function cleanJobDescription(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getAnalysisConcurrency() {
  const parsed = Number(process.env.ANALYSIS_CONCURRENCY || DEFAULT_ANALYSIS_CONCURRENCY);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_ANALYSIS_CONCURRENCY;
  }

  return Math.min(Math.floor(parsed), 6);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );

  return results;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jdText = String(formData.get("jobDescription") || "");
    const jdFile = formData.get("jobDescriptionFile");
    const resumeEntries = formData.getAll("resumes").filter((item): item is File => item instanceof File);

    let jobDescription = cleanJobDescription(jdText);

    if (!jobDescription && jdFile instanceof File && jdFile.size > 0) {
      jobDescription = await extractTextFromFile(jdFile);
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Provide a job description in the text area or upload a JD file." },
        { status: 400 }
      );
    }

    if (!resumeEntries.length) {
      return NextResponse.json(
        { error: "Upload at least one candidate resume." },
        { status: 400 }
      );
    }

    const providerConfig = resolveAiProvider();
    const analyzedCandidates = await mapWithConcurrency(
      resumeEntries,
      getAnalysisConcurrency(),
      async (resume) => {
        const resumeText = await extractTextFromFile(resume);
        const heuristic = runHeuristicAnalysis(jobDescription, resumeText);
        const [ai, aiInterviewQuestions] = await Promise.all([
          enrichWithAi(jobDescription, resumeText, resume.name, heuristic).catch(() => null),
          generateInterviewQuestionsWithAi(
            jobDescription,
            resumeText,
            resume.name,
            heuristic
          ).catch(() => null),
        ]);

        return {
          id: `${resume.name}-${resume.lastModified}`,
          name: resume.name,
          score: ai?.score ?? heuristic.score,
          summary: ai?.summary ?? heuristic.summary,
          matchedRequirements: ai?.matchedRequirements ?? heuristic.matchedRequirements,
          missingRequirements: ai?.missingRequirements ?? heuristic.missingRequirements,
          strengths: ai?.strengths ?? heuristic.strengths,
          concerns: ai?.concerns ?? heuristic.concerns,
          extractedSkills: heuristic.extractedSkills,
          experienceSignals: heuristic.experienceSignals,
          redFlags: heuristic.redFlags,
          riskScore: heuristic.riskScore,
          interviewQuestions: aiInterviewQuestions ?? heuristic.interviewQuestions,
          interviewQuestionSource: aiInterviewQuestions ? ("ai" as const) : ("heuristic" as const),
          mlPrediction: heuristic.mlPrediction,
          resume,
          resumeText
        };
      }
    );

    const results: CandidateResult[] = analyzedCandidates.map(({ resume, resumeText, ...candidate }) => candidate);
    results.sort((a, b) => b.score - a.score);
    analyzedCandidates.sort((a, b) => b.score - a.score);

    const saved = await saveAnalysis({
      jobDescription,
      jobDescriptionFile: jdFile instanceof File ? jdFile : null,
      provider: providerConfig?.provider ?? "heuristic",
      model: providerConfig?.model ?? null,
      candidates: analyzedCandidates
    });

    return NextResponse.json({
      results,
      metadata: {
        totalCandidates: results.length,
        topScore: results[0]?.score ?? 0,
        usedAi: Boolean(providerConfig),
        provider: providerConfig?.provider ?? "heuristic",
        model: providerConfig?.model ?? null,
        analysisRunId: saved.analysisRunId,
        jobId: saved.jobId
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The analysis failed while reading the uploaded files."
      },
      { status: 500 }
    );
  }
}
