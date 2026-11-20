"use client";

// [20.11 · владелец «в мониторинге отдельный пункт меню — показывать там сводку и состояние провайдеров»]
// monitoring-service: /api/monitoring/providers (остатки поставщиков данных), /api/monitoring/digests (утренняя
// сводка founder-agent), /api/monitoring/knowledge (база знаний проекта, бывший INFO.md).

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap";
import { monitoringFetch } from "../lib/api";
import { fmtDateTime } from "@/lib/formatDate";

const BRAND = "#1e6078";

export type ProviderRow = {
  id: string;
  name: string;
  used_by: string[];
  role: string;
  unit: string;
  per_run: number | null;
  per_run_source: string;
  reset: string;
  topup_url: string;
  notes: string;
  check: string;
  status: "ok" | "low" | "exhausted" | "down" | "unknown";
  remaining: number | null;
  limit: number | null;
  runs_left: number | null;
  resets_at: string | null;
  error: string | null;
  checked_at: string | null;
};
type ProvidersData = { checked_at: string | null; stale_hours: number; refreshed_now: boolean; providers: ProviderRow[] };
type Digest = { day: string; text: string; meta: Record<string, unknown> | null; created_at: string };
type Entry = { id: number; section: string; subject: string; fact: string; source: string | null; date: string | null };
type Knowledge = { sections: Record<string, string>; total: number; entries: Entry[] };

const STATUS: Record<ProviderRow["status"], { label: string; bg: string }> = {
  ok: { label: "работает", bg: "success" },
  low: { label: "мало", bg: "warning" },
  exhausted: { label: "закончился", bg: "danger" },
  down: { label: "не работает", bg: "danger" },
  unknown: { label: "нет данных", bg: "secondary" },
};
const ORDER: ProviderRow["status"][] = ["exhausted", "down", "low", "ok", "unknown"];

const fmtNum = (v: number | null, unit: string) =>
  v === null || v === undefined ? "—" : unit === "$" ? `$${v.toFixed(v < 1 ? 3 : 2)}` : `${Math.round(v)}`;

async function getJson<T>(path: string): Promise<T> {
  const r = await monitoringFetch(path);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as T;
}

export const ProvidersDashboard: React.FC = () => {
  const [prov, setProv] = useState<ProvidersData | null>(null);
  const [digests, setDigests] = useState<Digest[]>([]);
  const [day, setDay] = useState<string>("");
  const [kb, setKb] = useState<Knowledge | null>(null);
  const [kbSection, setKbSection] = useState<string>("");
  const [kbQuery, setKbQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProviders = useCallback(async (refresh = false) => {
    const d = await getJson<ProvidersData>(`/api/monitoring/providers${refresh ? "?refresh=1" : ""}`);
    setProv(d);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [_, dg, k] = await Promise.all([
          loadProviders(false),
          getJson<{ digests: Digest[] }>("/api/monitoring/digests?limit=14"),
          getJson<Knowledge>("/api/monitoring/knowledge?limit=1000"),
        ]);
        setDigests(dg.digests);
        if (dg.digests.length) setDay(dg.digests[0].day);
        setKb(k);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [loadProviders]);

  const checkNow = async () => {
    setChecking(true);
    setError(null);
    try {
      await loadProviders(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setChecking(false);
    }
  };

  const rows = useMemo(
    () => [...(prov?.providers || [])].sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status)),
    [prov]
  );
  const problems = rows.filter((r) => ["exhausted", "down", "low"].includes(r.status));
  const digest = digests.find((d) => d.day === day);
  const entries = useMemo(() => {
    const q = kbQuery.trim().toLowerCase();
    return (kb?.entries || []).filter(
      (e) =>
        (!kbSection || e.section === kbSection) &&
        (!q || `${e.subject} ${e.fact} ${e.source || ""}`.toLowerCase().includes(q))
    );
  }, [kb, kbSection, kbQuery]);

  if (loading)
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <Spinner animation="border" size="sm" /> Загрузка…
      </div>
    );

  return (
    <div>
      {error && <Alert variant="warning">⚠️ Не удалось загрузить данные: {error}</Alert>}

      {/* Поставщики данных */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
          <div>
            <h5 className="mb-0">Поставщики данных</h5>
            <small className="text-muted">
              Замер: {prov?.checked_at ? fmtDateTime(prov.checked_at) : "—"}
              {prov?.refreshed_now ? " (только что)" : ""} · обновляется при открытии, если старше {prov?.stale_hours} ч
            </small>
          </div>
          <Button onClick={checkNow} disabled={checking} style={{ backgroundColor: BRAND, border: "none" }}>
            {checking ? <Spinner as="span" animation="border" size="sm" /> : "🔄 Проверить сейчас"}
          </Button>
        </Card.Header>
        <Card.Body className="pt-0">
          {problems.length > 0 ? (
            <Alert variant="warning" className="py-2 small">
              Требуют внимания: {problems.map((p) => `${p.name} — ${STATUS[p.status].label}`).join("; ")}
            </Alert>
          ) : (
            <Alert variant="success" className="py-2 small">Проблем с остатками не найдено (где остаток можно проверить).</Alert>
          )}
          <Table responsive hover size="sm" className="align-middle small">
            <thead>
              <tr>
                <th>Поставщик</th>
                <th>Статус</th>
                <th className="text-end">Остаток</th>
                <th className="text-end">Расход / прогон</th>
                <th className="text-end">Хватит на</th>
                <th>Сброс</th>
                <th>Где используется</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="fw-semibold">{r.name}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{r.role}</div>
                    {r.error && <div className="text-danger" style={{ fontSize: 12 }}>{r.error}</div>}
                  </td>
                  <td><Badge bg={STATUS[r.status].bg}>{STATUS[r.status].label}</Badge></td>
                  <td className="text-end">
                    {fmtNum(r.remaining, r.unit)}
                    {r.limit ? <span className="text-muted"> / {fmtNum(r.limit, r.unit)}</span> : null}
                    <div className="text-muted" style={{ fontSize: 11 }}>{r.unit}</div>
                  </td>
                  <td className="text-end" title={r.per_run_source}>{r.per_run ?? "—"}</td>
                  <td className="text-end">{r.runs_left === null ? "—" : `${r.runs_left} прог.`}</td>
                  <td style={{ fontSize: 12 }}>{r.resets_at ? fmtDateTime(r.resets_at) : r.reset}</td>
                  <td style={{ fontSize: 12 }}>{r.used_by.join(", ")}</td>
                  <td>
                    <a href={r.topup_url} target="_blank" rel="noopener noreferrer" className="small">кабинет ↗</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Утренняя сводка */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
          <h5 className="mb-0">Утренняя сводка</h5>
          {digests.length > 0 && (
            <Form.Select size="sm" style={{ width: 160 }} value={day} onChange={(e) => setDay(e.target.value)}>
              {digests.map((d) => (
                <option key={d.day} value={d.day}>{d.day}</option>
              ))}
            </Form.Select>
          )}
        </Card.Header>
        <Card.Body className="pt-0">
          {digest ? (
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.5 }}>{digest.text}</div>
          ) : (
            <div className="text-muted small">Сводок пока нет — агент присылает их после 08:00.</div>
          )}
        </Card.Body>
      </Card>

      {/* База знаний */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">База знаний проекта <small className="text-muted">({kb?.total ?? 0})</small></h5>
            <div className="d-flex gap-2">
              <Form.Select size="sm" style={{ width: 230 }} value={kbSection} onChange={(e) => setKbSection(e.target.value)}>
                <option value="">Все разделы</option>
                {Object.entries(kb?.sections || {}).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Form.Select>
              <Form.Control size="sm" style={{ width: 200 }} placeholder="Поиск…" value={kbQuery}
                onChange={(e) => setKbQuery(e.target.value)} />
            </div>
          </div>
        </Card.Header>
        <Card.Body className="pt-0">
          {entries.length === 0 && <div className="text-muted small">Записей нет.</div>}
          {Object.entries(kb?.sections || {})
            .filter(([k]) => entries.some((e) => e.section === k))
            .map(([k, title]) => (
              <div key={k} className="mb-3">
                <h6 className="text-brand mb-2">{title}</h6>
                <ul className="small mb-0 ps-3">
                  {entries.filter((e) => e.section === k).map((e) => (
                    <li key={e.id} className="mb-1">
                      <span className="text-muted">{e.date || ""}</span> <strong>{e.subject}</strong> — {e.fact}
                      {e.source && (
                        <span className="text-muted">
                          {" "}(
                          {/^https?:\/\//.test(e.source) ? (
                            <a href={e.source} target="_blank" rel="noopener noreferrer">источник</a>
                          ) : (
                            e.source
                          )}
                          )
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </Card.Body>
      </Card>
    </div>
  );
};
