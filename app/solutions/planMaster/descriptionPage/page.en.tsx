"use client";

import Header from "../../../../components/Header";

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
        <ul style={{ paddingLeft: "1.4rem", listStyle: "disc", color: "#334155" }}>
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
            Builds a realistic financial model for the given conditions:
            revenue forecast, expenses, profit, taxes, profitability and
            payback period.
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
        <ul style={{ paddingLeft: "1.4rem", listStyle: "disc", color: "#334155" }}>
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
        <ul style={{ paddingLeft: "1.4rem", listStyle: "disc", color: "#334155" }}>
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
    </div>
  );
}
