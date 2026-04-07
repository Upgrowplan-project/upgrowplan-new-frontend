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
const IntelligenceLabV3En: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const pA = useRef<SVGCircleElement>(null);
  const pB = useRef<SVGCircleElement>(null);
  const pC = useRef<SVGCircleElement>(null);

  const ctxFillRef = useRef<SVGRectElement>(null);
  const qBarRef = useRef<SVGRectElement>(null);
  const qTextRef = useRef<SVGTextElement>(null);

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

        glow("crq", 0.1);
        mov(pA, C1, R1, C2, R1, 0.3);
        glow("rval", 1.0);
        mov(pA, C2, R1, C3, R1, 1.2);
        glow("btype", 1.9);
        mov(pA, C3, R1, C4, R1, 2.1);
        glow("dres", 2.8);

        mov(pB, C4, R1, C5, R1, 3.0, 0.45);
        glow("gweb", 3.45);
        mov(pB, C5, R1, C4, R1, 3.6, 0.45);
        mov(pB, C4, R1, C5, R1, 4.2, 0.45);
        glow("gweb", 4.65);
        mov(pB, C5, R1, C4, R1, 4.8, 0.45);

        mov(pC, C4, R1 + SH / 2, C4, R2 - CH / 2, 3.6, 0.8);
        glow("ctx", 4.4, 2.5);

        const cf = ctxFillRef.current;
        if (cf) {
          tl.set(cf, { attr: { y: R2 + CH / 2 - 2, height: 0 } }, 4.4);
          tl.to(cf, { attr: { y: R2 - CH / 2 + 2, height: CH - 4 }, duration: 2.6, ease: "power1.inOut" }, 4.4);
        }

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
              onUpdate: () => {
                qt.textContent = `Quality ${Math.round(qObj.v)}%`;
              },
            },
            12.0,
          );
        }

        const dl = [dL1, dL2, dL3, dL4];
        dl.forEach((r, i) => {
          const el = r.current;
          if (!el) return;
          tl.set(el, { attr: { width: 0 } }, 12.3 + i * 0.15);
          tl.to(el, { attr: { width: dlMaxW[i] }, duration: 1.1, ease: "power1.inOut" }, 12.3 + i * 0.15);
        });
      },
      { threshold: 0.25 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => {
      obs.disconnect();
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

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
          Service architecture
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

          {ARROWS.map((a, i) => (
            <g key={i}>
              <path d={a.d} stroke={W} strokeWidth="1.5" fill="none" markerEnd="url(#arr)" opacity={0.7} />
              {a.d2 && (
                <path d={a.d2} stroke={W} strokeWidth="1.5" fill="none" markerEnd="url(#arr)" opacity={0.7} />
              )}
            </g>
          ))}

          <g>
            <circle id="crq" cx={C1} cy={R1} r={SR} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C1 - 12} y={R1 - SR + 14}>
              <circle cx="12" cy="8" r="3.5" fill={W} stroke="none" />
              <path d="M4 20c0-3.5 3.6-5.5 8-5.5s8 2 8 5.5" />
            </Icon>
            <Label x={C1} y={R1 + 15} lines={["Customer", "Request"]} />
          </g>

          <g>
            <rect
              id="rval"
              x={C2 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13}
              fill="none" stroke={W} strokeWidth={2} strokeDasharray="6,4"
            />
            <Icon x={C2 - 12} y={R1 - SH / 2 + 10}>
              <circle cx="9" cy="9" r="5.5" />
              <path d="M14.5 14.5L19 19" />
            </Icon>
            <Label x={C2} y={R1 + 16} lines={["Request", "Validation"]} />
          </g>

          <g>
            <rect id="btype" x={C3 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C3 - 12} y={R1 - SH / 2 + 10}>
              <path d="M4 7h16M4 12h16M4 17h10" />
            </Icon>
            <Label x={C3} y={R1 + 16} lines={["Business", "Type"]} />
          </g>

          <g>
            <rect id="dres" x={C4 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C4 - 12} y={R1 - SH / 2 + 10}>
              <path d="M5 5h14v14H5z" />
              <path d="M9 9h6M9 13h6" />
            </Icon>
            <Label x={C4} y={R1 + 16} lines={["Data", "Request"]} />
          </g>

          <g>
            <rect id="gweb" x={C5 - SW / 2} y={R1 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C5 - 12} y={R1 - SH / 2 + 10}>
              <circle cx="12" cy="12" r="7" />
              <path d="M5 12h14M12 5a12 12 0 010 14M12 5a12 12 0 000 14" />
            </Icon>
            <Label x={C5} y={R1 + 16} lines={["Global", "Web"]} />
          </g>

          <g>
            <rect id="ctx" x={C4 - CW / 2} y={R2 - CH / 2} width={CW} height={CH} rx={22} fill="none" stroke={W} strokeWidth={2.5} />
            <g clipPath="url(#ctx-clip)">
              <rect ref={ctxFillRef} x={C4 - CW / 2 + 2} y={R2 + CH / 2 - 2} width={CW - 4} height={0} fill="rgba(255,255,255,0.18)" />
            </g>
            <Icon x={C4 - 12} y={R2 - CH / 2 + 10}>
              <path d="M4 9h16M4 15h10" />
            </Icon>
            <Label x={C4} y={R2 + 16} lines={["Context", "Core"]} />
          </g>

          <g>
            <rect id="org" x={C3 - SW / 2} y={R2 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C3 - 12} y={R2 - SH / 2 + 10}>
              <path d="M6 19h12M8 5h8M9 5v4h6V5M9 9v10M15 9v10" />
            </Icon>
            <Label x={C3} y={R2 + 16} lines={["Organization", "Model"]} />
          </g>

          <g>
            <rect id="fin" x={C2 - SW / 2} y={R2 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C2 - 12} y={R2 - SH / 2 + 10}>
              <path d="M4 12h16M12 4v16" />
            </Icon>
            <Label x={C2} y={R2 + 16} lines={["Financial", "Model"]} />
          </g>

          <g>
            <circle id="cconf" cx={C2} cy={R3} r={CR} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C2 - 12} y={R3 - CR + 14}>
              <path d="M7 12l3 3 7-7" />
            </Icon>
            <Label x={C2} y={R3 + 16} lines={["Consistency", "Check"]} />
          </g>

          <g>
            <rect id="frec" x={C4 - SW / 2} y={R3 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C4 - 12} y={R3 - SH / 2 + 10}>
              <path d="M4 12h6l2-4 3 8 2-4h3" />
            </Icon>
            <Label x={C4} y={R3 + 16} lines={["Final", "Recalc"]} />
          </g>

          <g>
            <rect id="cgen" x={C5 - SW / 2} y={R2 - SH / 2} width={SW} height={SH} rx={13} fill="none" stroke={W} strokeWidth={2} />
            <Icon x={C5 - 12} y={R2 - SH / 2 + 10}>
              <path d="M5 5h14v14H5z" />
              <path d="M8 8h8M8 12h6" />
            </Icon>
            <Label x={C5} y={R2 + 16} lines={["Content", "Generation"]} />
          </g>

          <g>
            <rect id="vhub" x={C5 - HW / 2} y={R3 - HH / 2} width={HW} height={HH} rx={20} fill="none" stroke={W} strokeWidth={2} />
            <rect x={C5 - HW / 2 + 13} y={R3 + 12} width={HW - 26} height={6} rx={3} fill="rgba(255,255,255,0.15)" />
            <rect ref={qBarRef} x={C5 - HW / 2 + 13} y={R3 + 12} width={0} height={6} rx={3} fill={G} />
            <text
              ref={qTextRef}
              x={C5}
              y={R3 + 4}
              textAnchor="middle"
              fill={W}
              fontSize={11}
              fontWeight={700}
              fontFamily="Inter, -apple-system, sans-serif"
            >
              Quality 0%
            </text>
            <Label x={C5} y={R3 - 18} lines={["Validation", "Hub"]} />
          </g>

          <g>
            <rect
              id="docx"
              x={C6 - DW / 2}
              y={R3 - DH / 2}
              width={DW}
              height={DH}
              rx={10}
              fill="none"
              stroke={W}
              strokeWidth={2}
            />
            <polygon points={`${docFx} ${docFy}, ${docFx + 18} ${docFy}, ${docFx + 18} ${docFy + 18}`} fill="none" stroke={W} strokeWidth={2} />
            <rect ref={dL1} x={dlX} y={dlYs[0]} height={4} rx={2} width={0} fill="rgba(255,255,255,0.65)" />
            <rect ref={dL2} x={dlX} y={dlYs[1]} height={4} rx={2} width={0} fill="rgba(255,255,255,0.5)" />
            <rect ref={dL3} x={dlX} y={dlYs[2]} height={4} rx={2} width={0} fill="rgba(255,255,255,0.5)" />
            <rect ref={dL4} x={dlX} y={dlYs[3]} height={4} rx={2} width={0} fill="rgba(255,255,255,0.5)" />
            <Label x={C6} y={R3 + 18} lines={["DOCX", "Output"]} />
          </g>

          <text
            x={16}
            y={R1}
            textAnchor="start"
            fill="rgba(255,255,255,0.6)"
            fontSize={12}
            fontWeight={600}
            fontFamily="Inter, -apple-system, sans-serif"
          >
            {[
              [16, R1, "Request"],
              [16, R2, "Core"],
              [16, R3, "Output"],
            ].map(([x, y, label]) => (
              <tspan key={String(label)} x={Number(x)} y={Number(y)}>
                {label}
              </tspan>
            ))}
          </text>
        </svg>
      </div>

      <p
        style={{
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.95rem",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        Architecture that thinks <strong style={{ fontStyle: "normal" }}>with you</strong>, not instead of you.
      </p>
    </section>
  );
};

export default IntelligenceLabV3En;
