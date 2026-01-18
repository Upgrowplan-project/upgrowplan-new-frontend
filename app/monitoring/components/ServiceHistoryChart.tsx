"use client";

import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useServiceHistory } from '../hooks/useMonitoring';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ServiceHistoryChartProps {
  serviceName: string;
  hours?: number;
}

export const ServiceHistoryChart: React.FC<ServiceHistoryChartProps> = ({
  serviceName,
  hours = 24,
}) => {
  const { history, loading, error } = useServiceHistory(serviceName, hours);

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">Error loading history: {error}</div>
        </Card.Body>
      </Card>
    );
  }

  if (!history || history.data_points.length === 0) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-info">No history data available</div>
        </Card.Body>
      </Card>
    );
  }

  // Подготовка данных для графика
  const labels = history.data_points.map((point) => {
    const date = new Date(point.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const responseTimeData = history.data_points.map(
    (point) => (point.response_time || 0) * 1000 // конвертируем в миллисекунды
  );

  // Цвет линии в зависимости от статуса
  const statusColors = history.data_points.map((point) => {
    switch (point.status) {
      case 'healthy':
        return 'rgba(40, 167, 69, 0.8)';
      case 'degraded':
        return 'rgba(255, 193, 7, 0.8)';
      case 'down':
        return 'rgba(220, 53, 69, 0.8)';
      default:
        return 'rgba(108, 117, 125, 0.8)';
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimeData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: statusColors,
        pointBorderColor: statusColors,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${serviceName} - Response Time (Last ${hours}h)`,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: any) => {
            const index = context.dataIndex;
            const status = history.data_points[index].status;
            return `Status: ${status}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Response Time (ms)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  // Статистика
  const avgResponseTime =
    responseTimeData.reduce((a, b) => a + b, 0) / responseTimeData.length;
  const maxResponseTime = Math.max(...responseTimeData);
  const minResponseTime = Math.min(...responseTimeData.filter((t) => t > 0));

  return (
    <Card>
      <Card.Body>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={options} />
        </div>

        <div className="mt-3 pt-3 border-top">
          <div className="row text-center">
            <div className="col-4">
              <div className="small text-muted">Average</div>
              <div className="h5 mb-0">{avgResponseTime.toFixed(0)}ms</div>
            </div>
            <div className="col-4">
              <div className="small text-muted">Min</div>
              <div className="h5 mb-0">
                {isFinite(minResponseTime) ? minResponseTime.toFixed(0) : 0}ms
              </div>
            </div>
            <div className="col-4">
              <div className="small text-muted">Max</div>
              <div className="h5 mb-0">{maxResponseTime.toFixed(0)}ms</div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
