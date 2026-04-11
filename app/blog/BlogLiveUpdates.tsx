"use client";

import { useState, useEffect } from "react";
import * as StompJS from "@stomp/stompjs";
import { Post } from "./staticPosts";
import BlogPostCard from "./BlogPostCard";

interface BlogLiveUpdatesProps {
  existingIds: number[];
  locale: "ru" | "en";
  apiUrl: string;
}

export default function BlogLiveUpdates({ existingIds, locale, apiUrl }: BlogLiveUpdatesProps) {
  const [newPosts, setNewPosts] = useState<Post[]>([]);

  useEffect(() => {
    const existingIdSet = new Set(existingIds);
    const wsUrl = process.env.NEXT_PUBLIC_WS_BLOG_URL || "http://localhost:8082";
    const socket = new WebSocket(`${wsUrl}/ws/posts/info`);
    const stompClient = StompJS.Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/posts", (msg) => {
        const newPost: Post = JSON.parse(msg.body);
        setNewPosts((prev) => {
          const allIds = new Set([...existingIdSet, ...prev.map((p) => p.id)]);
          if (!allIds.has(newPost.id)) {
            return [newPost, ...prev];
          }
          return prev;
        });
      });
    });

    return () => {
      stompClient.disconnect(() => {});
    };
  }, []);

  if (newPosts.length === 0) return null;

  return (
    <div className="row g-4 mb-4">
      {newPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} apiUrl={apiUrl} locale={locale} />
      ))}
    </div>
  );
}
