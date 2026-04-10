import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import SynthFocusLabPageEn from "../../../solutions/synthFocusLab/page.en";
import SynthFocusLabPageRu from "../../../solutions/synthFocusLab/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.synthFocusLab;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function SynthFocusLabLocalePage({ params }: Params) {
  return params.locale === "ru" ? <SynthFocusLabPageRu /> : <SynthFocusLabPageEn />;
}
