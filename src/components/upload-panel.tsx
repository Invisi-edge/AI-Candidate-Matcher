"use client";

import { useEffect, useState, useTransition } from "react";
import { CandidateResult, RecentAnalysis } from "@/lib/types";
import { InputPanel, JD_TEMPLATES, TemplateKey } from "./form/InputPanel";
import { ResultsPanel } from "./results/ResultsPanel";

type AnalyzeResponse = {
  results: CandidateResult[];
  metadata: {
    totalCandidates: number;
    topScore: number;
    usedAi: boolean;
    provider: string;
    model: string | null;
    analysisRunId: string;
    jobId: string;
  };
};

type HistoryResponse = {
  runs: RecentAnalysis[];
};

const DEFAULT_TEMPLATE: TemplateKey = "fullStackEngineer";

export function UploadPanel() {
  const [jobDescription, setJobDescription] = useState(JD_TEMPLATES[DEFAULT_TEMPLATE].value);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>(DEFAULT_TEMPLATE);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<"single" | "batch">("batch");
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [error, setError] = useState("");
  const [usedAi, setUsedAi] = useState(false);
  const [providerLabel, setProviderLabel] = useState("heuristic");
  const [modelLabel, setModelLabel] = useState<string | null>(null);
  const [analysisRunId, setAnalysisRunId] = useState<string | null>(null);
  const [recentRuns, setRecentRuns] = useState<RecentAnalysis[]>([]);
  const [isPending, startTransition] = useTransition();

  async function loadHistory() {
    const response = await fetch("/api/history", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as HistoryResponse;
    setRecentRuns(payload.runs);
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  function handleSubmit() {
    setError("");

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);

    if (jobDescriptionFile) {
      formData.append("jobDescriptionFile", jobDescriptionFile);
    }

    const selectedResumes = uploadMode === "single" ? resumes.slice(0, 1) : resumes;
    selectedResumes.forEach((file) => formData.append("resumes", file));

    startTransition(async () => {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as AnalyzeResponse | { error: string };

      if (!response.ok || "error" in payload) {
        setResults([]);
        setUsedAi(false);
        setProviderLabel("heuristic");
        setModelLabel(null);
        setAnalysisRunId(null);
        setError("error" in payload ? payload.error : "Unable to evaluate the uploaded resumes.");
        return;
      }

      setResults(payload.results);
      setUsedAi(payload.metadata.usedAi);
      setProviderLabel(payload.metadata.provider);
      setModelLabel(payload.metadata.model);
      setAnalysisRunId(payload.metadata.analysisRunId);
      void loadHistory();
    });
  }

  return (
    <div className="workspace">
      <InputPanel
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        jobDescriptionFile={jobDescriptionFile}
        onJobDescriptionFileChange={setJobDescriptionFile}
        resumes={resumes}
        onResumesChange={setResumes}
        uploadMode={uploadMode}
        onUploadModeChange={setUploadMode}
        isPending={isPending}
        error={error}
        onSubmit={handleSubmit}
      />

      <ResultsPanel
        results={results}
        usedAi={usedAi}
        providerLabel={providerLabel}
        modelLabel={modelLabel}
        analysisRunId={analysisRunId}
        recentRuns={recentRuns}
        isLoading={isPending}
      />
    </div>
  );
}
