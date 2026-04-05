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
}

const ArchitectureDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const circlesRef = useRef<SVGCircleElement[]>([]);
  const [contextCoreFill, setContextCoreFill] = useState(0);

  // Новая раскладка узлов согласно ТЗ
  const nodes: Node[] = [
    // Вверху слева: точка входа
    {
      id: "customer-request",
      label: "Customer\nRequest",
      x: 100,
      y: 120,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "request-validation",
      label: "Request\nValidation",
      x: 280,
      y: 120,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "business-type",
      label: "Business\nType and\nParameters",
      x: 480,
      y: 120,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "deep-research",
      label: "Deep\nResearch\nAgent",
      sublabel: "Data research",
      x: 700,
      y: 120,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    // Центральный слой
    {
      id: "context-core",
      label: "Context\nCore",
      sublabel: "Redis SQL Database",
      x: 700,
      y: 380,
      type: "capsule",
      borderStyle: "solid",
    },
    {
      id: "org-plan",
      label: "Organization\nplan\nformation",
      x: 480,
      y: 380,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "finance-model",
      label: "Finance\nmodel\ncalculation",
      x: 280,
      y: 380,
      type: "rect",
      borderStyle: "dashed",
    },
    // Нижний слой
    {
      id: "customer-confirm",
      label: "Customer\nConfirmation",
      x: 480,
      y: 620,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "sceptic-agent",
      label: "Sceptic\nAgent",
      x: 700,
      y: 620,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "content-gen",
      label: "Content\nGenerator",
      x: 920,
      y: 380,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "agent-validator",
      label: "Agent\nValidator",
      x: 920,
      y: 120,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "docx",
      label: "Docx",
      x: 1080,
      y: 120,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "final-recalc",
      label: "Final\nRecalculation",
      x: 100,
      y: 620,
      type: "rect",
      borderStyle: "solid",
    },
  ];

  const arrows: Arrow[] = [
    {
      from: "customer-request",
      to: "request-validation",
      label: "RAW DATA",
      pathData: "M 150 120 L 230 120",
    },
    {
      from: "request-validation",
      to: "business-type",
      pathData: "M 330 120 L 420 120",
    },
    {
      from: "business-type",
      to: "deep-research",
      label: "DATA REQUEST",
      pathData: "M 540 120 L 640 120",
    },
    {
      from: "deep-research",
      to: "context-core",
      pathData: "M 700 175 L 700 295",
    },
    {
      from: "context-core",
      to: "org-plan",
      pathData: "M 640 380 L 540 380",
    },
    {
      from: "org-plan",
      to: "finance-model",
      pathData: "M 420 380 L 330 380",
    },
    {
      from: "finance-model",
      to: "customer-confirm",
      pathData: "M 280 435 L 430 565",
    },
    {
      from: "context-core",
      to: "content-gen",
      label: "final data",
      pathData: "M 760 380 L 860 380",
    },
    {
      from: "context-core",
      to: "customer-confirm",
      label: "final data",
      pathData: "M 640 420 L 540 565",
    },
    {
      from: "customer-confirm",
      to: "context-core",
      label: "financial\ndata",
      pathData: "M 540 565 Q 600 470 640 420",
    },
    {
      from: "content-gen",
      to: "agent-validator",
      label: "if NO",
      pathData: "M 920 335 L 920 175",
    },
    {
      from: "agent-validator",
      to: "content-gen",
      pathData: "M 960 175 Q 1000 250 960 335",
    },
    {
      from: "agent-validator",
      to: "docx",
      label: "if OK",
      pathData: "M 980 120 L 1030 120",
    },
    {
      from: "sceptic-agent",
      to: "customer-confirm",
      pathData: "M 640 620 L 540 620",
      isBidirectional: true,
    },
    {
      from: "sceptic-agent",
      to: "final-recalc",
      pathData: "M 150 620 L 600 620",
      isBidirectional: true,
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
        duration: 2,
        onUpdate: () => {
          setContextCoreFill(fillObj.value);
        },
      },
      0,
    );

    // Создание и анимация кружков
    arrows.forEach((arrow, idx) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#7dd36e");
      circle.setAttribute("opacity", "0.8");
      circle.setAttribute("filter", "url(#glow)");

      const pathElement = svgRef.current?.querySelector(
        `path[data-path="${arrow.from}-${arrow.to}"]`,
      ) as SVGPathElement | null;

      if (pathElement && svgRef.current) {
        svgRef.current.appendChild(circle);
        circlesRef.current.push(circle);

        const isLoop =
          (arrow.from === "content-gen" && arrow.to === "agent-validator") ||
          (arrow.from === "agent-validator" && arrow.to === "content-gen");

        // Ускорение в циклах
        const duration = isLoop ? 1.5 : 2.5;
        const delay = (idx % 5) * 0.3;

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
      if (node.isAgent) {
        const outline = svgRef.current?.querySelector(
          `g[data-node-id="${node.id}"] [data-outline]`,
        );
        if (outline) {
          gsap.to(outline, {
            strokeWidth: 3.5,
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

  // Ховер-эффекты
  const handleNodeHover = (nodeId: string, isEnter: boolean) => {
    const node = svgRef.current?.querySelector(`[data-node-id="${nodeId}"]`);
    const outline = node?.querySelector("[data-outline]");
    const texts = node?.querySelectorAll("text");

    const color = isEnter ? "#7dd36e" : "#FFFFFF";
    const strokeWidth = isEnter ? 3.5 : 3;

    if (outline) {
      gsap.to(outline, { stroke: color, strokeWidth, duration: 0.2 });
    }

    texts?.forEach((text) => {
      gsap.to(text, { fill: color, duration: 0.2 });
    });

    // Специальный интерактив для Sceptic Agent
    if (nodeId === "sceptic-agent" && isEnter) {
      arrows
        .filter(
          (a) =>
            (a.from === "sceptic-agent" || a.to === "sceptic-agent") &&
            (a.isBidirectional || a.from === "sceptic-agent"),
        )
        .forEach((arrow) => {
          const arrowElem = svgRef.current?.querySelector(
            `path[data-path="${arrow.from}-${arrow.to}"]`,
          );
          if (arrowElem) {
            gsap.to(arrowElem, {
              stroke: "#7dd36e",
              strokeWidth: 5,
              duration: 0.2,
            });
          }
        });
    } else if (nodeId === "sceptic-agent" && !isEnter) {
      arrows
        .filter((a) => a.from === "sceptic-agent" || a.to === "sceptic-agent")
        .forEach((arrow) => {
          const arrowElem = svgRef.current?.querySelector(
            `path[data-path="${arrow.from}-${arrow.to}"]`,
          );
          if (arrowElem) {
            gsap.to(arrowElem, {
              stroke: "#FFFFFF",
              strokeWidth: 4,
              duration: 0.2,
            });
          }
        });
    } else {
      // Стандартный ховер
      arrows.forEach((arrow) => {
        if (arrow.from === nodeId || arrow.to === nodeId) {
          const arrowElem = svgRef.current?.querySelector(
            `path[data-path="${arrow.from}-${arrow.to}"]`,
          );
          if (arrowElem) {
            gsap.to(arrowElem, {
              stroke: color,
              strokeWidth: isEnter ? 5 : 4,
              duration: 0.2,
            });
          }
        }
      });
    }
  };

  const renderNode = (node: Node) => {
    const baseProps = {
      "data-node-id": node.id,
      onMouseEnter: () => handleNodeHover(node.id, true),
      onMouseLeave: () => handleNodeHover(node.id, false),
      style: { cursor: "pointer" },
    };

    if (node.type === "circle") {
      const lines = node.label.split("\n");
      return (
        <g key={node.id} {...baseProps}>
          <circle
            cx={node.x}
            cy={node.y}
            r="50"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            data-outline="true"
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="700"
            style={{ pointerEvents: "none" }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x={node.x} dy={i === 0 ? -8 : 20}>
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
        <g key={node.id} {...baseProps}>
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
          {/* Фоновое заполнение */}
          <rect
            x={node.x - 65}
            y={node.y - 45}
            width="130"
            height="90"
            rx="25"
            fill={`url(#contextGradient)`}
            opacity="0.4"
          />
          {/* Контур */}
          <rect
            x={node.x - 65}
            y={node.y - 45}
            width="130"
            height="90"
            rx="25"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            data-outline="true"
          />
          <text
            x={node.x}
            y={node.y - 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="700"
            style={{ pointerEvents: "none" }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x={node.x} dy={i === 0 ? 0 : 20}>
                {line}
              </tspan>
            ))}
          </text>
          {node.sublabel && (
            <text
              x={node.x}
              y={node.y + 18}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              fontSize="12"
              style={{ pointerEvents: "none", opacity: 0.8 }}
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
      <g key={node.id} {...baseProps}>
        <rect
          x={node.x - 65}
          y={node.y - 40}
          width="130"
          height="80"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeDasharray={node.borderStyle === "dashed" ? "8,8" : "none"}
          data-outline="true"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFFFFF"
          fontSize="16"
          fontWeight="700"
          style={{ pointerEvents: "none" }}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={node.x} dy={i === 0 ? -8 : 20}>
              {line}
            </tspan>
          ))}
        </text>
        {node.sublabel && (
          <text
            x={node.x}
            y={node.y + 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="12"
            style={{ pointerEvents: "none", opacity: 0.7 }}
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
      }}
    >
      {/* Заголовок */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0",
          }}
        >
          Архитектура живого бизнес-плана
        </h2>
      </div>

      <div
        style={{
          minHeight: "900px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* SVG диаграмма */}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            flex: 1,
          }}
        >
          <svg
            ref={svgRef}
            width="1200"
            height="800"
            viewBox="0 0 1200 800"
            style={{
              display: "block",
              margin: "0 auto",
              minWidth: "1200px",
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
                  strokeWidth="4"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  data-path={`${arrow.from}-${arrow.to}`}
                  style={{ transition: "stroke 0.2s ease" }}
                />
                {arrow.isBidirectional && (
                  <path
                    d={arrow.pathData}
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    fill="none"
                    markerStart="url(#arrowhead)"
                    style={{ opacity: 0.5 }}
                  />
                )}
                {arrow.label && (
                  <text
                    x={
                      arrow.pathData.includes("Q")
                        ? 550
                        : arrow.pathData.includes("M 640 420")
                          ? 580
                          : 350
                    }
                    y={
                      arrow.pathData.includes("M 700 175")
                        ? 240
                        : arrow.pathData.includes("M 640 420")
                          ? 480
                          : 100
                    }
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="700"
                    style={{ pointerEvents: "none", opacity: 0.95 }}
                  >
                    {arrow.label.split("\n").map((line, i) => (
                      <tspan
                        key={i}
                        x={
                          arrow.pathData.includes("Q")
                            ? 550
                            : arrow.pathData.includes("M 640 420")
                              ? 580
                              : 350
                        }
                        dy={i === 0 ? 0 : 15}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                )}
              </g>
            ))}

            {/* Узлы */}
            {nodes.map((node) => renderNode(node))}
          </svg>
        </div>
      </div>

      {/* Легенда */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          fontSize: "13px",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px dashed #FFFFFF",
              borderRadius: "2px",
            }}
          />
          <span>
            <strong>Пунктирный контур:</strong> Внутренняя логика и обработка
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #FFFFFF",
              borderRadius: "2px",
            }}
          />
          <span>
            <strong>Сплошной контур:</strong> AI-агенты и генераторы контента
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #FFFFFF",
              borderRadius: "50%",
            }}
          />
          <span>
            <strong>Круг:</strong> Взаимодействие с пользователем
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #FFFFFF",
              borderRadius: "8px",
              backgroundColor: "rgba(125, 211, 110, 0.2)",
            }}
          />
          <span>
            <strong>Капсула:</strong> Context Core - центральное хранилище
          </span>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureDiagram;
