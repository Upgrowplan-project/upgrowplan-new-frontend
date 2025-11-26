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
} from "react-icons/fi";
import { useClickAnalytics } from "../../hooks/useClickAnalytics";
import { FaHourglassHalf } from "react-icons/fa";
import Header from "../../components/Header";

export default function SolutionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const solutions = [
    {
      title: "FinPilot Free",
      description:
        "Ready-made financial models. Analysis of company revenues and costs, profitability and break-even point. Available for free.",
      icon: <FiBarChart2 className="me-2 text-success" />,
      link: "/fin-model/model1/",
    },
    {
      title: "MarketSense AI Agent",
      description:
        "An AI agent for discovery, analysis and full marketing research. Verifies sources and adapts results to your daily tasks.",
      icon: <FiCpu className="me-2 text-primary" />,
      release: "Autumn 2025",
    },
    {
      title: "Competitors Research AI Agent",
      description:
        "An AI agent for researching your competitors. Focused on local and detailed niche analysis.",
      icon: <FiUsers className="me-2 text-warning" />,
      release: "Autumn 2025",
    },
    {
      title: "PlanMaster AI",
      description:
        "Generates an expert business plan based on modern methodology, live search and verified data. Clear handling of hallucinations. User-friendly request chat and investor-ready documents.",
      icon: <FiFileText className="me-2 text-danger" />,
      release: "Autumn 2025",
    },
    {
      title: "Relocation Service Free",
      description:
        "Provides information and assistance for opening or relocating a business to another country. Available for free.",
      icon: <FiMapPin className="me-2 text-info" />,
      link: "/solutions/openAbroad",
      elementId: "relocation-service-card",
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
                  <div
                    className="mt-3 text-muted small d-flex align-items-center"
                    style={{ gap: "6px" }}
                  >
                    {solution.release && (
                      <>
                        <FaHourglassHalf /> Release {solution.release}
                      </>
                    )}
                  </div>
                  {solution.link && (
                    <div className="mt-3">
                      <Link
                        href={solution.link}
                        className="btn btn-primary w-100"
                        style={{ minWidth: "150px" }}
                        onClick={() =>
                          trackClick(
                            solution.elementId || (solution.title ?? "unknown"),
                            "card"
                          )
                        }
                      >
                        Open
                      </Link>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
