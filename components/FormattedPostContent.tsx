import React from "react";

interface FormattedPostContentProps {
  message: string;
}

export default function FormattedPostContent({ message }: FormattedPostContentProps) {
  const paragraphs = message.split("\n\n");

  return (
    <div className="formatted-post-content">
      {paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split("\n");
        const isList = lines.every(
          (line) => line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim() === ""
        );

        if (isList && lines.some((line) => line.trim().startsWith("•") || line.trim().startsWith("-"))) {
          return (
            <ul key={pIndex} style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
              {lines
                .filter((line) => line.trim().startsWith("•") || line.trim().startsWith("-"))
                .map((line, lIndex) => (
                  <li key={lIndex} style={{ marginBottom: "0.5rem" }}>
                    {formatInlineText(line.replace(/^[•\-]\s*/, ""))}
                  </li>
                ))}
            </ul>
          );
        }

        if (paragraph.trim()) {
          return (
            <p key={pIndex} style={{ marginBottom: "1rem", lineHeight: "1.7" }}>
              {formatInlineText(paragraph)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

function formatInlineText(text: string): React.ReactNode {
  // Pattern order: links first, then bold, then italic
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Process links [text](url), bold **text**, italic *text*
  // Supports both absolute (https://...) and relative (/path) URLs
  const pattern = /\[([^\]]+)\]\(([^\)]+)\)|\*\*(.+?)\*\*|\*([^*]+)\*/g;
  let match;
  let lastIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      const href = match[2];
      const isExternal = href.startsWith("http");
      parts.push(
        <a
          key={`link-${key++}`}
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          style={{ color: "#0683f5", textDecoration: "underline" }}
        >
          {match[1]}
        </a>
      );
    } else if (match[3] !== undefined) {
      // Bold **text**
      parts.push(
        <strong key={`bold-${key++}`} style={{ fontWeight: 600, color: "#1e6078" }}>
          {match[3]}
        </strong>
      );
    } else if (match[4] !== undefined) {
      // Italic *text*
      parts.push(
        <em key={`italic-${key++}`} style={{ fontStyle: "italic" }}>
          {match[4]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length === 0 ? text : <>{parts}</>;
}
