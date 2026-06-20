"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button,
  Spinner,
  Modal,
  ListGroup,
  Table,
} from "react-bootstrap";
import { useTranslations } from "next-intl";
import { useMonitoring, useMonitoringStats } from "../hooks/useMonitoring";
import { useEmails } from "../hooks/useEmails";
import { AlertsList } from "../components/AlertsList";
import { ServiceHistoryChart } from "../components/ServiceHistoryChart";
import { RatingsDashboard } from "../components/RatingsDashboard";
import { ResearchReportsDashboard } from "../components/ResearchReportsDashboard";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import dynamic from "next/dynamic";
import { Service, MonitoringData } from "../types/monitoring";

const QualityLabDashboard = dynamic(
  () =>
    import("../components/QualityLabDashboard").then((m) => m.QualityLabDashboard),
  { ssr: false }
);
import Header from "@/components/Header";

const BRAND = "#1e6078";

type SectionKey =
  | "health"
  | "analytics"
  | "reports"
  | "ratings"
  | "emails"
  | "quality-lab";

const statusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "up":
    case "healthy":
      return "success";
    case "degraded":
    case "warning":
      return "warning";
    case "down":
    case "critical":
      return "danger";
    default:
      return "secondary";
  }
};

// Короткая полезная метрика сервиса для status-first списка.
const serviceMetric = (s: Service): string => {
  const a = s.additional_info || {};
  if (a.usage_percent != null) {
    return `$${a.monthly_usage_usd ?? "—"}${a.monthly_limit_usd ? ` / $${a.monthly_limit_usd}` : ""}`;
  }
  if (a.used_percent !== undefined) {
    return `${a.used_mb} MB (${a.used_percent}%)`;
  }
  if (a.dynos_running !== undefined) {
    return `${a.dynos_running}/${a.dynos_total} dynos`;
  }
  if (a.models_available !== undefined) {
    return `${a.models_available} models`;
  }
  return s.response_time != null ? `${(s.response_time * 1000).toFixed(0)} ms` : "—";
};

export const MonitoringDashboard: React.FC = () => {
  const t = useTranslations("monitoring");
  const {
    data: rawData,
    loading,
    error,
    wsConnected,
    refresh,
    triggerHealthCheck,
    resolveAlert,
  } = useMonitoring();

  const { stats } = useMonitoringStats();

  // Каркас рисуется сразу, секции наполняются по мере загрузки (без блокирующего спиннера).
  const data: MonitoringData =
    rawData ?? {
      timestamp: "",
      services: [],
      alerts: [],
      activity: { total_users_24h: 0, total_requests_24h: 0, avg_response_time: 0 },
      overall_health: "unknown",
    };
  const isInitialLoading = loading && !rawData;

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("health");
  const [checkingNow, setCheckingNow] = useState(false);

  const handleCheckNow = async () => {
    setCheckingNow(true);
    try {
      await triggerHealthCheck();
    } finally {
      setCheckingNow(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    await resolveAlert(alertId);
  };

  const servicesUp = data.services.filter(
    (s) => statusColor(s.status) === "success"
  ).length;
  const servicesTotal = data.services.length;

  const sections: { key: SectionKey; label: string; icon: string }[] = [
    { key: "health", label: "Здоровье системы", icon: "🏥" },
    { key: "analytics", label: "Analytics", icon: "📈" },
    { key: "reports", label: "Reports", icon: "📄" },
    { key: "ratings", label: "Оценки пользователей", icon: "⭐" },
    { key: "emails", label: "Мониторинг почты", icon: "✉️" },
    { key: "quality-lab", label: "Quality Lab", icon: "🧪" },
  ];

  const EmailsSection: React.FC = () => {
    const { emails, loading: emailsLoading, error: emailsError, refresh: refreshEmails } =
      useEmails();
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0 text-brand">✉️ {t("tabs.emails")}</h4>
          <Button variant="outline-secondary" size="sm" onClick={refreshEmails}>
            {t("buttons.refresh")}
          </Button>
        </div>
        {emailsLoading && <Spinner animation="border" />}
        {emailsError && <Alert variant="danger">{emailsError}</Alert>}
        <ListGroup className="shadow-sm">
          {emails.map((e) => (
            <ListGroup.Item
              key={e.id}
              className="d-flex justify-content-between align-items-start border-0 border-bottom"
            >
              <div>
                <div className="fw-semibold">{e.subject || "(no subject)"}</div>
                <div className="text-muted small">
                  {e.from} • {e.received_at ? new Date(e.received_at).toLocaleString() : ""}
                </div>
              </div>
              <div className="text-nowrap">
                <Badge bg={e.status === "new" ? "danger" : "secondary"} className="me-2">
                  {e.status}
                </Badge>
                <Button size="sm" variant="outline-primary" href={`/ru/monitoring/emails/${e.id}`}>
                  Open
                </Button>
              </div>
            </ListGroup.Item>
          ))}
          {emails.length === 0 && !emailsLoading && (
            <ListGroup.Item className="text-center text-muted py-4 border-0">
              Входящих писем пока нет.
            </ListGroup.Item>
          )}
        </ListGroup>
      </div>
    );
  };

  const HealthSection: React.FC = () => (
    <div>
      {/* KPI cards (shadcn-style) */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">{t("status.overall")}</div>
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    display: "inline-block",
                    backgroundColor: `var(--bs-${statusColor(data.overall_health)})`,
                  }}
                />
                <span className="fs-4 fw-bold text-capitalize">
                  {data.overall_health}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">{t("stats.services")}</div>
              <div className="fs-3 fw-bold">
                {servicesUp}
                <span className="text-muted fs-6">/{servicesTotal} up</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">{t("stats.alerts")}</div>
              <div
                className={`fs-3 fw-bold ${
                  (stats?.active_alerts ?? 0) > 0 ? "text-danger" : "text-success"
                }`}
              >
                {stats?.active_alerts ?? 0}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small mb-1">{t("stats.uptime")}</div>
              <div className="fs-3 fw-bold text-success">
                {stats?.uptime_percentage ?? "—"}%
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active alerts */}
      {data.alerts.length > 0 && (
        <div className="mb-4">
          <h6 className="text-brand mb-2">{t("sections.alerts")}</h6>
          <AlertsList
            alerts={data.alerts}
            onResolve={handleResolveAlert}
            showResolveButton={true}
          />
        </div>
      )}

      {/* Status-first service list */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h6 className="mb-0 text-brand">{t("sections.services")}</h6>
          <span className="text-muted small">{servicesTotal} сервисов</span>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <tbody>
              {data.services.map((s, i) => (
                <tr
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedService(s)}
                >
                  <td style={{ width: 36 }} className="ps-3">
                    <span
                      title={s.status}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        display: "inline-block",
                        backgroundColor: `var(--bs-${statusColor(s.status)})`,
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{s.name}</div>
                    <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                      {s.type}
                    </div>
                  </td>
                  <td className="text-muted small">{serviceMetric(s)}</td>
                  <td className="text-end pe-3 text-muted" style={{ fontSize: "0.72rem" }}>
                    {s.last_checked
                      ? new Date(s.last_checked).toLocaleTimeString()
                      : ""}
                  </td>
                </tr>
              ))}
              {servicesTotal === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    {isInitialLoading
                      ? "Загрузка статусов…"
                      : "Нет данных. Нажмите «Проверить сейчас»."}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Activity */}
      <Row className="g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">{t("activity.users")}</div>
              <div className="fs-4 fw-bold">{data.activity.total_users_24h}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">{t("activity.requests")}</div>
              <div className="fs-4 fw-bold">{data.activity.total_requests_24h}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">{t("activity.response_time")}</div>
              <div className="fs-4 fw-bold text-brand">
                {data.activity.avg_response_time.toFixed(0)} ms
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "reports":
        return <ResearchReportsDashboard />;
      case "ratings":
        return <RatingsDashboard />;
      case "emails":
        return <EmailsSection />;
      case "quality-lab":
        return <QualityLabDashboard />;
      case "health":
      default:
        return <HealthSection />;
    }
  };

  return (
    <>
      <Header />
      <Container
        fluid
        className="p-4"
        style={{ backgroundColor: "#f8f9fb", minHeight: "100vh" }}
      >
        {/* Toolbar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 className="mb-1 text-brand">{t("title")}</h1>
            <p className="text-muted mb-0">
              {t("subtitle")}
              <Badge bg={wsConnected ? "success" : "warning"} className="ms-2">
                {wsConnected ? `● ${t("status.live")}` : `○ ${t("status.connecting")}`}
              </Badge>
            </p>
          </div>
          <div className="d-flex gap-2">
            {activeSection === "health" && (
              <Button
                onClick={handleCheckNow}
                disabled={checkingNow}
                style={{ backgroundColor: BRAND, border: "none" }}
              >
                {checkingNow ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    {t("buttons.checking")}
                  </>
                ) : (
                  <>🔄 {t("buttons.check_now")}</>
                )}
              </Button>
            )}
            <Button variant="outline-secondary" onClick={refresh}>
              {t("buttons.refresh")}
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            variant="warning"
            className="d-flex justify-content-between align-items-center py-2"
          >
            <span>⚠️ Не удалось обновить данные мониторинга: {error}</span>
            <Button size="sm" variant="outline-secondary" onClick={refresh}>
              Повторить
            </Button>
          </Alert>
        )}
        {isInitialLoading && !error && (
          <div className="d-flex align-items-center gap-2 text-muted mb-3">
            <Spinner animation="border" size="sm" />
            <span>Загрузка данных мониторинга…</span>
          </div>
        )}

        {/* Left options menu + center content */}
        <Row className="g-4">
          <Col lg={3} xs={12}>
            <Card className="border-0 shadow-sm" style={{ position: "sticky", top: 16 }}>
              <Card.Header className="bg-white border-0 py-3">
                <h6 className="mb-0 text-muted">Разделы</h6>
              </Card.Header>
              <ListGroup variant="flush">
                {sections.map((s) => {
                  const active = activeSection === s.key;
                  return (
                    <ListGroup.Item
                      key={s.key}
                      action
                      active={active}
                      onClick={() => setActiveSection(s.key)}
                      style={
                        active
                          ? { backgroundColor: BRAND, borderColor: BRAND }
                          : { cursor: "pointer" }
                      }
                    >
                      <span className="me-2">{s.icon}</span>
                      {s.label}
                      {s.key === "health" && (
                        <span
                          className="float-end"
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            marginTop: 6,
                            display: "inline-block",
                            backgroundColor: `var(--bs-${statusColor(data.overall_health)})`,
                          }}
                        />
                      )}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
              <Card.Footer className="bg-white border-0 py-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100"
                  href={
                    typeof window !== "undefined" &&
                    window.location.pathname.startsWith("/ru")
                      ? "/ru/account"
                      : "/account"
                  }
                >
                  👤 Аккаунт
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg={9} xs={12}>
            {renderSection()}
          </Col>
        </Row>
      </Container>

      {/* Service history modal */}
      <Modal
        show={!!selectedService}
        onHide={() => setSelectedService(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedService?.name} — история</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <>
              {selectedService.error && (
                <Alert variant="danger" className="py-2 small">
                  {selectedService.error}
                </Alert>
              )}
              <ServiceHistoryChart serviceName={selectedService.name} />
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
