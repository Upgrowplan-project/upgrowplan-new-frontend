"use client";

import { Card, Badge, Button } from "react-bootstrap";
import { FiClock, FiX } from "react-icons/fi";
import { useEffect, useRef } from "react";

export type LogLevel = "info" | "success" | "warning" | "error";

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
}

interface EventLoggerProps {
  logs: LogEntry[];
  onClear: () => void;
}

export default function EventLogger({ logs, onClear }: EventLoggerProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <FiClock className="me-2" />
          <strong>Журнал событий</strong>
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClear}
          disabled={logs.length === 0}
        >
          <FiX className="me-1" />
          Очистить
        </Button>
      </Card.Header>
      <Card.Body
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        {logs.length === 0 ? (
          <p className="text-muted text-center mb-0">
            События будут отображаться здесь
          </p>
        ) : (
          <div>
            {logs.map((log, index) => (
              <div
                key={index}
                className="d-flex align-items-start mb-2 pb-2"
                style={{ borderBottom: "1px solid #dee2e6" }}
              >
                <Badge
                  bg={getLevelColor(log.level)}
                  className="me-2"
                  style={{ minWidth: "60px", fontSize: "0.7rem" }}
                >
                  {formatTime(log.timestamp)}
                </Badge>
                <span style={{ fontSize: "0.9rem" }}>{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
