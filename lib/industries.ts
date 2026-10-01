// Label shown in the dropdown -> phrase used inside customer questions.
export const INDUSTRIES: { label: string; phrase: string }[] = [
  { label: "Dentist / Dental clinic", phrase: "dental clinic" },
  { label: "Doctor / Clinic", phrase: "clinic" },
  { label: "Hospital / Nursing home", phrase: "nursing home" },
  { label: "Restaurant / Cafe", phrase: "restaurant" },
  { label: "Real estate agent / Builder", phrase: "real estate agent" },
  { label: "Coaching / Education", phrase: "coaching centre" },
  { label: "Gym / Fitness", phrase: "gym" },
  { label: "Salon / Spa", phrase: "salon" },
  { label: "Hotel / Homestay", phrase: "hotel" },
  { label: "Interior designer", phrase: "interior designer" },
  { label: "CA / Tax consultant", phrase: "chartered accountant" },
  { label: "Lawyer / Law firm", phrase: "lawyer" },
  { label: "Marketing agency", phrase: "digital marketing agency" },
  { label: "D2C / Online brand", phrase: "online brand" },
];

export const OTHER_LABEL = "Other (type your service)";

export function categoryPhrase(industry: string, otherIndustry?: string): string {
  if (industry === OTHER_LABEL) return (otherIndustry || "").trim();
  const found = INDUSTRIES.find((i) => i.label === industry);
  return found ? found.phrase : industry.trim();
}
