"use client";

import { useCallback, useEffect, useState } from "react";
import { monitoringFetch } from "../monitoring/lib/api";

type ResearchRow = {
  research_id: string;
  product_name?: string;
  country?: string;
  status?: string;
  created_at?: string | null;
  completed_at?: string | null;
  rating?: number | null;
};

export default function ResearchHistory({ locale = "en" }: { locale?: "en" | "ru" }) {
  const ru = locale === "ru";
  const [rows, setRows] = useState<ResearchRow[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setBusy(true);
      const response = await monitoringFetch("/api/monitoring/my-reports");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setRows(data.reports || []);
      setError("");
    } catch {
      setError(ru ? "Не удалось загрузить историю исследований." : "Could not load your research history.");
    } finally {
      setBusy(false);
    }
  }, [ru]);

  useEffect(() => { void refresh(); }, [refresh]);

  const openReport = async (id: string) => {
    try {
      const response = await monitoringFetch(`/api/monitoring/my-reports/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error();
      setSelected(await response.json());
    } catch {
      setError(ru ? "Отчёт пока недоступен." : "This report is not available yet.");
    }
  };

  const download = async (id: string) => {
    const response = await monitoringFetch(`/api/monitoring/my-reports/${encodeURIComponent(id)}/artifact`);
    if (!response.ok) {
      setError(ru ? "Документ ещё не готов." : "The document is not ready yet.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${id}_report.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3 flex-wrap">
        <h2 className="h4 mb-0">{ru ? "История исследований" : "Research history"}</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={() => void refresh()}>
          {ru ? "Обновить" : "Refresh"}
        </button>
      </div>
      {error && <div className="alert alert-warning">{error}</div>}
      {busy ? <p className="text-muted">{ru ? "Загрузка…" : "Loading…"}</p> : rows.length === 0 ? (
        <div className="alert alert-light">{ru ? "Запущенные исследования появятся здесь." : "Your completed research runs will appear here."}</div>
      ) : (
        <div className="table-responsive"><table className="table align-middle">
          <thead><tr><th>{ru ? "Исследование" : "Research"}</th><th>{ru ? "Дата" : "Date"}</th><th>{ru ? "Статус" : "Status"}</th><th>{ru ? "Оценка" : "Rating"}</th><th /></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.research_id}>
            <td>{row.product_name || row.research_id}{row.country ? <small className="d-block text-muted">{row.country}</small> : null}</td>
            <td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</td>
            <td>{row.status || "—"}</td><td>{row.rating == null ? "—" : `${row.rating} ⭐`}</td>
            <td className="text-end"><div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => void openReport(row.research_id)}>{ru ? "Подробности" : "Details"}</button>
              {row.status === "completed" && <button className="btn btn-outline-primary btn-sm" onClick={() => void download(row.research_id)}>{ru ? "DOCX" : "Download DOCX"}</button>}
            </div></td>
          </tr>)}</tbody>
        </table></div>
      )}
      {selected && <div className="mt-4"><div className="d-flex justify-content-between"><h3 className="h5">{ru ? "Детали исследования и логи" : "Research details and logs"}</h3><button className="btn-close" aria-label="Close" onClick={() => setSelected(null)} /></div><pre className="bg-light rounded p-3 small" style={{ maxHeight: 500, overflow: "auto" }}>{JSON.stringify(selected, null, 2)}</pre></div>}
    </div>
  );
}
