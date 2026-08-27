"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card, Table, Badge, Button, Spinner, Modal,
  Form, Row, Col, Alert,
} from "react-bootstrap";

type BotPageInfo = { path: string; bots: string[]; count: number; first_crawl: string; last_crawl: string; published_at: string | null; days_to_first_crawl: number | null };
type BotRecommendation = { type: string; severity: "info" | "warning" | "critical"; path?: string; action: string; age_days?: number; days_to_first_crawl?: number; missing_bots?: string[] };
type BotCrawlData = { total_events: number; by_bot: Record<string, number>; by_page: BotPageInfo[]; recommendations: BotRecommendation[]; recent_events: { bot_name: string; url_path: string; crawled_at: string }[] };

const SEVERITY_VARIANT: Record<string, string> = { info: "info", warning: "warning", critical: "danger" };
const BOT_COLOR: Record<string, string> = { GPTBot: "#10a37f", "OAI-SearchBot": "#10a37f", PerplexityBot: "#6b48ff", "Perplexity-User": "#6b48ff", ClaudeBot: "#d97706", "Claude-User": "#d97706", "Google-Extended": "#4285f4", CCBot: "#888" };
const botColor = (name: string) => BOT_COLOR[name] || "#555";
import { monitoringFetch } from "../lib/api";

const BRAND = "#1e6078";
const LLM_LABELS: Record<string, string> = {
  gemini: "Gemini (авто)",
  chatgpt: "ChatGPT",
  bing: "Bing Copilot",
  perplexity: "Perplexity",
  claude: "Claude",
  manual: "Другая",
};
const LLM_OPTIONS = ["chatgpt", "bing", "perplexity", "claude", "gemini", "manual"];

const LLM_HINTS: Record<string, string> = {
  chatgpt: "chat.openai.com",
  bing: "bing.com/chat или copilot.microsoft.com",
  perplexity: "perplexity.ai",
  claude: "claude.ai",
  gemini: "gemini.google.com",
  manual: "",
};

function downloadGeoCsv(items: GeoItem[]) {
  const esc = (v: string | number | boolean | null | undefined) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const headers = ["Date", "LLM", "Query", "Mentioned", "Position", "Auto", "Excerpt"];
  const rows = items.map((it) => [
    it.created_at ? new Date(it.created_at).toISOString().slice(0, 10) : "",
    LLM_LABELS[it.llm] || it.llm,
    it.query,
    it.mentioned ? "Yes" : "No",
    it.position || "",
    it.auto ? "auto" : "manual",
    (it.excerpt || "").replace(/\n/g, " "),
  ]);
  const csv = [[...headers], ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `geo-visibility-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type GeoItem = {
  id: number;
  llm: string;
  query: string;
  mentioned: boolean;
  position: string | null;
  excerpt: string | null;
  auto: boolean;
  created_at: string;
};

type GeoErrorItem = Pick<GeoItem, "id" | "llm" | "query" | "excerpt" | "created_at">;

type Summary = Record<string, { total: number; mentioned: number; last_check: string | null }>;

const positionBadge = (pos: string | null) => {
  if (!pos) return null;
  const map: Record<string, string> = { early: "success", middle: "warning", late: "secondary" };
  const labels: Record<string, string> = { early: "в начале", middle: "в середине", late: "в конце" };
  return <Badge bg={map[pos] || "light"} text="dark">{labels[pos] || pos}</Badge>;
};

const fmtDate = (s: string) => new Date(s).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });

export const GeoVisibilityDashboard: React.FC = () => {
  const [items, setItems] = useState<GeoItem[]>([]);
  const [errorItems, setErrorItems] = useState<GeoErrorItem[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ status: string; saved?: number; mentions?: number; errors?: string[]; reason?: string; message?: string } | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [selected, setSelected] = useState<GeoItem | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Manual form state
  const [manLlm, setManLlm] = useState("chatgpt");
  const [manQuery, setManQuery] = useState("");
  const [manResponse, setManResponse] = useState("");
  const [manSaving, setManSaving] = useState(false);
  const [manResult, setManResult] = useState<{ mentioned: boolean; excerpt: string | null } | null>(null);

  const [botData, setBotData] = useState<BotCrawlData | null>(null);
  const [botLoading, setBotLoading] = useState(true);

  const loadBotCrawls = useCallback(async () => {
    setBotLoading(true);
    try {
      const data = await monitoringFetch("/api/monitoring/visibility/bot-crawls?days=90").then((r) => r.json());
      setBotData(data);
    } catch { setBotData(null); }
    finally { setBotLoading(false); }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await monitoringFetch("/api/monitoring/geo?limit=100");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
      setErrorItems(data.error_items || []);
      setSummary(data.summary || {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadBotCrawls(); }, [loadBotCrawls]);

  const scanNow = async () => {
    setScanning(true);
    setScanResult(null);
    setScanCountdown(null);
    try {
      const res = await monitoringFetch("/api/monitoring/geo/scan", { method: "POST" });
      const data = await res.json();
      setScanResult(data);
      // Scan runs in background ~60-90s — countdown then auto-reload
      if (data.status === "started") {
        let secs = 90;
        setScanCountdown(secs);
        const timer = setInterval(() => {
          secs -= 1;
          setScanCountdown(secs);
          if (secs <= 0) {
            clearInterval(timer);
            setScanCountdown(null);
            setScanResult(null);
            load();
          }
        }, 1000);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setScanning(false);
    }
  };

  const saveManual = async () => {
    setManSaving(true);
    setManResult(null);
    try {
      const res = await monitoringFetch("/api/monitoring/geo/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ llm: manLlm, query: manQuery, response_text: manResponse }),
      });
      const data = await res.json();
      setManResult({ mentioned: data.mentioned, excerpt: data.excerpt });
      await load();
      setManQuery("");
      setManResponse("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setManSaving(false);
    }
  };

  // Group items by LLM for the summary grid
  const knownLlms = Array.from(new Set([...Object.keys(summary), ...items.map((i) => i.llm)]));

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-0" style={{ color: BRAND }}>🤖 GEO Visibility — видимость в нейросетях</h4>
          <p className="text-muted small mb-0 mt-1">
            Автоматически проверяем: упоминает ли Gemini upgrowplan в ответах на бизнес-запросы.
            Авто-скан раз в день (ротация из 15 запросов). Другие нейросети — вставь ответ вручную.
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button variant="outline-secondary" size="sm" onClick={load} disabled={loading}>Обновить</Button>
          {items.length > 0 && (
            <Button variant="outline-secondary" size="sm" onClick={() => downloadGeoCsv(items)} title="Скачать данные в CSV">
              ⬇ CSV
            </Button>
          )}
          <Button variant="outline-primary" size="sm" onClick={() => setShowManual(true)}>+ Ручная проверка</Button>
          <Button
            size="sm"
            style={{ backgroundColor: BRAND, borderColor: BRAND }}
            onClick={scanNow}
            disabled={scanning}
          >
            {scanning ? <><Spinner size="sm" animation="border" className="me-1" />Сканирую...</> : "Сканировать Gemini"}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      {errorItems.length > 0 && (
        <Alert variant="warning" className="py-2 small mb-3 d-flex align-items-center justify-content-between gap-2">
          <span>Скрыто ошибочных проверок: <strong>{errorItems.length}</strong>. Они не влияют на статистику упоминаний.</span>
          <Button size="sm" variant="outline-secondary" onClick={() => setShowErrorDetails(true)}>Посмотреть</Button>
        </Alert>
      )}

      {/* Scan result banner */}
      {scanResult && (
        <Alert
          variant={scanResult.status === "skipped" ? "warning" : scanResult.status === "quota_exceeded" ? "danger" : scanResult.status === "started" ? "info" : scanResult.errors?.length ? "warning" : "success"}
          className="py-2 small mb-3"
          dismissible={scanResult.status !== "started"}
          onClose={() => { setScanResult(null); setScanCountdown(null); }}
        >
          {scanResult.status === "skipped" ? (
            <>⚠️ <strong>{scanResult.reason?.includes("progress") ? "Скан уже выполняется." : "GEMINI_API_KEY не настроен."}</strong> {scanResult.reason}</>
          ) : scanResult.status === "quota_exceeded" ? (
            <>🚫 <strong>Дневная квота Gemini исчерпана.</strong> Бесплатный тариф — 1500 запросов/день. Скан будет доступен завтра.</>
          ) : scanResult.status === "started" ? (
            <>
              🔄 <strong>Скан запущен в фоне.</strong> Gemini обрабатывает 6 запросов (~60–90 сек).
              {scanCountdown !== null && <> Обновление через <strong>{scanCountdown}с</strong>…</>}
            </>
          ) : (
            <>
              {(scanResult.errors ?? []).length > 0
                ? <>⚠️ Скан завершён с ошибками: {scanResult.errors!.length} из {(scanResult.saved ?? 0) + scanResult.errors!.length} запросов не прошли. Успешно: {scanResult.saved ?? 0}, упоминаний: {scanResult.mentions ?? 0}.</>
                : <>✅ Скан завершён: {scanResult.saved ?? 0} запросов, упоминаний: {scanResult.mentions ?? 0}.</>
              }
            </>
          )}
        </Alert>
      )}

      {/* LLM Summary cards */}
      {knownLlms.length === 0 && !loading ? (
        <Card className="mb-4">
          <Card.Body className="text-muted text-center py-4">
            Пока нет данных. Нажмите «Сканировать Gemini» для первой проверки.
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3 mb-4">
          {knownLlms.map((llm) => {
            const s = summary[llm] || { total: 0, mentioned: 0, last_check: null };
            const rate = s.total > 0 ? Math.round((s.mentioned / s.total) * 100) : 0;
            const variant = rate >= 60 ? "success" : rate >= 30 ? "warning" : "danger";
            return (
              <Col md={3} sm={6} key={llm}>
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <div className="fw-bold mb-2" style={{ color: BRAND }}>{LLM_LABELS[llm] || llm}</div>
                    <div className={`display-6 fw-bold text-${variant}`}>{rate}%</div>
                    <div className="text-muted small">упоминаний</div>
                    <div className="text-muted small mt-1">{s.mentioned}/{s.total} запросов</div>
                    {s.last_check && (
                      <Badge bg="light" text="dark" className="mt-2 small">{fmtDate(s.last_check)}</Badge>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Results table */}
      {loading ? (
        <div className="text-center py-4"><Spinner animation="border" style={{ color: BRAND }} /></div>
      ) : items.length > 0 ? (
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Нейросеть</th>
                  <th>Запрос</th>
                  <th>Упомянут</th>
                  <th>Позиция</th>
                  <th>Дата</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Badge bg="light" text="dark" className="border">{LLM_LABELS[item.llm] || item.llm}</Badge>
                      {!item.auto && <Badge bg="secondary" className="ms-1 small">вручную</Badge>}
                    </td>
                    <td className="small" style={{ maxWidth: 300 }}>
                      <div className="text-truncate">{item.query}</div>
                    </td>
                    <td>
                      {item.excerpt?.startsWith("[ERROR:")
                        ? <Badge bg="secondary">— нет данных</Badge>
                        : item.mentioned
                          ? <Badge bg="success">✅ Да</Badge>
                          : <Badge bg="danger">❌ Нет</Badge>}
                    </td>
                    <td>{positionBadge(item.position)}</td>
                    <td className="text-muted small text-nowrap">{fmtDate(item.created_at)}</td>
                    <td>
                      {item.excerpt && (
                        <Button size="sm" variant="outline-secondary" onClick={() => setSelected(item)}>
                          Контекст
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : null}

      {/* Manual check modal */}
      <Modal show={showManual} onHide={() => { setShowManual(false); setManResult(null); }} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ручная проверка нейросети</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">
            Выбери нейросеть, задай ей вопрос про бизнес-инструменты, скопируй ответ сюда — система проверит, упоминается ли upgrowplan.
          </p>
          {manResult && (
            <Alert variant={manResult.mentioned ? "success" : "warning"} className="py-2 small">
              {manResult.mentioned
                ? <>✅ Упомянут! Контекст: <em>«{manResult.excerpt}»</em></>
                : "❌ upgrowplan не упомянут в этом ответе."}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Нейросеть</Form.Label>
              <Form.Select value={manLlm} onChange={(e) => setManLlm(e.target.value)}>
                {LLM_OPTIONS.map((l) => <option key={l} value={l}>{LLM_LABELS[l] || l}</option>)}
              </Form.Select>
              {LLM_HINTS[manLlm] && (
                <Form.Text className="text-muted">
                  Открыть: <strong>{LLM_HINTS[manLlm]}</strong>
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Запрос который ты задавал</Form.Label>
              <Form.Control
                type="text"
                placeholder="например: best AI business plan tool"
                value={manQuery}
                onChange={(e) => setManQuery(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ответ нейросети</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Вставь сюда полный ответ..."
                value={manResponse}
                onChange={(e) => setManResponse(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowManual(false); setManResult(null); }}>Закрыть</Button>
          <Button
            style={{ backgroundColor: BRAND, borderColor: BRAND }}
            onClick={saveManual}
            disabled={manSaving || !manResponse.trim() || !manQuery.trim()}
          >
            {manSaving ? <Spinner size="sm" animation="border" /> : "Проверить и сохранить"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── AI Bot Crawlers ──────────────────────────────────────── */}
      <hr className="my-4" />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0" style={{ color: BRAND }}>🕷️ AI Bot Crawlers — кто сканирует контент</h5>
        <Button variant="outline-secondary" size="sm" onClick={loadBotCrawls} disabled={botLoading}>
          {botLoading ? <Spinner size="sm" animation="border" /> : "Обновить"}
        </Button>
      </div>
      <p className="text-muted small mb-3">
        Автоматический трекинг визитов GPTBot, PerplexityBot, ClaudeBot и других AI-краулеров на страницы контента.
        Данные собираются Next.js middleware при каждом визите.
      </p>
      {botLoading ? (
        <div className="text-center py-3"><Spinner animation="border" style={{ color: BRAND }} /></div>
      ) : !botData || botData.total_events === 0 ? (
        <Card className="mb-3">
          <Card.Body className="text-muted small">
            Пока нет визитов от AI-краулеров. Данные появятся автоматически, как только GPTBot или PerplexityBot зайдут на страницы блога.
          </Card.Body>
        </Card>
      ) : (
        <>
          {botData.recommendations.length > 0 && (
            <div className="mb-3">
              {botData.recommendations.map((r, i) => (
                <Alert key={i} variant={SEVERITY_VARIANT[r.severity] || "info"} className="small py-2 mb-2">
                  {r.path && <strong>{r.path}</strong>}{r.path && " — "}{r.action}
                  {r.age_days !== undefined && <span className="ms-1 text-muted">({r.age_days} дн. без краулера)</span>}
                  {r.days_to_first_crawl !== undefined && <span className="ms-1 text-muted">(обнаружена через {r.days_to_first_crawl} дн.)</span>}
                  {r.missing_bots && <span className="ms-1 text-muted">Нет: {r.missing_bots.join(", ")}</span>}
                </Alert>
              ))}
            </div>
          )}
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
          <Card className="shadow-sm mb-3">
            <Card.Header className="small fw-semibold">По страницам</Card.Header>
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Путь</th><th>Боты</th>
                  <th className="text-end">Визитов</th>
                  <th className="text-end">Первый визит</th>
                  <th className="text-end">До обнаружения</th>
                </tr>
              </thead>
              <tbody>
                {botData.by_page.map((p) => (
                  <tr key={p.path}>
                    <td className="small" style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.path}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {p.bots.map((b) => <Badge key={b} style={{ backgroundColor: botColor(b), fontSize: "0.65rem" }}>{b}</Badge>)}
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
          <Card className="shadow-sm">
            <Card.Header className="small fw-semibold">Последние визиты</Card.Header>
            <Table hover responsive size="sm" className="mb-0">
              <thead><tr><th>Бот</th><th>Страница</th><th className="text-end">Когда</th></tr></thead>
              <tbody>
                {botData.recent_events.slice(0, 10).map((e, i) => (
                  <tr key={i}>
                    <td><Badge style={{ backgroundColor: botColor(e.bot_name), fontSize: "0.65rem" }}>{e.bot_name}</Badge></td>
                    <td className="small" style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.url_path}</td>
                    <td className="text-end small text-muted">{new Date(e.crawled_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}

      {/* Context modal */}
      <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="small">
            {selected && (LLM_LABELS[selected.llm] || selected.llm)} — контекст упоминания
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p className="text-muted small"><strong>Запрос:</strong> {selected.query}</p>
              <Card className="bg-light border-0">
                <Card.Body className="small" style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                  {selected.excerpt}
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showErrorDetails} onHide={() => setShowErrorDetails(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="small">Ошибочные проверки Gemini</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Table responsive size="sm" className="mb-0 align-middle">
            <thead className="table-light"><tr><th>Запрос</th><th>Ошибка</th><th>Дата</th></tr></thead>
            <tbody>
              {errorItems.map((item) => (
                <tr key={item.id}>
                  <td className="small" style={{ maxWidth: 240 }}>{item.query}</td>
                  <td className="small text-muted" style={{ maxWidth: 260 }}>{item.excerpt}</td>
                  <td className="small text-nowrap">{fmtDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};
