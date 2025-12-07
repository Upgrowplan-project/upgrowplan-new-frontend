"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { FiActivity, FiRefreshCw, FiCheck, FiX, FiKey } from "react-icons/fi";

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
}

export default function HealthCheck({
  onLog,
  onStatusChange,
}: HealthCheckProps) {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Synth Focus Lab Backend",
      url: "http://localhost:8000",
      port: 8000,
      status: "checking",
    },
    // Blueprint service check disabled - not required for testing
    // {
    //   name: "Blueprint Service",
    //   url: "http://localhost:8003",
    //   port: 8003,
    //   status: "checking",
    // },
  ]);

  const [openaiStatus, setOpenaiStatus] = useState<OpenAIStatus>({
    configured: false,
    valid: false,
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkService = async (service: ServiceStatus): Promise<boolean> => {
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

  const checkOpenAI = async (): Promise<OpenAIStatus> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Use the Synth Focus Lab backend health endpoint (first service)
      const backendUrl = services[0]?.url || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          configured: data.openai_configured || false,
          valid: data.openai_valid || false,
          model: data.openai_model,
        };
      }
    } catch (error) {
      console.error("OpenAI check failed:", error);
    }

    return { configured: false, valid: false };
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

    // Check OpenAI
    const openai = await checkOpenAI();

    setServices(updatedServices);
    setOpenaiStatus(openai);

    // Check if all services are ready
    const allServicesOnline = updatedServices.every(
      (s) => s.status === "online"
    );
    const openaiReady = openai.configured && openai.valid;
    const allReady = allServicesOnline && openaiReady;

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

  const getStatusBadge = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge bg="success">
            <FiCheck className="me-1" />
            Online
          </Badge>
        );
      case "offline":
        return (
          <Badge bg="danger">
            <FiX className="me-1" />
            Offline
          </Badge>
        );
      default:
        return <Badge bg="secondary">Проверка...</Badge>;
    }
  };

  const getOpenAIBadge = () => {
    if (!openaiStatus.configured) {
      return (
        <Badge bg="warning">
          <FiX className="me-1" />
          Не настроен
        </Badge>
      );
    }
    if (openaiStatus.valid) {
      return (
        <Badge bg="success">
          <FiCheck className="me-1" />
          Активен
        </Badge>
      );
    }
    return (
      <Badge bg="danger">
        <FiX className="me-1" />
        Ошибка ключа
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <FiActivity className="me-2" />
          <strong>Статус сервисов</strong>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={checkAllServices}
          disabled={isChecking}
        >
          <FiRefreshCw className={`me-1 ${isChecking ? "spin" : ""}`} />
          Обновить
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          {services.map((service, index) => (
            <div key={index} className="d-flex align-items-center gap-2">
              <span className="text-muted">{service.name}:</span>
              {getStatusBadge(service.status)}
            </div>
          ))}

          {/* OpenAI API Status */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">
              <FiKey className="me-1" style={{ fontSize: "14px" }} />
              OpenAI:
            </span>
            {getOpenAIBadge()}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
