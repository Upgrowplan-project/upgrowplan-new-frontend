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
  const getLocalePath = (path: string) => {
    if (path.startsWith("/ru")) {
      return path;
    }
    return `/ru${path}`;
  };

  const solutions = [
    {
      title: "FinPilot Free",
      description:
        "Готовые финансовые модели. Анализ доходов и расходов компании. Прибыль, рентабельность, точка безубыточности. Доступен бесплатно",
      icon: <FiBarChart2 className="me-2 text-success" />,
      link: `/fin-model/model1?country=${finPilotCountry}`,
      hasCountrySelector: true,
    },
    {
      title: "MarketSense AI Agent",
      description:
        "ИИ-агент поиска, анализа и выполнения полноценного маркетингового исследования. Верификация ресурсов и данных, адаптация под ваши ежедневные задачи.",
      icon: <FiCpu className="me-2 text-primary" />,
      release: "весна 2026",
      link: "/solutions/marketResearch/descriptionPage",
      elementId: "market-research-description-card",
      ctaLabel: "Подробнее",
    },
    {
      title: "Business Pulse Workspace",
      description:
        "Ваш ежедневный цифровой отдел для анализа целевой аудитории, мониторинга конкурентов, проверки налогов и разрешений вашего бизнеса. Легкий старт ИИ для вашего предприятия. Получите отчет на почту каждый понедельник",
      icon: <FiMonitor className="me-2 text-primary" />,
      release: "весна 2026",
      link: "/solutions/businessPulse",
      elementId: "business-pulse-workspace-card",
      ctaLabel: "Подробнее",
    },
    {
      title: "PlanMaster AI",
      description:
        "Генерация экспертного бизнес-плана на основе современной методологии, живого поиска и верифицированных данных. Нулевая толерантность к ИИ-галлюцинациям. Удобный чат запроса. Документ готов к презентации инвесторам.",
      icon: <FiFileText className="me-2 text-danger" />,
      release: "весна 2026",
      link: "/solutions/planMaster/descriptionPage",
      elementId: "planmaster-description-card",
      ctaLabel: "Подробнее",
    },
    {
      title: "Relocation Service Free",
      description:
        "Сервис предоставляет условия открытия или релокации бизнеса в любую страну. Доступен бесплатно",
      icon: <FiMapPin className="me-2 text-info" />,
      link: "/solutions/openAbroad",
      elementId: "relocation-service-card",
    },
    {
      title: "Synth Focus Lab — Синтетические респонденты",
      description:
        "Проверьте бизнес-идею на виртуальных покупателях за 15 минут. Синтетические респонденты заменяют дорогие фокус-группы — без рекрутинга, без ожидания. Точность 85–92% по сравнению с реальными участниками.",
      icon: <FiUsers className="me-2 text-warning" />,
      release: "весна 2026",
      link: "/solutions/synthetic-customer-research",
      elementId: "synth-focus-lab-description-card",
      ctaLabel: "Подробнее",
    },
  ];
  const { trackClick } = useClickAnalytics();

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />

      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Автоматические финансовые, маркетинговые и аналитические инструменты
        </h1>
        <p style={{ color: "#0785f6", fontSize: "1.1rem" }}>
          Решения для тех, кто ценит свое время и готов использовать новые
          технологии.
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
                          <FaHourglassHalf /> Релиз {solution.release}
                        </span>
                      )}
                      {solution.hasCountrySelector && (
                        <div>
                          <label
                            htmlFor="country-select"
                            className="form-label small text-muted mb-1"
                          >
                            Выберите страну:
                          </label>
                          <select
                            id="country-select"
                            className="form-select form-select-sm"
                            value={finPilotCountry}
                            onChange={(e) => setFinPilotCountry(e.target.value)}
                          >
                            <option value="ru">🇷🇺 Россия</option>
                            <option value="il">🇮🇱 Израиль</option>
                          </select>
                        </div>
                      )}
                    </div>
                    {solution.link && (
                      <div style={{ width: "33.333%" }}>
                        <Link
                          href={getLocalePath(solution.link)}
                          className="btn btn-primary w-100"
                          onClick={() =>
                            trackClick(
                              solution.elementId || (solution.title ?? "unknown"),
                              "card",
                            )
                          }
                        >
                          {solution.ctaLabel ?? "Открыть"}
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
