import { namesMatch } from "./match";
import type { NamedCount } from "./types";

export function scoreLabel(score: number): string {
  if (score <= 20) return "AI Invisible";
  if (score <= 50) return "Emerging Presence";
  if (score <= 75) return "Solid Visibility";
  return "AI Recommended";
}

// Counts how often each other business was named across all answers.
export function countCompetitors(business: string, perAnswer: string[][]): NamedCount[] {
  const groups: { name: string; count: number }[] = [];
  for (const names of perAnswer) {
    const seenThisAnswer = new Set<number>();
    for (const name of names) {
      if (namesMatch(business, name)) continue;
      let idx = groups.findIndex((g) => namesMatch(g.name, name) || namesMatch(name, g.name));
      if (idx === -1) {
        groups.push({ name, count: 0 });
        idx = groups.length - 1;
      }
      if (!seenThisAnswer.has(idx)) {
        groups[idx].count += 1;
        seenThisAnswer.add(idx);
      }
    }
  }
  return groups.sort((a, b) => b.count - a.count).slice(0, 10);
}

export function countSources(all: string[]): NamedCount[] {
  const map = new Map<string, number>();
  for (const s of all) map.set(s, (map.get(s) || 0) + 1);
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
