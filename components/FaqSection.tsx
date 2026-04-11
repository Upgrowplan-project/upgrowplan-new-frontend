"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
}

export default function FaqSection({ items, title }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      style={{
        backgroundColor: "#f0f7fd",
        padding: "64px 0",
        borderTop: "1px solid #d9ebf5",
      }}
    >
      <div className="container" style={{ maxWidth: "860px" }}>
        {title && (
          <h2
            style={{
              color: "#01346e",
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              marginBottom: "36px",
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </h2>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: isOpen ? "2px solid #0683f5" : "2px solid transparent",
                  boxShadow: isOpen
                    ? "0 4px 20px rgba(6,131,245,0.10)"
                    : "0 2px 8px rgba(1,52,110,0.06)",
                  transition: "all 0.2s ease",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      color: "#01346e",
                      fontWeight: 700,
                      fontSize: "1rem",
                      lineHeight: "1.4",
                      flex: 1,
                    }}
                  >
                    {item.question}
                  </span>
                  {/* Icon */}
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "#0683f5" : "#d9ebf5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <line
                        x1="7"
                        y1="1"
                        x2="7"
                        y2="13"
                        stroke={isOpen ? "#fff" : "#01346e"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="1"
                        y1="7"
                        x2="13"
                        y2="7"
                        stroke={isOpen ? "#fff" : "#01346e"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px 24px",
                      color: "#2a5a8c",
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      borderTop: "1px solid #e8f3fb",
                      paddingTop: "16px",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
