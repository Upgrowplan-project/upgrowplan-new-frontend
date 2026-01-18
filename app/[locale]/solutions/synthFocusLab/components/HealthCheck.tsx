"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { FiActivity, FiRefreshCw, FiCheck, FiX, FiKey, FiSearch } from "react-icons/fi";

interface ServiceStatus {
  name: string;
  url: string;
  port: number;
  status: "checking" | "online" | "offline";
  lastCheck?: Date;
}

interface OpenAIStatus {
  configured: boolean;
  valid: boolean;
  model?: string;
}

interface HealthCheckProps {
  onLog?: (message: string, level: "info" | "success" | "error") => void;
  onStatusChange?: (allReady: boolean) => void;
  locale?: "ru" | "en";
}

export default function HealthCheck({
  onLog,
  onStatusChange,
  locale = "ru",
}: HealthCheckProps) {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Synth Focus Lab Backend",
      url: "http://localhost:8004",  // UPDATED: Use correct port
      port: 8004,
      status: "checking",
    },
  ]);

  const [openaiStatus, setOpenaiStatus] = useState<OpenAIStatus>({
    configured: false,
    valid: false,
  });

  const [deepResearchStatus, setDeepResearchStatus] = useState<"checking" | "online" | "offline">("checking");

  const [isChecking, setIsChecking] = useState(false);

  const checkService = async (service: ServiceStatus) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${service.url}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const checkOpenAI = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Use the Synth Focus Lab backend health endpoint (first service)
      const backendUrl = services[0]?.url || "http://localhost:8004";
      const response = await fetch(`${backendUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          openai: {
            configured: data.openai_configured || false,
            valid: data.openai_valid || false,
            model: data.openai_model,
          },
          deepResearch: data.deep_research_agent_available ? "online" : "offline",
        };
      }
    } catch (error) {
      console.error("Health check failed:", error);
    }

    return {
      openai: { configured: false, valid: false },
      deepResearch: "offline" as const,
    };
  };

  const checkAllServices = async () => {
    setIsChecking(true);

    // Check services (without logging)
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        const isOnline = await checkService(service);
        return {
          ...service,
          status: isOnline ? "online" : "offline",
          lastCheck: new Date(),
        } as ServiceStatus;
      })
    );

    // Check OpenAI and Deep Research Agent
    const healthData = await checkOpenAI();

    setServices(updatedServices);
    setOpenaiStatus(healthData.openai);
    setDeepResearchStatus(healthData.deepResearch);

    // Check if all services are ready
    const allServicesOnline = updatedServices.every(
      (s) => s.status === "online"
    );
    const openaiReady = healthData.openai.configured && healthData.openai.valid;
    const deepResearchReady = healthData.deepResearch === "online";
    const allReady = allServicesOnline && openaiReady && deepResearchReady;

    // Notify parent component
    onStatusChange?.(allReady);

    setIsChecking(false);
  };

  useEffect(() => {
    checkAllServices();
    // Auto-check every 30 seconds
    const interval = setInterval(checkAllServices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Translations
  const translations = {
    ru: {
      title: "Статус сервисов",
      refresh: "Обновить",
      backend: "Synth Focus Lab Backend",
      openai: "OpenAI",
      deepResearch: "Deep Research Agent",
      online: "Online",
      offline: "Offline",
      checking: "Проверка...",
      notConfigured: "Не настроен",
      active: "Активен",
      keyError: "Ошибка ключа",
    },
    en: {
      title: "Service Status",
      refresh: "Refresh",
      backend: "Synth Focus Lab Backend",
      openai: "OpenAI",
      deepResearch: "Deep Research Agent",
      online: "Online",
      offline: "Offline",
      checking: "Checking...",
      notConfigured: "Not Configured",
      active: "Active",
      keyError: "Key Error",
    },
  };

  const getStatusBadge = (status: ServiceStatus["status"], translationKey: "online" | "offline" | "checking") => {
    const t = translations[locale];
    switch (status) {
      case "online":
        return (
          <Badge bg="success">
            <FiCheck className="me-1" />
            {t.online}
          </Badge>
        );
      case "offline":
        return (
          <Badge bg="danger">
            <FiX className="me-1" />
            {t.offline}
          </Badge>
        );
      default:
        return <Badge bg="secondary">{t.checking}</Badge>;
    }
  };

  const getOpenAIBadge = () => {
    const t = translations[locale];
    if (!openaiStatus.configured) {
      return (
        <Badge bg="warning">
          <FiX className="me-1" />
          {t.notConfigured}
        </Badge>
      );
    }
    if (openaiStatus.valid) {
      return (
        <Badge bg="success">
          <FiCheck className="me-1" />
          {t.active}
        </Badge>
      );
    }
    return (
      <Badge bg="danger">
        <FiX className="me-1" />
        {t.keyError}
      </Badge>
    );
  };

  const t = translations[locale];

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <FiActivity className="me-2" />
          <strong>{t.title}</strong>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={checkAllServices}
          disabled={isChecking}
        >
          <FiRefreshCw className={`me-1 ${isChecking ? "spin" : ""}`} />
          {t.refresh}
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          {/* Backend Service Status */}
          {services.map((service, index) => (
            <div key={index} className="d-flex align-items-center gap-2">
              <span className="text-muted">{t.backend}:</span>
              {getStatusBadge(service.status, service.status)}
            </div>
          ))}

          {/* OpenAI API Status */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">
              <FiKey className="me-1" style={{ fontSize: "14px" }} />
              {t.openai}:
            </span>
            {getOpenAIBadge()}
          </div>

          {/* Deep Research Agent Status */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">
              <FiSearch className="me-1" style={{ fontSize: "14px" }} />
              {t.deepResearch}:
            </span>
            {getStatusBadge(deepResearchStatus, deepResearchStatus)}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
