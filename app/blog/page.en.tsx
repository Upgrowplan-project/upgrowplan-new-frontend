import Header from "../../components/Header";
import { staticPostsEn } from "./staticPosts";
import BlogPostCard from "./BlogPostCard";

const apiUrl = process.env.NEXT_PUBLIC_API_BLOG_URL || "http://localhost:8082";

export default function BlogPageEn() {
  const posts = [...staticPostsEn].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="container py-5" style={{ flex: 1 }}>
        <h1 className="text-brand mb-4">Upgrowplan Blog</h1>

        <p
          className="mt-3 mb-5 lead"
          style={{ maxWidth: "800px", lineHeight: "1.7", fontSize: "1.125rem" }}
        >
          Practical insights on AI business planning, market research, financial
          modelling, and entrepreneurship — from the Upgrowplan team.
        </p>

        <div className="mb-5">
          <p className="mb-3" style={{ fontWeight: "500", color: "#1e6078" }}>
            Want to stay updated? Subscribe to our channels:
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

        <div className="row g-4">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} apiUrl={apiUrl} locale="en" />
          ))}
        </div>
      </main>
    </div>
  );
}
