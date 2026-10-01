import { NextResponse } from "next/server";
import { askWithSearch, extractBusinessNames } from "@/lib/gemini";
import { categoryPhrase } from "@/lib/industries";
import { cacheGet, cacheSet, checkLimits } from "@/lib/limits";
import { mentionedInText, namesMatch, normalize } from "@/lib/match";
import { mockAnswers, mockNames } from "@/lib/mock";
import { buildQuestions } from "@/lib/questions";
import { countCompetitors, countSources, scoreLabel } from "@/lib/scoring";
import { buildSuggestions } from "@/lib/suggestions";
import type { CheckInput, CheckResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let body: CheckInput;
  try {
    body = (await req.json()) as CheckInput;
  } catch {
    return bad("Invalid request.");
  }

  // Bots fill hidden fields. Real people never see this one.
  if (clean(body.hp, 50)) return bad("Invalid request.");

  const businessName = clean(body.businessName, 80);
  const industry = clean(body.industry, 80);
  const city = clean(body.city, 60);
  const website = clean(body.website, 120);
  const keywords = clean(body.keywords, 100);
  const category = clean(categoryPhrase(industry, clean(body.otherIndustry, 60)), 60);

  if (businessName.length < 2) return bad("Please enter your business name.");
  if (!industry || category.length < 2) return bad("Please choose or type your industry.");
  if (city.length < 2) return bad("Please enter your city.");

  const mock = process.env.MOCK_MODE === "true";
  if (!mock && !process.env.GEMINI_API_KEY) {
    return bad("The checker is not configured yet. Please try again later.", 503);
  }

  const cacheKey = [normalize(businessName), normalize(category), normalize(city), normalize(keywords)].join("|");
  const cached = cacheGet<CheckResult>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const limit = checkLimits(ip);
  if (!limit.ok) return bad(limit.reason, 429);

  const questions = buildQuestions(category, city, keywords);

  // 1. Ask every question with live search, in parallel.
  let answers: { question: string; answer: string; sources: string[] }[];
  if (mock) {
    answers = mockAnswers(businessName, category, city).map((a, i) => ({ question: questions[i], ...a }));
  } else {
    const settled = await Promise.allSettled(questions.map((q) => askWithSearch(q)));
    answers = [];
    settled.forEach((s, i) => {
      if (s.status === "fulfilled") answers.push({ question: questions[i], ...s.value });
      else console.error("Gemini question failed:", questions[i], s.reason);
    });
    if (answers.length < 4) {
      return bad("The AI service is busy right now. Please try again in a minute.", 502);
    }
  }

  // 2. Pull out the business names each answer recommends.
  let names: string[][];
  try {
    names = mock
      ? mockNames(answers.map((a) => a.answer), businessName, category, city)
      : await extractBusinessNames(answers.map((a) => a.answer));
  } catch (e) {
    console.error("Name extraction failed:", e);
    names = answers.map(() => []);
  }

  // 3. Score.
  const questionResults = answers.map((a, i) => ({
    question: a.question,
    mentioned: mentionedInText(businessName, a.answer) || names[i].some((n) => namesMatch(businessName, n)),
    businessesNamed: names[i].slice(0, 10),
  }));
  const mentions = questionResults.filter((q) => q.mentioned).length;
  const total = questionResults.length;
  const score = Math.round((mentions / total) * 100);
  const sources = countSources(answers.flatMap((a) => a.sources));

  const result: CheckResult = {
    businessName,
    category,
    city,
    score,
    label: scoreLabel(score),
    mentions,
    totalChecks: total,
    platforms: [{ name: "Google Gemini (live search)", mentions, total }],
    competitors: countCompetitors(businessName, names),
    sources,
    questions: questionResults,
    suggestions: buildSuggestions(score, category, city, sources, Boolean(website)),
    checkedAt: new Date().toISOString(),
    ...(mock ? { mock: true } : {}),
  };

  cacheSet(cacheKey, result);
  return NextResponse.json(result);
}
