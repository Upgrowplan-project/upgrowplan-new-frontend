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
import { monitoringFetch } from "../lib/api";

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

// [21.10 · владелец] оценка в форме — из 10 (RuGrade/EnGrade); пороги были под шкалу из 5 (3/10 горело «info»)
function ratingBadge(rating?: number | null) {
  if (rating == null) return <span className="text-muted">—</span>;
  const variant =
    rating >= 8 ? "success" : rating >= 6 ? "info" : rating >= 4 ? "warning" : "danger";
  return <Badge bg={variant}>{rating} ⭐</Badge>;
}

// Форма оценки шлёт метки и комментарий одной строкой: "[метка, метка]\nкомментарий" (RuGrade.tsx submit)
function splitFeedback(feedback?: string | null): { tags: string[]; comment: string } {
  const text = (feedback || "").trim();
  const m = text.match(/^\[([^\]]*)\]\s*\n?/);
  if (!m) return { tags: [], comment: text };
  return { tags: m[1].split(",").map((t) => t.trim()).filter(Boolean), comment: text.slice(m[0].length).trim() };
}

function npsZone(v?: number | null): string {
  if (v == null) return "";
  return v >= 9 ? " · фанат" : v >= 7 ? " · нейтральный" : " · критик";
}

const ReportDetailModal: React.FC<{
  researchId: string | null;
  onClose: () => void;
}> = ({ researchId, onClose }) => {
  const { report, loading, error } = useResearchReport(researchId);

  const downloadArtifact = async () => {
    if (!researchId) return;
    const response = await monitoringFetch(`/api/monitoring/reports/${encodeURIComponent(researchId)}/artifact`);
    if (!response.ok) return;
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = report?.artifact_filename || `${researchId}_report.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  // [21.10 · владелец] журналы прогона — файлом (время, уровень, источник, сообщение)
  const downloadLogs = () => {
    if (!report?.logs?.length) return;
    const lines = report.logs.map((l) => `${l.created_at || ""}\t${l.level || ""}\t${l.source || ""}\t${l.message || ""}`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.research_id}_logs.txt`;
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
                {report.owner_email && <span>Пользователь: {report.owner_email}</span>}
                <span>Статус: <Badge bg="secondary">{report.status}</Badge></span>
                <span>Длительность: {fmtDuration(report.duration_seconds)}</span>
                <span>Оценка: {ratingBadge(report.rating?.overall)}</span>
              </div>
              <div className="d-flex gap-2">
                {report.artifact_available && <Button size="sm" variant="outline-success" onClick={() => void downloadArtifact()}>Скачать DOCX</Button>}
                {!!report.logs?.length && <Button size="sm" variant="outline-secondary" onClick={downloadLogs}>⬇ Скачать логи</Button>}
                <Button size="sm" variant="outline-primary" onClick={downloadJson}>⬇ Скачать JSON</Button>
              </div>
            </div>

            <Tabs defaultActiveKey="request" className="mb-3">
              <Tab eventKey="request" title="Запрос">
                <pre className="bg-light p-3 rounded small" style={{ maxHeight: 400, overflow: "auto" }}>
                  {JSON.stringify(report.request, null, 2)}
                </pre>
              </Tab>
              <Tab eventKey="report" title="Отчёт">
                {report.report == null ? (
                  <div className="alert alert-warning small mb-0">
                    Итоговый отчёт этого прогона не дошёл до Monitoring (сбой отправки на стороне сервиса исследований).
                    {report.artifact_available ? " Документ DOCX и журналы сохранены — их можно скачать." : ""}
                  </div>
                ) : (
                  <pre className="bg-light p-3 rounded small" style={{ maxHeight: 500, overflow: "auto" }}>
                    {JSON.stringify(report.report, null, 2)}
                  </pre>
                )}
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
              {report.rating && (() => {
                // [21.10 · владелец «отзыв укорочен и непонятен»] все поля формы оценки с её подписями
                const r = report.rating;
                const { tags, comment } = splitFeedback(r.feedback);
                const score = (v?: number | null, max = 10) => (v == null ? "—" : `${v} из ${max}`);
                return (
                  <Tab eventKey="feedback" title="Отзыв">
                    <Card className="border-0 shadow-sm">
                      <Card.Body>
                        <Table size="sm" className="small mb-3" style={{ maxWidth: 520 }}>
                          <tbody>
                            <tr><td>Как вам результат в целом?</td><td>{ratingBadge(r.overall)} <span className="text-muted">из 10</span></td></tr>
                            <tr><td>Понятность</td><td>{score(r.clarity)}</td></tr>
                            <tr><td>Полезность</td><td>{score(r.usefulness)}</td></tr>
                            <tr><td>Точность</td><td>{score(r.accuracy)}</td></tr>
                            <tr><td>Ценность</td><td>{score(r.design)}</td></tr>
                            <tr><td>Порекомендует коллегам?</td><td>{r.recommend == null ? "—" : `${r.recommend} из 10${npsZone(r.recommend)}`}</td></tr>
                          </tbody>
                        </Table>
                        {tags.length > 0 && (
                          <div className="mb-2">
                            <div className="small text-muted mb-1">
                              {(r.overall ?? 10) <= 5 ? "Что пошло не так:" : "Что понравилось больше всего:"}
                            </div>
                            {tags.map((t) => <Badge key={t} bg="light" text="dark" className="me-1 border">{t}</Badge>)}
                          </div>
                        )}
                        <div className="small text-muted mb-1">Комментарий:</div>
                        <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>{comment || "—"}</p>
                        {r.created_at && <div className="small text-muted">Оценка оставлена: {fmtDate(r.created_at)}</div>}
                      </Card.Body>
                    </Card>
                  </Tab>
                );
              })()}
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
                <th>Пользователь</th>
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
                  <td className="small">{r.owner_email || "—"}</td>
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
                  <td colSpan={9} className="text-center text-muted py-5">
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
