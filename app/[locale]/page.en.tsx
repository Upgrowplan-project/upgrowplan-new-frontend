"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";
  const [demoIndex, setDemoIndex] = useState(0);

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === "en") {
      return path;
    }
    return `/${locale}${path}`;
  };

  const demoQueries = [
    {
      title: "Coffee shop",
      city: "Lisbon",
      insights: ["12 local competitors", "Avg price €4.20", "Tourism demand +5.8%"],
    },
    {
      title: "Yoga studio",
      city: "Toronto",
      insights: ["18 studios nearby", "Top channel: Instagram", "Retention 3.2 months"],
    },
    {
      title: "Grooming salon",
      city: "Melbourne",
      insights: ["9 direct rivals", "Avg ticket AU$68", "Demand +7.1% YoY"],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % demoQueries.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-2026">
      <Header />

      <main>
        <section className="hero-2026">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Business plans that actually get funded.</h1>
              <p className="hero-subtitle">
                Powered by AI agents, verified by experts. Build a financial model
                and market analysis with live data in minutes. 260+ successful
                projects and 14+ years of hands-on experience.
              </p>
              <div className="hero-cta">
                <Link href={getLocalePath("/solutions")} className="btn btn-primary btn-lg">
                  Try the platform
                </Link>
                <Link href={getLocalePath("/contacts")} className="btn btn-outline-primary btn-lg">
                  Talk to an expert
                </Link>
              </div>
              <div className="hero-proof">
                <div>
                  <span className="proof-number">260+</span>
                  <span className="proof-label">projects launched</span>
                </div>
                <div>
                  <span className="proof-number">14+ years</span>
                  <span className="proof-label">expertise</span>
                </div>
                <div>
                  <span className="proof-number">UNIDO / EBRD</span>
                  <span className="proof-label">industry standards</span>
                </div>
              </div>
            </div>
            <div className="hero-demo">
              <div className="demo-card">
                <div className="demo-header">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                  <span className="demo-title">Agent Console</span>
                </div>
                <div className="demo-body">
                  <div className="demo-line">
                    Searching competitors for {demoQueries[demoIndex].title} in{" "}
                    {demoQueries[demoIndex].city}...
                  </div>
                  <div className="demo-line">
                    {demoQueries[demoIndex].insights[0]}
                  </div>
                  <div className="demo-line">
                    {demoQueries[demoIndex].insights[1]}
                  </div>
                  <div className="demo-line">
                    {demoQueries[demoIndex].insights[2]}
                  </div>
                  <div className="demo-result">Verified sources attached</div>
                </div>
              </div>
              <div className="hero-image">
                <Image
                  src="/images/why-important.jpg"
                  alt="Founder dashboard"
                  width={560}
                  height={380}
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container split-2026">
          <div className="split-card hover-card">
            <p className="split-kicker">AI Self-Service</p>
            <h3>Fast & smart for early-stage teams</h3>
            <p>
              Generate a living business plan with RAG-verified data, automatic
              financial models, and instant market sizing. Best for speed and clarity.
            </p>
            <ul>
              <li>Agentic workflows, not chat drafts</li>
              <li>Live sources with citations</li>
              <li>Export to investor-ready formats</li>
            </ul>
            <Link href={getLocalePath("/solutions")} className="link-arrow">
              Explore AI tools →
            </Link>
          </div>
          <div className="split-card highlight hover-card">
            <p className="split-kicker">Expert-Led</p>
            <h3>Premium plans for banks and investors</h3>
            <p>
              Your plan is built and reviewed by experts using UNIDO/EBRD logic,
              market research, and investor-grade financial modeling.
            </p>
            <ul>
              <li>Custom assumptions and stress-testing</li>
              <li>Real cases and benchmarks</li>
              <li>Direct collaboration with our team</li>
            </ul>
            <Link href={getLocalePath("/products")} className="link-arrow">
              See expert services →
            </Link>
          </div>
        </section>

        <section className="container feature-2026">
          <div className="section-title">
            <h2>Your virtual board of directors</h2>
            <p>
              A modern stack that challenges your idea, tests demand, and delivers
              verified market intelligence.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="feature-card hover-card">
                <h4>Agent-Skeptic</h4>
                <p>
                  Finds weak points in your strategy before investors do and
                  proposes concrete fixes.
                </p>
                <div className="feature-tag">Stress-test your plan</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card hover-card">
                <h4>Persona Focus Groups</h4>
                <p>
                  Ask your buyer persona real questions and get instant, data-backed
                  feedback.
                </p>
                <div className="feature-tag">Voice of the customer</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card hover-card">
                <h4>Market Digest</h4>
                <p>
                  Weekly market pulse with competitor moves and demand shifts
                  delivered automatically.
                </p>
                <div className="feature-tag">Living document</div>
              </div>
            </div>
          </div>
        </section>

        <section className="container trust-2026">
          <div className="trust-grid">
            <div>
              <h2>Trust signals that close deals</h2>
              <p>
                We combine 14+ years of business planning with AI agents that
                verify sources. Your numbers are defensible, your narrative is
                crisp, and your plan passes serious scrutiny.
              </p>
              <div className="trust-list">
                <div>Models aligned with UNIDO / EBRD / Lean Canvas</div>
                <div>260+ projects delivered across industries</div>
                <div>Focused on non-excel founders</div>
              </div>
            </div>
            <div className="trust-cases">
              <div className="case-card hover-card">
                <h5>From idea to $2.45M</h5>
                <p>Investment raised after validating pricing and unit economics.</p>
              </div>
              <div className="case-card hover-card">
                <h5>Bank-ready plan in 12 days</h5>
                <p>Retail expansion approved with verified market demand.</p>
              </div>
              <div className="case-card hover-card">
                <h5>New market entry in 3 weeks</h5>
                <p>Competitor map + tax analysis + GTM delivered.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container compare-2026">
          <h2>Why Upgrowplan is a different level</h2>
          <div className="compare-table">
            <div className="compare-head">Traditional AI planners</div>
            <div className="compare-head accent">Upgrowplan 2026</div>
            <div>Hallucinated numbers</div>
            <div className="accent">RAG verification + sources</div>
            <div>Always says “yes”</div>
            <div className="accent">Agent-Skeptic stress-testing</div>
            <div>Static PDF</div>
            <div className="accent">Living dashboards and weekly digest</div>
            <div>You guess the customer</div>
            <div className="accent">Persona AI answers honestly</div>
          </div>
        </section>

        <section className="container insight-2026">
          <div className="insight-card">
            <div className="insight-copy">
              <h2>Instant Market Insight</h2>
              <p>
                Type your idea and location. We show verified facts and a competitive
                snapshot to prove our agents work with live data.
              </p>
              <div className="insight-form">
                <input
                  type="text"
                  placeholder="Coffee subscription in Lisbon"
                  aria-label="Business idea and location"
                />
                <button type="button" className="btn btn-primary">
                  Get express analysis
                </button>
              </div>
            </div>
            <div className="insight-result">
              <div className="insight-line">Market size: €42M, +6.2% YoY</div>
              <div className="insight-line">Average price: €18.90 / month</div>
              <div className="insight-line">12 direct competitors</div>
              <div className="insight-line">Top channel: Instagram + delivery apps</div>
            </div>
          </div>
        </section>

        <section className="container steps-2026">
          <div className="section-title">
            <h2>Magic in 3 clicks</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card hover-card">
              <span className="step-number">01</span>
              <h5>Describe your idea</h5>
              <p>Share a few lines or a website link.</p>
            </div>
            <div className="step-card hover-card">
              <span className="step-number">02</span>
              <h5>Agents go to work</h5>
              <p>Data collection, verification, skeptic review, focus groups.</p>
            </div>
            <div className="step-card hover-card">
              <span className="step-number">03</span>
              <h5>Get the results</h5>
              <p>Plan + financial model + market report + weekly digest.</p>
            </div>
          </div>
        </section>

        <section className="text-center cta-2026">
          <h2 className="cta-text">Stop guessing. Start winning.</h2>
          <p className="cta-text">
            Launch with confidence: verified numbers, investor-ready story, and
            a market that speaks for itself.
          </p>
          <div className="hero-cta">
            <Link href={getLocalePath("/solutions")} className="btn btn-primary btn-lg">
              Try for free
            </Link>
            <Link href={getLocalePath("/contacts")} className="btn btn-outline-primary btn-lg">
              Talk to a strategist
            </Link>
          </div>
        </section>
      </main>

      <style jsx>{`
        .home-2026 {
          background: #ffffff;
          color: #1e6078;
        }

        .hero-2026 {
          padding: 5rem 0 3rem;
          background: radial-gradient(1200px 600px at 10% 10%, rgba(7, 133, 246, 0.12), transparent 60%),
            linear-gradient(120deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.02));
        }

        .hero-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: start;
        }

        .hero-kicker {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #1e6078;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .hero-2026 h1 {
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 700;
          color: #1e6078;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #1e6078;
          margin-bottom: 1.75rem;
          max-width: 540px;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .hero-proof {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          font-size: 0.85rem;
          color: #1e6078;
        }

        .proof-number {
          display: block;
          font-weight: 700;
          font-size: 1.05rem;
          color: #1e6078;
        }

        .proof-label {
          display: block;
        }

        .hero-demo {
          display: grid;
          gap: 1.5rem;
        }

        .demo-card {
          background: #0f1f2a;
          color: #ecf6ff;
          border-radius: 18px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 20px 50px rgba(9, 30, 66, 0.25);
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .demo-title {
          margin-left: auto;
          color: #8bc4ff;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot-red {
          background: #ff5f57;
        }

        .dot-yellow {
          background: #febc2e;
        }

        .dot-green {
          background: #28c840;
        }

        .demo-line {
          padding: 0.45rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.95rem;
        }

        .demo-result {
          margin-top: 0.9rem;
          background: rgba(7, 133, 246, 0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .hero-image {
          background: #ffffff;
          padding: 0.5rem;
          border-radius: 18px;
          box-shadow: 0 12px 32px rgba(9, 30, 66, 0.18);
        }

        .split-2026 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 3.5rem 0;
        }

        .split-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: none;
          border: none;
        }

        .split-card.highlight {
          background: linear-gradient(140deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.08));
          border: 1px solid rgba(7, 133, 246, 0.2);
        }

        .split-kicker {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.8rem;
          color: #1e6078;
          font-weight: 600;
        }

        .split-card ul {
          padding-left: 1.1rem;
          margin: 1rem 0;
          color: #1e6078;
        }

        .link-arrow {
          color: #0785f6;
          font-weight: 600;
          text-decoration: none;
        }

        .feature-2026 {
          padding: 2.5rem 0 3.5rem;
        }

        .section-title h2 {
          color: #1e6078;
          margin-bottom: 0.75rem;
        }

        .section-title p {
          color: #1e6078;
          max-width: 680px;
        }

        .feature-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: none;
          height: 100%;
        }

        .feature-tag {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #1e6078;
          font-weight: 600;
        }

        .trust-2026 {
          padding: 3rem 0;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          align-items: center;
        }

        .trust-list div {
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #1e6078;
        }

        .trust-cases {
          display: grid;
          gap: 1rem;
        }

        .case-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.25rem;
          border: none;
        }

        .compare-2026 {
          padding: 2.5rem 0 3rem;
        }

        .compare-table {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 1fr));
          gap: 0.75rem 1rem;
          margin-top: 1.5rem;
          background: #ffffff;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 10px 24px rgba(9, 30, 66, 0.08);
        }

        .compare-head {
          font-weight: 700;
          color: #1e6078;
        }

        .compare-head.accent {
          color: #1e6078;
        }

        .compare-table .accent {
          color: #1e6078;
          font-weight: 600;
        }

        .insight-2026 {
          padding: 2.5rem 0 3.5rem;
        }

        .insight-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          background: #0f1f2a;
          color: #ecf6ff;
          border-radius: 20px;
          padding: 2rem;
        }

        .insight-form {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .insight-form input {
          flex: 1;
          min-width: 220px;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: none;
        }

        .insight-result {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.25rem;
          font-size: 0.95rem;
          display: grid;
          gap: 0.6rem;
        }

        .steps-2026 {
          padding: 3rem 0 4rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        .step-card {
          border-radius: 16px;
          padding: 1.5rem;
          background: #ffffff;
          box-shadow: none;
        }

        .step-number {
          font-weight: 700;
          color: #0785f6;
        }

        .cta-2026 {
          padding: 3rem 0 4rem;
          background: linear-gradient(120deg, rgba(7, 133, 246, 0.1), rgba(30, 96, 120, 0.05));
        }

        .cta-2026 {
          color: #1e6078;
        }

        .cta-text {
          color: #1e6078 !important;
        }

        .cta-2026 .hero-cta {
          justify-content: center;
        }

        .hover-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: none;
        }

        .hover-card:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          transform: scale(1.03);
          background-color: #d9ebf5;
        }

        .split-card.highlight {
          background: linear-gradient(140deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.08));
        }

        .split-card.highlight.hover-card:hover {
          background: linear-gradient(140deg, rgba(30, 96, 120, 0.08), rgba(7, 133, 246, 0.12));
        }

        @media (max-width: 767px) {
          .hero-2026 {
            padding: 3.5rem 0 2.5rem;
          }

          .hero-demo {
            order: -1;
          }

          .hero-cta {
            width: 100%;
          }

          .hero-cta :global(.btn) {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
