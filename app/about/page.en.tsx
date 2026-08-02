"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";
export default function AboutPage() {
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="col-md-6 mb-4 d-flex justify-content-center">
      <div
        className="card p-4 h-100 w-100 text-dark border-0"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.backgroundColor = "#d9ebf5";
          el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
          el.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.backgroundColor = "#fff";
          el.style.boxShadow = "none";
          el.style.transform = "scale(1)";
        }}
      >
        {children}
      </div>
    </div>
  );

  // Component for full-width blocks (no hover effect)
  const FullWidthCard = ({ children }: { children: React.ReactNode }) => (
    <div className="col-12 mb-4">
      <div
        className="card p-4 text-dark border-0 full-width-block"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
        }}
      >
        {children}
      </div>
    </div>
  );

  // Component for team member card
  const TeamMemberCard = ({
    name,
    role,
    description,
    photoSrc,
  }: {
    name: string;
    role: string;
    description: string;
    photoSrc: string;
  }) => (
    <div className="col-md-4 mb-4">
      <div
        className="text-center p-3"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          height: "100%",
        }}
      >
        <div className="mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
          <Image
            src={photoSrc}
            alt={`${name} photo`}
            width={80}
            height={80}
            className="rounded-circle"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
        <h5 className="mb-2" style={{ color: "#1e6078" }}>
          {name}
        </h5>
        <p className="text-muted small mb-3">{role}</p>
        <p className="mb-0 small">{description}</p>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* PAGE CONTENT */}
      <main className="container py-3">

        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center mb-4" style={{ color: "#1e6078" }}>
              Our Team
            </h2>
            <p className="mb-4 text-center">
              Upgrowplan is a small independent team of experts combining deep
              economics knowledge with modern technology to build planning and
              business development tools.
            </p>

            <div className="row">
              <TeamMemberCard
                name="Denis Naletov"
                role="Founder, economist, full-stack developer"
                description="15+ years of experience in business planning and consulting. Specializes in financial modeling, AI integration into business processes and building digital solutions for SMBs."
                photoSrc="/images/denis.jpg"
              />
              <TeamMemberCard
                name="Natalia Kovaleva"
                role="Economist, business analyst"
                description="Financial analyst experienced in market research, feasibility studies, fundraising, management and accounting, subsidy and grant support, and loan portfolio servicing."
                photoSrc="/images/kovaleva.jpg"
              />
              <TeamMemberCard
                name="Dmitry Volkov"
                role="Web developer, technical specialist"
                description="Experienced developer focused on backend systems and data processing. Handles API integration, system optimization, and database management."
                photoSrc="/images/dima.jpg"
              />
            </div>
          </FullWidthCard>
        </div>

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              What we do
            </h2>
            <p>
              We build tools that help launch and grow businesses. Upgrowplan
              delivers personalized solutions and digital services combining
              business expertise with modern technologies. We automate
              calculations, visualize data, advise on next steps, and help make
              informed decisions.
            </p>
            <p>
              <em>Based on experience. Improves together with you.</em>
            </p>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Our approach
            </h2>
            <ul>
              <li>
                Practice over theory. Everything is based on real client needs.
              </li>
              <li>
                Economics + technology. We combine classic consulting with
                automation, visualization and analytics.
              </li>
              <li>
                AI for a purpose. We use LLMs, APIs, RAG and parameter tuning.
                We prepare data, fine-tune models and embed them into real
                workflows so they actually help.
              </li>
              <li>
                Results matter. We test, improve and keep what works. If it
                doesn't help — we remove it.
              </li>
            </ul>
          </Card>
        </div>

        {/* "At a glance" — full-width block */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              At a glance
            </h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td>Business plans</td>
                    <td>230+</td>
                  </tr>
                  <tr>
                    <td>Financial models</td>
                    <td>35+</td>
                  </tr>
                  <tr>
                    <td>Market studies</td>
                    <td>28</td>
                  </tr>
                  <tr>
                    <td>Funds & loans raised</td>
                    <td>$2.45M+</td>
                  </tr>
                  <tr>
                    <td>Experience in business & tech</td>
                    <td>15+ years</td>
                  </tr>
                  <tr>
                    <td>AI integration</td>
                    <td>LLM + RAG + API + Custom datasets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FullWidthCard>
        </div>

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Industries
            </h2>
            <ul>
              <li>Farms & agritourism — 119 projects</li>
              <li>Construction (residential, hotels) — 6 projects</li>
              <li>Cafes & restaurants — 7 projects</li>
              <li>Logistics & distribution — 12 projects</li>
              <li>Manufacturing companies — 5 projects</li>
              <li>Tech & service startups — 6 projects</li>
              <li>Other areas — from agritourism to international logistics</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Competencies
            </h2>
            <ul>
              <li>Economic and financial analysis</li>
              <li>Mathematical analysis and economic models</li>
              <li>Classic and digital marketing expertise</li>
              <li>Tax and financial law</li>
              <li>Resource, project and HR management</li>
              <li>Accounting systems: 1C, SAP, Power BI</li>
              <li>Data processing: Excel, SQL, MongoDB</li>
            </ul>
          </Card>
        </div>

        {/* "New block" — full-width block */}

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Coming next
            </h2>
            <ul>
              <li>Business Pulse Workspace — AI department for market and competitor monitoring</li>
              <li>Synth Focus Lab — virtual focus groups replacing real respondents</li>
              <li>GEO Visibility — tracking brand presence in AI-generated answers</li>
              <li>Unified dashboard — centralized access to all tools and reports</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Technology stack
            </h2>
            <ul>
              <li>Python / FastAPI — backend services and AI pipelines</li>
              <li>Next.js / TypeScript / React — web application</li>
              <li>PostgreSQL — primary data store</li>
              <li>RAG (Retrieval-Augmented Generation) — live search context for LLMs</li>
              <li>LLM API integrations (OpenAI, Anthropic, Google)</li>
              <li>Vercel + Heroku — deployment and hosting</li>
              <li>CI/CD pipelines</li>
            </ul>
          </Card>
        </div>

        {/* ── FAQ ── */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center mb-4" style={{ color: "#1e6078" }}>
              Frequently Asked Questions
            </h2>
            <div className="accordion" id="aboutFaqEn">
              {[
                {
                  id: "faqe1",
                  q: "What is Upgrowplan?",
                  a: "Upgrowplan is an AI platform for entrepreneurs, analysts and consultants. It automates business plan creation following UNIDO/EBRD standards, market research, financial modelling, and competitor monitoring. Founded in 2024 in Tel Aviv.",
                },
                {
                  id: "faqe2",
                  q: "How is Upgrowplan different from ChatGPT?",
                  a: "ChatGPT generates text from its training data and can hallucinate. Upgrowplan uses RAG architecture: a search agent collects live data from 50+ sources, Python scripts run deterministic financial calculations, and only then does the LLM process the verified context at temperature ≤ 0.2. A built-in Skeptic Agent checks every section for hallucinations.",
                },
                {
                  id: "faqe3",
                  q: "What methodologies are used in the business plans?",
                  a: "Business plans follow UNIDO and EBRD standards — frameworks used by development banks and international investors. Financial calculations use deterministic Python scripts, not probabilistic AI models.",
                },
                {
                  id: "faqe4",
                  q: "Who is Upgrowplan for?",
                  a: "Entrepreneurs preparing a business plan for a bank or investor; analysts who need fast market research; consultants who want to automate routine work; and startups testing hypotheses through virtual focus groups.",
                },
                {
                  id: "faqe5",
                  q: "How much does Upgrowplan cost?",
                  a: "FinPilot (financial models) and Relocation Service (international business setup) are free. MarketSense AI Agent, PlanMaster AI, Synth Focus Lab and Business Pulse are available by subscription. Current pricing is on each product page.",
                },
              ].map(({ id, q, a }, i) => (
                <div className="accordion-item border-0 mb-2" key={id} style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${id}`}
                      aria-expanded={i === 0 ? "true" : "false"}
                      style={{ fontWeight: 600, color: "#1e6078", backgroundColor: "#f0f7ff" }}
                    >
                      {q}
                    </button>
                  </h3>
                  <div
                    id={id}
                    className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                    data-bs-parent="#aboutFaqEn"
                  >
                    <div className="accordion-body" style={{ color: "#334155", lineHeight: 1.75 }}>
                      {a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FullWidthCard>
        </div>

        {/* "We're open" — full-width block */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              We're open
            </h2>
            <p className="text-center">
              Upgrowplan grows with the community. We value feedback, love
              experiments and are open to partnerships.
              <br />
              If you want to propose an idea, test beta features or just talk —{" "}
              <Link href="/contacts">leave a request</Link> or write to us
              directly.
            </p>
          </FullWidthCard>
        </div>
      </main>

      {/* FOOTER */}
    </div>
  );
}
