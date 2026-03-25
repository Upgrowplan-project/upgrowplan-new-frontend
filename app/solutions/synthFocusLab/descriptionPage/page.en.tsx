"use client";

import Header from "../../../../components/Header";

const INFO_SECTIONS = [
  {
    id: 1,
    title: "How it works",
    content: (
      <>
        <p style={{ marginBottom: "0.5rem" }}>
          Instead of long and expensive recruiting of real respondents, we
          create digital twins of your audience using multi-layer simulation:
        </p>
        <ul
          style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Persona generation:</strong> Based on your product and
            location, the AI models 5–10 detailed Buyer Personas. These are not
            just “portraits” but archetypes with distinct behaviors.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Live search and context (New!):</strong> The system doesn’t
            guess — it verifies facts. Our Search Agent scans the real market in
            the selected location, finds competitor prices, reads reviews and
            analyzes regional news.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Culture-aware responses (New!):</strong> We added a “human
            layer.” The service analyzes the socio-demographic and cultural
            context. A respondent in Tel Aviv will answer with local business
            norms in mind, and in Muslim countries the system accounts for
            cultural taboos and values.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Virtual survey:</strong> Based on personas, the system
            creates 25+ unique virtual respondents with their own character,
            income level and habits.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>400+ interviews per cycle:</strong> We “ask” them dozens of
            deep questions. The model simulates responses as if they were real
            people in Kaliningrad, Haifa or New York. Coherence reaches 80%+.
          </li>
        </ul>
        <p
          style={{
            marginTop: "1rem",
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          <strong>Important:</strong> Because the system performs real data
          search and deep cultural validation, the process takes 15–30 minutes.
          This is required to ensure data quality suitable for investor-facing
          materials and real-world strategy.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "What we need from you",
    content: (
      <>
        <p style={{ marginBottom: "0.5rem" }}>
          To start, we need product and audience inputs. The more detailed the
          fields, the more accurate the scenarios and responses.
        </p>
        <ul
          style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            Product description, key value and hypotheses.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Category and target audience type (B2B/B2C/B2B2C).
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Geography (country/city) and sampling parameters.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Research goals so we form the right questions.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    title: "What you get",
    content: (
      <>
        <p style={{ marginBottom: "0.5rem" }}>
          You receive a ready report with insights, segments and practical
          product conclusions.
        </p>
        <ul
          style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            Persona profiles and motivations.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Survey results and response analysis.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Positioning and messaging recommendations.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            A final report ready for presentation.
          </li>
        </ul>
      </>
    ),
  },
];

export default function SynthFocusLabDescriptionPageEn() {
  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Synth Focus Lab
        </h1>
        <div className="row g-4">
          {INFO_SECTIONS.map((section) => (
            <div className="col-12" key={section.id}>
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
