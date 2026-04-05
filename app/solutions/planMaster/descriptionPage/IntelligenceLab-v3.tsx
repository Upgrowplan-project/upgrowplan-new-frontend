"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// ─── Layout constants (+10% block sizes) ───────────────────────────────────
const SVG_W = 1260, SVG_H = 660;
const R1 = 120, R2 = 335, R3 = 545;                              // row Y centers
const C1 = 110, C2 = 295, C3 = 475, C4 = 670, C5 = 875, C6 = 1110; // col X centers
const SR = 53, CR = 51;                                           // circle radii
const SW = 132, SH = 84;                                          // standard rect
const CW = 185, CH = 130;                                         // context core capsule
const HW = 207, HH = 134;                                         // validation hub
const DW = 130, DH = 95;                                          // docx
const G = "#22c55e", W = "#FFFFFF";

// DOCX fold geometry
const docFx = C6 + DW / 2 - 22;
const docFy = R3 - DH / 2 + 22;

// DOCX animated lines
const dlX = C6 - DW / 2 + 12;
const dlYs = [R3 - 22, R3 - 7, R3 + 8, R3 + 23];
const dlMaxW = [docFx - 6 - dlX, DW - 26, DW - 26, DW - 40];

const ln = (x1: number, y1: number, x2: number, y2: number) =>
  `M ${x1} ${y1} L ${x2} ${y2}`;

const ARROWS: { d: string; d2?: string }[] = [
  { d: ln(C1 + SR + 6, R1, C2 - SW / 2 - 6, R1) },
  { d: ln(C2 + SW / 2 + 6, R1, C3 - SW / 2 - 6, R1) },
  { d: ln(C3 + SW / 2 + 6, R1, C4 - SW / 2 - 6, R1) },
  {
    d: ln(C4 + SW / 2 + 6, R1, C5 - SW / 2 - 6, R1),
    d2: ln(C5 - SW / 2 - 6, R1, C4 + SW / 2 + 6, R1),
  },
  { d: ln(C4, R1 + SH / 2 + 6, C4, R2 - CH / 2 - 6) },
  { d: ln(C4 - CW / 2 - 6, R2, C3 + SW / 2 + 6, R2) },
  { d: ln(C3 - SW / 2 - 6, R2, C2 + SW / 2 + 6, R2) },
  { d: ln(C2, R2 + SH / 2 + 6, C2, R3 - CR - 6) },
  { d: ln(C2 + CR + 6, R3, C4 - SW / 2 - 6, R3) },
  { d: ln(C4, R3 - SH / 2 - 6, C4, R2 + CH / 2 + 6) },
  { d: ln(C4 + CW / 2 + 6, R2, C5 - SW / 2 - 6, R2) },
  { d: ln(C5, R2 + SH / 2 + 6, C5, R3 - HH / 2 - 6) },
  { d: ln(C5 + HW / 2 + 6, R3, C6 - DW / 2 - 6, R3) },
];

// Icon wrapper — white stroke, no fill
const Icon = ({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) => (
  <svg
    x={x}
    y={y}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={W}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={0.9}
  >
    {children}
  </svg>
);

// White label
const Label = ({ x, y, lines }: { x: number; y: number; lines: string[] }) => (
  <text
    x={x}
    textAnchor="middle"
    fill={W}
    fontSize={12}
    fontWeight={700}
    fontFamily="Inter, -apple-system, sans-serif"
    style={{ pointerEvents: "none" }}
  >
    {lines.map((l, i) => (
      <tspan key={i} x={x} y={y + i * 15}>
        {l}
      </tspan>
    ))}
  </text>
);

// ─── Component ────────────────────────────────────────────────────────────
const IntelligenceLabV3: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const pA = useRef<SVGCircleElement>(null);
  const pB = useRef<SVGCircleElement>(null);
  const pC = useRef<SVGCircleElement>(null);

  const ctxFillRef = useRef<SVGRectElement>(null);
  const qBarRef = useRef<SVGRectElement>(null);
  const qTextRef = useRef<SVGTextElement>(null);

  // DOCX animated text lines
  const dL1 = useRef<SVGRectElement>(null);
  const dL2 = useRef<SVGRectElement>(null);
  const dL3 = useRef<SVGRectElement>(null);
  const dL4 = useRef<SVGRectElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        if (tlRef.current) tlRef.current.kill();

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        tlRef.current = tl;

        const mov = (
          ref: React.RefObject<SVGCircleElement | null>,
          x1: number,
          y1: number,
          x2: number,
          y2: number,
          t: number,
          dur = 0.65,
        ) => {
          const el = ref.current;
          if (!el) return;
          tl.set(el, { attr: { cx: x1, cy: y1 }, opacity: 1 }, Math.max(0, t - 0.005));
          tl.to(el, { attr: { cx: x2, cy: y2 }, duration: dur, ease: "power2.inOut" }, t);
          tl.set(el, { opacity: 0 }, t + dur + 0.01);
        };

        const glow = (id: string, t: number, returnW = 2) => {
          tl.to(`#${id}`, { attr: { stroke: G, strokeWidth: 3 }, duration: 0.2 }, t);
          tl.to(`#${id}`, { attr: { stroke: W, strokeWidth: returnW }, duration: 0.35 }, t + 0.65);
        };

        // ── Phase 1: Request flow ─────────────────────────────────────────
        glow("crq", 0.1);
        mov(pA, C1, R1, C2, R1, 0.3);
        glow("rval", 1.0);
        mov(pA, C2, R1, C3, R1, 1.2);
        glow("btype", 1.9);
        mov(pA, C3, R1, C4, R1, 2.1);
        glow("dres", 2.8);

        // ── Phase 2: Web research bounce ─────────────────────────────────
        mov(pB, C4, R1, C5, R1, 3.0, 0.45);
        glow("gweb", 3.45);
        mov(pB, C5, R1, C4, R1, 3.6, 0.45);
        mov(pB, C4, R1, C5, R1, 4.2, 0.45);
        glow("gweb", 4.65);
        mov(pB, C5, R1, C4, R1, 4.8, 0.45);

        // ── Phase 3: Deep Research → Context Core ────────────────────────
        mov(pC, C4, R1 + SH / 2, C4, R2 - CH / 2, 3.6, 0.8);
        glow("ctx", 4.4, 2.5);

        const cf = ctxFillRef.current;
        if (cf) {
          tl.set(cf, { attr: { y: R2 + CH / 2 - 2, height: 0 } }, 4.4);
          tl.to(cf, { attr: { y: R2 - CH / 2 + 2, height: CH - 4 }, duration: 2.6, ease: "power1.inOut" }, 4.4);
        }

        // ── Phase 4: Core → Org → Finance → Confirmation → Recalc ───────
        mov(pA, C4, R2, C3, R2, 5.6, 0.7);
        glow("org", 6.3);
        mov(pA, C3, R2, C2, R2, 6.5, 0.7);
        glow("fin", 7.2);
        mov(pA, C2, R2 + SH / 2, C2, R3 - CR, 7.5, 0.75);
        glow("cconf", 8.25);
        mov(pA, C2, R3, C4, R3, 8.5, 0.8);
        glow("frec", 9.3);
        mov(pA, C4, R3 - SH / 2, C4, R2 + CH / 2, 9.5, 0.8);
        glow("ctx", 10.3, 2.5);

        // ── Phase 5: Content generation ──────────────────────────────────
        mov(pB, C4, R2, C5, R2, 10.5, 0.7);
        glow("cgen", 11.2);
        mov(pB, C5, R2 + SH / 2, C5, R3 - HH / 2, 11.4, 0.75);
        glow("vhub", 12.15);

        const qb = qBarRef.current;
        if (qb) {
          tl.set(qb, { attr: { width: 0 } }, 12.0);
          tl.to(qb, { attr: { width: HW - 26 }, duration: 1.8, ease: "power1.inOut" }, 12.0);
        }
        const qt = qTextRef.current;
        if (qt) {
          const qObj = { v: 0 };
          tl.to(
            qObj,
            {
              v: 100,
              duration: 1.8,
              onUpdate: () => { if (qt) qt.textContent = `Quality ${Math.round(qObj.v)}%`; },
            },
            12.0,
          );
        }

        // ── Phase 6: Validation Hub → DOCX ───────────────────────────────
        mov(pC, C5 + HW / 2, R3, C6, R3, 13.8, 0.8);

        glow("docx-border", 14.6);

        // ── DOCX: animate text lines appearing top → bottom ───────────────
        const docLines = [dL1, dL2, dL3, dL4];
        docLines.forEach((ref, i) => {
          if (ref.current) {
            tl.set(ref.current, { attr: { width: 0 } }, 14.7);
            tl.to(
              ref.current,
              { attr: { width: dlMaxW[i] }, duration: 0.28, ease: "power2.out" },
              14.82 + i * 0.24,
            );
          }
        });

        // ── Reset ─────────────────────────────────────────────────────────
        const resetT = 17.2;
        if (cf) tl.set(cf, { attr: { y: R2 + CH / 2 - 2, height: 0 } }, resetT);
        if (qb) tl.set(qb, { attr: { width: 0 } }, resetT);
        tl.call(() => { if (qt) qt.textContent = "Quality 0%"; }, [], resetT);
        docLines.forEach((ref) => {
          if (ref.current) tl.set(ref.current, { attr: { width: 0 } }, resetT);
        });
      },
      { threshold: 0.08 },
    );

    if (containerRef.current) obs.observe(containerRef.current);
    return () => {
      obs.disconnect();
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: "#0683f5",
        padding: "3rem 0 2.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            fontFamily: "Inter, -apple-system, sans-serif",
            margin: "0 0 0.5rem",
          }}
        >
          Архитектура сервиса
        </p>
        <h2
          style={{
            color: W,
            fontSize: "clamp(20px, 2.8vw, 32px)",
            fontWeight: 700,
            margin: "0 0 0.75rem",
            fontFamily: "Inter, -apple-system, sans-serif",
            letterSpacing: "-0.2px",
          }}
        >
          Upgrowplan Intelligence Architecture
        </h2>
        <div style={{ height: 3, width: 100, background: G, margin: "0 auto", borderRadius: 2 }} />
      </div>

      {/* SVG scroll container */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: "0.5rem" }}>
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: "block", minWidth: SVG_W, margin: "0 auto" }}
        >
          <defs>
            <filter id="gf" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="ctx-clip">
              <rect x={C4 - CW / 2 + 2} y={R2 - CH / 2 + 2} width={CW - 4} height={CH - 4} rx={22} />
            </clipPath>
            <marker id="arr" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill={W} />
            </marker>
          </defs>

          {/* ── Arrows ─────────────────────────────────────────────────── */}
          {ARROWS.map((a, i) => (
            <g key={i}>
              <path d={a.d} stroke={W} strokeWidth="1.5" fill="none" markerEnd="url(#arr)" opacity={0.7} />
              {a.d2 && (
                <path d={a.d2} stroke={W} strokeWidth="1.5" fill="none" markerEnd="url(#arr)" opacity={0.7} />
              )}
            </g>
          ))}

          {/* ════════════ ROW 1 ════════════════════════════════════════════ */}

          {/* 1. Customer Request */}
          <g>
            <circle id="crq" cx={C1} cy={R1} r={SR} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C1 - 12} y={R1 - SR + 14}>
              <circle cx="12" cy="8" r="3.5" fill={W} stroke="none" />
              <path d="M4 20c0-3.5 3.6-5.5 8-5.5s8 2 8 5.5" />
            </Icon>
            <Label x={C1} y={R1 + 15} lines={["Customer", "Request"]} />
          </g>

          {/* 2. Request Validation */}
          <g>
            <rect
              id="rval"
              x={C2 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2} strokeDasharray="6,4"
            />
            <Icon x={C2 - 12} y={R1 - SH / 2 + 10}>
              <circle cx="9" cy="9" r="5.5" />
              <path d="M14.5 14.5L19 19" />
              <path d="M7 9l2 2 4-4" />
            </Icon>
            <Label x={C2} y={R1 + 7} lines={["Request", "Validation"]} />
          </g>

          {/* 3. Business Type */}
          <g>
            <rect
              id="btype"
              x={C3 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2} strokeDasharray="6,4"
            />
            <Icon x={C3 - 12} y={R1 - SH / 2 + 10}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 9h10M7 13h10M7 17h6" />
            </Icon>
            <Label x={C3} y={R1 + 7} lines={["Business Type", "& Parameters"]} />
          </g>

          {/* 4. Deep Research Agent */}
          <g>
            <rect
              id="dres"
              x={C4 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2}
            />
            <Icon x={C4 - 12} y={R1 - SH / 2 + 10}>
              <circle cx="12" cy="12" r="8" opacity={0.25} />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="12" cy="12" r="1.5" fill={W} stroke="none" />
              <circle cx="8" cy="8" r="0.9" fill={W} stroke="none" opacity={0.6} />
              <circle cx="16" cy="8" r="0.9" fill={W} stroke="none" opacity={0.6} />
              <circle cx="8" cy="16" r="0.9" fill={W} stroke="none" opacity={0.6} />
              <circle cx="16" cy="16" r="0.9" fill={W} stroke="none" opacity={0.6} />
            </Icon>
            <Label x={C4} y={R1 + 7} lines={["Deep Research", "Agent"]} />
          </g>

          {/* 5. Global Web Research */}
          <g>
            <rect
              id="gweb"
              x={C5 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2}
            />
            <Icon x={C5 - 12} y={R1 - SH / 2 + 10}>
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3q-4 5-4 9t4 9M12 3q4 5 4 9t-4 9" />
              <path d="M3.5 8q4 2 8.5 2t8.5-2M3.5 16q4-2 8.5-2t8.5 2" />
            </Icon>
            <Label x={C5} y={R1 + 7} lines={["Global Web", "Research"]} />
          </g>

          {/* ════════════ ROW 2 ════════════════════════════════════════════ */}

          {/* Finance Model */}
          <g>
            <rect
              id="fin"
              x={C2 - SW / 2} y={R2 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2} strokeDasharray="6,4"
            />
            <Icon x={C2 - 12} y={R2 - SH / 2 + 10}>
              <rect x="3" y="2" width="18" height="20" rx="2" />
              <rect x="5" y="4" width="14" height="4" rx="1" fill={W} stroke="none" opacity={0.25} />
              <circle cx="7" cy="12" r="0.9" fill={W} stroke="none" />
              <circle cx="12" cy="12" r="0.9" fill={W} stroke="none" />
              <circle cx="7" cy="17" r="0.9" fill={W} stroke="none" />
              <circle cx="12" cy="17" r="0.9" fill={W} stroke="none" />
            </Icon>
            <Label x={C2} y={R2 + 7} lines={["Finance Model", "Calculation"]} />
          </g>

          {/* Org Plan Formation */}
          <g>
            <rect
              id="org"
              x={C3 - SW / 2} y={R2 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2} strokeDasharray="6,4"
            />
            <Icon x={C3 - 12} y={R2 - SH / 2 + 10}>
              <rect x="9" y="2" width="6" height="4" rx="1" fill={W} stroke="none" opacity={0.7} />
              <rect x="2" y="16" width="7" height="4" rx="1" fill={W} stroke="none" opacity={0.7} />
              <rect x="15" y="16" width="7" height="4" rx="1" fill={W} stroke="none" opacity={0.7} />
              <path d="M12 6v4M12 10H5.5v6M12 10h6.5v6" />
            </Icon>
            <Label x={C3} y={R2 + 7} lines={["Organization", "Plan Formation"]} />
          </g>

          {/* Context Core (capsule) — central */}
          <g>
            {/* Animated green fill */}
            <rect
              ref={ctxFillRef}
              x={C4 - CW / 2 + 2}
              y={R2 + CH / 2 - 2}
              width={CW - 4}
              height={0}
              fill={G}
              opacity={0.28}
              clipPath="url(#ctx-clip)"
            />
            {/* Border */}
            <rect
              id="ctx"
              x={C4 - CW / 2} y={R2 - CH / 2} width={CW} height={CH} rx={26}
              fill="none" stroke={W} strokeWidth={2.5}
            />
            <Icon x={C4 - 13} y={R2 - 44}>
              <ellipse cx="12" cy="5" rx="8" ry="2.5" />
              <path d="M4 5v5c0 1.4 3.6 2.5 8 2.5S20 11.4 20 10V5" />
              <path d="M4 10v6c0 1.4 3.6 2.5 8 2.5S20 17.4 20 16v-6" opacity={0.5} />
            </Icon>
            <text
              x={C4} y={R2 - 10}
              textAnchor="middle" fill={W}
              fontSize={15} fontWeight={800}
              fontFamily="Inter, sans-serif" letterSpacing="0.5"
            >
              CONTEXT CORE
            </text>
            <text
              x={C4} y={R2 + 13}
              textAnchor="middle" fill={W}
              fontSize={12} fontWeight={500}
              fontFamily="Inter, sans-serif" opacity={0.7}
            >
              SQL Database
            </text>
          </g>

          {/* Content Generator */}
          <g>
            <rect
              id="cgen"
              x={C5 - SW / 2} y={R2 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2}
            />
            <Icon x={C5 - 12} y={R2 - SH / 2 + 10}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 8h20" />
              <path d="M6 13h5M6 17h8" />
              <circle cx="17.5" cy="15" r="1.5" fill={W} stroke="none" opacity={0.5} />
            </Icon>
            <Label x={C5} y={R2 + 7} lines={["Content", "Generator"]} />
          </g>

          {/* ════════════ ROW 3 ════════════════════════════════════════════ */}

          {/* Customer Confirmation */}
          <g>
            <circle id="cconf" cx={C2} cy={R3} r={CR} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C2 - 12} y={R3 - CR + 13}>
              <circle cx="12" cy="8" r="3.5" fill={W} stroke="none" />
              <path d="M4 20c0-3.5 3.6-5.5 8-5.5s8 2 8 5.5" />
            </Icon>
            <Label x={C2} y={R3 + 16} lines={["Customer", "Confirmation"]} />
          </g>

          {/* Final Recalculation */}
          <g>
            <rect
              id="frec"
              x={C4 - SW / 2} y={R3 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2}
            />
            <Icon x={C4 - 12} y={R3 - SH / 2 + 10}>
              <path d="M21 12a9 9 0 1 1-2.64-6.36" opacity={0.4} />
              <path d="M5 12a7 7 0 1 0 14 0" />
              <path d="M19 6l-2 4-4 1" />
            </Icon>
            <Label x={C4} y={R3 + 7} lines={["Final", "Recalculation"]} />
          </g>

          {/* Content Validation Hub */}
          <g>
            <rect
              id="vhub"
              x={C5 - HW / 2} y={R3 - HH / 2} width={HW} height={HH} rx={14}
              fill="none" stroke={W} strokeWidth={2}
            />
            <text
              x={C5} y={R3 - HH / 2 + 16}
              textAnchor="middle" fill={W}
              fontSize={11} fontWeight={700} fontFamily="Inter, sans-serif"
            >
              Content Validation Hub
            </text>
            {/* Agent boxes */}
            <rect
              x={C5 - HW / 2 + 10} y={R3 - 26}
              width={(HW - 24) / 2} height={26} rx={6}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.35)" strokeWidth={1} strokeDasharray="4,3"
            />
            <text
              x={C5 - HW / 2 + 10 + (HW - 24) / 4} y={R3 - 9}
              textAnchor="middle" fill={W}
              fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif" opacity={0.9}
            >
              Agent-Validator
            </text>
            <rect
              x={C5 + 2} y={R3 - 26}
              width={(HW - 24) / 2} height={26} rx={6}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.35)" strokeWidth={1} strokeDasharray="4,3"
            />
            <text
              x={C5 + 2 + (HW - 24) / 4} y={R3 - 9}
              textAnchor="middle" fill={W}
              fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif" opacity={0.9}
            >
              Sceptic Agent
            </text>
            {/* Quality bar */}
            <rect
              x={C5 - HW / 2 + 13} y={R3 + 12}
              width={HW - 26} height={9} rx={4.5}
              fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.3)" strokeWidth={1}
            />
            <rect
              ref={qBarRef}
              x={C5 - HW / 2 + 13} y={R3 + 12}
              width={0} height={9} rx={4.5}
              fill={G}
            />
            <text
              ref={qTextRef}
              x={C5} y={R3 + 38}
              textAnchor="middle" fill={G}
              fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif"
            >
              Quality 0%
            </text>
          </g>

          {/* DOCX Document */}
          <g>
            <path
              id="docx-border"
              d={`M ${C6 - DW / 2} ${R3 - DH / 2} H ${docFx} L ${C6 + DW / 2} ${docFy} V ${R3 + DH / 2} H ${C6 - DW / 2} Z`}
              fill="none"
              stroke={W}
              strokeWidth={2}
            />
            {/* Fold corner */}
            <path
              d={`M ${docFx} ${R3 - DH / 2} L ${docFx} ${docFy} L ${C6 + DW / 2} ${docFy}`}
              fill="rgba(255,255,255,0.10)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1}
            />
            {/* Animated text lines — appear top → bottom */}
            <rect ref={dL1} x={dlX} y={dlYs[0]} width={0} height={2} rx={1} fill="rgba(255,255,255,0.7)" />
            <rect ref={dL2} x={dlX} y={dlYs[1]} width={0} height={2} rx={1} fill="rgba(255,255,255,0.7)" />
            <rect ref={dL3} x={dlX} y={dlYs[2]} width={0} height={2} rx={1} fill="rgba(255,255,255,0.7)" />
            <rect ref={dL4} x={dlX} y={dlYs[3]} width={0} height={2} rx={1} fill="rgba(255,255,255,0.55)" />
            {/* Label */}
            <text
              x={C6} y={R3 + DH / 2 - 9}
              textAnchor="middle" fill={W}
              fontSize={13} fontWeight={700} fontFamily="Inter, sans-serif"
            >
              DOCX
            </text>
          </g>

          {/* ── Row labels (vertical, white, larger font, more gap) ──────── */}
          {(
            [
              [16, R1, "Запрос"],
              [16, R2, "Ядро"],
              [16, R3, "Выдача"],
            ] as [number, number, string][]
          ).map(([x, y, label]) => (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize={13}
              fontWeight={600}
              fontFamily="Inter, sans-serif"
              transform={`rotate(-90, ${x}, ${y})`}
            >
              {label}
            </text>
          ))}

          {/* Pulse dots */}
          <circle ref={pA} r={6} fill={G} opacity={0} filter="url(#gf)" />
          <circle ref={pB} r={6} fill={G} opacity={0} filter="url(#gf)" />
          <circle ref={pC} r={6} fill={G} opacity={0} filter="url(#gf)" />
        </svg>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 860,
          margin: "2rem auto 0",
          padding: "1.25rem 1.75rem",
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.11)",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem 2.5rem",
          justifyContent: "center",
          fontFamily: "Inter, -apple-system, sans-serif",
          fontSize: 13,
          color: W,
        }}
      >
        {[
          { shape: "circle", label: "Interaction Points (User)" },
          { shape: "dashed", label: "Internal Logic" },
          { shape: "solid", label: "AI Agents" },
          { shape: "capsule", label: "Knowledge Base (SQL)" },
        ].map(({ shape, label }) => (
          <div key={shape} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: 20,
                height: 20,
                flexShrink: 0,
                border: `2px ${shape === "dashed" ? "dashed" : "solid"} ${W}`,
                borderRadius: shape === "circle" ? "50%" : shape === "capsule" ? 8 : 4,
              }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Tagline ─────────────────────────────────────────────────────── */}
      <p
        style={{
          textAlign: "center",
          marginTop: "1.75rem",
          marginBottom: 0,
          fontSize: 14,
          color: "rgba(255,255,255,0.82)",
          fontStyle: "italic",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        Архитектура, которая думает{" "}
        <strong style={{ fontStyle: "normal" }}>с вами</strong>, не вместо вас.
      </p>
    </section>
  );
};

export default IntelligenceLabV3;
