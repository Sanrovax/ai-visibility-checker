// Fake answers for testing the full flow without an API key (MOCK_MODE=true).
export function mockAnswers(business: string, category: string, city: string): { answer: string; sources: string[] }[] {
  const others = [`City ${category} Care`, `Modern ${category} Studio`, `${city} Prime ${category}`];
  return [0, 1, 2, 3, 4, 5].map((i) => ({
    answer:
      i % 3 === 0
        ? `Popular options in ${city} include ${others[0]}, ${business} and ${others[1]}.`
        : `People in ${city} often recommend ${others[i % 3]} and ${others[(i + 1) % 3]}.`,
    sources: ["justdial.com", "google.com", i % 2 ? "practo.com" : "tripadvisor.in"],
  }));
}

export function mockNames(answers: string[], business: string, category: string, city: string): string[][] {
  const candidates = [business, `City ${category} Care`, `Modern ${category} Studio`, `${city} Prime ${category}`];
  return answers.map((a) => candidates.filter((c) => a.includes(c)));
}
