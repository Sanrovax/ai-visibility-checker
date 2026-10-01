// Best-effort protection for API spend. Memory is per server instance, so this
// slows abuse but is not a hard cap. The hard cap is the budget limit you set
// in Google Cloud billing. Move this to Upstash/Vercel KV when traffic grows.

const DAY_MS = 24 * 60 * 60 * 1000;
const ipHits = new Map<string, number[]>();
let dayStart = Date.now();
let dayTotal = 0;

function num(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function checkLimits(ip: string): { ok: true } | { ok: false; reason: string } {
  const now = Date.now();
  if (now - dayStart > DAY_MS) {
    dayStart = now;
    dayTotal = 0;
  }
  const perIp = num(process.env.CHECKS_PER_IP_PER_DAY, 3);
  const total = num(process.env.CHECKS_PER_DAY_TOTAL, 150);

  if (dayTotal >= total) {
    return { ok: false, reason: "Today's free checks are used up. Please try again tomorrow." };
  }
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < DAY_MS);
  if (hits.length >= perIp) {
    return { ok: false, reason: `You have used your ${perIp} free checks for today. Please try again tomorrow.` };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  dayTotal += 1;
  if (ipHits.size > 5000) ipHits.clear();
  return { ok: true };
}

// Same business + category + city returns the saved result for 7 days.
const CACHE_TTL = 7 * DAY_MS;
const cache = new Map<string, { at: number; value: unknown }>();

export function cacheGet<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_TTL) {
    cache.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function cacheSet(key: string, value: unknown): void {
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), value });
}
