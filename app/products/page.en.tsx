"use client";

import { Card } from "react-bootstrap";
import { FaClock, FaDollarSign, FaChartLine } from "react-icons/fa";
import Header from "../../components/Header";

export default function ProductsPage() {

  const products = [
    {
      title: "AgroPack. Standard business plan",
      description:
        "A document package (business plan, appendices, presentation) for applying to agricultural subsidies/grants. Prepared according to regulatory documentation. Communication with the grantor is possible.",
      price: "from $200",
      time: "Lead time from 1 week",
      stats: "119 agricultural projects",
    },
    {
      title: "Lean Canvas. Startup proposal",
      description:
        "For innovative and tech startups. Iterative approach, focus on problem and value. Includes pitch deck preparation.",
      price: "from $150",
      time: "Lead time from 3 days",
      stats: "35 financial models and 28 market studies",
    },
    {
      title: "Core Plan. Basic package",
      description:
        "Development of all main business-plan sections: marketing, production plan, risk assessment, extended financials. Optional dynamic profitability calculator.",
      price: "from $400",
      time: "Lead time from 1 week",
      stats: "236 business plans across industries",
    },
    {
      title: "Pitch Pro. Detailed business plan",
      description:
        "A detailed plan for fundraising: marketing strategy, SWOT analysis, financial model (UNIDO/EBRD style) with discounted cash flows.",
      price: "from $1000",
      time: "Lead time 1–2 months",
      stats: "Raised over $2.45M in investments",
    },
    {
      title: "StartUp Zoom. Consultation",
      description:
        "Online consultation: introduction, task discussion, choosing collaboration format, terms and schedule.",
      price: "free",
      time: "30 minutes",
      stats: "50+ successful consultations",
    },
    {
      title: "Smart Numbers. Financial calculations",
      description:
        "Financial analytics: scenarios, cash flows, profitability calculations.",
      price: "from $80",
      time: "Lead time from 2 days",
      stats: "35 financial models",
    },
    {
      title: "Pure Analyze. Marketing/financial analysis",
      description:
        "Market, marketing and risk analysis. An independent perspective on your business.",
      price: "from $50",
      time: "Lead time from 3 days",
      stats: "28 market studies",
    },
    {
      title: "Partner Track. Long-term collaboration",
      description:
        "Regular updates to business plans, online analysis of new scenarios and maintenance of relationships with investors and banks.",
      price: "from $50 per month",
      time: "Ongoing collaboration",
      stats: "10+ long-term clients",
    },
    {
      title: "Site Onboard. Website development",
      description:
        "Landing page or multi-page site for presenting your project. Modern solution for investors and customers.",
      price: "from $50",
      time: "Lead time from 2 days",
      stats: "6 completed sites",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      <main className="container py-5">
        <h1 className="mb-3 text-brand">Platform products</h1>
        <p className="text-primary fw-semibold">
          Tailored business solutions delivered by an expert for your specific needs.
        </p>
        <div className="row g-4">
          {products.map((product, index) => (
            <div className="col-12 col-sm-6 col-lg-4" key={index}>
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
                      as="div"
                      style={{
                        color: "#1e6078",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1.25rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {product.title}
                    </Card.Title>
                    <Card.Text style={{ fontSize: "1rem", lineHeight: 1.55 }}>
                      {product.description}
                    </Card.Text>
                  </div>
                  <ul className="product-card-meta list-unstyled mt-3 mb-0">
                    <li>
                      <FaDollarSign className="me-2 text-success" />
                      <span>{product.price}</span>
                    </li>
                    <li>
                      <FaClock className="me-2 text-primary" />
                      <span>{product.time}</span>
                    </li>
                    <li>
                      <FaChartLine className="me-2 text-secondary" />
                      <span>{product.stats}</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
