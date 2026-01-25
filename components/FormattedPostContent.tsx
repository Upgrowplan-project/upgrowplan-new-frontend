import React from "react";

interface FormattedPostContentProps {
  message: string;
}

/**
 * Component to format blog post content with:
 * - Line breaks
 * - Bullet lists
 * - Bold text
 * - Links
 */
export default function FormattedPostContent({ message }: FormattedPostContentProps) {
  // Split message into paragraphs
  const paragraphs = message.split('\n\n');

  return (
    <div className="formatted-post-content">
      {paragraphs.map((paragraph, pIndex) => {
        // Check if paragraph is a bullet list
        const lines = paragraph.split('\n');
        const isList = lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim() === '');
        
        if (isList && lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'))) {
          return (
            <ul key={pIndex} style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              {lines
                .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
                .map((line, lIndex) => (
                  <li key={lIndex} style={{ marginBottom: '0.5rem' }}>
                    {formatInlineText(line.replace(/^[•\-]\s*/, ''))}
                  </li>
                ))}
            </ul>
          );
        }

        // Regular paragraph
        if (paragraph.trim()) {
          return (
            <p key={pIndex} style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              {formatInlineText(paragraph)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

/**
 * Format inline text with bold, links, etc.
 */
function formatInlineText(text: string): React.ReactNode {
  // Handle bold text (**text** or __text__)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Simple bold pattern
  const boldPattern = /(\*\*|__)(.*?)\1/g;
  let match;
  let lastIndex = 0;

  while ((match = boldPattern.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add bold text
    parts.push(
      <strong key={`bold-${key++}`} style={{ fontWeight: '600', color: '#1e6078' }}>
        {match[2]}
      </strong>
    );
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no formatting found, return original text
  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}
