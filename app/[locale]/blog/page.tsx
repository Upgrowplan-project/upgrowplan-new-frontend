import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { blogSchema, breadcrumbSchema, breadcrumbs, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import BlogPageEn from "../../blog/page.en";
import BlogPageRu from "../../blog/page.ru";
import { getCanonicalBlogPosts } from "../../blog/getBlogPosts";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.blog;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default async function BlogLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const faqTitle = locale === "ru" ? "Вопросы о бизнес-планировании с ИИ" : "AI Business Planning — FAQ";
  const posts = await getCanonicalBlogPosts();
  return (
    <>
      <JsonLd
        data={[
          blogSchema(locale),
          breadcrumbSchema(breadcrumbs.blog(locale)),
          faqSchema(pageFaqs.blog[locale]),
        ]}
      />
      {locale === "ru" ? <BlogPageRu initialPosts={posts} /> : <BlogPageEn initialPosts={posts} />}
      <FaqSection items={pageFaqs.blog[locale]} title={faqTitle} />
    </>
  );
}
