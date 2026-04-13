import { Pool } from "pg";

import { CandidateResult, RecentAnalysis } from "@/lib/types";

const DATABASE_URL = process.env.DATABASE_URL;
const SCHEMA_VERSION = "2026-04-10-history-details-v3";

declare global {
  var __candidateMatcherPool: Pool | undefined;
  var __candidateMatcherSchemaReady: Promise<void> | undefined;
  var __candidateMatcherSchemaVersion: string | undefined;
}

export function getPool() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.__candidateMatcherPool) {
    global.__candidateMatcherPool = new Pool({
      connectionString: DATABASE_URL
    });
  }

  return global.__candidateMatcherPool;
}

async function ensureSchema() {
  if (
    !global.__candidateMatcherSchemaReady ||
    global.__candidateMatcherSchemaVersion !== SCHEMA_VERSION
  ) {
    const pool = getPool();
    global.__candidateMatcherSchemaVersion = SCHEMA_VERSION;
    global.__candidateMatcherSchemaReady = pool.query(`
      create table if not exists jobs (
        id uuid primary key,
        title text not null,
        description_text text not null,
        jd_file_name text,
        jd_mime_type text,
        jd_content bytea,
        created_at timestamptz not null default now()
      );

      create table if not exists analysis_runs (
        id uuid primary key,
        job_id uuid not null references jobs(id) on delete cascade,
        provider text not null,
        model text,
        total_candidates integer not null,
        created_at timestamptz not null default now()
      );

      create table if not exists candidate_evaluations (
        id uuid primary key,
        analysis_run_id uuid not null references analysis_runs(id) on delete cascade,
        candidate_name text not null,
        resume_file_name text not null,
        resume_mime_type text,
        resume_content bytea not null,
        resume_text text not null,
        score integer not null,
        summary text not null,
        matched_requirements jsonb not null default '[]'::jsonb,
        missing_requirements jsonb not null default '[]'::jsonb,
        strengths jsonb not null default '[]'::jsonb,
        concerns jsonb not null default '[]'::jsonb,
        extracted_skills jsonb not null default '[]'::jsonb,
        experience_signals jsonb not null default '[]'::jsonb,
        red_flags jsonb not null default '[]'::jsonb,
        risk_score integer,
        interview_questions jsonb not null default '[]'::jsonb,
        interview_question_source text,
        ml_prediction jsonb,
        created_at timestamptz not null default now()
      );

      alter table candidate_evaluations
        add column if not exists red_flags jsonb not null default '[]'::jsonb,
        add column if not exists risk_score integer,
        add column if not exists interview_questions jsonb not null default '[]'::jsonb,
        add column if not exists interview_question_source text,
        add column if not exists ml_prediction jsonb;

      create index if not exists idx_analysis_runs_created_at on analysis_runs(created_at desc);
      create index if not exists idx_candidate_evaluations_run_id on candidate_evaluations(analysis_run_id);
    `).then(() => undefined);
  }

  return global.__candidateMatcherSchemaReady;
}

type SaveAnalysisInput = {
  jobDescription: string;
  jobDescriptionFile: File | null;
  provider: string;
  model: string | null;
  candidates: Array<
    CandidateResult & {
      resume: File;
      resumeText: string;
    }
  >;
};

function inferJobTitle(jobDescription: string) {
  return jobDescription.split("\n").map((line) => line.trim()).find(Boolean)?.slice(0, 140) || "Untitled role";
}

export async function saveAnalysis(input: SaveAnalysisInput) {
  await ensureSchema();
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");

    const jobId = crypto.randomUUID();
    const analysisRunId = crypto.randomUUID();
    const jdBuffer =
      input.jobDescriptionFile && input.jobDescriptionFile.size > 0
        ? Buffer.from(await input.jobDescriptionFile.arrayBuffer())
        : null;

    await client.query(
      `insert into jobs (id, title, description_text, jd_file_name, jd_mime_type, jd_content)
       values ($1, $2, $3, $4, $5, $6)`,
      [
        jobId,
        inferJobTitle(input.jobDescription),
        input.jobDescription,
        input.jobDescriptionFile?.name ?? null,
        input.jobDescriptionFile?.type ?? null,
        jdBuffer
      ]
    );

    await client.query(
      `insert into analysis_runs (id, job_id, provider, model, total_candidates)
       values ($1, $2, $3, $4, $5)`,
      [analysisRunId, jobId, input.provider, input.model, input.candidates.length]
    );

    for (const candidate of input.candidates) {
      const resumeBuffer = Buffer.from(await candidate.resume.arrayBuffer());

      await client.query(
        `insert into candidate_evaluations (
           id,
           analysis_run_id,
           candidate_name,
           resume_file_name,
           resume_mime_type,
           resume_content,
           resume_text,
           score,
           summary,
           matched_requirements,
           missing_requirements,
           strengths,
           concerns,
           extracted_skills,
           experience_signals,
           red_flags,
           risk_score,
           interview_questions,
           interview_question_source,
           ml_prediction
         )
         values (
           $1, $2, $3, $4, $5, $6, $7, $8, $9,
           $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb,
           $16::jsonb, $17, $18::jsonb, $19, $20::jsonb
         )`,
        [
          crypto.randomUUID(),
          analysisRunId,
          candidate.name.replace(/\.[^.]+$/, ""),
          candidate.name,
          candidate.resume.type || null,
          resumeBuffer,
          candidate.resumeText,
          candidate.score,
          candidate.summary,
          JSON.stringify(candidate.matchedRequirements),
          JSON.stringify(candidate.missingRequirements),
          JSON.stringify(candidate.strengths),
          JSON.stringify(candidate.concerns),
          JSON.stringify(candidate.extractedSkills),
          JSON.stringify(candidate.experienceSignals),
          JSON.stringify(candidate.redFlags ?? []),
          candidate.riskScore ?? null,
          JSON.stringify(candidate.interviewQuestions ?? []),
          candidate.interviewQuestionSource ?? null,
          candidate.mlPrediction ? JSON.stringify(candidate.mlPrediction) : null
        ]
      );
    }

    await client.query("commit");

    return {
      jobId,
      analysisRunId
    };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function getRecentAnalyses(limit = 5) {
  await ensureSchema();
  const pool = getPool();
  const { rows } = await pool.query(
    `select
       ar.id as analysis_run_id,
       j.id as job_id,
       j.title,
       ar.provider,
       ar.model,
       ar.total_candidates,
       ar.created_at,
       (
         select max(score)
         from candidate_evaluations ce
         where ce.analysis_run_id = ar.id
       ) as top_score
     from analysis_runs ar
     inner join jobs j on j.id = ar.job_id
     order by ar.created_at desc
     limit $1`,
    [limit]
  );

  const recentRuns: RecentAnalysis[] = rows.map((row) => ({
    analysisRunId: row.analysis_run_id as string,
    jobId: row.job_id as string,
    title: row.title as string,
    provider: row.provider as string,
    model: row.model as string | null,
    totalCandidates: Number(row.total_candidates),
    topScore: Number(row.top_score ?? 0),
    createdAt: row.created_at as string,
    candidates: []
  }));

  if (!recentRuns.length) {
    return recentRuns;
  }

  const { rows: candidateRows } = await pool.query(
    `select
       analysis_run_id,
       id,
       candidate_name,
       score,
       summary,
       matched_requirements,
       missing_requirements,
       strengths,
       concerns,
       extracted_skills,
       experience_signals,
       red_flags,
       risk_score,
       interview_questions,
       interview_question_source,
       ml_prediction
     from candidate_evaluations
     where analysis_run_id = any($1::uuid[])
     order by analysis_run_id, score desc, created_at asc`,
    [recentRuns.map((run) => run.analysisRunId)]
  );

  const candidatesByRun = new Map<string, CandidateResult[]>();

  for (const row of candidateRows) {
    const analysisRunId = row.analysis_run_id as string;
    const candidates = candidatesByRun.get(analysisRunId) ?? [];

    candidates.push({
      id: row.id as string,
      name: row.candidate_name as string,
      score: Number(row.score),
      summary: row.summary as string,
      matchedRequirements: row.matched_requirements as string[],
      missingRequirements: row.missing_requirements as string[],
      strengths: row.strengths as string[],
      concerns: row.concerns as string[],
      extractedSkills: row.extracted_skills as string[],
      experienceSignals: row.experience_signals as string[],
      redFlags: row.red_flags as CandidateResult["redFlags"],
      riskScore: row.risk_score === null ? undefined : Number(row.risk_score),
      interviewQuestions: row.interview_questions as CandidateResult["interviewQuestions"],
      interviewQuestionSource: (row.interview_question_source as CandidateResult["interviewQuestionSource"] | null) ?? undefined,
      mlPrediction: (row.ml_prediction as CandidateResult["mlPrediction"] | null) ?? undefined
    });

    candidatesByRun.set(analysisRunId, candidates);
  }

  return recentRuns.map((run) => ({
    ...run,
    candidates: candidatesByRun.get(run.analysisRunId) ?? []
  }));
}
