"use client";

import { useState } from "react";
import { INDUSTRIES, OTHER_LABEL } from "@/lib/industries";

export type FormValues = {
  businessName: string;
  industry: string;
  otherIndustry: string;
  city: string;
  website: string;
  keywords: string;
  hp: string;
};

const EMPTY: FormValues = { businessName: "", industry: "", otherIndustry: "", city: "", website: "", keywords: "", hp: "" };

export default function CheckForm({
  initial,
  onSubmit,
}: {
  initial: FormValues | null;
  onSubmit: (v: FormValues) => void;
}) {
  const [v, setV] = useState<FormValues>(initial || EMPTY);
  const [err, setErr] = useState("");

  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV({ ...v, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (v.businessName.trim().length < 2) return setErr("Please enter your business name.");
    if (!v.industry) return setErr("Please choose your industry.");
    if (v.industry === OTHER_LABEL && v.otherIndustry.trim().length < 2) return setErr("Please type your service or industry.");
    if (v.city.trim().length < 2) return setErr("Please enter your city.");
    setErr("");
    onSubmit(v);
  }

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">AI search visibility</div>
          <h1>Is AI recommending your business, or your competitor?</h1>
          <p className="hero-lead">
            We ask AI the same questions your customers ask, like &ldquo;best dental clinic in Kolkata&rdquo;, and show
            you whether your business gets named or someone else does.
          </p>
          <ul className="points">
            <li>Live answers from Google Gemini with real-time search</li>
            <li>6 customer-style questions for your city and service</li>
            <li>Free, and results in under a minute</li>
          </ul>
        </div>

        <form className="card form-card" onSubmit={submit} noValidate>
          <div>
            <h2>Get your free score</h2>
            <p className="small muted">No email needed to see your result.</p>
          </div>

          <div className="field">
            <label htmlFor="businessName">Business name</label>
            <input id="businessName" value={v.businessName} onChange={set("businessName")} placeholder="e.g. Sharma Dental Clinic" maxLength={80} autoComplete="organization" required />
          </div>

          <div className="field">
            <label htmlFor="industry">Industry</label>
            <select id="industry" value={v.industry} onChange={set("industry")} required>
              <option value="" disabled>Select your industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i.label} value={i.label}>{i.label}</option>
              ))}
              <option value={OTHER_LABEL}>{OTHER_LABEL}</option>
            </select>
          </div>

          {v.industry === OTHER_LABEL && (
            <div className="field">
              <label htmlFor="otherIndustry">Your service</label>
              <input id="otherIndustry" value={v.otherIndustry} onChange={set("otherIndustry")} placeholder="e.g. affordable nursing home for elderly" maxLength={60} />
              <span className="field-hint">Write it the way a customer would search for it.</span>
            </div>
          )}

          <div className="row-2">
            <div className="field">
              <label htmlFor="city">City or area</label>
              <input id="city" value={v.city} onChange={set("city")} placeholder="e.g. Kolkata" maxLength={60} autoComplete="address-level2" required />
            </div>
            <div className="field">
              <label htmlFor="website">Website <span className="opt">(optional)</span></label>
              <input id="website" value={v.website} onChange={set("website")} placeholder="yourbusiness.com" maxLength={120} inputMode="url" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="keywords">What customers look for <span className="opt">(optional)</span></label>
            <input id="keywords" value={v.keywords} onChange={set("keywords")} placeholder="e.g. 24x7 care, low price, senior citizens" maxLength={100} />
          </div>

          <div className="hp" aria-hidden="true">
            <label htmlFor="company_url">Leave this empty</label>
            <input id="company_url" tabIndex={-1} autoComplete="off" value={v.hp} onChange={set("hp")} />
          </div>

          {err && <div className="form-error" role="alert">{err}</div>}

          <button type="submit" className="btn btn-primary btn-block">Check my AI visibility</button>
          <p className="small muted" style={{ textAlign: "center" }}>No credit card. No signup.</p>
        </form>
      </section>

      <section className="faq" aria-label="Questions">
        <div>
          <h3>What is AI visibility?</h3>
          <p>
            More customers now ask AI assistants for recommendations instead of scrolling Google. AI visibility shows
            how often these assistants name your business in their answers. Some people now also call this AI search
            &ldquo;Super Intelligence&rdquo; or SI search. It means the same thing.
          </p>
        </div>
        <div>
          <h3>How does the check work?</h3>
          <p>
            We create 6 questions a real customer would ask about your service in your city, ask them to Google Gemini
            with live search on, and count how many answers mention your business.
          </p>
        </div>
        <div>
          <h3>Is the score exact?</h3>
          <p>
            It is a directional snapshot. AI answers change from day to day and person to person, so treat the score
            as a health check and run it again every few weeks.
          </p>
        </div>
      </section>
    </>
  );
}
