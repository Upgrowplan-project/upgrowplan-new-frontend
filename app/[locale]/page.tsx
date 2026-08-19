import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema, faqSchema, pageFaqs, speakableSchema, softwareAppSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import Header from "@/components/Header";
import HomePageEn from "./page.en";
import HomePageRu from "./page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.home;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";
  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? ["ИИ генератор бизнес-планов", "создать бизнес-план", "валидация бизнес-идеи", "синтетические респонденты", "исследование рынка ИИ", "финансовая модель онлайн", "ЮНИДО бизнес-план", "Upgrowplan"]
      : ["AI business plan generator", "business plan AI", "market research AI", "synthetic respondents", "startup validation", "financial model generator", "UNIDO business plan", "Upgrowplan"],
  };
}

export default function HomePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const faqTitle = locale === "ru" ? "Часто задаваемые вопросы" : "Frequently Asked Questions";
  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        websiteSchema(),
        speakableSchema({
          url: locale === "ru" ? "https://www.upgrowplan.com/ru" : "https://www.upgrowplan.com",
          name: locale === "ru"
            ? "Upgrowplan — ИИ Генератор бизнес-планов с валидацией рынка, синтетическими респондентами и финансовой моделью"
            : "Upgrowplan — AI Business Plan Generator with Market Validation, Synthetic Respondents & Financial Model",
          description: locale === "ru"
            ? "ИИ-генератор бизнес-планов, который сначала валидирует: тест на синтетических респондентах, живое исследование рынка из 50+ источников, план по ЮНИДО/ЕБРР, Python-финансовая модель — проверено Skeptic Agent, без галлюцинаций."
            : "AI business plan generator that validates before it generates: synthetic respondent testing, live market research from 50+ sources, UNIDO/EBRD investor-ready plan, Python financial model — Skeptic Agent verified, no hallucinations.",
          locale,
        }),
        faqSchema(pageFaqs.home[locale]),
        softwareAppSchema({
          name: "Upgrowplan",
          description: locale === "ru"
            ? "ИИ-платформа для генерации бизнес-планов по стандартам ЮНИДО/ЕБРР с живым исследованием рынка, синтетическими респондентами и Skeptic Agent-верификацией."
            : "AI platform for UNIDO/EBRD-standard business plan generation with live market research, synthetic respondents, and Skeptic Agent financial verification.",
          url: "https://www.upgrowplan.com",
          keywords: ["AI business plan generator", "UNIDO business plan", "market research AI", "synthetic respondents", "Skeptic Agent", "RAG business plan"],
        }),
      ]} />
      <Header />
      {locale === "ru" ? <HomePageRu /> : <HomePageEn />}
      <FaqSection items={pageFaqs.home[locale]} title={faqTitle} />
    </>
  );
}
