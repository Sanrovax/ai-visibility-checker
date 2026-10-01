# AI Visibility Checker by Sanrovax

Free tool that checks whether AI assistants recommend a business when customers ask questions like "best dental clinic in Kolkata".

Live address: `aivisibility.sanrovax.com` (with `aivisibilitychecker.sanrovax.com` redirecting to it).

## How it works

1. The visitor enters business name, industry (or types their own service), city, and optional website and keywords.
2. The server builds 6 customer-style questions. The business name is never put in the question.
3. Each question goes to Google Gemini with live Google Search turned on.
4. One more Gemini call (no search) lists the business names in each answer.
5. Score = answers that name the business / total answers x 100.
6. Visitor sees the score, label and top competitors for free. Name + email unlocks the full report (question by question, all competitors, websites AI read, 3 next steps). That lead is saved to Supabase.

## Project layout

```
app/page.tsx              Screen flow: form > loading > result / error
app/api/check/route.ts    Runs the check (server only, holds the API key)
app/api/lead/route.ts     Saves leads to Supabase
components/               Form, loading, result, lead form, full report, error
lib/gemini.ts             Gemini API calls
lib/questions.ts          The 6 customer questions
lib/match.ts              Business name matching
lib/scoring.ts            Score, labels, competitor and source counts
lib/suggestions.ts        Next steps shown in the full report
lib/limits.ts             Per-IP and daily limits, 7-day result cache
supabase.sql              Table for leads
```

## Environment variables (set in Vercel)

| Name | Required | What it is |
|---|---|---|
| GEMINI_API_KEY | Yes | Key from aistudio.google.com |
| GEMINI_MODEL | No | Default `gemini-3.8-flash` |
| SUPABASE_URL | No | Supabase project URL. If empty, leads go to Vercel logs |
| SUPABASE_SERVICE_ROLE_KEY | No | Supabase service role key (server only) |
| NEXT_PUBLIC_BOOKING_URL | No | Where "Book a free 15-min call" goes |
| CHECKS_PER_IP_PER_DAY | No | Default 3 |
| CHECKS_PER_DAY_TOTAL | No | Default 150 |
| MOCK_MODE | No | `true` returns sample results without calling Gemini. Never on live site |

## Run on your computer (optional)

Needs Node.js 20.9 or newer.

```
npm install
cp .env.example .env.local   # then fill GEMINI_API_KEY, or set MOCK_MODE=true
npm run dev
```

Open http://localhost:3000

## Cost control

- Each check = 6 Gemini calls with search + 1 small call without search.
- Same business + category + city returns a saved result for 7 days (per server instance).
- Limits in `lib/limits.ts` are best effort. Set a monthly budget alert and cap in Google Cloud billing as the real safety net.
- Confirm current grounding pricing and any free quota on Google's pricing page before launch.

## Known limits (phase 1)

- Only Gemini is checked. ChatGPT, Claude and Perplexity are planned for the paid ₹99 check.
- Rate limits and cache live in memory, so they reset when Vercel starts a new instance. Move to Upstash Redis or Vercel KV when traffic grows.
- The full report is sent to the browser with the free result and only hidden until the email form is filled. Fine for a free tool; move it behind the server if the report becomes paid.

Sandip Sahani | Founder, Sanrovax
