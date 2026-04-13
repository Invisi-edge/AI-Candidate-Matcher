"use client";

import { useState } from "react";
import { CandidateResult, RedFlag, MLPrediction } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";

type CandidateCardProps = {
  candidate: CandidateResult;
  rank: number;
  defaultExpanded?: boolean;
};

const MAX_VISIBLE_CHIPS = 6;

function RecommendationBadge({ recommendation }: { recommendation: MLPrediction["recommendation"] }) {
  const styles: Record<MLPrediction["recommendation"], { bg: string; color: string; label: string }> = {
    strong_yes: { bg: "var(--score-excellent-bg)", color: "var(--score-excellent)", label: "STRONG YES" },
    yes: { bg: "var(--score-good-bg)", color: "var(--score-good)", label: "YES" },
    maybe: { bg: "var(--score-fair-bg)", color: "var(--score-fair)", label: "MAYBE" },
    no: { bg: "var(--score-weak-bg)", color: "var(--score-weak)", label: "NO" },
    strong_no: { bg: "var(--score-weak-bg)", color: "var(--score-weak)", label: "STRONG NO" },
  };
  const style = styles[recommendation];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontWeight: 700,
        background: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
}

function RedFlagBadge({ severity }: { severity: RedFlag["severity"] }) {
  const colors = {
    high: { bg: "var(--score-weak-bg)", color: "var(--score-weak)", border: "var(--score-weak-border)" },
    medium: { bg: "var(--score-fair-bg)", color: "var(--score-fair)", border: "var(--score-fair-border)" },
    low: { bg: "rgba(107, 114, 128, 0.1)", color: "#6b7280", border: "rgba(107, 114, 128, 0.2)" },
  };
  const style = colors[severity];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {severity}
    </span>
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
    >
      <polyline points="4 6 8 10 12 6" />
    </svg>
  );
}

export function CandidateCard({
  candidate,
  rank,
  defaultExpanded = false,
}: CandidateCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const visibleSkills = candidate.extractedSkills.slice(0, MAX_VISIBLE_CHIPS);
  const hiddenSkillsCount = candidate.extractedSkills.length - MAX_VISIBLE_CHIPS;

  return (
    <article
      className={`candidate-card ${isExpanded ? "expanded" : ""}`}
      aria-labelledby={`candidate-${candidate.id}-name`}
    >
      <div className="candidate-header">
        <div>
          <p className="candidate-rank">#{rank}</p>
          <h3 id={`candidate-${candidate.id}-name`}>{candidate.name}</h3>
        </div>
        <ScoreBadge score={candidate.score} showLabel />
      </div>

      <p className="candidate-summary">{candidate.summary}</p>

      {/* ML Prediction */}
      {candidate.mlPrediction && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          background: "rgba(0,0,0,0.02)",
          borderRadius: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>AI Recommendation:</span>
            <RecommendationBadge recommendation={candidate.mlPrediction.recommendation} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Confidence:</span>
            <strong style={{ fontSize: "0.9rem" }}>{candidate.mlPrediction.confidence}%</strong>
          </div>
          {candidate.mlPrediction.topPositiveFactors.length > 0 && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--score-excellent)" }}>
                ✓ {candidate.mlPrediction.topPositiveFactors[0]}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="chips">
        {visibleSkills.map((skill) => (
          <span className="chip" key={skill}>
            {skill}
          </span>
        ))}
        {hiddenSkillsCount > 0 && (
          <span className="chip chip-more">+{hiddenSkillsCount} more</span>
        )}
      </div>

      <div
        id={`candidate-${candidate.id}-details`}
        className={`candidate-details ${isExpanded ? "expanded" : ""}`}
      >
        <div className="candidate-grid">
          <div>
            <h4>Why it matches</h4>
            <ul>
              {candidate.matchedRequirements.length > 0 ? (
                candidate.matchedRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))
              ) : (
                <li>No strong matches detected.</li>
              )}
            </ul>
          </div>

          <div>
            <h4>What is missing</h4>
            <ul>
              {candidate.missingRequirements.length > 0 ? (
                candidate.missingRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))
              ) : (
                <li>No major missing requirement detected.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="candidate-grid">
          <div>
            <h4>Strengths</h4>
            <ul>
              {candidate.strengths.length > 0 ? (
                candidate.strengths.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>No specific strengths highlighted.</li>
              )}
            </ul>
          </div>
          <div>
            <h4>Concerns</h4>
            <ul>
              {candidate.concerns.length > 0 ? (
                candidate.concerns.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>No major concern detected in the current pass.</li>
              )}
            </ul>
          </div>
        </div>

        {candidate.experienceSignals.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <h4 style={{ marginBottom: 8, fontSize: "0.86rem", fontWeight: 600, color: "var(--muted)" }}>
              Experience Signals
            </h4>
            <div className="chips">
              {candidate.experienceSignals.map((signal) => (
                <span className="chip" key={signal}>
                  {signal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Red Flags Section */}
        {candidate.redFlags && candidate.redFlags.length > 0 && (
          <div style={{ marginTop: 18, padding: 16, background: "var(--score-weak-bg)", borderRadius: 12, border: "1px solid var(--score-weak-border)" }}>
            <h4 style={{ marginBottom: 12, fontSize: "0.9rem", fontWeight: 600, color: "var(--score-weak)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚠️</span> Red Flags ({candidate.redFlags.length})
              {candidate.riskScore !== undefined && (
                <span style={{ marginLeft: "auto", fontSize: "0.8rem", fontWeight: 500 }}>
                  Risk Score: {candidate.riskScore}/100
                </span>
              )}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {candidate.redFlags.map((flag, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RedFlagBadge severity={flag.severity} />
                    <strong style={{ fontSize: "0.9rem" }}>{flag.description}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", paddingLeft: 4 }}>
                    {flag.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Questions Section */}
        {candidate.interviewQuestions && candidate.interviewQuestions.length > 0 && (
          <div style={{ marginTop: 18, padding: 16, background: "rgba(15, 118, 110, 0.06)", borderRadius: 12, border: "1px solid rgba(15, 118, 110, 0.15)" }}>
            <h4 style={{ marginBottom: 12, fontSize: "0.9rem", fontWeight: 600, color: "var(--accent-strong)" }}>
              📋 Suggested Interview Questions ({candidate.interviewQuestions.length})
            </h4>
            <p style={{ margin: "0 0 12px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>
              {candidate.interviewQuestionSource === "ai" ? "AI-generated" : "Heuristic fallback"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {candidate.interviewQuestions.slice(0, 5).map((q, idx) => (
                <div key={idx} style={{ paddingBottom: 10, borderBottom: idx < 4 ? "1px solid var(--line)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      background: "rgba(15, 118, 110, 0.1)",
                      color: "var(--accent-strong)",
                    }}>
                      {q.category.replace("_", " ")}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "0.9rem", fontWeight: 500 }}>
                    {q.question}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>
                    Purpose: {q.purpose}
                  </p>
                  {q.followUp && (
                    <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
                      ↳ Follow-up: {q.followUp}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`expand-button ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`candidate-${candidate.id}-details`}
      >
        <ChevronIcon expanded={isExpanded} />
        {isExpanded ? "Show less" : "Show details"}
      </button>
    </article>
  );
}
