"use client";

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { downloadSeoGeoReport } from "../lib/seoGeoReport";

const PERIODS = [7, 30, 90];

// Выгрузка единого файла «Посещаемость + SEO + GEO» — общая для вкладок SEO и GEO.
export const ExportReportButton: React.FC = () => {
  const [days, setDays] = useState(30);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ tone: "danger" | "warning"; text: string } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    try {
      const failed = await downloadSeoGeoReport(days);
      if (failed.length > 0) {
        setMessage({ tone: "warning", text: `Файл скачан, но без данных: ${failed.join(", ")}` });
      }
    } catch (e) {
      setMessage({ tone: "danger", text: e instanceof Error ? e.message : "Ошибка выгрузки" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      {message && <span className={`text-${message.tone} small`}>{message.text}</span>}
      <Form.Select
        size="sm"
        style={{ width: "auto" }}
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        aria-label="Период выгрузки"
      >
        {PERIODS.map((d) => (
          <option key={d} value={d}>{d} дн.</option>
        ))}
      </Form.Select>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={handleExport}
        disabled={exporting}
        title="Скачать посещаемость, поисковые показатели Google/Bing, упоминания в нейросетях и визиты AI-ботов одним CSV"
      >
        {exporting ? "Выгрузка…" : "⬇ Выгрузить SEO + GEO"}
      </Button>
    </div>
  );
};
