// Internal link rules: product name mentions → product page URLs
// Only exact product names are linked (never generic terms like "business plan")
// Only the FIRST occurrence per post is linked to avoid over-optimization

interface LinkRule {
  pattern: RegExp;
  url: string;
}

const rulesEn: LinkRule[] = [
  { pattern: /PlanMaster AI/,         url: "/ai-business-plan-generator" },
  { pattern: /MarketSense AI Agent/,  url: "/solutions/marketResearch/descriptionPage" },
  { pattern: /MarketSense AI/,        url: "/solutions/marketResearch/descriptionPage" },
  { pattern: /MarketSense/,           url: "/solutions/marketResearch/descriptionPage" },
  { pattern: /Synth Focus Lab/,       url: "/solutions/synthetic-customer-research" },
  { pattern: /Business Pulse/,        url: "/solutions/businessPulse" },
  { pattern: /FinPilot Free/,         url: "/solutions/fin-buddy" },
  { pattern: /FinPilot/,              url: "/solutions/fin-buddy" },
  { pattern: /Open Abroad/,           url: "/solutions/openAbroad" },
];

const rulesRu: LinkRule[] = [
  { pattern: /PlanMaster AI/,         url: "/ai-business-plan-generator" },
  { pattern: /MarketSense AI Agent/,  url: "/ru/solutions/marketResearch/descriptionPage" },
  { pattern: /MarketSense AI/,        url: "/ru/solutions/marketResearch/descriptionPage" },
  { pattern: /MarketSense/,           url: "/ru/solutions/marketResearch/descriptionPage" },
  { pattern: /Synth Focus Lab/,       url: "/solutions/synthetic-customer-research" },
  { pattern: /Business Pulse/,        url: "/solutions/businessPulse" },
  { pattern: /FinPilot Free/,         url: "/solutions/fin-buddy" },
  { pattern: /FinPilot/,             url: "/solutions/fin-buddy" },
  { pattern: /Open Abroad/,           url: "/solutions/openAbroad" },
];

// Applies internal links to the first occurrence of each product name.
// Skips text already inside a markdown link [...](...) to avoid double-linking.
export function applyInternalLinks(text: string, locale: "en" | "ru"): string {
  const rules = locale === "ru" ? rulesRu : rulesEn;
  let result = text;

  for (const { pattern, url } of rules) {
    // Find the first occurrence that is NOT already inside a markdown link
    const globalPattern = new RegExp(pattern.source, "g");
    let replaced = false;
    result = result.replace(globalPattern, (match, offset) => {
      if (replaced) return match;
      // Check if this match is already inside [...](...) — look for preceding [
      const before = result.slice(0, offset);
      const openBracket = before.lastIndexOf("[");
      const closeBracket = before.lastIndexOf("]");
      if (openBracket > closeBracket) return match; // inside link text
      replaced = true;
      return `[${match}](${url})`;
    });
  }

  return result;
}
