"use client";

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Form, Table, Button } from "react-bootstrap";
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
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useAnalytics, AnalyticsTopItem } from "../hooks/useAnalytics";
import { monitoringFetch } from "../lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard: React.FC<{ label: string; value: number | string; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <Card className="shadow-sm border-0 h-100 text-center">
    <Card.Body>
      <h6 className="text-muted mb-2">{label}</h6>
      <div className="display-5 fw-bold text-brand">{value}</div>
      {hint && <small className="text-muted">{hint}</small>}
    </Card.Body>
  </Card>
);

const TopList: React.FC<{ title: string; items: AnalyticsTopItem[]; emptyLabel?: string }> = ({
  title,
  items,
  emptyLabel = "Нет данных",
}) => (
  <Card className="shadow-sm border-0 h-100">
    <Card.Header className="bg-white border-0 py-3">
      <h6 className="mb-0">{title}</h6>
    </Card.Header>
    <Card.Body className="p-0">
      <Table size="sm" hover className="mb-0">
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="text-truncate" style={{ maxWidth: 220 }}>
                {it.key || "(прямой/нет)"}
              </td>
              <td className="text-end fw-bold">{it.count}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className="text-muted text-center py-3">{emptyLabel}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

export const AnalyticsDashboard: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data, loading, error, refresh } = useAnalytics(days);

  // Регистрации из user-service (через прокси мониторинга).
  const [userStats, setUserStats] = useState<Record<string, number> | null>(null);
  const [userStatsState, setUserStatsState] = useState<"loading" | "ok" | "off" | "error">(
    "loading"
  );
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await monitoringFetch(`/api/monitoring/user-stats`);
        const body = await res.json();
        if (cancelled) return;
        if (!body.configured) {
          setUserStatsState("off");
        } else if (body.stats) {
          setUserStats(body.stats);
          setUserStatsState("ok");
        } else {
          setUserStatsState("error");
        }
      } catch {
        if (!cancelled) setUserStatsState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !data) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted py-4">
        <Spinner animation="border" size="sm" /> Загрузка аналитики…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="alert alert-warning">
        Не удалось загрузить аналитику: {error}
        <div className="mt-2">
          <Button size="sm" variant="outline-secondary" onClick={refresh}>
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  const lineData = {
    labels: data.timeseries.map((p) => p.date),
    datasets: [
      {
        label: "Просмотры",
        data: data.timeseries.map((p) => p.views),
        borderColor: "#1e6078",
        backgroundColor: "rgba(30, 96, 120, 0.15)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Посетители",
        data: data.timeseries.map((p) => p.visitors),
        borderColor: "#25d366",
        backgroundColor: "rgba(37, 211, 102, 0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const deviceData = {
    labels: data.devices.map((d) => d.key || "—"),
    datasets: [
      {
        data: data.devices.map((d) => d.count),
        backgroundColor: ["#1e6078", "#25d366", "#ffc107", "#dc3545", "#6c757d"],
      },
    ],
  };

  const f = data.funnel;
  const funnelSteps = [
    { label: "Посетители", value: f.visitors, color: "#1e6078" },
    { label: "Сессии", value: f.sessions, color: "#2b8aa6" },
    { label: "Запущено ресёрчей", value: f.researches, color: "#25d366" },
    { label: "Оставлено оценок", value: f.ratings, color: "#ffc107" },
  ];
  const funnelMax = Math.max(...funnelSteps.map((s) => s.value), 1);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="mb-0 text-brand">📈 Посещаемость сайта</h4>
        <div className="d-flex gap-2">
          <Form.Select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-auto border-0 shadow-sm"
          >
            <option value={7}>7 дней</option>
            <option value={30}>30 дней</option>
            <option value={90}>90 дней</option>
          </Form.Select>
          <Button variant="outline-secondary" size="sm" onClick={refresh}>
            Обновить
          </Button>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <StatCard label="Просмотры" value={data.totals.pageviews} hint={`за ${days} дн.`} />
        </Col>
        <Col md={4}>
          <StatCard label="Уник. посетители" value={data.totals.unique_visitors} />
        </Col>
        <Col md={4}>
          <StatCard label="Сессии" value={data.totals.sessions} />
        </Col>
      </Row>

      {/* Регистрации пользователей (user-service) */}
      {userStatsState === "ok" && userStats && (
        <>
          <h6 className="text-brand mb-2">👥 Пользователи (регистрации)</h6>
          <Row className="g-3 mb-4">
            <Col md={2} sm={4} xs={6}>
              <StatCard label="Всего" value={userStats.total_users ?? 0} />
            </Col>
            <Col md={2} sm={4} xs={6}>
              <StatCard label="За 24ч" value={userStats.new_24h ?? 0} />
            </Col>
            <Col md={2} sm={4} xs={6}>
              <StatCard label="За 7 дн." value={userStats.new_7d ?? 0} />
            </Col>
            <Col md={2} sm={4} xs={6}>
              <StatCard label="За 30 дн." value={userStats.new_30d ?? 0} />
            </Col>
            <Col md={2} sm={4} xs={6}>
              <StatCard label="Verified" value={userStats.verified ?? 0} />
            </Col>
            <Col md={2} sm={4} xs={6}>
              <StatCard label="Активны 7д" value={userStats.active_7d ?? 0} />
            </Col>
          </Row>
        </>
      )}
      {userStatsState === "off" && (
        <div className="text-muted small mb-4">
          ℹ️ Статистика регистраций отключена (не задан <code>USER_SERVICE_URL</code> / токен).
        </div>
      )}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <h6 className="mb-0">Динамика</h6>
        </Card.Header>
        <Card.Body>
          <div style={{ height: 300 }}>
            <Line
              data={lineData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Воронка */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <h6 className="mb-0">Воронка</h6>
        </Card.Header>
        <Card.Body>
          {funnelSteps.map((s, i) => {
            const prev = i > 0 ? funnelSteps[i - 1].value : s.value;
            const conv = prev > 0 ? Math.round((s.value / prev) * 100) : 0;
            return (
              <div key={s.label} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold">{s.label}</span>
                  <span>
                    {s.value}
                    {i > 0 && <span className="text-muted ms-2">({conv}%)</span>}
                  </span>
                </div>
                <div className="progress" style={{ height: 14, borderRadius: 7 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.max((s.value / funnelMax) * 100, 2)}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <TopList title="Топ страниц" items={data.top_pages} />
        </Col>
        <Col lg={6}>
          <TopList title="Источники (UTM)" items={data.top_sources} />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <TopList title="Рефереры" items={data.top_referrers} />
        </Col>
        <Col lg={6}>
          <TopList title="Страны" items={data.countries} emptyLabel="Геоданные появятся при наличии заголовков прокси" />
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h6 className="mb-0">Устройства</h6>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center" style={{ maxHeight: 260 }}>
              {data.devices.length > 0 ? (
                <Doughnut
                  data={deviceData}
                  options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
                />
              ) : (
                <span className="text-muted">Нет данных</span>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <TopList title="Браузеры" items={data.browsers} />
        </Col>
      </Row>
    </div>
  );
};
