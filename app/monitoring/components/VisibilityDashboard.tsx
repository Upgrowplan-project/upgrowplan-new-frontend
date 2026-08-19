"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Table, Button, Spinner, Badge, ButtonGroup, Alert } from "react-bootstrap";
import { monitoringFetch } from "../lib/api";

// Visibility Monitor V1 — реальные метрики поиска (Google Search Console + Bing).
// V2 — AI Bot Crawl tracking (GPTBot, PerplexityBot, ClaudeBot, ...).

type SummaryRow = { impressions: number; clicks: number; ctr: number; last_fetched: string | null };
type Summary = Record<string, SummaryRow>;
type TsPoint = { date: string; impressions: number; clicks: number; ctr: number; position: number | null };
type TopRow = { key: string; impressions: number; clicks: number; ctr: number; position: number | null };

type BotPageInfo = {
  path: string;
  bots: string[];
  count: number;
  first_crawl: string;
  last_crawl: string;
  published_at: string | null;
  days_to_first_crawl: number | null;
};
type BotRecommendation = {
  type: string;
  severity: "info" | "warning" | "critical";
  path?: string;
  action: string;
  age_days?: number;
  days_to_first_crawl?: number;
  missing_bots?: string[];
};
type BotCrawlData = {
  total_events: number;
  by_bot: Record<string, number>;
  by_page: BotPageInfo[];
  recommendations: BotRecommendation[];
  recent_events: { bot_name: string; url_path: string; crawled_at: string }[];
};

const BRAND = "#1e6078";
const pct = (v: number) => `${((v || 0) * 100).toFixed(1)}%`;
const num = (v: number) => (v ?? 0).toLocaleString();
const fmtDateTime = (s: string | null) => (s ? new Date(s).toLocaleString() : "—");

const SOURCE_LABEL: Record<string, string> = { google: "Google", bing: "Bing" };

const SEVERITY_VARIANT: Record<string, string> = { info: "info", warning: "warning", critical: "danger" };
const BOT_COLOR: Record<string, string> = {
  GPTBot: "#10a37f",
  "OAI-SearchBot": "#10a37f",
  PerplexityBot: "#6b48ff",
  "Perplexity-User": "#6b48ff",
  ClaudeBot: "#d97706",
  "Claude-User": "#d97706",
  "Google-Extended": "#4285f4",
  CCBot: "#888",
};
const botColor = (name: string) => BOT_COLOR[name] || "#555";

export const VisibilityDashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary>({});
  const [series, setSeries] = useState<Record<string, TsPoint[]>>({ google: [], bing: [] });
  const [source, setSource] = useState<"google" | "bing">("google");
  const [dimension, setDimension] = useState<"query" | "page">("query");
  const [top, setTop] = useState<TopRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [botData, setBotData] = useState<BotCrawlData | null>(null);
  const [botLoading, setBotLoading] = useState(true);

  const loadBotCrawls = useCallback(async () => {
    setBotLoading(true);
    try {
      const data = await monitoringFetch("/api/monitoring/visibility/bot-crawls?days=90").then((r) => r.json());
      setBotData(data);
    } catch {
      setBotData(null);
    } finally {
      setBotLoading(false);
    }
  }, []);

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

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadTop(); }, [loadTop]);
  useEffect(() => { loadBotCrawls(); }, [loadBotCrawls]);

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

      {/* ── AI Bot Crawlers (V2) ─────────────────────────────────── */}
      <hr className="my-4" />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0" style={{ color: BRAND }}>🤖 AI Bot Crawlers</h5>
        <Button variant="outline-secondary" size="sm" onClick={loadBotCrawls} disabled={botLoading}>
          {botLoading ? <Spinner size="sm" animation="border" /> : "Обновить"}
        </Button>
      </div>
      <p className="text-muted small mb-3">
        Визиты AI-краулеров (GPTBot, PerplexityBot, ClaudeBot и др.) на страницы контента.
        Данные собираются автоматически из Next.js middleware.
      </p>

      {botLoading ? (
        <div className="text-center py-3"><Spinner animation="border" style={{ color: BRAND }} /></div>
      ) : !botData || botData.total_events === 0 ? (
        <Card className="mb-3">
          <Card.Body className="text-muted small">
            Пока нет событий от AI-ботов. Как только GPTBot или PerplexityBot зайдут на страницу блога — данные появятся здесь автоматически.
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Рекомендации */}
          {botData.recommendations.length > 0 && (
            <div className="mb-3">
              {botData.recommendations.map((r, i) => (
                <Alert key={i} variant={SEVERITY_VARIANT[r.severity] || "info"} className="small py-2 mb-2">
                  {r.path && <strong>{r.path}</strong>}{r.path && " — "}
                  {r.action}
                  {r.age_days !== undefined && <span className="ms-1 text-muted">({r.age_days} дней без краулера)</span>}
                  {r.days_to_first_crawl !== undefined && <span className="ms-1 text-muted">(обнаружена через {r.days_to_first_crawl} дн.)</span>}
                  {r.missing_bots && <span className="ms-1 text-muted">Отсутствуют: {r.missing_bots.join(", ")}</span>}
                </Alert>
              ))}
            </div>
          )}

          {/* Сводка по ботам */}
          <Row className="g-2 mb-3">
            <Col xs="auto">
              <Card className="shadow-sm text-center px-3 py-2">
                <div className="h4 mb-0">{botData.total_events}</div>
                <div className="text-muted small">визитов</div>
              </Card>
            </Col>
            {Object.entries(botData.by_bot).sort((a, b) => b[1] - a[1]).map(([bot, cnt]) => (
              <Col xs="auto" key={bot}>
                <Card className="shadow-sm text-center px-3 py-2" style={{ borderTop: `3px solid ${botColor(bot)}` }}>
                  <div className="h5 mb-0">{cnt}</div>
                  <div className="small" style={{ color: botColor(bot), fontWeight: 600 }}>{bot}</div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* По страницам */}
          <Card className="shadow-sm mb-3">
            <Card.Header className="small fw-semibold">Страницы</Card.Header>
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Путь</th>
                  <th>Боты</th>
                  <th className="text-end">Визитов</th>
                  <th className="text-end">Первый визит</th>
                  <th className="text-end">До обнаружения</th>
                </tr>
              </thead>
              <tbody>
                {botData.by_page.map((p) => (
                  <tr key={p.path}>
                    <td className="small" style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.path}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {p.bots.map((b) => (
                          <Badge key={b} style={{ backgroundColor: botColor(b), fontSize: "0.65rem" }}>{b}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="text-end">{p.count}</td>
                    <td className="text-end small">{new Date(p.first_crawl).toLocaleDateString()}</td>
                    <td className="text-end small">
                      {p.days_to_first_crawl !== null
                        ? <Badge bg={p.days_to_first_crawl <= 1 ? "success" : p.days_to_first_crawl <= 7 ? "warning" : "danger"}>
                            {p.days_to_first_crawl === 0 ? "< 1 дня" : `${p.days_to_first_crawl} дн.`}
                          </Badge>
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Последние события */}
          <Card className="shadow-sm">
            <Card.Header className="small fw-semibold">Последние визиты</Card.Header>
            <Table hover responsive size="sm" className="mb-0">
              <thead>
                <tr><th>Бот</th><th>Страница</th><th className="text-end">Когда</th></tr>
              </thead>
              <tbody>
                {botData.recent_events.slice(0, 15).map((e, i) => (
                  <tr key={i}>
                    <td><Badge style={{ backgroundColor: botColor(e.bot_name), fontSize: "0.65rem" }}>{e.bot_name}</Badge></td>
                    <td className="small" style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.url_path}</td>
                    <td className="text-end small text-muted">{new Date(e.crawled_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
