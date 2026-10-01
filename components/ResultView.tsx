"use client";

import { useRef, useState } from "react";
import type { CheckResult } from "@/lib/types";
import LeadForm from "./LeadForm";
import FullReport from "./FullReport";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://sanrovax.com";

function tone(score: number): { cls: string; color: string } {
  if (score <= 20) return { cls: "bad", color: "#b91c1c" };
  if (score <= 50) return { cls: "warn", color: "#b45309" };
  if (score <= 75) return { cls: "good", color: "#0f766e" };
  return { cls: "great", color: "#15803d" };
}

function summary(r: CheckResult): string {
  const across = `${r.totalChecks} customer questions`;
  if (r.mentions === 0) {
    return `AI did not name ${r.businessName} in any of the ${across} we asked. Customers asking AI are being sent elsewhere.`;
  }
  return `AI named ${r.businessName} in ${r.mentions} of ${across}. ${
    r.score < 76 ? "Competitors are getting the rest of those recommendations." : "You are one of the businesses AI trusts most here."
  }`;
}

export default function ResultView({ result: r }: { result: CheckResult }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const t = tone(r.score);
  const topCompetitors = r.competitors.slice(0, 3);

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      let url: string;
      try {
        url = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      } catch {
        url = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff", skipFonts: true });
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-visibility-${r.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      a.click();
    } catch {
      alert("Download did not work on this browser. Please take a screenshot instead.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <section className="result-top">
        <p className="small muted">
          {r.businessName} · {r.category} · {r.city}
        </p>

        <div className="score-card" ref={cardRef}>
          <div className="small muted">AI Visibility Score</div>
          <div className="ring" style={{ ["--p" as string]: r.score, ["--c" as string]: t.color }} role="img" aria-label={`Score ${r.score} out of 100`}>
            <div className="ring-inner">
              <span className="ring-num">{r.score}</span>
              <span className="small muted">/ 100</span>
            </div>
          </div>
          <span className={`pill ${t.cls}`}>{r.label}</span>
          <p style={{ maxWidth: 460, color: "var(--text-2)" }}>{summary(r)}</p>
          {topCompetitors.length > 0 && (
            <p className="small muted">
              Named instead: {topCompetitors.map((c) => c.name).join(", ")}
            </p>
          )}
          <div className="card-brand">aivisibility.sanrovax.com · {new Date(r.checkedAt).toLocaleDateString("en-IN")}</div>
        </div>
        {r.mock && <p className="form-error">Test mode: these are sample results, not real AI answers.</p>}
      </section>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">AI platforms checked</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {r.platforms.map((p) => (
              <div className="bar-row" key={p.name}>
                <div className="bar-label">
                  <span>{p.name}</span>
                  <span className="muted">{p.mentions} / {p.total}</span>
                </div>
                <div className="bar"><span style={{ width: `${(p.mentions / p.total) * 100}%` }} /></div>
              </div>
            ))}
            <p className="small muted">ChatGPT, Claude and Perplexity checks are coming soon.</p>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Who AI names instead of you</div>
          {topCompetitors.length ? (
            <ul className="list">
              {topCompetitors.map((c) => (
                <li key={c.name}>
                  <span>{c.name}</span>
                  <span>named in {c.count} of {r.totalChecks}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">AI did not name specific businesses for these questions.</p>
          )}
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={download} disabled={downloading}>
          {downloading ? "Preparing image..." : "Download score card"}
        </button>
      </div>
      <p className="note">
        Directional snapshot of live AI answers on {new Date(r.checkedAt).toLocaleString("en-IN")}. Answers can change day to day.
      </p>

      {unlocked ? (
        <FullReport result={r} />
      ) : (
        <section className="unlock">
          <div className="card">
            <h2 style={{ fontSize: 22, marginBottom: 6 }}>Unlock your full report</h2>
            <p className="small muted" style={{ marginBottom: 16 }}>Free. See exactly where you are missing, and what to fix first.</p>
            <LeadForm result={r} onDone={() => setUnlocked(true)} />
          </div>
          <div>
            <div className="section-title">What the full report shows</div>
            <ul className="includes">
              {[
                "Each of the 6 questions, and whether AI named you",
                "Every competitor AI recommended, and how often",
                "The websites AI read to build its answers",
                "3 practical steps to improve your AI visibility",
              ].map((x) => (
                <li key={x}>
                  <span className="check" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="card upgrade">
        <div>
          <h3>Full check on ChatGPT, Gemini, Claude and Perplexity</h3>
          <p className="small muted">All 4 AI platforms, deeper questions, and a detailed fix plan. ₹99 per check.</p>
        </div>
        <span className="tag">Coming soon</span>
      </section>

      <section className="card cta">
        <div>
          <h3>Want us to fix this for you?</h3>
          <p className="muted" style={{ maxWidth: 520 }}>
            Sanrovax helps businesses get found and recommended by AI search and Google. Talk to our founder, free, for 15 minutes.
          </p>
        </div>
        <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a free 15-min call</a>
      </section>
    </>
  );
}
