import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import AboutPageEn from "../../about/page.en";
import AboutPageRu from "../../about/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.about;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function AboutLocalePage({ params }: Params) {
  return params.locale === "ru" ? <AboutPageRu /> : <AboutPageEn />;
}
