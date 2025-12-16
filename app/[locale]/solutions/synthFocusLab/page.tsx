"use client";

import { useState, useEffect } from "react";
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
import EventLogger, { LogEntry, LogLevel } from "./components/EventLogger";
import HealthCheck from "./components/HealthCheck";

// LocalStorage key
const STORAGE_KEY = "synthFocusLab_formData";

// Form data interface
interface FormData {
  productDescription: string;
  location: string;
  respondentsCount: number;
  industryCategory: string;
  targetAudienceType: string;
  researchGoals: string[];
  personasCount: number;
  maxQuestions: number;
}

export default function SynthFocusLabPage() {
  const [productDescription, setProductDescription] = useState("");
  const [location, setLocation] = useState("");
  const [respondentsCount, setRespondentsCount] = useState(50);
  const [industryCategory, setIndustryCategory] = useState("");
  const [targetAudienceType, setTargetAudienceType] = useState("");
  const [researchGoals, setResearchGoals] = useState<string[]>([]);
  const [personasCount, setPersonasCount] = useState(5);
  const [maxQuestions, setMaxQuestions] = useState(12);
  const [dataRestored, setDataRestored] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResearch, setCurrentResearch] =
    useState<ResearchStatusResponse | null>(null);
  const [researchDetail, setResearchDetail] = useState<ResearchDetail | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [servicesReady, setServicesReady] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data: FormData = JSON.parse(saved);
          setProductDescription(data.productDescription || "");
          setLocation(data.location || "");
          setRespondentsCount(data.respondentsCount || 50);
          setIndustryCategory(data.industryCategory || "");
          setTargetAudienceType(data.targetAudienceType || "");
          setResearchGoals(data.researchGoals || []);
          setPersonasCount(data.personasCount || 5);
          setMaxQuestions(data.maxQuestions || 12);
          setDataRestored(true);
          addLog("✅ Данные формы восстановлены из сохранения", "success");
        } catch (e) {
          console.error("Failed to restore form data:", e);
        }
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && dataRestored) {
      const formData: FormData = {
        productDescription,
        location,
        respondentsCount,
        industryCategory,
        targetAudienceType,
        researchGoals,
        personasCount,
        maxQuestions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [
    productDescription,
    location,
    respondentsCount,
    industryCategory,
    targetAudienceType,
    researchGoals,
    personasCount,
    maxQuestions,
    dataRestored,
  ]);

  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      addLog("🗑️ Сохраненные данные очищены", "info");
    }
  };

  const handleStartNewResearch = () => {
    setCurrentResearch(null);
    setResearchDetail(null);
    setError(null);
    setIsProcessing(false);
    clearLogs();
    addLog("🔄 Начато новое исследование", "info");
  };

  const handleClearForm = () => {
    setProductDescription("");
    setLocation("");
    setRespondentsCount(50);
    setIndustryCategory("");
    setTargetAudienceType("");
    setResearchGoals([]);
    setPersonasCount(5);
    setMaxQuestions(12);
    clearSavedData();
    addLog("🧹 Форма очищена", "info");
  };

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

  const calculateEstimatedTime = (): string => {
    // Расчет примерного времени:
    // - Генерация персон: ~1 мин
    // - Создание респондентов: personasCount * respondentsCount * 0.5 сек
    // - Генерация вопросов: ~0.5 мин
    // - Опрос: personasCount * respondentsCount * maxQuestions * 1 сек
    // - Отчет: ~1 мин

    const personasTime = 1; // минуты
    const respondentsTime = (personasCount * respondentsCount * 0.5) / 60; // минуты
    const questionsTime = 0.5; // минуты
    const surveyTime = (personasCount * respondentsCount * maxQuestions * 1) / 60; // минуты
    const reportTime = 1; // минуты

    const totalMinutes = personasTime + respondentsTime + questionsTime + surveyTime + reportTime;

    if (totalMinutes < 1) {
      return "< 1 мин";
    } else if (totalMinutes < 60) {
      return `~${Math.round(totalMinutes)} мин`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      return `~${hours} ч ${minutes} мин`;
    }
  };


  const handleStartResearch = async () => {
    if (!productDescription.trim() || !location.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (!industryCategory) {
      setError("Пожалуйста, выберите категорию продукта");
      return;
    }

    if (!targetAudienceType) {
      setError("Пожалуйста, выберите тип аудитории (B2B/B2C/B2B2C)");
      return;
    }

    if (researchGoals.length < 3) {
      setError("Пожалуйста, выберите минимум 3 исследовательских цели");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setCurrentResearch(null);
    setResearchDetail(null);
    addLog("Research started", "info");
    addLog("Product: " + productDescription.substring(0, 50) + "...", "info");
    addLog("Location: " + location, "info");
    addLog("Category: " + industryCategory, "info");
    addLog("Audience: " + targetAudienceType, "info");
    addLog("Research goals: " + researchGoals.length, "info");
    addLog("Personas: " + personasCount + ", Respondents: " + respondentsCount + ", Questions: " + maxQuestions, "info");
    addLog("Estimated time: " + calculateEstimatedTime(), "info");

    try {
      // Create research
      addLog("Creating research request...", "info");
      addLog("⚠️ Checking and stopping any active research...", "info");
      const research = await synthAPI.createResearch({
        product_description: productDescription,
        location: location,
        industry_category: industryCategory,
        target_audience_type: targetAudienceType,
        research_goals: researchGoals,
        respondents_per_persona: respondentsCount,
        personas_count: personasCount,
        max_questions: maxQuestions,
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

        {!currentResearch && (
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3" style={{ color: "#1e6078" }}>
                        Как это работает
                      </h5>
                      <p className="text-muted mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                        Система создает виртуальные Buyer Personas на основе вашего продукта и целевой аудитории,
                        затем генерирует виртуальных респондентов с уникальными характеристиками.
                        AI проводит детальные опросы, имитируя реальные ответы потенциальных клиентов,
                        и формирует структурированный отчет с инсайтами и рекомендациями.
                      </p>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-3" style={{ color: "#1e6078" }}>
                        Что вы получаете
                      </h5>
                      <p className="text-muted mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                        Детальные профили целевой аудитории, результаты виртуальных опросов с количественными
                        и качественными данными, анализ болевых точек и мотиваций, ценовые ожидания,
                        конкурентный анализ и практические рекомендации для маркетинговой стратегии.
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <HealthCheck onLog={addLog} onStatusChange={setServicesReady} />

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {dataRestored && productDescription && !currentResearch && (
          <Alert variant="info" onClose={() => setDataRestored(false)} dismissible>
            <strong>💾 Данные восстановлены!</strong> Ваши предыдущие настройки формы были автоматически загружены.
            Вы можете продолжить с сохраненными данными или очистить форму кнопкой "🧹 Очистить".
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

                    <Form.Group className="mb-3">
                      <Form.Label>Категория продукта *</Form.Label>
                      <Form.Select
                        value={industryCategory}
                        onChange={(e) => setIndustryCategory(e.target.value)}
                        disabled={isProcessing}
                      >
                        <option value="">Выберите категорию...</option>
                        <option value="b2b_saas">💻 IT / SaaS / B2B Software</option>
                        <option value="physical_food">🍷 Еда и напитки (Вино, Продукты питания)</option>
                        <option value="physical_fashion">👔 Одежда и аксессуары</option>
                        <option value="physical_electronics">📱 Электроника и гаджеты</option>
                        <option value="services_education">📚 Образование и обучение</option>
                        <option value="services_fitness">💪 Фитнес и спорт</option>
                        <option value="services_beauty">💄 Красота и здоровье</option>
                        <option value="services_consulting">💼 Консалтинг и профессиональные услуги</option>
                        <option value="industrial_manufacturing">🏭 Производство и оборудование</option>
                        <option value="real_estate">🏠 Недвижимость</option>
                        <option value="fintech">💰 Финансовые услуги</option>
                        <option value="healthtech">⚕️ Медицина и здравоохранение</option>
                        <option value="ecommerce">🛒 Маркетплейс / E-commerce</option>
                        <option value="travel_hospitality">✈️ Туризм и гостеприимство</option>
                        <option value="other">📦 Другое</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Выбор категории влияет на типы персон (без IT-терминов для физических товаров)
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Тип аудитории *</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="B2B (Бизнес для бизнеса)"
                          name="audienceType"
                          value="b2b"
                          checked={targetAudienceType === "b2b"}
                          onChange={(e) => setTargetAudienceType(e.target.value)}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="B2C (Бизнес для потребителей)"
                          name="audienceType"
                          value="b2c"
                          checked={targetAudienceType === "b2c"}
                          onChange={(e) => setTargetAudienceType(e.target.value)}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="B2B2C (Комбинированная модель)"
                          name="audienceType"
                          value="b2b2c"
                          checked={targetAudienceType === "b2b2c"}
                          onChange={(e) => setTargetAudienceType(e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Исследовательские цели * (минимум 3)</Form.Label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        <Form.Check
                          type="checkbox"
                          label="Кто моя целевая аудитория?"
                          checked={researchGoals.includes("target_audience")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "target_audience"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "target_audience"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Какие проблемы/боли решает мой продукт?"
                          checked={researchGoals.includes("pain_points")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "pain_points"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "pain_points"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Какую цену готовы платить?"
                          checked={researchGoals.includes("price_point")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "price_point"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "price_point"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Что мотивирует купить?"
                          checked={researchGoals.includes("purchase_triggers")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "purchase_triggers"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "purchase_triggers"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Какие возражения у покупателей?"
                          checked={researchGoals.includes("objections")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "objections"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "objections"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="По каким критериям выбирают?"
                          checked={researchGoals.includes("decision_criteria")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "decision_criteria"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "decision_criteria"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Как воспринимают мой бренд?"
                          checked={researchGoals.includes("brand_perception")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "brand_perception"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "brand_perception"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Какие функции важнее всего?"
                          checked={researchGoals.includes("feature_priorities")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "feature_priorities"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "feature_priorities"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Как проходит путь клиента?"
                          checked={researchGoals.includes("user_journey")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "user_journey"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "user_journey"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Есть ли product-market fit?"
                          checked={researchGoals.includes("market_fit")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "market_fit"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "market_fit"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Как я выгляжу на фоне конкурентов?"
                          checked={researchGoals.includes("competitive_position")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "competitive_position"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "competitive_position"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Какой месседж зацепит?"
                          checked={researchGoals.includes("messaging_test")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "messaging_test"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "messaging_test"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Где искать клиентов?"
                          checked={researchGoals.includes("channel_preferences")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "channel_preferences"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "channel_preferences"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Что удерживает клиентов?"
                          checked={researchGoals.includes("retention_factors")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResearchGoals([...researchGoals, "retention_factors"]);
                            } else {
                              setResearchGoals(researchGoals.filter(g => g !== "retention_factors"));
                            }
                          }}
                          disabled={isProcessing}
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Выбрано целей: {researchGoals.length} / минимум 3
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

                    <Card className="mb-4" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                      <Card.Body>
                        <h6 className="mb-3" style={{ color: "#1e6078" }}>
                          Дополнительные параметры
                        </h6>
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Количество персон: {personasCount}</Form.Label>
                              <Form.Range
                                min={3}
                                max={10}
                                step={1}
                                value={personasCount}
                                onChange={(e) =>
                                  setPersonasCount(parseInt(e.target.value))
                                }
                                disabled={isProcessing}
                              />
                              <Form.Text className="text-muted">
                                3-10 buyer personas
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Количество вопросов: {maxQuestions}</Form.Label>
                              <Form.Range
                                min={5}
                                max={20}
                                step={1}
                                value={maxQuestions}
                                onChange={(e) =>
                                  setMaxQuestions(parseInt(e.target.value))
                                }
                                disabled={isProcessing}
                              />
                              <Form.Text className="text-muted">
                                5-20 вопросов в опросе
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <div className="d-flex flex-column justify-content-center h-100">
                              <div className="text-center p-3" style={{ backgroundColor: "#e7f3ff", borderRadius: "8px" }}>
                                <div style={{ fontSize: "0.75rem", color: "#6c757d", marginBottom: "0.25rem" }}>
                                  Примерное время
                                </div>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e6078" }}>
                                  {calculateEstimatedTime()}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "#6c757d", marginTop: "0.25rem" }}>
                                  {personasCount} персон × {respondentsCount} респ. × {maxQuestions} вопр.
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleStartResearch}
                        disabled={isProcessing || !servicesReady}
                        className="flex-grow-1"
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
                      <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={handleClearForm}
                        disabled={isProcessing}
                        title="Очистить все поля формы"
                      >
                        🧹 Очистить
                      </Button>
                    </div>
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
                      onClick={handleStartNewResearch}
                    >
                      🔄 Начать новое исследование
                    </Button>
                  )}

                  {currentResearch.status === ResearchStatus.FAILED && (
                    <Button
                      variant="outline-danger"
                      className="w-100 mt-3"
                      onClick={handleStartNewResearch}
                    >
                      🔄 Попробовать снова
                    </Button>
                  )}
                </Card.Body>
              </Card>
            )}

            {currentResearch && currentResearch.status === ResearchStatus.COMPLETED && (
              <Card className="shadow-sm mb-4 border-0">
                <Card.Body className="p-4 text-center">
                  <FiFileText size={48} className="text-success mb-3" />
                  <h5 className="mb-3" style={{ color: "#1e6078" }}>
                    Исследование завершено</h5>
                  <p className="text-muted mb-4">
                    Скачайте детальный отчет в формате DOCX
                  </p>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={async () => {
                      try {
                        addLog("Скачивание отчета DOCX...", "info");
                        const blob = await synthAPI.exportReportDocx(currentResearch.id);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `research_${currentResearch.id}_report.docx`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        addLog("✅ Отчет успешно скачан", "success");
                      } catch (err: any) {
                        const errorMsg = err.message || "Ошибка скачивания отчета";
                        addLog("❌ " + errorMsg, "error");
                        setError(errorMsg);
                      }
                    }}
                    className="px-5"
                  >
                    <FiFileText className="me-2" />
                    Скачать отчет DOCX
                  </Button>
                </Card.Body>
              </Card>
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
