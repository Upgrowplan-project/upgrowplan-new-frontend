"use client";

import { useState } from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";
import {
  FiCpu,
  FiBarChart2,
  FiUsers,
  FiFileText,
  FiMapPin,
  FiMonitor,
} from "react-icons/fi";
import { useClickAnalytics } from "../../../hooks/useClickAnalytics";
import { FaHourglassHalf } from "react-icons/fa";
import Header from "../../../components/Header";

export default function SolutionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [finPilotCountry, setFinPilotCountry] = useState("ru"); // Default Russia

  const solutions = [
    {
      title: "FinPilot Free",
      description:
        "Ready-made financial models. Analysis of company revenues and costs, profitability and break-even point. Available for free.",
      icon: <FiBarChart2 className="me-2 text-success" />,
      link: `/fin-model/model1?country=${finPilotCountry}`,
      hasCountrySelector: true,
    },
    {
      title: "MarketSense AI Agent",
      description:
        "An AI agent for discovery, analysis and full marketing research. Verifies sources and adapts results to your daily tasks.",
      icon: <FiCpu className="me-2 text-primary" />,
      release: "Spring 2026",
      link: "/solutions/marketResearch/descriptionPage",
      elementId: "market-research-description-card",
      ctaLabel: "Learn more",
    },
    {
      title: "Business Pulse Workspace",
      description:
        "Your daily digital department for market monitoring and business protection. A light AI start for your company.",
      icon: <FiMonitor className="me-2 text-primary" />,
      release: "Spring 2026",
      link: "/solutions/businessPulse",
      elementId: "business-pulse-workspace-card",
      ctaLabel: "Learn more",
    },
    {
      title: "PlanMaster AI",
      description:
        "Generates an expert business plan based on modern methodology, live search and verified data. Clear handling of hallucinations. User-friendly request chat and investor-ready documents.",
      icon: <FiFileText className="me-2 text-danger" />,
      release: "Spring 2026",
      link: "/ai-business-plan-generator",
      elementId: "planmaster-description-card",
      ctaLabel: "Learn more",
    },
    {
      title: "Relocation Service Free",
      description:
        "Provides information and assistance for opening or relocating a business to another country. Available for free.",
      icon: <FiMapPin className="me-2 text-info" />,
      link: "/solutions/openAbroad",
      elementId: "relocation-service-card",
    },
    {
      title: "Synth Focus Lab — Synthetic Respondents",
      description:
        "Test your business idea on virtual buyers in 15 minutes. AI synthetic respondents replace expensive focus groups — no recruiting, no waiting. 85–92% accuracy compared to real participants.",
      icon: <FiUsers className="me-2 text-warning" />,
      release: "Spring 2026",
      link: "/solutions/synthetic-customer-research",
      elementId: "synth-focus-lab-description-card",
      ctaLabel: "Learn more",
    },
  ];

  const { trackClick } = useClickAnalytics();

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />

      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Automated financial, marketing and analytics tools
        </h1>
        <p style={{ color: "#0785f6", fontSize: "1.1rem" }}>
          Solutions for people who value their time and are ready to use modern
          technologies.
        </p>
        <div className="row g-4">
          {solutions.map((solution, index) => (
            <div className="col-12 col-md-6" key={index}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
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
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title
                      style={{
                        color: "#1e6078",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {solution.icon} {solution.title}
                    </Card.Title>
                    <Card.Text>{solution.description}</Card.Text>
                  </div>
                  <div className="mt-3 d-flex align-items-center justify-content-between gap-2">
                    <div className="text-muted small d-flex flex-column gap-1" style={{ flex: 1 }}>
                      {solution.release && (
                        <span className="d-flex align-items-center gap-1">
                          <FaHourglassHalf /> Release {solution.release}
                        </span>
                      )}
                      {solution.hasCountrySelector && (
                        <div>
                          <label htmlFor="country-select" className="form-label small text-muted mb-1">
                            Select country:
                          </label>
                          <select
                            id="country-select"
                            className="form-select form-select-sm"
                            value={finPilotCountry}
                            onChange={(e) => setFinPilotCountry(e.target.value)}
                          >
                            <option value="ru">🇷🇺 Russia</option>
                            <option value="il">🇮🇱 Israel</option>
                          </select>
                        </div>
                      )}
                    </div>
                    {solution.link && (
                      <div style={{ width: "33.333%" }}>
                        <Link
                          href={solution.link}
                          className="btn btn-primary w-100"
                          onClick={() =>
                            trackClick(
                              solution.elementId || (solution.title ?? "unknown"),
                              "card"
                            )
                          }
                        >
                          {solution.ctaLabel ?? "Open"}
                        </Link>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
