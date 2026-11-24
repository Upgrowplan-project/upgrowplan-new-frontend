"use client";

import Link from "next/link";
import { useRef } from "react";
import type { BilingualPost } from "@/app/blog/staticPosts";
import { categoryLabel } from "@/app/blog/categories";
import { getExcerpt, postAuthor } from "@/app/blog/postPreview";

interface HomeBlogCarouselProps {
  posts: BilingualPost[];
  locale: "ru" | "en";
}

/** [24.11 · owner] Home page, right after «Every figure… has an author»: the 5 latest posts — rubric, title, the post's
 *  hook (its teaser; the start of the text when there is none), date, author and a link to the full post. */
export default function HomeBlogCarousel({ posts, locale }: HomeBlogCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isRu = locale === "ru";
  // posts arrive newest first (getCanonicalBlogPosts); a card needs a link and a title in this language — a post with no
  // teaser is no longer skipped (it would push an older post into «the 5 latest»), its hook is the start of its text
  const visiblePosts = posts
    .filter((post) => post.slug && (isRu ? post.titleRu?.trim() : post.titleEn?.trim()))
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
          {/* two-tone heading like the neighbouring home sections (dark statement + blue accent) */}
          <h2 id="home-blog-title">
            {isRu ? "Последние материалы блога." : "Latest from the blog."}
            <span className="home-blog-accent">
              {isRu
                ? " Практика ИИ, бизнес-планов и проверки рынка."
                : " Practical notes on AI, business planning and market validation."}
            </span>
          </h2>
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
              const teaser = (isRu ? post.descriptionRu : post.descriptionEn)?.trim();
              const hook = teaser || getExcerpt(isRu ? post.messageRu || post.messageEn : post.messageEn || post.messageRu, 220);
              const category = categoryLabel(post.category, locale);
              const author = postAuthor(post);
              const url = isRu ? `/ru/blog/${post.slug}` : `/blog/${post.slug}`;
              return (
                <article className="home-blog-card" key={post.id}>
                  {category && <span className="home-blog-category">{category}</span>}
                  <h3><Link href={url}>{title}</Link></h3>
                  {hook && <p>{hook}</p>}
                  <div className="home-blog-card-footer">
                    <div className="home-blog-meta">
                      <span className="home-blog-author">{isRu ? "Автор: " : "By "}{author}</span>
                      <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString(
                          isRu ? "ru-RU" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                    </div>
                    <Link href={url} aria-label={`${isRu ? "Читать полностью" : "Read the full post"}: ${title}`}>
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
