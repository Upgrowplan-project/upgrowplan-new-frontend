// Типы для системы мониторинга

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
export type ServiceType = 'vercel' | 'heroku' | 'api_key' | 'database';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Service {
  name: string;
  type: ServiceType;
  status: ServiceStatus;
  response_time?: number;
  last_checked: string;
  error?: string;
  metadata?: {
    deployment_url?: string;
    state?: string;
    dynos_running?: number;
    dynos_total?: number;
    web_url?: string;
    models_available?: number;
    [key: string]: any;
  };
}

export interface SystemAlert {
  id: number;
  severity: AlertSeverity;
  service: string;
  message: string;
  created_at: string;
  resolved?: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

export interface UserActivity {
  total_users_24h: number;
  total_requests_24h: number;
  avg_response_time: number;
}

export interface MonitoringData {
  timestamp: string;
  services: Service[];
  alerts: SystemAlert[];
  activity: UserActivity;
  overall_health: ServiceStatus;
}

export interface ServiceHistoryDataPoint {
  timestamp: string;
  status: ServiceStatus;
  response_time?: number;
  error?: string;
}

export interface ServiceHistory {
  service_name: string;
  period_hours: number;
  data_points: ServiceHistoryDataPoint[];
}

export interface MonitoringStats {
  total_health_checks: number;
  total_alerts: number;
  active_alerts: number;
  monitored_services: number;
  uptime_percentage: number;
}
