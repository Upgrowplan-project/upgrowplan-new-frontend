import FormattedPostContent from "../../components/FormattedPostContent";
import { Post } from "./staticPosts";

interface BlogPostCardProps {
  post: Post;
  apiUrl: string;
  locale: "ru" | "en";
}

export default function BlogPostCard({ post, apiUrl, locale }: BlogPostCardProps) {
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
          {post.mediaUrl && (
            <div style={{ width: "100%", maxWidth: "400px", flexShrink: 0 }}>
              <img
                src={`${apiUrl}/api/posts/proxy-image?fileId=${post.mediaUrl}`}
                alt={locale === "ru" ? "Изображение поста" : "Post image"}
                className="post-image"
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
            </div>
          )}
          <div className="card-body flex-grow-1 p-4">
            <FormattedPostContent message={post.message} />
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid #e0e0e0" }}>
              {post.forwardAuthor && (
                <small className="text-muted d-block mb-2">
                  <strong>{locale === "ru" ? "Автор:" : "Author:"}</strong>{" "}
                  {post.forwardAuthor}
                </small>
              )}
              <small className="text-muted d-block">
                <strong>{locale === "ru" ? "Опубликовано:" : "Published:"}</strong>{" "}
                {new Date(post.createdAt).toLocaleString(
                  locale === "ru" ? "ru-RU" : "en-US",
                  { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
                )}
              </small>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
