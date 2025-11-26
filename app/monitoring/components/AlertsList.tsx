import React from 'react';
import { Alert, Button, Badge } from 'react-bootstrap';
import { SystemAlert, AlertSeverity } from '../types/monitoring';

interface AlertsListProps {
  alerts: SystemAlert[];
  onResolve?: (alertId: number) => void;
  showResolveButton?: boolean;
}

export const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  onResolve,
  showResolveButton = true,
}) => {
  const getAlertVariant = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getAlertIcon = (severity: AlertSeverity): string => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleString();
  };

  if (alerts.length === 0) {
    return (
      <Alert variant="success">
        <div className="text-center py-3">
          <h5>✅ No Active Alerts</h5>
          <p className="mb-0">All systems are operating normally.</p>
        </div>
      </Alert>
    );
  }

  return (
    <div className="alerts-list">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={getAlertVariant(alert.severity)}
          className="mb-2 alert-item"
        >
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <span className="me-2">{getAlertIcon(alert.severity)}</span>
                <strong className="me-2">{alert.service}</strong>
                <Badge bg={getAlertVariant(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
              
              <p className="mb-2">{alert.message}</p>
              
              <div className="small text-muted">
                <span>{formatTimestamp(alert.created_at)}</span>
                {alert.resolved && alert.resolved_at && (
                  <>
                    {' • '}
                    <span>
                      Resolved {formatTimestamp(alert.resolved_at)}
                      {alert.resolved_by && ` by ${alert.resolved_by}`}
                    </span>
                  </>
                )}
              </div>
            </div>

            {showResolveButton && !alert.resolved && onResolve && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onResolve(alert.id)}
                className="ms-2"
              >
                Resolve
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
};
