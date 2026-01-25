"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import FormattedPostContent from "../../components/FormattedPostContent";
import { staticPostsEn, Post } from "./staticPosts";
import * as StompJS from "@stomp/stompjs";

export default function BlogPage() {
  // Initialize with static posts for immediate display
  const [posts, setPosts] = useState<Post[]>(staticPostsEn);
  const [dynamicPosts, setDynamicPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from database
    fetch(`${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter out posts that are already in static posts
          const staticIds = new Set(staticPostsEn.map(p => p.id));
          const newPosts = data.filter(p => !staticIds.has(p.id));
          
          // Translate dynamic posts to English (placeholder - you'll need to add actual translations)
          const translatedPosts = newPosts.map(post => ({
            ...post,
            message: translateToEnglish(post.message),
          }));
          
          setDynamicPosts(translatedPosts);
        } else {
          console.error("API response is not an array:", data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setIsLoading(false);
      });

    // WebSocket connection for real-time updates
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BLOG_URL}/ws/posts/info`
    );

    const stompClient = StompJS.Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe("/topic/posts", (msg) => {
        const newPost: Post = JSON.parse(msg.body);
        // Translate new post to English
        const translatedPost = {
          ...newPost,
          message: translateToEnglish(newPost.message),
        };
        setDynamicPosts((prev) => [translatedPost, ...prev]);
      });
    });

    return () => {
      stompClient.disconnect(() => console.log("Disconnected"));
    };
  }, []);

  // Combine static and dynamic posts, sort by date (newest first)
  const allPosts = [...dynamicPosts, ...posts].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="blog-page d-flex flex-column min-vh-100">
      <Header />

      <main className="blog-page py-5">
        <div className="container">
          <h1 className="text-brand mb-4">Upgrowplan Blog</h1>

          <p
            className="mt-3 mb-5 lead"
            style={{ maxWidth: "800px", lineHeight: "1.7", fontSize: "1.125rem" }}
          >
            Hello 👋 Here we share real-world experience: business ideas, case
            studies, checklists, analytics, and insights from the world of
            entrepreneurship and financial planning.
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
                style={{
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  src="/icons/telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
                <span>Telegram</span>
              </a>
              <a
                href="https://vk.com/upandgrow"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                style={{
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  transition: "all 0.3s ease",
                }}
              >
                <img src="/icons/vk.svg" alt="VK" width={24} height={24} />
                <span>VK</span>
              </a>
            </div>
          </div>

          {isLoading && dynamicPosts.length === 0 && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {allPosts.length === 0 && !isLoading ? (
            <p className="release-soon">No posts published yet 😄</p>
          ) : (
            <div className="row g-4">
              {allPosts.map((post) => (
                <div key={post.id} className="col-12">
                  <article
                    className="card blog-post border-0"
                    style={{
                      borderRadius: "18px",
                      overflow: "hidden",
                      background: "#ffffff",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div className="d-flex flex-column flex-md-row align-items-start">
                      {post.mediaUrl && (
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "400px",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/posts/proxy-image?fileId=${post.mediaUrl}`}
                            alt="Post image"
                            className="post-image"
                            style={{
                              width: "100%",
                              height: "300px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                      <div className="card-body flex-grow-1 p-4">
                        <FormattedPostContent message={post.message} />
                        
                        <div className="mt-4 pt-3" style={{ borderTop: "1px solid #e0e0e0" }}>
                          {post.forwardAuthor && (
                            <small className="text-muted d-block mb-2">
                              <strong>Author:</strong> {post.forwardAuthor}
                            </small>
                          )}
                          <small className="text-muted d-block">
                            <strong>Published:</strong>{" "}
                            {new Date(post.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Placeholder function for translating Russian posts to English
 * TODO: Implement actual translation logic or use a translation API
 */
function translateToEnglish(russianText: string): string {
  // For now, return the original text
  // You can implement translation using:
  // 1. Manual translation mapping for known posts
  // 2. Translation API (Google Translate, DeepL, etc.)
  // 3. AI translation service
  
  return russianText;
}
