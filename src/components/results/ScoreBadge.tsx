"use client";

type ScoreRange = "excellent" | "good" | "fair" | "weak";

type ScoreBadgeProps = {
  score: number;
  showLabel?: boolean;
  showRing?: boolean;
  size?: "small" | "medium" | "large";
};

function getScoreRange(score: number): ScoreRange {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "fair";
  return "weak";
}

function getScoreLabel(range: ScoreRange): string {
  switch (range) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "fair":
      return "Fair";
    case "weak":
      return "Weak";
  }
}

export function ScoreBadge({
  score,
  showLabel = false,
  showRing = false,
  size = "medium",
}: ScoreBadgeProps) {
  const range = getScoreRange(score);
  const label = getScoreLabel(range);

  if (showRing) {
    const circumference = 2 * Math.PI * 36;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;

    const sizeMap = {
      small: 60,
      medium: 80,
      large: 100,
    };

    const ringSize = sizeMap[size];

    return (
      <div
        className={`score-badge-ring ${range}`}
        style={{ width: ringSize, height: ringSize }}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Score: ${score}% - ${label}`}
      >
        <svg viewBox="0 0 80 80">
          <circle className="ring-bg" cx="40" cy="40" r="36" />
          <circle
            className="ring-progress"
            cx="40"
            cy="40"
            r="36"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="score-value">{score}%</span>
        {showLabel && <span className="score-label">{label}</span>}
      </div>
    );
  }

  return (
    <div
      className={`score-badge score-badge-${range}`}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Score: ${score}% - ${label}`}
    >
      {score}%
      {showLabel && (
        <span
          style={{
            display: "block",
            fontSize: "0.65rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginTop: 4,
            opacity: 0.8,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export { getScoreRange, getScoreLabel };
