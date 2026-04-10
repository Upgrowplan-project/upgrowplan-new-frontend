import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import PlanPageEn from "../../../solutions/plan/page.en";
import PlanPageRu from "../../../solutions/plan/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.plan;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function PlanLocalePage({ params }: Params) {
  return params.locale === "ru" ? <PlanPageRu /> : <PlanPageEn />;
}
