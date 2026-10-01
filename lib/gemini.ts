// Gemini REST calls. Runs only on the server, so the API key never reaches the browser.

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function model(): string {
  return process.env.GEMINI_MODEL || "gemini-3.8-flash";
}

type GroundingChunk = { web?: { uri?: string; title?: string } };
type Candidate = {
  content?: { parts?: { text?: string }[] };
  groundingMetadata?: { groundingChunks?: GroundingChunk[] };
};
type GeminiResponse = {
  candidates?: Candidate[];
  groundingMetadata?: { groundingChunks?: GroundingChunk[] };
  error?: { message?: string };
};

async function call(body: unknown, timeoutMs: number): Promise<GeminiResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/${model()}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    const json = (await res.json()) as GeminiResponse;
    if (!res.ok) throw new Error(json.error?.message || `Gemini HTTP ${res.status}`);
    return json;
  } finally {
    clearTimeout(timer);
  }
}

function textOf(r: GeminiResponse): string {
  const parts = r.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("").trim();
}

function sourcesOf(r: GeminiResponse): string[] {
  const chunks = r.candidates?.[0]?.groundingMetadata?.groundingChunks || r.groundingMetadata?.groundingChunks || [];
  const out: string[] = [];
  for (const ch of chunks) {
    const title = ch.web?.title?.trim();
    if (title) out.push(title.replace(/^www\./, "").toLowerCase());
  }
  return out;
}

// Ask the question exactly as a customer would, with live Google Search turned on.
export async function askWithSearch(question: string): Promise<{ answer: string; sources: string[] }> {
  const r = await call(
    {
      contents: [{ role: "user", parts: [{ text: question }] }],
      tools: [{ google_search: {} }],
    },
    45000,
  );
  const answer = textOf(r);
  if (!answer) throw new Error("Empty answer from Gemini");
  return { answer, sources: sourcesOf(r) };
}

// One cheap call (no search) that lists the business names found in each answer.
export async function extractBusinessNames(answers: string[]): Promise<string[][]> {
  const numbered = answers.map((a, i) => `ANSWER ${i}:\n${a}`).join("\n\n---\n\n");
  const prompt =
    "Below are answers from an AI assistant. For each answer, list the names of specific businesses, " +
    "shops, clinics, brands or organisations it recommends or mentions. Use the names exactly as written. " +
    "Do not include generic words, platforms like Google or Justdial, or people's names unless they are the business name. " +
    "Return JSON only.\n\n" +
    numbered;

  const r = await call(
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              index: { type: "INTEGER" },
              businesses: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["index", "businesses"],
          },
        },
      },
    },
    30000,
  );

  const raw = textOf(r);
  const parsed = JSON.parse(raw) as { index: number; businesses: string[] }[];
  const out: string[][] = answers.map(() => []);
  for (const row of parsed) {
    if (Number.isInteger(row.index) && row.index >= 0 && row.index < answers.length && Array.isArray(row.businesses)) {
      out[row.index] = row.businesses.filter((b) => typeof b === "string" && b.trim().length > 1).map((b) => b.trim());
    }
  }
  return out;
}
