// Preview text of a blog post — shared by the blog list card and the home carousel.

/** Plain-text start of a post: markdown marks and line breaks removed, cut at a word boundary. */
export function getExcerpt(text: string, maxLen = 200): string {
  const clean = (text || "").replace(/[#\n]/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).replace(/\s\S*$/, "") + "…";
}

/** [24.11 · owner «дата и автор»] who wrote the post: a reposted author first, then the post's author; the post page and
 *  its Article JSON-LD fall back to "Upgrowplan team" — the same here, so a card never shows a post without an author. */
export function postAuthor(post: { author?: string; forwardAuthor?: string }): string {
  return (post.forwardAuthor || post.author || "").trim() || "Upgrowplan team";
}
