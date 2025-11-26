import React from 'react';
import { Card, Badge, Alert } from 'react-bootstrap';
import { Service, ServiceStatus } from '../types/monitoring';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const getStatusColor = (status: ServiceStatus): string => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'down':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: ServiceStatus): string => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'degraded':
        return '⚠️';
      case 'down':
        return '🔴';
      default:
        return '❓';
    }
  };

  const formatResponseTime = (time?: number): string => {
    if (!time) return 'N/A';
    return time < 1 ? `${(time * 1000).toFixed(0)}ms` : `${time.toFixed(2)}s`;
  };

  const formatLastChecked = (timestamp: string): string => {
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

  return (
    <Card 
      className={`border-${getStatusColor(service.status)} h-100 service-card`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <h6 className="mb-0">
              {getStatusIcon(service.status)} {service.name}
            </h6>
          </div>
          <Badge bg={getStatusColor(service.status)} className="ms-2">
            {service.status}
          </Badge>
        </div>

        <div className="text-muted small mb-2">
          <span className="badge bg-secondary">{service.type}</span>
        </div>

        {service.response_time !== undefined && (
          <div className="mb-1">
            <small>
              <strong>Response:</strong> {formatResponseTime(service.response_time)}
            </small>
          </div>
        )}

        {service.error && (
          <Alert variant="danger" className="mt-2 p-2 small mb-2">
            {service.error}
          </Alert>
        )}

        {service.metadata && (
          <div className="mt-2 small">
            {service.metadata.deployment_url && (
              <div className="mb-1">
                🔗{' '}
                <a
                  href={`https://${service.metadata.deployment_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {service.metadata.deployment_url.substring(0, 30)}...
                </a>
              </div>
            )}
            {service.metadata.web_url && (
              <div className="mb-1">
                🔗{' '}
                <a
                  href={service.metadata.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open App
                </a>
              </div>
            )}
            {service.metadata.dynos_running !== undefined && (
              <div>
                <strong>Dynos:</strong> {service.metadata.dynos_running}/
                {service.metadata.dynos_total}
              </div>
            )}
            {service.metadata.models_available !== undefined && (
              <div>
                <strong>Models:</strong> {service.metadata.models_available}
              </div>
            )}
          </div>
        )}

        <div className="text-muted small mt-2 border-top pt-2">
          Last checked: {formatLastChecked(service.last_checked)}
        </div>
      </Card.Body>
    </Card>
  );
};
