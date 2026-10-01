"use client";

import type { CheckResult } from "@/lib/types";

export default function FullReport({ result: r }: { result: CheckResult }) {
  return (
    <section style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 26 }}>Your full report</h2>

      <div className="card">
        <div className="section-title">Question by question</div>
        <ul className="q-list">
          {r.questions.map((q) => (
            <li key={q.question}>
              <span className={`q-status ${q.mentioned ? "yes" : "no"}`}>{q.mentioned ? "Named" : "Not named"}</span>
              <div>
                <div className="q-text">&ldquo;{q.question}&rdquo;</div>
                {q.businessesNamed.length > 0 && (
                  <div className="q-names">AI named: {q.businessesNamed.slice(0, 6).join(", ")}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid-2" style={{ marginTop: 0 }}>
        <div className="card">
          <div className="section-title">All competitors AI recommended</div>
          {r.competitors.length ? (
            <ul className="list">
              {r.competitors.map((c) => (
                <li key={c.name}><span>{c.name}</span><span>{c.count} of {r.totalChecks}</span></li>
              ))}
            </ul>
          ) : (
            <p className="muted">No specific competitors were named.</p>
          )}
        </div>
        <div className="card">
          <div className="section-title">Websites AI read for these answers</div>
          {r.sources.length ? (
            <ul className="list">
              {r.sources.map((s) => (
                <li key={s.name}><span>{s.name}</span><span>used {s.count}×</span></li>
              ))}
            </ul>
          ) : (
            <p className="muted">Source list was not available for this check.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-title">What to do next</div>
        <ol className="steps-todo">
          {r.suggestions.map((s) => (
            <li key={s.title}>
              <div>
                <strong>{s.title}</strong>
                <p>{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
