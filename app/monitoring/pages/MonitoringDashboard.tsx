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
  Tabs,
  Tab,
} from "react-bootstrap";
import { useTranslations } from "next-intl";
import { useMonitoring, useMonitoringStats } from "../hooks/useMonitoring";
import { useEmails } from "../hooks/useEmails";
import { ServiceCard } from "../components/ServiceCard";
import { AlertsList } from "../components/AlertsList";
import { ServiceHistoryChart } from "../components/ServiceHistoryChart";
import { RatingsDashboard } from "../components/RatingsDashboard";
import { Service } from "../types/monitoring";
import Header from "@/components/Header";

export const MonitoringDashboard: React.FC = () => {
  const t = useTranslations("monitoring");
  const {
    data,
    loading,
    error,
    wsConnected,
    refresh,
    triggerHealthCheck,
    resolveAlert,
  } = useMonitoring();

  const { stats } = useMonitoringStats();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<string>("health");
  const [checkingNow, setCheckingNow] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "up":
      case "healthy":
        return "✅";
      case "degraded":
      case "warning":
        return "⚠️";
      case "down":
      case "critical":
        return "❌";
      default:
        return "❓";
    }
  };

  const handleCheckNow = async () => {
    setCheckingNow(true);
    try {
      await triggerHealthCheck();
    } finally {
      setCheckingNow(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    await resolveAlert(alertId);
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  if (loading && !data) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Title>Error Loading Dashboard</Alert.Title>
          {error ||
            "An unknown error occurred while connecting to the monitoring service."}
          <div className="mt-3">
            <Button variant="outline-danger" onClick={refresh}>
              Try Again
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const EmailsTab: React.FC = () => {
    const {
      emails,
      loading: emailsLoading,
      error: emailsError,
      refresh,
    } = useEmails();

    return (
      <div>
        <div className="d-flex justify-content-between mb-3">
          <h4>Inbox</h4>
          <div>
            <Button variant="outline-secondary" onClick={refresh}>
              Refresh
            </Button>
          </div>
        </div>

        {emailsLoading && <Spinner animation="border" />}
        {emailsError && <Alert variant="danger">{emailsError}</Alert>}

        <div className="list-group">
          {emails.map((e) => (
            <div
              key={e.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <div className="fw-bold">{e.subject || "(no subject)"}</div>
                <div className="text-muted small">
                  From: {e.from} •{" "}
                  {e.received_at
                    ? new Date(e.received_at).toLocaleString()
                    : ""}
                </div>
              </div>
              <div>
                <Badge
                  bg={e.status === "new" ? "danger" : "secondary"}
                  className="me-2"
                >
                  {e.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline-primary"
                  href={`/ru/monitoring/emails/${e.id}`}
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Container
        fluid
        className="p-4"
        style={{ backgroundColor: "#f8f9fb", minHeight: "100vh" }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1 text-brand">{t("title")}</h1>
            <p className="text-muted mb-0">
              {t("subtitle")}
              {wsConnected && (
                <Badge bg="success" className="ms-2">
                  ● {t("status.live")}
                </Badge>
              )}
              {!wsConnected && (
                <Badge bg="warning" className="ms-2">
                  ○ {t("status.connecting")}
                </Badge>
              )}
            </p>
          </div>

          <div className="d-flex gap-2">
            {activeTab === "health" && (
              <Button
                variant="primary"
                onClick={handleCheckNow}
                disabled={checkingNow}
                style={{ backgroundColor: "#1e6078", border: "none" }}
              >
                {checkingNow ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
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

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "health")}
          className="mb-4 custom-tabs"
        >
          <Tab eventKey="health" title={`🏥 ${t("tabs.health")}`}>
            <div className="mt-4">
              {/* Overall Status */}
              <Row className="mb-4">
                <Col md={12}>
                  <Card
                    className={`border-0 shadow-sm border-start border-4 border-${getStatusColor(data.overall_health)}`}
                  >
                    <Card.Body>
                      <div className="text-center py-2">
                        <h2 className="mb-0">
                          {getStatusIcon(data.overall_health)}{" "}
                          {t("status.overall")}:{" "}
                          <Badge
                            bg={getStatusColor(data.overall_health)}
                            style={{ fontSize: "1.2rem" }}
                          >
                            {data.overall_health.toUpperCase()}
                          </Badge>
                        </h2>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Stats Cards */}
              {stats && (
                <Row className="mb-4 g-3">
                  <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                      <Card.Body>
                        <h6 className="text-muted">{t("stats.services")}</h6>
                        <div className="display-6 fw-bold">
                          {stats.monitored_services}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                      <Card.Body>
                        <h6 className="text-muted">{t("stats.alerts")}</h6>
                        <div className="display-6 fw-bold text-danger">
                          {stats.active_alerts}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                      <Card.Body>
                        <h6 className="text-muted">{t("stats.checks")}</h6>
                        <div className="h2 fw-bold">
                          {stats.total_health_checks.toLocaleString()}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="shadow-sm border-0 h-100">
                      <Card.Body>
                        <h6 className="text-muted">{t("stats.uptime")}</h6>
                        <div className="display-6 fw-bold text-success">
                          {stats.uptime_percentage}%
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Active Alerts */}
              {data.alerts.length > 0 && (
                <Row className="mb-4">
                  <Col md={12}>
                    <h4 className="mb-3 text-brand">{t("sections.alerts")}</h4>
                    <AlertsList
                      alerts={data.alerts}
                      onResolve={handleResolveAlert}
                      showResolveButton={true}
                    />
                  </Col>
                </Row>
              )}

              {/* Services Status */}
              <Row className="mb-4">
                <Col md={12}>
                  <h4 className="mb-3 text-brand">{t("sections.services")}</h4>
                </Col>
                {data.services.map((service, idx) => (
                  <Col md={4} lg={3} key={idx} className="mb-3">
                    <ServiceCard
                      service={service}
                      onClick={() => handleServiceClick(service)}
                    />
                  </Col>
                ))}
              </Row>

              {/* User Activity */}
              <h4 className="mb-3 text-brand">{t("sections.activity")}</h4>
              <Row>
                <Col md={4}>
                  <Card className="shadow-sm border-0 mb-3">
                    <Card.Body>
                      <h6 className="text-muted">{t("activity.users")}</h6>
                      <div className="display-5 fw-bold">
                        {data.activity.total_users_24h}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="shadow-sm border-0 mb-3">
                    <Card.Body>
                      <h6 className="text-muted">{t("activity.requests")}</h6>
                      <div className="display-5 fw-bold">
                        {data.activity.total_requests_24h}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="shadow-sm border-0 mb-3">
                    <Card.Body>
                      <h6 className="text-muted">
                        {t("activity.response_time")}
                      </h6>
                      <div className="display-5 fw-bold text-brand">
                        {data.activity.avg_response_time.toFixed(0)}ms
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tab>

          <Tab eventKey="ratings" title={`⭐ ${t("tabs.ratings")}`}>
            <div className="mt-4">
              <RatingsDashboard />
            </div>
          </Tab>

          <Tab eventKey="emails" title={`✉️ ${t("tabs.emails")}`}>
            <div className="mt-4">
              <EmailsTab />
            </div>
          </Tab>
        </Tabs>
      </Container>

      {/* Service History Modal */}
      <Modal
        show={!!selectedService}
        onHide={() => setSelectedService(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedService?.name} History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <ServiceHistoryChart serviceName={selectedService.name} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
