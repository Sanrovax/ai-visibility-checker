export type CheckInput = {
  businessName: string;
  industry: string;
  otherIndustry?: string;
  city: string;
  website?: string;
  keywords?: string;
  hp?: string; // honeypot, must stay empty
};

export type QuestionResult = {
  question: string;
  mentioned: boolean;
  businessesNamed: string[];
};

export type PlatformResult = {
  name: string;
  mentions: number;
  total: number;
};

export type NamedCount = {
  name: string;
  count: number;
};

export type CheckResult = {
  businessName: string;
  category: string;
  city: string;
  score: number;
  label: string;
  mentions: number;
  totalChecks: number;
  platforms: PlatformResult[];
  competitors: NamedCount[];
  sources: NamedCount[];
  questions: QuestionResult[];
  suggestions: { title: string; detail: string }[];
  checkedAt: string;
  mock?: boolean;
};

export type ApiError = { error: string };
