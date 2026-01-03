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

      {/* [STAGE 9.1] Executive Summary Professional Re-interpretation */}
      {report.executive_summary_details && (
        <>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #1e6078" }}>
              <h5 className="mb-0" style={{ color: "#1e6078" }}>📋 Исходный запрос</h5>
            </Card.Header>
            <Card.Body>
              <blockquote className="mb-3" style={{ borderLeft: "4px solid #1e6078", paddingLeft: "1rem", fontStyle: "italic", color: "#666" }}>
                "{report.executive_summary_details.original_request}"
              </blockquote>
              <div><strong>📍 Локация:</strong> {report.executive_summary_details.location}</div>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm border-0">
            <Card.Header style={{ backgroundColor: "#1e6078", color: "white" }}>
              <h5 className="mb-0">🎯 Маркетинговое резюме</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Рыночная вертикаль:</strong> {report.executive_summary_details.industry_vertical}
              </div>
              <div className="mb-3">
                <strong>Бизнес-модель:</strong> {report.executive_summary_details.business_model}
              </div>
              <div className="mb-3">
                <h6 style={{ color: "#1e6078" }}>Уникальное торговое предложение (USP):</h6>
                <p>{report.executive_summary_details.usp}</p>
              </div>
              <div className="mb-3">
                <h6 style={{ color: "#1e6078" }}>Ключевая гипотеза роста:</h6>
                <p>{report.executive_summary_details.growth_hypothesis}</p>
              </div>
              <Alert variant="info" className="mb-0" style={{ borderLeft: "4px solid #0033CC" }}>
                <p className="mb-0">{report.executive_summary_details.marketing_summary}</p>
              </Alert>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Executive Summary - Redesigned with colored background */}
      <Card className="mb-4 shadow-lg border-0" style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        borderLeft: "6px solid #1e6078"
      }}>
        <Card.Header style={{
          backgroundColor: "transparent",
          borderBottom: "2px solid #1e6078",
          padding: "1.5rem"
        }}>
          <div className="d-flex align-items-center">
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #1e6078 0%, #2d7a9a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1rem",
              boxShadow: "0 4px 12px rgba(30, 96, 120, 0.3)"
            }}>
              <span style={{ fontSize: "1.5rem" }}>📊</span>
            </div>
            <div>
              <h3 className="mb-0" style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: "700",
                color: "#1e6078"
              }}>Executive Summary</h3>
              <small style={{ color: "#6c757d", fontFamily: "var(--font-inter), sans-serif" }}>
                Ключевые выводы исследования
              </small>
            </div>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: "2rem" }}>
          <div style={{
            whiteSpace: "pre-wrap",
            fontFamily: "var(--font-inter), sans-serif",
            lineHeight: "1.8",
            fontSize: "1.05rem",
            color: "#2c3e50"
          }}>
            {report.executive_summary}
          </div>
        </Card.Body>
      </Card>

      {/* Persona Insights - Redesigned with Persona Cards */}
      <div className="mb-4">
        <h2 style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontWeight: "700",
          color: "#1e6078",
          marginBottom: "2rem"
        }}>
          👥 Целевые персоны
        </h2>

        {/* Persona Cards Grid */}
        {report.segment_analytics && report.segment_analytics.length > 0 ? (
          <Row className="g-4">
            {report.segment_analytics.slice(0, 6).map((segment, idx) => {
              // Generate archetype name from persona name
              const getArchetype = (name: string) => {
                const parts = name.split(',');
                return parts.length > 1 ? parts[1].trim() : name;
              };

              // Get initials for avatar
              const getInitials = (name: string) => {
                const words = name.split(' ').slice(0, 2);
                return words.map(w => w[0]).join('').toUpperCase();
              };

              // Generate sample quote
              const generateQuote = (profile: any) => {
                return profile.core_pain || profile.trigger || "Ищу решение своей проблемы";
              };

              return (
                <Col md={6} key={idx}>
                  <div className="persona-card">
                    <div className="persona-avatar">
                      {getInitials(segment.persona_name)}
                    </div>
                    <div className="persona-name">{segment.persona_name.split(',')[0]}</div>
                    <div className="persona-archetype">{getArchetype(segment.persona_name)}</div>

                    <div className="persona-quote">
                      "{generateQuote(segment.profile)}"
                    </div>

                    <div className="persona-details">
                      <div className="persona-detail-item">
                        <div className="persona-detail-label">Интерес</div>
                        <div className="persona-detail-value">
                          {"⭐".repeat(Math.round(segment.stats.key_metrics?.interest || 3))}
                        </div>
                      </div>
                      <div className="persona-detail-item">
                        <div className="persona-detail-label">Бюджет</div>
                        <div className="persona-detail-value">
                          {"💰".repeat(Math.round(segment.stats.key_metrics?.willingness_to_pay || 3))}
                        </div>
                      </div>
                      <div className="persona-detail-item">
                        <div className="persona-detail-label">Срочность</div>
                        <div className="persona-detail-value">
                          {"🔥".repeat(Math.round(segment.stats.key_metrics?.urgency || 3))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <div style={{
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "0.85rem",
                        color: "#0785f6",
                        fontWeight: "600",
                        marginBottom: "0.5rem"
                      }}>
                        💡 Стратегия продаж
                      </div>
                      <div style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.9rem",
                        color: "#495057",
                        lineHeight: "1.6"
                      }}>
                        {segment.profile.strategy}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          // Fallback to old design if segment_analytics not available
          <Card className="shadow-sm">
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
                    <div className="d-flex flex-wrap gap-2">
                      {report.persona_insights.common_pains.map((pain, i) => (
                        <Badge key={i} bg="warning" text="dark" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                          {pain}
                        </Badge>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Общие возражения</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex flex-wrap gap-2">
                      {report.persona_insights.common_objections.map((objection, i) => (
                        <Badge key={i} bg="danger" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                          {objection}
                        </Badge>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Ключевые критерии принятия решения</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex flex-wrap gap-2">
                      {report.persona_insights.key_decision_criteria.map((criterion, i) => (
                        <Badge key={i} bg="success" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                          {criterion}
                        </Badge>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        )}
      </div>

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

      {/* [STAGE 9.2] Devil's Advocate - Market Saturation Analysis */}
      {report.market_saturation && (
        <Card className="mb-4 shadow-sm border-danger">
          <Card.Header style={{ backgroundColor: "#dc3545", color: "white" }}>
            <h5 className="mb-0">⚠️ Критический взгляд на жизнеспособность (Devil's Advocate)</h5>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <div className="p-3 border rounded text-center">
                  <div className="small text-muted">Уровень насыщенности рынка</div>
                  <h3 className="mb-0">
                    {report.market_saturation.saturation_level === 'critical' && '🔴 КРИТИЧЕСКИЙ'}
                    {report.market_saturation.saturation_level === 'high' && '🟠 ВЫСОКИЙ'}
                    {report.market_saturation.saturation_level === 'medium' && '🟡 СРЕДНИЙ'}
                    {report.market_saturation.saturation_level === 'low' && '🟢 НИЗКИЙ'}
                  </h3>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 border rounded text-center">
                  <div className="small text-muted">Вероятность выживания</div>
                  <h3 className={`mb-0 ${
                    report.market_saturation.survival_probability < 30 ? 'text-danger' :
                    report.market_saturation.survival_probability < 50 ? 'text-warning' :
                    report.market_saturation.survival_probability < 70 ? 'text-info' : 'text-success'
                  }`}>
                    {report.market_saturation.survival_probability}%
                  </h3>
                </div>
              </Col>
            </Row>

            <div className="mb-3">
              <h6 style={{ color: "#dc3545" }}>🌊 Анализ «Красного океана»:</h6>
              <p style={{ whiteSpace: "pre-wrap" }}>{report.market_saturation.red_ocean_analysis}</p>
            </div>

            {report.market_saturation.bottleneck_opportunity && (
              <div className="mb-3">
                <h6 style={{ color: "#0785f6" }}>💡 Узкое место (Gap в рынке):</h6>
                <Alert variant="info">
                  {report.market_saturation.bottleneck_opportunity}
                </Alert>
              </div>
            )}

            {report.market_saturation.pivot_recommendation && (
              <div className="mb-3">
                <h6 style={{ color: "#28a745" }}>🔄 Рекомендация пивота:</h6>
                <Alert variant="warning" style={{ borderLeft: "4px solid #ffc107" }}>
                  {report.market_saturation.pivot_recommendation}
                </Alert>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

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


      {/* [STAGE 9.3] Advanced Visualizations */}
      {report.advanced_visualizations && (
        <>
          {/* Triggers & Barriers Heatmap */}
          {report.advanced_visualizations.triggers_barriers_heatmap && (
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header style={{ backgroundColor: "#6c757d", color: "white" }}>
                <h5 className="mb-0">🔥 Матрица триггеров и барьеров</h5>
              </Card.Header>
              <Card.Body>
                <pre style={{ whiteSpace: "pre", fontFamily: "monospace", fontSize: "0.85rem", overflow: "auto" }}>
                  {report.advanced_visualizations.triggers_barriers_heatmap}
                </pre>
              </Card.Body>
            </Card>
          )}

          {/* Innovation Adoption Curve */}
          {report.advanced_visualizations.innovation_adoption_curve && (
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header style={{ backgroundColor: "#17a2b8", color: "white" }}>
                <h5 className="mb-0">📊 Кривая принятия инноваций</h5>
              </Card.Header>
              <Card.Body>
                <pre style={{ whiteSpace: "pre", fontFamily: "monospace", fontSize: "0.85rem", overflow: "auto" }}>
                  {report.advanced_visualizations.innovation_adoption_curve.curve_text}
                </pre>

                {report.advanced_visualizations.innovation_adoption_curve.insights && (
                  <div className="mt-3">
                    <h6>📝 Инсайты:</h6>
                    <ul>
                      {report.advanced_visualizations.innovation_adoption_curve.insights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Gold Nuggets */}
          {report.advanced_visualizations.gold_nuggets && report.advanced_visualizations.gold_nuggets.length > 0 && (
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header style={{ backgroundColor: "#ffc107", color: "#000" }}>
                <h5 className="mb-0">💎 Gold Nuggets (Уникальные инсайты)</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {report.advanced_visualizations.gold_nuggets.map((nugget, i) => (
                    <Col md={12} key={i} className="mb-3">
                      <div className="p-3 border rounded" style={{ borderLeft: "4px solid #ffc107" }}>
                        <h6 className="text-warning">💡 Инсайт #{i + 1}</h6>
                        <p className="mb-2"><strong>{nugget.insight}</strong></p>
                        <div className="mb-2">
                          <small className="text-muted">Почему это важно:</small>
                          <p className="mb-0">{nugget.why_unique}</p>
                        </div>
                        <div>
                          <small className="text-muted">Что делать:</small>
                          <Alert variant="success" className="mb-0 mt-1">
                            {nugget.action}
                          </Alert>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* [STAGE 10.1] Targeted Insights Pipeline */}
      {report.targeted_insights && report.targeted_insights.insights_by_goal && Object.keys(report.targeted_insights.insights_by_goal).length > 0 && (
        <>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header style={{ background: "linear-gradient(135deg, #0785f6 0%, #1e6078 100%)", color: "white" }}>
              <h5 className="mb-0">🎯 Целевые инсайты по выбранным целям исследования</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-3" style={{ color: "#6c757d" }}>
                Специализированный анализ на основе ваших исследовательских целей с проверкой качества данных
              </p>

              {/* Validation Summary */}
              {report.targeted_insights.validation_report && (
                <Alert variant={report.targeted_insights.validation_report.failed.length === 0 ? "success" : "warning"} className="mb-4">
                  <strong>Результаты валидации:</strong> {report.targeted_insights.validation_report.passed.length} из {Object.keys(report.targeted_insights.insights_by_goal).length} инсайтов прошли проверку качества
                  {report.targeted_insights.validation_report.failed.length > 0 && (
                    <div className="mt-2">
                      <small>Не прошли проверку: {report.targeted_insights.validation_report.failed.map(f => f.goal).join(", ")}</small>
                    </div>
                  )}
                </Alert>
              )}

              <Accordion>
                {Object.entries(report.targeted_insights.insights_by_goal).map(([goalKey, insight], idx) => {
                  const goalLabels: { [key: string]: string } = {
                    target_audience: "🎯 Целевая аудитория",
                    pain_points: "💢 Проблемы и боли",
                    price_point: "💰 Ценообразование",
                    decision_criteria: "⚖️ Критерии выбора",
                    competitive_position: "🏆 Конкурентная позиция",
                    market_fit: "📊 Product-Market Fit"
                  };

                  const isPassed = report.targeted_insights.validation_report?.passed.includes(goalKey);
                  const failedInfo = report.targeted_insights.validation_report?.failed.find(f => f.goal === goalKey);

                  return (
                    <Accordion.Item eventKey={String(idx)} key={goalKey}>
                      <Accordion.Header>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <span>{goalLabels[goalKey] || goalKey}</span>
                          {isPassed ? (
                            <Badge bg="success" className="ms-2">✓ Validated</Badge>
                          ) : (
                            <Badge bg="warning" className="ms-2">⚠ Check Quality</Badge>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {/* Search Query */}
                        <div className="mb-3">
                          <small className="text-muted">Поисковый запрос:</small>
                          <code className="d-block p-2 bg-light rounded mt-1" style={{ fontSize: "0.85rem" }}>
                            {insight.search_query}
                          </code>
                        </div>

                        {/* Analysis */}
                        <div className="mb-3">
                          <h6 style={{ color: "#1e6078" }}>📝 Анализ:</h6>
                          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
                            {insight.analysis}
                          </div>
                        </div>

                        {/* Extracted Entities */}
                        {insight.extracted_entities && (
                          <Row className="mb-3">
                            {insight.extracted_entities.company_names && insight.extracted_entities.company_names.length > 0 && (
                              <Col md={4}>
                                <div className="p-2 bg-light rounded">
                                  <small className="text-muted d-block mb-1"><strong>🏢 Компании:</strong></small>
                                  {insight.extracted_entities.company_names.map((name, i) => (
                                    <Badge key={i} bg="primary" className="me-1 mb-1">{name}</Badge>
                                  ))}
                                </div>
                              </Col>
                            )}
                            {insight.extracted_entities.locations && insight.extracted_entities.locations.length > 0 && (
                              <Col md={4}>
                                <div className="p-2 bg-light rounded">
                                  <small className="text-muted d-block mb-1"><strong>📍 Локации:</strong></small>
                                  {insight.extracted_entities.locations.map((loc, i) => (
                                    <Badge key={i} bg="info" className="me-1 mb-1">{loc}</Badge>
                                  ))}
                                </div>
                              </Col>
                            )}
                            {insight.extracted_entities.prices && insight.extracted_entities.prices.length > 0 && (
                              <Col md={4}>
                                <div className="p-2 bg-light rounded">
                                  <small className="text-muted d-block mb-1"><strong>💵 Цены:</strong></small>
                                  {insight.extracted_entities.prices.map((price, i) => (
                                    <Badge key={i} bg="success" className="me-1 mb-1">{price}</Badge>
                                  ))}
                                </div>
                              </Col>
                            )}
                          </Row>
                        )}

                        {/* Validation Errors */}
                        {failedInfo && failedInfo.errors.length > 0 && (
                          <Alert variant="warning" className="mb-2">
                            <small>
                              <strong>⚠ Проблемы валидации:</strong>
                              <ul className="mb-0 mt-1">
                                {failedInfo.errors.map((err, i) => (
                                  <li key={i}>{err}</li>
                                ))}
                              </ul>
                            </small>
                          </Alert>
                        )}

                        {/* Sources */}
                        {insight.search_results && insight.search_results.length > 0 && (
                          <div>
                            <small className="text-muted"><strong>📚 Источники:</strong></small>
                            <ul className="mt-2" style={{ fontSize: "0.85rem" }}>
                              {insight.search_results.slice(0, 3).map((source, i) => (
                                <li key={i}>
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0785f6" }}>
                                    {source.title}
                                  </a>
                                  <br />
                                  <small className="text-muted">{source.snippet}</small>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </Card.Body>
          </Card>
        </>
      )}

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
