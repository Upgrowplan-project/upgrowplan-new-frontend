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
      // [FIX] Use GET request to instant download endpoint for pre-generated DOCX
      const endpoint = format === "docx"
        ? `http://localhost:8004/api/research/${researchId}/export/docx`
        : `http://localhost:8004/api/research/${researchId}/export?output_format=${format}`;

      const response = await fetch(endpoint, {
        method: "GET",  // [FIX] Changed from POST to GET
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Export failed";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // [FIX] Handle file download instead of JSON response
      const blob = await response.blob();

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `research_${researchId}_report.${format}`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportSuccess(`Документ успешно скачан!`);
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


    {/* New: Global Themes Analysis */}
    {report.global_themes && report.global_themes.length > 0 && (
        <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-gradient text-white" style={{ background: "linear-gradient(45deg, #FF6B6B, #EE5253)" }}>
                <h5 className="mb-0">🔥 Глобальные темы и боли</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    {report.global_themes.slice(0, 4).map((theme, i) => (
                        <Col md={6} key={i} className="mb-3">
                            <div className="p-3 border rounded bg-light h-100">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 text-capitalize text-danger fw-bold">{theme.theme.replace(/_/g, " ")}</h6>
                                    <Badge bg="secondary">{theme.count} упоминаний</Badge>
                                </div>
                                {theme.representative_quotes && theme.representative_quotes[0] && (
                                    <em className="text-muted small">"{theme.representative_quotes[0]}"</em>
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    )}

    {/* New: Deep Segment Analysis */}
    {report.segment_analytics && report.segment_analytics.length > 0 && (
        <>
            <h4 className="mb-3" style={{ color: "#1e6078" }}>Детальный анализ сегментов</h4>
            <Accordion className="mb-4">
                {report.segment_analytics.map((segment, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                        <Accordion.Header>
                            <span className="fw-bold">{segment.persona_name}</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <p className="lead fs-6">{segment.profile.description}</p>
                            
                            <Row className="mb-3 g-3">
                                <Col md={4}>
                                    <div className="p-2 border rounded text-center bg-light-subtle">
                                        <div className="small text-muted">Интерес</div>
                                        <div className="h4 mb-0 text-primary">
                                            {"⭐".repeat(Math.round(segment.stats.key_metrics?.interest || 0))}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="p-2 border rounded text-center bg-light-subtle">
                                        <div className="small text-muted">Бюджет</div>
                                        <div className="h4 mb-0 text-success">
                                            {"💰".repeat(Math.round(segment.stats.key_metrics?.willingness_to_pay || 0))}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="p-2 border rounded text-center bg-light-subtle">
                                        <div className="small text-muted">Срочность</div>
                                        <div className="h4 mb-0 text-danger">
                                            {"🔥".repeat(Math.round(segment.stats.key_metrics?.urgency || 0))}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Alert variant="info" className="mb-3">
                                <strong>💡 Стратегия продаж:</strong> {segment.profile.strategy}
                            </Alert>

                            <Row>
                                <Col md={6}>
                                    <h6 className="text-danger">Главная боль</h6>
                                    <p>{segment.profile.core_pain}</p>
                                    
                                    <h6 className="text-muted">Барьеры</h6>
                                    <ul>
                                        {segment.profile.barriers?.map((b: string, i: number) => <li key={i}>{b}</li>)}
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-success">Триггер покупки</h6>
                                    <p>{segment.profile.trigger}</p>
                                    
                                    <h6 className="text-muted">Мотиваторы</h6>
                                    <ul>
                                        {segment.profile.motivations?.map((m: string, i: number) => <li key={i}>{m}</li>)}
                                    </ul>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    )}

  </div>
  );
}
