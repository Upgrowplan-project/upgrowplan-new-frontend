"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import Header from "../../components/Header";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === 'en') {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <div>
      <Header />

      <main>
        {/* Hero Section with video / image */}
        <section
          className="position-relative text-center d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "60vh", overflow: "hidden" }}
          data-aos="fade-up"
        >
          {/* Video for desktop only */}
          <video
            className="position-absolute top-50 start-50 translate-middle d-none d-md-block"
            src="/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "cover",
              zIndex: -1,
            }}
          />

          {/* Image for mobile only */}
          <img
            src="/images/team.jpg"
            alt="Our team"
            className="d-block d-md-none w-100"
            style={{
              height: "auto",
              objectFit: "cover",
            }}
          />

          {/* Overlay for desktop */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-none d-md-block"
            style={{
              backgroundColor: "rgba(30, 96, 120, 0.55)",
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div
            className="container position-relative py-4 py-md-0"
            style={{
              zIndex: 1,
              color: "#1e6078",
            }}
          >
            <h1
              className="fw-bold mb-3 px-3"
              style={{
                color: "inherit",
              }}
            >
              Have an idea? Let's turn it into a plan!
            </h1>

            <p
              className="lead mb-4 px-3"
              style={{
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              You focus on what you love — baking bread, sewing dresses, or
              teaching English. We take care of calculations and finances.
              Non-excel people don't waste time on boring spreadsheets — we'll
              do it for you.
            </p>

            <div
              className="d-flex gap-3 flex-wrap justify-content-center"
              data-aos="zoom-in"
            >
              <Link href={getLocalePath("/products")} className="btn btn-primary btn-lg">
                Expert services
              </Link>
              <Link href={getLocalePath("/solutions")} className="btn btn-primary btn-lg">
                Automated tools
              </Link>
            </div>
          </div>

          <style jsx>{`
            /* Desktop only */
            @media (min-width: 768px) {
              section div.container {
                color: white !important;
              }
            }
          `}</style>
        </section>

        {/* What we do */}
        <section
          className="container py-5"
          data-aos="fade-up"
          style={{ backgroundColor: "#fff", color: "#000" }}
        >
          <h2 className="text-center mb-4" style={{ color: "#1e6078" }}>
            What we do
          </h2>
          <div className="row g-4">
            {[
              {
                src: "/images/tool1.jpg",
                title: "Expert business plans",
                desc: "Documents that convince investors and banks. UNIDO / EBRD / Lean Canvas models",
              },
              {
                src: "/images/tool2.jpg",
                title: "Financial models & calculators",
                desc: "Accurate, fast calculations for your project. Free and available 24/7",
              },
              {
                src: "/images/tool3.jpg",
                title: "AI-powered tools",
                desc: "Fast and reliable results using trained AI models",
              },
            ].map((tool, i) => (
              <div
                key={i}
                className="col-12 col-md-4 text-center"
                data-aos="zoom-in"
                data-aos-delay={i * 100}
              >
                <Image
                  src={tool.src}
                  alt={tool.title}
                  width={600}
                  height={400}
                  className="img-fluid rounded shadow mb-3"
                />
                <h5>{tool.title}</h5>
                <p className="text-muted">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why choose us */}
        <section
          className="py-5"
          style={{ backgroundColor: "#f8f9fa" }}
          data-aos="fade-up"
        >
          <div className="container">
            <h2 className="text-center mb-4" style={{ color: "#1e6078" }}>
              Why clients trust us
            </h2>
            <div className="row text-center g-4">
              <div className="col-md-4" data-aos="fade-right">
                <h4 className="fw-bold">14+ years of experience</h4>
                <p className="text-muted">Proven methods and measurable results</p>
              </div>
              <div className="col-md-4" data-aos="fade-up">
                <h4 className="fw-bold">260+ projects</h4>
                <p className="text-muted">Experience and successful case studies</p>
              </div>
              <div className="col-md-4" data-aos="fade-left">
                <h4 className="fw-bold">AI solutions</h4>
                <p className="text-muted">We make complex tasks simple and fast</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why it matters */}
        <section className="container py-5" data-aos="fade-up">
          <div className="row align-items-center g-4">
            <div className="col-md-6" data-aos="zoom-in">
              <Image
                src="/images/why-important.jpg"
                alt="Entrepreneurs"
                width={600}
                height={400}
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6">
              <h2 className="mb-3" style={{ color: "#1e6078" }}>
                Why it matters
              </h2>
              <p>
                You do what you love — we handle taxes, calculations and
                business planning. Our intelligent agent checks live sources
                (for example, tax rates) and verifies up-to-date facts. Want to
                find competitors in your city or get a market analysis for a
                country? Our AI tools deliver insights quickly and accurately.
              </p>
            </div>
          </div>
        </section>

        {/* AI Tools */}
        <section
          className="py-5"
          style={{ backgroundColor: "#fff", color: "#000" }}
          data-aos="fade-up"
        >
          <div className="container">
            <h2 className="text-center mb-4" style={{ color: "#1e6078" }}>
              Our AI tools
            </h2>
            <div className="row g-4">
              {[
                {
                  img: "/images/tool5.png",
                  title: "FinPilot Free",
                  desc: "Automated financial models. Get instant profit/mortgage/share calculations. Multiple scenarios and countries",
                },
                {
                  img: "/images/tool6.png",
                  title: "PlanMaster AI",
                  desc: "AI business plan generator using economic-focused LLMs and agents for up-to-date data (RAG, fine-tuning)",
                },
                {
                  img: "/images/tool7.png",
                  title: "MarketSense AI",
                  desc: "Hybrid research agent producing market analyses, trends and insights on demand",
                },
              ].map((tool, i) => (
                <div
                  key={i}
                  className="col-12 col-md-4 text-center d-flex flex-column align-items-center"
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                >
                  <Link
                    href={getLocalePath("/solutions")}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    className="d-flex flex-column align-items-center tool-card"
                  >
                    <div className="tool-image-wrapper mb-3">
                      <Image
                        src={tool.img}
                        alt={tool.title}
                        width={300}
                        height={200}
                        className="img-fluid rounded shadow tool-image"
                      />
                    </div>
                    <div className="tool-text" style={{ maxWidth: "300px" }}>
                      <h5>{tool.title}</h5>
                      <p className="text-muted">{tool.desc}</p>
                      <div className="release-soon mt-2 d-flex align-items-center gap-2 justify-content-center">
                        <i className="bi bi-hourglass-split release-icon"></i>
                        <span>Release: Fall 2025</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            .tool-card:hover {
              transform: translateY(-5px) scale(1.02);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            }
          `}</style>
        </section>

        {/* Call to action */}
        <section className="text-center py-5" data-aos="fade-up">
          <h2 className="mb-3" style={{ color: "#1e6078" }}>
            Focus on what you love — we'll handle the rest
          </h2>
          <Link href={getLocalePath("/contacts")} className="btn btn-primary btn-lg">
            Contact us →
          </Link>
        </section>
      </main>
    </div>
  );
}
