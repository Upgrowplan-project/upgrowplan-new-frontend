"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

// SVG иконки
const Icons = {
  userProfile: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <circle cx="12" cy="8" r="3" fill="currentColor" />
      <path d="M 4 20 C 4 17.79 7.58 16 12 16 S 20 17.79 20 20" />
    </g>
  ),
  searchCheck: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <circle cx="9" cy="9" r="5" />
      <path d="M 14 14 L 18 18" />
      <path d="M 7 9 L 9 11 L 13 7" />
    </g>
  ),
  checklist: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <rect x="2" y="2" width="16" height="16" rx="1" />
      <path d="M 6 8 L 8 10 L 12 6" />
      <path d="M 6 14 L 8 16 L 12 12" />
    </g>
  ),
  aiMind: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8" opacity="0.7" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" opacity="0.6" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" opacity="0.6" />
    </g>
  ),
  database: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <ellipse cx="12" cy="5" rx="7" ry="2.5" />
      <path d="M 5 5 V 13 C 5 14.4 8 15.5 12 15.5 S 19 14.4 19 13 V 5" />
      <line x1="5" y1="10" x2="19" y2="10" opacity="0.5" />
    </g>
  ),
  calculator: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <rect x="3" y="2" width="14" height="16" rx="1" />
      <rect x="4" y="4" width="12" height="4" opacity="0.5" />
      <circle cx="7" cy="11" r="0.8" fill="currentColor" />
      <circle cx="12" cy="11" r="0.8" fill="currentColor" />
      <circle cx="7" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
    </g>
  ),
  refresh: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <path d="M 4 12 A 8 8 0 1 0 20 12 A 8 8 0 0 0 4 12" />
      <path d="M 8 8 L 4 12 L 8 16" opacity="0.6" />
    </g>
  ),
  typewriter: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <rect x="2" y="4" width="16" height="12" rx="1" />
      <line x1="4" y1="8" x2="16" y2="8" opacity="0.5" />
      <path
        d="M 6 11 L 7.5 14 M 9 11 L 10.5 14 M 12 11 L 13.5 14"
        strokeWidth="1.2"
      />
      <rect
        x="2"
        y="17"
        width="16"
        height="1"
        opacity="0.3"
        fill="currentColor"
      />
    </g>
  ),
  shield: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <path d="M 12 2 L 20 6 L 20 11 C 20 16 12 19 12 19 S 4 16 4 11 L 4 6 L 12 2 Z" />
      <path d="M 9 12 L 11 14 L 15 10" fill="none" />
    </g>
  ),
  detective: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <circle cx="12" cy="10" r="3.5" />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
      <path d="M 12 14 L 10 18 M 10 18 L 8 17 M 10 18 L 12 17 M 7 10 C 5 9 3 10 2 12" />
    </g>
  ),
  docFile: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <path d="M 4 2 H 16 L 18 4 V 18 C 18 19.1 17.1 20 16 20 H 4 C 2.9 20 2 19.1 2 18 V 4 C 2 2.9 2.9 2 4 2 Z" />
      <path d="M 14 2 V 6 H 18" opacity="0.5" />
      <line x1="6" y1="10" x2="14" y2="10" />
      <line x1="6" y1="13" x2="14" y2="13" />
      <line x1="6" y1="16" x2="10" y2="16" />
    </g>
  ),
};

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "circle" | "rect" | "capsule";
  borderStyle: "solid" | "dashed";
  isAgent?: boolean;
}

interface Arrow {
  from: string;
  to: string;
  label?: string;
  pathData: string;
  isBidirectional?: boolean;
  isLoop?: boolean;
}

const ArchitectureDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [contextCoreFill, setContextCoreFill] = useState(0);

  // Узлы - с обновленными размерами (+20%)
  const nodes: Node[] = [
    {
      id: "customer-request",
      label: "Customer\nRequest",
      x: 60,
      y: 200,
      width: 120,
      height: 120,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "request-validation",
      label: "Request\nValidation",
      x: 200,
      y: 200,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "business-type",
      label: "Business Type\nand parameters",
      x: 360,
      y: 200,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "deep-research",
      label: "Deep Research\nAgent",
      sublabel: "AI Analysis",
      x: 540,
      y: 200,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "context-core",
      label: "CONTEXT\nCORE",
      sublabel: "SQL Database",
      x: 540,
      y: 380,
      width: 160,
      height: 144,
      type: "capsule",
      borderStyle: "solid",
    },
    {
      id: "org-plan",
      label: "Organization\nplan formation",
      x: 360,
      y: 380,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "finance-model",
      label: "Finance model\ncalculation",
      x: 200,
      y: 520,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "customer-confirm",
      label: "Customer\nConfirmation",
      x: 360,
      y: 520,
      width: 120,
      height: 120,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "final-recalc",
      label: "Final\nRecalculation",
      x: 540,
      y: 520,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "content-gen",
      label: "Content\nGenerator",
      x: 720,
      y: 380,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "agent-validator",
      label: "Agent\nValidator",
      x: 720,
      y: 200,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "sceptic-agent",
      label: "Sceptic\nAgent",
      x: 60,
      y: 520,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "docx",
      label: "DOCX\nDocument",
      x: 880,
      y: 200,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },
  ];

  // Стрелки - ТОЛЬКО горизонтальные и вертикальные
  const arrows: Arrow[] = [
    {
      from: "customer-request",
      to: "request-validation",
      label: "RAW DATA",
      pathData: "M 120 200 L 134 200",
    },
    {
      from: "request-validation",
      to: "business-type",
      pathData: "M 266 200 L 294 200",
    },
    {
      from: "business-type",
      to: "deep-research",
      label: "DATA REQUEST",
      pathData: "M 492 200 L 540 200",
    },
    {
      from: "deep-research",
      to: "context-core",
      pathData: "M 540 254 L 540 308",
    },
    { from: "context-core", to: "org-plan", pathData: "M 460 380 L 426 380" },
    { from: "org-plan", to: "finance-model", pathData: "M 360 434 L 266 434" },
    {
      from: "finance-model",
      to: "customer-confirm",
      pathData: "M 266 520 L 300 520",
    },
    {
      from: "context-core",
      to: "content-gen",
      label: "final data",
      pathData: "M 620 380 L 644 380",
    },
    {
      from: "customer-confirm",
      to: "context-core",
      label: "financial data",
      pathData: "M 360 434 Q 450 407 540 340",
    },
    {
      from: "content-gen",
      to: "agent-validator",
      label: "if NO",
      pathData: "M 720 326 L 720 254",
    },
    {
      from: "agent-validator",
      to: "docx",
      label: "if OK",
      pathData: "M 786 246 L 814 246",
    },
    {
      from: "agent-validator",
      to: "content-gen",
      pathData: "M 752 254 Q 780 310 752 326",
    },
    {
      from: "final-recalc",
      to: "sceptic-agent",
      isBidirectional: true,
      pathData: "M 474 520 L 128 520",
    },
    {
      from: "final-recalc",
      to: "customer-confirm",
      isBidirectional: true,
      pathData: "M 474 540 L 420 540",
    },
  ];

  // Использование Intersection Observer для запуска анимации
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Инициализация анимаций
  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    // Очистка предыдущей анимации
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const timeline = gsap.timeline({ repeat: -1 });
    animationRef.current = timeline;

    // Эффект заполнения Context Core
    const fillObj = { value: 0 };
    timeline.to(
      fillObj,
      {
        value: 1,
        duration: 3,
        onUpdate: () => {
          setContextCoreFill(fillObj.value);
        },
      },
      2,
    );

    // Анимация движения данных по стрелкам
    arrows.forEach((arrow, index) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#7dd36e");
      circle.setAttribute("opacity", "0.9");
      circle.setAttribute("filter", "url(#glow)");

      const pathElement = svgRef.current?.querySelector(
        `path[data-arrow="${arrow.from}-${arrow.to}"]`,
      ) as SVGPathElement | null;

      if (pathElement && svgRef.current) {
        svgRef.current.appendChild(circle);

        // Определяем последовательность импульсов
        const delay = index * 0.4;

        timeline.to(
          circle,
          {
            motionPath: {
              path: pathElement,
              align: pathElement,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: 1.2,
            ease: "power1.inOut",
          },
          delay,
        );
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isVisible, arrows]);

  // Ховер-эффекты
  const handleNodeHover = (nodeId: string, isEnter: boolean) => {
    const node = svgRef.current?.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) return;

    const rect = node.querySelector("rect");
    const circle = node.querySelector("circle");
    const outline = rect || circle;

    if (isEnter) {
      gsap.to(outline, { stroke: "#7dd36e", strokeWidth: 3.2, duration: 0.2 });
    } else {
      gsap.to(outline, { stroke: "#1e3a8a", strokeWidth: 2.5, duration: 0.2 });
    }
  };

  const renderNode = (node: Node) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "customer-request": Icons.userProfile,
      "customer-confirm": Icons.userProfile,
      "request-validation": Icons.searchCheck,
      "business-type": Icons.checklist,
      "deep-research": Icons.aiMind,
      "org-plan": Icons.checklist,
      "finance-model": Icons.calculator,
      "final-recalc": Icons.refresh,
      "content-gen": Icons.typewriter,
      "agent-validator": Icons.shield,
      "sceptic-agent": Icons.detective,
      docx: Icons.docFile,
      "context-core": Icons.database,
    };

    if (node.type === "circle") {
      const r = node.width / 2 - 4;
      const lines = node.label.split("\n");
      return (
        <g key={node.id} data-node-id={node.id} style={{ cursor: "pointer" }}>
          <circle
            cx={node.x}
            cy={node.y}
            r={r}
            fill="#FFFFFF"
            stroke="#1e3a8a"
            strokeWidth="2.5"
          />
          <svg
            x={node.x - 12}
            y={node.y - r + 10}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          >
            {iconMap[node.id]}
          </svg>
          <text
            x={node.x}
            y={node.y + 12}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="13"
            fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x={node.x} dy={i === 0 ? 0 : 15}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      );
    }

    if (node.type === "capsule") {
      const lines = node.label.split("\n");
      return (
        <g key={node.id} data-node-id={node.id} style={{ cursor: "pointer" }}>
          <defs>
            <linearGradient id="contextFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#7dd36e", stopOpacity: 0.4 }}
              />
              <stop
                offset={`${contextCoreFill * 100}%`}
                style={{ stopColor: "#7dd36e", stopOpacity: 0.7 }}
              />
              <stop
                offset={`${Math.max(contextCoreFill * 100, 1)}%`}
                style={{ stopColor: "transparent", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>
          {/* Заливка */}
          <rect
            x={node.x - node.width / 2}
            y={node.y - node.height / 2}
            width={node.width}
            height={node.height}
            rx="24"
            fill="url(#contextFill)"
            opacity="0.35"
          />
          {/* Контур */}
          <rect
            x={node.x - node.width / 2}
            y={node.y - node.height / 2}
            width={node.width}
            height={node.height}
            rx="24"
            fill="#FFFFFF"
            stroke="#1e3a8a"
            strokeWidth="2.5"
          />
          {/* Иконка БД */}
          <svg
            x={node.x - 12}
            y={node.y - node.height / 2 + 12}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          >
            {Icons.database}
          </svg>
          {/* Текст */}
          <text
            x={node.x}
            y={node.y - 8}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="14"
            fontWeight="700"
            style={{ pointerEvents: "none" }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x={node.x} dy={i === 0 ? 0 : 16}>
                {line}
              </tspan>
            ))}
          </text>
          {node.sublabel && (
            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              fill="#1e3a8a"
              fontSize="12"
              opacity="0.75"
              style={{ pointerEvents: "none" }}
            >
              {node.sublabel}
            </text>
          )}
        </g>
      );
    }

    // rect
    const lines = node.label.split("\n");
    return (
      <g key={node.id} data-node-id={node.id} style={{ cursor: "pointer" }}>
        <rect
          x={node.x - node.width / 2}
          y={node.y - node.height / 2}
          width={node.width}
          height={node.height}
          rx="12"
          fill="#FFFFFF"
          stroke="#1e3a8a"
          strokeWidth="2.5"
          strokeDasharray={node.borderStyle === "dashed" ? "6,6" : "none"}
          data-outline="true"
        />
        {/* Иконка */}
        <svg
          x={node.x - 11}
          y={node.y - node.height / 2 + 10}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="1.5"
        >
          {iconMap[node.id]}
        </svg>
        {/* Текст */}
        <text
          x={node.x}
          y={node.y + 2}
          textAnchor="middle"
          fill="#1e3a8a"
          fontSize="13"
          fontWeight="600"
          style={{ pointerEvents: "none" }}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={node.x} dy={i === 0 ? -2 : 15}>
              {line}
            </tspan>
          ))}
        </text>
        {node.sublabel && (
          <text
            x={node.x}
            y={node.y + node.height / 2 - 12}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="11"
            opacity="0.7"
            style={{ pointerEvents: "none" }}
          >
            {node.sublabel}
          </text>
        )}
      </g>
    );
  };

  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: "#0683f5",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{ minHeight: "750px", display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <svg
            ref={svgRef}
            width="1000"
            height="750"
            viewBox="0 0 1000 750"
            style={{
              display: "block",
              margin: "0 auto",
              minWidth: "1000px",
              filter: "drop-shadow(0 0 20px rgba(125, 211, 110, 0.08))",
            }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 12 4, 0 8" fill="#FFFFFF" />
              </marker>
            </defs>

            {/* Стрелки */}
            {arrows.map((arrow, idx) => (
              <g key={`arrow-${idx}`}>
                <path
                  d={arrow.pathData}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  data-arrow={`${arrow.from}-${arrow.to}`}
                  opacity="0.85"
                  style={{ transition: "stroke 0.2s ease" }}
                />
                {arrow.isBidirectional && (
                  <path
                    d={arrow.pathData}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    fill="none"
                    markerStart="url(#arrowhead)"
                    opacity="0.4"
                  />
                )}
                {arrow.label && (
                  <text
                    x={
                      arrow.pathData.includes("M 120 200")
                        ? 127
                        : arrow.pathData.includes("M 492 200")
                          ? 516
                          : arrow.pathData.includes("final data")
                            ? 680
                            : 350
                    }
                    y={
                      arrow.pathData.includes("M 540 254")
                        ? 280
                        : arrow.pathData.includes("M 266 434")
                          ? 420
                          : 185
                    }
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    style={{ pointerEvents: "none", opacity: 0.95 }}
                  >
                    {arrow.label}
                  </text>
                )}
              </g>
            ))}

            {/* Узлы */}
            {nodes.map((node) => (
              <g
                key={node.id}
                onMouseEnter={() => handleNodeHover(node.id, true)}
                onMouseLeave={() => handleNodeHover(node.id, false)}
              >
                {renderNode(node)}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureDiagram;
