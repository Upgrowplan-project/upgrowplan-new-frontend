"use client";

import Header from "../../../../components/Header";
import IntelligenceLabV3 from "./IntelligenceLab-v3";

const INFO_SECTIONS = [
  {
    title: "How the service works",
    content: (
      <>
        <p style={{ marginBottom: "0.6rem" }}>
          Creates a business plan in the approved format for social contract
          submission. Uses classic planning methodology, marketing and economic
          analysis. Full research and document delivery takes about 5-10
          minutes.
        </p>
        <ul
          style={{ paddingLeft: "1.4rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.45rem" }}>
            Analyzes the idea, business format, city, funding sources and all
            project inputs.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Collects market and competitor data to justify key metrics such as
            average ticket and demand. Provides a detailed competitor analysis
            and research on the target audience. Proposes a marketing strategy
            based on current data. Pulls fresh data on rent, salaries and taxes
            in your region.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Builds a realistic financial model for the given conditions: revenue
            forecast, expenses, profit, taxes, profitability and payback period.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            If the project is not profitable enough, the service stops, informs
            you about the critical metric and suggests adjusting key business
            indicators to reach the recommended profitability. After that, the
            plan is generated with updated data.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Produces the final document with sections, sources and a conclusion
            ready for social contract submission.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "What to fill in",
    content: (
      <>
        <p style={{ marginBottom: "0.6rem" }}>
          The more accurate and complete your inputs, the higher the quality of
          market analysis, the more direct competitors can be found, and the
          more realistic the financial calculations will be.
        </p>
        <ul
          style={{ paddingLeft: "1.4rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.45rem" }}>
            Describe the business idea clearly: product/service, format, key
            differentiator, product or client specifics, and important
            parameters such as area and location details.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Specify geography (region, city and exact address if available) for
            correct competitor and customer analysis.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Provide the funding structure: own funds, support, amounts already
            invested and the spending period. Add current loan burden if you
            have one.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Fill in the initiator profile. Indicate business experience,
            education, skills and achievements relevant to successful project
            delivery. This increases trust in the document and improves approval
            chances.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "What you get",
    content: (
      <>
        <p style={{ marginBottom: "0.6rem" }}>
          You receive a ready business plan and transparent calculation logic.
        </p>
        <ul
          style={{ paddingLeft: "1.4rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.45rem" }}>
            Project summary with key metrics: investment, profit, profitability,
            taxes and payback.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Sections on market, competitors, target audience, organization,
            production and financial plan.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            Data sources in the text and appendix so justifications are
            verifiable.
          </li>
          <li style={{ marginBottom: "0.45rem" }}>
            DOCX file for further editing and submission.
          </li>
        </ul>
      </>
    ),
  },
];

export default function PlanMasterDescriptionPageEn() {
  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          PlanMaster AI
        </h1>
        <div className="row g-4">
          {INFO_SECTIONS.map((section) => (
            <div className="col-12" key={section.title}>
              <div className="card p-4 border-0 shadow-sm">
                <h2 className="h5 mb-3" style={{ color: "#1e6078" }}>
                  {section.title}
                </h2>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="container py-5 mt-5 border-top">
        <p
          className="text-uppercase small mb-2 fw-semibold"
          style={{ color: "#64748b", letterSpacing: "0.06em" }}
        >
          Product in development — future in focus
        </p>
        <h2 className="h2 fw-bold mb-3" style={{ color: "#0f172a" }}>
          Upgrowplan Lab: Generating Reality.
        </h2>
        <p
          className="lead mb-4"
          style={{ color: "#334155", fontSize: "1.05rem", maxWidth: "42rem" }}
        >
          We are calibrating our RAG agents. Right now the system is learning to
          distinguish hypotheses from facts so your business plan withstands any
          verification.
        </p>

        <div className="row g-4">
          <div className="col-lg-6 col-12">
            <div className="card p-4 border-0 shadow-sm h-100">
              <h3 className="h6 fw-bold mb-3" style={{ color: "#0f172a" }}>
                <i
                  className="bi bi-cpu"
                  style={{ color: "#0683f5", marginRight: "0.5rem" }}
                />
                Technology: RAG + Multi-Agent System
              </h3>
              <p style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                Upgrowplan architecture is based on RAG and multi-agent system:
                individual agents extract facts from external sources, verify
                numbers, and assemble the final document. This teaches the model
                to distinguish verifiable hypotheses from assumptions —
                generation does not replace real-time data search, but relies on
                extracted context and source references, significantly reducing
                the risk of "hallucinations" typical of traditional chat without
                RAG.
              </p>
              <ul
                style={{
                  paddingLeft: "1.4rem",
                  listStyle: "disc",
                  color: "#475569",
                  fontSize: "0.9rem",
                }}
              >
                <li className="mb-2">
                  Analyzes the idea, business format, city, funding sources and
                  project inputs; agents load actual reference data, not
                  inventions.
                </li>
                <li className="mb-2">
                  Collects market and competitor data to justify average ticket
                  and demand; fresh data on rent, salaries, and taxes are tied
                  to the region through search and databases, not static
                  prompts.
                </li>
                <li className="mb-2">
                  Builds financial model based on agreed assumptions; stops
                  generation and suggests adjustments if profitability is
                  critically low.
                </li>
                <li>
                  Creates document with sections and explicit sources so both
                  you and the reviewer can trace logic from fact to conclusion.
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-6 col-12">
            <div className="card p-4 border-0 shadow-sm h-100">
              <h3 className="h6 fw-bold mb-3" style={{ color: "#0f172a" }}>
                <i
                  className="bi bi-globe-americas"
                  style={{ color: "#0683f5", marginRight: "0.5rem" }}
                />
                Upgrowplan Worldwide: Business Without Borders
              </h3>
              <p style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                The global generator is designed for projects in any
                jurisdiction: currency, tax, and market inputs are tailored to
                your chosen country and city, based on internationally
                recognized approaches to financial planning and transparent
                assumptions in the report.
              </p>
              <ul
                style={{
                  paddingLeft: "1.4rem",
                  listStyle: "disc",
                  color: "#475569",
                  fontSize: "0.9rem",
                }}
              >
                <li className="mb-2">
                  Multi-currency support: investment, revenue, and payback in
                  currency aligned with your market and investor.
                </li>
                <li className="mb-2">
                  Report structure and financial blocks are compatible with bank
                  and fund expectations, familiar with international disclosure
                  practices.
                </li>
                <li>
                  Local competitive and market analysis for your chosen country
                  and region — not a template "for all," but tied to available
                  data.
                </li>
              </ul>
            </div>
          </div>

          <div className="col-12">
            <div className="card p-4 border-0 shadow-sm">
              <h3 className="h6 fw-bold mb-3" style={{ color: "#0f172a" }}>
                <i
                  className="bi bi-file-earmark-check"
                  style={{ color: "#0683f5", marginRight: "0.5rem" }}
                />
                Social Contract 2026: Approval Guarantee
              </h3>
              <p style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                For Russia, the service creates a business plan according to the
                approved form for social contract submission: built-in
                guidelines for support criteria and logic to verify consistency
                with typical expectations. This is not a legal guarantee of
                approval, but reduces the risk of rejection due to formal
                inconsistencies.
              </p>
              <ul
                style={{
                  paddingLeft: "1.4rem",
                  listStyle: "disc",
                  color: "#475569",
                  fontSize: "0.9rem",
                }}
              >
                <li className="mb-2">
                  Uses classic planning and analysis methodology; full research
                  and document delivery take 5-10 minutes on average.
                </li>
                <li className="mb-2">
                  Analyzes the idea, business format, city, funding sources in
                  social contract logic.
                </li>
                <li className="mb-2">
                  Collects market and competitor data, target audience,
                  marketing, rent, salaries, and taxes in your region.
                </li>
                <li className="mb-2">
                  Builds realistic financial model; stops generation and
                  suggests adjustments if profitability is weak.
                </li>
                <li>
                  Outputs summary, market and financial sections, sources, and
                  DOCX for document package and submission.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <IntelligenceLabV3 />
    </div>
  );
}
