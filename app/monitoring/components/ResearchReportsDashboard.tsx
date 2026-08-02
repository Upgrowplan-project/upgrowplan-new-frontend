"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Spinner,
  Badge,
  Table,
  Button,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  useResearchReports,
  useResearchReport,
  ResearchReportSummary,
} from "../hooks/useResearchReports";

const KNOWN_SERVICES = [
  { value: "", label: "Все сервисы" },
  { value: "market-research-service", label: "Market Research" },
  { value: "planmaster-service", label: "PlanMaster" },
  { value: "social-plan-master", label: "Social Plan" },
];

function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function fmtDuration(sec?: number | null): string {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}м ${s}с` : `${s}с`;
}

function ratingBadge(rating?: number | null) {
  if (rating == null) return <span className="text-muted">—</span>;
  const variant =
    rating >= 4 ? "success" : rating >= 3 ? "info" : rating >= 2 ? "warning" : "danger";
  return <Badge bg={variant}>{rating} ⭐</Badge>;
}

const ReportDetailModal: React.FC<{
  researchId: string | null;
  onClose: () => void;
}> = ({ researchId, onClose }) => {
  const { report, loading, error } = useResearchReport(researchId);

  const downloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.research_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal show={!!researchId} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.1rem" }}>
          {report?.product_name || researchId}
          {report?.country && (
            <span className="text-muted"> · {report.country}</span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        {report && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex gap-3 flex-wrap small text-muted">
                <span>ID: <code>{report.research_id}</code></span>
                <span>Статус: <Badge bg="secondary">{report.status}</Badge></span>
                <span>Длительность: {fmtDuration(report.duration_seconds)}</span>
                <span>Оценка: {ratingBadge(report.rating?.overall)}</span>
              </div>
              <Button size="sm" variant="outline-primary" onClick={downloadJson}>
                ⬇ Скачать JSON
              </Button>
            </div>

            <Tabs defaultActiveKey="request" className="mb-3">
              <Tab eventKey="request" title="Запрос">
                <pre className="bg-light p-3 rounded small" style={{ maxHeight: 400, overflow: "auto" }}>
                  {JSON.stringify(report.request, null, 2)}
                </pre>
              </Tab>
              <Tab eventKey="report" title="Отчёт">
                <pre className="bg-light p-3 rounded small" style={{ maxHeight: 500, overflow: "auto" }}>
                  {JSON.stringify(report.report, null, 2)}
                </pre>
              </Tab>
              <Tab eventKey="logs" title={`Логи (${report.logs?.length || 0})`}>
                <div style={{ maxHeight: 500, overflow: "auto" }}>
                  <Table size="sm" striped className="small mb-0">
                    <thead>
                      <tr>
                        <th>Время</th>
                        <th>Уровень</th>
                        <th>Источник</th>
                        <th>Сообщение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(report.logs || []).map((l, i) => (
                        <tr key={i}>
                          <td className="text-nowrap text-muted">{fmtDate(l.created_at)}</td>
                          <td>
                            <Badge
                              bg={
                                l.level === "ERROR"
                                  ? "danger"
                                  : l.level === "WARNING"
                                  ? "warning"
                                  : "light"
                              }
                              text={l.level === "INFO" ? "dark" : undefined}
                            >
                              {l.level}
                            </Badge>
                          </td>
                          <td className="text-muted">{l.source}</td>
                          <td style={{ whiteSpace: "pre-wrap" }}>{l.message}</td>
                        </tr>
                      ))}
                      {(!report.logs || report.logs.length === 0) && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-3">
                            Логи не сохранены для этого прогона.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>
              {report.rating?.feedback && (
                <Tab eventKey="feedback" title="Отзыв">
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <div className="mb-2">{ratingBadge(report.rating.overall)}</div>
                      <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {report.rating.feedback}
                      </p>
                    </Card.Body>
                  </Card>
                </Tab>
              )}
            </Tabs>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export const ResearchReportsDashboard: React.FC = () => {
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const { reports, total, loading, error, refresh } =
    useResearchReports(serviceFilter, 100);
  const [selected, setSelected] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Загрузка отчётов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Ошибка загрузки отчётов: {error}
        <div className="mt-2">
          <Button size="sm" variant="outline-danger" onClick={refresh}>
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h4 className="mb-0 text-brand">📄 Отчёты сервисов ({total})</h4>
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            {KNOWN_SERVICES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <Button variant="outline-secondary" size="sm" onClick={refresh}>
            Обновить
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Продукт</th>
                <th>Сервис</th>
                <th>Локация</th>
                <th>Тип</th>
                <th>Завершён</th>
                <th>Время</th>
                <th>Оценка</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r: ResearchReportSummary) => (
                <tr key={r.research_id}>
                  <td>
                    <div className="fw-semibold">{r.product_name || "—"}</div>
                    <code className="small text-muted">{r.research_id}</code>
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="small border">
                      {r.service_name?.replace("-service", "") || "—"}
                    </Badge>
                  </td>
                  <td>{[r.region, r.country].filter(Boolean).join(", ") || "—"}</td>
                  <td className="small text-muted">
                    {[r.business_type, r.product_type].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="small text-nowrap">{fmtDate(r.completed_at || r.created_at)}</td>
                  <td className="small">{fmtDuration(r.duration_seconds)}</td>
                  <td>{ratingBadge(r.rating)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => setSelected(r.research_id)}
                    >
                      Открыть
                    </Button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-5">
                    Пока нет сохранённых отчётов. Они появятся после первого
                    завершённого исследования.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ReportDetailModal researchId={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
