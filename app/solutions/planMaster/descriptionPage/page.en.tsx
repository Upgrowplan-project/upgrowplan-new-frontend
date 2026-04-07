"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../../components/Header";
import IntelligenceLabV3En from "./IntelligenceLab-v3.en";

const INFO_TABS = [
  {
    id: "how",
    icon: "🔍",
    label: "How the service works",
    title: "How the service works",
    text:
      "Creates a business plan in the approved format for social contract submission. Uses classic planning methodology, marketing and economic analysis. Full research and document delivery takes about 5–10 minutes.",
    bullets: [
      "Analyzes the idea, business format, city, funding sources and all project inputs.",
      "Collects market and competitor data to justify key metrics such as average ticket and demand. Provides a detailed competitor analysis and research on the target audience. Proposes a marketing strategy based on current data. Pulls fresh data on rent, salaries and taxes in your region.",
      "Builds a realistic financial model for the given conditions: revenue forecast, expenses, profit, taxes, profitability and payback period.",
      "If the project is not profitable enough, the service stops, informs you about the critical metric and suggests adjusting key business indicators to reach the recommended profitability. After that, the plan is generated with updated data.",
      "Produces the final document with sections, sources and a conclusion ready for social contract submission.",
    ],
    tags: ["Deep Research", "Competitor Scan", "Financial Model", "Validation Filter"],
  },
  {
    id: "inputs",
    icon: "🗂️",
    label: "What to fill in",
    title: "What to fill in",
    text:
      "The more accurate and complete your inputs, the higher the quality of market analysis, the more direct competitors can be found, and the more realistic the financial calculations will be.",
    bullets: [
      "Describe the business idea clearly: product/service, format, key differentiator, product or client specifics, and important parameters such as area and location details.",
      "Specify geography (region, city and exact address if available) for correct competitor and customer analysis.",
      "Provide the funding structure: own funds, support, amounts already invested and the spending period. Add current loan burden if you have one.",
      "Fill in the initiator profile. Indicate business experience, education, skills and achievements relevant to successful project delivery. This increases trust in the document and improves approval chances.",
    ],
    tags: ["Location", "Business format", "Target customer", "Scale"],
  },
  {
    id: "result",
    icon: "📬",
    label: "What you get",
    title: "What you get",
    text: "You receive a ready business plan and transparent calculation logic.",
    bullets: [
      "Project summary with key metrics: investment, profit, profitability, taxes and payback.",
      "Sections on market, competitors, target audience, organization, production and financial plan.",
      "Data sources in the text and appendix so justifications are verifiable.",
      "DOCX file for further editing and submission.",
    ],
    tags: ["TAM / SAM / SOM", "Competitor Profiles", "Verified Sources", "DOCX Export"],
  },
];

const PRODUCTS = [
  {
    id: "worldwide",
    icon: "bi-globe-americas",
    title: "Upgrowplan Worldwide",
    subtitle: "Global version",
    description:
      "A business plan generator for projects in any jurisdiction. Currency, tax and market inputs adapt to the selected country and city. Multi‑currency financial model, compatible with international bank and fund requirements.",
    status: "pending" as const,
  },
];

function BetaForm() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email");
      return;
    }
    if (!isChecked) return;
    setError("");

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      await fetch(`${API_BASE}/api/monitoring/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          message: `User (${email}) is interested in the planMaster product.`,
        }),
      });
      setSubmitted(true);
      setEmail("");
      setIsChecked(false);
    } catch (err) {
      console.error("Error sending beta request:", err);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#16a34a" }}>
        <span style={{ fontSize: 20 }}>✔</span>
        <span style={{ fontWeight: 600 }}>
          Thank you for your interest in our product! We will notify you about beta access via email.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <div className="mb-3">
        <label
          htmlFor="beta-email"
          className="form-label small fw-semibold text-secondary"
        >
          Email
        </label>
        <input
          id="beta-email"
          type="email"
          className="form-control form-control-lg rounded-3 border-0 shadow-sm"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {error && <div className="text-danger small mt-2">{error}</div>}
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="beta-policy-en"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-en">
          By sending this message I have read and agree with the{" "}
          <a href="/privacy" target="_blank">
            Privacy Policy
          </a>{" "}
          and the{" "}
          <a href="/privacy" target="_blank">
            Personal Data Processing Policy
          </a>.
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-lg w-100 rounded-3 fw-semibold border-0"
        style={{ backgroundColor: "#0683f5", color: "#fff" }}
        disabled={!isChecked}
      >
        Reserve a spot
      </button>
    </form>
  );
}

export default function PlanMasterDescriptionPageEn() {
  const [activeTab, setActiveTab] = useState("how");
  const active = INFO_TABS.find((t) => t.id === activeTab) ?? INFO_TABS[0];

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <main className="flex-grow-1">
        {/* ══════════ HERO ══════════ */}
        <section
          style={{
            padding: "5rem 0 3.5rem",
            background:
              "radial-gradient(1200px 600px at 10% 10%, rgba(7,133,246,0.10), transparent 60%), linear-gradient(120deg, rgba(30,96,120,0.05), rgba(7,133,246,0.02))",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#1e6078",
                fontWeight: 600,
                marginBottom: "0.75rem",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
            >
              Upgrowplan product
            </p>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3.4rem)",
                fontWeight: 700,
                color: "#1e6078",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
            >
              Upgrowplan Laboratory:{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0683f5 0%, #0565c8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Business Plan Generator 2.12
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#171717",
                marginBottom: "2.25rem",
                maxWidth: 620,
                lineHeight: 1.65,
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
            >
              We are finalizing calibration of our generation system enhanced with live search (RAG).
              Right now agents are learning to separate hypotheses from facts so your business plan
              can withstand any verification.
            </p>

            <div
              className="d-none d-md-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-5"
              style={{
                width: "fit-content",
                fontSize: "0.7rem",
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.12em",
                color: "#0683f5",
                backgroundColor: "rgba(6,131,245,0.08)",
                border: "1px solid rgba(6,131,245,0.25)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#0683f5",
                  display: "inline-block",
                  animation: "heroCalibPulse 2s infinite",
                }}
              />
              <span>[ LIVE CALIBRATION ]</span>
            </div>

            <p
              style={{
                fontSize: "0.87rem",
                color: "#94a3b8",
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span aria-hidden>⏳</span>
              Product in development. Release — Summer 2026.
            </p>
          </div>
        </section>

        <style>{`
          @keyframes heroCalibPulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
          @media (max-width: 768px) {
            .pm-tabs {
              padding: 40px 0 !important;
            }
            .pm-tabs-buttons {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .pm-tabs-buttons button {
              width: 100% !important;
              text-align: center !important;
            }
            .pm-tabs-card {
              width: 100% !important;
              padding: 24px !important;
            }
          }
        `}</style>

        {/* ══════════ ARCHITECTURE ══════════ */}
        <IntelligenceLabV3En />

        {/* ══════════ SERVICE PRINCIPLES ══════════ */}
        <section className="container py-5">
          <section style={{ background: "#f0f7ff", padding: "56px 0", borderRadius: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)", color: "#1e6078" }}>
                Service principles.
                <span style={{ color: "#0683f5" }}> We keep it simple:</span>
              </h2>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
              {INFO_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 26px", borderRadius: 40,
                    border: `2px solid ${activeTab === t.id ? "#0683f5" : "#dde8f5"}`,
                    background: activeTab === t.id ? "#0683f5" : "#fff",
                    color: activeTab === t.id ? "#fff" : "#64748b",
                    fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: activeTab === t.id ? "0 4px 16px rgba(6,131,245,0.28)" : "none",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 36px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                  border: "1px solid #e0eaf6",
                  width: "min(66%, 760px)",
                  margin: "0 auto",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{active.icon}</span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e6078", margin: 0 }}>
                    {active.title}
                  </h3>
                </div>
                <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
                  {active.text}
                </p>
                <ul style={{ paddingLeft: "1.2rem", marginBottom: 18, color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
                  {active.bullets.map((b) => (
                    <li key={b} style={{ marginBottom: "0.45rem" }}>{b}</li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(6,131,245,0.07)",
                        border: "1px solid rgba(6,131,245,0.2)",
                        borderRadius: 8,
                        padding: "8px 16px",
                        fontSize: 13,
                        color: "#0683f5",
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </section>

        {/* ══════════ OUR PRODUCT ══════════ */}
        <section
          className="py-5"
          style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}
        >
          <div className="container">
            <h2 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "1.45rem" }}>
              Our product
            </h2>
            <p
              className="mb-4"
              style={{
                color: "#475569",
                fontSize: "0.95rem",
                maxWidth: 640,
                lineHeight: 1.6,
              }}
            >
              The product is available on request or with a personal tester code. If you already
              have a 6‑digit code, enter it to access the full version.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      flex: "0 1 calc(75% - 1.25rem)",
                      minWidth: 260,
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(6,131,245,0.15)",
                      borderRadius: "0.75rem",
                      padding: "1.25rem 1.5rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i
                        className={`bi ${p.icon}`}
                        style={{ color: "#0683f5", fontSize: "1.2rem" }}
                        aria-hidden
                      />
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {p.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          backgroundColor: "#f1f5f9",
                          borderRadius: "0.3rem",
                          padding: "0.1rem 0.5rem",
                        }}
                      >
                        {p.subtitle}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "#475569",
                        marginBottom: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {p.description}
                    </p>
                  </div>

                  <button
                    disabled
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.25rem",
                      backgroundColor: "#e2e8f0",
                      color: "#94a3b8",
                      border: "none",
                      borderRadius: "0.6rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "not-allowed",
                      whiteSpace: "nowrap",
                    }}
                    title="Functionality is in progress"
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #94a3b8",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spinLoader 0.9s linear infinite",
                      }}
                    />
                    Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <style>{`
          @keyframes spinLoader {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* ══════════ BETA FORM ══════════ */}
        <section
          className="py-5 px-3"
          style={{
            background:
              "linear-gradient(145deg, #e8f4fc 0%, #f5f9ff 45%, #eef6ff 100%)",
            boxShadow: "0 8px 32px rgba(6,131,245,0.08)",
            borderRadius: "1rem",
          }}
        >
          <div className="container">
            <h2 className="h5 fw-bold mb-3" style={{ color: "#0f172a" }}>
              Become a beta tester
            </h2>
            <p className="mb-4" style={{ color: "#334155", maxWidth: "36rem" }}>
              The product is almost ready. Leave your email to get an invite to the closed beta
              and a lifetime 50% discount for the first 100 founders.
            </p>
            <BetaForm />
          </div>
        </section>
      </main>
    </div>
  );
}
