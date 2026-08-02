"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Table, Button, Spinner, Badge, ButtonGroup } from "react-bootstrap";
import { monitoringFetch } from "../lib/api";

// Visibility Monitor V1 — реальные метрики поиска (Google Search Console + Bing).
// LLM-цитируемость (V2) и AI Visibility Index (V3) добавятся отдельными блоками.

type SummaryRow = { impressions: number; clicks: number; ctr: number; last_fetched: string | null };
type Summary = Record<string, SummaryRow>;
type TsPoint = { date: string; impressions: number; clicks: number; ctr: number; position: number | null };
type TopRow = { key: string; impressions: number; clicks: number; ctr: number; position: number | null };

const BRAND = "#1e6078";
const pct = (v: number) => `${((v || 0) * 100).toFixed(1)}%`;
const num = (v: number) => (v ?? 0).toLocaleString();
const fmtDateTime = (s: string | null) => (s ? new Date(s).toLocaleString() : "—");

const SOURCE_LABEL: Record<string, string> = { google: "Google", bing: "Bing" };

export const VisibilityDashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary>({});
  const [series, setSeries] = useState<Record<string, TsPoint[]>>({ google: [], bing: [] });
  const [source, setSource] = useState<"google" | "bing">("google");
  const [dimension, setDimension] = useState<"query" | "page">("query");
  const [top, setTop] = useState<TopRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, ts] = await Promise.all([
        monitoringFetch("/api/monitoring/visibility/summary").then((r) => r.json()),
        monitoringFetch("/api/monitoring/visibility/timeseries?days=30").then((r) => r.json()),
      ]);
      setSummary(s || {});
      setSeries({ google: ts?.google || [], bing: ts?.bing || [] });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTop = useCallback(async () => {
    try {
      const rows = await monitoringFetch(
        `/api/monitoring/visibility/top?source=${source}&dimension=${dimension}&limit=25`
      ).then((r) => r.json());
      setTop(Array.isArray(rows) ? rows : []);
    } catch {
      setTop([]);
    }
  }, [source, dimension]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadTop();
  }, [loadTop]);

  const scanNow = async () => {
    setScanning(true);
    try {
      await monitoringFetch("/api/monitoring/visibility/scan", { method: "POST" });
      await load();
      await loadTop();
    } finally {
      setScanning(false);
    }
  };

  const daily = useMemo(() => (series[source] || []).slice(-20).reverse(), [series, source]);
  const maxImpr = useMemo(() => Math.max(1, ...daily.map((p) => p.impressions)), [daily]);
  const bothEmpty =
    (series.google?.length || 0) === 0 && (series.bing?.length || 0) === 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="mb-0" style={{ color: BRAND }}>
          🔎 GEO Visibility — видимость бренда
        </h4>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={load} disabled={loading}>
            Обновить
          </Button>
          <Button
            size="sm"
            style={{ backgroundColor: BRAND, borderColor: BRAND }}
            onClick={scanNow}
            disabled={scanning}
          >
            {scanning ? <Spinner size="sm" animation="border" /> : "Сканировать сейчас"}
          </Button>
        </div>
      </div>

      <p className="text-muted small mb-3">
        Реальные показы и клики из Google Search Console и Bing Webmaster Tools.
        Данные Google с задержкой ~2–3 дня. Автосканирование 6×/день.
      </p>

      {error && (
        <Card className="mb-3 border-danger">
          <Card.Body className="text-danger small">Ошибка загрузки: {error}</Card.Body>
        </Card>
      )}

      {/* Сводные карточки по источникам */}
      <Row className="g-3 mb-4">
        {["google", "bing"].map((src) => {
          const s = summary[src] || { impressions: 0, clicks: 0, ctr: 0, last_fetched: null };
          return (
            <Col md={6} key={src}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong style={{ color: BRAND }}>{SOURCE_LABEL[src]}</strong>
                    <Badge bg={s.last_fetched ? "success" : "secondary"}>
                      {s.last_fetched ? "данные есть" : "нет данных"}
                    </Badge>
                  </div>
                  <Row className="text-center">
                    <Col>
                      <div className="h4 mb-0">{num(s.impressions)}</div>
                      <div className="text-muted small">показы</div>
                    </Col>
                    <Col>
                      <div className="h4 mb-0">{num(s.clicks)}</div>
                      <div className="text-muted small">клики</div>
                    </Col>
                    <Col>
                      <div className="h4 mb-0">{pct(s.ctr)}</div>
                      <div className="text-muted small">CTR</div>
                    </Col>
                  </Row>
                  <div className="text-muted small mt-2">
                    Обновлено: {fmtDateTime(s.last_fetched)}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" style={{ color: BRAND }} />
        </div>
      ) : bothEmpty ? (
        <Card className="mb-3">
          <Card.Body className="text-muted">
            Пока нет данных. Добавьте ключи GSC / Bing в конфиг monitoring-service и нажмите
            «Сканировать сейчас». Без ключей источники пропускаются.
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Переключатель источника + дневной ряд */}
          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <ButtonGroup size="sm">
              {(["google", "bing"] as const).map((src) => (
                <Button
                  key={src}
                  variant={source === src ? "primary" : "outline-primary"}
                  onClick={() => setSource(src)}
                >
                  {SOURCE_LABEL[src]}
                </Button>
              ))}
            </ButtonGroup>
            <span className="text-muted small">последние {daily.length} дней</span>
          </div>

          <Card className="mb-4 shadow-sm">
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th style={{ width: "35%" }}>Показы</th>
                  <th className="text-end">Клики</th>
                  <th className="text-end">CTR</th>
                  <th className="text-end">Позиция</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((p) => (
                  <tr key={p.date}>
                    <td className="small">{p.date}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            height: 8,
                            width: `${(p.impressions / maxImpr) * 100}%`,
                            minWidth: 2,
                            backgroundColor: BRAND,
                            borderRadius: 4,
                          }}
                        />
                        <span className="small text-muted">{num(p.impressions)}</span>
                      </div>
                    </td>
                    <td className="text-end">{num(p.clicks)}</td>
                    <td className="text-end">{pct(p.ctr)}</td>
                    <td className="text-end">{p.position ? p.position.toFixed(1) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Топ запросов / страниц */}
          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <h6 className="mb-0" style={{ color: BRAND }}>
              Топ {dimension === "query" ? "запросов" : "страниц"} — {SOURCE_LABEL[source]}
            </h6>
            <ButtonGroup size="sm">
              {(["query", "page"] as const).map((dim) => (
                <Button
                  key={dim}
                  variant={dimension === dim ? "primary" : "outline-primary"}
                  onClick={() => setDimension(dim)}
                >
                  {dim === "query" ? "Запросы" : "Страницы"}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <Card className="shadow-sm">
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>{dimension === "query" ? "Запрос" : "Страница"}</th>
                  <th className="text-end">Показы</th>
                  <th className="text-end">Клики</th>
                  <th className="text-end">CTR</th>
                  <th className="text-end">Позиция</th>
                </tr>
              </thead>
              <tbody>
                {top.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-muted small text-center py-3">
                      Нет данных для {SOURCE_LABEL[source]}.
                    </td>
                  </tr>
                ) : (
                  top.map((r, i) => (
                    <tr key={`${r.key}-${i}`}>
                      <td className="small" style={{ maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {r.key}
                      </td>
                      <td className="text-end">{num(r.impressions)}</td>
                      <td className="text-end">{num(r.clicks)}</td>
                      <td className="text-end">{pct(r.ctr)}</td>
                      <td className="text-end">{r.position ? r.position.toFixed(1) : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
