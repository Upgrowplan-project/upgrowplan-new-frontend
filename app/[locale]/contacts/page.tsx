import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import ContactsPageEn from "../../contacts/page.en";
import ContactsPageRu from "../../contacts/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.contacts;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function ContactsLocalePage({ params }: Params) {
  return params.locale === "ru" ? <ContactsPageRu /> : <ContactsPageEn />;
}
