import { NextRequest, NextResponse } from "next/server";
import { allStaticPosts, BilingualPost } from "@/app/blog/staticPosts";

const BLOB_PATHNAME = "blog-posts.json";
const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "12fre345";
const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

// In-memory fallback for local dev (resets on restart)
let memoryStore: BilingualPost[] | null = null;

async function safeReadJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

async function loadPosts(): Promise<BilingualPost[]> {
  if (HAS_BLOB) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "blog-posts" });
      const found = blobs.find((b) => b.pathname === BLOB_PATHNAME);
      if (found?.url) {
        const res = await fetch(found.url, { cache: "no-store" });
        if (res.ok) return await res.json();
      }
    } catch {}
  }
  return memoryStore ?? [...allStaticPosts];
}

async function savePosts(posts: BilingualPost[]) {
  memoryStore = posts;
  if (HAS_BLOB) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, JSON.stringify(posts), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  }
}

// GET — password check
export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, storage: HAS_BLOB ? "blob" : "memory" });
}

// POST — add post
export async function POST(req: NextRequest) {
  const body = await safeReadJson(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { password, post } = body as { password?: string; post?: Partial<BilingualPost> };
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!post) {
    return NextResponse.json({ error: "Post payload is required" }, { status: 400 });
  }
  const posts = await loadPosts();
  const newPost: BilingualPost = {
    ...post,
    id: Date.now(),
    createdAt: post.createdAt || new Date().toISOString(),
  };
  try {
    await savePosts([newPost, ...posts]);
  } catch (e) {
    // Раньше падало пустым 500 (put в Blob не был обёрнут). Теперь возвращаем причину.
    return NextResponse.json(
      { error: "Failed to persist post (Vercel Blob write)", detail: String(e) },
      { status: 500 }
    );
  }
  return NextResponse.json(newPost);
}

// PUT — edit post
export async function PUT(req: NextRequest) {
  const body = await safeReadJson(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { password, post } = body as { password?: string; post?: Partial<BilingualPost> };
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!post || typeof (post as { id?: number }).id !== "number") {
    return NextResponse.json({ error: "Post with numeric id is required" }, { status: 400 });
  }
  const posts = await loadPosts();
  await savePosts(posts.map((p) => (p.id === post.id ? { ...p, ...post } : p)));
  return NextResponse.json(post);
}

// DELETE — remove post
export async function DELETE(req: NextRequest) {
  const body = await safeReadJson(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { password, id } = body as { password?: string; id?: number };
  if (password !== ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (typeof id !== "number") {
    return NextResponse.json({ error: "Numeric id is required" }, { status: 400 });
  }
  const posts = await loadPosts();
  await savePosts(posts.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
