"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import { FiUsers, FiBarChart2, FiFileText, FiPlay } from "react-icons/fi";
import Header from "../../../../components/Header";
import { synthAPI } from "./api/client";
import {
  ResearchStatusResponse,
  ResearchStatus,
  ResearchDetail,
} from "./types";
import PersonaDisplay from "./components/PersonaDisplay";
import ReportViewer from "./components/ReportViewer";
import ReportDisplay from "./components/ReportDisplay";
import EventLogger, { LogEntry, LogLevel } from "./components/EventLogger";
import HealthCheck from "./components/HealthCheck";

export default function SynthFocusLabPage() {
  const [productDescription, setProductDescription] = useState("");
  const [location, setLocation] = useState("");
  const [respondentsCount, setRespondentsCount] = useState(50);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResearch, setCurrentResearch] =
    useState<ResearchStatusResponse | null>(null);
  const [researchDetail, setResearchDetail] = useState<ResearchDetail | null>(
    null
  );
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [servicesReady, setServicesReady] = useState(false);

  const getStatusText = (status: ResearchStatus): string => {
    const statusMap: Record<ResearchStatus, string> = {
      [ResearchStatus.PENDING]: "Ожидание...",
      [ResearchStatus.GENERATING_PERSONAS]: "Генерация Buyer Persona...",
      [ResearchStatus.CREATING_RESPONDENTS]:
        "Создание виртуальных респондентов...",
      [ResearchStatus.GENERATING_QUESTIONS]: "Генерация вопросов опроса...",
      [ResearchStatus.CONDUCTING_SURVEY]: "Проведение виртуального опроса...",
      [ResearchStatus.GENERATING_REPORT]: "Формирование отчета...",
      [ResearchStatus.COMPLETED]: "Завершено",
      [ResearchStatus.FAILED]: "Ошибка",
    };
    return statusMap[status] || status;
  };

  const getProgressPercent = (status: ResearchStatus): number => {
    const progressMap: Record<ResearchStatus, number> = {
      [ResearchStatus.PENDING]: 0,
      [ResearchStatus.GENERATING_PERSONAS]: 15,
      [ResearchStatus.CREATING_RESPONDENTS]: 30,
      [ResearchStatus.GENERATING_QUESTIONS]: 45,
      [ResearchStatus.CONDUCTING_SURVEY]: 60,
      [ResearchStatus.GENERATING_REPORT]: 85,
      [ResearchStatus.COMPLETED]: 100,
      [ResearchStatus.FAILED]: 0,
    };
    return progressMap[status] || 0;
  };

  const addLog = (message: string, level: LogLevel = "info") => {
    setLogs((prev) => [...prev, { timestamp: new Date(), level, message }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleGenerateReport = async () => {
    if (!currentResearch) {
      setError("Нет активного исследования");
      return;
    }

    setIsGeneratingReport(true);
    setError(null);
    addLog("▶ Начало генерации отчёта...", "info");
    addLog(`📊 Research ID: ${currentResearch.id}`, "info");

    try {
      addLog("🔄 Отправка запроса на сервер...", "info");
      const report = await synthAPI.generateReport(currentResearch.id);

      addLog("✓ Ответ получен от сервера", "success");
      addLog(
        `📝 Резюме: ${report.executive_summary?.substring(0, 50)}...`,
        "info"
      );
      addLog(
        `💡 Рекомендации: ${report.recommendations?.length || 0} шт.`,
        "info"
      );

      setGeneratedReport(report);
      addLog(
        "✅ Отчет успешно сгенерирован и загружен на страницу!",
        "success"
      );
    } catch (err: any) {
      const errorMsg = err.message || "Ошибка при генерации отчета";
      addLog("❌ Ошибка: " + errorMsg, "error");
      setError(errorMsg);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleStartResearch = async () => {
    if (!productDescription.trim() || !location.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setCurrentResearch(null);
    setResearchDetail(null);
    addLog("Research started", "info");
    addLog("Product: " + productDescription.substring(0, 50) + "...", "info");
    addLog("Location: " + location, "info");
    addLog("Respondents per persona: " + respondentsCount, "info");

    try {
      // Create research
      addLog("Creating research request...", "info");
      const research = await synthAPI.createResearch({
        product_description: productDescription,
        location: location,
        respondents_per_persona: respondentsCount,
      });

      addLog("Research created (ID: " + research.id + ")", "success");
      setCurrentResearch(research);

      let lastStatus: ResearchStatus | null = null;

      // Poll for completion
      const finalStatus = await synthAPI.pollResearchStatus(
        research.id,
        (status) => {
          setCurrentResearch(status);

          // Log status changes
          if (status.status !== lastStatus) {
            const statusText = getStatusText(status.status);
            addLog("Status: " + statusText, "info");

            if (status.status === ResearchStatus.GENERATING_PERSONAS) {
              addLog("Generating 5 Buyer Personas...", "info");
            } else if (status.status === ResearchStatus.CREATING_RESPONDENTS) {
              addLog(
                "Creating " + respondentsCount * 5 + " virtual respondents...",
                "info"
              );
            } else if (status.status === ResearchStatus.GENERATING_QUESTIONS) {
              addLog("Generating survey questions...", "info");
            } else if (status.status === ResearchStatus.CONDUCTING_SURVEY) {
              addLog("Conducting virtual survey...", "info");
            } else if (status.status === ResearchStatus.GENERATING_REPORT) {
              addLog("Generating marketing report...", "info");
            }

            lastStatus = status.status;
          }
        }
      );

      if (finalStatus.status === ResearchStatus.COMPLETED) {
        addLog("Research completed successfully!", "success");
        addLog("Loading detailed data...", "info");

        // Load full details
        const detail = await synthAPI.getResearchDetail(research.id);
        setResearchDetail(detail);

        addLog("Loaded " + detail.personas.length + " personas", "success");
        addLog("Report ready to view", "success");
      } else if (finalStatus.status === ResearchStatus.FAILED) {
        const errorMsg = finalStatus.error_message || "Research failed";
        addLog("Error: " + errorMsg, "error");
        setError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Error creating research";
      addLog("Error: " + errorMsg, "error");
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />

      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-3" style={{ color: "#1e6078" }}>
              <FiUsers className="me-2" />
              Synth Focus Lab
            </h1>
            <p className="lead text-muted">
              Виртуальная панель респондентов. Создание фокус-групп и анализ
              ответов по входным параметрам.
            </p>
          </Col>
        </Row>

        <HealthCheck onLog={addLog} onStatusChange={setServicesReady} />

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {!servicesReady && !currentResearch && (
          <Alert variant="warning">
            <strong>⚠️ Внимание!</strong> Не все сервисы готовы. Проверьте
            статус сервисов выше перед запуском исследования.
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            {!currentResearch && (
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-4" style={{ color: "#1e6078" }}>
                    Запустить новое исследование
                  </h5>

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Описание продукта/услуги *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Например: Сервис генерации бизнес-планов с использованием ИИ для предпринимателей и стартапов"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        disabled={isProcessing}
                      />
                      <Form.Text className="text-muted">
                        Опишите ваш продукт или услугу максимально подробно
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Локация *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Например: Россия, Москва"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={isProcessing}
                      />
                      <Form.Text className="text-muted">
                        Укажите страну, регион или город для анализа
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        Количество респондентов на персону: {respondentsCount}
                      </Form.Label>
                      <Form.Range
                        min={20}
                        max={100}
                        step={10}
                        value={respondentsCount}
                        onChange={(e) =>
                          setRespondentsCount(parseInt(e.target.value))
                        }
                        disabled={isProcessing}
                      />
                      <Form.Text className="text-muted">
                        Больше респондентов = более точные результаты (но дольше
                        обработка)
                      </Form.Text>
                    </Form.Group>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartResearch}
                      disabled={isProcessing || !servicesReady}
                      className="w-100"
                    >
                      {isProcessing ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Обработка...
                        </>
                      ) : !servicesReady ? (
                        <>⚠️ Сервисы не готовы</>
                      ) : (
                        <>
                          <FiPlay className="me-2" />
                          Запустить исследование
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {currentResearch && (
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0" style={{ color: "#1e6078" }}>
                      Статус исследования
                    </h5>
                    <Badge
                      bg={
                        currentResearch.status === ResearchStatus.COMPLETED
                          ? "success"
                          : currentResearch.status === ResearchStatus.FAILED
                          ? "danger"
                          : "primary"
                      }
                    >
                      {getStatusText(currentResearch.status)}
                    </Badge>
                  </div>

                  <ProgressBar
                    now={getProgressPercent(currentResearch.status)}
                    label={`${getProgressPercent(currentResearch.status)}%`}
                    className="mb-3"
                    animated={isProcessing}
                  />

                  <Row className="text-center">
                    <Col md={4}>
                      <div className="p-3">
                        <FiUsers size={32} className="text-primary mb-2" />
                        <h6>Персоны</h6>
                        <p className="mb-0">{currentResearch.personas_count}</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="p-3">
                        <FiBarChart2 size={32} className="text-success mb-2" />
                        <h6>Респонденты</h6>
                        <p className="mb-0">
                          {currentResearch.respondents_count}
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="p-3">
                        <FiFileText size={32} className="text-warning mb-2" />
                        <h6>Статус</h6>
                        <p className="mb-0">
                          {getStatusText(currentResearch.status)}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {currentResearch.status === ResearchStatus.COMPLETED && (
                    <Button
                      variant="outline-primary"
                      className="w-100 mt-3"
                      onClick={() => {
                        setCurrentResearch(null);
                        setResearchDetail(null);
                        setProductDescription("");
                        setLocation("");
                      }}
                    >
                      Создать новое исследование
                    </Button>
                  )}
                </Card.Body>
              </Card>
            )}

            {currentResearch && !generatedReport && currentResearch.status === ResearchStatus.COMPLETED && (
              <Card className="shadow-sm mb-4 border-0">
                <Card.Body className="p-4 text-center">
                  <FiFileText size={48} className="text-info mb-3" />
                  <h5 className="mb-3" style={{ color: "#1e6078" }}>
                    Исследование завершено</h5>
                  <p className="text-muted mb-4">
                    Получите детальный анализ с AI-рекомендациями на основе
                    personas и результатов опросов
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="px-5"
                  >
                    {isGeneratingReport ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Генерация отчета...
                      </>
                    ) : (
                      <>
                        <FiFileText className="me-2" />
                        Сгенерировать отчет
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            )}

            {generatedReport && (
              <ReportDisplay
                report={generatedReport}
                isLoading={isGeneratingReport}
                onExport={(format) => {
                  addLog("Экспорт отчета в " + format, "info");
                }}
              />
            )}

            {researchDetail && (
              <>
                <PersonaDisplay personas={researchDetail.personas} />

                {researchDetail.report && (
                  <ReportViewer
                    report={researchDetail.report}
                    researchId={researchDetail.research.id}
                  />
                )}
              </>
            )}
          </Col>

          <Col lg={4}>
            <EventLogger logs={logs} onClear={clearLogs} />
          </Col>
        </Row>

        {!currentResearch && (
          <Row className="mt-5">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FiUsers size={40} className="text-primary mb-3" />
                  <h5>Buyer Persona</h5>
                  <p className="text-muted">
                    Генерация 5 детальных Buyer Persona с учетом продукта и
                    локации
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FiBarChart2 size={40} className="text-success mb-3" />
                  <h5>Виртуальные опросы</h5>
                  <p className="text-muted">
                    Создание 20-100 виртуальных респондентов и проведение
                    опросов
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <FiFileText size={40} className="text-warning mb-3" />
                  <h5>Отчеты и инсайты</h5>
                  <p className="text-muted">
                    Структурированные отчеты с рекомендациями для бизнеса
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
