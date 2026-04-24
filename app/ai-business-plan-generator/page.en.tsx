"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const faqs = [
  { q: "What does an AI business plan generator produce?", a: "PlanMaster AI generates a complete investor-ready business plan: executive summary, market analysis with competitor mapping, financial model (P&L, cash flow, break-even, 3-year projections), marketing strategy, operational plan, and risk assessment — as a Word (.docx) file plus a pitch deck." },
  { q: "How long does it take?", a: "10–20 minutes. The system needs time to collect live data from 50+ verified sources, run deterministic Python financial calculations, and pass each section through Skeptic Agent validation." },
  { q: "How is this different from ChatGPT or a template?", a: "Templates are static — they don't include your market data. ChatGPT generates plausible-sounding but often inaccurate numbers from training data. PlanMaster collects live market data, runs real calculations, and validates every figure through Skeptic Agent." },
  { q: "Does the plan follow UNIDO or EBRD standards?", a: "Yes. Plans follow UNIDO (UN Industrial Development Organization) and EBRD (European Bank for Reconstruction and Development) frameworks — the standards used by development banks and investment funds worldwide." },
  { q: "Is a pitch deck included?", a: "Yes. In addition to the Word document, PlanMaster generates a pitch deck with the investment thesis, market opportunity, financials, and competitive positioning." },
  { q: "Which countries and industries are supported?", a: "All. You specify the country, city, currency, and business type (B2B / B2C / B2B2C). The system automatically adapts tax assumptions, market context, and financial benchmarks." },
];

const steps = [
  { num: "01", title: "Describe your idea", text: "Enter your product or service, key differentiator, target audience, and country. The more detail, the more relevant the market analysis." },
  { num: "02", title: "Set the parameters", text: "Choose business type (B2B/B2C/B2B2C), scale, industry, and currency. PlanMaster supports any country and adapts context automatically." },
  { num: "03", title: "AI agents collect live data", text: "The Search Agent scans 50+ live sources: competitor prices, market size, demand trends, local rental and salary benchmarks." },
  { num: "04", title: "Skeptic Agent validates every figure", text: "The built-in sceptic agent cross-checks all key metrics against live sources. Unrealistic assumptions are flagged and corrected before finalisation." },
  { num: "05", title: "Download Word + pitch deck", text: "The formatted business plan (.docx) and pitch deck are ready to download — no additional editing needed." },
];

const deliverables = [
  { icon: "📄", title: "Executive summary", text: "Key metrics, investment, profit, margin, payback — on one page for the investor." },
  { icon: "📊", title: "Market analysis", text: "TAM/SAM/SOM, competitor map (up to 20 players), customer segments, demand trends and pricing benchmarks." },
  { icon: "💰", title: "Financial model", text: "P&L, cash flow, break-even, 3-year revenue and expense forecast. Python calculations — no AI guesswork." },
  { icon: "🎯", title: "Marketing strategy", text: "Positioning, acquisition channels, key messages — based on real market and competitor data." },
  { icon: "📑", title: "Word document (.docx)", text: "Full-format business plan with data sources. Ready to submit to a bank, grant committee, or investor." },
  { icon: "🚀", title: "Pitch deck", text: "Structured presentation with investment thesis, market opportunity, financials, and competitive positioning." },
];

export default function AiBizPlanGeneratorEn() {
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
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/solutions/planMaster" style={{ background: "#0683f5", color: "#fff", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
                Generate business plan
              </Link>
              <Link href="/solutions/planMaster/descriptionPage" style={{ background: "transparent", color: "#1e6078", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "1rem", border: "2px solid #1e6078" }}>
                How it works
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

        {/* Methodology badge */}
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

        {/* How it works */}
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

        {/* CTA */}
        <section style={{ background: "#01346e", padding: "3.5rem 1rem", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
              Generate your business plan now
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#d9ebf5", marginBottom: "2rem", lineHeight: 1.65 }}>
              PlanMaster AI — Upgrowplan's business plan generator following UNIDO/EBRD standards. Real data, Skeptic Agent, Word + pitch deck.
            </p>
            <Link href="/solutions/planMaster" style={{ background: "#0683f5", color: "#ffffff", padding: "0.9rem 2.5rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1.05rem", display: "inline-block" }}>
              Open PlanMaster AI
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
