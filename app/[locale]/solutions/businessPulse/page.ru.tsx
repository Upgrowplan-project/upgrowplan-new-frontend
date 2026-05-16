"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import type mapboxgl from "mapbox-gl";

/* ══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@keyframes bp-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.6); }
}
@keyframes bp-bar-dance {
  0%, 100% { transform: scaleY(1); }
  50%       { transform: scaleY(var(--peak, 1.6)); }
}
@keyframes bp-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes bp-ripple {
  0%   { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(2.4); opacity: 0; }
}
@keyframes bp-num-roll {
  0%   { transform: translateY(100%); opacity: 0; }
  30%  { transform: translateY(0);    opacity: 1; }
  70%  { transform: translateY(0);    opacity: 1; }
  100% { transform: translateY(-100%);opacity: 0; }
}
@keyframes bp-notif-in {
  from { transform: translateY(-12px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
.bp-mapbox-container .mapboxgl-canvas { border-radius: 16px; }
.business-pulse-page {
  font-family: var(--font-inter), "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
  color: #0b1a2e;
}
.business-pulse-page h1,
.business-pulse-page h2,
.business-pulse-page h3,
.business-pulse-page h4 {
  font-family: var(--font-inter), "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
  font-weight: 700 !important;
  color: #1e6078 !important;
  letter-spacing: 0;
}
.bp-hero-title {
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  font-weight: 700;
  color: #1e6078;
  margin-bottom: 1rem;
  letter-spacing: 0;
}
.bp-hero-accent {
  color: #0683f5;
}
@media (max-width: 768px) {
  .bp-hero {
    padding: 64px 0 56px !important;
  }
  .bp-hero-row {
    gap: 32px !important;
  }
  .bp-hero-cta {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .bp-hero-cta a {
    width: 100% !important;
    text-align: center !important;
  }
  .bp-live-wrap {
    width: 100% !important;
  }
  .bp-live-wrap > div {
    max-width: 100% !important;
    min-width: 0 !important;
  }
  .bp-map-shell {
    height: 320px !important;
  }
  .bp-map-actions {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .bp-map-actions button {
    width: 100% !important;
  }
  .bp-map-inputs {
    width: 100% !important;
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .bp-map-inputs input {
    width: 100% !important;
    min-width: 0 !important;
  }
}
`;

/* ══════════════════════════════════════════════════════════════════
   1. HERO
══════════════════════════════════════════════════════════════════ */

const LIVE_METRICS = [
  { label: "Средний чек", value: "₽4 800", trend: "+3%" },
  { label: "Доля рынка", value: "18.4%", trend: "+1.2 пп" },
  { label: "Конкурентный пресс", value: "Умеренный", trend: "↓" },
  { label: "Топ-тренд", value: "Кофе Nitro", trend: "↑ 22%" },
];

const BAR_HEIGHTS = [30, 55, 40, 70, 50, 85, 60, 45, 75, 55, 80, 65];

function LiveWidget() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % LIVE_METRICS.length);
      setKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const m = LIVE_METRICS[idx];

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24,
      padding: "28px 30px",
      boxShadow: "0 12px 48px rgba(7,133,246,0.14)",
      border: "1px solid rgba(7,133,246,0.12)",
      minWidth: 300,
      maxWidth: 340,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <span style={{
          width: 9, height: 9, borderRadius: "50%", background: "#22c55e",
          animation: "bp-pulse 1.5s ease-in-out infinite",
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", letterSpacing: "0.04em" }}>
          LIVE AI STREAM: ACTIVE
        </span>
      </div>

      <div style={{ marginBottom: 18, overflow: "hidden", height: 72 }}>
        <div key={key} style={{ animation: "bp-num-roll 3s ease-in-out forwards" }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{m.label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#0b1a2e" }}>{m.value}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>{m.trend}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56, marginBottom: 16 }}>
        {BAR_HEIGHTS.map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${h}%`,
            borderRadius: "3px 3px 0 0",
            background: `rgba(7,133,246,${0.3 + (h / 100) * 0.7})`,
            transformOrigin: "bottom",
            "--peak": 1 + (h / 100) * 0.8,
            animation: `bp-bar-dance ${1.2 + i * 0.15}s ease-in-out infinite`,
            animationDelay: `${i * 0.08}s`,
          } as React.CSSProperties} />
        ))}
      </div>

      <div style={{
        fontSize: 11, color: "#94a3b8", textAlign: "center",
        borderTop: "1px solid #f1f5f9", paddingTop: 12,
      }}>
        Данные обновляются в реальном времени
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bp-hero" style={{
      background: "radial-gradient(ellipse at 60% 40%, rgba(7,133,246,0.09) 0%, rgba(255,255,255,0) 70%), #ffffff",
      padding: "88px 0 80px",
      borderBottom: "1px solid #e8f0fe",
    }}>
      <div className="container">
        <div className="bp-hero-row" style={{ display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 360px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(7,133,246,0.08)", border: "1px solid rgba(7,133,246,0.2)",
              borderRadius: 30, padding: "5px 16px",
              fontSize: 12, color: "#0683f5", fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase" as const,
              marginBottom: 22,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0683f5" }} />
              Business Pulse
            </div>
            <h1 className="bp-hero-title">
              Хватит «внедрять ИИ».{" "}
              <span className="bp-hero-accent">Просто начните им пользоваться.</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
              Все говорят, что надо внедрять ИИ! А мы это сделали, причем довольно деликатно. Вам не надо пускать к себе
              в учетную систему непонятных агентов, не надо давать доступ к чувствительной информации, не надо выгружать
              коммерческую информацию на внешние ресурсы. Вы говорите нам чем и где вы занимаетесь, а мы еженедельно
              обновляем для вас мониторинг рынка и правовую информацию.
            </p>
            <div className="bp-hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#workspace" style={{
                padding: "14px 32px",
                borderRadius: 12,
                background: "#0683f5",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(6,131,245,0.35)",
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
              onMouseOver={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 6px 28px rgba(6,131,245,0.55)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseOut={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 4px 18px rgba(6,131,245,0.35)";
                el.style.transform = "";
              }}>
                Настроить мой Пульс →
              </a>
              <a href="#how-it-works" style={{
                padding: "14px 28px",
                borderRadius: 12,
                border: "2px solid #e2e8f0",
                color: "#1e6078",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0683f5"; }}
              onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0"; }}>
                Как это работает
              </a>
            </div>
          </div>
          <div className="bp-live-wrap" style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
            <LiveWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. RADAR MAP
══════════════════════════════════════════════════════════════════ */

const MOCK_MARKERS = [
  { lng: 0.005, lat: 0.004, type: "red", label: "Конкурент снизил цену на 15%" },
  { lng: -0.006, lat: 0.007, type: "yellow", label: "Новый 5-звёздочный отзыв у конкурента" },
  { lng: 0.008, lat: -0.005, type: "green", label: "Тренд: спрос на доставку ↑ 28%" },
  { lng: -0.004, lat: -0.008, type: "red", label: "Акция у конкурента: -20% до пятницы" },
  { lng: 0.010, lat: 0.003, type: "green", label: "Новая ниша без конкурентов рядом" },
];

const MARKER_COLORS: Record<string, string> = {
  red: "#ef4444",
  yellow: "#f59e0b",
  green: "#22c55e",
};

function RadarMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapboxRef = useRef<typeof mapboxgl | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const bizMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "denied">("idle");
  const [geoLabel, setGeoLabel] = useState("");
  const [address, setAddress] = useState("");
  const [addressStatus, setAddressStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const addMarkers = useCallback((center: [number, number]) => {
    if (!mapRef.current || !mapboxRef.current) return;
    const mapbox = mapboxRef.current;
    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.style.cssText = `
        width:18px;height:18px;border-radius:50%;
        background:#0683f5;border:3px solid #fff;
        box-shadow:0 0 0 0 rgba(6,131,245,0.5);
        animation:bp-pulse 1.6s ease-in-out infinite;
      `;
      userMarkerRef.current = new mapbox.Marker({ element: el }).setLngLat(center).addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLngLat(center);
    }

    bizMarkersRef.current.forEach((marker) => marker.remove());
    bizMarkersRef.current = [];

    MOCK_MARKERS.forEach((m) => {
      const dot = document.createElement("div");
      const color = MARKER_COLORS[m.type];
      dot.style.cssText = `
        width:14px;height:14px;border-radius:50%;
        background:${color};border:2px solid #fff;
        box-shadow:0 0 8px ${color};cursor:pointer;
      `;
      const popup = new mapbox.Popup({ offset: 14, closeButton: false })
        .setHTML(`<div style="font-size:13px;padding:4px 2px;color:#1e293b;">${m.label}</div>`);
      const marker = new mapbox.Marker({ element: dot })
        .setLngLat([center[0] + m.lng, center[1] + m.lat])
        .setPopup(popup)
        .addTo(mapRef.current);
      bizMarkersRef.current.push(marker);
    });
  }, []);

  const ensureMap = useCallback(async (center: [number, number]) => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.flyTo({ center, zoom: 13.5 });
      addMarkers(center);
      setStatus("ready");
      return;
    }
    const mapbox = (await import("mapbox-gl")).default;
    mapboxRef.current = mapbox;
    (mapbox as { accessToken: string }).accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

    const map = new mapbox.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom: 13.5,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      setStatus("ready");
      addMarkers(center);
    });
  }, [addMarkers]);

  const handleScan = useCallback(() => {
    setStatus("loading");
    if (!navigator.geolocation) {
      ensureMap([37.6173, 55.7558]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        ensureMap(center);
        setGeoLabel("Ваш район");
      },
      () => {
        setStatus("denied");
        ensureMap([37.6173, 55.7558]);
      },
      { timeout: 8000 }
    );
  }, [ensureMap]);

  const handleAddressLookup = useCallback(async () => {
    if (!address.trim()) return;
    setAddressStatus("loading");
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?limit=1&language=ru&access_token=${token}`
      );
      const data = await res.json();
      const feature = data?.features?.[0];
      if (feature?.center) {
        const center: [number, number] = [feature.center[0], feature.center[1]];
        ensureMap(center);
        setGeoLabel(feature.place_name);
        setAddressStatus("ready");
      } else {
        setAddressStatus("error");
      }
    } catch {
      setAddressStatus("error");
    }
  }, [address, ensureMap]);

  return (
    <section style={{ background: "#ffffff", padding: "72px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)" }}>
            Территория роста: ваша локация как на ладони.
            <span style={{ color: "#0683f5" }}>
              {" "}
              Карта показывает реальную активность конкурентов, спрос и слабые места вокруг вашей точки.
            </span>
          </h2>
        </div>

        <div className="bp-map-shell" style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 440,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <div ref={mapContainerRef} className="bp-mapbox-container" style={{ width: "100%", height: "100%" }} />

          {status === "ready" && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              pointerEvents: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  position: "absolute",
                  width: 200, height: 200,
                  borderRadius: "50%",
                  border: "2px solid rgba(6,131,245,0.35)",
                  animation: `bp-ripple 3s ease-out infinite`,
                  animationDelay: `${i * 1}s`,
                }} />
              ))}
              <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", width: "100%", height: "100%",
                  background: "conic-gradient(from 0deg, rgba(6,131,245,0.3) 0deg, transparent 50deg)",
                  animation: "bp-spin 3s linear infinite",
                }} />
              </div>
            </div>
          )}

           {status !== "ready" && (
             <div style={{
               position: "absolute", inset: 0,
               background: "linear-gradient(135deg,#f0f7ff 0%,#e8f0fe 100%)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20,
            }}>
              {status === "loading" ? (
                <>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    border: "3px solid #e2e8f0", borderTopColor: "#0683f5",
                    animation: "bp-spin 0.8s linear infinite",
                  }} />
                  <p style={{ color: "#64748b", fontSize: 15 }}>Определяем геолокацию…</p>
                </>
              ) : (
                <>
                  <div style={{ position: "relative", width: 200, height: 200 }}>
                    {[40, 80, 120, 160].map((s) => (
                      <div key={s} style={{
                        position: "absolute",
                        top: `calc(50% - ${s / 2}px)`, left: `calc(50% - ${s / 2}px)`,
                        width: s, height: s, borderRadius: "50%",
                        border: "1px dashed rgba(6,131,245,0.25)",
                      }} />
                    ))}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#0683f5", boxShadow: "0 0 0 6px rgba(6,131,245,0.15)",
                    }} />
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>
                    Нажмите «Показать мой район», чтобы запустить карту
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bp-map-actions" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20, justifyContent: "center" }}>
          <button onClick={handleScan} style={{
            padding: "12px 26px", borderRadius: 12,
            background: "#0683f5", color: "#fff",
            fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
            boxShadow: "0 4px 18px rgba(6,131,245,0.3)",
          }}>
            {status === "loading" ? "Определяем район..." : "Показать мой район"}
          </button>
          <div className="bp-map-inputs" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ввести адрес моего бизнеса"
              style={{
                minWidth: 240,
                padding: "11px 14px",
                borderRadius: 12,
                border: "1px solid #d7e1f3",
                fontSize: 14,
                color: "#1e293b",
              }}
            />
            <button onClick={handleAddressLookup} style={{
              padding: "12px 20px",
              borderRadius: 12,
              background: "#ffffff",
              color: "#0683f5",
              fontWeight: 700,
              fontSize: 14,
              border: "1px solid #0683f5",
              cursor: "pointer",
            }}>
              Найти адрес
            </button>
          </div>
          {geoLabel && (
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Локация: {geoLabel}
            </div>
          )}
          {addressStatus === "error" && (
            <div style={{ fontSize: 13, color: "#ef4444" }}>
              Адрес не найден, попробуйте уточнить
            </div>
          )}
          {status === "denied" && (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Геолокация недоступна — показываем центр города
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 16, justifyContent: "center" }}>
          {[
            { color: "#ef4444", label: "Риск / Ценовая угроза" },
            { color: "#f59e0b", label: "Новый отзыв конкурента" },
            { color: "#22c55e", label: "Рыночный тренд / Возможность" },
          ].map((leg) => (
            <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: leg.color, flexShrink: 0 }} />
              {leg.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. HOW IT WORKS — TABS
══════════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    id: "scan",
    icon: "🔍",
    label: "Как это работает?",
    title: "Мониторинг",
    body: "Агент поиска данных методично сканирует локацию и определяет конкурентов, трафик покупателей, отзывы и оценки в соцсетях, социально-демографические параметры и правовое поле.",
    highlight: "Результат — фактическая картина рынка вокруг вашей точки",
  },
  {
    id: "data",
    icon: "🗂️",
    label: "Что от вас надо?",
    title: "5 минут",
    body: "Укажите ваш товар, особенности, текущую целевую аудиторию и локацию — этого достаточно, чтобы запустить персональный мониторинг.",
    highlight: "Без доступа к учетным системам и чувствительным данным",
  },
  {
    id: "result",
    icon: "📬",
    label: "Что вы получаете?",
    title: "Контроль",
    body: "Получайте результат мониторинга вашей рыночной ниши, обновления налоговых и регуляторных ограничений на мэйл или в телеграмм раз в неделю или ежедневно.",
    highlight: "Четкий апдейт вместо хаоса и перегрузки",
  },
];

function HowItWorksSection() {
  const [active, setActive] = useState("scan");
  const step = STEPS.find((s) => s.id === active)!;

  return (
    <section id="how-it-works" style={{ background: "#f0f7ff", padding: "72px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)" }}>
            3 шага к контролю над рынком.
            <span style={{ color: "#0683f5" }}>
              {" "}
              Ваш ежедневный цифровой отдел для мониторинга рынка и защиты бизнеса.
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          {STEPS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 26px", borderRadius: 40,
              border: `2px solid ${active === s.id ? "#0683f5" : "#dde8f5"}`,
              background: active === s.id ? "#0683f5" : "#fff",
              color: active === s.id ? "#fff" : "#64748b",
              fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
              boxShadow: active === s.id ? "0 4px 16px rgba(6,131,245,0.28)" : "none",
            }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
            style={{
              background: "#fff", borderRadius: 20, padding: "36px 40px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid #e0eaf6",
              maxWidth: 720, margin: "0 auto",
            }}>
            <div style={{ fontSize: 34, marginBottom: 14 }}>{step.icon}</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1e6078", marginBottom: 12 }}>{step.title}</h3>
            <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>{step.body}</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(6,131,245,0.07)", border: "1px solid rgba(6,131,245,0.2)",
              borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#0683f5", fontWeight: 600,
            }}>
              ✓ {step.highlight}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. WORKSPACE
══════════════════════════════════════════════════════════════════ */

const FREQ_LABELS: Record<number, string> = {
  1: "Real-time", 2: "Каждые 2 ч", 3: "Ежедневно", 4: "Еженедельно", 5: "Спокойно",
};

const CHANNELS_W = [
  { id: "tg", icon: "✈️", label: "Telegram" },
  { id: "wa", icon: "💬", label: "WhatsApp" },
  { id: "em", icon: "✉️", label: "Email" },
];

const NOTIFS = [
  { type: "danger", icon: "🔴", text: "Конкурент снизил цену — время действовать!", time: "прямо сейчас" },
  { type: "warn",   icon: "🟡", text: "Новый 5★ отзыв у «Кофе-Хаус» — проверьте.", time: "10 мин назад" },
  { type: "ok",     icon: "🟢", text: "Спрос на доставку вырос на 18% за неделю.", time: "1 ч назад" },
  { type: "ok",     icon: "🟢", text: "Ваш рейтинг поднялся до 4.7 — топ в районе!", time: "3 ч назад" },
];

function WorkspaceSection() {
  const [freq, setFreq] = useState(3);
  const [selCh, setSelCh] = useState<string[]>(["tg"]);
  const [visibleNotifs, setVisibleNotifs] = useState(2);

  useEffect(() => {
    const id = setInterval(() => {
      setVisibleNotifs((v) => (v < NOTIFS.length ? v + 1 : 1));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const toggleCh = (id: string) =>
    setSelCh((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  return (
    <section id="workspace" style={{ background: "#ffffff", padding: "72px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)" }}>
            Ваш цифровой отдел.
            <span style={{ color: "#0683f5" }}>
              {" "}
              Настройте, как и куда приходит аналитика — всё под рукой.
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontWeight: 700, color: "#0b1a2e", fontSize: 15, marginBottom: 6 }}>
                Частота отчётов:{" "}
                <span style={{ color: "#0683f5" }}>{FREQ_LABELS[freq]}</span>
              </div>
              <input type="range" min={1} max={5} step={1} value={freq}
                onChange={e => setFreq(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0683f5", marginBottom: 4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                <span>Real-time</span><span>Спокойно</span>
              </div>
            </div>

            <div style={{ marginBottom: 36 }}>
              <div style={{ fontWeight: 700, color: "#0b1a2e", fontSize: 15, marginBottom: 14 }}>
                Канал уведомлений
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {CHANNELS_W.map((ch) => {
                  const sel = selCh.includes(ch.id);
                  return (
                    <button key={ch.id} onClick={() => toggleCh(ch.id)} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 20px", borderRadius: 30,
                      border: `2px solid ${sel ? "#0683f5" : "#e2e8f0"}`,
                      background: sel ? "rgba(6,131,245,0.08)" : "#fff",
                      color: sel ? "#0683f5" : "#94a3b8",
                      fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <span>{ch.icon}</span>{ch.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: "rgba(6,131,245,0.06)", borderRadius: 12, padding: "14px 18px",
              fontSize: 13, color: "#475569", lineHeight: 1.6,
            }}>
              <strong style={{ color: "#0683f5" }}>Совет:</strong> Для малого бизнеса
              оптимально — Telegram + Ежедневно. Реакция на сигнал в среднем 4 минуты.
            </div>
          </div>

          <div style={{ flex: "0 0 auto", margin: "0 auto" }}>
            <div style={{
              width: 280, background: "#0b1a2e", borderRadius: 36,
              padding: "14px 10px 20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "3px solid #1e293b",
            }}>
              <div style={{ width: 90, height: 6, background: "#1e293b", borderRadius: 3, margin: "0 auto 14px" }} />
              <div style={{ background: "#f8fafc", borderRadius: 24, overflow: "hidden" }}>
                <div style={{ background: "#0683f5", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📊</span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Business Pulse</span>
                  <span style={{
                    marginLeft: "auto", fontSize: 10, fontWeight: 700,
                    background: "#22c55e", color: "#fff", borderRadius: 6, padding: "2px 7px",
                  }}>LIVE</span>
                </div>
                <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {NOTIFS.slice(0, visibleNotifs).map((n, i) => (
                    <div key={i} style={{
                      background: n.type === "danger" ? "rgba(239,68,68,0.06)" : n.type === "warn" ? "rgba(245,158,11,0.06)" : "rgba(34,197,94,0.06)",
                      border: `1px solid ${n.type === "danger" ? "rgba(239,68,68,0.2)" : n.type === "warn" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)"}`,
                      borderRadius: 10, padding: "9px 11px",
                      animation: i === 0 ? "bp-notif-in 0.35s ease-out" : "none",
                    }}>
                      <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 13, flexShrink: 0 }}>{n.icon}</span>
                        <span style={{ fontSize: 11.5, color: "#1e293b", lineHeight: 1.5, fontWeight: n.type === "danger" ? 700 : 400 }}>{n.text}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, textAlign: "right" }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5. VOICE INSIGHT
══════════════════════════════════════════════════════════════════ */

function VoiceInsight() {
  const N = 28;
  const baseHeights = Array.from({ length: N }, (_, i) =>
    18 + Math.sin((i / N) * Math.PI * 2) * 12 + Math.random() * 10
  );
  const [heights, setHeights] = useState(baseHeights);
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  const startAnim = () => {
    const step = () => {
      setHeights(Array.from({ length: N }, () => 6 + Math.random() * 60));
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const stopAnim = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setHeights(baseHeights);
  };

  useEffect(() => {
    if (hovering || playing) startAnim();
    else stopAnim();
    return stopAnim;
  }, [hovering, playing]); // eslint-disable-line

  return (
    <section style={{ background: "#f0f7ff", padding: "72px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)" }}>
            Voice Insight.
            <span style={{ color: "#0683f5" }}>
              {" "}
              Послушайте утренний брифинг по пути на работу.
            </span>
          </h2>
        </div>

        <div style={{ maxWidth: 600, margin: "40px auto 0", textAlign: "center" }}>
          <div style={{
            background: "#ffffff", borderRadius: 24, padding: "40px 36px",
            boxShadow: "0 6px 32px rgba(6,131,245,0.10)", border: "1px solid #dde8f5",
          }}>
            <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 80, cursor: "pointer", marginBottom: 28 }}>
              {heights.map((h, i) => (
                <div key={i} style={{
                  width: 5, height: h, borderRadius: 3,
                  background: playing || hovering ? `hsl(${205 + i * 2}, 80%, ${45 + h * 0.25}%)` : "rgba(6,131,245,0.25)",
                  transition: hovering || playing ? "none" : "height 0.5s ease, background 0.5s",
                }} />
              ))}
            </div>

            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
              Сегодня, 08:30 · 58 секунд
            </div>

            <button onClick={() => setPlaying((p) => !p)} style={{
              padding: "13px 44px", borderRadius: 30,
              background: playing ? "#ef4444" : "#0683f5",
              color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
              boxShadow: playing ? "0 4px 18px rgba(239,68,68,0.35)" : "0 4px 18px rgba(6,131,245,0.35)",
              transition: "background 0.2s, box-shadow 0.2s",
            }}>
              {playing ? "⏹ Остановить" : "▶ Воспроизвести брифинг"}
            </button>
            <p style={{ marginTop: 14, fontSize: 13, color: "#94a3b8" }}>
              Или наведите мышь на осциллограф для превью
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6. VECTOR CHOICE
══════════════════════════════════════════════════════════════════ */

const BP_FEATURES = [
  "Ежедневный мониторинг конкурентов",
  "Пуш-алерты в Telegram / WhatsApp",
  "Радар цен и акций в вашем районе",
  "Отслеживание отзывов в реальном времени",
  "Голосовые брифинги каждое утро",
];

const MR_FEATURES = [
  "Расчёт ёмкости рынка TAM / SAM / SOM",
  "Профиль конкурентов и бенчмарки",
  "Финансовая модель с прогнозом ROI",
  "PDF / DOCX-отчёт с источниками",
  "Анализ ниш и точек входа",
];

function VectorChoice() {
  return (
    <section style={{ background: "#ffffff", padding: "72px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)", fontWeight: 800, color: "#1e6078" }}>
            Выберите свой вектор
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, marginTop: 10 }}>
            Два продукта — для разных задач. Можно использовать оба.
          </p>
        </div>

        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{
              flex: "1 1 320px", maxWidth: 420,
              background: "linear-gradient(145deg,#0683f5 0%,#0565c8 100%)",
              borderRadius: 24, padding: "40px 36px",
              boxShadow: "0 12px 48px rgba(6,131,245,0.28)", color: "#fff",
            }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Иммунитет бизнеса</h3>
            <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.7, marginBottom: 28 }}>
              Для тех, кто уже работает и хочет защитить свою долю рынка от конкурентов.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
              {BP_FEATURES.map((f) => (
                <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}>
                  <span style={{ color: "#86efac", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ opacity: 0.92 }}>{f}</span>
                </li>
              ))}
            </ul>
            <a href="#workspace" style={{
              display: "block", textAlign: "center", padding: "13px 0", borderRadius: 12,
              background: "#fff", color: "#0683f5", fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}>
              Настроить Пульс
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.12 }}
            style={{
              flex: "1 1 320px", maxWidth: 420,
              background: "#fff", borderRadius: 24, padding: "40px 36px",
              boxShadow: "0 8px 36px rgba(0,0,0,0.06)", border: "2px solid #e2e8f0",
            }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1e6078", marginBottom: 8 }}>Стратегический Щит</h3>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>
              Для запуска новых продуктов, захвата новых ниш и стратегических решений с данными.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
              {MR_FEATURES.map((f) => (
                <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#334155" }}>
                  <span style={{ color: "#0683f5", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="/ru/solutions/marketResearch" style={{
              display: "block", textAlign: "center", padding: "13px 0", borderRadius: 12,
              background: "transparent", color: "#0683f5", fontWeight: 700, fontSize: 15,
              textDecoration: "none", border: "2px solid #0683f5",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseOver={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#0683f5"; el.style.color = "#fff"; }}
            onMouseOut={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = "#0683f5"; }}>
              Заказать исследование
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   7. BETA CTA
══════════════════════════════════════════════════════════════════ */

function BpBetaForm() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный Email");
      return;
    }
    if (!isChecked) return;
    setError("");
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      await fetch(`${API_BASE}/api/monitoring/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email,
          message: `запрос на бета-тестирование Business Pulse Workspace получен`,
        }),
      });
      setSubmitted(true);
      setEmail("");
      setIsChecked(false);
    } catch (err) {
      console.error("Error sending beta request:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#16a34a", justifyContent: "center" }}>
        <span style={{ fontSize: 20 }}>✔</span>
        <span style={{ fontWeight: 600 }}>Спасибо за ваш интерес! Мы свяжемся с вами в ближайшее время.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}>
      <div className="mb-3">
        <label htmlFor="beta-email-bp-ru" className="form-label small fw-semibold text-secondary">Email</label>
        <input
          id="beta-email-bp-ru"
          type="email"
          className="form-control form-control-lg rounded-3 border-0 shadow-sm"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {error && <div className="text-danger small mt-2">{error}</div>}
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="beta-policy-bp-ru"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor="beta-policy-bp-ru">
          Отправляя данное сообщение, я ознакомился и согласился с{" "}
          <a href="/privacy" target="_blank">Политикой конфиденциальности</a>{" "}и{" "}
          <a href="/privacy" target="_blank">Политикой обработки персональных данных</a>.
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-lg w-100 rounded-3 fw-semibold border-0"
        style={{ backgroundColor: loading ? "#5aabf7" : "#0683f5", color: "#fff", transition: "background-color 0.2s" }}
        disabled={!isChecked || loading}
      >
        {loading ? "Отправка..." : "Подтвердить"}
      </button>
    </form>
  );
}

function BetaSection() {
  return (
    <section style={{
      background: "radial-gradient(ellipse at 50% 60%, rgba(7,133,246,0.12) 0%, #f0f7ff 70%)",
      padding: "80px 0", textAlign: "center",
    }}>
      <div className="container">
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(6,131,245,0.1)", border: "1px solid rgba(6,131,245,0.25)",
          borderRadius: 30, padding: "5px 18px",
          fontSize: 12, color: "#0683f5", fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 24,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "bp-pulse 1.4s ease-in-out infinite" }} />
          Бета-доступ открыт
        </div>
        <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#1e6078", marginBottom: 16 }}>
          Попробуйте Business Pulse бесплатно
        </h2>
        <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          3 месяца бесплатного доступа для первых участников бета-теста. Без привязки карты.
        </p>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
          Приглашаем протестировать продукт
        </h3>
        <p style={{ color: "#64748b", fontSize: 15, maxWidth: 400, margin: "0 auto 28px" }}>
          Оставьте email, чтобы получить приглашение для тестирования бета-версии.
        </p>
        <BpBetaForm />
        <div style={{ marginTop: "3rem", textAlign: "left", maxWidth: "36rem", margin: "3rem auto 0" }}>
          <p style={{ fontWeight: 700, color: "#1e6078", marginBottom: "0.75rem", fontSize: "1rem" }}>
            Другие инструменты Upgrowplan
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {[
              { label: "PlanMaster AI — бизнес-планы", href: "/ru/ai-business-plan-generator" },
              { label: "MarketSense AI — маркетинговые исследования", href: "/ru/solutions/marketResearch" },
              { label: "Synth Focus Lab — исследование аудитории", href: "/ru/solutions/synthetic-customer-research" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #bfdbfe",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════════════════ */

export default function BusinessPulsePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="business-pulse-page" style={{ backgroundColor: "#fff" }}>
        <Header />
        <HeroSection />
        <RadarMap />
        <HowItWorksSection />
        <WorkspaceSection />
        <VoiceInsight />
        <BetaSection />
      </div>
    </>
  );
}
