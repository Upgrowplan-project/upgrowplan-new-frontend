"use client";

import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
  ProgressBar,
  Form,
  Table,
} from "react-bootstrap";
import { useQualityLab, ScenarioResult, BugEntry } from "../hooks/useQualityLab";

const BRAND = "#1e6078";

const SUITES = [
  { value: "smoke", label: "🔥 Smoke (2 сценария)" },
  { value: "archetypes", label: "🏗 Archetypes (21 сценарий)" },
  { value: "geos", label: "🌍 Geos (4 сценария)" },
  { value: "diverse_v2", label: "🧩 Diverse v2 (5 сценариев)" },
  { value: "regressions", label: "🐛 Regressions (6 сценариев)" },
  { value: "stress_universality", label: "💥 Stress Universality (6 сценариев)" },
  { value: "all", label: "📦 All (52 сценария)" },
];

const SERVICES = [
  { value: "market_research", label: "Market Research Service" },
];

function scoreColor(score: number): string {
  if (score >= 90) return "success";
  if (score >= 75) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

function scoreHex(score: number): string {
  if (score >= 75) return "#28a745";
  if (score >= 60) return "#ffc107";
  return "#dc3545";
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pass: "success",
    warn: "warning",
    fail: "danger",
  };
  const labels: Record<string, string> = {
    pass: "✅ PASS",
    warn: "⚠️ WARN",
    fail: "❌ FAIL",
  };
  return (
    <Badge bg={map[status] || "secondary"}>
      {labels[status] || status.toUpperCase()}
    </Badge>
  );
}

function severityBadge(sev: string) {
  const map: Record<string, string> = {
    CRITICAL: "danger",
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "secondary",
  };
  return <Badge bg={map[sev] || "secondary"} className="me-1">{sev}</Badge>;
}

function categoryBadge(cat: string) {
  const map: Record<string, string> = {
    "GEO/CURRENCY": "info",
    ARCHETYPE: "warning",
    FINANCIAL: "danger",
    "AI/HALLUCINATION": "dark",
    DATA_QUALITY: "secondary",
    TRACEABILITY: "secondary",
    COMPETITORS: "warning",
    OTHER: "light",
  };
  return (
    <Badge bg={map[cat] || "secondary"} text={cat === "OTHER" ? "dark" : undefined}>
      {cat}
    </Badge>
  );
}

function HealthBar({ score }: { score: number }) {
  return (
    <div style={{ minWidth: 100 }}>
      <ProgressBar
        now={score}
        variant={scoreColor(score)}
        style={{ height: 8, borderRadius: 4 }}
      />
      <div className="text-center" style={{ fontSize: 11, color: scoreHex(score), fontWeight: 600 }}>
        {score.toFixed(1)}
      </div>
    </div>
  );
}

function ComponentCell({ score, weight }: { score: number; weight: string }) {
  return (
    <div className="text-center">
      <div style={{ fontSize: 13, fontWeight: 600, color: scoreHex(score) }}>
        {score.toFixed(0)}
      </div>
      <div style={{ fontSize: 10, color: "#aaa" }}>{weight}</div>
    </div>
  );
}

function EcosystemHealthBar({ pass, warn, fail, total }: { pass: number; warn: number; fail: number; total: number }) {
  const index = ((pass + warn * 0.5) / Math.max(1, total)) * 100;
  return (
    <div>
      <ProgressBar style={{ height: 12, borderRadius: 6 }}>
        <ProgressBar variant="success" now={(pass / total) * 100} key={1} />
        <ProgressBar variant="warning" now={(warn / total) * 100} key={2} />
        <ProgressBar variant="danger" now={(fail / total) * 100} key={3} />
      </ProgressBar>
      <div className="d-flex justify-content-between mt-1" style={{ fontSize: 11, color: "#666" }}>
        <span>Ecosystem Health Index: <strong style={{ color: scoreHex(index) }}>{index.toFixed(1)}%</strong></span>
        <span>
          <span className="text-success me-2">✅ {pass}</span>
          <span className="text-warning me-2">⚠️ {warn}</span>
          <span className="text-danger">❌ {fail}</span>
        </span>
      </div>
    </div>
  );
}

export const QualityLabDashboard: React.FC = () => {
  const { summary, bugLog, loading, running, error, runStatus, fetchResults, runTests } =
    useQualityLab();

  const [service, setService] = useState("market_research");
  const [suite, setSuite] = useState("smoke");
  const [mode, setMode] = useState("auto");
  const [noCache, setNoCache] = useState(false);
  const [activeBugFilter, setActiveBugFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const agg = summary?.aggregate;
  const bugs = bugLog?.bugs || [];
  const filteredBugs = activeBugFilter
    ? bugs.filter((b) => b.bug_category === activeBugFilter)
    : bugs;

  return (
    <div>
      {/* ── Run Controls ─────────────────────────────────────────────── */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex flex-wrap align-items-end gap-3">
            <div>
              <Form.Label className="small text-muted mb-1">Сервис</Form.Label>
              <Form.Select
                size="sm"
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{ minWidth: 200 }}
              >
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Form.Select>
            </div>
            <div>
              <Form.Label className="small text-muted mb-1">Suite</Form.Label>
              <Form.Select
                size="sm"
                value={suite}
                onChange={(e) => setSuite(e.target.value)}
                style={{ minWidth: 220 }}
              >
                {SUITES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Form.Select>
            </div>
            <div>
              <Form.Label className="small text-muted mb-1">Режим</Form.Label>
              <Form.Select
                size="sm"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={{ minWidth: 140 }}
              >
                <option value="auto">Auto</option>
                <option value="live">Live API</option>
                <option value="offline">Offline</option>
                <option value="rescore">Rescore</option>
              </Form.Select>
            </div>
            <Form.Check
              type="checkbox"
              label="No cache"
              checked={noCache}
              onChange={(e) => setNoCache(e.target.checked)}
              className="mb-1"
            />
            <Button
              style={{ backgroundColor: BRAND, border: "none" }}
              disabled={running}
              onClick={() => runTests(service, suite, mode, noCache)}
            >
              {running ? (
                <><Spinner as="span" animation="border" size="sm" className="me-2" />Запуск...</>
              ) : (
                "▶ Запустить тест"
              )}
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={fetchResults} disabled={loading}>
              🔄 Обновить
            </Button>
          </div>
          {runStatus && (
            <Alert variant="info" className="mt-3 mb-0 py-2 small">{runStatus}</Alert>
          )}
        </Card.Body>
      </Card>

      {/* ── Loading / Error ───────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="primary" />
          <div className="text-muted mt-2 small">Загрузка результатов...</div>
        </div>
      )}
      {error && !loading && (
        <Alert variant="warning">
          <strong>Нет данных:</strong> {error}
          <div className="mt-2 small text-muted">
            Запустите тест через кнопку выше или через CLI:
            <br />
            <code>python run_quality_lab.py --service market_research --suite smoke --mode offline</code>
          </div>
        </Alert>
      )}

      {summary && !loading && (
        <>
          {/* ── Summary Cards ─────────────────────────────────────────── */}
          <Row className="mb-4 g-3">
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="text-muted small mb-1">Сценариев</div>
                  <div className="display-6 fw-bold">{agg?.count ?? 0}</div>
                  <div className="text-muted small mt-1">
                    Suite: <strong>{summary.suite}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="text-muted small mb-1">Средний балл</div>
                  <div
                    className="display-6 fw-bold"
                    style={{ color: scoreHex(agg?.average_score ?? 0) }}
                  >
                    {agg?.average_score?.toFixed(1) ?? "—"}
                  </div>
                  <div className="text-muted small mt-1">из 100</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="text-muted small mb-1">Баги найдены</div>
                  <div className="display-6 fw-bold text-danger">
                    {bugLog?.total_bugs ?? 0}
                  </div>
                  <div className="small mt-1">
                    {bugLog?.aggregate.critical_count ? (
                      <span className="text-danger me-2">
                        {bugLog.aggregate.critical_count} critical
                      </span>
                    ) : null}
                    {bugLog?.aggregate.high_count ? (
                      <span className="text-warning">
                        {bugLog.aggregate.high_count} high
                      </span>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="text-muted small mb-2">Ecosystem Health</div>
                  <EcosystemHealthBar
                    pass={agg?.pass ?? 0}
                    warn={agg?.warn ?? 0}
                    fail={agg?.fail ?? 0}
                    total={agg?.count ?? 1}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* ── Last run info ─────────────────────────────────────────── */}
          <div className="text-muted small mb-3">
            Последний запуск:{" "}
            <strong>{new Date(summary.generated_at).toLocaleString("ru-RU")}</strong>
            {" · "}API: <code>{summary.base_url}</code>
          </div>

          {/* ── Scenarios Table ───────────────────────────────────────── */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="fw-bold" style={{ backgroundColor: "#f8f9fb" }}>
              📋 Результаты по сценариям
            </Card.Header>
            <div style={{ overflowX: "auto" }}>
              <Table hover size="sm" className="mb-0" style={{ fontSize: 13 }}>
                <thead style={{ backgroundColor: "#f1f3f5" }}>
                  <tr>
                    <th style={{ minWidth: 180 }}>Сценарий</th>
                    <th style={{ minWidth: 120 }}>Балл / Health</th>
                    <th className="text-center">Статус</th>
                    <th className="text-center" title="Конкурентный анализ 30%">Конк.<br/><span style={{fontWeight:400,color:"#aaa"}}>30%</span></th>
                    <th className="text-center" title="Потребительские инсайты 25%">Инс.<br/><span style={{fontWeight:400,color:"#aaa"}}>25%</span></th>
                    <th className="text-center" title="Анализ рынка 20%">Рынок<br/><span style={{fontWeight:400,color:"#aaa"}}>20%</span></th>
                    <th className="text-center" title="Целевая аудитория 15%">ЦА<br/><span style={{fontWeight:400,color:"#aaa"}}>15%</span></th>
                    <th className="text-center" title="Стратегия и риски 10%">Стр.<br/><span style={{fontWeight:400,color:"#aaa"}}>10%</span></th>
                    <th className="text-center">Валюта</th>
                    <th className="text-center">Конк-ты</th>
                    <th style={{ minWidth: 200 }}>Предупреждения</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.results.map((r: ScenarioResult) => {
                    const sc = r.scorecard;
                    const m = sc.metrics;
                    return (
                      <tr key={r.scenario_id}>
                        <td>
                          <div className="fw-semibold" style={{ fontSize: 12 }}>
                            {r.scenario_name || r.scenario_id}
                          </div>
                          {r.elapsed_seconds > 0 && (
                            <div className="text-muted" style={{ fontSize: 10 }}>
                              {r.elapsed_seconds.toFixed(0)}s
                            </div>
                          )}
                        </td>
                        <td>
                          <HealthBar score={sc.final_score} />
                        </td>
                        <td className="text-center align-middle">
                          {statusBadge(r.status)}
                        </td>
                        <td className="align-middle"><ComponentCell score={sc.competitor_score} weight="30%" /></td>
                        <td className="align-middle"><ComponentCell score={sc.insights_score} weight="25%" /></td>
                        <td className="align-middle"><ComponentCell score={sc.market_score} weight="20%" /></td>
                        <td className="align-middle"><ComponentCell score={sc.audience_score} weight="15%" /></td>
                        <td className="align-middle"><ComponentCell score={sc.strategy_score} weight="10%" /></td>
                        <td className="text-center align-middle">
                          {m.currency_ok ? (
                            <span className="text-success fw-bold">✓</span>
                          ) : (
                            <span className="text-danger fw-bold">✗</span>
                          )}
                        </td>
                        <td className="text-center align-middle">
                          <span style={{ fontWeight: 600 }}>{m.direct_competitors}</span>
                        </td>
                        <td style={{ fontSize: 11 }}>
                          {r.warnings.slice(0, 2).map((w, i) => (
                            <div key={i} className="text-muted">{w}</div>
                          ))}
                          {r.warnings.length > 2 && (
                            <div className="text-muted">+{r.warnings.length - 2} ещё</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card>

          {/* ── Bug Log ───────────────────────────────────────────────── */}
          {bugLog && bugLog.total_bugs > 0 && (
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="fw-bold d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f8f9fb" }}>
                <span>🐛 Лог багов — {bugLog.total_bugs} проблем</span>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={activeBugFilter === null ? "dark" : "outline-secondary"}
                    onClick={() => setActiveBugFilter(null)}
                  >
                    Все
                  </Button>
                  {Object.entries(bugLog.aggregate.by_category).map(([cat, cnt]) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={activeBugFilter === cat ? "dark" : "outline-secondary"}
                      onClick={() => setActiveBugFilter(activeBugFilter === cat ? null : cat)}
                    >
                      {cat} <Badge bg="secondary">{cnt}</Badge>
                    </Button>
                  ))}
                </div>
              </Card.Header>
              <div style={{ overflowX: "auto" }}>
                <Table hover size="sm" className="mb-0" style={{ fontSize: 12 }}>
                  <thead style={{ backgroundColor: "#f1f3f5" }}>
                    <tr>
                      <th>Severity</th>
                      <th>Категория</th>
                      <th>Сценарий</th>
                      <th>Балл</th>
                      <th>Описание бага</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBugs.map((bug: BugEntry, i: number) => (
                      <tr key={i} style={{ backgroundColor: bug.severity === "CRITICAL" ? "#fff5f5" : undefined }}>
                        <td className="align-middle">{severityBadge(bug.severity)}</td>
                        <td className="align-middle">{categoryBadge(bug.bug_category)}</td>
                        <td className="align-middle" style={{ fontFamily: "monospace", fontSize: 11 }}>
                          {bug.scenario_id}
                        </td>
                        <td className="align-middle text-center">
                          <span style={{ color: scoreHex(bug.scenario_score), fontWeight: 600 }}>
                            {bug.scenario_score}
                          </span>
                        </td>
                        <td>{bug.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}

          {/* ── Bug breakdown by category ─────────────────────────────── */}
          {bugLog && Object.keys(bugLog.aggregate.by_category).length > 0 && (
            <Row className="g-3">
              {Object.entries(bugLog.aggregate.by_category).map(([cat, cnt]) => (
                <Col key={cat} xs={6} md={4} lg={3}>
                  <Card
                    className="shadow-sm border-0 h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveBugFilter(activeBugFilter === cat ? null : cat)}
                  >
                    <Card.Body className="py-3">
                      <div className="mb-1">{categoryBadge(cat)}</div>
                      <div className="display-6 fw-bold">{cnt}</div>
                      <div className="text-muted small">
                        {bugLog.aggregate.by_severity["CRITICAL"] &&
                          cat === Object.entries(bugLog.aggregate.by_category).sort((a, b) => b[1] - a[1])[0][0]
                          ? `${bugLog.aggregate.by_severity["CRITICAL"] || 0} critical`
                          : "проблем"}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};
