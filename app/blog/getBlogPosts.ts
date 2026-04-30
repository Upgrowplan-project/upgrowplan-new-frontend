import { allStaticPosts, staticPostsRuBilingual, enPostMeta, BilingualPost } from "./staticPosts";

const BLOB_PATHNAME = "blog-posts.json";
const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

async function getBlobUrl(): Promise<string | null> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "blog-posts" });
    const found = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    return found?.url ?? null;
  } catch {
    return null;
  }
}

function enrichPosts(basePosts: BilingualPost[]): BilingualPost[] {
  // Build slug → ruPost map for Russian content merging
  const ruBySlug = new Map<string, BilingualPost>(
    staticPostsRuBilingual
      .filter((p) => p.slug)
      .map((p) => [p.slug!, p])
  );

  const enriched = basePosts.map((p) => {
    // Apply EN metadata (slug, title, description) from enPostMeta if missing
    const enMeta = enPostMeta[p.id];
    const withEnMeta: BilingualPost = enMeta ? {
      ...p,
      slug: p.slug || enMeta.slug,
      titleEn: p.titleEn || enMeta.titleEn,
      descriptionEn: p.descriptionEn || enMeta.descriptionEn,
    } : p;

    // Merge Russian content by slug
    const slug = withEnMeta.slug;
    if (slug && ruBySlug.has(slug)) {
      const ru = ruBySlug.get(slug)!;
      ruBySlug.delete(slug);
      return {
        ...withEnMeta,
        messageRu: withEnMeta.messageRu || ru.messageRu,
        titleRu: withEnMeta.titleRu || ru.titleRu,
        descriptionRu: withEnMeta.descriptionRu || ru.descriptionRu,
        category: withEnMeta.category || ru.category,
        author: withEnMeta.author || ru.author,
      };
    }
    return withEnMeta;
  });

  // Add Russian-only posts not matched to any EN post
  const ruOnlyPosts = [...ruBySlug.values()];

  return [...enriched, ...ruOnlyPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBlogPosts(): Promise<BilingualPost[]> {
  if (!HAS_BLOB) return enrichPosts(allStaticPosts);

  try {
    const url = await getBlobUrl();
    if (url) {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const blobPosts: BilingualPost[] = await res.json();
        return enrichPosts(blobPosts);
      }
    }
  } catch {}

  return enrichPosts(allStaticPosts);
}

export async function getBlogPostBySlug(slug: string): Promise<BilingualPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
