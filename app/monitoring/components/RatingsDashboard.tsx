"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Spinner,
  Badge,
  ListGroup,
  Form,
} from "react-bootstrap";
import { useTranslations } from "next-intl";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  LineController,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  useRatingsStats,
  useRatingsTimeline,
  useServicesRatings,
} from "../hooks/useRatings";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  LineController,
);

export const RatingsDashboard: React.FC = () => {
  const t = useTranslations("monitoring.ratings");
  const [days, setDays] = useState(30);
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined,
  );

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useRatingsStats(selectedService, days);
  const { timeline, loading: timelineLoading } = useRatingsTimeline(
    selectedService,
    days,
  );
  const { data: servicesData } = useServicesRatings(days);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "success";
    if (rating >= 3.5) return "info";
    if (rating >= 2.5) return "warning";
    return "danger";
  };

  if (statsLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading ratings data...</p>
      </div>
    );
  }

  if (statsError || !stats) {
    return <div className="alert alert-danger">Error: {statsError}</div>;
  }

  // Distribution Data
  const distributionLabels = Object.keys(stats.distribution).map(
    (k) => `${k} Stars`,
  );
  const distributionValues = Object.values(stats.distribution);

  const distributionData = {
    labels: distributionLabels,
    datasets: [
      {
        label: "Ratings Count",
        data: distributionValues,
        backgroundColor: [
          "rgba(220, 53, 69, 0.6)",
          "rgba(255, 193, 7, 0.6)",
          "rgba(13, 202, 240, 0.6)",
          "rgba(13, 110, 253, 0.6)",
          "rgba(25, 135, 84, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Timeline Data
  const timelineData = {
    labels: timeline?.data_points.map((p) => p.date) || [],
    datasets: [
      {
        label: t("average"),
        data: timeline?.data_points.map((p) => p.avg_rating) || [],
        borderColor: "#1e6078",
        backgroundColor: "rgba(30, 96, 120, 0.2)",
        yAxisID: "y",
        tension: 0.3,
        fill: true,
      },
      {
        label: t("total"),
        data: timeline?.data_points.map((p) => p.count) || [],
        borderColor: "#25d366",
        backgroundColor: "rgba(37, 211, 102, 0.2)",
        yAxisID: "y1",
        type: "bar" as const,
      },
    ],
  };

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        min: 0,
        max: 5,
        title: { display: true, text: "Rating" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Count" },
      },
    },
  };

  return (
    <div>
      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="mb-0 text-brand">
          ⭐ {t("title") || "Ratings & Feedback"}
        </h4>
        <div className="d-flex gap-3">
          <Form.Select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value || undefined)}
            className="w-auto border-0 shadow-sm"
          >
            <option value="">{t("all_services")}</option>
            {servicesData?.services.map((s) => (
              <option key={s.service_name} value={s.service_name}>
                {s.service_name}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-auto border-0 shadow-sm"
          >
            <option value={7}>{t("period.7")}</option>
            <option value={30}>{t("period.30")}</option>
            <option value={90}>{t("period.90")}</option>
          </Form.Select>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4 g-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100 text-center">
            <Card.Body>
              <h6 className="text-muted mb-2">{t("average")}</h6>
              <div
                className={`display-4 fw-bold text-${getRatingColor(stats?.averages?.overall || 0)}`}
              >
                {(stats?.averages?.overall || 0).toFixed(1)}
              </div>
              <small className="text-muted">Out of 5.0</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100 text-center">
            <Card.Body>
              <h6 className="text-muted mb-2">{t("nps")}</h6>
              <div className="display-4 fw-bold text-brand">
                {(stats?.nps || 0).toFixed(0)}
              </div>
              <Badge bg={(stats?.nps || 0) > 30 ? "success" : "warning"}>
                {(stats?.nps || 0) > 0 ? "Positive" : "Action Needed"}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100 text-center">
            <Card.Body>
              <h6 className="text-muted mb-2">{t("total")}</h6>
              <div className="display-4 fw-bold">
                {stats?.total_ratings || 0}
              </div>
              <small className="text-muted">Received in {days} days</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100 text-center">
            <Card.Body>
              <h6 className="text-muted mb-2">{t("price")}</h6>
              <div className="display-4 fw-bold text-success">
                ${(stats?.averages?.price || 0).toFixed(0)}
              </div>
              <small className="text-muted">Willingness to pay</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 g-4">
        {/* Category Breakdown */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">{t("breakdown")}</h5>
            </Card.Header>
            <Card.Body>
              <Bar
                data={{
                  labels: [
                    "Clarity",
                    "Usefulness",
                    "Accuracy",
                    "Usability",
                    "Speed",
                    "Design",
                    "Recommend",
                  ],
                  datasets: [
                    {
                      label: t("average"),
                      data: [
                        stats?.averages?.clarity || 0,
                        stats?.averages?.usefulness || 0,
                        stats?.averages?.accuracy || 0,
                        stats?.averages?.usability || 0,
                        stats?.averages?.speed || 0,
                        stats?.averages?.design || 0,
                        stats?.averages?.recommend || 0,
                      ],
                      backgroundColor: "rgba(30, 96, 120, 0.6)",
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  indexAxis: "y" as const,
                  scales: { x: { min: 0, max: 5 } },
                  plugins: { legend: { display: false } },
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Distribution */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">{t("distribution")}</h5>
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <div style={{ maxHeight: "300px", width: "100%" }}>
                <Pie
                  data={distributionData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Timeline */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">{t("timeline")}</h5>
        </Card.Header>
        <Card.Body>
          <div style={{ height: "350px" }}>
            <Line data={timelineData} options={timelineOptions} />
          </div>
        </Card.Body>
      </Card>

      {/* Recent Feedback */}
      <h5 className="mb-3 text-brand">{t("recent")}</h5>
      <ListGroup className="shadow-sm mb-4 border-0">
        {stats.recent_feedback.map((f) => (
          <ListGroup.Item
            key={f.id}
            className="p-4 border-0 border-bottom mb-2 rounded shadow-sm"
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <Badge
                  bg={getRatingColor(f.overall)}
                  className="me-2 px-3 py-2"
                >
                  {f.overall} ⭐
                </Badge>
                {f.service_name && (
                  <Badge bg="light" text="dark" className="me-2 border">
                    {f.service_name}
                  </Badge>
                )}
                <span className="text-muted small">
                  {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p
              className="mb-0 mt-2"
              style={{ fontSize: "1.1rem", color: "#444" }}
            >
              <i className="bi bi-chat-quote me-2"></i>
              {f.feedback}
            </p>
          </ListGroup.Item>
        ))}
        {stats.recent_feedback.length === 0 && (
          <ListGroup.Item className="text-center text-muted p-5 border-0 rounded shadow-sm">
            {t("no_feedback")}
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};
