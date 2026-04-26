import { allStaticPosts, BilingualPost } from "./staticPosts";

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

export async function getBlogPosts(): Promise<BilingualPost[]> {
  if (!HAS_BLOB) return allStaticPosts;
  try {
    const url = await getBlobUrl();
    if (url) {
      const res = await fetch(url, { cache: "no-store" });
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
