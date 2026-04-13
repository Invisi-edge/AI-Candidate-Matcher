"use client";

import { useState, useMemo } from "react";
import { CandidateResult, RecentAnalysis } from "@/lib/types";
import { CandidateCard } from "./CandidateCard";
import { ScoreBadge } from "./ScoreBadge";

type SortOption = "score" | "name";
type FilterOption = "all" | "excellent" | "good" | "fair" | "weak";

type ResultsPanelProps = {
  results: CandidateResult[];
  usedAi: boolean;
  providerLabel: string;
  modelLabel: string | null;
  analysisRunId: string | null;
  recentRuns: RecentAnalysis[];
  isLoading?: boolean;
};

function getScoreRange(score: number): FilterOption {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "fair";
  return "weak";
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line medium" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line medium" />
    </div>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 150ms ease",
      }}
      aria-hidden="true"
    >
      <polyline points="4 6 8 10 12 6" />
    </svg>
  );
}

export function ResultsPanel({
  results,
  usedAi,
  providerLabel,
  modelLabel,
  analysisRunId,
  recentRuns,
  isLoading = false,
}: ResultsPanelProps) {
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [expandedRuns, setExpandedRuns] = useState<Record<string, boolean>>({});

  const processedResults = useMemo(() => {
    let filtered = results;

    if (filterBy !== "all") {
      filtered = results.filter((r) => getScoreRange(r.score) === filterBy);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score;
      }
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [results, sortBy, filterBy]);

  function toggleRunExpansion(analysisRunId: string) {
    setExpandedRuns((current) => ({
      ...current,
      [analysisRunId]: !current[analysisRunId],
    }));
  }

  return (
    <section className="panel panel-results">
      <div className="panel-header">
        <p className="eyebrow">Results</p>
        <h2>Ranked candidates with match reasons and missing gaps</h2>
      </div>

      <div className="results-meta">
        <div>
          <span>Mode</span>
          <strong>
            {usedAi ? `AI + heuristic (${providerLabel})` : "Heuristic only"}
          </strong>
        </div>
        <div>
          <span>Ranking</span>
          <strong>
            {results.length
              ? `${results.length} candidates`
              : "Waiting for uploads"}
          </strong>
        </div>
        <div>
          <span>Model</span>
          <strong>{modelLabel ?? "Not configured"}</strong>
        </div>
      </div>

      {analysisRunId && (
        <p className="success-text">
          Analysis saved successfully
        </p>
      )}

      {results.length > 0 && (
        <div className="results-controls">
          <div className="results-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="select-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="score">Score (high to low)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
          <div className="results-control">
            <label htmlFor="filter-select">Filter:</label>
            <select
              id="filter-select"
              className="select-field"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            >
              <option value="all">All scores</option>
              <option value="excellent">Excellent (85+)</option>
              <option value="good">Good (70-84)</option>
              <option value="fair">Fair (55-69)</option>
              <option value="weak">Weak (&lt;55)</option>
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="results-list">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : processedResults.length > 0 ? (
        <div className="results-list">
          {processedResults.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              rank={index + 1}
              defaultExpanded={index < 3}
            />
          ))}
        </div>
      ) : results.length > 0 && filterBy !== "all" ? (
        <div className="empty-state">
          <p>No candidates match the selected filter.</p>
        </div>
      ) : (
        <div className="empty-state">
          <p>
            Upload a job description and resumes to generate ranking, scores,
            and explanations.
          </p>
        </div>
      )}

      <div className="history-block">
        <div className="panel-header">
          <p className="eyebrow">Analysis History</p>
          <h2>Saved analyses</h2>
        </div>

        {recentRuns.length > 0 ? (
          <div className="history-list">
            {recentRuns.map((run) => (
              <article className="history-card" key={run.analysisRunId}>
                <div className="history-card-top">
                  <div className="history-copy">
                    <h3>{run.title}</h3>
                    <p>
                      {run.totalCandidates} candidate{run.totalCandidates !== 1 ? "s" : ""} analyzed
                    </p>
                    <p className="history-meta">
                      <strong>{run.provider}</strong> · {run.model ?? "heuristic"} · {new Date(run.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="history-score-wrap">
                    <span className="history-score-label">Top Score</span>
                    <ScoreBadge score={run.topScore} showLabel />
                  </div>
                </div>

                <button
                  type="button"
                  className={`history-toggle ${expandedRuns[run.analysisRunId] ? "expanded" : ""}`}
                  onClick={() => toggleRunExpansion(run.analysisRunId)}
                  aria-expanded={Boolean(expandedRuns[run.analysisRunId])}
                  aria-controls={`history-run-${run.analysisRunId}`}
                >
                  <ChevronIcon expanded={Boolean(expandedRuns[run.analysisRunId])} />
                  {expandedRuns[run.analysisRunId] ? "Hide analysis" : "Show analysis"}
                </button>

                <div
                  id={`history-run-${run.analysisRunId}`}
                  className={`history-run-details ${expandedRuns[run.analysisRunId] ? "expanded" : ""}`}
                >
                  {run.candidates.length > 0 ? (
                    <div className="history-candidate-list">
                      {run.candidates.map((candidate, index) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          rank={index + 1}
                          defaultExpanded={index === 0}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="muted-copy">No candidate analysis details were saved for this run.</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">No saved analysis runs yet.</p>
        )}
      </div>
    </section>
  );
}
