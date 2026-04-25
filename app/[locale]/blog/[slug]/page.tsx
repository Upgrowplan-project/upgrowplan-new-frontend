import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "../../../blog/getBlogPosts";
import { JsonLd } from "@/components/JsonLd";
import Header from "@/components/Header";
import FormattedPostContent from "@/components/FormattedPostContent";

const SITE_URL = "https://www.upgrowplan.com";

type Props = { params: { locale: string; slug: string } };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const slugged = posts.filter((p) => p.slug);
  return ["ru", "en"].flatMap((locale) =>
    slugged.map((p) => ({ locale, slug: p.slug! }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  const isRu = params.locale === "ru";
  const title = (isRu ? post.titleRu : post.titleEn) || post.titleEn || post.titleRu || "Blog";
  const description = (isRu ? post.descriptionRu : post.descriptionEn) || "";
  const url = `${SITE_URL}/${params.locale}/blog/${params.slug}`;
  const enUrl = `${SITE_URL}/blog/${params.slug}`;
  return {
    title: `${title} | Upgrowplan`,
    description,
    alternates: {
      canonical: url,
      languages: { en: enUrl, ru: `${SITE_URL}/ru/blog/${params.slug}`, "x-default": enUrl },
    },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function BlogPostLocalePage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const isRu = params.locale === "ru";
  const message = isRu
    ? post.messageRu || post.messageEn
    : post.messageEn || post.messageRu;
  const title = (isRu ? post.titleRu : post.titleEn) || "";
  const description = (isRu ? post.descriptionRu : post.descriptionEn) || "";
  const url = `${SITE_URL}${isRu ? "/ru" : ""}/blog/${params.slug}`;
  const author = post.author || "Upgrowplan team";
  const datePublished = post.createdAt.slice(0, 10);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: isRu ? "ru" : "en",
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

  return (
    <>
      <JsonLd data={articleSchema} />
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

          <FormattedPostContent message={message} />
        </main>
      </div>
    </>
  );
}
