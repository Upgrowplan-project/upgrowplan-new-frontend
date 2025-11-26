import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Button, Spinner, Modal } from 'react-bootstrap';
import { useMonitoring, useMonitoringStats } from '../hooks/useMonitoring';
import { ServiceCard } from '../components/ServiceCard';
import { AlertsList } from '../components/AlertsList';
import { ServiceHistoryChart } from '../components/ServiceHistoryChart';
import { Service } from '../types/monitoring';

export const MonitoringDashboard: React.FC = () => {
  const { 
    data, 
    loading, 
    error, 
    wsConnected, 
    refresh,
    triggerHealthCheck,
    resolveAlert 
  } = useMonitoring();
  
  const { stats } = useMonitoringStats();

  const [checkingNow, setCheckingNow] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'critical':
      case 'down':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'degraded':
        return '⚠️';
      case 'critical':
      case 'down':
        return '🔴';
      default:
        return '❓';
    }
  };

  const handleCheckNow = async () => {
    setCheckingNow(true);
    try {
      await triggerHealthCheck();
      // Данные обновятся автоматически через WebSocket
    } catch (err) {
      console.error('Error triggering health check:', err);
    } finally {
      setCheckingNow(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      await resolveAlert(alertId);
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowHistoryModal(true);
  };

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading monitoring data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Monitoring Data</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={refresh}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container fluid className="p-4">
        <Alert variant="info">No monitoring data available</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Upgrowplan System Monitor</h1>
          <p className="text-muted mb-0">
            Real-time monitoring of all services
            {wsConnected && (
              <Badge bg="success" className="ms-2">
                ● Live
              </Badge>
            )}
            {!wsConnected && (
              <Badge bg="warning" className="ms-2">
                ○ Connecting...
              </Badge>
            )}
          </p>
        </div>
        
        <div>
          <Button
            variant="primary"
            onClick={handleCheckNow}
            disabled={checkingNow}
            className="me-2"
          >
            {checkingNow ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Checking...
              </>
            ) : (
              <>🔄 Check Now</>
            )}
          </Button>
          
          <Button variant="outline-secondary" onClick={refresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className={`border-${getStatusColor(data.overall_health)} shadow-sm`}>
            <Card.Body>
              <div className="text-center py-3">
                <h2 className="mb-0">
                  {getStatusIcon(data.overall_health)} Overall System Status:{' '}
                  <Badge 
                    bg={getStatusColor(data.overall_health)}
                    style={{ fontSize: '1.2rem' }}
                  >
                    {data.overall_health.toUpperCase()}
                  </Badge>
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Monitored Services</h6>
                <div className="display-6">{stats.monitored_services}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Active Alerts</h6>
                <div className="display-6 text-danger">{stats.active_alerts}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Total Checks</h6>
                <div className="display-6">{stats.total_health_checks.toLocaleString()}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="text-muted">System Uptime</h6>
                <div className="display-6 text-success">{stats.uptime_percentage}%</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Active Alerts */}
      {data.alerts.length > 0 && (
        <Row className="mb-4">
          <Col md={12}>
            <h4 className="mb-3">🚨 Active Alerts</h4>
            <AlertsList
              alerts={data.alerts}
              onResolve={handleResolveAlert}
              showResolveButton={true}
            />
          </Col>
        </Row>
      )}

      {/* Services Status */}
      <Row className="mb-4">
        <Col md={12}>
          <h4 className="mb-3">Services Status</h4>
        </Col>
        {data.services.map((service, idx) => (
          <Col md={4} lg={3} key={idx} className="mb-3">
            <ServiceCard
              service={service}
              onClick={() => handleServiceClick(service)}
            />
          </Col>
        ))}
      </Row>

      {/* User Activity */}
      <Row>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Active Users (24h)</h5>
              <div className="display-4">{data.activity.total_users_24h}</div>
              <small className="text-muted">Total active users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Total Requests (24h)</h5>
              <div className="display-4">{data.activity.total_requests_24h}</div>
              <small className="text-muted">API requests</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Avg Response Time</h5>
              <div className="display-4">
                {data.activity.avg_response_time.toFixed(2)}ms
              </div>
              <small className="text-muted">Average across all services</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Service History Modal */}
      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedService?.name} - Performance History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <ServiceHistoryChart serviceName={selectedService.name} hours={24} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
