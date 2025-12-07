import { useState } from "react";
import { Card, Row, Col, Badge, Accordion, ListGroup, Button, Spinner, Alert } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";
import { Report } from "../types";

interface ReportViewerProps {
  report: Report;
  researchId: number;
}

export default function ReportViewer({ report, researchId }: ReportViewerProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:8004/api/research/${researchId}/export?output_format=${format}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Export failed");
      }

      const result = await response.json();
      setExportSuccess(`Документ успешно сгенерирован! URL: ${result.document_url}`);
    } catch (error: any) {
      setExportError(error.message || "Ошибка экспорта");
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!report) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: "#1e6078" }}>
          Отчет исследования
        </h4>
        <div>
          <Button
            variant="success"
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="me-2"
          >
            {isExporting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Экспорт...
              </>
            ) : (
              <>
                <FiDownload className="me-2" />
                Экспорт в PDF
              </>
            )}
          </Button>
          <Button
            variant="outline-success"
            onClick={() => handleExport("docx")}
            disabled={isExporting}
          >
            <FiDownload className="me-2" />
            Экспорт в DOCX
          </Button>
        </div>
      </div>

      {exportError && (
        <Alert variant="danger" dismissible onClose={() => setExportError(null)}>
          {exportError}
        </Alert>
      )}

      {exportSuccess && (
        <Alert variant="success" dismissible onClose={() => setExportSuccess(null)}>
          {exportSuccess}
        </Alert>
      )}

      {/* Executive Summary */}
      <Card className="mb-4 shadow-sm">
        <Card.Header style={{ backgroundColor: "#1e6078", color: "white" }}>
          <h5 className="mb-0">Executive Summary</h5>
        </Card.Header>
        <Card.Body>
          <p style={{ whiteSpace: "pre-wrap" }}>{report.executive_summary}</p>
        </Card.Body>
      </Card>

      {/* Persona Insights */}
      <Card className="mb-4 shadow-sm">
        <Card.Header style={{ backgroundColor: "#1e6078", color: "white" }}>
          <h5 className="mb-0">Инсайты по персонам</h5>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Всего персон:</strong> {report.persona_insights.total_personas}
            </Col>
            <Col md={6}>
              <strong>Сегменты:</strong>{" "}
              {Object.keys(report.persona_insights.segments).join(", ")}
            </Col>
          </Row>

          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Общие боли</Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                  {report.persona_insights.common_pains.map((pain, i) => (
                    <li key={i}>{pain}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Общие возражения</Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                  {report.persona_insights.common_objections.map((objection, i) => (
                    <li key={i}>{objection}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Ключевые критерии принятия решения</Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                  {report.persona_insights.key_decision_criteria.map((criterion, i) => (
                    <li key={i}>{criterion}</li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>

      {/* Analysis by Category */}
      <Row>
        <Col md={4}>
          <Card className="mb-4 shadow-sm h-100">
            <Card.Header style={{ backgroundColor: "#28a745", color: "white" }}>
              <h6 className="mb-0">Ценовая чувствительность</h6>
            </Card.Header>
            <Card.Body>
              {report.price_analysis.insights?.map((insight: any, i: number) => (
                <div key={i} className="mb-3">
                  <small className="text-muted">{insight.question}</small>
                  {insight.average_score && (
                    <div>
                      <strong>Средний балл:</strong> {insight.average_score} / 10
                      <br />
                      <small className="text-muted">{insight.interpretation}</small>
                    </div>
                  )}
                  {insight.top_choice && (
                    <div>
                      <strong>Топ выбор:</strong> {insight.top_choice} ({insight.percentage}%)
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm h-100">
            <Card.Header style={{ backgroundColor: "#007bff", color: "white" }}>
              <h6 className="mb-0">Мотивация и боли</h6>
            </Card.Header>
            <Card.Body>
              {report.motivation_analysis.insights?.map((insight: any, i: number) => (
                <div key={i} className="mb-3">
                  <small className="text-muted">{insight.question}</small>
                  {insight.average_score && (
                    <div>
                      <strong>Средний балл:</strong> {insight.average_score} / 10
                      <br />
                      <small className="text-muted">{insight.interpretation}</small>
                    </div>
                  )}
                  {insight.top_choice && (
                    <div>
                      <strong>Топ выбор:</strong> {insight.top_choice} ({insight.percentage}%)
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm h-100">
            <Card.Header style={{ backgroundColor: "#ffc107", color: "white" }}>
              <h6 className="mb-0">Готовность к действию</h6>
            </Card.Header>
            <Card.Body>
              {report.readiness_analysis.insights?.map((insight: any, i: number) => (
                <div key={i} className="mb-3">
                  <small className="text-muted">{insight.question}</small>
                  {insight.average_score && (
                    <div>
                      <strong>Средний балл:</strong> {insight.average_score} / 10
                      <br />
                      <small className="text-muted">{insight.interpretation}</small>
                    </div>
                  )}
                  {insight.top_choice && (
                    <div>
                      <strong>Топ выбор:</strong> {insight.top_choice} ({insight.percentage}%)
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recommendations */}
      <Card className="shadow-sm">
        <Card.Header style={{ backgroundColor: "#1e6078", color: "white" }}>
          <h5 className="mb-0">Рекомендации</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {report.recommendations.map((recommendation, i) => (
              <ListGroup.Item key={i}>
                <Badge bg="primary" className="me-2">
                  {i + 1}
                </Badge>
                {recommendation}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
