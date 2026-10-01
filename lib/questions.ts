// Builds the questions a real customer would type into an AI assistant.
// The business name is never included: we test discovery, not "tell me about X".
export function buildQuestions(category: string, city: string, keywords?: string): string[] {
  const c = category.toLowerCase();
  const k = (keywords || "").trim();

  const questions = [
    `What is the best ${c} in ${city}?`,
    `Can you recommend a good ${c} in ${city}?`,
    `Which ${c} in ${city} has the best reviews?`,
    `I am looking for a ${c} in ${city} that is good value for money. Which ones should I consider?`,
    `${city} mein sabse accha ${c} kaunsa hai?`,
    k
      ? `Which ${c} in ${city} is known for ${k}?`
      : `Which ${c} in ${city} do people trust the most?`,
  ];
  return questions;
}
