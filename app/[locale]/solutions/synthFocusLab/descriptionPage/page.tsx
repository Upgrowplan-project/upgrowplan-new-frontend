import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import SynthFocusLabDescriptionPageEn from "../../../../solutions/synthFocusLab/descriptionPage/page.en";
import SynthFocusLabDescriptionPageRu from "../../../../solutions/synthFocusLab/descriptionPage/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.synthFocusLabDescription;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function SynthFocusLabDescriptionLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <SynthFocusLabDescriptionPageRu />
  ) : (
    <SynthFocusLabDescriptionPageEn />
  );
}
