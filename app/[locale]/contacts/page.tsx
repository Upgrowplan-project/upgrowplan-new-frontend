import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { contactPageSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
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
  const locale = params.locale === "ru" ? "ru" : "en";
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(locale),
          breadcrumbSchema(breadcrumbs.contacts(locale)),
        ]}
      />
      {locale === "ru" ? <ContactsPageRu /> : <ContactsPageEn />}
    </>
  );
}
