"use client";

import { useState } from "react";
import Header from "../../components/Header";
import { BilingualPost } from "./staticPosts";
import BlogPostCard from "./BlogPostCard";

export default function BlogPageEn({ initialPosts = [] }: { initialPosts?: BilingualPost[] }) {
  const [posts] = useState<BilingualPost[]>(initialPosts);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="container py-5" style={{ flex: 1 }}>
        <h1 className="text-brand mb-4">Upgrowplan Blog</h1>

        <p className="mt-3 mb-5 lead" style={{ maxWidth: "800px", lineHeight: "1.7", fontSize: "1.125rem" }}>
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

        {posts.filter((p) => p.messageEn).length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="row g-4">
            {posts.filter((p) => p.messageEn).map((post) => (
              <BlogPostCard
                key={post.id}
                message={post.messageEn}
                createdAt={post.createdAt}
                slug={post.slug}
                title={post.titleEn || post.titleRu}
                description={post.descriptionEn || post.descriptionRu}
                category={post.category}
                author={post.author}
                mediaUrl={post.mediaUrl}
                forwardAuthor={post.forwardAuthor}
                locale="en"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
