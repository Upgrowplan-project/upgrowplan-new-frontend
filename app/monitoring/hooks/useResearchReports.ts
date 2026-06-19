"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";

export interface ResearchReportSummary {
  research_id: string;
  service_name?: string;
  product_name?: string;
  country?: string;
  region?: string;
  business_type?: string;
  product_type?: string;
  industry?: string;
  localization?: string;
  report_language?: string;
  status?: string;
  duration_seconds?: number | null;
  created_at?: string | null;
  completed_at?: string | null;
  rating?: number | null;
}

export interface ResearchLogEntry {
  created_at?: string | null;
  level?: string;
  source?: string;
  stage?: string;
  progress?: number | null;
  message?: string;
}

export interface ResearchReportDetail extends ResearchReportSummary {
  request?: Record<string, unknown> | null;
  report?: Record<string, unknown> | null;
  logs?: ResearchLogEntry[];
  rating?: any;
}

export const useResearchReports = (
  serviceName: string = "market-research-service",
  limit: number = 50,
) => {
  const [reports, setReports] = useState<ResearchReportSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: String(limit) });
      if (serviceName) params.set("service_name", serviceName);
      const res = await fetch(
        `${API_BASE_URL}/api/monitoring/reports?${params.toString()}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReports(data.reports || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading reports");
    } finally {
      setLoading(false);
    }
  }, [serviceName, limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, total, loading, error, refresh: fetchReports };
};

export const useResearchReport = (researchId: string | null) => {
  const [report, setReport] = useState<ResearchReportDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!researchId) {
      setReport(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/monitoring/reports/${encodeURIComponent(researchId)}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setReport(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error loading report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [researchId]);

  return { report, loading, error };
};
