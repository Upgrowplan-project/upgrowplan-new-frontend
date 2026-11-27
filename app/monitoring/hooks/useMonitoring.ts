"use client";

import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MonitoringData, ServiceHistory, MonitoringStats } from '../types/monitoring';
import { monitoringFetch, MONITORING_WS, getToken } from '../lib/api';

export const useMonitoring = () => {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket для real-time обновлений (admin-токен в query)
  const wsToken = typeof window !== "undefined" ? getToken() : null;
  // [27.11 · owner «снизить потребление часов, в том числе мониторинга»] an open dashboard tab kept the socket and reconnected
  // every ~35 min (prod 26.11: 5 of 10 monitoring wake-ups were /ws/monitoring from one hidden tab). The socket lives only while
  // the tab is visible: hidden → closed (url null), visible again → reconnects (the socket sends a fresh snapshot every 5 s).
  const [visible, setVisible] = useState(typeof document === "undefined" ? true : !document.hidden);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  const { lastMessage, readyState } = useWebSocket(
    visible ? `${MONITORING_WS}/ws/monitoring${wsToken ? `?token=${encodeURIComponent(wsToken)}` : ""}` : null,
    {
    shouldReconnect: () => !document.hidden,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  // Загрузка начальных данных
  const fetchMonitoringData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await monitoringFetch(`/api/monitoring/overview`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching monitoring data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обработка WebSocket сообщений
  useEffect(() => {
    if (lastMessage) {
      try {
        const updatedData = JSON.parse(lastMessage.data);
        setData(updatedData);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    }
  }, [lastMessage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  // Триггер немедленной проверки
  const triggerHealthCheck = async () => {
    try {
      const response = await monitoringFetch(`/api/monitoring/check-now`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error triggering health check:', err);
      throw err;
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId: number, resolvedBy: string = 'admin') => {
    try {
      const response = await monitoringFetch(
        `/api/monitoring/alerts/${alertId}/resolve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resolved_by: resolvedBy }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновляем данные после resolve
      await fetchMonitoringData();

      return await response.json();
    } catch (err) {
      console.error('Error resolving alert:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    wsStatus: readyState,
    wsConnected: readyState === ReadyState.OPEN,
    refresh: fetchMonitoringData,
    triggerHealthCheck,
    resolveAlert,
  };
};

export const useServiceHistory = (serviceName: string, hours: number = 24) => {
  const [history, setHistory] = useState<ServiceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await monitoringFetch(
          `/api/monitoring/service/${encodeURIComponent(serviceName)}/history?hours=${hours}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setHistory(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching service history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceName) {
      fetchHistory();
    }
  }, [serviceName, hours]);

  return { history, loading, error };
};

export const useMonitoringStats = () => {
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await monitoringFetch(`/api/monitoring/stats`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setStats(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching monitoring stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
