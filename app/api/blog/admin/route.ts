import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import DOMPurify from "isomorphic-dompurify";
import { allStaticPosts, BilingualPost } from "@/app/blog/staticPosts";

const BLOB_PATHNAME = "blog-posts.json";
// No fallback on purpose: without BLOG_ADMIN_PASSWORD the admin API is closed (audit 2026-09).
const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "";
const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

// Password: X-Admin-Password header (preferred) or body field (existing panel).
// Never the query string — it ends up in access logs.
function authorized(req: NextRequest, bodyPassword?: unknown): boolean {
  if (!ADMIN_PASSWORD) return false;
  const given = req.headers.get("x-admin-password") ?? (typeof bodyPassword === "string" ? bodyPassword : "");
  const a = Buffer.from(given, "utf8");
  const b = Buffer.from(ADMIN_PASSWORD, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

// Only known fields are persisted; HTML bodies are sanitized because the blog page renders
// bodyRu/bodyEn with dangerouslySetInnerHTML.
const HTML_FIELDS = ["bodyRu", "bodyEn"] as const;
const TEXT_FIELDS = [
  "slug", "titleRu", "titleEn", "descriptionRu", "descriptionEn", "category", "author",
  "messageRu", "messageEn", "createdAt", "mediaUrl", "forwardAuthor",
  "metaTitleEn", "metaTitleRu", "metaDescriptionEn", "metaDescriptionRu", "jsonld",
] as const;
const SANITIZE_OPTS = {
  ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "p", "br", "hr", "strong", "em", "b", "i", "u", "s",
    "ul", "ol", "li", "blockquote", "pre", "code", "table", "thead", "tbody", "tr", "th", "td",
    "a", "img", "figure", "figcaption", "div", "span"],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel", "width", "height"],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/(?!\/))/i,
};
function cleanPost(input: Partial<BilingualPost>): Partial<BilingualPost> {
  const out: Record<string, unknown> = {};
  for (const k of TEXT_FIELDS) {
    const v = (input as Record<string, unknown>)[k];
    if (typeof v === "string") out[k] = v;
  }
  for (const k of HTML_FIELDS) {
    const v = (input as Record<string, unknown>)[k];
    if (typeof v === "string") out[k] = DOMPurify.sanitize(v, SANITIZE_OPTS);
  }
  if (typeof input.id === "number") out.id = input.id;
  return out as Partial<BilingualPost>;
}

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

// GET — password check (header only)
export async function GET(req: NextRequest) {
  if (!authorized(req))
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
  if (!authorized(req, password))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!post || typeof post !== "object") {
    return NextResponse.json({ error: "Post payload is required" }, { status: 400 });
  }
  const posts = await loadPosts();
  const newPost: BilingualPost = {
    ...(cleanPost(post) as BilingualPost),
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
  if (!authorized(req, password))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!post || typeof (post as { id?: number }).id !== "number") {
    return NextResponse.json({ error: "Post with numeric id is required" }, { status: 400 });
  }
  const clean = cleanPost(post);
  const posts = await loadPosts();
  await savePosts(posts.map((p) => (p.id === post.id ? { ...p, ...clean } : p)));
  return NextResponse.json(clean);
}

// DELETE — remove post
export async function DELETE(req: NextRequest) {
  const body = await safeReadJson(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { password, id } = body as { password?: string; id?: number };
  if (!authorized(req, password))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (typeof id !== "number") {
    return NextResponse.json({ error: "Numeric id is required" }, { status: 400 });
  }
  const posts = await loadPosts();
  await savePosts(posts.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
