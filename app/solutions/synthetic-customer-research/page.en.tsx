"use client";

import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const FONT = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const faqs = [
  {
    q: "What are synthetic respondents?",
    a: "Synthetic respondents are AI personas with defined demographics, income level, age, lifestyle, and behaviour patterns. They simulate how real buyers would react to your product, price, or message — without recruiting actual participants.",
  },
  {
    q: "How accurate are synthetic respondents compared to real focus groups?",
    a: "Research comparing AI synthetic panels to traditional focus groups shows 85–92% alignment in purchase intent and sentiment direction. Best used for early-stage concept testing and pricing research where speed matters.",
  },
  {
    q: "How is this different from a traditional focus group?",
    a: "Traditional focus groups take 2–4 weeks to recruit and cost $3,000–$10,000 per session. Synthetic respondents are ready in 15 minutes, cost a fraction of the price, and have no geographic limits.",
  },
  {
    q: "Can I test pricing sensitivity?",
    a: "Yes. Configure panels to test willingness-to-pay at different price points — simulating Van Westendorp or conjoint-style analysis without the logistics of a real survey.",
  },
  {
    q: "What types of research can I run?",
    a: "Concept testing, product-market fit, pricing sensitivity, brand perception, ad copy testing, and UX feedback — with a configurable panel of 5 to 50+ AI personas.",
  },
  {
    q: "How do I get started?",
    a: "Open Synth Focus Lab, describe your idea and target audience. The AI builds personas and runs the session — results in 15 minutes.",
  },
];

const steps = [
  {
    num: "01",
    title: "Describe your idea and audience",
    text: "Specify the product or concept to test. Set audience parameters: age, income, location, lifestyle.",
  },
  {
    num: "02",
    title: "AI builds the personas",
    text: "Synth Focus Lab creates a panel of 5–50+ AI personas with unique demographic and behavioural profiles.",
  },
  {
    num: "03",
    title: "Personas respond and discuss",
    text: "Each persona reacts to your concept, asks questions, raises objections — just like a real buyer in a meeting.",
  },
  {
    num: "04",
    title: "Receive a structured insight report",
    text: "Analysed output: purchase intent, top objections, price threshold, product strengths and weaknesses.",
  },
];

const comparison = [
  { param: "Time", traditional: "2–4 weeks", synthetic: "15 minutes" },
  { param: "Cost", traditional: "$3,000 – $10,000", synthetic: "Fraction of the cost" },
  { param: "Recruiting", traditional: "Required", synthetic: "Not needed" },
  { param: "Geographic limits", traditional: "Yes", synthetic: "None" },
  { param: "Repeat test", traditional: "Expensive", synthetic: "Instant" },
  { param: "Purchase intent accuracy", traditional: "High", synthetic: "85–92%" },
];

const useCases = [
  { icon: "💡", title: "Startups", text: "Validate whether the market needs your product before raising investment or building an MVP." },
  { icon: "💰", title: "Pricing", text: "Find the optimal price point — test 3–5 variants across different audience segments." },
  { icon: "📣", title: "Marketing", text: "Test headlines, offers, and ad copy before launching a campaign." },
  { icon: "🏪", title: "New market", text: "Gauge demand in a new city or country without a physical market entry." },
];

export default function SyntheticCustomerResearchEn() {
  return (
    <div style={{ fontFamily: FONT, color: "#171717" }}>
      <Header />
      <main>

        {/* Hero */}
        <section style={{ background: "#d9ebf5", padding: "4rem 1rem 3.5rem" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                background: "#1e6078",
                color: "#fff",
                borderRadius: 20,
                padding: "0.3rem 1rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
                letterSpacing: "0.05em",
                fontFamily: FONT,
              }}
            >
              SYNTHETIC RESPONDENTS
            </div>
            <h1
              style={{
                fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
                fontWeight: 700,
                color: "#1e6078",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
                fontFamily: FONT,
              }}
            >
              Test your business idea on virtual buyers in 15 minutes
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#171717",
                maxWidth: 640,
                margin: "0 auto 2rem",
                lineHeight: 1.65,
                fontFamily: FONT,
              }}
            >
              AI synthetic respondents replace expensive focus groups. No recruiting, no waiting — 85–92% accuracy compared to real participants.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/solutions/synthFocusLab"
                style={{
                  background: "#0683f5",
                  color: "#fff",
                  padding: "0.8rem 2rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: FONT,
                }}
              >
                Start research
              </Link>
              <Link
                href="/solutions/synthFocusLab/descriptionPage"
                style={{
                  background: "transparent",
                  color: "#1e6078",
                  padding: "0.8rem 2rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "2px solid #1e6078",
                  fontFamily: FONT,
                }}
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        {/* What are synthetic respondents */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "1.25rem",
                fontFamily: FONT,
              }}
            >
              What are synthetic respondents
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#171717", lineHeight: 1.7, marginBottom: "1rem", fontFamily: FONT }}>
              A <strong>synthetic respondent</strong> is an AI persona with a detailed profile: age, income, profession, values, buying habits, risk tolerance. Not an avatar or template — a behavioural model of a real person built from market data.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#171717", lineHeight: 1.7, marginBottom: "1rem", fontFamily: FONT }}>
              When you test a product, these personas react the way a real buyer from your target audience would. They ask questions, express doubts, and name the price they are willing to pay.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#171717", lineHeight: 1.7, fontFamily: FONT }}>
              For early-stage validation, offer testing, or pricing strategy — synthetic respondents give you a reliable signal in 15 minutes instead of 3 weeks.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2.5rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              How the research works
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              {steps.map((step) => (
                <div
                  key={step.num}
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "1.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0683f5", marginBottom: "0.5rem", fontFamily: FONT }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem", fontFamily: FONT }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0, fontFamily: FONT }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology deep-dive */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "1.5rem",
                fontFamily: FONT,
              }}
            >
              How synthetic personas are built
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  label: "Persona generation",
                  text: "Based on your product and location, the AI models 5–10 detailed archetypes with distinct behaviours — from conservative pragmatists to digital innovators. These form a panel of 25+ unique virtual respondents.",
                },
                {
                  label: "Live search and context",
                  text: "The system doesn't guess — it verifies facts. The Search Agent scans the real market in your specified location: competitor prices, live reviews, and current regional news.",
                },
                {
                  label: "Cultural and social layer",
                  text: "The service analyses the socio-demographic and cultural context of the location. A respondent in Tel Aviv answers with local business norms in mind; in countries with specific cultural values, the system accounts for those automatically.",
                },
                {
                  label: "400+ interviews per cycle",
                  text: "Each respondent is asked dozens of deep questions. Response coherence reaches 80%+. The full cycle takes 15–30 minutes — necessary time to collect, verify data and apply cultural context.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1.1rem 1.4rem",
                    border: "1px solid #d9ebf5",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ minWidth: 8, background: "#0683f5", borderRadius: 4, alignSelf: "stretch" }} />
                  <div>
                    <div style={{ fontWeight: 700, color: "#01346e", marginBottom: "0.3rem", fontFamily: FONT, fontSize: "1rem" }}>
                      {item.label}
                    </div>
                    <p style={{ margin: 0, color: "#171717", lineHeight: 1.65, fontSize: "0.95rem", fontFamily: FONT }}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              <div>
                <h2 style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 700, color: "#01346e", marginBottom: "1rem", fontFamily: FONT }}>
                  What we need to start
                </h2>
                <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    "Product description, key value proposition and hypotheses",
                    "Target audience type (B2B / B2C / B2B2C)",
                    "Geography: country, city, and sampling parameters",
                    "Research goals — what you want to find out",
                  ].map((item) => (
                    <li key={item} style={{ color: "#171717", lineHeight: 1.6, fontSize: "0.95rem", fontFamily: FONT }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 700, color: "#01346e", marginBottom: "1rem", fontFamily: FONT }}>
                  What you get
                </h2>
                <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    "Persona profiles with motivations and behavioural patterns",
                    "Results of 400+ virtual interviews with response analysis",
                    "Positioning and messaging recommendations",
                    "A final report ready for investor presentation",
                  ].map((item) => (
                    <li key={item} style={{ color: "#171717", lineHeight: 1.6, fontSize: "0.95rem", fontFamily: FONT }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Synthetic vs traditional focus groups
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem", fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: "#01346e", color: "#ffffff" }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontWeight: 600 }}>Parameter</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Traditional focus group</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontWeight: 600 }}>Synth Focus Lab</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={row.param} style={{ background: i % 2 === 0 ? "#f7fbff" : "#ffffff" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#01346e" }}>{row.param}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center", color: "#171717" }}>{row.traditional}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center", color: "#0683f5", fontWeight: 600 }}>{row.synthetic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section style={{ padding: "3.5rem 1rem", background: "#f7fbff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Who needs this and when
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.2rem" }}>
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "1.5rem",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{uc.icon}</div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.4rem", fontFamily: FONT }}>
                    {uc.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0, fontFamily: FONT }}>
                    {uc.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "3.5rem 1rem", background: "#ffffff" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#01346e",
                marginBottom: "2rem",
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              Frequently asked questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  style={{ border: "1px solid #d9ebf5", borderRadius: 10, padding: "1.2rem 1.5rem" }}
                >
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#01346e", marginBottom: "0.5rem", fontFamily: FONT }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#171717", lineHeight: 1.65, margin: 0, fontFamily: FONT }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#01346e", padding: "3.5rem 1rem", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "1rem",
                fontFamily: FONT,
              }}
            >
              Test your idea right now
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#d9ebf5", marginBottom: "2rem", lineHeight: 1.65, fontFamily: FONT }}>
              Synth Focus Lab is Upgrowplan's virtual focus group tool. Describe your idea, configure the audience, get a report in 15 minutes.
            </p>
            <Link
              href="/solutions/synthFocusLab"
              style={{
                background: "#0683f5",
                color: "#ffffff",
                padding: "0.9rem 2.5rem",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1.05rem",
                display: "inline-block",
                fontFamily: FONT,
              }}
            >
              Open Synth Focus Lab
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
