import Header from "../../components/Header";
import { Post, staticPostsRu } from "./staticPosts";
import BlogPostCard from "./BlogPostCard";
import BlogLiveUpdates from "./BlogLiveUpdates";

async function getPosts(): Promise<Post[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BLOG_URL || "http://localhost:8082";
    const res = await fetch(`${apiUrl}/api/posts`, { next: { revalidate: 300 } });
    if (!res.ok) return staticPostsRu;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return staticPostsRu;
    return data.sort(
      (a: Post, b: Post) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return staticPostsRu;
  }
}

export default async function BlogPageRu() {
  const posts = await getPosts();
  const apiUrl = process.env.NEXT_PUBLIC_API_BLOG_URL || "http://localhost:8082";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="container py-5" style={{ flex: 1 }}>
        <h1 className="text-brand mb-4">Блог Upgrowplan</h1>

        <p
          className="mt-3 mb-5 lead"
          style={{ maxWidth: "800px", lineHeight: "1.7", fontSize: "1.125rem" }}
        >
          Привет 👋 Здесь мы делимся реальным опытом: бизнес-идеи, кейсы,
          чек-листы, аналитика и инсайты из мира предпринимательства и
          финансового планирования.
        </p>

        <div className="mb-5">
          <p className="mb-3" style={{ fontWeight: "500", color: "#1e6078" }}>
            Хотите быть в курсе? Подписывайтесь на наши каналы:
          </p>
          <div className="d-flex align-items-center gap-3">
            <a
              href="https://t.me/UpAndGrow"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              style={{ borderRadius: "8px", padding: "0.5rem 1rem", transition: "all 0.3s ease" }}
            >
              <img src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
              <span>Telegram</span>
            </a>
            <a
              href="https://vk.com/upandgrow"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              style={{ borderRadius: "8px", padding: "0.5rem 1rem", transition: "all 0.3s ease" }}
            >
              <img src="/icons/vk.svg" alt="VK" width={24} height={24} />
              <span>VK</span>
            </a>
          </div>
        </div>

        <BlogLiveUpdates
          existingIds={posts.map((p) => p.id)}
          locale="ru"
          apiUrl={apiUrl}
        />

        {posts.length === 0 ? (
          <p className="release-soon">Посты ещё не опубликованы 😄</p>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} apiUrl={apiUrl} locale="ru" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
