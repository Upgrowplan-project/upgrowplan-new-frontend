"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../../components/Header";

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <Header />

      {/* PAGE CONTENT */}
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          About Upgrowplan
        </h1>

        {/* "Who we are" — full-width block */}
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
              🚀 What we do
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
              🔍 Our approach
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
              📊 At a glance
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
              🌍 Industries
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
              🛠️ Competencies
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
              🔭 Where we're heading
            </h2>
            <ul>
              <li>
                A business-plan builder — flexible structure with up-to-date
                data
              </li>
              <li>
                Next-gen financial model — with visualization, AI and API
                integration
              </li>
              <li>
                Intelligent support — LLMs with dynamic parameters and
                live-search context
              </li>
              <li>Centralized access to dashboards and tools</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              ⚙️ Technology stack
            </h2>
            <ul>
              <li>LLM API integrations</li>
              <li>Document generation with augmented search (RAG)</li>
              <li>Fine-tuning prompts and parameters</li>
              <li>Enriching models with custom datasets</li>
              <li>CI/CD pipelines</li>
              <li>
                Stack: Java, Spring Boot, Node.js, SQL, MongoDB, RabbitMQ, Power
                BI, LLM tools (OpenAI, LangChain, etc.)
              </li>
            </ul>
          </Card>
        </div>

        {/* "We're open" — full-width block */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              🤝 We're open
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
