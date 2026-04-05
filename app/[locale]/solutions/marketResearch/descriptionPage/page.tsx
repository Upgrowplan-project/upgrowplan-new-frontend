"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ContactForm from "@/components/ContactForm";
import { Modal } from "react-bootstrap";

// Токен Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function BusinessPulsePage() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";

  const [activeTab, setActiveTab] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [frequency, setFrequency] = useState(50);
  const [liveStats, setLiveStats] = useState({ price: 120, trend: "+2.4%" });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats({
        price: Math.floor(Math.random() * (150 - 100) + 100),
        trend: (Math.random() * 5).toFixed(1) + "%",
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [37.6173, 55.7558],
      zoom: 12.5,
      interactive: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      const events = [
        { coords: [37.62, 55.76], type: "price", label: "Снижение цен -10%" },
        {
          coords: [37.61, 55.75],
          type: "review",
          label: "Плохой отзыв у соседа",
        },
        { coords: [37.6, 55.765], type: "trend", label: "Рост спроса в Reels" },
      ];

      events.forEach((ev) => {
        const el = document.createElement("div");
        el.className = `radar-marker ${ev.type}`;
        const ring = document.createElement("div");
        ring.className = "marker-ring";
        el.appendChild(ring);

        new mapboxgl.Marker(el)
          .setLngLat(ev.coords as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 10 }).setHTML(`<b>${ev.label}</b>`),
          )
          .addTo(map);
      });
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const getLocalePath = (path: string) =>
    locale === "en" ? path : `/${locale}${path}`;

  return (
    <div className="pulse-page light-theme">
      <Header />

      <main>
        {/* 1. HERO SECTION */}
        <section className="hero-pulse bg-blue-grad">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6 text-start">
                <div className="badge-u">Business Pulse</div>
                <h1 className="h1-split">
                  Хватит «внедрять ИИ». <br />
                  <span className="accent">
                    Просто начните им пользоваться.
                  </span>
                </h1>
                <p className="hero-subtitle">
                  Ваш ежедневный цифровой департамент. Мы превращаем шум рынка в
                  прибыль.
                </p>
                <button
                  className="btn btn-primary btn-lg mt-4"
                  onClick={() => setShowContactModal(true)}
                >
                  Настроить мой Пульс
                </button>
              </div>
              <div className="col-lg-6">
                <div className="hero-widget-u p-4 bg-white shadow-sm rounded-4">
                  <div className="widget-header-u d-flex align-items-center gap-2 mb-3">
                    <span className="live-dot-u"></span>{" "}
                    <span className="text-muted fw-bold">
                      Live AI Stream: Active
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted">Средний чек</small>
                      <div className="h2 fw-bold text-primary">
                        ${liveStats.price}
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Динамика</small>
                      <div className="h2 fw-bold text-success">
                        {liveStats.trend}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. RADAR MAP (Белый) */}
        <section className="bg-white py-5">
          <div className="container text-center">
            <h2 className="mb-4">
              Radar Map:{" "}
              <span className="text-primary">Карта захвата рынка</span>
            </h2>
            <div
              className="map-wrapper-u position-relative rounded-4 overflow-hidden border shadow-sm"
              style={{ height: "500px" }}
            >
              <div ref={mapContainerRef} className="w-100 h-100" />
            </div>
          </div>
        </section>

        {/* 3. TABS (Голубой) */}
        <section className="bg-blue-light py-5">
          <div className="container">
            <div className="d-flex justify-content-center gap-4 mb-4">
              {[
                "Как это работает?",
                "Что от вас надо?",
                "Что вы получаете?",
              ].map((label, idx) => (
                <button
                  key={label}
                  className={`btn ${activeTab === idx ? "btn-primary" : "btn-link text-decoration-none text-muted"}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              className="bg-white p-5 rounded-4 shadow-sm text-center mx-auto"
              style={{ maxWidth: "800px" }}
            >
              {activeTab === 0 && (
                <div>
                  <h3>📡 ИИ-разведка</h3>
                  <p>Сканируем карты, соцсети и новости 24/7.</p>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <h3>⏱️ 5 минут</h3>
                  <p>Просто укажите вашу нишу и локацию.</p>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <h3>📱 Иммунитет</h3>
                  <p>
                    Получайте уведомления о действиях конкурентов в Telegram.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. COMPARISON (Белый) */}
        <section className="bg-white py-5">
          <div className="container">
            <h2 className="text-center mb-5">Выберите ваш вектор</h2>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Параметр</th>
                    <th>Business Pulse</th>
                    <th>Market Research</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Фокус</td>
                    <td>Защита и мониторинг 24/7</td>
                    <td>Анализ и стратегия</td>
                  </tr>
                  <tr>
                    <td>Результат</td>
                    <td>Ежедневные инсайты</td>
                    <td>Глубокий отчет</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Modal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Начать работу</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContactForm
            locale={locale}
            onSuccess={() => setShowContactModal(false)}
          />
        </Modal.Body>
      </Modal>

      <style jsx global>{`
        .bg-blue-grad {
          background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
        }
        .bg-blue-light {
          background: #f0f7ff;
        }
        .accent {
          color: #0683f5;
        }
        .h1-split {
          font-weight: 800;
          color: #1e6078;
        }
        .badge-u {
          display: inline-block;
          padding: 5px 15px;
          background: rgba(6, 131, 245, 0.1);
          color: #0683f5;
          border-radius: 20px;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .live-dot-u {
          height: 10px;
          width: 10px;
          background: #28a745;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }

        .radar-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #fff;
        }
        .radar-marker.price {
          background: #dc3545;
        }
        .radar-marker.review {
          background: #ffc107;
        }
        .radar-marker.trend {
          background: #28a745;
        }
      `}</style>
    </div>
  );
}
