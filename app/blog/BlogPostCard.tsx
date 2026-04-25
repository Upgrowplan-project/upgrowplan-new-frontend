import FormattedPostContent from "../../components/FormattedPostContent";

interface BlogPostCardProps {
  message: string;
  createdAt: string;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  author?: string;
  mediaUrl?: string;
  forwardAuthor?: string;
  locale: "ru" | "en";
}

export default function BlogPostCard({
  message, createdAt, slug, title, description,
  category, author, mediaUrl, forwardAuthor, locale,
}: BlogPostCardProps) {
  const postUrl = slug
    ? (locale === "ru" ? `/ru/blog/${slug}` : `/blog/${slug}`)
    : undefined;

  const displayAuthor = forwardAuthor || author;

  return (
    <div className="col-12">
      <article
        className="card blog-post border-0"
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="d-flex flex-column flex-md-row align-items-start">
          {mediaUrl && (
            <div style={{ width: "100%", maxWidth: "400px", flexShrink: 0 }}>
              <img
                src={mediaUrl}
                alt={title || (locale === "ru" ? "Изображение поста" : "Post image")}
                style={{ width: "100%", height: "280px", objectFit: "cover" }}
              />
            </div>
          )}
          <div className="card-body flex-grow-1 p-4">
            {category && (
              <span style={{
                display: "inline-block", background: "#eff6ff", color: "#1d4ed8",
                borderRadius: "1rem", padding: "0.15rem 0.65rem", fontSize: "0.75rem",
                fontWeight: 600, marginBottom: "0.6rem",
              }}>
                {category}
              </span>
            )}

            {title && postUrl ? (
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e6078", marginBottom: "0.5rem" }}>
                <a href={postUrl} style={{ color: "inherit", textDecoration: "none" }}>{title}</a>
              </h2>
            ) : title ? (
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e6078", marginBottom: "0.5rem" }}>
                {title}
              </h2>
            ) : null}

            {description && (
              <p style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                {description}
              </p>
            )}

            {!title && <FormattedPostContent message={message} />}

            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                {displayAuthor && (
                  <small className="text-muted d-block">
                    <strong>{locale === "ru" ? "Автор:" : "Author:"}</strong>{" "}{displayAuthor}
                  </small>
                )}
                <small className="text-muted d-block">
                  {new Date(createdAt).toLocaleDateString(
                    locale === "ru" ? "ru-RU" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </small>
              </div>
              {postUrl && (
                <a
                  href={postUrl}
                  style={{
                    background: "#0683f5", color: "#fff", borderRadius: "0.5rem",
                    padding: "0.4rem 1rem", fontSize: "0.85rem", fontWeight: 600,
                    textDecoration: "none", flexShrink: 0,
                  }}
                >
                  {locale === "ru" ? "Читать →" : "Read more →"}
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
