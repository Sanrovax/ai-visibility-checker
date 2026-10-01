import type { NamedCount } from "./types";

// Rule-based next steps. No extra AI call, so no extra cost.
export function buildSuggestions(
  score: number,
  category: string,
  city: string,
  sources: NamedCount[],
  hasWebsite: boolean,
): { title: string; detail: string }[] {
  const out: { title: string; detail: string }[] = [];
  const topSources = sources.slice(0, 3).map((s) => s.name);

  if (topSources.length) {
    out.push({
      title: "Get listed on the sites AI is reading",
      detail: `For your category, the AI pulled its answers from ${topSources.join(", ")}. Make sure your business is listed there with the same name, phone and address, and has recent reviews.`,
    });
  }

  out.push({
    title: "Complete your Google Business Profile",
    detail: `Fill every field, add photos, choose the right category, and ask happy customers for reviews that mention "${category}" and "${city}". AI answers lean heavily on review volume and wording.`,
  });

  out.push({
    title: hasWebsite ? "Add a page that answers these exact questions" : "Create a simple website page",
    detail: hasWebsite
      ? `Create one page for "${category} in ${city}" with your services, prices, location and a short FAQ that answers the questions in this report word for word.`
      : `AI needs a source to quote. A one-page site with your services, prices, address and an FAQ for "${category} in ${city}" gives it one.`,
  });

  if (score > 50) {
    out.push({
      title: "Get mentioned in local articles",
      detail: `Ask local blogs, news sites and "best ${category} in ${city}" lists to include you. These lists are a common source for AI recommendations.`,
    });
  }

  return out.slice(0, 3);
}
