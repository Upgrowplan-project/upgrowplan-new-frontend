"use client";

import { useState, useMemo } from "react";
import Header from "../../../components/Header";
import styles from "./synthFocusLab.module.css";
import { FiUsers, FiCheck, FiAlertCircle, FiDownload, FiRefreshCw, FiClock, FiCheckCircle } from "react-icons/fi";
import HealthCheck from "../../[locale]/solutions/synthFocusLab/components/HealthCheck";

// Types based on FRONTEND_SCHEMA.json
type IndustryCategory =
  | "b2b_saas"
  | "physical_food"
  | "physical_fashion"
  | "physical_electronics"
  | "services_education"
  | "services_fitness"
  | "services_beauty"
  | "services_consulting"
  | "industrial_manufacturing"
  | "real_estate"
  | "fintech"
  | "healthtech"
  | "ecommerce"
  | "travel_hospitality"
  | "other";

type TargetAudienceType = "b2b" | "b2c" | "b2b2c";

type ResearchGoal =
  | "target_audience"
  | "pain_points"
  | "price_point"
  | "purchase_triggers"
  | "objections"
  | "decision_criteria"
  | "brand_perception"
  | "feature_priorities"
  | "user_journey"
  | "market_fit"
  | "competitive_position"
  | "messaging_test"
  | "channel_preferences"
  | "retention_factors";

interface FormData {
  productDescription: string;
  industryCategory: IndustryCategory | "";
  targetAudienceType: TargetAudienceType | "";
  researchGoals: ResearchGoal[];
  country: string;
  city: string;
  personasCount: number;
  respondentsPerPersona: number;
  questionsPerGoal: number;
}

interface ResearchStatus {
  id: number;
  status: "pending" | "classifying_product" | "generating_personas" | "creating_respondents" | "generating_questions" | "conducting_survey" | "generating_report" | "completed" | "failed";
  progress?: number;
  error_message?: string;
  personas_count?: number;
  respondents_count?: number;
}

const COUNTRIES = [
  { value: "global", label: "Global" },
  { value: "russia", label: "Россия" },
  { value: "usa", label: "США" },
  { value: "uk", label: "Великобритания" },
  { value: "germany", label: "Германия" },
  { value: "france", label: "Франция" },
  { value: "italy", label: "Италия" },
  { value: "spain", label: "Испания" },
  { value: "canada", label: "Канада" },
  { value: "australia", label: "Австралия" },
  { value: "japan", label: "Япония" },
  { value: "china", label: "Китай" },
  { value: "india", label: "Индия" },
  { value: "brazil", label: "Бразилия" },
  { value: "mexico", label: "Мексика" },
  { value: "south_korea", label: "Южная Корея" },
  { value: "netherlands", label: "Нидерланды" },
  { value: "sweden", label: "Швеция" },
  { value: "switzerland", label: "Швейцария" },
  { value: "poland", label: "Польша" },
  { value: "turkey", label: "Турция" },
  { value: "uae", label: "ОАЭ" },
  { value: "singapore", label: "Сингапур" },
  { value: "israel", label: "Израиль" },
  { value: "other", label: "Другая" },
];

const INDUSTRY_OPTIONS = [
  { value: "b2b_saas", label: "IT / SaaS / B2B Software", icon: "💻" },
  { value: "physical_food", label: "Еда и напитки (Вино, Продукты питания)", icon: "🍷" },
  { value: "physical_fashion", label: "Одежда и аксессуары", icon: "👔" },
  { value: "physical_electronics", label: "Электроника и гаджеты", icon: "📱" },
  { value: "services_education", label: "Образование и обучение", icon: "📚" },
  { value: "services_fitness", label: "Фитнес и спорт", icon: "💪" },
  { value: "services_beauty", label: "Красота и здоровье", icon: "💄" },
  { value: "services_consulting", label: "Консалтинг и профессиональные услуги", icon: "💼" },
  { value: "industrial_manufacturing", label: "Производство и оборудование", icon: "🏭" },
  { value: "real_estate", label: "Недвижимость", icon: "🏠" },
  { value: "fintech", label: "Финансовые услуги", icon: "💰" },
  { value: "healthtech", label: "Медицина и здравоохранение", icon: "⚕️" },
  { value: "ecommerce", label: "Маркетплейс / E-commerce", icon: "🛒" },
  { value: "travel_hospitality", label: "Туризм и гостеприимство", icon: "✈️" },
  { value: "other", label: "Другое", icon: "📦" },
];

const RESEARCH_GOALS = [
  { value: "target_audience", label: "Кто моя целевая аудитория?" },
  { value: "pain_points", label: "Какие проблемы/боли решает мой продукт?" },
  { value: "price_point", label: "Какую цену готовы платить?" },
  { value: "purchase_triggers", label: "Что мотивирует купить?" },
  { value: "objections", label: "Какие возражения у покупателей?" },
  { value: "decision_criteria", label: "По каким критериям выбирают?" },
  { value: "brand_perception", label: "Как воспринимают мой бренд?" },
  { value: "feature_priorities", label: "Какие функции важнее всего?" },
  { value: "user_journey", label: "Как проходит путь клиента?" },
  { value: "market_fit", label: "Есть ли product-market fit?" },
  { value: "competitive_position", label: "Как я выгляжу на фоне конкурентов?" },
  { value: "messaging_test", label: "Какой месседж зацепит?" },
  { value: "channel_preferences", label: "Где искать клиентов?" },
  { value: "retention_factors", label: "Что удерживает клиентов?" },
];

export default function SynthFocusLabPage() {
  const [formData, setFormData] = useState<FormData>({
    productDescription: "",
    industryCategory: "",
    targetAudienceType: "",
    researchGoals: [],
    country: "global",
    city: "",
    personasCount: 5,
    respondentsPerPersona: 10,
    questionsPerGoal: 3,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [researchStatus, setResearchStatus] = useState<ResearchStatus | null>(null);
  const [error, setError] = useState<string>("");
  const [servicesReady, setServicesReady] = useState(false);
  const [submittedGoalsCount, setSubmittedGoalsCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [currentStatusMessage, setCurrentStatusMessage] = useState<string>("");

  // Calculation of research metrics
  const researchMetrics = useMemo(() => {
    const personas = formData.personasCount;
    // Use submittedGoalsCount if research is active, otherwise use current form data
    const goalsCount = researchStatus ? submittedGoalsCount : formData.researchGoals.length;
    const respondentsPerPersona = formData.respondentsPerPersona;
    const questionsPerGoal = formData.questionsPerGoal;

    const totalRespondents = personas * respondentsPerPersona;
    const totalQuestions = goalsCount * questionsPerGoal;

    // Time estimate: 2-3 min per persona + 1 min per 5 respondents + 0.5 min per question
    const estimatedMinutes = Math.round(
      personas * 2.5 + (totalRespondents / 5) * 1 + totalQuestions * 0.5
    );

    return {
      totalRespondents,
      totalQuestions,
      totalGoals: goalsCount,
      estimatedMinutes,
    };
  }, [formData.personasCount, formData.researchGoals.length, formData.respondentsPerPersona, formData.questionsPerGoal, researchStatus, submittedGoalsCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.industryCategory || formData.industryCategory === "") {
      setError("Выберите категорию продукта");
      return;
    }
    if (!formData.targetAudienceType || formData.targetAudienceType === "") {
      setError("Выберите тип аудитории (B2B/B2C/B2B2C)");
      return;
    }
    if (formData.researchGoals.length < 3) {
      setError("Выберите минимум 3 исследовательских цели");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStartTime(new Date()); // Record start timestamp

    // Save goals count before submission
    setSubmittedGoalsCount(formData.researchGoals.length);

    try {
      const response = await fetch("http://localhost:8003/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_description: formData.productDescription,
          industry_category: formData.industryCategory,
          target_audience_type: formData.targetAudienceType,
          research_goals: formData.researchGoals,
          country: formData.country,
          city: formData.city,
          personas_count: formData.personasCount,
          respondents_per_persona: formData.respondentsPerPersona,
          max_questions: formData.researchGoals.length * formData.questionsPerGoal
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResearchStatus(data);

      // Start polling for status
      pollResearchStatus(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при создании исследования");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollResearchStatus = async (researchId: number) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8003/api/research/${researchId}`);
        const data = await response.json();

        setResearchStatus(data);

        // Calculate progress percentage based on status AND respondent count
        const statusStages = {
          "pending": 5,
          "classifying_product": 10,
          "generating_personas": 25,
          "creating_respondents": 40,
          "generating_questions": 50,
          "conducting_survey": 70,
          "generating_report": 90,
          "completed": 100,
          "failed": 0
        };

        let progressPercent = statusStages[data.status as keyof typeof statusStages] || 0;

        // If conducting survey, calculate real progress based on respondents
        if (data.status === "conducting_survey" && data.respondents_count !== undefined) {
          const expectedRespondents = formData.personasCount * formData.respondentsPerPersona;
          if (expectedRespondents > 0) {
            // Survey stage is 50-90%, so calculate proportional progress
            const surveyProgress = (data.respondents_count / expectedRespondents);
            progressPercent = 50 + Math.round(surveyProgress * 40); // 50% to 90%
          }
        }

        // Status messages in Russian
        const statusMessages: Record<string, string> = {
          "pending": "Ожидание...",
          "classifying_product": "Классификация продукта...",
          "generating_personas": "Генерация персон...",
          "creating_respondents": "Создание респондентов...",
          "generating_questions": "Генерация вопросов...",
          "conducting_survey": "Проведение опроса...",
          "generating_report": "Генерация отчёта...",
          "completed": "Завершено",
          "failed": "Ошибка"
        };

        const statusMsg = statusMessages[data.status] || data.status;

        // Update progress and status message
        setCurrentProgress(progressPercent);

        // Build detailed status message with respondent count if available
        let detailedStatusMsg = statusMsg;
        if (data.respondents_count !== undefined && data.personas_count !== undefined) {
          const expectedRespondents = formData.personasCount * formData.respondentsPerPersona;
          if (data.respondents_count > 0 || data.personas_count > 0) {
            detailedStatusMsg = `${statusMsg} — Респонденты: ${data.respondents_count}/${expectedRespondents}`;
          }
        }
        setCurrentStatusMessage(detailedStatusMsg);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling status:", err);
        setError("Ошибка получения статуса");
      }
    }, 3000);
  };

  const handleDownloadReport = async () => {
    if (!researchStatus) return;

    try {
      const response = await fetch(`http://localhost:8003/api/research/${researchStatus.id}/export?output_format=docx&include_infographics=true`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Ошибка при скачивании отчёта");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research_${researchStatus.id}_report.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка при скачивании";
      setError(message);
    }
  };

  const toggleResearchGoal = (goal: ResearchGoal) => {
    setFormData(prev => ({
      ...prev,
      researchGoals: prev.researchGoals.includes(goal)
        ? prev.researchGoals.filter(g => g !== goal)
        : [...prev.researchGoals, goal]
    }));
  };

  // Calculate elapsed time in minutes
  const getElapsedTime = () => {
    if (!startTime) return 0;
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    return Math.round(diffMs / 60000); // Convert to minutes
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              <FiUsers style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
              Виртуальные Фокус-Группы
            </h1>
            <p className={styles.heroDescription}>
              AI-симуляция фокус-групп с реалистичными персонами для глубокого понимания вашей аудитории
            </p>
          </div>
        </section>

        {/* Service Status Section */}
        <section className={styles.formSection}>
          <HealthCheck onStatusChange={setServicesReady} />
        </section>

        {/* Main Form Content */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2>Создать исследование</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Product Description */}
                <div className={styles.section}>
                  <h3>Описание продукта</h3>
                  <textarea
                    className={styles.textarea}
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    placeholder="Опишите ваш продукт или услугу подробно..."
                    required
                    rows={5}
                  />
                </div>

                {/* Industry Category */}
                <div className={styles.section}>
                  <h3>Категория продукта *</h3>
                  <p className={styles.formDescription}>
                    Выберите категорию для точных персон (без IT-терминов для физических товаров)
                  </p>
                  <select
                    className={styles.select}
                    value={formData.industryCategory}
                    onChange={(e) => setFormData({ ...formData, industryCategory: e.target.value as IndustryCategory })}
                    required
                    style={{
                      borderColor: error && (!formData.industryCategory || formData.industryCategory === "") ? "#dc2626" : undefined,
                      borderWidth: error && (!formData.industryCategory || formData.industryCategory === "") ? "2px" : undefined
                    }}
                  >
                    <option value="">Выберите категорию...</option>
                    {INDUSTRY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>
                  {error && (!formData.industryCategory || formData.industryCategory === "") && (
                    <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                      ⚠️ Это поле обязательно для заполнения
                    </p>
                  )}
                </div>

                {/* Target Audience Type */}
                <div className={styles.section}>
                  <h3>Тип аудитории *</h3>
                  <div
                    className={styles.radioGroup}
                    style={{
                      borderColor: error && (!formData.targetAudienceType || formData.targetAudienceType === "") ? "#dc2626" : undefined,
                      borderWidth: error && (!formData.targetAudienceType || formData.targetAudienceType === "") ? "2px" : undefined,
                      borderStyle: error && (!formData.targetAudienceType || formData.targetAudienceType === "") ? "solid" : undefined,
                      borderRadius: error && (!formData.targetAudienceType || formData.targetAudienceType === "") ? "8px" : undefined,
                      padding: error && (!formData.targetAudienceType || formData.targetAudienceType === "") ? "1rem" : undefined
                    }}
                  >
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="audienceType"
                        value="b2b"
                        checked={formData.targetAudienceType === "b2b"}
                        onChange={(e) => setFormData({ ...formData, targetAudienceType: e.target.value as TargetAudienceType })}
                      />
                      <span>B2B (Бизнес для бизнеса)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="audienceType"
                        value="b2c"
                        checked={formData.targetAudienceType === "b2c"}
                        onChange={(e) => setFormData({ ...formData, targetAudienceType: e.target.value as TargetAudienceType })}
                      />
                      <span>B2C (Бизнес для потребителей)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="audienceType"
                        value="b2b2c"
                        checked={formData.targetAudienceType === "b2b2c"}
                        onChange={(e) => setFormData({ ...formData, targetAudienceType: e.target.value as TargetAudienceType })}
                      />
                      <span>B2B2C (Комбинированная модель)</span>
                    </label>
                  </div>
                  {error && (!formData.targetAudienceType || formData.targetAudienceType === "") && (
                    <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                      ⚠️ Выберите тип аудитории
                    </p>
                  )}
                </div>

                {/* Research Goals as Buttons */}
                <div className={styles.section}>
                  <h3>Исследовательские цели * (минимум 3)</h3>
                  <p className={styles.formDescription}>
                    Выберите вопросы, на которые вы хотите получить ответы
                  </p>
                  <div className={styles.goalButtonsGrid}>
                    {RESEARCH_GOALS.map(goal => (
                      <button
                        key={goal.value}
                        type="button"
                        className={`${styles.goalButton} ${formData.researchGoals.includes(goal.value as ResearchGoal) ? styles.selected : ''}`}
                        onClick={() => toggleResearchGoal(goal.value as ResearchGoal)}
                      >
                        <div className={styles.goalCheckmark}>
                          {formData.researchGoals.includes(goal.value as ResearchGoal) && <FiCheck size={14} />}
                        </div>
                        <span>{goal.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.selectedCount}>
                    Выбрано: {formData.researchGoals.length} / мин. 3
                  </div>
                </div>

                {/* Country and City */}
                <div className={styles.section}>
                  <h3>Страна и Город</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Страна</label>
                      <select
                        className={styles.select}
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      >
                        {COUNTRIES.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Город (опционально)</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Например: Москва"
                      />
                    </div>
                  </div>
                </div>

                {/* Research Parameters */}
                <div className={styles.section}>
                  <h3><FiClock style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />Параметры исследования</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "0.75rem" }}>
                    <div>
                      <label className={styles.label} style={{ marginBottom: "0.25rem", display: "block", fontSize: "0.9rem" }}>
                        Персон: <strong>{formData.personasCount}</strong>
                      </label>
                      <input
                        type="range"
                        className={styles.input}
                        value={formData.personasCount}
                        onChange={(e) => setFormData({ ...formData, personasCount: parseInt(e.target.value) })}
                        min={3}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className={styles.label} style={{ marginBottom: "0.25rem", display: "block", fontSize: "0.9rem" }}>
                        Респондентов: <strong>{formData.respondentsPerPersona}</strong>
                      </label>
                      <input
                        type="range"
                        className={styles.input}
                        value={formData.respondentsPerPersona}
                        onChange={(e) => setFormData({ ...formData, respondentsPerPersona: parseInt(e.target.value) })}
                        min={5}
                        max={20}
                        step={1}
                      />
                    </div>

                    <div>
                      <label className={styles.label} style={{ marginBottom: "0.25rem", display: "block", fontSize: "0.9rem" }}>
                        Вопросов: <strong>{formData.questionsPerGoal}</strong>
                      </label>
                      <input
                        type="range"
                        className={styles.input}
                        value={formData.questionsPerGoal}
                        onChange={(e) => setFormData({ ...formData, questionsPerGoal: parseInt(e.target.value) })}
                        min={2}
                        max={5}
                        step={1}
                      />
                    </div>
                  </div>

                  {/* Summary Metrics - Compact */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    marginTop: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%)",
                    borderRadius: "8px",
                    border: "2px solid #0785f6"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Всего респондентов:</span>
                      <span style={{ color: "#1e6078", fontSize: "1rem", fontWeight: "700" }}>{researchMetrics.totalRespondents}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Целей исследования:</span>
                      <span style={{ color: "#1e6078", fontSize: "1rem", fontWeight: "700" }}>{researchMetrics.totalGoals}</span>
                    </div>
                    <div style={{
                      marginLeft: "auto",
                      background: "#1e6078",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      fontWeight: "600"
                    }}>
                      ~{researchMetrics.estimatedMinutes} мин
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={styles.error}>
                    <FiAlertCircle /> {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || (researchStatus && researchStatus.status !== "completed" && researchStatus.status !== "failed")}
                >
                  {researchStatus && researchStatus.status !== "completed" && researchStatus.status !== "failed" ? (
                    <>
                      <FiRefreshCw className={styles.spinning} /> Проводится исследование...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <FiRefreshCw className={styles.spinning} /> Создание исследования...
                    </>
                  ) : (
                    <>
                      <FiCheck /> Создать исследование
                    </>
                  )}
                </button>
              </form>
            </div>
        </div>

        {/* Success/Progress Section - Below Form */}
        <div className={styles.formSection}>
            {/* Progress Section - Show when research is running */}
            {researchStatus && researchStatus.status !== "completed" && researchStatus.status !== "failed" && (
              <div className={styles.card}>
                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#334155" }}>
                  <FiRefreshCw style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                  Прогресс исследования
                </h3>

                {/* Progress Bar */}
                <div style={{
                  width: "100%",
                  height: "12px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "6px",
                  overflow: "hidden",
                  marginBottom: "0.75rem"
                }}>
                  <div style={{
                    width: `${currentProgress}%`,
                    height: "100%",
                    backgroundColor: "#0785f6",
                    transition: "width 0.3s ease",
                    borderRadius: "6px"
                  }} />
                </div>

                {/* Progress Percentage */}
                <div style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#0785f6",
                  marginBottom: "0.5rem"
                }}>
                  {currentProgress}%
                </div>

                {/* Current Status Message */}
                <div style={{
                  textAlign: "center",
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: "1.5"
                }}>
                  {currentStatusMessage}
                </div>
              </div>
            )}

            {/* Success Message - Show when completed */}
            {researchStatus && researchStatus.status === "completed" && (
              <div className={styles.card}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.5rem",
                  background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
                  borderRadius: "12px",
                  border: "2px solid #28a745"
                }}>
                  {/* Success Icon */}
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#28a745",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 6px rgba(40, 167, 69, 0.3)"
                  }}>
                    <FiCheckCircle size={36} color="white" />
                  </div>

                  {/* Success Text */}
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#155724",
                      marginBottom: "0.5rem"
                    }}>
                      Исследование завершено!
                    </h3>
                    <p style={{
                      fontSize: "0.95rem",
                      color: "#155724",
                      opacity: 0.9
                    }}>
                      Отчёт готов к скачиванию
                    </p>
                    <p style={{
                      fontSize: "0.9rem",
                      color: "#155724",
                      opacity: 0.8,
                      marginTop: "0.5rem"
                    }}>
                      Время выполнения: <strong>{getElapsedTime()} мин</strong>
                    </p>
                  </div>

                  {/* Download Button */}
                  <button
                    className={styles.downloadButton}
                    onClick={handleDownloadReport}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      fontSize: "1.1rem",
                      marginTop: "0.5rem",
                      background: "#28a745",
                      border: "none",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#218838"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#28a745"}
                  >
                    <FiDownload size={20} /> Скачать отчет
                  </button>
                </div>
              </div>
            )}

            {/* Error Message - Show when failed */}
            {researchStatus && researchStatus.status === "failed" && (
              <div className={styles.card}>
                <div style={{
                  padding: "1.5rem",
                  background: "#f8d7da",
                  borderRadius: "12px",
                  border: "2px solid #f5c6cb",
                  textAlign: "center"
                }}>
                  <FiAlertCircle size={48} color="#721c24" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ color: "#721c24", marginBottom: "0.5rem" }}>Ошибка исследования</h3>
                  <p style={{ color: "#721c24", fontSize: "0.9rem" }}>
                    {researchStatus.error_message || "Произошла неизвестная ошибка"}
                  </p>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
