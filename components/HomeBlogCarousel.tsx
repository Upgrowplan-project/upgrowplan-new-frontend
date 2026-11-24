"use client";

import Link from "next/link";
import { useRef } from "react";
import type { BilingualPost } from "@/app/blog/staticPosts";

interface HomeBlogCarouselProps {
  posts: BilingualPost[];
  locale: "ru" | "en";
}

const categoryNames: Record<string, { ru: string; en: string }> = {
  "ИИ": { ru: "ИИ", en: "AI" },
  "Методичка": { ru: "Методичка", en: "How-To" },
  "Маркетинг": { ru: "Маркетинг", en: "Marketing" },
  "Кейсы": { ru: "Кейсы", en: "Case Studies" },
  Brandsories: { ru: "Brandsories", en: "Brand Stories" },
  "Исследование рынка": { ru: "Исследование рынка", en: "Market Research" },
  research: { ru: "Исследование", en: "Research" },
};

export default function HomeBlogCarousel({ posts, locale }: HomeBlogCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isRu = locale === "ru";

  const visiblePosts = posts
    .filter((post) =>
      post.slug &&
      (isRu ? post.titleRu?.trim() : post.titleEn?.trim()) &&
      (isRu ? post.descriptionRu?.trim() : post.descriptionEn?.trim())
    )
    .slice(0, 5);

  if (visiblePosts.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".home-blog-card");
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.85;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section className="home-blog-preview section-pad" aria-labelledby="home-blog-title">
      <div className="container">
        <div className="home-blog-heading">
          <div>
            <p className="home-blog-eyebrow">{isRu ? "Блог Upgrowplan" : "Upgrowplan Blog"}</p>
            <h2 id="home-blog-title">{isRu ? "Последние материалы" : "Latest Insights"}</h2>
            <p>{isRu
              ? "Практические заметки об ИИ, бизнес-планах и валидации рынка"
              : "Practical notes on AI, business planning, and market validation"}
            </p>
          </div>
          <Link href={isRu ? "/ru/blog" : "/blog"} className="home-blog-all">
            {isRu ? "Все статьи" : "View all posts"} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="home-blog-carousel">
          <button
            type="button"
            className="home-blog-arrow home-blog-arrow-prev"
            onClick={() => scroll(-1)}
            aria-label={isRu ? "Предыдущие статьи" : "Previous posts"}
          >
            <span aria-hidden="true">←</span>
          </button>

          <div className="home-blog-track" ref={trackRef}>
            {visiblePosts.map((post) => {
              const title = isRu ? post.titleRu : post.titleEn;
              const description = isRu ? post.descriptionRu : post.descriptionEn;
              const category = post.category
                ? (categoryNames[post.category]?.[locale] ?? post.category)
                : null;
              const url = isRu ? `/ru/blog/${post.slug}` : `/blog/${post.slug}`;

              return (
                <article className="home-blog-card" key={post.id}>
                  {category && <span className="home-blog-category">{category}</span>}
                  <h3><Link href={url}>{title}</Link></h3>
                  <p>{description}</p>
                  <div className="home-blog-card-footer">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString(
                        isRu ? "ru-RU" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </time>
                    <Link href={url} aria-label={`${isRu ? "Читать" : "Read"}: ${title}`}>
                      {isRu ? "Читать" : "Read"} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="home-blog-arrow home-blog-arrow-next"
            onClick={() => scroll(1)}
            aria-label={isRu ? "Следующие статьи" : "Next posts"}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
