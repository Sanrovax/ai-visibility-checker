"use client";

import { useState } from "react";
import CheckForm, { type FormValues } from "@/components/CheckForm";
import ErrorView from "@/components/ErrorView";
import LoadingView from "@/components/LoadingView";
import ResultView from "@/components/ResultView";
import type { CheckResult } from "@/lib/types";

type Step = "form" | "loading" | "result" | "error";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [lastValues, setLastValues] = useState<FormValues | null>(null);

  async function runCheck(values: FormValues) {
    setLastValues(values);
    setStep("loading");
    setError("");
    window.scrollTo({ top: 0 });
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setResult(data as CheckResult);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStep("error");
    }
    window.scrollTo({ top: 0 });
  }

  function reset() {
    setResult(null);
    setStep("form");
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <a className="brand" href="/" onClick={(e) => { e.preventDefault(); reset(); }}>
            <strong>AI Visibility Check</strong>
            <span>by Sanrovax</span>
          </a>
          {step === "result" ? (
            <button className="btn btn-secondary" onClick={reset}>New check</button>
          ) : (
            <span className="header-note">Free tool · No signup needed</span>
          )}
        </div>
      </header>

      <main className="wrap">
        {step === "form" && <CheckForm initial={lastValues} onSubmit={runCheck} />}
        {step === "loading" && <LoadingView />}
        {step === "result" && result && <ResultView result={result} />}
        {step === "error" && (
          <ErrorView message={error} onRetry={() => lastValues && runCheck(lastValues)} onBack={reset} />
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap">
          Built by <a href="https://sanrovax.com">Sanrovax</a>, performance marketing for growing businesses.
        </div>
      </footer>
    </>
  );
}
