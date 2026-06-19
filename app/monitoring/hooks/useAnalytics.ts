"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";

export interface AnalyticsTopItem {
  key: string | null;
  count: number;
}

export interface AnalyticsData {
  period_days: number;
  totals: {
    pageviews: number;
    unique_visitors: number;
    sessions: number;
  };
  timeseries: { date: string; views: number; visitors: number }[];
  top_pages: AnalyticsTopItem[];
  top_sources: AnalyticsTopItem[];
  top_referrers: AnalyticsTopItem[];
  devices: AnalyticsTopItem[];
  browsers: AnalyticsTopItem[];
  countries: AnalyticsTopItem[];
  funnel: {
    visitors: number;
    sessions: number;
    researches: number;
    ratings: number;
  };
}

export const useAnalytics = (days: number = 30) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/monitoring/analytics?days=${days}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading analytics");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
