import { allStaticPosts, BilingualPost } from "./staticPosts";

const BLOB_NAME = "blog-posts.json";

export async function getBlogPosts(): Promise<BilingualPost[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return allStaticPosts;
  }
  try {
    const { head } = await import("@vercel/blob");
    const blobInfo = await head(BLOB_NAME).catch(() => null);
    if (blobInfo?.url) {
      const res = await fetch(blobInfo.url, { cache: "no-store" });
      if (res.ok) {
        const posts: BilingualPost[] = await res.json();
        return [...posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  } catch {}
  return allStaticPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BilingualPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
