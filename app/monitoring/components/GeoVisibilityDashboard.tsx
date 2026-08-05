"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card, Table, Badge, Button, Spinner, Modal,
  Form, Row, Col, Alert,
} from "react-bootstrap";
import { monitoringFetch } from "../lib/api";

const BRAND = "#1e6078";
const LLM_LABELS: Record<string, string> = {
  gemini: "Gemini",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  claude: "Claude",
  manual: "Ручной",
};
const LLM_OPTIONS = ["chatgpt", "perplexity", "claude", "gemini", "manual"];

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
  const [summary, setSummary] = useState<Summary>({});
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ status: string; saved?: number; mentions?: number; errors?: string[]; reason?: string } | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [selected, setSelected] = useState<GeoItem | null>(null);

  // Manual form state
  const [manLlm, setManLlm] = useState("chatgpt");
  const [manQuery, setManQuery] = useState("");
  const [manResponse, setManResponse] = useState("");
  const [manSaving, setManSaving] = useState(false);
  const [manResult, setManResult] = useState<{ mentioned: boolean; excerpt: string | null } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await monitoringFetch("/api/monitoring/geo?limit=100");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
      setSummary(data.summary || {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const scanNow = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await monitoringFetch("/api/monitoring/geo/scan", { method: "POST" });
      const data = await res.json();
      setScanResult(data.result ?? data);
      await load();
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
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={load} disabled={loading}>Обновить</Button>
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

      {/* Scan result banner */}
      {scanResult && (
        <Alert
          variant={scanResult.status === "skipped" ? "warning" : scanResult.errors?.length ? "warning" : "success"}
          className="py-2 small mb-3"
          dismissible
          onClose={() => setScanResult(null)}
        >
          {scanResult.status === "skipped" ? (
            <>⚠️ <strong>GEMINI_API_KEY не настроен.</strong> Добавьте его в переменные среды Heroku monitoring-service.</>
          ) : (
            <>
              ✅ Скан завершён: отправлено {scanResult.saved ?? 0} запросов,
              упоминаний: {scanResult.mentions ?? 0}.
              {(scanResult.errors ?? []).length > 0 && (
                <> Ошибки: {scanResult.errors!.join(" | ")}</>
              )}
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
                      {item.mentioned
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
            Задай вопрос в ChatGPT / Perplexity / Claude, скопируй ответ сюда — система определит, упомянут ли upgrowplan.
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
    </div>
  );
};
