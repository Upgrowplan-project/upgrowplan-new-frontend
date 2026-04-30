import { getBlogPosts } from "@/app/blog/getBlogPosts";

const SITE_URL = "https://www.upgrowplan.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // refresh every hour

export async function GET() {
  const posts = await getBlogPosts();

  const urls = posts
    .filter((p) => p.slug)
    .map((p) => {
      const slug = p.slug!;
      const enUrl = `${SITE_URL}/blog/${slug}`;
      const ruUrl = `${SITE_URL}/ru/blog/${slug}`;
      const lastmod = p.createdAt ? p.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10);

      return `
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
