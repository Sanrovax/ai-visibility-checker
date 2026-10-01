// Name matching helpers. Kept strict on purpose: a false "mentioned" would
// inflate a business's score, which is worse than missing a rare variant.

const LEGAL_WORDS = new Set(["pvt", "private", "ltd", "limited", "llp", "inc", "co", "the"]);

// Words that describe the category, not the business. "Sharma Dental Clinic"
// should match on "sharma", not on "dental" or "clinic".
const GENERIC_WORDS = new Set([
  "clinic", "clinics", "hospital", "hospitals", "nursing", "home", "homes", "dental", "dentist",
  "care", "centre", "center", "restaurant", "cafe", "store", "stores", "shop", "shops",
  "services", "service", "solutions", "agency", "studio", "salon", "spa", "gym", "fitness",
  "hotel", "hotels", "academy", "institute", "classes", "coaching", "and", "of", "india",
  "group", "associates", "consultants", "consultancy", "realty", "estate", "real",
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9ऀ-ॿঀ-৿\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !LEGAL_WORDS.has(w))
    .join(" ");
}

function tokens(s: string): string[] {
  return normalize(s).split(" ").filter(Boolean);
}

function distinctiveTokens(name: string): string[] {
  const all = tokens(name);
  const distinct = all.filter((t) => !GENERIC_WORDS.has(t));
  return distinct.length ? distinct : all;
}

// True when `candidate` (a name pulled from an AI answer) refers to `business`.
export function namesMatch(business: string, candidate: string): boolean {
  const b = normalize(business);
  const c = normalize(candidate);
  if (!b || !c) return false;
  if (b === c) return true;
  if (b.length >= 4 && ` ${c} `.includes(` ${b} `)) return true;
  // Token match both ways: every distinctive word of the business must be in the
  // candidate, and the candidate must not add distinctive words of its own.
  // So "Sharma Dental" matches "Sharma Dental Clinic", but "Sharma Sweets" does not.
  const need = distinctiveTokens(business);
  const have = new Set(tokens(candidate));
  if (!need.length || !need.every((t) => have.has(t))) return false;
  const businessTokens = new Set(tokens(business));
  const extras = distinctiveTokens(candidate).filter((t) => !businessTokens.has(t) && !TITLE_WORDS.has(t));
  return extras.length === 0;
}

const TITLE_WORDS = new Set(["dr", "s", "mr", "mrs", "ms", "st", "sri", "shri"]);

// True when the business name appears in a full AI answer.
export function mentionedInText(business: string, answer: string): boolean {
  const b = normalize(business);
  if (b.length < 3) return false;
  const text = ` ${normalize(answer)} `;
  return text.includes(` ${b} `);
}
