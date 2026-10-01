"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Writing questions your customers would ask",
  "Asking Google Gemini with live search",
  "Reading every answer",
  "Finding which businesses got named",
  "Calculating your score",
];

export default function LoadingView() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => Math.min(a + 1, STEPS.length - 1)), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="loading" aria-live="polite" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      <h2>Checking your AI visibility</h2>
      <p className="muted">This takes 15 to 40 seconds. Please keep this page open.</p>
      <ul className="steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i < active ? "done" : i === active ? "active" : ""}>
            <span className="dot" aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
