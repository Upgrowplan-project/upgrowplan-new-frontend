"use client";

import Link from "next/link";
import Header from "../../components/Header";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Modal } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";

export default function Home() {
  const locale = "en";

  const logLines = useMemo(
    () => [
      {
        text: "[Agent: Pitch Pro] Creating pitch deck... OK",
        speed: 26,
      },
      {
        text: "[Agent: Market Sense] Competitors in Lisbon... Found 12",
        speed: 20,
        source: { name: "Google Maps" },
      },
      {
        text: "[Agent: Skeptic] Margin 30%... WARNING: Too optimistic",
        speed: 18,
      },
      {
        text: "[Agent: Fin Pilot] Financial model (CapEx/OpEx)... Done",
        speed: 24,
      },
      {
        text: "Live sources scan (10+)... VERIFIED",
        speed: 22,
        source: { name: "Statista" },
      },
    ],
    [],
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<typeof logLines>([]);
  const [isPausing, setIsPausing] = useState(false);
  const [metricsActive, setMetricsActive] = useState(false);
  const [vatRate, setVatRate] = useState(0);
  const [marketSize, setMarketSize] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const proofRef = useRef<HTMLDivElement | null>(null);
  const skepticRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const antiSliderRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const userMarkerRef = useRef<MapboxMarker | null>(null);
  const bizMarkersRef = useRef<MapboxMarker[]>([]);
  const [skepticActive, setSkepticActive] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const shuffle = <T,>(items: T[]) => {
    // Deterministic shuffle to avoid hydration/layout jumps on first paint.
    const copy = [...items];
    let seed = 20260503;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const personas = [
    {
      name: "Jhon Peterson",
      age: 68,
      role: "Senior resident",
      income: "$ 17.9K",
      preferences: ["Price/Quality", "Quiet", "Trust", "Old school"],
      data: "Based on 620 local reviews",
      caseTitle: "Craft beer bar in the neighborhood",
      image: "/images/personas/mark.webp",
      dialog: [
        {
          speaker: "skeptic",
          text: "Hello, Jhon Peterson. We're planning to open a craft beer bar in your building. Premium prices, quiet loft atmosphere. What do you think? 🍻",
          time: "10:02",
        },
        {
          speaker: "avatar",
          text: "Loft? Premium? We already have draft beer for 80 rubles in our building. I don't go there—it's noisy and the crowd... And craft for 300? Who will drink that, your youth? 👴🏻",
          time: "10:03",
          status: "Read ✓✓",
        },
        {
          speaker: "skeptic",
          text: "We focus on quiet and drinking culture. No noise after 22:00.",
          time: "10:04",
        },
        {
          speaker: "avatar",
          text: "Quiet after 22:00? You all promise that. Then people will shout under the windows. And beer for 300... I'd rather add it to a gift for my daughter. I won't come. 😕",
          time: "10:05",
          status: "Read ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis NOT validated. Low interest among retirees due to price and noise concerns. Consider changing the neighborhood.",
          time: "10:06",
        },
      ],
    },
    {
      name: "Elizabeth Doe",
      age: 28,
      role: "Office professional",
      income: "$ 8.5K",
      preferences: ["Aesthetics", "Time", "Status", "Technology"],
      data: "Based on 1.1k office surveys",
      caseTitle: "Family bakery near the office",
      image: "/images/personas/lina.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Elizabeth, hi. We're opening a family bakery near your office. Kids' parties, mascot costumes, custom cakes. Would you stop by? 🍰",
          time: "11:10",
        },
        {
          speaker: "avatar",
          text: "Near the office is great. But “family” and “mascots”? That means noise and lots of kids. After work I want quiet and a beautiful coffee... ☕️✨",
          time: "11:11",
          status: "Read ✓✓",
        },
        {
          speaker: "skeptic",
          text: "We'll have a separate quiet zone and a very aesthetic interior.",
          time: "11:12",
        },
        {
          speaker: "avatar",
          text: "A quiet zone? If the cakes are great, I might try it once. But mascots... I don't have kids. For dates I'd choose another place, and for coffee your aesthetics might be drowned by crying. 50/50. 😐",
          time: "11:13",
          status: "Read ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis partially validated. Interest in the product (aesthetics/coffee) exists, but the “family bakery” concept scares off high‑spending customers without kids.",
          time: "11:14",
        },
      ],
    },
    {
      name: "Pavel Durov",
      age: 35,
      role: "Bakery owner",
      income: "$ 2.1K",
      preferences: ["Unit economics", "Operations", "Quality", "Competition"],
      data: "Based on 1.2k HoReCa reviews",
      caseTitle: "Tool‑sharing service",
      image: "/images/personas/anna.webp",
      dialog: [
        {
          speaker: "skeptic",
          text: "Pavel, hello. We're planning a sharing service for expensive tools: rotary hammers, thermal imagers. As a founder, how do you assess the idea? 🛠",
          time: "12:20",
        },
        {
          speaker: "avatar",
          text: "Hmm. Interesting idea. I bought a 150k mixer for my bakery myself. But how will you handle deposits and, most importantly, logistics and repairs? 🤯",
          time: "12:21",
          status: "Read ✓✓",
        },
        {
          speaker: "skeptic",
          text: "Deposit via card hold. Repairs via insurance. Delivery by couriers.",
          time: "12:22",
        },
        {
          speaker: "avatar",
          text: "Couriers? That's expensive. And if someone “accidentally” breaks a hammer? Who checks it? If rent is 1,000 rubles, you won't cover operating costs. I wouldn't take the risk — the logistics are too complex. 📈📉",
          time: "12:23",
          status: "Read ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis NOT validated. High operating costs and risks (logistics/repairs) kill unit economics for this audience.",
          time: "12:24",
        },
      ],
    },
  ];
  const initialShuffledPersonas = useMemo(() => shuffle(personas), []);
  const [shuffledPersonas] = useState(initialShuffledPersonas);
  const [visiblePersonas] = useState(initialShuffledPersonas.slice(0, 3));
  const [activePersona, setActivePersona] = useState(0);
  const [visibleDialog, setVisibleDialog] = useState<
    Array<{
      speaker: "skeptic" | "avatar";
      text: string;
      time?: string;
      status?: string;
    }>
  >([]);
  const [typingSpeaker, setTypingSpeaker] = useState<
    "skeptic" | "avatar" | null
  >(null);
  const [isPersonaFading, setIsPersonaFading] = useState(false);
  const [pulseTab, setPulseTab] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "ready" | "denied"
  >("idle");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [geoLabel, setGeoLabel] = useState<string>("");
  const [sliderPos, setSliderPos] = useState(75);
  const [isSliding, setIsSliding] = useState(false);
  const [deepLines, setDeepLines] = useState<
    Array<{ ts: string; tag: string; text: string; typed?: string }>
  >([]);
  const [deepLineIndex, setDeepLineIndex] = useState(0);
  const [deepCharIndex, setDeepCharIndex] = useState(0);
  const deepLogRef = useRef<HTMLDivElement | null>(null);
  const [metricMode, setMetricMode] = useState<"owner" | "cfo">("owner");
  const [realityAnswers, setRealityAnswers] = useState<Array<null | boolean>>([
    null,
    null,
    null,
  ]);
  const [showContactModal, setShowContactModal] = useState(false);

  const deepLogSource = useMemo(
    () => [
      {
        ts: "[02:14:45]",
        tag: "SEARCH_AGENT",
        text: "Scanning commercial rent prices in Haifa... Found 24 listings.",
      },
      {
        ts: "[02:14:48]",
        tag: "TAX_ENGINE",
        text: "Syncing with the 2026 tax code. Updating VAT and municipal fees.",
      },
      {
        ts: "[02:14:52]",
        tag: "COMPETITOR_V2",
        text: 'Analyzing Google Maps reviews for cafe "X" and "Y". Detecting weak points (Wi‑Fi, service).',
      },
      {
        ts: "[02:14:55]",
        tag: "RAG_VALIDATE",
        text: "Validating foot‑traffic data (Herzl St.). Source: Google Traffic Data.",
      },
      {
        ts: "[02:15:01]",
        tag: "PERSONA_SIM",
        text: "Running 6 persona simulations. Testing demand elasticity at ₪22 latte price.",
      },
      {
        ts: "[02:15:05]",
        tag: "FIN_MODEL",
        text: "Recalculating breakeven with a 3.2% inflation coefficient.",
      },
    ],
    [],
  );
  const activePersonaData = visiblePersonas[activePersona];

  useEffect(() => {
    const current = logLines[lineIndex];
    if (!current) return;

    if (isPausing) {
      const pauseTimer = setTimeout(() => setIsPausing(false), 600);
      return () => clearTimeout(pauseTimer);
    }

    const typingTimer = setTimeout(() => {
      if (charIndex < current.text.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setDisplayedLines((prev) => {
          const next = [...prev, current];
          return next.slice(-4);
        });
        setCharIndex(0);
        setLineIndex((prev) => (prev + 1) % logLines.length);
        setIsPausing(true);
      }
    }, current.speed ?? 28);

    return () => clearTimeout(typingTimer);
  }, [charIndex, isPausing, lineIndex, logLines]);

  useEffect(() => {
    if (!proofRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMetricsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(proofRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!metricsActive) return;
    const start = performance.now();
    const duration = 900;
    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setVatRate(Math.round(17 * progress));
      setMarketSize(parseFloat((1.2 * progress).toFixed(2)));
      setGrowthRate(parseFloat((6.4 * progress).toFixed(1)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [metricsActive]);

  useEffect(() => {
    if (!skepticRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkepticActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(skepticRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!skepticActive) return;
    const start = performance.now();
    const duration = 800;
    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setConfidence(Math.round(65 * progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [skepticActive]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPulseTab((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const seed = deepLogSource
      .slice(0, 3)
      .map((line) => ({ ...line, typed: line.text }));
    setDeepLines(seed);
    setDeepLineIndex(3);
    setDeepCharIndex(0);
  }, [deepLogSource]);

  useEffect(() => {
    if (!deepLogSource.length) return;
    const current = deepLogSource[deepLineIndex % deepLogSource.length];
    const text = current.text;
    const speed = 12;
    const timer = setTimeout(() => {
      if (deepCharIndex < text.length) {
        setDeepCharIndex((prev) => prev + 1);
        setDeepLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.text === current.text) {
            last.typed = text.slice(0, deepCharIndex + 1);
          } else {
            next.push({ ...current, typed: text.slice(0, deepCharIndex + 1) });
          }
          return next.slice(-6);
        });
      } else {
        setDeepCharIndex(0);
        setDeepLineIndex((prev) => prev + 1);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [deepCharIndex, deepLineIndex, deepLogSource]);

  useEffect(() => {
    if (!deepLogRef.current) return;
    deepLogRef.current.scrollTop = deepLogRef.current.scrollHeight;
  }, [deepLines]);

  useEffect(() => {
    if (!isSliding) return;
    const updatePos = (clientX: number) => {
      const wrap = antiSliderRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 40), rect.width - 40);
      setSliderPos(Math.round((x / rect.width) * 100));
    };
    const onMove = (event: MouseEvent) => updatePos(event.clientX);
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePos(touch.clientX);
    };
    const onUp = () => setIsSliding(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [isSliding]);

  const allAnswered = realityAnswers.every((value) => value !== null);
  const anyNo = realityAnswers.some((value) => value === false);

  useEffect(() => {
    if (!pulseRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPulseActive(true);
          if (geoStatus === "idle") {
            requestLocation();
          }
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(pulseRef.current);
    return () => observer.disconnect();
  }, [geoStatus]);

  useEffect(() => {
    if (!pulseActive || !mapContainerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const { default: mapboxgl } = await import("mapbox-gl");
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

      const defaultCenter: [number, number] = [34.9896, 32.794];
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: defaultCenter,
        zoom: 12.2,
        interactive: true,
      });

      mapRef.current = map;

      const addBusinessMarkers = (center: [number, number]) => {
        bizMarkersRef.current.forEach((marker) => marker.remove());
        bizMarkersRef.current = [];
        const offsets = [
          [0.008, 0.004],
          [-0.006, 0.003],
          [0.004, -0.006],
          [-0.004, -0.005],
          [0.002, 0.008],
        ];
        offsets.forEach(([dx, dy], idx) => {
          const el = document.createElement("div");
          el.className = `biz-marker ${idx % 2 === 0 ? "biz-red" : "biz-yellow"}`;
          el.innerHTML = `<span>${idx + 1}</span>`;
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([center[0] + dx, center[1] + dy])
            .addTo(map);
          bizMarkersRef.current.push(marker);
        });
      };

      map.on("load", () => {
        addBusinessMarkers(defaultCenter);
      });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pulseActive]);

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    const center: [number, number] = [userLocation.lon, userLocation.lat];
    mapRef.current.flyTo({ center, zoom: 13 });

    const controller = new AbortController();

    (async () => {
      const { default: mapboxgl } = await import("mapbox-gl");
      if (!mapRef.current) return;

      if (!userMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "user-marker";
        userMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat(center)
          .addTo(mapRef.current);
      } else {
        userMarkerRef.current.setLngLat(center);
      }
      const offsets = [
        [0.004, 0.003],
        [-0.004, 0.002],
        [0.003, -0.004],
        [-0.003, -0.003],
        [0.002, 0.005],
      ];
      bizMarkersRef.current.forEach((marker) => marker.remove());
      bizMarkersRef.current = [];
      offsets.forEach(([dx, dy], idx) => {
        const el = document.createElement("div");
        el.className = `biz-marker ${idx % 2 === 0 ? "biz-red" : "biz-yellow"}`;
        el.innerHTML = `<span>${idx + 1}</span>`;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([center[0] + dx, center[1] + dy])
          .addTo(mapRef.current!);
        bizMarkersRef.current.push(marker);
      });

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${center[0]},${center[1]}.json?types=neighborhood,locality,place&language=ru&access_token=${token}`,
        { signal: controller.signal },
      )
        .then((res) => res.json())
        .then((data) => {
          const feature = data?.features?.[0];
          if (feature?.place_name) {
            setGeoLabel(feature.place_name);
          }
        })
        .catch(() => {});
    })();

    return () => controller.abort();
  }, [userLocation]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGeoStatus("ready");
      },
      () => {
        setGeoStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 5000 },
    );
  };

  useEffect(() => {
    if (visiblePersonas.length === 0) return;
    const rotateMs = 9000;
    const intervalId = setInterval(() => {
      setActivePersona((prev) => (prev + 1) % visiblePersonas.length);
    }, rotateMs);
    return () => clearInterval(intervalId);
  }, [visiblePersonas.length, activePersona]);

  useEffect(() => {
    setIsPersonaFading(true);
    const timer = setTimeout(() => setIsPersonaFading(false), 220);
    return () => clearTimeout(timer);
  }, [activePersona]);

  useEffect(() => {
    const persona = visiblePersonas[activePersona];
    if (!persona) return;
    let cancelled = false;
    const timers: number[] = [];
    setVisibleDialog([]);
    setTypingSpeaker(null);

    const run = (index = 0) => {
      if (cancelled) return;
      if (index >= persona.dialog.length) {
        setTypingSpeaker(null);
        return;
      }
      const message = persona.dialog[index];
      const baseDelay = message.speaker === "skeptic" ? 520 : 700;
      setTypingSpeaker(message.speaker);
      const typingDelay = baseDelay + Math.floor(Math.random() * 320);
      const t1 = window.setTimeout(() => {
        if (cancelled) return;
        setTypingSpeaker(null);
        setVisibleDialog((prev) => [...prev, message]);
        const t2 = window.setTimeout(() => run(index + 1), 380);
        timers.push(t2);
      }, typingDelay);
      timers.push(t1);
    };

    run(0);
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [activePersona, visiblePersonas]);

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === "en") {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <div className="home-2026">
      <Header />

      <main>
        <section className="hero-2026">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Validate the idea. Model the economics. Win the investor.</h1>
              <p className="hero-subtitle">
                Business plan to UNIDO/EBRD standards with real market data — in 10–20 minutes.
                Synthetic respondents surface real market pain points. Skeptic Agent verifies every figure.
                <br />
                <strong>Deliverable:</strong> business plan in Word + pitch deck for investor or bank.
              </p>
              <div className="hero-cta">
                <Link
                  href={getLocalePath("/solutions")}
                  className="btn btn-primary btn-lg"
                >
                  Explore
                </Link>
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => setShowContactModal(true)}
                >
                  Talk to an expert
                </button>
              </div>
              <div className="hero-proof">
                <div>
                  <span className="proof-number">260+</span>
                  <span className="proof-label">projects launched</span>
                </div>
                <div>
                  <span className="proof-number">14+ years</span>
                  <span className="proof-label">of expertise</span>
                </div>
                <div>
                  <span className="proof-number">UNIDO / EBRD</span>
                  <span className="proof-label">industry standards</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rag-proof section-pad">
          <div className="container rag-grid">
            <div className="rag-copy">
              <h2>
                Upgrowplan builds and verifies business plans on live data.
                <span className="accent-inline">
                  {" "}
                  Not a text generator — step‑by‑step validation of every fact.
                </span>
              </h2>
            </div>
            <div className="rag-console">
              <div className="console-header">Live Validation...</div>
              <div className="console-body">
                {displayedLines.map((line, idx) => (
                  <div
                    className="console-line log-line"
                    key={`${line.text}-${idx}`}
                  >
                    {line.text}
                    {line.source && (
                      <span className="source-tag">
                        <span className="source-icon" aria-hidden="true">
                          {line.source.name === "Google Maps" ? (
                            <svg viewBox="0 0 24 24" className="icon-svg">
                              <path
                                fill="#0683f5"
                                d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                              />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="icon-svg">
                              <path
                                fill="#7dd36e"
                                d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                              />
                            </svg>
                          )}
                        </span>
                        Source
                        <span className="source-card">
                          <span className="source-icon" aria-hidden="true">
                            {line.source.name === "Google Maps" ? (
                              <svg viewBox="0 0 24 24" className="icon-svg">
                                <path
                                  fill="#0683f5"
                                  d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                                />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="icon-svg">
                                <path
                                  fill="#7dd36e"
                                  d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                                />
                              </svg>
                            )}
                          </span>
                          {line.source.name}
                        </span>
                      </span>
                    )}
                  </div>
                ))}
                <div className="console-line typing-active">
                  {logLines[lineIndex]?.text.slice(0, charIndex)}
                  <span className="typing-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`data-proof section-pad${metricsActive ? " is-active" : ""}`}
          ref={proofRef}
        >
          <div className="container">
            <div className="proof-head">
              <h2>
                Every figure in your business plan or market report has an author.
                <span className="accent-inline">
                  {" "}
                  Direct links to competitors, job market listings, raw material offers, and the 2026 tax code.
                </span>
              </h2>
            </div>
            <div className="proof-grid">
              <div className="proof-note">
                <h4>What this means for you</h4>
                <p className="micro-copy">
                  We use RAG (Retrieval‑Augmented Generation). The AI first
                  finds up‑to‑date documents, reads them, and only then writes
                  your plan.
                </p>
                <div className="proof-result">
                  Result: 0% fiction, 100% verifiable.
                </div>
              </div>
              <div className="report-card">
                <div className="report-title">Market & Financial Snapshot</div>
                <p className="micro-copy">
                  VAT rate (Israel, 2026):
                  <span className="source-ref">
                    <span className="source-icon-inline" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="icon-svg">
                        <path
                          fill="#01346e"
                          d="M3 10h18v2H3zM5 12h14v8H5zM7 4h10l2 4H5z"
                        />
                      </svg>
                    </span>{" "}
                    {vatRate}% [1]
                    <span className="source-card">
                      <span className="source-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="icon-svg">
                          <path
                            fill="#01346e"
                            d="M3 10h18v2H3zM5 12h14v8H5zM7 4h10l2 4H5z"
                          />
                        </svg>
                      </span>
                      Ministry of Finance of Israel, 2026
                      <span className="source-quote">
                        “Standard VAT rate is 17% for 2026.”
                      </span>
                      <a
                        href="https://www.gov.il"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open source
                      </a>
                    </span>
                  </span>
                </p>
                <p className="micro-copy">
                  Market size (coffee subscriptions):
                  <span className="source-ref">
                    <span className="source-icon-inline" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="icon-svg">
                        <path
                          fill="#7dd36e"
                          d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                        />
                      </svg>
                    </span>{" "}
                    ${marketSize}B [2]
                    <span className="source-card">
                      <span className="source-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="icon-svg">
                          <path
                            fill="#7dd36e"
                            d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                          />
                        </svg>
                      </span>
                      Statista Market Outlook, 2026
                      <span className="source-quote">
                        “Coffee subscription market reached $1.2B.”
                      </span>
                      <a
                        href="https://www.statista.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open source
                      </a>
                    </span>
                  </span>
                </p>
                <p className="micro-copy">
                  Growth rate YoY:
                  <span className="source-ref">
                    <span className="source-icon-inline" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="icon-svg">
                        <path
                          fill="#0683f5"
                          d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                        />
                      </svg>
                    </span>{" "}
                    {growthRate}% [3]
                    <span className="source-card">
                      <span className="source-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="icon-svg">
                          <path
                            fill="#0683f5"
                            d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                          />
                        </svg>
                      </span>
                      Google Maps + Reviews Index, 2026
                      <span className="source-quote">
                        “Average demand growth 6.4% YoY.”
                      </span>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open source
                      </a>
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="skeptic-block section-pad" ref={skepticRef}>
          <div className="container skeptic-grid">
            <div className="skeptic-copy">
              <h2>
                Our Skeptic Agent stress‑tests your idea, uncovers hidden costs, and flags risks in overcrowded markets.
                <span className="accent-inline">
                  {" "}
                  Upgrowplan is honest with clients — better to warn about a potential loss than to create an illusion of profit.
                </span>
              </h2>
              <p className="micro-copy">
                We prepare you for the worst case so you're ready for the best.
              </p>
            </div>
            <div className="skeptic-widget">
              <div className="score-row">
                <span>Trust score</span>
                <strong>{confidence}/100</strong>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <div className="skeptic-bubble">
                <span className="skeptic-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="icon-svg">
                    <path
                      fill="#01346e"
                      d="M3 12c3-4 6-6 9-6 3 0 6 2 9 6-3 4-6 6-9 6-3 0-6-2-9-6zm9 3a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                </span>
                “You projected 20% monthly growth. Historical data in your niche
                shows a maximum of 8%. Where will the extra 12% come from?”
              </div>
              <div className="red-flags">
                <details>
                  <summary>[!] Risk: Competition</summary>
                  <div className="flag-detail">
                    Market saturation is 3.2x higher than the regional norm.
                  </div>
                </details>
                <details>
                  <summary>[!] Risk: Overstated lead cost</summary>
                  <div className="flag-detail">
                    Customer acquisition cost is 40% above plan.
                  </div>
                </details>
              </div>
              <div className="skeptic-chart">
                <svg
                  viewBox="0 0 240 120"
                  role="img"
                  aria-label="Optimistic vs realistic forecast"
                >
                  <polyline
                    points="10,100 60,70 110,50 160,30 230,20"
                    fill="none"
                    stroke="#7dd36e"
                    strokeDasharray="6 6"
                    strokeWidth="2"
                  />
                  <polyline
                    points="10,100 60,82 110,70 160,60 230,55"
                    fill="none"
                    stroke="#01346e"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="persona-block section-pad">
          <div className="container persona-grid">
            <div className="persona-copy">
              <h2>
                We build your virtual buyers and validate your hypothesis.
                <span className="accent-inline">
                  {" "}
                  Now you can ask those who will actually buy — or tell you why they won't.
                </span>
              </h2>
              <p>
                You provide Synth Focus Lab with initial input: a business idea,
                a product rebrand, or a new feature — plus the location. The lab
                generates up to 10 virtual personas from your target audience in
                the right neighborhood and lets you test any business hypothesis
                instantly. Based on them, we can also create up to 100 virtual
                respondents for deeper research.
              </p>
            </div>
            <div className="persona-content">
              <div className="persona-cards">
                {visiblePersonas.map((persona, idx) => (
                  <button
                    key={persona.name}
                    className={`persona-card${activePersona === idx ? " active" : ""}`}
                    onClick={() => {
                      setActivePersona(idx);
                    }}
                  >
                    <div
                      className="persona-avatar"
                      style={{ backgroundImage: `url(${persona.image})` }}
                      aria-hidden="true"
                    ></div>
                    <div className="persona-meta">
                      <strong>
                        {persona.name}, {persona.age}
                      </strong>
                      <div className="persona-role">{persona.role}</div>
                      <div className="persona-income">{persona.income}</div>
                      <div className="persona-tags">
                        {persona.preferences.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <span className="persona-badge">{persona.data}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div
                className={`persona-chat${isPersonaFading ? " is-fading" : ""}`}
              >
                <div className="chat-header">
                  <div>
                    <div className="chat-case">
                      Case: {activePersonaData?.caseTitle}
                    </div>
                    <div className="chat-persona">
                      {activePersonaData?.name}
                    </div>
                  </div>
                  <span className="chat-status">online</span>
                </div>
                <div className="chat-messages">
                  {visibleDialog.map((message, idx) => (
                    <div
                      className={`chat-message ${message.speaker}`}
                      key={`${message.speaker}-${idx}`}
                    >
                      <div className="chat-bubble">{message.text}</div>
                      <div className="chat-meta">
                        <span>{message.time}</span>
                        {message.status && (
                          <span className="chat-check">{message.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {typingSpeaker && (
                    <div className={`chat-message ${typingSpeaker} typing`}>
                      <div className="chat-bubble typing-bubble">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="[Synth Focus Lab asks...]"
                    disabled
                    aria-label="Synth Focus Lab asks"
                  />
                  <button type="button" disabled>
                    Send
                  </button>
                </div>
              </div>
              <div className="persona-cta">
                <Link
                  href={getLocalePath("/solutions/synthFocusLab/descriptionPage")}
                  className="btn btn-primary btn-lg"
                >
                  Learn more about Synth Focus Lab
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="business-pulse section-pad" ref={pulseRef}>
          <div className="container pulse-grid">
            <div className="pulse-copy">
              <h2>
                A business plan that doesn’t get outdated.
                <span className="accent-inline">
                  {" "}
                  The world changes faster than you can type a report. Business
                  Pulse replaces an entire marketing and legal department. You
                  get only what impacts your profit. Every morning.
                </span>
              </h2>
              <div className="pulse-tabs">
                {[
                  "RADAR: Stay ahead of competitors.",
                  "SHIELD: Sleep easy.",
                  "RANKING: Become #1 on your street.",
                ].map((label, idx) => (
                  <button
                    key={label}
                    className={`pulse-tab${pulseTab === idx ? " active" : ""}`}
                    onClick={() => setPulseTab(idx)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link
                href={getLocalePath("/solutions/businessPulse")}
                className="btn btn-primary btn-lg pulse-cta"
              >
                Connect
              </Link>
            </div>
            <div className="pulse-dashboard">
              <div className="device-frame">
                <div className="device-header">
                  <span>Business Pulse</span>
                  <span className="live-sync">
                    <span className="live-dot"></span>
                    Live: price & legal monitoring
                  </span>
                </div>
                <div className="device-map">
                  <div className="mapbox" ref={mapContainerRef} />
                  <div className="map-actions">
                    <button
                      className="map-btn"
                      onClick={requestLocation}
                      disabled={geoStatus === "loading"}
                    >
                      {geoStatus === "loading"
                        ? "Locating..."
                        : geoStatus === "ready"
                          ? "Location detected"
                          : "Show my neighborhood"}
                    </button>
                    {geoLabel && (
                      <span className="map-hint">Area: {geoLabel}</span>
                    )}
                    {geoStatus === "denied" && (
                      <span className="map-hint">
                        Geolocation access not granted
                      </span>
                    )}
                  </div>
                </div>
                <div className="pulse-cards">
                  <div
                    className={`pulse-stack${pulseTab === 0 ? " active" : ""}`}
                  >
                    <div className={`pulse-card${pulseActive ? " in" : ""}`}>
                      <div className="pulse-icon">📡</div>
                      <div>
                        <strong>Competitive intel</strong>
                        <p>
                          Your main competitor updated the menu and lowered
                          latte prices. We recalculated your margin. Churn
                          risk: 12%.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-1${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">🚀</div>
                      <div>
                        <strong>Trends</strong>
                        <p>
                          In Haifa social media, interest in “gluten‑free
                          desserts” is spiking. Time to act before competitors.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-2${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">📢</div>
                      <div>
                        <strong>Neighborhood voice</strong>
                        <p>
                          +15 reviews for nearby spots this week. Main complaint:
                          slow Wi‑Fi. Your chance to stand out.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pulse-stack${pulseTab === 1 ? " active" : ""}`}
                  >
                    <div className={`pulse-card${pulseActive ? " in" : ""}`}>
                      <div className="pulse-icon">🛡</div>
                      <div>
                        <strong>Taxes</strong>
                        <p>
                          Insurance contribution rates for SMEs change on the
                          1st. We’ve already updated your financial model.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-1${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">⚖️</div>
                      <div>
                        <strong>Regulations</strong>
                        <p>
                          New labeling requirement in your sector. Check stock
                          before the deadline.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-2${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">⏳</div>
                      <div>
                        <strong>Licenses</strong>
                        <p>
                          Your signage permit expires in 30 days. Auto‑renewal
                          link attached.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pulse-stack${pulseTab === 2 ? " active" : ""}`}
                  >
                    <div className={`pulse-card${pulseActive ? " in" : ""}`}>
                      <div className="pulse-icon">🏆</div>
                      <div>
                        <strong>League position</strong>
                        <p>
                          You're #2 in “Breakfasts” in your block.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-1${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">📈</div>
                      <div>
                        <strong>The Gap</strong>
                        <p>
                          Only 5 positive mentions short of #1 this week. We
                          know how to get them.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-2${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">💸</div>
                      <div>
                        <strong>Benchmarking</strong>
                        <p>
                          Average check in the area rose by 3%. Your prices
                          stayed the same — you're losing net profit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="anti-template section-pad">
          <div className="container">
            <div className="anti-title-row">
              <h2>
                We abandoned templates entirely.
                <span className="accent-inline">
                  {" "}
                  Every word in your business plan is generated at the moment of request. We build your business on live data from your city, street, and niche.
                </span>
              </h2>
            </div>
            <div className="row align-items-center gy-4">
              <div className="col-lg-8">
                <div className="tablet-frame" ref={antiSliderRef}>
                  <div
                    className="before-after"
                    style={{ ["--slider" as any]: `${sliderPos}%` }}
                  >
                    <div className="layer-upgrow">
                      <div className="upgrow-fixed">
                        <div className="upgrow-live">
                          ● RAG AGENTS: VERIFIED
                        </div>
                        <h4>Strategy: Haifa, Hadar District | April 2026</h4>
                        <p>
                          Technion students (Herzl St.) drive 65% of morning
                          traffic. Peak: 08:15–09:30. Expected ticket: ₪18–22.
                        </p>
                        <p>
                          Within 150m — 4 locations. Competitor “Cafe X” dropped
                          to 3.8 rating. Your entry point: best Wi‑Fi and vegan
                          menu (area demand +40%).
                        </p>
                        <p>
                          Rent for lot #442: ₪8,400 + municipal tax. Signage
                          license in Haifa: 14‑day waiting period.
                        </p>
                      </div>
                    </div>

                    <div className="layer-template">
                      <div className="template-content">
                        <h4>Generic coffee shop plan (v4.2)</h4>
                        <p>
                          The foodservice market shows stable 3–5% annual
                          growth. Target audience — men and women aged 18–65...
                        </p>
                        <p className="strike">
                          Choose a location with high foot traffic, preferably
                          on the first line of buildings...
                        </p>
                        <p>
                          Average rent in a large city is $2,000. Inflation
                          coefficient — standard...
                        </p>
                        <div className="template-stamp">
                          DATA FROM WIKIPEDIA 2021
                        </div>
                      </div>
                    </div>
                    <div
                      className="divider-line"
                      style={{ left: `${sliderPos}%` }}
                      onMouseDown={() => setIsSliding(true)}
                      onTouchStart={() => setIsSliding(true)}
                    >
                      <span className="divider-hint">↔</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-5">
                <p className="micro-copy">
                  Upgrowplan doesn’t play with templates. They create false confidence using numbers that have nothing to do with your business.
                </p>
                <ul>
                  <li>
                    Live search: our agents walk the streets of your city and scan your direct competitors’ sites.
                  </li>
                  <li>
                    No fluff: we write about the prices of your neighbor next door.
                  </li>
                  <li>
                    Hypothesis check: data is verified against trends and benchmarks from this month.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="deep-work section-pad">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row align-items-center gy-4">
                  <div className="col-lg-5 text-center">
                    <h2 className="deep-title">
                      Our business plan isn’t built in 30 seconds.
                      <span className="accent-inline">
                        {" "}
                        Collecting and verifying data, forming and surveying your virtual buyers, and running every fact through the Skeptic Agent — that takes 10–15 minutes.
                      </span>
                    </h2>
                  </div>
                  <div className="col-lg-7">
                    <div className="deep-terminal">
                      <div className="terminal-title">Live Validation</div>
                      <div className="terminal-lines" ref={deepLogRef}>
                        {deepLines.map((line, idx) => (
                          <div
                            className="terminal-line"
                            key={`${line.ts}-${idx}`}
                          >
                            <span className="ts">{line.ts}</span>
                            <span
                              className={`tag tag-${line.tag.toLowerCase()}`}
                            >
                              {line.tag}
                            </span>
                            <span className="msg">
                              {line.typed ?? line.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="deep-copy">
                  <h4>Why don’t our agents answer instantly?</h4>
                  <ul>
                    <li>
                      We don’t hallucinate: a regular chatbot invents a number
                      in a second. Our RAG agent spends 3 minutes just finding
                      real rental listings in your area.
                    </li>
                    <li>
                      We verify laws: the system pulls current tax references.
                    </li>
                    <li>
                      We think like customers: the idea is tested through 6
                      digital avatars to see if they would buy or not.
                    </li>
                  </ul>
                  <div className="deep-result">
                    Bottom line: you wait 15 minutes to save 15 months of life
                    and millions in investments in a losing location.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="metrics-life section-pad">
          <div className="container">
            <div className="row align-items-center gy-4">
              <div className="col-lg-5">
                <h2>
                  Metrics a normal human can understand.
                  <span className="accent-inline">
                    {" "}
                    We know you start a business to build, not to stare at
                    Excel all day.
                  </span>
                </h2>
                <ul className="micro-copy">
                  <li>
                    No fluff: only the numbers that affect today’s decision.
                  </li>
                  <li>
                    Clarity: visual charts instead of endless tables.
                  </li>
                  <li>
                    Forecast in your palm: a small price change per cup shifts
                    the year’s outcome.
                  </li>
                </ul>
              </div>
              <div className="col-lg-7">
                <div className="metric-visual">
                  <div className="metric-switch">
                    <button
                      className={`switch-btn${metricMode === "cfo" ? " active" : ""}`}
                      onClick={() => setMetricMode("cfo")}
                    >
                      Finance Director
                    </button>
                    <button
                      className={`switch-btn${metricMode === "owner" ? " active" : ""}`}
                      onClick={() => setMetricMode("owner")}
                    >
                      Business Owner
                    </button>
                  </div>
                  <div className="metric-cards">
                    <div
                      className={`metric-card upgrow ${metricMode === "cfo" ? "active" : "faded"}`}
                    >
                      <div className="metric-row">
                        <span className="icon">☕</span>
                        <div>
                          <div className="metric-label">Breakeven Point</div>
                          <div className="metric-value">
                            14 cups / day to cover rent
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">⏳</span>
                        <div>
                          <div className="metric-label">OPEX Optimization</div>
                          <div className="metric-value">
                            Close 1 hour earlier on Monday = 4,000 ₪ saved
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">👤</span>
                        <div>
                          <div className="metric-label">Marketing ROI</div>
                          <div className="metric-value">
                            Each 500 ₪ yields 12 new IG customers
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">📅</span>
                        <div>
                          <div className="metric-label">Payback Period</div>
                          <div className="metric-value">
                            7 months to profitability
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`metric-card upgrow ${metricMode === "owner" ? "active" : "faded"}`}
                    >
                      <div className="metric-row">
                        <span className="icon">☕</span>
                        <div>
                          <div className="metric-label">
                            Breakeven point
                          </div>
                          <div className="metric-value">
                            14 lattes per day
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">⏳</span>
                        <div>
                          <div className="metric-label">Cost optimization</div>
                          <div className="metric-value">
                            Close 1 hour earlier on Monday
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">👤</span>
                        <div>
                          <div className="metric-label">
                            Marketing effectiveness
                          </div>
                          <div className="metric-value">
                            500 ₪ → 12 Instagram customers
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">📅</span>
                        <div>
                          <div className="metric-label">Payback period</div>
                          <div className="metric-value">
                            Coffee shop reaches profitability in 7 months
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="reality-check section-pad">
          <div className="container text-center">
            <div className="reality-inner">
              <h2 className="reality-title">
                A business plan isn’t a bank document. It’s your insurance
                against a first‑year failure.
              </h2>
              <p className="micro-copy">
                A 15‑second quiz. We value your time.
              </p>
            </div>
          </div>

          <div className="container">
            <div className="row g-3 reality-questions">
              {[
                "Do you know the exact rent and municipal tax on your chosen street for April 2026?",
                "Do you know what 20% of customers complain about in your nearest competitor’s Google Maps reviews right now?",
                "Does your financial model include the latest labor law changes and social contributions for this quarter?",
              ].map((question, idx) => (
                <div className="col-12 col-md-4" key={question}>
                  <div className="reality-card h-100">
                    <div className="question-text">{question}</div>
                    <div className="answer-buttons">
                      <button
                        className={`answer-btn${realityAnswers[idx] === true ? " active yes" : ""}`}
                        onClick={() =>
                          setRealityAnswers((prev) => {
                            const next = [...prev];
                            next[idx] = true;
                            return next;
                          })
                        }
                      >
                        Yes
                      </button>
                      <button
                        className={`answer-btn${realityAnswers[idx] === false ? " active no" : ""}`}
                        onClick={() =>
                          setRealityAnswers((prev) => {
                            const next = [...prev];
                            next[idx] = false;
                            return next;
                          })
                        }
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container text-center">
            {allAnswered && (
              <div className="reality-outcome">
                {anyNo ? (
                  <>
                    <h3>Time to fill the gaps.</h3>
                    <p className="micro-copy">
                      Business doesn’t forgive hallucinations. One mistake in
                      rent or taxes can wipe out your first‑year profit. Our
                      RAG agencies already have the answers — get them in
                      15 minutes.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>You’re impressive — top 5% of prepared founders.</h3>
                    <p className="micro-copy">
                      Professionals know the price of error is too high to trust
                      one source. Use Upgrowplan as a Stress Test: verify your
                      numbers against independent AI‑agent data. If we find a
                      discrepancy, we save your money. If not, you gain
                      iron‑clad confidence.
                    </p>
                  </>
                )}
                <div className="reality-actions">
                  <Link
                    href={getLocalePath("/ai-business-plan-generator")}
                    className="btn btn-primary btn-lg"
                  >
                    Create a business plan
                  </Link>
                </div>
              </div>
            )}

            <div className="reality-message">
              <div className="message-text">Still have questions?</div>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => setShowContactModal(true)}
              >
                Contact us
              </button>
            </div>
          </div>
        </section>

        <Modal
          show={showContactModal}
          onHide={() => setShowContactModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Contact us</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ContactForm
              locale="en"
              className="border p-3 rounded bg-light shadow-sm"
              initialMessage="Interested in a data validation consultation"
              onSuccess={() => setShowContactModal(false)}
            />
          </Modal.Body>
        </Modal>
      </main>

      <style jsx>{`
        .home-2026 {
          background: #ffffff;
          color: #171717;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .hero-2026 {
          padding: 5rem 0 3rem;
          background:
            radial-gradient(
              1200px 600px at 10% 10%,
              rgba(7, 133, 246, 0.12),
              transparent 60%
            ),
            linear-gradient(
              120deg,
              rgba(30, 96, 120, 0.06),
              rgba(7, 133, 246, 0.02)
            );
        }

        .section-pad {
          padding: 5rem 0 5rem;
        }

        .persona-content {
          margin-bottom: 1.5rem;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
          text-align: center;
        }

        .hero-kicker {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #1e6078;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .hero-2026 h1 {
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 700;
          color: #1e6078;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #171717;
          margin-bottom: 1.75rem;
          max-width: 620px;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .hero-proof {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          font-size: 0.85rem;
          color: #1e6078;
          max-width: 620px;
          margin: 0 auto;
        }

        .proof-number {
          display: block;
          font-weight: 700;
          font-size: 1.05rem;
          color: #1e6078;
        }

        .proof-label {
          display: block;
        }

        .hero-copy {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rag-proof {
          background: #d9ebf5;
          border-top: 1px solid rgba(1, 52, 110, 0.15);
          border-bottom: 1px solid rgba(1, 52, 110, 0.15);
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .rag-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          align-items: center;
        }

        .rag-copy h2 {
          color: #01346e;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .rag-copy h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .rag-console {
          background: #0f1f2a;
          border-radius: 14px;
          border: 1px solid #01346e;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.2);
          overflow: hidden;
        }

        .console-header {
          background: #0b1a21;
          color: #ecf6ff;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .console-body {
          padding: 1rem;
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          color: #ecf6ff;
          display: grid;
          gap: 0.6rem;
          height: 200px;
          overflow: hidden;
        }

        .console-line {
          font-size: 0.85rem;
        }

        .warn {
          color: #ffcc66;
          margin-left: 0.35rem;
        }

        .source-tag {
          position: relative;
          margin-left: 0.4rem;
          color: #7dd36e;
          cursor: pointer;
        }

        .source-card {
          position: absolute;
          left: 0;
          top: 130%;
          background: #ffffff;
          color: #01346e;
          border: 1px solid #01346e;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          white-space: nowrap;
          box-shadow: 0 8px 16px rgba(1, 52, 110, 0.2);
          opacity: 0;
          pointer-events: none;
          transform: translateY(6px);
          transition: all 0.2s ease;
          z-index: 5;
        }

        .source-tag:hover .source-card {
          opacity: 1;
          transform: translateY(0);
        }

        .data-proof {
          background: #ffffff;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .proof-head {
          text-align: center;
          max-width: 860px;
          margin: 0 auto 2.5rem;
        }

        .proof-head h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .proof-head h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .proof-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: start;
        }

        .proof-note {
          border: 1px solid rgba(1, 52, 110, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          background: #f7fbff;
        }

        .proof-note h4 {
          color: #01346e;
          margin-bottom: 0.5rem;
        }

        .proof-result {
          margin-top: 0.75rem;
          color: #01346e;
          font-weight: 600;
        }

        .report-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.75rem;
          border: 1px solid rgba(1, 52, 110, 0.1);
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.08);
        }

        .report-title {
          font-weight: 700;
          color: #01346e;
          margin-bottom: 1rem;
        }

        .source-ref {
          position: relative;
          color: #01346e;
          text-decoration: underline;
          text-decoration-style: dotted;
          cursor: pointer;
        }

        .source-icon-inline {
          display: inline-flex;
          align-items: center;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.4s ease;
        }

        .data-proof.is-active .source-icon-inline {
          opacity: 1;
          transform: translateY(0);
        }

        .source-card {
          position: absolute;
          left: 0;
          top: 140%;
          background: #ffffff;
          color: #01346e;
          border: 1px solid rgba(1, 52, 110, 0.25);
          border-radius: 10px;
          padding: 0.75rem;
          width: 240px;
          box-shadow: 0 14px 28px rgba(1, 52, 110, 0.18);
          opacity: 0;
          filter: blur(6px);
          transform: translateY(8px);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .source-ref:hover .source-card {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }

        .source-quote {
          display: block;
          font-size: 0.75rem;
          color: #3b4a63;
          margin: 0.5rem 0;
        }

        .source-card a {
          background: #01346e;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          text-decoration: none;
          display: inline-block;
        }

        .icon-svg {
          width: 16px;
          height: 16px;
          margin-right: 6px;
          vertical-align: middle;
        }

        .skeptic-block {
          background: #d9ebf5;
          border-top: 1px solid rgba(1, 52, 110, 0.12);
        }

        .skeptic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }

        .skeptic-copy h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .skeptic-copy h2 .accent-inline {
          color: #7dd36e;
          font-weight: 600;
        }

        .skeptic-widget {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(1, 52, 110, 0.1);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.12);
          overflow: hidden;
        }

        .skeptic-widget::after {
          content: "";
          position: absolute;
          left: -10%;
          top: 10%;
          width: 120%;
          height: 2px;
          background: rgba(1, 52, 110, 0.35);
          opacity: 0;
        }

        .skeptic-widget:hover::after {
          animation: scan 1.2s ease;
        }

        .score-row {
          display: flex;
          justify-content: space-between;
          color: #01346e;
          font-weight: 600;
        }

        .score-bar {
          margin: 0.5rem 0 1rem;
          height: 8px;
          border-radius: 999px;
          background: rgba(1, 52, 110, 0.1);
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          width: 65%;
          background: #7dd36e;
          transition: width 0.6s ease;
        }

        .skeptic-bubble {
          background: #f7fbff;
          border: 1px solid rgba(1, 52, 110, 0.12);
          border-radius: 12px;
          padding: 0.9rem;
          margin-bottom: 1rem;
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .skeptic-widget:hover .skeptic-bubble {
          animation: shake 0.4s ease;
        }

        .red-flags details {
          margin-bottom: 0.6rem;
          padding: 0.6rem;
          border-radius: 10px;
          border: 1px solid rgba(1, 52, 110, 0.1);
          background: #ffffff;
        }

        .skeptic-widget:hover .red-flags details {
          box-shadow: 0 0 0 2px rgba(1, 52, 110, 0.08);
        }

        .red-flags summary {
          cursor: pointer;
          color: #d64545;
          font-weight: 600;
          list-style: none;
        }

        .flag-detail {
          margin-top: 0.4rem;
          color: #3b4a63;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .red-flags details[open] .flag-detail {
          max-height: 120px;
          opacity: 1;
          animation: detailIn 0.3s ease;
        }

        .skeptic-chart {
          margin-top: 1rem;
        }

        .skeptic-chart svg {
          height: 90px;
        }

        .skeptic-chart p {
          margin-top: 0.5rem;
          color: #01346e;
          font-weight: 600;
        }

        .persona-block {
          background: #ffffff;
        }

        .persona-grid {
          display: grid;
          gap: 2.5rem;
        }

        .persona-copy h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .persona-copy h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }
        .persona-copy p {
          color: #1e6078;
          margin-top: 0.75rem;
          line-height: 1.6;
        }
        .persona-cta {
          margin-top: 1.25rem;
          text-align: left;
        }

        .persona-content {
          display: grid;
          grid-template-columns: minmax(240px, 0.9fr) minmax(320px, 2.1fr);
          gap: 2rem;
        }

        .persona-cards {
          display: grid;
          gap: 1rem;
        }

        .persona-card {
          display: flex;
          gap: 0.9rem;
          padding: 1rem;
          border-radius: 14px;
          border: 1px solid rgba(1, 52, 110, 0.1);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          text-align: left;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .persona-card:hover {
          transform: translateY(-3px);
          border-color: #7dd36e;
          box-shadow: 0 12px 26px rgba(125, 211, 110, 0.2);
        }

        .persona-card.active {
          border-color: #0683f5;
          background: rgba(6, 131, 245, 0.08);
          box-shadow: 0 0 0 2px rgba(6, 131, 245, 0.2);
        }

        .persona-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background-color: #d9ebf5;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .persona-meta strong {
          color: #01346e;
        }

        .persona-role {
          color: #2d3f57;
          font-size: 0.86rem;
          margin-top: 0.2rem;
        }

        .persona-income {
          color: #0683f5;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .persona-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin: 0.45rem 0 0.25rem;
        }

        .persona-tags span {
          background: rgba(6, 131, 245, 0.1);
          color: #01346e;
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .persona-badge {
          display: inline-block;
          font-size: 0.75rem;
          color: #01346e;
          background: rgba(1, 52, 110, 0.08);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .persona-chat {
          border-radius: 18px;
          border: 1px solid rgba(1, 52, 110, 0.1);
          background: #f5f8fd;
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
          height: 360px;
          overflow: hidden;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .persona-chat.is-fading {
          opacity: 0.6;
          transform: translateY(6px);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(1, 52, 110, 0.12);
        }

        .chat-case {
          font-weight: 700;
          color: #01346e;
        }

        .chat-persona {
          font-size: 0.9rem;
          color: #2d3f57;
          margin-top: 0.1rem;
        }

        .chat-status {
          font-size: 0.75rem;
          color: #7dd36e;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .chat-messages {
          display: grid;
          gap: 0.75rem;
          height: 300px;
          overflow: hidden;
          padding-right: 0.25rem;
        }

        .chat-message {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-width: 80%;
        }

        .chat-message.skeptic {
          align-items: flex-start;
        }

        .chat-message.avatar {
          align-items: flex-end;
          margin-left: auto;
        }

        .chat-bubble {
          padding: 0.75rem 0.9rem;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.45;
          box-shadow: 0 6px 16px rgba(9, 30, 66, 0.08);
        }

        .chat-message.skeptic .chat-bubble {
          background: #0683f5;
          color: #ffffff;
          border-bottom-left-radius: 4px;
        }

        .chat-message.avatar .chat-bubble {
          background: #ffffff;
          color: #01346e;
          border-bottom-right-radius: 4px;
        }

        .chat-meta {
          font-size: 0.72rem;
          color: #6a7b93;
          display: flex;
          gap: 0.5rem;
        }

        .chat-check {
          color: #0683f5;
          font-weight: 600;
        }

        .typing-bubble {
          display: flex;
          gap: 0.35rem;
          align-items: center;
          min-width: 52px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          animation: blink 1s infinite;
        }

        .chat-message.avatar .typing-dot {
          background: rgba(1, 52, 110, 0.6);
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chat-input {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        .chat-input input {
          flex: 1;
          border-radius: 12px;
          border: 1px solid rgba(1, 52, 110, 0.12);
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          background: #ffffff;
        }

        .chat-input button {
          border: none;
          background: #0683f5;
          color: #ffffff;
          padding: 0.6rem 0.9rem;
          border-radius: 12px;
          font-weight: 600;
        }

        .anti-template {
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .anti-template h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
        }

        .anti-title-row {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .anti-template h2 .accent-inline {
          color: #7dd36e;
          font-weight: 600;
          font-size: 1em;
          line-height: 1.1;
        }

        .accent-inline {
          font-size: 1em;
          font-weight: 600;
          line-height: 1.1;
        }

        .micro-copy {
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          font-size: 0.95rem;
          line-height: 1.45;
          color: #4c5a70;
          font-weight: 500;
        }

        .tablet-frame {
          position: relative;
          border-radius: 22px;
          border: 2px solid rgba(200, 208, 219, 0.9);
          background: #f7f9fc;
          box-shadow: 0 18px 40px rgba(1, 52, 110, 0.12);
          padding: 1.25rem;
        }

        .before-after {
          position: relative;
          height: 420px;
          border-radius: 16px;
          overflow: hidden;
          background: #f2f4f7;
          --slider: 55%;
        }

        .layer-template,
        .layer-upgrow {
          position: absolute;
          inset: 0;
          height: 100%;
        }

        .layer-template {
          z-index: 2;
          color: #999;
          font-family: "Times New Roman", Times, serif;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.03),
            transparent 60%
          );
          clip-path: inset(0 calc(100% - var(--slider)) 0 0);
        }

        .layer-upgrow {
          z-index: 1;
          overflow: hidden;
          background: #01346e;
          color: #0683f5;
          clip-path: inset(0 0 0 var(--slider));
        }

        .layer-upgrow .upgrow-fixed {
          position: absolute;
          inset: 0;
          width: 100%;
        }

        .template-content {
          padding: 1.8rem 2rem;
          filter: blur(1px);
          opacity: 0.9;
          user-select: none;
        }

        .template-content h4 {
          margin-top: 0;
          text-decoration: line-through;
          color: #888;
        }

        .template-content .strike {
          text-decoration: line-through;
          color: #b05c5c;
        }

        .template-stamp {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(153, 153, 153, 0.8);
        }

        .upgrow-fixed {
          width: 100%;
          padding: 1.8rem 2rem;
          color: #ecf6ff;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          user-select: none;
          padding-left: 20%;
        }

        .upgrow-live {
          font-size: 0.75rem;
          color: #7dd36e;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .divider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 14px;
          background: #7dd36e;
          z-index: 3;
          cursor: col-resize;
        }

        .divider-hint {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(1, 52, 110, 0.85);
          color: #ffffff;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .divider-line::before {
          content: "✋";
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.9rem;
          color: #01346e;
          background: #ffffff;
          border-radius: 999px;
          padding: 0.15rem 0.4rem;
          box-shadow: 0 6px 14px rgba(1, 52, 110, 0.2);
        }

        .divider-line::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 3px;
          background: #7dd36e;
          transform: translateX(-50%);
          box-shadow: 0 0 10px rgba(125, 211, 110, 0.8);
        }

        .anti-template ul {
          padding-left: 1.1rem;
          color: #4c5a70;
          font-weight: 500;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .deep-work {
          background: #d9ebf5;
        }

        .deep-title {
          color: #01346e;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
        }

        .deep-title .accent-inline {
          color: #0683f5;
          font-weight: 600;
          font-size: 1em;
          line-height: 1.1;
        }

        .deep-terminal {
          background: #0f1f2a;
          border: 1px solid #01346e;
          border-radius: 14px;
          padding: 1rem;
          color: #ecf6ff;
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          margin-bottom: 1.5rem;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.25);
        }

        .terminal-title {
          color: #ecf6ff;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .terminal-lines {
          display: grid;
          gap: 0.5rem;
          height: 240px;
          overflow-y: auto;
          scrollbar-width: none;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 0, 0, 0.9) 18%,
            #000 100%
          );
        }

        .terminal-lines::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .terminal-line {
          display: grid;
          grid-template-columns: 90px 120px 1fr;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .terminal-line .ts {
          color: rgba(229, 243, 255, 0.6);
        }

        .terminal-line .tag {
          color: #7dd36e;
        }

        .tag.search_agent {
          color: #7dd36e;
        }
        .tag.tax_engine {
          color: #f2b94b;
        }
        .tag.competitor_v2 {
          color: #68a9ff;
        }
        .tag.rag_validate {
          color: #9b8cff;
        }
        .tag.persona_sim {
          color: #ff8aa5;
        }
        .tag.fin_model {
          color: #8fe1c1;
        }

        .deep-copy h4 {
          color: #01346e;
          margin-bottom: 0.75rem;
        }

        .deep-copy ul {
          padding-left: 1.1rem;
          color: #4c5a70;
          font-weight: 500;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .deep-result {
          margin-top: 1rem;
          font-weight: 600;
          color: #01346e;
        }

        .deep-copy {
          margin-top: 1.5rem;
          text-align: left;
          padding: 0 10%;
        }

        .metrics-life {
          background: #ffffff;
        }

        .metrics-life h2 {
          color: #01346e;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .metrics-life h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
          font-size: 1em;
          line-height: 1.1;
        }

        .reality-check {
          background: #f8fafd;
        }

        .reality-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .reality-questions {
          max-width: 100%;
        }

        .reality-check .row.reality-questions {
          max-width: 100%;
        }

        .reality-title {
          color: #7dd36e;
        }

        .reality-questions {
          margin: 2rem 0;
        }

        .reality-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 16px 28px rgba(9, 30, 66, 0.14);
          border: 1px solid rgba(1, 52, 110, 0.08);
          transition: all 0.2s ease;
        }

        .reality-card:hover {
          box-shadow: 0 14px 30px rgba(9, 30, 66, 0.12);
          background: #e9f4ff;
        }

        .question-text {
          color: #01346e;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .answer-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .answer-btn {
          border: 1px solid rgba(1, 52, 110, 0.2);
          background: transparent;
          color: #01346e;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .answer-btn.active.yes {
          background: #0683f5;
          color: #ffffff;
          border-color: #0683f5;
        }

        .answer-btn.active.no {
          background: #ffffff;
          color: #d64545;
          border-color: #d64545;
        }

        .reality-outcome {
          margin-top: 2.5rem;
          animation: fadeIn 0.4s ease;
        }

        .reality-actions {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .reality-note {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: #4c5a70;
        }

        .reality-message {
          margin-top: 2.5rem;
          display: grid;
          justify-items: center;
          gap: 0.75rem;
        }

        .message-text {
          font-weight: 600;
          color: #01346e;
        }

        .metric-switch {
          display: inline-flex;
          gap: 0.5rem;
          background: #f3f6fa;
          padding: 0.4rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          border: 1px solid #e0e0e0;
          justify-content: center;
        }

        .switch-btn {
          border: none;
          background: transparent;
          color: #4c5a70;
          font-weight: 600;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .switch-btn.active {
          background: #0683f5;
          color: #ffffff;
        }

        .metric-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem;
          width: 100%;
        }

        .metric-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .metric-card {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 14px;
          padding: 1.2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .metric-card.old-school {
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          color: #8a94a6;
          font-size: 0.85rem;
        }

        .metric-card.old-school .card-title {
          font-weight: 700;
          color: #9aa3b2;
          margin-bottom: 0.8rem;
        }

        .metric-line {
          margin-bottom: 0.5rem;
        }

        .metric-card.upgrow {
          display: grid;
          gap: 0.9rem;
          transition:
            opacity 0.35s ease,
            filter 0.35s ease,
            transform 0.35s ease;
        }

        .metric-card.upgrow.faded {
          opacity: 0.35;
          filter: blur(2px);
          pointer-events: none;
          transform: translateY(8px);
        }

        .metric-card.upgrow.active {
          opacity: 1;
          filter: none;
          transform: translateY(0);
        }

        .metric-row {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 0.6rem;
          align-items: start;
        }

        .metric-row .icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          background: rgba(6, 131, 245, 0.12);
          border-radius: 10px;
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .metric-card.upgrow.owner .icon {
          transform: scale(1.05);
        }

        .metric-label {
          font-size: 0.85rem;
          color: #4c5a70;
        }

        .metric-value {
          font-weight: 600;
          color: #01346e;
        }

        .business-pulse {
          background: #d9ebf5;
          border-top: 1px solid rgba(1, 52, 110, 0.12);
        }

        .pulse-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }

        .pulse-copy h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }

        .pulse-copy h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .pulse-tabs {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .pulse-tab {
          border: 1px solid rgba(1, 52, 110, 0.15);
          background: #ffffff;
          color: #01346e;
          padding: 0.7rem 0.9rem;
          border-radius: 12px;
          text-align: left;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .pulse-tab:hover {
          border-color: #7dd36e;
          color: #01346e;
        }

        .pulse-tab.active {
          border-color: #0683f5;
          background: rgba(6, 131, 245, 0.1);
          color: #01346e;
        }

        .pulse-cta {
          border: none;
          background: #0683f5;
          color: #ffffff;
          padding: 0.75rem 1.1rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-dashboard {
          display: flex;
          justify-content: center;
        }

        .device-frame {
          background: #0f1f2a;
          color: #ecf6ff;
          border-radius: 24px;
          border: 1px solid rgba(1, 52, 110, 0.6);
          padding: 1.25rem;
          width: min(420px, 100%);
          box-shadow: 0 20px 40px rgba(1, 52, 110, 0.2);
        }

        .device-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .live-sync {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #7dd36e;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7dd36e;
          animation: pulseDot 1.4s infinite ease-in-out;
        }

        .device-map {
          background: #ffffff;
          border-radius: 16px;
          padding: 0.75rem;
          color: #01346e;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }

        .mapbox {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .mapbox .mapboxgl-canvas {
          width: 100% !important;
          height: 100% !important;
        }

        .mapbox::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(6, 131, 245, 0.18),
            rgba(125, 211, 110, 0.12),
            rgba(1, 52, 110, 0.08)
          );
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .biz-marker {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          display: grid;
          place-items: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(1, 52, 110, 0.25);
        }

        .biz-marker.biz-red {
          background: #e2534e;
        }

        .biz-marker.biz-yellow {
          background: #f2b94b;
          color: #1e1e1e;
        }

        .user-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #7dd36e;
          border: 2px solid #01346e;
          box-shadow: 0 0 0 6px rgba(125, 211, 110, 0.25);
        }

        .map-actions {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.6rem;
        }

        .map-btn {
          border: 1px solid rgba(1, 52, 110, 0.2);
          background: #ffffff;
          color: #01346e;
          padding: 0.45rem 0.7rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .map-hint {
          color: #6a7b93;
          font-size: 0.75rem;
        }

        .pulse-cards {
          position: relative;
          min-height: 240px;
        }

        .pulse-stack {
          display: none;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pulse-stack.active {
          display: flex;
        }

        .pulse-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 0.75rem;
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 0.6rem;
          align-items: start;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.45s ease;
        }

        .pulse-card.in {
          opacity: 1;
          transform: translateY(0);
        }

        .pulse-card.delay-1 {
          transition-delay: 0.15s;
        }

        .pulse-card.delay-2 {
          transition-delay: 0.3s;
        }

        .pulse-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          background: rgba(6, 131, 245, 0.2);
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
        }

        .pulse-card strong {
          display: block;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .pulse-card p {
          margin: 0;
          color: rgba(236, 246, 255, 0.9);
          font-size: 0.85rem;
        }

        .persona-votes {
          border-top: 1px solid rgba(1, 52, 110, 0.1);
          padding-top: 1.5rem;
        }

        .votes-title {
          font-weight: 700;
          color: #01346e;
          margin-bottom: 0.8rem;
        }

        .votes-avatars {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }

        .vote-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(1, 52, 110, 0.08);
          background-size: cover;
          background-position: center;
          transition: transform 0.2s ease;
        }

        .vote-avatar:hover {
          transform: translateY(-3px);
        }

        .votes-legend {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .vote {
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .vote.buy {
          background: rgba(125, 211, 110, 0.2);
          color: #2e7d32;
        }

        .vote.maybe {
          background: rgba(1, 52, 110, 0.08);
          color: #3b4a63;
        }

        .vote.no {
          background: rgba(255, 99, 71, 0.2);
          color: #b71c1c;
        }

        .votes-caption {
          margin-top: 0.6rem;
          color: #3b4a63;
        }

        .skeptic-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(1, 52, 110, 0.1);
          flex-shrink: 0;
        }

        .typing-active {
          font-size: 0.85rem;
          color: #8bc4ff;
          min-height: 1.25rem;
        }

        .log-line {
          font-size: 0.82rem;
          color: rgba(236, 246, 255, 0.85);
          animation: lineIn 0.35s ease;
        }

        .demo-result {
          margin-top: 0.9rem;
          background: rgba(7, 133, 246, 0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .rag-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rag-label {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          color: #8bc4ff;
          font-weight: 600;
        }

        .rag-text {
          flex: 1;
        }

        .rag-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1ed88a;
          animation: pulseDot 1.6s infinite ease-in-out;
        }

        .rag-result {
          margin-top: 0.9rem;
          font-weight: 600;
          color: #1ed88a;
        }

        @keyframes pulseDot {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes lineIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scan {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(220px);
          }
        }

        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          50% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes detailIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @media (max-width: 767px) {
          .section-pad {
            padding: 3rem 0 3rem;
          }

          .hero-2026 {
            padding: 3rem 0 2rem;
          }

          .hero-2026 h1 {
            font-size: clamp(1.8rem, 5vw, 2.4rem);
            margin-bottom: 0.75rem;
          }

          h2 {
            text-align: center;
          }

          .hero-subtitle {
            font-size: 0.95rem;
            margin-bottom: 1.25rem;
          }

          .hero-cta {
            width: 100%;
            gap: 0.75rem;
          }

          .hero-cta :global(.btn) {
            width: 100%;
            font-size: 0.9rem;
            padding: 0.6rem 0.9rem;
          }

          .hero-proof {
            gap: 0.75rem;
          }

          .rag-copy {
            text-align: center;
          }

          .rag-grid {
            gap: 1.5rem;
          }

          .rag-console {
            border-radius: 10px;
          }

          .console-body {
            padding: 0.75rem;
            height: 180px;
            overflow: hidden;
          }

          .proof-grid {
            gap: 1.5rem;
          }

          .skeptic-grid {
            gap: 1.5rem;
          }

          .source-card {
            position: static;
            opacity: 1;
            filter: none;
            transform: none;
            margin-top: 0.5rem;
            width: 100%;
          }

          .persona-content {
            grid-template-columns: 1fr;
          }

          .persona-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .chat-messages {
            height: 260px;
          }

          .pulse-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .pulse-tabs {
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .pulse-tab {
            font-size: 0.85rem;
            padding: 0.6rem 0.8rem;
          }

          .anti-wrap {
            grid-template-columns: 1fr;
          }

          .anti-blade {
            display: none;
          }

          .anti-template {
            background: #ffffff;
          }

          .deep-task-banner {
            flex-direction: column;
          }

          .reality-questions {
            gap: 1rem;
          }

          .reality-card {
            padding: 1rem;
          }

          .metric-row {
            grid-template-columns: 28px 1fr;
            gap: 0.5rem;
          }

          .metric-row .icon {
            width: 28px;
            height: 28px;
            font-size: 0.9rem;
          }

          .metric-label {
            font-size: 0.8rem;
          }

          .metric-value {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .section-pad {
            padding: 2.5rem 0 2.5rem;
          }

          .hero-2026 {
            padding: 2rem 0 1.5rem;
          }

          .hero-2026 h1 {
            font-size: clamp(1.5rem, 6vw, 2rem);
            margin-bottom: 0.5rem;
          }

          h2 {
            text-align: center;
          }

          .hero-subtitle {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }

          .hero-cta {
            flex-direction: column;
            gap: 0.6rem;
          }

          .hero-proof {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .proof-number {
            font-size: 0.95rem;
          }

          .rag-copy h2,
          .skeptic-copy h2,
          .pulse-copy h2 {
            font-size: clamp(1.3rem, 4vw, 1.8rem);
            margin-bottom: 0.75rem;
          }

          .console-body {
            padding: 0.5rem;
            gap: 0.4rem;
            height: 140px;
            overflow: hidden;
          }

          .console-line {
            font-size: 0.75rem;
          }

          .report-card {
            padding: 1rem;
          }

          .skeptic-widget {
            padding: 1rem;
          }

          .red-flags details {
            padding: 0.4rem;
          }

          .pulse-card {
            padding: 1rem;
          }

          .pulse-icon {
            font-size: 1.5rem;
          }

          .search-wrapper {
            gap: 0.5rem;
          }

          .answer-buttons {
            gap: 0.5rem;
          }

          .answer-btn {
            flex: 1;
            font-size: 0.85rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
