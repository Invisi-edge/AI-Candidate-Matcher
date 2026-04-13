import { UploadPanel } from "@/components/upload-panel";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="app-header">
        <div className="app-header-copy">
          <p className="eyebrow">Internal Hiring Tool</p>
          <h1>Candidate Match Console</h1>
          <p className="app-header-text">
            Compare resumes against one job description, rank candidates by fit, and keep every
            evaluation stored for recruiter review.
          </p>
        </div>

        <div className="app-header-stats">
          <article className="header-stat">
            <span>Scoring</span>
            <strong>Heuristic + AI</strong>
          </article>
          <article className="header-stat">
            <span>Outputs</span>
            <strong>Score, reasons, gaps</strong>
          </article>
        </div>
      </section>

      <UploadPanel />
    </main>
  );
}
