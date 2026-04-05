"use client";

import { useState } from "react";
import Header from "../../../../components/Header";
import IntelligenceLabV3 from "./IntelligenceLab-v3";

// ─── ACCESS CODE MODAL ────────────────────────────────────────────────────
function AccessCodeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "132435") {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          zIndex: 1040,
        }}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2.5rem 2rem",
          width: "min(420px, 92vw)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: "1.2rem",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(6,131,245,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            fontSize: "1.4rem",
          }}
        >
          🔑
        </div>

        <h2
          id="modal-title"
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          Доступ для тестеров
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#64748b",
            marginBottom: "1.75rem",
            lineHeight: 1.5,
          }}
        >
          Введите ваш персональный 6-значный код для активации системы.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="· · · · · ·"
            value={code}
            onChange={(e) => {
              setError(false);
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              fontSize: "2rem",
              letterSpacing: "0.5em",
              fontWeight: 700,
              padding: "0.6rem 1rem",
              border: `2px solid ${error ? "#ef4444" : "rgba(6,131,245,0.3)"}`,
              borderRadius: "0.6rem",
              outline: "none",
              color: "#0f172a",
              marginBottom: error ? "0.4rem" : "1.5rem",
              fontFamily: "ui-monospace, monospace",
            }}
            autoFocus
          />
          {error && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#ef4444",
                marginBottom: "1rem",
              }}
            >
              Неверный код. Проверьте и попробуйте снова.
            </p>
          )}
          <button
            type="submit"
            disabled={code.length !== 6}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: code.length === 6 ? "#0683f5" : "#e2e8f0",
              color: code.length === 6 ? "#fff" : "#94a3b8",
              border: "none",
              borderRadius: "0.6rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: code.length === 6 ? "pointer" : "default",
              transition: "background-color 0.2s",
            }}
          >
            Войти
          </button>
        </form>
      </div>
    </>
  );
}

// ─── PRODUCTS SECTION ─────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "worldwide",
    icon: "bi-globe-americas",
    title: "Upgrowplan Worldwide",
    subtitle: "Глобальная версия",
    description:
      "Генератор бизнес-планов для проектов в любой юрисдикции. Валюта, налоговые и рыночные вводные подтягиваются под выбранную страну и город. Мультивалютная финмодель, совместимость с требованиями международных банков и фондов.",
    status: "pending" as const,
  },
  {
    id: "soccontract",
    icon: "bi-file-earmark-check",
    title: "Соцконтракт 2026",
    subtitle: "Локальная версия (РФ)",
    description:
      "Бизнес-план под утверждённую форму подачи на соцконтракт. Встроены ориентиры по критериям господдержки и логика проверки согласованности разделов с ожиданиями Минтруда. Время генерации — 5–10 минут.",
    status: "active" as const,
  },
];

// ─── BETA FORM ─────────────────────────────────────────────────────────────
function BetaForm() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<"worldwide" | "soccontract">(
    "worldwide",
  );
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="fw-semibold mb-0" style={{ color: "#0683f5" }}>
        Спасибо! Мы свяжемся с вами, когда откроется доступ к бете.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <div className="mb-3">
        <label
          htmlFor="beta-email"
          className="form-label small fw-semibold text-secondary"
        >
          Email
        </label>
        <input
          id="beta-email"
          type="email"
          className="form-control form-control-lg rounded-3 border-0 shadow-sm"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="mb-4">
        <span className="form-label small fw-semibold text-secondary d-block mb-2">
          Интерес
        </span>
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn flex-fill rounded-start-3 py-2"
            style={{
              borderColor: "rgba(6,131,245,0.35)",
              backgroundColor: interest === "worldwide" ? "#0683f5" : "#fff",
              color: interest === "worldwide" ? "#fff" : "#334155",
              border: "1px solid rgba(6,131,245,0.35)",
            }}
            onClick={() => setInterest("worldwide")}
          >
            Worldwide
          </button>
          <button
            type="button"
            className="btn flex-fill rounded-end-3 py-2"
            style={{
              borderColor: "rgba(6,131,245,0.35)",
              backgroundColor:
                interest === "soccontract" ? "#0683f5" : "#fff",
              color: interest === "soccontract" ? "#fff" : "#334155",
              border: "1px solid rgba(6,131,245,0.35)",
            }}
            onClick={() => setInterest("soccontract")}
          >
            Соцконтракт
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-lg w-100 rounded-3 fw-semibold border-0"
        style={{ backgroundColor: "#0683f5", color: "#fff" }}
      >
        Забронировать место в очереди
      </button>
    </form>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────
export default function PlanMasterDescriptionPageRu() {
  const [showModal, setShowModal] = useState(false);

  const handleModalSuccess = () => {
    setShowModal(false);
    window.location.href = "/ru/solutions/socialPlanMaster";
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <main className="flex-grow-1">
          {/* ══════════ HERO ══════════ */}
          <section
            style={{
              padding: "5rem 0 3.5rem",
              background:
                "radial-gradient(1200px 600px at 10% 10%, rgba(7,133,246,0.10), transparent 60%), linear-gradient(120deg, rgba(30,96,120,0.05), rgba(7,133,246,0.02))",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div className="container">
              {/* Kicker */}
              <p
                style={{
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#1e6078",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Продукт Upgrowplan
              </p>

              {/* Split-color heading */}
              <h1
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.4rem)",
                  fontWeight: 700,
                  color: "#1e6078",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Лаборатория Upgrowplan:{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #0683f5 0%, #0565c8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Генератор&nbsp;бизнес-планов 2.12
                </span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#171717",
                  marginBottom: "2.25rem",
                  maxWidth: 620,
                  lineHeight: 1.65,
                  fontFamily: "Inter, -apple-system, sans-serif",
                }}
              >
                Мы завершаем калибровку нашей системы генерации, обогащённой
                живым поиском (RAG). Прямо сейчас агенты учатся отличать
                гипотезы от фактов, чтобы ваш бизнес-план выдержал любую
                проверку.
              </p>

              {/* Live Calibration badge */}
              <div
                className="d-none d-md-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-5"
                style={{
                  width: "fit-content",
                  fontSize: "0.7rem",
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.12em",
                  color: "#0683f5",
                  backgroundColor: "rgba(6,131,245,0.08)",
                  border: "1px solid rgba(6,131,245,0.25)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#0683f5",
                    display: "inline-block",
                    animation: "heroCalibPulse 2s infinite",
                  }}
                />
                <span>[ LIVE CALIBRATION ]</span>
              </div>

              {/* Muted release note at bottom of hero */}
              <p
                style={{
                  fontSize: "0.87rem",
                  color: "#94a3b8",
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span aria-hidden>⏳</span>
                Продукт в разработке. Релиз — лето 2026.
              </p>
            </div>
          </section>

          <style>{`
            @keyframes heroCalibPulse {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0.4; }
            }
          `}</style>

          {/* ══════════ ARCHITECTURE (no changes) ══════════ */}
          <IntelligenceLabV3 />

          {/* ══════════ OUR PRODUCTS ══════════ */}
          <section
            className="py-5"
            style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}
          >
            <div className="container">
              <h2
                className="fw-bold mb-2"
                style={{ color: "#0f172a", fontSize: "1.45rem" }}
              >
                Наши продукты
              </h2>
              <p
                className="mb-4"
                style={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  maxWidth: 640,
                  lineHeight: 1.6,
                }}
              >
                Продукты доступны по запросу или с использованием персонального
                кода тестера. Если у вас уже есть 6-значный код, введите его
                для получения доступа к полной версии.
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Card (75% desktop) */}
                    <div
                      style={{
                        flex: "0 1 calc(75% - 1.25rem)",
                        minWidth: 260,
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(6,131,245,0.15)",
                        borderRadius: "0.75rem",
                        padding: "1.25rem 1.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        className="d-flex align-items-center gap-2 mb-2"
                      >
                        <i
                          className={`bi ${p.icon}`}
                          style={{ color: "#0683f5", fontSize: "1.2rem" }}
                          aria-hidden
                        />
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          {p.title}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "0.3rem",
                            padding: "0.1rem 0.5rem",
                          }}
                        >
                          {p.subtitle}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "#475569",
                          marginBottom: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        {p.description}
                      </p>
                    </div>

                    {/* Button */}
                    {p.status === "pending" ? (
                      <button
                        disabled
                        style={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.6rem 1.25rem",
                          backgroundColor: "#e2e8f0",
                          color: "#94a3b8",
                          border: "none",
                          borderRadius: "0.6rem",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "not-allowed",
                          whiteSpace: "nowrap",
                        }}
                        title="Функционал в процессе деплоя"
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid #94a3b8",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spinLoader 0.9s linear infinite",
                          }}
                        />
                        Скоро
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowModal(true)}
                        style={{
                          flexShrink: 0,
                          padding: "0.6rem 1.25rem",
                          backgroundColor: "#0683f5",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.6rem",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0565c8")
                        }
                        onMouseOut={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0683f5")
                        }
                      >
                        Попробовать →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <style>{`
            @keyframes spinLoader {
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* ══════════ BETA FORM ══════════ */}
          <section
            className="py-5 px-3"
            style={{
              background:
                "linear-gradient(145deg, #e8f4fc 0%, #f5f9ff 45%, #eef6ff 100%)",
              boxShadow: "0 8px 32px rgba(6,131,245,0.08)",
              borderRadius: "1rem",
            }}
          >
            <div className="container">
              <h2
                className="h5 fw-bold mb-3"
                style={{ color: "#0f172a" }}
              >
                Станьте бета-тестером
              </h2>
              <p
                className="mb-4"
                style={{ color: "#334155", maxWidth: "36rem" }}
              >
                Продукт почти готов. Оставьте email, чтобы получить приглашение
                в закрытую бету и вечную скидку 50% для первых 100 основателей.
              </p>
              <BetaForm />
            </div>
          </section>
        </main>
      </div>

      {/* ══════════ ACCESS CODE MODAL ══════════ */}
      {showModal && (
        <AccessCodeModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}
