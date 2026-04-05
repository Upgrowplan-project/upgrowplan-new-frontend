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
  globe: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M 12 2 Q 14 8 12 12 Q 10 8 12 2" opacity="0.6" />
      <path d="M 2 12 Q 8 14 12 12 Q 8 10 2 12" opacity="0.6" />
      <path d="M 22 12 Q 16 14 12 12 Q 16 10 22 12" opacity="0.6" />
      <path d="M 12 22 Q 14 16 12 12 Q 10 16 12 22" opacity="0.6" />
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
  checkmark: (
    <g strokeWidth="1.5" fill="none" stroke="currentColor">
      <path d="M 4 12 L 9 17 L 20 6" />
    </g>
  ),
  sparkles: (
    <g fill="currentColor" opacity="0.8">
      <circle cx="12" cy="2" r="1.5" />
      <circle cx="2" cy="12" r="1.5" />
      <circle cx="22" cy="12" r="1.5" />
      <circle cx="12" cy="22" r="1.5" />
      <circle cx="5" cy="5" r="1" opacity="0.6" />
      <circle cx="19" cy="5" r="1" opacity="0.6" />
      <circle cx="19" cy="19" r="1" opacity="0.6" />
      <circle cx="5" cy="19" r="1" opacity="0.6" />
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
  type: "circle" | "rect" | "capsule" | "hub";
  borderStyle: "solid" | "dashed";
  isAgent?: boolean;
  children?: string[]; // для Hub с вложенными агентами
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
  const [contentQualityFill, setContentQualityFill] = useState(0);

  // Узлы v3.0 - новая архитектура
  const nodes: Node[] = [
    // Верхний ряд
    {
      id: "customer-request",
      label: "Customer\nRequest",
      x: 60,
      y: 120,
      width: 120,
      height: 120,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "request-validation",
      label: "Request\nValidation",
      x: 220,
      y: 120,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "business-type",
      label: "Business Type\nand Parameters",
      x: 400,
      y: 120,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "deep-research",
      label: "Deep Research\nAgent",
      sublabel: "AI Analysis",
      x: 580,
      y: 120,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "data-research-web",
      label: "Data Research and\nValidation",
      sublabel: "Global Web",
      x: 760,
      y: 120,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },

    // Центральный ядро
    {
      id: "context-core",
      label: "CONTEXT\nCORE",
      sublabel: "SQL Database",
      x: 400,
      y: 300,
      width: 160,
      height: 144,
      type: "capsule",
      borderStyle: "solid",
    },

    // Второй уровень слева
    {
      id: "org-plan",
      label: "Organization\nplan formation",
      x: 220,
      y: 300,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "finance-model",
      label: "Finance model\ncalculation",
      x: 60,
      y: 420,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "dashed",
    },

    // Третий уровень
    {
      id: "customer-confirm",
      label: "Customer\nConfirmation",
      x: 220,
      y: 420,
      width: 120,
      height: 120,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "final-recalc",
      label: "Final\nRecalculation",
      x: 400,
      y: 420,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },

    // Правый поток - контент и валидация
    {
      id: "content-gen",
      label: "Content\nGenerator",
      x: 580,
      y: 300,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "content-validation-hub",
      label: "Content Validation Hub",
      sublabel: "Quality Improvement",
      x: 760,
      y: 420,
      width: 200,
      height: 160,
      type: "hub",
      borderStyle: "solid",
    },
    {
      id: "docx",
      label: "DOCX\nDocument",
      x: 920,
      y: 420,
      width: 132,
      height: 108,
      type: "rect",
      borderStyle: "solid",
    },
  ];

  // Стрелки v3.0 - только H/V
  const arrows: Arrow[] = [
    // Верхний поток
    {
      from: "customer-request",
      to: "request-validation",
      label: "RAW DATA",
      pathData: "M 120 120 L 154 120",
    },
    {
      from: "request-validation",
      to: "business-type",
      pathData: "M 286 120 L 334 120",
    },
    {
      from: "business-type",
      to: "deep-research",
      label: "DATA REQUEST",
      pathData: "M 466 120 L 514 120",
    },
    {
      from: "deep-research",
      to: "data-research-web",
      isBidirectional: true,
      pathData: "M 646 120 L 694 120",
    },

    // От Deep Research к Context Core
    {
      from: "deep-research",
      to: "context-core",
      pathData: "M 580 174 L 580 228 L 460 228 L 460 264",
    },

    // Context Core к Organization Plan
    {
      from: "context-core",
      to: "org-plan",
      pathData: "M 340 300 L 286 300",
    },

    // Organization Plan к Finance Model
    {
      from: "org-plan",
      to: "finance-model",
      pathData: "M 220 354 L 220 380 L 126 380 L 126 420",
    },

    // Finance Model к Customer Confirmation
    {
      from: "finance-model",
      to: "customer-confirm",
      pathData: "M 126 480 L 160 480",
    },

    // Customer Confirmation к Context Core
    {
      from: "customer-confirm",
      to: "context-core",
      label: "financial data",
      pathData: "M 280 480 L 340 480 L 340 372",
    },

    // Customer Confirmation → Final Recalculation
    {
      from: "customer-confirm",
      to: "final-recalc",
      pathData: "M 280 480 L 334 480",
    },

    // Final Recalculation ↔ Context Core
    {
      from: "final-recalc",
      to: "context-core",
      isBidirectional: true,
      pathData: "M 400 426 L 400 372",
    },

    // Context Core → Content Generator
    {
      from: "context-core",
      to: "content-gen",
      label: "final data",
      pathData: "M 500 300 L 514 300",
    },

    // Content Generator → Content Validation Hub
    {
      from: "content-gen",
      to: "content-validation-hub",
      pathData: "M 646 354 L 760 354 L 760 380",
    },

    // Content Validation Hub → DOCX
    {
      from: "content-validation-hub",
      to: "docx",
      pathData: "M 860 420 L 854 420",
    },
  ];

  // Intersection Observer
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

  // Инициализация анимаций Data Flow
  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    const timeline = gsap.timeline({ repeat: -1 });
    animationRef.current = timeline;

    // Фаза 1: Срабатывание Customer Request
    timeline.add(() => {
      const node = svgRef.current?.querySelector(
        '[data-node-id="customer-request"] circle',
      ) as SVGCircleElement | null;
      if (node) {
        gsap.to(node, {
          stroke: "#7dd36e",
          strokeWidth: 3.5,
          duration: 0.3,
        });
      }
    }, 0);

    // Фаза 2-4: Импульсы через верхний поток
    const topPathIndices = [0, 1, 2, 3];
    topPathIndices.forEach((idx) => {
      const arrow = arrows[idx];
      const pathElement = svgRef.current?.querySelector(
        `path[data-arrow="${arrow.from}-${arrow.to}"]`,
      ) as SVGPathElement | null;

      if (pathElement && svgRef.current) {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        circle.setAttribute("r", "6");
        circle.setAttribute("fill", "#7dd36e");
        circle.setAttribute("opacity", "0.95");
        circle.setAttribute("filter", "url(#glow)");
        svgRef.current.appendChild(circle);

        timeline.to(
          circle,
          {
            motionPath: {
              path: pathElement,
              align: pathElement,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: 1,
            ease: "power1.inOut",
          },
          idx * 1.2,
        );
      }
    });

    // Фаза 5: Deep Research ↔ Web Research (циклические импульсы)
    const bidirectionalPath =
      svgRef.current?.querySelector(
        'path[data-arrow="deep-research-data-research-web"]',
      ) as SVGPathElement | null;

    if (bidirectionalPath && svgRef.current) {
      for (let i = 0; i < 2; i++) {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        circle.setAttribute("r", "6");
        circle.setAttribute("fill", "#7dd36e");
        circle.setAttribute("opacity", "0.9");
        svgRef.current.appendChild(circle);

        timeline.to(
          circle,
          {
            motionPath: {
              path: bidirectionalPath,
              align: bidirectionalPath,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: 1.5,
            ease: "power1.inOut",
          },
          5 + i * 1.8,
        );
      }
    }

    // Фаза 6: Наполнение Context Core
    const fillObj = { value: 0 };
    timeline.to(
      fillObj,
      {
        value: 1,
        duration: 4,
        onUpdate: () => {
          setContextCoreFill(fillObj.value);
        },
      },
      5,
    );

    // Фаза 7: Основной поток данных к финальным блокам
    const mainFlowPaths = [6, 7, 8, 9, 12]; // индексы стрелок
    mainFlowPaths.forEach((idx, order) => {
      if (arrows[idx]) {
        const arrow = arrows[idx];
        const pathElement = svgRef.current?.querySelector(
          `path[data-arrow="${arrow.from}-${arrow.to}"]`,
        ) as SVGPathElement | null;

        if (pathElement && svgRef.current) {
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          circle.setAttribute("r", "6");
          circle.setAttribute("fill", "#7dd36e");
          circle.setAttribute("opacity", "0.9");
          svgRef.current.appendChild(circle);

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
            10 + order * 1.4,
          );
        }
      }
    });

    // Фаза 8: Индикатор качества в Content Validation Hub
    const qualityFill = { value: 0 };
    timeline.to(
      qualityFill,
      {
        value: 1,
        duration: 3,
        onUpdate: () => {
          setContentQualityFill(qualityFill.value);
        },
      },
      12,
    );

    // Фаза 9: Финальный импульс к DOCX
    const finalArrow = arrows[13];
    const finalPath = svgRef.current?.querySelector(
      `path[data-arrow="${finalArrow.from}-${finalArrow.to}"]`,
    ) as SVGPathElement | null;

    if (finalPath && svgRef.current) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("r", "6");
      circle.setAttribute("fill", "#7dd36e");
      circle.setAttribute("opacity", "0.95");
      svgRef.current.appendChild(circle);

      timeline.to(
        circle,
        {
          motionPath: {
            path: finalPath,
            align: finalPath,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          duration: 1,
          ease: "power1.inOut",
        },
        15,
      );
    }

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

    const outline = node.querySelector("rect") || node.querySelector("circle");

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
      "data-research-web": Icons.globe,
      "org-plan": Icons.checklist,
      "finance-model": Icons.calculator,
      "final-recalc": Icons.refresh,
      "content-gen": Icons.typewriter,
      "agent-validator": Icons.shield,
      "sceptic-agent": Icons.detective,
      "context-core": Icons.database,
      "content-validation-hub": Icons.checkmark,
      docx: Icons.docFile,
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
          <rect
            x={node.x - node.width / 2}
            y={node.y - node.height / 2}
            width={node.width}
            height={node.height}
            rx="24"
            fill="url(#contextFill)"
            opacity="0.35"
          />
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

    if (node.type === "hub") {
      const lines = node.label.split("\n");
      return (
        <g key={node.id} data-node-id={node.id} style={{ cursor: "pointer" }}>
          {/* Основной контур Hub */}
          <rect
            x={node.x - node.width / 2}
            y={node.y - node.height / 2}
            width={node.width}
            height={node.height}
            rx="12"
            fill="#FFFFFF"
            stroke="#1e3a8a"
            strokeWidth="2.5"
          />

          {/* Заголовок Hub */}
          <text
            x={node.x}
            y={node.y - node.height / 2 + 20}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="13"
            fontWeight="700"
            style={{ pointerEvents: "none" }}
          >
            {node.label}
          </text>

          {/* Vertical divider */}
          <line
            x1={node.x}
            y1={node.y - node.height / 2 + 30}
            x2={node.x}
            y2={node.y + node.height / 2 - 40}
            stroke="#1e3a8a"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Progress bar для качества контента */}
          <rect
            x={node.x - node.width / 2 + 12}
            y={node.y + node.height / 2 - 28}
            width={node.width - 24}
            height="8"
            rx="4"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <rect
            x={node.x - node.width / 2 + 12}
            y={node.y + node.height / 2 - 28}
            width={(node.width - 24) * contentQualityFill}
            height="8"
            rx="4"
            fill="#7dd36e"
            opacity="0.8"
          />

          {/* Лейбл качества */}
          <text
            x={node.x}
            y={node.y + node.height / 2 - 12}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="10"
            opacity="0.7"
            style={{ pointerEvents: "none" }}
          >
            Content Quality Improvement
          </text>

          {/* Маленькие иконки агентов внутри */}
          <svg
            x={node.x - 40}
            y={node.y - 15}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          >
            {Icons.shield}
          </svg>
          <text
            x={node.x - 50}
            y={node.y + 30}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="10"
            fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            Validator
          </text>

          <svg
            x={node.x + 20}
            y={node.y - 15}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          >
            {Icons.detective}
          </svg>
          <text
            x={node.x + 50}
            y={node.y + 30}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="10"
            fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            Sceptic
          </text>
        </g>
      );
    }

    // rect (обычные прямоугольники)
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
            width="1080"
            height="750"
            viewBox="0 0 1080 750"
            style={{
              display: "block",
              margin: "0 auto",
              minWidth: "1080px",
              filter: "drop-shadow(0 0 20px rgba(125, 211, 110, 0.08))",
              fontFamily:
                "'Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
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
                    x={arrow.pathData.includes("M 120") ? 137 : 450}
                    y={arrow.pathData.includes("M 540 174") ? 200 : 100}
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
