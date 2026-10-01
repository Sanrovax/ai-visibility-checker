"use client";

import { useState } from "react";
import type { CheckResult } from "@/lib/types";

export default function LeadForm({ result, onDone }: { result: CheckResult; onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, hp,
          businessName: result.businessName,
          category: result.category,
          city: result.city,
          score: result.score,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Please check your details.");
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="lead-name">Your name</label>
        <input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} required />
      </div>
      <div className="field">
        <label htmlFor="lead-email">Email</label>
        <input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@business.com" maxLength={120} required />
      </div>
      <div className="field">
        <label htmlFor="lead-phone">WhatsApp number <span className="opt">(optional)</span></label>
        <input id="lead-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+91 98xxx xxxxx" maxLength={20} />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="lead-website">Leave this empty</label>
        <input id="lead-website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      {err && <div className="form-error" role="alert">{err}</div>}
      <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
        {busy ? "Unlocking..." : "Show my full report"}
      </button>
      <p className="small muted">We will not spam you. Sanrovax may contact you once about your result.</p>
    </form>
  );
}
