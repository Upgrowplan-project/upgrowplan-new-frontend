"use client";

import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MonitoringData, ServiceHistory, MonitoringStats } from '../types/monitoring';

const API_BASE_URL = process.env.NEXT_PUBLIC_MONITORING_API_URL || 'http://localhost:8000';
const WS_URL = process.env.NEXT_PUBLIC_MONITORING_WS_URL || 'ws://localhost:8000';

export const useMonitoring = () => {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket для real-time обновлений
  const { lastMessage, readyState } = useWebSocket(`${WS_URL}/ws/monitoring`, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  // Загрузка начальных данных
  const fetchMonitoringData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/monitoring/overview`);

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
      const response = await fetch(`${API_BASE_URL}/api/monitoring/check-now`, {
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
      const response = await fetch(
        `${API_BASE_URL}/api/monitoring/alerts/${alertId}/resolve`,
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
        const response = await fetch(
          `${API_BASE_URL}/api/monitoring/service/${encodeURIComponent(serviceName)}/history?hours=${hours}`
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
        const response = await fetch(`${API_BASE_URL}/api/monitoring/stats`);

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
