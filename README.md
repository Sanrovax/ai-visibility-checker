# AI Visibility Checker 🔍

An open-source intelligence and benchmarking engine designed to analyze how major Generative AI platforms (ChatGPT, Google Gemini, Perplexity, Claude) discover, evaluate, and recommend hyper-local businesses across India.

---

## 📌 Problem Statement
As user search shifts from traditional search engine result pages (SERPs) to conversational AI answers, local businesses and SMBs face severe visibility drops. Traditional SEO practices do not ensure citations within LLM-generated recommendations.

## 🚀 Key Capabilities
- **Multi-AI Brand Recommendation Audit:** Evaluates which AI engines cite and recommend specific local businesses for high-intent category queries.
- **AEO (Answer Engine Optimization) Analysis:** Scans local structured data, schema markup (`LocalBusiness`, `GeoCoordinates`, `sameAs`), and brand entity footprint.
- **GEO (Generative Engine Optimization) Scoring:** Measures semantic authority, sentiment polarity in reviews, and knowledge graph linkages.
- **Automated Diagnostic Reports:** Generates structured Markdown and PDF audit reports offering step-by-step remediation roadmaps for business owners and agencies.

## 🏗️ Architecture & Modules
- `/core/evaluator`: Prompts multi-model APIs to benchmark category search queries across Indian metro and tier-2 regions.
- `/core/schema_parser`: Audits website JSON-LD schema, OpenGraph tags, and NAP consistency.
- `/reports/generator`: Compiles audit scores into clear, actionable AEO & GEO implementation guides.

## 🛠️ Tech Stack
- **Language:** Python 3.11+ / Node.js
- **Model Integrations:** OpenAI API (GPT-4o, Codex), Google Gemini API, Anthropic API
- **License:** MIT License

## 👨‍💻 Maintainer & Attribution
Developed and maintained by **Sandip Sahani** ([@infotosandip](https://github.com/infotosandip)) under the **Sanrovax** open-source initiative.
