"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { monitoringFetch } from "../lib/api";
import { CollapsibleCard } from "./CollapsibleCard";

// Визит человека по ссылке из ответа нейросети (не краулер):
// monitoring-service /api/monitoring/visibility/ai-referrals.
export type AiVisit = {
  source: string;
  started_at: string;
  landing_path: string | null;
  landing_url: string | null;
  referrer: string | null;
  utm_source: string | null;
  pages: (string | null)[];
  pages_count: number;
  duration_sec: number;
  returning_visitor: boolean;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  locale: string | null;
  timezone: string | null;
  country: string | null;
};
export type AiReferralsData = {
  period_days: number;
  total_visits: number;
  events_cap_reached: boolean;
  by_source: { source: string; visits: number; unique_visitors: number; pageviews: number; pages_per_visit: number }[];
  landing_pages: { path: string; source: string; visits: number }[];
  visits: AiVisit[];
};

const BRAND = "#1e6078";
const SOURCE_COLOR: Record<string, string> = {
  ChatGPT: "#10a37f", Perplexity: "#6b48ff", Claude: "#d97706", Gemini: "#4285f4", Copilot: "#0078d4",
};
const srcColor = (s: string) => SOURCE_COLOR[s] || "#555";

// Не <Badge>: его класс bg-primary перебивает цвет из style.
const SourceBadge: React.FC<{ source: string }> = ({ source }) => (
  <span className="badge" style={{ backgroundColor: srcColor(source), fontSize: "0.65rem" }}>{source}</span>
);

const fmtDuration = (sec: number) =>
  sec < 60 ? `${sec} с` : `${Math.floor(sec / 60)} мин ${sec % 60 ? `${sec % 60} с` : ""}`.trim();

export const AiReferralsSection: React.FC = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AiReferralsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await monitoringFetch(`/api/monitoring/visibility/ai-referrals?days=${days}`);
      if (res.status === 404) throw new Error("эндпоинт не найден — monitoring-service ещё не обновлён");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e: unknown) {
      setData(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <h5 className="mb-0" style={{ color: BRAND }}>👤 Переходы из нейросетей — люди, кликнувшие ссылку в ответе ИИ</h5>
        <div className="d-flex gap-2">
          <Form.Select size="sm" style={{ width: "auto" }} value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Период">
            {[7, 30, 90].map((d) => <option key={d} value={d}>{d} дн.</option>)}
          </Form.Select>
          <Button variant="outline-secondary" size="sm" onClick={load} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Обновить"}
          </Button>
        </div>
      </div>
      <p className="text-muted small mb-3">
        Не боты: это браузеры людей, пришедших по ссылке из ответа ChatGPT (метка <code>utm_source=chatgpt.com</code>),
        Perplexity, Claude, Gemini, Copilot (по адресу, с которого пришли). Текст запроса нейросети не передают —
        видно, на какую страницу сослался ответ и что человек делал на сайте дальше.
      </p>

      {error && <Alert variant="warning" className="py-2 small">Не удалось загрузить: {error}</Alert>}

      {loading && !data ? (
        <div className="text-center py-3"><Spinner animation="border" style={{ color: BRAND }} /></div>
      ) : data && data.total_visits === 0 ? (
        <Card className="mb-3"><Card.Body className="text-muted small">За {data.period_days} дн. переходов из нейросетей нет.</Card.Body></Card>
      ) : data ? (
        <>
          {data.events_cap_reached && (
            <Alert variant="info" className="py-2 small">Просмотрено 50 000 событий — лимит выборки; за длинный период возможен недосчёт.</Alert>
          )}
          <Row className="g-2 mb-3">
            <Col xs="auto">
              <Card className="shadow-sm text-center px-3 py-2">
                <div className="h4 mb-0">{data.total_visits}</div>
                <div className="text-muted small">визитов</div>
              </Card>
            </Col>
            {data.by_source.map((s) => (
              <Col xs="auto" key={s.source}>
                <Card className="shadow-sm text-center px-3 py-2" style={{ borderTop: `3px solid ${srcColor(s.source)}` }}>
                  <div className="h5 mb-0">{s.visits}</div>
                  <div className="small" style={{ color: srcColor(s.source), fontWeight: 600 }}>{s.source}</div>
                  <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                    {s.unique_visitors} чел. · {s.pages_per_visit} стр./визит
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <CollapsibleCard title="Страницы, на которые ссылались нейросети" count={data.landing_pages.length}>
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead><tr><th>Страница входа</th><th>Нейросеть</th><th className="text-end">Визитов</th></tr></thead>
              <tbody>
                {data.landing_pages.map((p) => (
                  <tr key={`${p.path}-${p.source}`}>
                    <td className="small">{p.path}</td>
                    <td><SourceBadge source={p.source} /></td>
                    <td className="text-end">{p.visits}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CollapsibleCard>

          <CollapsibleCard title="Визиты" count={data.visits.length}>
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              <Table hover responsive size="sm" className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Когда</th><th>Нейросеть</th><th>Путь по сайту</th>
                    <th className="text-end">Время</th><th>Устройство</th><th>Язык / пояс</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.visits.map((v, i) => (
                    <tr key={i}>
                      <td className="small text-nowrap">{new Date(v.started_at).toLocaleString()}</td>
                      <td>
                        <SourceBadge source={v.source} />
                      </td>
                      <td className="small" style={{ maxWidth: 360 }} title={v.landing_url || undefined}>
                        <strong>{v.landing_path}</strong>
                        {v.pages.length > 1 && <span className="text-muted"> → {v.pages.slice(1).join(" → ")}</span>}
                      </td>
                      <td className="text-end small text-nowrap">
                        {v.pages_count} стр.{v.pages_count > 1 && <> · {fmtDuration(v.duration_sec)}</>}
                      </td>
                      <td className="small text-nowrap">{[v.device_type, v.browser, v.os].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="small text-nowrap">{[v.locale, v.timezone, v.country].filter(Boolean).join(" · ") || "—"}</td>
                      <td>{v.returning_visitor && <Badge bg="info" text="dark">повторный</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CollapsibleCard>
        </>
      ) : null}
    </div>
  );
};
