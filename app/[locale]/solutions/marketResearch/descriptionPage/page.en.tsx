"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../../../components/Header";

function AccessCodeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "132435") {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          zIndex: 1040,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2.5rem 2rem",
          width: "min(420px, 92vw)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: "1.2rem",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(6,131,245,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            fontSize: "1.4rem",
          }}
        >
          🔑
        </div>

        <h2
          id="modal-title"
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          Tester access
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#64748b",
            marginBottom: "1.75rem",
            lineHeight: 1.5,
          }}
        >
          Enter your personal 6‑digit code to activate the system.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="· · · · · ·"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            style={{
              width: "100%",
              padding: "0.9rem 1rem",
              borderRadius: "0.8rem",
              border: `1px solid ${error ? "#ef4444" : "#e2e8f0"}`,
              fontSize: "1.2rem",
              textAlign: "center",
              letterSpacing: "0.3em",
              marginBottom: "1rem",
              outline: "none",
            }}
          />
          {error && (
            <div
              style={{
                fontSize: "0.85rem",
                color: "#ef4444",
                marginBottom: "0.75rem",
              }}
            >
              Invalid code. Please try again.
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.9rem 1.2rem",
              backgroundColor: "#0683f5",
              color: "#fff",
              border: "none",
              borderRadius: "0.8rem",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Activate access
          </button>
        </form>
      </div>
    </>
  );
}

function BetaForm() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email");
      return;
    }
    if (!isChecked) return;
    setError("");
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      await fetch(`${API_BASE}/api/monitoring/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          message: `запрос на бета-тестирование MarketSense AI получен`,
        }),
      });
      setSubmitted(true);
      setEmail("");
      setIsChecked(false);
    } catch (err) {
      console.error("Error sending beta request:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#16a34a" }}>
        <span style={{ fontSize: 20 }}>✔</span>
        <span style={{ fontWeight: 600 }}>Thank you for your interest! We will get back to you shortly.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <div className="mb-3">
        <label htmlFor="beta-email-mr-en" className="form-label small fw-semibold text-secondary">
          Email
        </label>
        <input
          id="beta-email-mr-en"
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
          id="beta-policy-mr-en"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-mr-en">
          By sending this message I have read and agree with the{" "}
          <a href="/privacy" target="_blank">Privacy Policy</a>{" "}and the{" "}
          <a href="/privacy" target="_blank">Personal Data Processing Policy</a>.
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-lg w-100 rounded-3 fw-semibold border-0"
        style={{ backgroundColor: loading ? "#5aabf7" : "#0683f5", color: "#fff", transition: "background-color 0.2s" }}
        disabled={!isChecked || loading}
      >
        {loading ? "Sending..." : "Confirm"}
      </button>
    </form>
  );
}

const LOG_LINES = [
  { text: "> Initializing Deep Research Agent... Done", speed: 26 },
  {
    text: "> Connecting to Global Data Hubs... Connected",
    speed: 22,
    source: { name: "Google Maps" },
  },
  { text: "> Skeptic Agent: Validating market size consistency...", speed: 20 },
  {
    text: "> Cross-checking competitors with verified datasets... OK",
    speed: 24,
    source: { name: "Statista" },
  },
];

const TABS = [
  {
    id: "how",
    icon: "🔍",
    label: "How it works",
    title: "Monitoring",
    text:
      "The system runs on a multi‑agent orchestrator that coordinates specialized AI agents for deep research, competitor analysis, and financial modeling. A hybrid synthesis aligns live web data with verified industry archetypes, passing through a multi‑level validation filter for logical consistency and local context.",
    tags: ["Deep Research", "Competitor Scan", "Financial Model", "Validation Filter"],
  },
  {
    id: "data",
    icon: "🗂️",
    label: "What data we need",
    title: "Inputs",
    text:
      "To launch the study, you only need a business concept, geographic location, and basic operating parameters such as project scale and target customer type. Product specifics and monetization details help calibrate queries, reduce noise, and focus on relevant market niches.",
    tags: ["Location", "Concept", "Scale", "Target Customer"],
  },
  {
    id: "result",
    icon: "📬",
    label: "What you get",
    title: "Outcome",
    text:
      "You receive a structured analytical report with TAM/SAM/SOM sizing, direct competitor profiling, and a detailed financial model with payback forecast. Every key conclusion is backed by verified sources, and the final document is polished for decision‑making.",
    tags: ["TAM / SAM / SOM", "Competitor Profiles", "Financial Model", "Verified Sources"],
  },
];

export default function MarketResearchDescriptionPageEn() {
  const [activeTab, setActiveTab] = useState("how");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<typeof LOG_LINES>([]);
  const [isPausing, setIsPausing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const current = LOG_LINES[lineIndex];
    if (!current) return;

    if (isPausing) {
      const pauseTimer = setTimeout(() => setIsPausing(false), 600);
      return () => clearTimeout(pauseTimer);
    }

    const typingTimer = setTimeout(() => {
      if (charIndex < current.text.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setDisplayedLines((prev) => {
          const next = [...prev, current];
          return next.slice(-4);
        });
        setCharIndex(0);
        setLineIndex((prev) => (prev + 1) % LOG_LINES.length);
        setIsPausing(true);
      }
    }, current.speed ?? 28);

    return () => clearTimeout(typingTimer);
  }, [charIndex, isPausing, lineIndex]);

  const currentTab = useMemo(
    () => TABS.find((t) => t.id === activeTab) ?? TABS[0],
    [activeTab],
  );

  const handleModalSuccess = () => {
    setShowModal(false);
    window.location.href = "/en/solutions/marketResearch";
  };

  return (
    <div className="mr-page">
      <Header />

      <main>
        <section className="mr-hero">
          <div className="container">
            <div className="mr-hero-badge">
              <span className="pulse-dot" />
              Market Sense Service
            </div>
            <h1 className="mr-hero-title">
              Market Research Agent:
              <br />
              <span className="accent">Deep market analysis with zero margin for error.</span>
            </h1>
            <div className="mr-hero-grid">
              <div className="mr-hero-text">
                <p className="subtitle">
                  A multi‑agent system that replaces a month of consulting with 15 minutes of
                  precise computation.
                </p>
              </div>
              <div className="rag-console">
                <div className="console-header">AI Research Log</div>
                <div className="console-body">
                  {displayedLines.map((line, idx) => (
                    <div className="console-line log-line" key={`${line.text}-${idx}`}>
                      {line.text}
                      {line.source && (
                        <span className="source-tag">
                          <span className="source-icon" aria-hidden="true">
                            {line.source.name === "Google Maps" ? (
                              <svg viewBox="0 0 24 24" className="icon-svg">
                                <path
                                  fill="#0683f5"
                                  d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                                />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="icon-svg">
                                <path
                                  fill="#7dd36e"
                                  d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                                />
                              </svg>
                            )}
                          </span>
                          Source
                          <span className="source-card">
                            <span className="source-icon" aria-hidden="true">
                              {line.source.name === "Google Maps" ? (
                                <svg viewBox="0 0 24 24" className="icon-svg">
                                  <path
                                    fill="#0683f5"
                                    d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                                  />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" className="icon-svg">
                                  <path
                                    fill="#7dd36e"
                                    d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                                  />
                                </svg>
                              )}
                            </span>
                            {line.source.name}
                          </span>
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="console-line typing-active">
                    {LOG_LINES[lineIndex]?.text.slice(0, charIndex)}
                    <span className="typing-cursor"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mr-tabs">
          <div className="container">
            <div className="mr-tabs-head">
              <h2>
                Service principles.
                <span className="accent"> We keep it simple:</span>
              </h2>
            </div>
            <div className="tabs-header">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                className="mr-step-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="step-header">
                  <span className="step-icon">{currentTab.icon}</span>
                  <h3>{currentTab.title}</h3>
                </div>
                <p>{currentTab.text}</p>
                <div className="step-tags">
                  {currentTab.tags.map((tag) => (
                    <span className="step-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="mr-validation">
          <div className="container">
            <h2>
              Zero tolerance for hallucinations.
              <span className="accent"> We isolate AI from fabricating research context</span>
            </h2>
            <div className="cards">
              <div className="card">
                <h4>Deep Search Agent</h4>
                <p>Deep web scanning beyond the advertising noise.</p>
              </div>
              <div className="card">
                <h4>Skeptic Agent</h4>
                <p>Finds contradictions and demands 2+ independent sources.</p>
              </div>
              <div className="card">
                <h4>Validator Agent</h4>
                <p>Checks logic and isolates the model from made‑up data.</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-5"
          style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}
        >
          <div className="container">
            <h2
              className="fw-bold mb-2"
              style={{ color: "#0f172a", fontSize: "1.45rem" }}
            >
              Our products
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
              <div
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
                      className="bi bi-globe-americas"
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
                      Market Sense Service Worldwide
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
                      Global version
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
                    A market‑research generator for projects in any jurisdiction. Currency, tax,
                    and market inputs adapt to the selected country and city. Multi‑currency
                    financial model, compliance with international banks and funds. Generation time
                    — 8–15 minutes.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    flexShrink: 0,
                    padding: "0.6rem 1.25rem",
                    backgroundColor: "#0683f5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.6rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0565c8")
                  }
                  onMouseOut={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0683f5")
                  }
                >
                  Try →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5 px-3">
          <div className="container" style={{ maxWidth: "52rem" }}>
            <h2 className="h4 fw-bold mb-4" style={{ color: "#1e6078" }}>
              Frequently Asked Questions
            </h2>
            {[
              {
                q: "What is AI market research?",
                a: "AI market research is automated market analysis where artificial intelligence collects and processes data about competitors, target audiences, and trends in minutes instead of weeks. MarketSense AI generates a structured report with insights adapted to a specific jurisdiction and industry.",
              },
              {
                q: "How does AI conduct market research?",
                a: "MarketSense AI uses a multi-agent RAG architecture: specialized agents analyze the competitive landscape, consumer demand, price segments, and market trends in parallel. A Skeptic Agent verifies conclusions for contradictions. The result is a verified report with sources in 8–15 minutes.",
              },
              {
                q: "How is AI market research different from manual analysis?",
                a: "Manual analysis takes 2–4 weeks and costs from $2,000. MarketSense AI delivers a comparable depth report in 15 minutes. The key difference is iteration speed: you can test several hypotheses in a single day and make decisions based on data, not intuition.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <summary
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#0f172a",
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {q}
                  <span style={{ color: "#0683f5", fontSize: "1.25rem", marginLeft: "0.5rem" }}>+</span>
                </summary>
                <p style={{ marginTop: "0.75rem", color: "#475569", lineHeight: 1.65, fontSize: "0.95rem" }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="py-4 px-3">
          <div className="container" style={{ maxWidth: "52rem" }}>
            <h2 className="h5 fw-bold mb-3" style={{ color: "#1e6078" }}>
              Other Upgrowplan tools
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {[
                { label: "PlanMaster AI — business plans", href: "/ai-business-plan-generator" },
                { label: "Synth Focus Lab — audience research", href: "/solutions/synthetic-customer-research" },
                { label: "Why not ChatGPT?", href: "/why-upgrowplan" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #bfdbfe",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

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
              Join the beta test
            </h2>
            <p className="mb-4" style={{ color: "#334155", maxWidth: "36rem" }}>
              Leave your email to receive an invitation to test the beta version.
            </p>
            <BetaForm />
          </div>
        </section>
      </main>

      {showModal && (
        <AccessCodeModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      <style jsx>{`
        .mr-page {
          font-family: var(--font-inter), "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          color: #1e6078;
          background: #ffffff;
        }
        h1, h2, h3, h4 {
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .accent {
          color: #0683f5;
        }
        .mr-hero {
          background: #f0f7ff;
          padding: 90px 0;
        }
        .mr-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(7, 133, 246, 0.08);
          border: 1px solid rgba(7, 133, 246, 0.2);
          border-radius: 30px;
          padding: 5px 16px;
          font-size: 12px;
          color: #0683f5;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }
        .mr-hero-badge .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0683f5;
        }
        .mr-hero-title {
          text-align: center;
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 700;
          color: #1e6078;
          margin-bottom: 2.5rem;
        }
        .mr-hero-grid {
          display: grid;
          gap: 48px;
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }
        .mr-hero-text {
          display: flex;
          align-items: flex-start;
        }
        .subtitle {
          color: #1e6078;
          font-weight: 400;
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.7;
        }
        .rag-console {
          background: #0f1f2a;
          border-radius: 14px;
          border: 1px solid #01346e;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.2);
          overflow: hidden;
        }
        .console-header {
          background: #0b1a21;
          color: #ecf6ff;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .console-body {
          padding: 1rem;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          color: #ecf6ff;
          display: grid;
          gap: 0.6rem;
          height: 200px;
          overflow: hidden;
        }
        .console-line {
          font-size: 0.85rem;
        }
        .log-line {
          font-size: 0.82rem;
          color: rgba(236, 246, 255, 0.85);
          animation: lineIn 0.35s ease;
        }
        .typing-active {
          font-size: 0.85rem;
          color: #8bc4ff;
          min-height: 1.25rem;
        }
        .typing-cursor {
          display: inline-block;
          width: 8px;
          height: 1.1rem;
          background: rgba(1, 52, 110, 0.6);
          margin-left: 0.25rem;
          animation: blink 1s step-end infinite;
        }
        .source-tag {
          position: relative;
          margin-left: 0.4rem;
          color: #7dd36e;
          cursor: pointer;
        }
        .source-card {
          position: absolute;
          left: 0;
          top: 130%;
          background: #ffffff;
          color: #01346e;
          border: 1px solid #01346e;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          white-space: nowrap;
          box-shadow: 0 8px 16px rgba(1, 52, 110, 0.2);
          opacity: 0;
          pointer-events: none;
          transform: translateY(6px);
          transition: all 0.2s ease;
          z-index: 5;
        }
        .source-tag:hover .source-card {
          opacity: 1;
          transform: translateY(0);
        }
        .icon-svg {
          width: 14px;
          height: 14px;
        }
        .source-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(1, 52, 110, 0.1);
          margin-right: 0.35rem;
          flex-shrink: 0;
        }
        .mr-tabs {
          padding: 70px 0;
          background: #f0f7ff;
        }
        .mr-tabs h3,
        .mr-validation h2,
        .mr-beta h2 {
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #1e6078;
        }
        .mr-tabs-head {
          text-align: center;
          margin-bottom: 32px;
        }
        .mr-tabs-head h2 .accent {
          color: #0683f5;
          font-weight: 600;
        }
        .tabs-header {
          display: flex;
          gap: 12px;
          margin-bottom: 36px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 10px 20px;
          border: 2px solid #0683f5;
          border-radius: 30px;
          background: white;
          color: #0683f5;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .tab-btn.active {
          background: #0683f5;
          color: #fff;
        }
        .tab-icon {
          font-size: 18px;
        }
        .mr-step-card {
          background: #fff;
          border-radius: 20px;
          padding: 32px 36px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          border: 1px solid #e0eaf6;
          width: min(66%, 760px);
          margin: 0 auto;
          text-align: left;
        }
        .mr-step-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1e6078;
          margin: 0;
        }
        .mr-step-card p {
          color: #475569;
          line-height: 1.8;
          font-size: 15px;
          margin-bottom: 20px;
        }
        .step-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .step-icon {
          font-size: 24px;
          line-height: 1;
        }
        .step-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .step-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(6,131,245,0.07);
          border: 1px solid rgba(6,131,245,0.2);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          color: #0683f5;
          font-weight: 600;
        }
        .mr-validation {
          background: #f0f7ff;
          padding: 70px 0;
        }
        .mr-validation h2 {
          text-align: center;
          margin-bottom: 32px;
        }
        .mr-validation h2 .accent {
          color: #0683f5;
          font-weight: 600;
        }
        .cards {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .card:hover {
          background: #f3f8ff;
          border-color: rgba(6, 131, 245, 0.2);
          box-shadow: 0 10px 24px rgba(6, 131, 245, 0.12);
        }
        .card h4 {
          color: #0683f5;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes lineIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 991px) {
          .mr-hero-grid {
            grid-template-columns: 1fr;
          }
          .mr-step-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
