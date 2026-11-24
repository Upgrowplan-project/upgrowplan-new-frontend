// [24.11 · owner «рубрики перевести в английской локали»] One dictionary of blog rubrics. Rubrics are stored as typed in
// the admin form (mostly Russian: «ИИ», «Методичка»…); the English blog list translated them, but the English post page
// printed them raw («ИИ» on /blog/meat-proxy-ai-workflow). The list, the post pages and the home carousel use this.
const RUBRICS: Record<string, { ru: string; en: string }> = {
  "ИИ": { ru: "ИИ", en: "AI" },
  "Методичка": { ru: "Методичка", en: "How-To" },
  "Маркетинг": { ru: "Маркетинг", en: "Marketing" },
  "Кейсы": { ru: "Кейсы", en: "Case Studies" },
  "Brandsories": { ru: "Brandsories", en: "Brand Stories" },
  "Upgrowplan": { ru: "Upgrowplan", en: "Upgrowplan" },
  "Исследование рынка": { ru: "Исследование рынка", en: "Market Research" },
  "Market Research": { ru: "Исследование рынка", en: "Market Research" },
  "research": { ru: "Исследование", en: "Research" },
};

/** The rubric as the reader of `locale` should see it; an unknown rubric is shown as stored, an empty one → null. */
export function categoryLabel(category: string | null | undefined, locale: "ru" | "en"): string | null {
  const key = (category || "").trim();
  if (!key) return null;
  return RUBRICS[key]?.[locale] ?? key;
}
