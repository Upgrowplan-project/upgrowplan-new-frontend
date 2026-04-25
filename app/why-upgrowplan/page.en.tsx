"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const faqs = [
  { q: "What is the main difference between Upgrowplan and ChatGPT?", a: "ChatGPT generates text from training data — it cannot access current competitor prices or real market size figures. It produces plausible-sounding but often inaccurate numbers. Upgrowplan uses RAG: a live search agent collects data from 50+ sources, Python scripts run deterministic calculations, and Skeptic Agent validates every figure." },
  { q: "How does Upgrowplan prevent AI hallucinations?", a: "Three layers: (1) Search Agent collects live data before any text is generated. (2) Financial calculations use deterministic Python scripts — not probabilistic AI. (3) Skeptic Agent reviews every section and requires corrections for unrealistic assumptions before finalisation." },
  { q: "How does Upgrowplan compare to Upmetrics or LivePlan?", a: "Upmetrics and LivePlan are template-and-wizard tools — you fill in the data, they format the document. Upgrowplan actively researches the market, finds your competitors, sizes the opportunity, builds the financial model, and validates the output." },
  { q: "Is Upgrowplan cheaper than hiring a consultant?", a: "A business plan consultant typically charges $1,500–$5,000 and takes 2–4 weeks. Upgrowplan produces a comparable investor-ready document with live data and a financial model in 10–20 minutes." },
  { q: "Does Upgrowplan follow recognised international standards?", a: "Yes. Plans follow UNIDO (UN Industrial Development Organization) and EBRD (European Bank for Reconstruction and Development) frameworks — the standards used by development banks, grant committees, and international investors." },
];

const comparisonRows = [
  { feature: "Live market data", upgrow: true, chatgpt: false, template: false, consultant: true },
  { feature: "Deterministic financial model", upgrow: true, chatgpt: false, template: false, consultant: true },
  { feature: "Hallucination check (Skeptic Agent)", upgrow: true, chatgpt: false, template: false, consultant: "partial" },
  { feature: "UNIDO / EBRD standard", upgrow: true, chatgpt: false, template: false, consultant: "depends" },
  { feature: "Word doc + pitch deck", upgrow: true, chatgpt: false, template: "template only", consultant: true },
  { feature: "Time to ready", upgrow: "10–20 min", chatgpt: "instant, inaccurate", template: "DIY", consultant: "2–4 weeks" },
  { feature: "Cost", upgrow: "per plan", chatgpt: "~$20/mo", template: "free", consultant: "$1,500–$5,000" },
];

const reasons = [
  { icon: "🔍", title: "RAG architecture instead of guessing", text: "The Search Agent collects live data from 50+ verified sources — Google Maps, Statista, open registries, industry databases. Only after data collection does the LLM process the verified context at temperature ≤ 0.2." },
  { icon: "🧮", title: "Python calculations instead of AI estimates", text: "All financial models — P&L, cash flow, break-even, 3-year projections — are calculated using deterministic Python scripts. Numbers are mathematically accurate, not 'plausible'." },
  { icon: "🕵️", title: "Skeptic Agent reviews every section", text: "The built-in agent cross-checks all key metrics against live sources. 90% market share? 300% margins? 2-month payback? The agent flags the section and requires corrections before producing the document." },
  { icon: "🏦", title: "UNIDO / EBRD methodology", text: "The plan structure follows international standards used by development banks and investment funds. The document is accepted by banks, grant committees, and investors without additional rework." },
];

function CellVal({ val }: { val: boolean | string }) {
  if (val === true) return <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>;
  if (val === false) return <span style={{ color: "#dc2626" }}>✗</span>;
  return <span style={{ color: "#64748b", fontSize: "0.88rem" }}>{val}</span>;
}

export default function WhyUpgrowplanEn() {
  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>

        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "4rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "#1e6078", color: "#fff", borderRadius: 20, padding: "0.3rem 1rem", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", letterSpacing: "0.05em" }}>
              COMPARISON
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)", fontWeight: 700, color: "#1e6078", lineHeight: 1.15, marginBottom: "1.25rem" }}>
              Why Upgrowplan instead of ChatGPT or a consultant?
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#171717", maxWidth: 640, margin: "0 auto 2rem", lineHeight: 1.65 }}>
              AI without data verification is an expensive generator of plausible mistakes. Here is how Upgrowplan solves the hallucination problem that makes ordinary AI plans unusable for banks and investors.
            </p>
            <Link href="/solutions/planMaster" style={{ background: "#0683f5", color: "#fff", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
              Try PlanMaster AI
            </Link>
          </div>
        </section>

        {/* 4 reasons */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2.5rem", textAlign: "center" }}>
              4 architectural differences
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.4rem" }}>
              {reasons.map((r) => (
                <div key={r.title} style={{ background: "#f7fbff", borderRadius: 14, padding: "1.5rem", border: "1px solid #d9ebf5" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{r.icon}</div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem" }}>{r.title}</h3>
                  <p style={{ fontSize: "0.93rem", color: "#171717", lineHeight: 1.65, margin: 0 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Full comparison
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.93rem", fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: "#01346e", color: "#fff" }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontWeight: 600 }}>Feature</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 700, color: "#7dd3fc" }}>Upgrowplan</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>ChatGPT</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Template</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Consultant</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} style={{ background: i % 2 === 0 ? "#ffffff" : "#f7fbff" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#01346e" }}>{row.feature}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center", background: "rgba(7,133,246,0.06)" }}><CellVal val={row.upgrow} /></td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><CellVal val={row.chatgpt} /></td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><CellVal val={row.template} /></td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><CellVal val={row.consultant} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", fontWeight: 700, color: "#01346e", marginBottom: "2rem", textAlign: "center" }}>
              Frequently asked questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div key={faq.q} style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.2rem 1.5rem" }}>
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
              See the difference yourself
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#d9ebf5", marginBottom: "2rem", lineHeight: 1.65 }}>
              Generate a business plan with PlanMaster AI and compare it to what ChatGPT produces. The difference is visible from the first section.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/solutions/planMaster" style={{ background: "#0683f5", color: "#fff", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
                Try PlanMaster AI
              </Link>
              <Link href="/solutions" style={{ background: "transparent", color: "#d9ebf5", padding: "0.85rem 2rem", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "1rem", border: "2px solid rgba(217,235,245,0.4)" }}>
                All tools
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
