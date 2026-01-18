"use client";

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Service } from '../types/monitoring';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'up':
      case 'healthy':
        return 'success';
      case 'degraded':
      case 'warning':
        return 'warning';
      case 'down':
      case 'critical':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'up':
      case 'healthy':
        return '✅';
      case 'degraded':
      case 'warning':
        return '⚠️';
      case 'down':
      case 'critical':
        return '🔴';
      default:
        return '❓';
    }
  };

  return (
    <Card 
      className={`h-100 shadow-sm border-0 border-top border-4 border-${getStatusColor(service.status)}`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => onClick && (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseOut={(e) => onClick && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-brand fw-bold">{service.name}</h5>
          <Badge bg={getStatusColor(service.status)} className="px-2 py-1">
            {service.status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="text-muted small mb-3 d-flex align-items-center">
          <i className="bi bi-gear-fill me-2"></i>
          {service.type.toUpperCase()}
        </div>

        <div className="mb-3 p-3 bg-light rounded-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Response Time:</span>
            <span className="fw-bold text-dark">
              {service.response_time ? `${(service.response_time * 1000).toFixed(0)}ms` : 'N/A'}
            </span>
          </div>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
            <i className="bi bi-clock me-1"></i>
            {new Date(service.last_checked).toLocaleTimeString()}
          </div>
        </div>

        {service.error && (
          <div className="alert alert-danger py-2 px-3 small border-0 mb-0 rounded-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {service.error.substring(0, 80)}
            {service.error.length > 80 ? '...' : ''}
          </div>
        )}

        {service.additional_info && (
          <div className="mt-3 pt-3 border-top small">
            {service.additional_info.deployment_url && (
              <div className="mb-1 text-truncate">
                🔗 <a 
                  href={`https://${service.additional_info.deployment_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {service.additional_info.deployment_url}
                </a>
              </div>
            )}
            
            {service.additional_info.web_url && (
              <div className="mb-1">
                🔗 <a 
                  href={service.additional_info.web_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open Application
                </a>
              </div>
            )}

            {(service.additional_info.dynos_running !== undefined || service.additional_info.models_available !== undefined) && (
              <div className="d-flex gap-3 mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                {service.additional_info.dynos_running !== undefined && (
                  <span>
                    <i className="bi bi-cpu me-1"></i>
                    Dynos: {service.additional_info.dynos_running}/{service.additional_info.dynos_total}
                  </span>
                )}
                {service.additional_info.models_available !== undefined && (
                  <span>
                    <i className="bi bi-robot me-1"></i>
                    Models: {service.additional_info.models_available}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
