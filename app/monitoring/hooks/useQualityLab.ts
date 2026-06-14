"use client";

import { useState, useCallback } from "react";

export interface ScenarioResult {
  scenario_id: string;
  scenario_name: string;
  status: "pass" | "warn" | "fail";
  elapsed_seconds: number;
  scorecard: {
    competitor_score: number;
    financial_score: number;
    insights_score: number;
    market_score: number;
    audience_score: number;
    strategy_score: number;
    final_score: number;
    metrics: {
      direct_competitors: number;
      pain_points_count: number;
      audience_segments_count: number;
      currency_ok: boolean;
      low_confidence: boolean;
      hard_fail: boolean;
      ai_artifacts?: { ok: boolean; severity: string; issues: string[] };
      [key: string]: unknown;
    };
  };
  warnings: string[];
}

export interface QualityLabSummary {
  suite: string;
  base_url: string;
  generated_at: string;
  results: ScenarioResult[];
  aggregate: {
    count: number;
    pass: number;
    warn: number;
    fail: number;
    average_score: number;
  };
}

export interface BugEntry {
  scenario_id: string;
  bug_category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  message: string;
  scenario_status: string;
  scenario_score: number;
  context: Record<string, unknown>;
}

export interface BugLog {
  suite: string;
  generated_at: string;
  total_bugs: number;
  total_scenarios: number;
  aggregate: {
    by_severity: Record<string, number>;
    by_category: Record<string, number>;
    top_failing_scenarios: { scenario_id: string; bug_count: number }[];
    critical_count: number;
    high_count: number;
  };
  bugs: BugEntry[];
}

export function useQualityLab() {
  const [summary, setSummary] = useState<QualityLabSummary | null>(null);
  const [bugLog, setBugLog] = useState<BugLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quality-lab/results");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to load results");
        return;
      }
      const data = await res.json();
      setSummary(data.summary);
      setBugLog(data.bugLog);
    } catch (e) {
      setError("Network error loading quality lab results");
    } finally {
      setLoading(false);
    }
  }, []);

  const runTests = useCallback(
    async (service: string, suite: string, mode: string, noCache: boolean) => {
      setRunning(true);
      setRunStatus(null);
      try {
        const res = await fetch("/api/quality-lab/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service, suite, mode, no_cache: noCache }),
        });
        const data = await res.json();
        if (data.ok) {
          setRunStatus(`Тест запущен (PID ${data.pid}). Обновите результаты через минуту.`);
          // Poll for updated results after a delay
          setTimeout(fetchResults, 15000);
        } else {
          setRunStatus(`Ошибка запуска: ${data.error}`);
        }
      } catch {
        setRunStatus("Ошибка соединения при запуске теста");
      } finally {
        setRunning(false);
      }
    },
    [fetchResults]
  );

  return {
    summary,
    bugLog,
    loading,
    running,
    error,
    runStatus,
    fetchResults,
    runTests,
  };
}
