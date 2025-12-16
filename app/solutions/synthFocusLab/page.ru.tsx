"use client";

import { useState } from "react";
import Header from "../../../components/Header";
import styles from "./synthFocusLab.module.css";
import { FiUsers, FiCheck, FiAlertCircle, FiDownload, FiRefreshCw } from "react-icons/fi";

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
  location: string;
  personasCount: number;
}

interface ResearchStatus {
  id: number;
  status: "pending" | "classifying_product" | "generating_personas" | "creating_respondents" | "generating_questions" | "conducting_survey" | "generating_report" | "completed" | "failed";
  progress?: number;
  error_message?: string;
}

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
    location: "russia",
    personasCount: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [researchStatus, setResearchStatus] = useState<ResearchStatus | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.industryCategory) {
      setError("Выберите категорию продукта");
      return;
    }
    if (!formData.targetAudienceType) {
      setError("Выберите тип аудитории (B2B/B2C/B2B2C)");
      return;
    }
    if (formData.researchGoals.length < 3) {
      setError("Выберите минимум 3 исследовательских цели");
      return;
    }

    setIsSubmitting(true);
    setError("");

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
          location: formData.location,
          personas_count: formData.personasCount,
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

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    }, 3000);
  };

  const toggleResearchGoal = (goal: ResearchGoal) => {
    setFormData(prev => ({
      ...prev,
      researchGoals: prev.researchGoals.includes(goal)
        ? prev.researchGoals.filter(g => g !== goal)
        : [...prev.researchGoals, goal]
    }));
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

        {/* Form Section */}
        <section className={styles.formSection}>
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
                  rows={4}
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
                >
                  <option value="">Выберите категорию...</option>
                  {INDUSTRY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Audience Type */}
              <div className={styles.section}>
                <h3>Тип аудитории *</h3>
                <div className={styles.radioGroup}>
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
              </div>

              {/* Research Goals */}
              <div className={styles.section}>
                <h3>Исследовательские цели * (минимум 3)</h3>
                <p className={styles.formDescription}>
                  Выберите вопросы, на которые вы хотите получить ответы
                </p>
                <div className={styles.checkboxGrid}>
                  {RESEARCH_GOALS.map(goal => (
                    <label key={goal.value} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.researchGoals.includes(goal.value as ResearchGoal)}
                        onChange={() => toggleResearchGoal(goal.value as ResearchGoal)}
                      />
                      <span>{goal.label}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.selectedCount}>
                  Выбрано: {formData.researchGoals.length} / мин. 3
                </div>
              </div>

              {/* Location & Personas */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Локация</label>
                  <select
                    className={styles.select}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="russia">Россия</option>
                    <option value="abroad">За рубежом</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Количество персон</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.personasCount}
                    onChange={(e) => setFormData({ ...formData, personasCount: parseInt(e.target.value) })}
                    min={3}
                    max={10}
                  />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
        </section>

        {/* Research Status */}
        {researchStatus && (
          <section className={styles.formSection}>
            <div className={styles.card}>
              <h2>Статус исследования #{researchStatus.id}</h2>
              <div className={styles.statusContainer}>
                <div className={styles.statusBadge} data-status={researchStatus.status}>
                  {researchStatus.status}
                </div>
                {researchStatus.status === "completed" && (
                  <button className={styles.downloadButton}>
                    <FiDownload /> Скачать отчет
                  </button>
                )}
                {researchStatus.error_message && (
                  <div className={styles.error}>
                    <FiAlertCircle /> {researchStatus.error_message}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
