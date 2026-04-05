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

  const nodes: Node[] = [
    {
      id: "customer-request",
      label: "Customer\nRequest",
      x: 80,
      y: 250,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "request-validation",
      label: "Request\nValidation",
      x: 270,
      y: 250,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "business-type",
      label: "Business\nType\nand\nparameters",
      x: 480,
      y: 250,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "deep-research",
      label: "Deep\nResearch\nAgent",
      sublabel: "Data research",
      x: 700,
      y: 250,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "context-core",
      label: "Context\nCore",
      sublabel: "Redis SQL db",
      x: 700,
      y: 500,
      type: "capsule",
      borderStyle: "solid",
    },
    {
      id: "org-plan",
      label: "Organization\nplan\nformation",
      x: 480,
      y: 500,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "finance-model",
      label: "Finance\nmodel\ncalculation",
      x: 270,
      y: 500,
      type: "rect",
      borderStyle: "dashed",
    },
    {
      id: "customer-confirm",
      label: "Customer\nconfirmation",
      x: 700,
      y: 750,
      type: "circle",
      borderStyle: "solid",
    },
    {
      id: "final-recalc",
      label: "Final\nrecalculation",
      x: 920,
      y: 750,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "sceptic-agent",
      label: "Sceptic\nAgent",
      x: 80,
      y: 750,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "content-gen",
      label: "Content\nGenerator",
      x: 920,
      y: 500,
      type: "rect",
      borderStyle: "solid",
    },
    {
      id: "agent-validator",
      label: "Agent\nValidator",
      x: 920,
      y: 250,
      type: "rect",
      borderStyle: "solid",
      isAgent: true,
    },
    {
      id: "docx",
      label: "Docx",
      x: 1100,
      y: 250,
      type: "rect",
      borderStyle: "solid",
    },
  ];

  const arrows: Arrow[] = [
    {
      from: "customer-request",
      to: "request-validation",
      label: "RAW DATA",
      pathData: "M 130 250 L 220 250",
    },
    {
      from: "request-validation",
      to: "business-type",
      pathData: "M 330 250 L 420 250",
    },
    {
      from: "business-type",
      to: "deep-research",
      label: "DATA REQUEST",
      pathData: "M 540 250 L 640 250",
    },
    {
      from: "deep-research",
      to: "context-core",
      pathData: "M 700 305 L 700 420",
    },
    {
      from: "context-core",
      to: "org-plan",
      pathData: "M 640 500 L 540 500",
    },
    {
      from: "org-plan",
      to: "finance-model",
      pathData: "M 420 500 L 330 500",
    },
    {
      from: "finance-model",
      to: "customer-confirm",
      pathData: "M 270 555 L 655 695",
    },
    {
      from: "context-core",
      to: "content-gen",
      label: "final data",
      pathData: "M 760 500 L 860 500",
    },
    {
      from: "context-core",
      to: "customer-confirm",
      label: "final data",
      pathData: "M 700 555 L 700 695",
    },
    {
      from: "customer-confirm",
      to: "context-core",
      label: "financial\ndata",
      pathData: "M 745 695 Q 800 600 760 555",
    },
    {
      from: "content-gen",
      to: "agent-validator",
      label: "if NO",
      pathData: "M 920 445 L 920 305",
    },
    {
      from: "agent-validator",
      to: "content-gen",
      pathData: "M 960 305 Q 990 375 960 445",
    },
    {
      from: "agent-validator",
      to: "docx",
      label: "if OK",
      pathData: "M 980 250 L 1050 250",
    },
    {
      from: "final-recalc",
      to: "sceptic-agent",
      pathData: "M 850 750 Q 500 750 180 750",
      isBidirectional: true,
    },
    {
      from: "final-recalc",
      to: "customer-confirm",
      pathData: "M 860 750 L 750 750",
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

    // Создание и анимация кружков
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

        const isLoop =
          (arrow.from === "content-gen" && arrow.to === "agent-validator") ||
          (arrow.from === "agent-validator" && arrow.to === "content-gen");

        const duration = isLoop ? 3 : 2;
        const delay = (idx % 5) * 0.4;

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

    arrows.forEach((arrow) => {
      if (arrow.from === nodeId || arrow.to === nodeId) {
        const arrowElem = svgRef.current?.querySelector(
          `path[data-path="${arrow.from}-${arrow.to}"]`,
        );
        if (arrowElem) {
          gsap.to(arrowElem, { stroke: color, duration: 0.2 });
        }
      }
    });
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
        paddingTop: "3rem",
        paddingBottom: "3rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{ minHeight: "900px", display: "flex", alignItems: "center" }}
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
            width="1200"
            height="900"
            viewBox="0 0 1200 900"
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
                        : arrow.pathData.includes("M 700 555")
                          ? 620
                          : 350
                    }
                    y={
                      arrow.pathData.includes("M 700 305")
                        ? 350
                        : arrow.pathData.includes("M 700 555")
                          ? 620
                          : 230
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
                            : arrow.pathData.includes("M 700 555")
                              ? 620
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

            {nodes.map((node) => renderNode(node))}
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureDiagram;
