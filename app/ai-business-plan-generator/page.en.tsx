"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "../../components/Header";
import IntelligenceLabV3En from "../solutions/planMaster/descriptionPage/IntelligenceLab-v3.en";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const INFO_TABS = [
  {
    id: "how",
    icon: "🔍",
    label: "How the service works",
    title: "How the service works",
    text: "Creates a business plan in the approved format. Uses classic planning methodology, marketing and economic analysis. Full research and document delivery takes about 5–10 minutes.",
    bullets: [
      "Analyzes the idea, business format, city, funding sources and all project inputs.",
      "Collects market and competitor data to justify key metrics such as average ticket and demand. Provides a detailed competitor analysis and research on the target audience. Proposes a marketing strategy based on current data. Pulls fresh data on rent, salaries and taxes in your region.",
      "Builds a realistic financial model: revenue forecast, expenses, profit, taxes, profitability and payback period.",
      "If the project is not profitable enough, the service stops, informs you about the critical metric and suggests adjusting key business indicators.",
      "Produces the final document with sections, sources and a conclusion ready for submission.",
    ],
    tags: ["Deep Research", "Competitor Scan", "Financial Model", "Validation Filter"],
  },
  {
    id: "inputs",
    icon: "🗂️",
    label: "What to fill in",
    title: "What to fill in",
    text: "The more accurate and complete your inputs, the higher the quality of market analysis, the more direct competitors can be found, and the more realistic the financial calculations will be.",
    bullets: [
      "Describe the business idea clearly: product/service, format, key differentiator, product or client specifics, and important parameters such as area and location details.",
      "Specify geography (region, city and exact address if available) for correct competitor and customer analysis.",
      "Provide the funding structure: own funds, support, amounts already invested and the spending period. Add current loan burden if you have one.",
      "Fill in the initiator profile: business experience, education, skills and achievements relevant to successful project delivery.",
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
      "A business plan generator for projects in any jurisdiction. Currency, tax and market inputs adapt to the selected country and city. Multi-currency financial model, compatible with international bank and fund requirements.",
    status: "pending" as const,
  },
  {
    id: "soccontract",
    icon: "bi-file-earmark-check",
    title: "Social Contract 2026",
    subtitle: "Local version (Russia)",
    description:
      "Business plan in the approved format for social contract submission. Built-in government support criteria and section consistency checks aligned with Ministry of Labour expectations. Generation time — 5–10 minutes.",
    status: "pending" as const,
  },
];

const faqs = [
  { q: "What does an AI business plan generator produce?", a: "PlanMaster AI generates a complete investor-ready business plan: executive summary, market analysis with competitor mapping, financial model (P&L, cash flow, break-even, 3-year projections), marketing strategy, operational plan, and risk assessment — as a Word (.docx) file plus a pitch deck." },
  { q: "How long does it take?", a: "10–20 minutes. The system needs time to collect live data from 50+ verified sources, run deterministic Python financial calculations, and pass each section through Skeptic Agent validation." },
  { q: "How is this different from ChatGPT or a template?", a: "Templates are static — they don't include your market data. ChatGPT generates plausible-sounding but often inaccurate numbers from training data. PlanMaster collects live market data, runs real calculations, and validates every figure through Skeptic Agent." },
  { q: "Does the plan follow UNIDO or EBRD standards?", a: "Yes. Plans follow UNIDO (UN Industrial Development Organization) and EBRD (European Bank for Reconstruction and Development) frameworks — the standards used by development banks and investment funds worldwide." },
  { q: "Is a pitch deck included?", a: "Yes. In addition to the Word document, PlanMaster generates a pitch deck with the investment thesis, market opportunity, financials, and competitive positioning." },
  { q: "Which countries and industries are supported?", a: "All. You specify the country, city, currency, and business type (B2B / B2C / B2B2C). The system automatically adapts tax assumptions, market context, and financial benchmarks." },
  { q: "How do I write a business plan with AI?", a: "With PlanMaster AI: describe your business idea and target market, set the country and business type — the system collects live market data, builds a financial model using Python calculations, validates every figure through Skeptic Agent, and delivers a complete Word document with pitch deck in 10–20 minutes." },
  { q: "What is the best AI tool for writing a business plan?", a: "The best AI business plan tool collects live market data (not training-data guesses), runs real financial calculations, and validates output before delivery. PlanMaster AI does all three: RAG-based live search, deterministic Python financial modelling, and Skeptic Agent validation — following UNIDO/EBRD international standards." },
];

const deliverables = [
  { icon: "📄", title: "Executive summary", text: "Key metrics, investment, profit, margin, payback — on one page for the investor." },
  { icon: "📊", title: "Market analysis", text: "TAM/SAM/SOM, competitor map (up to 20 players), customer segments, demand trends and pricing benchmarks." },
  { icon: "💰", title: "Financial model", text: "P&L, cash flow, break-even, 3-year revenue and expense forecast. Python calculations — no AI guesswork." },
  { icon: "🎯", title: "Marketing strategy", text: "Positioning, acquisition channels, key messages — based on real market and competitor data." },
  { icon: "📑", title: "Word document (.docx)", text: "Full-format business plan with data sources. Ready to submit to a bank, grant committee, or investor." },
  { icon: "🚀", title: "Pitch deck", text: "Structured presentation with investment thesis, market opportunity, financials, and competitive positioning." },
];

const steps = [
  { num: "01", title: "Describe your idea", text: "Enter your product or service, key differentiator, target audience, and country. The more detail, the more relevant the market analysis." },
  { num: "02", title: "Set the parameters", text: "Choose business type (B2B/B2C/B2B2C), scale, industry, and currency. PlanMaster supports any country and adapts context automatically." },
  { num: "03", title: "AI agents collect live data", text: "The Search Agent scans 50+ live sources: competitor prices, market size, demand trends, local rental and salary benchmarks." },
  { num: "04", title: "Skeptic Agent validates every figure", text: "The built-in sceptic agent cross-checks all key metrics against live sources. Unrealistic assumptions are flagged and corrected before finalisation." },
  { num: "05", title: "Download Word + pitch deck", text: "The formatted business plan (.docx) and pitch deck are ready to download — no additional editing needed." },
];

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
          message: `запрос на бета-тестирование PlanMaster AI получен`,
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
        <label htmlFor="beta-email-plan-en" className="form-label small fw-semibold text-secondary">Email</label>
        <input
          id="beta-email-plan-en"
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
          id="beta-policy-plan-en"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-plan-en">
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

export default function AiBizPlanGeneratorEn() {
  const [activeTab, setActiveTab] = useState("how");
  const active = INFO_TABS.find((t) => t.id === activeTab) ?? INFO_TABS[0];

  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>

        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "4rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "#1e6078", color: "#fff", borderRadius: 20, padding: "0.3rem 1rem", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", letterSpacing: "0.05em" }}>
              AI · BUSINESS PLAN · UNIDO/EBRD
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)", fontWeight: 700, color: "#1e6078", lineHeight: 1.15, marginBottom: "1.25rem" }}>
              AI Business Plan Generator
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#171717", maxWidth: 640, margin: "0 auto 0.75rem", lineHeight: 1.65 }}>
              An investor-ready business plan with real market data, financial model, and pitch deck — built by AI following international standards.
            </p>
            <p style={{ fontSize: "1rem", color: "#1e6078", fontWeight: 600, marginBottom: "2rem" }}>
              UNIDO / EBRD Standard · Skeptic Agent · 10–20 min · Word + Pitch Deck
            </p>
            <p style={{ fontSize: "0.87rem", color: "#64748b", marginBottom: "1.5rem" }}>
              ⏳ Product in development. Release — Summer 2026.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#beta-form" style={{ background: "#0683f5", color: "#fff", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
                Reserve a spot
              </a>
              <Link href="/why-upgrowplan" style={{ background: "transparent", color: "#1e6078", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "1rem", border: "2px solid #1e6078" }}>
                Why not ChatGPT?
              </Link>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              What's included in the business plan
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem" }}>
              {deliverables.map((d) => (
                <div key={d.title} style={{ background: "#f7fbff", borderRadius: 12, padding: "1.4rem", border: "1px solid #d9ebf5" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{d.icon}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#01346e", marginBottom: "0.4rem" }}>{d.title}</h3>
                  <p style={{ fontSize: "0.92rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section style={{ padding: "2.5rem 1rem", background: "#01346e" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            {[
              { label: "Methodology", value: "UNIDO / EBRD" },
              { label: "Data sources", value: "50+" },
              { label: "Generation time", value: "10–20 min" },
              { label: "Data validation", value: "Skeptic Agent" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>{item.value}</div>
                <div style={{ fontSize: "0.82rem", color: "#d9ebf5", marginTop: "0.2rem" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture diagram */}
        <IntelligenceLabV3En />

        {/* How it works steps */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2.5rem", textAlign: "center" }}>
              How the generation works
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {steps.map((step) => (
                <div key={step.num} style={{ display: "flex", gap: "1.25rem", background: "#ffffff", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0683f5", minWidth: 36 }}>{step.num}</div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.3rem" }}>{step.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service principles tabs */}
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
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e6078", margin: 0 }}>{active.title}</h3>
                </div>
                <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>{active.text}</p>
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
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(6,131,245,0.07)", border: "1px solid rgba(6,131,245,0.2)",
                        borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#0683f5", fontWeight: 600,
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

        {/* Skeptic Agent callout */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ background: "#f7fbff", border: "2px solid #d9ebf5", borderRadius: 16, padding: "2rem 2.5rem" }}>
              <h2 style={{ fontSize: "clamp(1.4rem, 2vw, 1.9rem)", fontWeight: 700, color: "#01346e", marginBottom: "1rem" }}>
                Skeptic Agent — the built-in quality controller
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#171717", lineHeight: 1.7, marginBottom: "1rem" }}>
                Every business plan is reviewed by Skeptic Agent — an AI agent that cross-checks all key figures against live data sources. If a metric looks unrealistic — 90% market share, 300% margins, 2-month payback — the agent flags the section and requires correction before the document is finalised.
              </p>
              <p style={{ fontSize: "1.05rem", color: "#171717", lineHeight: 1.7, margin: 0 }}>
                This eliminates the most common problem with AI-generated plans: numbers that look convincing but don't survive due diligence.
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-5" style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}>
          <div className="container">
            <h2 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "1.45rem" }}>Our products</h2>
            <p className="mb-4" style={{ color: "#475569", fontSize: "0.95rem", maxWidth: 640, lineHeight: 1.6 }}>
              Products are available on request or with a personal tester code.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {PRODUCTS.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "0 1 calc(75% - 1.25rem)", minWidth: 260, backgroundColor: "#ffffff", border: "1px solid rgba(6,131,245,0.15)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className={`bi ${p.icon}`} style={{ color: "#0683f5", fontSize: "1.2rem" }} aria-hidden />
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>{p.title}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", backgroundColor: "#f1f5f9", borderRadius: "0.3rem", padding: "0.1rem 0.5rem" }}>{p.subtitle}</span>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "#475569", marginBottom: 0, lineHeight: 1.55 }}>{p.description}</p>
                  </div>
                  <button
                    disabled
                    style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "#e2e8f0", color: "#94a3b8", border: "none", borderRadius: "0.6rem", fontSize: "0.9rem", fontWeight: 600, cursor: "not-allowed", whiteSpace: "nowrap" }}
                  >
                    <span style={{ width: 14, height: 14, border: "2px solid #94a3b8", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spinLoader 0.9s linear infinite" }} />
                    Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <style>{`@keyframes spinLoader { to { transform: rotate(360deg); } }`}</style>

        {/* FAQ */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Frequently asked questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div key={faq.q} style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.2rem 1.5rem", background: "#ffffff" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem" }}>{faq.q}</h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other tools */}
        <section style={{ padding: "2.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#01346e", marginBottom: "1.25rem" }}>
              Other Upgrowplan tools
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { href: "/solutions/synthetic-customer-research", icon: "👥", title: "Synth Focus Lab", desc: "Test your business idea on virtual buyers in 15 minutes — no focus group recruiting needed." },
                { href: "/solutions/marketResearch/descriptionPage", icon: "🔍", title: "MarketSense AI", desc: "AI agent for full market research with source verification and data analysis." },
                { href: "/why-upgrowplan", icon: "⚡", title: "Why not ChatGPT?", desc: "How Upgrowplan differs from ChatGPT, consultants, and templates — a direct comparison." },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href} style={{ display: "block", background: "#f7fbff", border: "1px solid #d9ebf5", borderRadius: 10, padding: "1rem 1.25rem", textDecoration: "none" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}>{tool.icon}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#01346e", marginBottom: "0.3rem" }}>{tool.title}</div>
                  <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beta form */}
        <section
          id="beta-form"
          className="py-5 px-3"
          style={{ background: "linear-gradient(145deg, #e8f4fc 0%, #f5f9ff 45%, #eef6ff 100%)", boxShadow: "0 8px 32px rgba(6,131,245,0.08)" }}
        >
          <div className="container">
            <h2 className="h5 fw-bold mb-3" style={{ color: "#0f172a" }}>Join the beta test</h2>
            <p className="mb-4" style={{ color: "#334155", maxWidth: "36rem" }}>
              Leave your email to receive an invitation to test the beta version.
            </p>
            <BetaForm />
          </div>
        </section>

      </main>
    </div>
  );
}
