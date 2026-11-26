import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import AlternativesPage, { ALTERNATIVES_UI } from "../../../alternatives/AlternativesPage";
import { ALTERNATIVE_SLUGS, enPath, ruPath, pageText, type AlternativeSlug } from "@/lib/alternatives/data";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string; slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return ["en", "ru"].flatMap((locale) => ALTERNATIVE_SLUGS.map((slug) => ({ locale, slug })));
}

function resolve(params: Params["params"]) {
  const slug = params.slug as AlternativeSlug;
  if (!ALTERNATIVE_SLUGS.includes(slug)) return null;
  return { slug, locale: params.locale === "ru" ? ("ru" as const) : ("en" as const) };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = resolve(params);
  if (!r) return {};
  const en = pageText(r.slug, "en");
  const ru = pageText(r.slug, "ru");
  const name = en.target.name;
  return {
    ...buildMetadata({
      locale: r.locale,
      path: r.locale === "ru" ? ruPath(r.slug) : enPath(r.slug),
      enPath: enPath(r.slug),
      ruPath: ruPath(r.slug),
      title: { en: en.title, ru: ru.title },
      description: { en: en.description, ru: ru.description },
    }),
    keywords:
      r.locale === "ru"
        ? [`альтернативы ${name}`, `${name} аналоги`, `${name} цены`, "генератор бизнес-плана ИИ", "сервисы бизнес-планирования"]
        : [`${name} alternatives`, `${name} alternative`, `${name} pricing`, "AI business plan generator", "business plan software"],
  };
}

export default function AlternativesRoute({ params }: Params) {
  const r = resolve(params);
  if (!r) notFound();
  const { slug, locale } = r;
  const ru = locale === "ru";
  const ui = ALTERNATIVES_UI[locale];
  const { target, alts, faqs } = pageText(slug, locale);
  const pageUrl = `${SITE_URL}${ru ? ruPath(slug) : enPath(slug)}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: ui.home, url: ru ? `${SITE_URL}/ru` : SITE_URL },
            { name: ui.h1(target.name) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: ui.h1(target.name),
            url: pageUrl,
            numberOfItems: alts.length + 1,
            itemListElement: [
              ...alts.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.name,
                url: a.site,
              })),
              { "@type": "ListItem", position: alts.length + 1, name: "Upgrowplan", url: ru ? `${SITE_URL}/ru` : SITE_URL },
            ],
          },
          faqSchema(faqs),
        ]}
      />
      <AlternativesPage slug={slug} locale={locale} />
    </>
  );
}
