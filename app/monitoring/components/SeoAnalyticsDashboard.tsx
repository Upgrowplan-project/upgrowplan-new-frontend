"use client";

import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { VisibilityDashboard } from "./VisibilityDashboard";
import { monitoringFetch } from "../lib/api";

type Tab = "traffic" | "search";

const BRAND = "#1e6078";

function csvEsc(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  return [[...headers], ...rows].map((row) => row.map(csvEsc).join(",")).join("\n");
}

async function downloadAllCsv() {
  const [analytics, timeseries, gTop, bTop, gPages] = await Promise.all([
    monitoringFetch("/api/monitoring/analytics?days=30").then((r) => r.json()).catch(() => null),
    monitoringFetch("/api/monitoring/visibility/timeseries?days=30").then((r) => r.json()).catch(() => ({})),
    monitoringFetch("/api/monitoring/visibility/top?source=google&dimension=query&limit=100").then((r) => r.json()).catch(() => []),
    monitoringFetch("/api/monitoring/visibility/top?source=bing&dimension=query&limit=50").then((r) => r.json()).catch(() => []),
    monitoringFetch("/api/monitoring/visibility/top?source=google&dimension=page&limit=50").then((r) => r.json()).catch(() => []),
  ]);

  const parts: string[] = [];
  const now = new Date().toISOString().slice(0, 10);

  // Site traffic
  const tsRows = ((analytics?.timeseries as any[]) || []).map((p) => [p.date, p.views, p.visitors, p.sessions]);
  parts.push(`# Посещаемость сайта — последние 30 дней (${now})`);
  parts.push(toCsv(["Дата", "Просмотры", "Посетители", "Сессии"], tsRows));

  // Google Search Console
  const gscRows = ((timeseries?.google as any[]) || []).map((p) => [
    p.date, p.impressions, p.clicks,
    ((p.ctr || 0) * 100).toFixed(2) + "%",
    p.position != null ? Number(p.position).toFixed(1) : "",
  ]);
  parts.push(`\n# Google Search Console — показы/клики по дням (${now})`);
  parts.push(toCsv(["Дата", "Показы", "Клики", "CTR", "Позиция"], gscRows));

  // Bing
  const bingRows = ((timeseries?.bing as any[]) || []).map((p) => [
    p.date, p.impressions, p.clicks,
    ((p.ctr || 0) * 100).toFixed(2) + "%",
    p.position != null ? Number(p.position).toFixed(1) : "",
  ]);
  parts.push(`\n# Bing Webmaster — показы/клики по дням (${now})`);
  parts.push(toCsv(["Дата", "Показы", "Клики", "CTR", "Позиция"], bingRows));

  // Top Google queries
  parts.push(`\n# Топ Google-запросов (${now})`);
  parts.push(toCsv(["Запрос", "Показы", "Клики", "CTR", "Позиция"],
    ((Array.isArray(gTop) ? gTop : []) as any[]).map((r) => [
      r.key, r.impressions, r.clicks,
      ((r.ctr || 0) * 100).toFixed(2) + "%",
      r.position != null ? Number(r.position).toFixed(1) : "",
    ])
  ));

  // Top Google pages
  parts.push(`\n# Топ страниц Google (${now})`);
  parts.push(toCsv(["Страница", "Показы", "Клики", "CTR", "Позиция"],
    ((Array.isArray(gPages) ? gPages : []) as any[]).map((r) => [
      r.key, r.impressions, r.clicks,
      ((r.ctr || 0) * 100).toFixed(2) + "%",
      r.position != null ? Number(r.position).toFixed(1) : "",
    ])
  ));

  // Top Bing queries
  if (Array.isArray(bTop) && bTop.length > 0) {
    parts.push(`\n# Топ Bing-запросов (${now})`);
    parts.push(toCsv(["Запрос", "Показы", "Клики", "CTR", "Позиция"],
      (bTop as any[]).map((r) => [
        r.key, r.impressions, r.clicks,
        ((r.ctr || 0) * 100).toFixed(2) + "%",
        r.position != null ? Number(r.position).toFixed(1) : "",
      ])
    ));
  }

  const csv = parts.join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-report-${now}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const SeoAnalyticsDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>("traffic");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await downloadAllCsv();
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Sub-tab switcher + CSV export */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <ButtonGroup size="sm">
          <Button
            variant={tab === "traffic" ? "primary" : "outline-secondary"}
            style={tab === "traffic" ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
            onClick={() => setTab("traffic")}
          >
            📊 Посещаемость
          </Button>
          <Button
            variant={tab === "search" ? "primary" : "outline-secondary"}
            style={tab === "search" ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
            onClick={() => setTab("search")}
          >
            🔎 Поисковые показатели
          </Button>
        </ButtonGroup>
        <div className="d-flex align-items-center gap-2">
          {exportError && <span className="text-danger small">{exportError}</span>}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
            title="Скачать все SEO-метрики в CSV"
          >
            {exporting ? "Экспорт…" : "⬇ Скачать CSV"}
          </Button>
        </div>
      </div>

      {tab === "traffic" ? <AnalyticsDashboard /> : <VisibilityDashboard />}
    </div>
  );
};
