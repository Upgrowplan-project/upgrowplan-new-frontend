import { NextRequest, NextResponse } from "next/server";
import { allStaticPosts, BilingualPost } from "@/app/blog/staticPosts";

const BLOB_NAME = "blog-posts.json";
const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "12fre345";
const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

// In-memory fallback for local development
let memoryStore: BilingualPost[] | null = null;

async function loadPosts(): Promise<BilingualPost[]> {
  // Try Vercel Blob in production
  if (HAS_BLOB) {
    try {
      const { head } = await import("@vercel/blob");
      const blobInfo = await head(BLOB_NAME).catch(() => null);
      if (blobInfo?.url) {
        const res = await fetch(blobInfo.url, { cache: "no-store" });
        if (res.ok) return await res.json();
      }
    } catch {}
  }

  // Fallback: in-memory store (local dev) or static posts
  return memoryStore ?? [...allStaticPosts];
}

async function savePosts(posts: BilingualPost[]) {
  if (HAS_BLOB) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_NAME, JSON.stringify(posts), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
  }
  // Always update in-memory store (works locally + caches in prod)
  memoryStore = posts;
}

// GET — password check only
export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, storage: HAS_BLOB ? "blob" : "memory" });
}

// POST — add new post
export async function POST(req: NextRequest) {
  const { password, post } = await req.json();
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await loadPosts();
  const newPost: BilingualPost = {
    ...post,
    id: Date.now(),
    createdAt: post.createdAt || new Date().toISOString(),
  };
  await savePosts([newPost, ...posts]);
  return NextResponse.json(newPost);
}

// PUT — edit existing post
export async function PUT(req: NextRequest) {
  const { password, post } = await req.json();
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await loadPosts();
  await savePosts(posts.map((p) => (p.id === post.id ? { ...p, ...post } : p)));
  return NextResponse.json(post);
}

// DELETE — remove post
export async function DELETE(req: NextRequest) {
  const { password, id } = await req.json();
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await loadPosts();
  await savePosts(posts.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
