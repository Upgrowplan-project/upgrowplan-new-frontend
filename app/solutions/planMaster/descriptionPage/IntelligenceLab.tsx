"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  type: "circle" | "rect" | "capsule" | "hub";
  borderStyle: "solid" | "dashed";
  isAgent?: boolean;
  icon?: React.ReactNode;
}

interface Arrow {
  from: string;
  to: string;
  label?: string;
  pathData: string;
  isBidirectional?: boolean;
  isVertical?: boolean;
}

// SVG иконки компонентов
const Icons = {
  userProfile: (
    <g>
      <circle cx="12" cy="8" r="3" fill="currentColor" />
      <path
        d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  ),
  searchCheck: (
    <g>
      <circle
        cx="9"
        cy="9"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
    </g>
  ),
  checklist: (
    <g>
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M6 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
    </g>
  ),
  aiMind: (
    <g>
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="16" cy="8" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="8" cy="16" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="16" cy="16" r="1" fill="currentColor" opacity="0.5" />
    </g>
  ),
  database: (
    <g>
      <ellipse
        cx="12"
        cy="5"
        rx="7"
        ry="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 5v8c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="5"
        y1="10"
        x2="19"
        y2="10"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
    </g>
  ),
  chartGraph: (
    <g>
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 12l3-4 3 2 5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  ),
  calculator: (
    <g>
      <rect
        x="3"
        y="2"
        width="14"
        height="16"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="7" cy="11" r="0.8" fill="currentColor" />
      <circle cx="12" cy="11" r="0.8" fill="currentColor" />
      <circle cx="7" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
      <path d="M15 12l0 4" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  handCheck: (
    <g>
      <path
        d="M8 16c0 1.1.9 2 2 2s2-.9 2-2m-6-6h4v6H4v-6zm10-3l2-3m-4 0l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 10l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" />
    </g>
  ),
  refresh: (
    <g>
      <path
        d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0M8 8l-3 3 3 3m8 0l3-3-3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  ),
  typewriter: (
    <g>
      <rect
        x="2"
        y="4"
        width="16"
        height="12"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="4"
        y1="8"
        x2="16"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M6 11l1.5 3M9 11l1.5 3M12 11l1.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="2"
        y="17"
        width="16"
        height="1"
        fill="currentColor"
        opacity="0.3"
      />
    </g>
  ),
  shield: (
    <g>
      <path
        d="M12 2l8 4v5c0 5-8 8-8 8s-8-3-8-8V6l8-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
    </g>
  ),
  detective: (
    <g>
      <circle
        cx="12"
        cy="10"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
      <path
        d="M12 14l-2 4m0 0l-2-1m2 1l2-1M7 10c-2-1-4-0-5 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  ),
  docFile: (
    <g>
      <path
        d="M4 2h12l2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 2v4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <line
        x1="6"
        y1="10"
        x2="14"
        y2="10"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="6"
        y1="13"
        x2="14"
        y2="13"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="6"
        y1="16"
        x2="10"
        y2="16"
        stroke="currentColor"
        strokeWidth="1"
      />
    </g>
  ),
};

const IntelligenceLab: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const circlesRef = useRef<SVGCircleElement[]>([]);
  const [contextCoreFill, setContextCoreFill] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Узлы с новой структурой
  const nodes: Node[] = [
    // Верхний левый - вход
    {
      id: "customer-request",
      label: "Customer Request",
      x: 100,
      y: 80,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "request-validation",
      label: "Request\nValidation",
      x: 280,
      y: 80,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "business-type",
      label: "Business Type\nand parameters",
      x: 480,
      y: 80,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "deep-research",
      label: "DEEP RESEARCH\nAGENT",
      sublabel: "AI Analysis",
      x: 700,
      y: 80,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "data-research",
      label: "Data Research\nand Validation",
      x: 900,
      y: 80,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    // Центр - ядро
    {
      id: "context-core",
      label: "CONTEXT\nCORE",
      sublabel: "SQL Database",
      x: 700,
      y: 280,
      type: "capsule",
      borderStyle: "solid",
    },
    // Левая ветка
    {
      id: "org-plan",
      label: "Organization\nplan formation",
      x: 480,
      y: 280,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "finance-model",
      label: "Finance model\ncalculation",
      x: 280,
      y: 420,
      type: "rect",
      borderStyle: "dashed",
    },
    // Нижний слой
    {
      id: "customer-confirm",
      label: "Customer\nConfirmation",
      x: 280,
      y: 550,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "final-recalc",
      label: "Final\nRecalculation",
      x: 480,
      y: 550,
      type: "rect",
      borderStyle: "solid",
    },
    // Правая ветка - генерация
    {
      id: "content-gen",
      label: "Content\nGenerator",
      x: 900,
      y: 280,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "validation-hub",
      label: "Multi-Agent\nValidation Hub",
      x: 900,
      y: 420,
      type: "hub",
      borderStyle: "solid",
    },
    {
      id: "docx-output",
      label: "DOCX\nDocument",
      x: 900,
      y: 550,
      type: "rect",
      borderStyle: "solid",
    },
  ];

  const arrows: Arrow[] = [
    // Входящий поток
    {
      from: "customer-request",
      to: "request-validation",
      label: "RAW DATA",
      pathData: "M 150 80 L 230 80",
    },
    {
      from: "request-validation",
      to: "business-type",
      pathData: "M 330 80 L 420 80",
    },
    {
      from: "business-type",
      to: "deep-research",
      label: "DATA REQUEST",
      pathData: "M 540 80 L 650 80",
    },
    // От Deep Research
    {
      from: "deep-research",
      to: "data-research",
      pathData: "M 780 80 L 840 80",
    },
    {
      from: "data-research",
      to: "context-core",
      pathData: "M 900 130 L 750 230",
    },
    {
      from: "deep-research",
      to: "context-core",
      label: "",
      pathData: "M 700 130 L 700 210",
      isBidirectional: true,
    },
    // От Context Core влево
    {
      from: "context-core",
      to: "org-plan",
      pathData: "M 620 280 L 540 280",
    },
    {
      from: "org-plan",
      to: "finance-model",
      pathData: "M 480 330 L 320 380",
    },
    // Вниз к Customer Confirmation
    {
      from: "finance-model",
      to: "customer-confirm",
      pathData: "M 280 480 L 280 500",
      isVertical: true,
    },
    // Вправо к Final Recalculation
    {
      from: "customer-confirm",
      to: "final-recalc",
      pathData: "M 320 550 L 420 550",
    },
    // Наверх к Context Core
    {
      from: "final-recalc",
      to: "context-core",
      pathData: "M 480 480 L 650 330",
    },
    // От Context Core вправо
    {
      from: "context-core",
      to: "content-gen",
      label: "final data",
      pathData: "M 780 280 L 840 280",
    },
    // К валидации
    {
      from: "content-gen",
      to: "validation-hub",
      label: "if NO",
      pathData: "M 900 330 L 900 380",
    },
    // От валидации к выводу
    {
      from: "validation-hub",
      to: "docx-output",
      label: "if OK",
      pathData: "M 900 480 L 900 500",
      isVertical: true,
    },
  ];

  // Intersection Observer для запуска при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Анимации
  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    circlesRef.current.forEach((circle) => circle.remove());
    circlesRef.current = [];

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
      0,
    );

    // Анимация частиц по стрелкам
    arrows.forEach((arrow, idx) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "#7dd36e");
      circle.setAttribute("opacity", "0.8");
      circle.setAttribute("filter", "url(#glow)");

      const pathElement = svgRef.current?.querySelector(
        `path[data-path="${arrow.from}-${arrow.to}"]`,
      ) as SVGPathElement | null;

      if (pathElement && svgRef.current) {
        svgRef.current.appendChild(circle);
        circlesRef.current.push(circle);

        const duration = 2.5;
        const delay = (idx % 6) * 0.4;

        timeline.to(
          circle,
          {
            motionPath: {
              path: pathElement,
              align: pathElement,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: duration,
            ease: "power1.inOut",
          },
          delay,
        );
      }
    });

    // Пульсация агентов
    nodes.forEach((node) => {
      if (node.isAgent || node.id === "context-core") {
        const outline = svgRef.current?.querySelector(
          `g[data-node-id="${node.id}"] [data-outline]`,
        );
        if (outline) {
          gsap.to(outline, {
            strokeWidth: 2.5,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut",
          });
        }
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isVisible, nodes, arrows]);

  // Ховер на DOCX
  const handleDocxHover = (isEnter: boolean) => {
    const docxGroup = svgRef.current?.querySelector(
      'g[data-node-id="docx-output"]',
    );
    if (docxGroup) {
      gsap.to(docxGroup, {
        transform: isEnter ? "scale(1.15)" : "scale(1)",
        duration: 0.3,
      });
    }
  };

  const renderNode = (node: Node) => {
    if (node.type === "circle") {
      const lines = node.label.split("\n");
      return (
        <g
          key={node.id}
          data-node-id={node.id}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="40"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            data-outline="true"
          />
          <g x={node.x - 12} y={node.y - 12}>
            <svg
              x={node.x - 12}
              y={node.y - 12}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              {node.id === "customer-request" && Icons.userProfile}
              {node.id === "customer-confirm" && Icons.handCheck}
            </svg>
          </g>
          <text
            x={node.x}
            y={node.y + 25}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12"
            fontWeight="700"
            style={{ pointerEvents: "none" }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x={node.x} dy={i === 0 ? 0 : 14}>
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
            <linearGradient
              id="contextGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#7dd36e", stopOpacity: 0.3 }}
              />
              <stop
                offset={`${contextCoreFill * 100}%`}
                style={{ stopColor: "#7dd36e", stopOpacity: 0.6 }}
              />
              <stop
                offset={`${Math.max(contextCoreFill * 100, 1)}%`}
                style={{ stopColor: "transparent", stopOpacity: 0 }}
              />
            </linearGradient>
          </defs>
          {/* Заливка */}
          <rect
            x={node.x - 60}
            y={node.y - 50}
            width="120"
            height="100"
            rx="30"
            fill="url(#contextGradient)"
            opacity="0.4"
          />
          {/* Контур */}
          <rect
            x={node.x - 60}
            y={node.y - 50}
            width="120"
            height="100"
            rx="30"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            data-outline="true"
          />
          {/* Иконка БД */}
          <svg
            x={node.x - 12}
            y={node.y - 35}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7dd36e"
            strokeWidth="1.5"
          >
            {Icons.database}
          </svg>
          {/* Текст */}
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="#FFFFFF"
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
              y={node.y + 30}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              opacity="0.8"
              style={{ pointerEvents: "none" }}
            >
              {node.sublabel}
            </text>
          )}
        </g>
      );
    }

    if (node.type === "hub") {
      return (
        <g key={node.id} data-node-id={node.id} style={{ cursor: "pointer" }}>
          {/* Внешний контур Hub */}
          <rect
            x={node.x - 70}
            y={node.y - 50}
            width="140"
            height="100"
            rx="8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            data-outline="true"
          />
          {/* Validator слева */}
          <rect
            x={node.x - 60}
            y={node.y - 40}
            width="55"
            height="40"
            rx="4"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <svg
            x={node.x - 50}
            y={node.y - 35}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7dd36e"
            strokeWidth="1.5"
          >
            {Icons.shield}
          </svg>
          <text
            x={node.x - 32}
            y={node.y - 10}
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="600"
          >
            Validator
          </text>
          {/* Sceptic справа */}
          <rect
            x={node.x + 5}
            y={node.y - 40}
            width="55"
            height="40"
            rx="4"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <svg
            x={node.x + 14}
            y={node.y - 35}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7dd36e"
            strokeWidth="1.5"
          >
            {Icons.detective}
          </svg>
          <text
            x={node.x + 28}
            y={node.y - 10}
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="600"
          >
            Sceptic
          </text>
          {/* Цикл проверки */}
          <path
            d={`M ${node.x - 5} ${node.y - 5} Q ${node.x} ${node.y + 10} ${node.x + 5} ${node.y - 5}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </g>
      );
    }

    // Прямоугольник
    const lines = node.label.split("\n");
    const isAgent = node.isAgent;
    return (
      <g
        key={node.id}
        data-node-id={node.id}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => {
          if (node.id === "docx-output") handleDocxHover(true);
          setHoveredNode(node.id);
        }}
        onMouseLeave={() => {
          if (node.id === "docx-output") handleDocxHover(false);
          setHoveredNode(null);
        }}
      >
        <rect
          x={node.x - 55}
          y={node.y - 35}
          width="110"
          height="70"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray={node.borderStyle === "dashed" ? "6,6" : "none"}
          data-outline="true"
        />
        {/* Иконка */}
        {node.id !== "docx-output" && (
          <svg
            x={node.x - 10}
            y={node.y - 28}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isAgent ? "#7dd36e" : "#FFFFFF"}
            strokeWidth="1.5"
          >
            {node.id === "request-validation" && Icons.searchCheck}
            {node.id === "business-type" && Icons.checklist}
            {node.id === "deep-research" && Icons.aiMind}
            {node.id === "data-research" && Icons.database}
            {node.id === "org-plan" && Icons.chartGraph}
            {node.id === "finance-model" && Icons.calculator}
            {node.id === "final-recalc" && Icons.refresh}
            {node.id === "content-gen" && Icons.typewriter}
          </svg>
        )}
        {/* DOCX файл с отогнутым углом */}
        {node.id === "docx-output" && (
          <g>
            <path
              d={`M ${node.x - 40} ${node.y - 30} L ${node.x - 40} ${node.y + 30} L ${node.x + 40} ${node.y + 30} L ${node.x + 40} ${node.y - 15} L ${node.x + 25} ${node.y - 30} Z`}
              fill="none"
              stroke="#7dd36e"
              strokeWidth="2"
            />
            <path
              d={`M ${node.x + 25} ${node.y - 30} L ${node.x + 40} ${node.y - 15}`}
              fill="none"
              stroke="#7dd36e"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              fill="#7dd36e"
              fontSize="11"
              fontWeight="700"
            >
              DOCX
            </text>
          </g>
        )}
        {/* Текст */}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="700"
          style={{ pointerEvents: "none" }}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={node.x} dy={i === 0 ? -5 : 15}>
              {line}
            </tspan>
          ))}
        </text>
        {node.sublabel && (
          <text
            x={node.x}
            y={node.y + 25}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
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
        paddingTop: "2rem",
        paddingBottom: "2rem",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Заголовок */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "32px",
            fontWeight: "bold",
            margin: "0 0 0.5rem 0",
            letterSpacing: "0.5px",
          }}
        >
          Лаборатория Интеллекта Upgrowplan
        </h2>
        <div
          style={{
            height: "3px",
            width: "120px",
            background: "#7dd36e",
            margin: "0 auto",
          }}
        />
      </div>

      {/* SVG диаграмма */}
      <div
        style={{
          minHeight: "700px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
        }}
      >
        <svg
          ref={svgRef}
          width="1100"
          height="650"
          viewBox="0 0 1100 650"
          style={{
            display: "block",
            minWidth: "1100px",
            filter: "drop-shadow(0 0 20px rgba(125, 211, 110, 0.1))",
          }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#FFFFFF" />
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
                data-path={`${arrow.from}-${arrow.to}`}
                opacity="0.8"
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
                    arrow.pathData.includes("M 150 80")
                      ? 190
                      : arrow.pathData.includes("M 540 80")
                        ? 595
                        : arrow.pathData.includes("M 900 330")
                          ? 920
                          : 350
                  }
                  y={
                    arrow.pathData.includes("M 540 80")
                      ? 65
                      : arrow.pathData.includes("M 150 80")
                        ? 65
                        : arrow.pathData.includes("M 900 330")
                          ? 350
                          : 380
                  }
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  style={{ pointerEvents: "none", opacity: 0.9 }}
                >
                  {arrow.label}
                </text>
              )}
            </g>
          ))}

          {/* Узлы */}
          {nodes.map((node) => renderNode(node))}
        </svg>
      </div>

      {/* Легенда */}
      <div
        style={{
          marginTop: "2.5rem",
          padding: "1.5rem 2rem",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          borderRadius: "0.75rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "2.5rem",
          justifyContent: "center",
          fontSize: "13px",
          color: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              border: "2px dashed #FFFFFF",
              borderRadius: "2px",
            }}
          />
          <span>
            <strong>Пунктирный контур:</strong> Внутренняя логика, обработка
            данных
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              border: "2px solid #FFFFFF",
              borderRadius: "2px",
            }}
          />
          <span>
            <strong>Сплошной контур:</strong> AI-агенты и генераторы контента
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              border: "2px solid #FFFFFF",
              borderRadius: "50%",
            }}
          />
          <span>
            <strong>Круг:</strong> Взаимодействие с пользователем
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              border: "2px solid #FFFFFF",
              borderRadius: "6px",
              backgroundColor: "rgba(125, 211, 110, 0.2)",
            }}
          />
          <span>
            <strong>Капсула:</strong> Context Core - центральное хранилище
          </span>
        </div>
      </div>

      {/* Копирайт */}
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "14px",
          color: "#FFFFFF",
          opacity: 0.85,
        }}
      >
        <p style={{ margin: 0, fontStyle: "italic" }}>
          Это больше, чем схема.{" "}
          <strong>Это живая экосистема, где факты побеждают домыслы</strong>.
        </p>
      </div>
    </section>
  );
};

export default IntelligenceLab;
