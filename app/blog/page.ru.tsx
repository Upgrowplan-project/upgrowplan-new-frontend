"use client";

import { useState } from "react";
import Header from "../../components/Header";
import { BilingualPost } from "./staticPosts";
import BlogPostCard from "./BlogPostCard";
import AdminBlogPanel from "./AdminBlogPanel";

export default function BlogPageRu({ initialPosts = [] }: { initialPosts?: BilingualPost[] }) {
  const [posts, setPosts] = useState<BilingualPost[]>(initialPosts);
  const visiblePosts = posts.filter(
    (post) =>
      post.slug &&
      post.titleEn?.trim() &&
      post.descriptionEn?.trim() &&
      post.messageEn?.trim() &&
      post.titleRu?.trim() &&
      post.descriptionRu?.trim() &&
      post.messageRu?.trim()
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="container py-5" style={{ flex: 1 }}>
        <h1 className="text-brand mb-4">Блог об ИИ-валидации бизнеса</h1>

        <p className="mt-3 mb-5 lead" style={{ maxWidth: "800px", lineHeight: "1.7", fontSize: "1.125rem" }}>
          Upgrowplan публикует практические материалы об ИИ-исследованиях
          рынка, бизнес-планах, валидации стартапов, финансовом моделировании
          и подготовке к работе с инвесторами.
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
              style={{ borderRadius: "8px", padding: "0.5rem 1rem" }}
            >
              <img src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
              <span>Telegram</span>
            </a>
            <a
              href="https://vk.com/upandgrow"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              style={{ borderRadius: "8px", padding: "0.5rem 1rem" }}
            >
              <img src="/icons/vk.svg" alt="VK" width={24} height={24} />
              <span>VK</span>
            </a>
          </div>
        </div>

        <div className="mb-4">
          <AdminBlogPanel posts={posts} onPostsChange={setPosts} locale="ru" />
        </div>

        {visiblePosts.length === 0 ? (
          <p className="release-soon">Посты ещё не опубликованы 😄</p>
        ) : (
          <div className="row g-4">
            {visiblePosts.map((post) => (
              <BlogPostCard
                key={post.id}
                message={post.messageRu}
                createdAt={post.createdAt}
                slug={post.slug}
                title={post.titleRu}
                description={post.descriptionRu}
                category={post.category}
                author={post.author}
                mediaUrl={post.mediaUrl}
                forwardAuthor={post.forwardAuthor}
                locale="ru"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
