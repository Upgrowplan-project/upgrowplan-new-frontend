import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BLOG_SLUG_REDIRECTS, getBlogPostBySlug, getCanonicalBlogPosts } from "../../../blog/getBlogPosts";
import { JsonLd } from "@/components/JsonLd";
import Header from "@/components/Header";
import FormattedPostContent from "@/components/FormattedPostContent";
import { applyInternalLinks } from "@/lib/blog/internalLinks";

const ARTICLE_BODY_CSS = `
.article-body { color:#0f172a; font-size:1.05rem; line-height:1.75; }
.article-body h2 { color:#1e6078; font-weight:800; margin:2rem 0 .75rem; font-size:1.5rem; }
.article-body h3 { color:#1e6078; font-weight:700; margin:1.5rem 0 .5rem; font-size:1.2rem; }
.article-body p { margin:0 0 1rem; }
.article-body ul, .article-body ol { margin:0 0 1rem 1.25rem; }
.article-body li { margin:.35rem 0; }
.article-body a { color:#0683f5; text-decoration:underline; }
.article-body blockquote { border-left:4px solid #0683f5; background:#f0f7ff; margin:1.25rem 0; padding:.75rem 1rem; border-radius:0 8px 8px 0; color:#334155; }
.article-body table { width:100%; border-collapse:collapse; margin:1.25rem 0; font-size:.95rem; display:block; overflow-x:auto; }
.article-body th, .article-body td { border:1px solid #e2e8f0; padding:.5rem .6rem; text-align:left; }
.article-body th { background:#f1f5f9; color:#1e6078; }
.article-body code { background:#f1f5f9; padding:.1rem .35rem; border-radius:4px; font-size:.9em; }
.article-body hr { border:none; border-top:1px solid #e2e8f0; margin:2rem 0; }
`;

const SITE_URL = "https://www.upgrowplan.com";

type Props = { params: { locale: string; slug: string } };

export async function generateStaticParams() {
  const posts = await getCanonicalBlogPosts();
  const slugged = posts.filter((p) => p.slug);
  return ["ru", "en"].flatMap((locale) =>
    slugged.map((p) => ({ locale, slug: p.slug! }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const canonicalSlug = BLOG_SLUG_REDIRECTS[params.slug];
  if (canonicalSlug) {
    const isRu = params.locale === "ru";
    const canonicalPath = isRu ? `/ru/blog/${canonicalSlug}` : `/blog/${canonicalSlug}`;
    return {
      alternates: { canonical: `${SITE_URL}${canonicalPath}` },
      robots: { index: false, follow: true },
    };
  }
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  const isRu = params.locale === "ru";
  const title = (isRu ? post.titleRu : post.titleEn) || post.titleEn || post.titleRu || "Blog";
  const description = (isRu ? post.descriptionRu : post.descriptionEn) || "";
  const url = `${SITE_URL}/${params.locale}/blog/${params.slug}`;
  const enUrl = `${SITE_URL}/blog/${params.slug}`;
  const ruUrl = `${SITE_URL}/ru/blog/${params.slug}`;
  return {
    title: `${title} | Upgrowplan`,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: enUrl,
        "x-default": enUrl,
        ...((post.messageRu || post.bodyRu) ? { ru: ruUrl } : {}),
        ...(post.messageEn ? {} : {}),
      },
    },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function BlogPostLocalePage({ params }: Props) {
  const canonicalSlug = BLOG_SLUG_REDIRECTS[params.slug];
  if (canonicalSlug) {
    redirect(params.locale === "ru" ? `/ru/blog/${canonicalSlug}` : `/blog/${canonicalSlug}`);
  }
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const isRu = params.locale === "ru";
  const locale = isRu ? "ru" : "en";

  const bodyHtml = isRu ? (post.bodyRu || post.bodyEn || "") : (post.bodyEn || post.bodyRu || "");
  const hasBody = !!bodyHtml;

  const message = applyInternalLinks(
    isRu ? post.messageRu || post.messageEn : post.messageEn || post.messageRu,
    locale
  );
  const title = (isRu ? post.titleRu : post.titleEn) || "";
  const description = (isRu ? (post.metaDescriptionRu || post.descriptionRu) : (post.metaDescriptionEn || post.descriptionEn)) || "";
  const url = `${SITE_URL}${isRu ? "/ru" : ""}/blog/${params.slug}`;
  const author = post.author || "Upgrowplan team";
  const datePublished = post.createdAt.slice(0, 10);

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: isRu ? "ru" : "en",
    image: { "@type": "ImageObject", url: ogImageUrl, width: 1200, height: 630 },
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "Upgrowplan",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/LogoUpGrowSmall2.png` },
    },
    mainEntityOfPage: url,
    datePublished,
    dateModified: datePublished,
  };

  let customJsonLd: unknown = null;
  if (post.jsonld) {
    try {
      customJsonLd = typeof post.jsonld === "string" ? JSON.parse(post.jsonld) : post.jsonld;
    } catch {
      customJsonLd = null;
    }
  }

  return (
    <>
      <JsonLd data={(customJsonLd as object) || articleSchema} />
      {hasBody && <style dangerouslySetInnerHTML={{ __html: ARTICLE_BODY_CSS }} />}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main className="container py-5" style={{ flex: 1, maxWidth: "800px" }}>
          <a
            href={isRu ? "/ru/blog" : "/blog"}
            style={{ color: "#0683f5", fontSize: "0.9rem", display: "inline-block", marginBottom: "1.5rem" }}
          >
            {isRu ? "← Назад к блогу" : "← Back to Blog"}
          </a>

          {post.category && (
            <span style={{
              display: "inline-block", background: "#eff6ff", color: "#1d4ed8",
              borderRadius: "1rem", padding: "0.2rem 0.75rem", fontSize: "0.8rem",
              fontWeight: 600, marginBottom: "1rem",
            }}>
              {post.category}
            </span>
          )}

          {title && (
            <h1 style={{ color: "#1e6078", fontWeight: 800, marginBottom: "0.75rem", lineHeight: 1.3 }}>
              {title}
            </h1>
          )}

          {description && (
            <p style={{ color: "#475569", fontSize: "1.1rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {description}
            </p>
          )}

          <div style={{
            display: "flex", gap: "1rem", alignItems: "center",
            marginBottom: "2rem", borderBottom: "1px solid #e2e8f0",
            paddingBottom: "1rem", flexWrap: "wrap",
          }}>
            <span style={{ color: "#64748b", fontSize: "0.875rem" }}>✍ {author}</span>
            <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              {new Date(post.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>

          {hasBody ? (
            <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            <FormattedPostContent message={message} />
          )}
        </main>
      </div>
    </>
  );
}
