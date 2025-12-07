"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import styles from "./marketResearch.module.css";
import {
  FiBarChart2,
  FiCheck,
  FiAlertCircle,
  FiDownload,
  FiFile,
  FiRefreshCw,
} from "react-icons/fi";

type BusinessType = "B2B" | "B2C" | "B2B2C" | "C2C" | "D2C";
type ProductType =
  // B2C категории
  | "retail_fmcg"
  | "fashion_apparel"
  | "electronics"
  | "food_beverage"
  | "digital_apps"
  // B2B категории
  | "manufacturing"
  | "wholesale_trade"
  | "corporate_solutions"
  | "business_tech"
  // Маркетплейсы и платформы
  | "marketplace"
  | "p2p_platform"
  // SaaS и цифровые платформы
  | "saas_b2b"
  | "saas_b2c"
  | "cloud_platform"
  // Промышленные рынки
  | "industrial_equipment"
  | "logistics"
  | "construction"
  | "energy"
  | "agriculture"
  // Услуги
  | "consulting"
  | "healthcare"
  | "education"
  | "tourism_hospitality"
  | "financial_services"
  | "horeca"
  | "professional_services"
  // Общее
  | "other";
type ResearchGoal =
  | "market_entry"
  | "product_testing"
  | "competitive_analysis"
  | "target_audience"
  | "pricing_research"
  | "brand_awareness";
type Localization = "local" | "global";

interface FormData {
  productName: string;
  productDescription: string;
  country: string;
  region: string;
  businessTypes: BusinessType[];
  productTypes: ProductType[];
  localization: Localization | "";
  researchGoals: ResearchGoal[];
  targetAudience: string;
  competitors: string;
}
interface ResearchStatus {
  research_id: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  current_stage: string;
  error?: string;
}

interface MarketSize {
  tam: string;
  sam: string;
  som: string;
}

interface Competitor {
  name: string;
  category: string;
  description: string;
  url?: string;
}

interface CompetitorAnalysis {
  direct_competitors: number;
  indirect_competitors: number;
  potential_competitors: number;
}

interface CompetitiveLandscape {
  summary: string;
  top_competitors?: Competitor[];
  competitor_analysis?: CompetitorAnalysis;
}

interface TargetSegment {
  segment_name: string;
  type: string;
  description: string;
  characteristics?: string[];
  needs?: string[];
}

interface ResearchReport {
  research_id: string;
  executive_summary?: string;
  market_size?: MarketSize;
  competitive_landscape?: CompetitiveLandscape;
  target_segments?: TargetSegment[];
  pricing_analysis?: any;
  docx_path?: string;
}

// Enhanced Report Interfaces
interface EnhancedExecutiveSummary {
  research_objectives: string[];
  key_findings: string[];
  strategic_recommendations: string[];
  market_opportunity_summary: string;
}

interface MarketSizeData {
  tam_value?: string;
  tam_description?: string;
  sam_value?: string;
  sam_description?: string;
  som_value?: string;
  som_description?: string;
  forecast_years?: number;
  growth_rate?: string;
}

interface MarketTrends {
  current_trends: string[];
  growth_drivers: string[];
  market_barriers: string[];
  future_outlook?: string;
}

interface EnhancedMarketAnalysis {
  market_size: MarketSizeData;
  market_trends: MarketTrends;
  market_maturity?: string;
  regulatory_environment?: string;
}

interface AudienceSegment {
  segment_name: string;
  segment_size?: string;
  demographics: string[];
  psychographics: string[];
  behaviors: string[];
  pain_points: string[];
  needs: string[];
  buying_motivations: string[];
  priority?: string;
}

interface EnhancedTargetAudienceAnalysis {
  segments: AudienceSegment[];
  customer_journey?: string;
  decision_making_process?: string;
}

interface CompetitorProfile {
  name: string;
  competitor_type: string;
  market_position?: string;
  market_share?: string;
  strengths: string[];
  weaknesses: string[];
  products_services: string[];
  pricing?: string;
  unique_value_proposition?: string;
  website?: string;
  social_links?: string[];
}

interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface EnhancedCompetitiveAnalysis {
  competitive_landscape_overview: string;
  direct_competitors: CompetitorProfile[];
  indirect_competitors: CompetitorProfile[];
  market_gaps: string[];
  competitive_advantages: string[];
  swot?: SWOTAnalysis;
}

interface PricingBenchmark {
  competitor_name: string;
  price_range: string;
  pricing_model: string;
  value_proposition: string;
}

interface EnhancedPricingAnalysis {
  market_price_range?: string;
  competitive_pricing: PricingBenchmark[];
  pricing_strategies: string[];
  recommended_pricing?: string;
  price_sensitivity_analysis?: string;
}

interface ActionItem {
  action: string;
  priority: string;
  timeline: string;
  responsible?: string;
  expected_outcome?: string;
}

interface EnhancedStrategicRecommendations {
  go_to_market_strategy: string;
  positioning_statement: string;
  marketing_channels: string[];
  action_plan: ActionItem[];
  success_metrics: string[];
}

interface EnhancedResearchReport {
  research_id: string;
  created_at: string;
  completed_at?: string;
  product_name: string;
  industry: string;
  location: string;
  executive_summary: EnhancedExecutiveSummary;
  market_analysis: EnhancedMarketAnalysis;
  target_audience: EnhancedTargetAudienceAnalysis;
  competitive_analysis: EnhancedCompetitiveAnalysis;
  pricing_analysis: EnhancedPricingAnalysis;
  strategic_recommendations: EnhancedStrategicRecommendations;
  raw_research_data?: any;
  docx_path?: string;
  pdf_path?: string;
}

// Функция для очистки markdown символов из текста
const cleanMarkdown = (text: string): string => {
  if (!text) return "";

  return (
    text
      // Убираем заголовки (###, ##, #)
      .replace(/^#{1,6}\s+/gm, "")
      // Убираем жирный текст (**text** или __text__)
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      // Убираем курсив (*text* или _text_)
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      // Убираем bullet points (-, *, •)
      .replace(/^[\s]*[-*•]\s+/gm, "• ")
      // Убираем лишние пустые строки (более 2 подряд)
      .replace(/\n{3,}/g, "\n\n")
      // Убираем code blocks (```)
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`(.+?)`/g, "$1")
      .trim()
  );
};

export default function MarketResearchPage() {
  const productNameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productDescription: "",
    country: "",
    region: "",
    businessTypes: [],
    productTypes: [],
    localization: "",
    researchGoals: [],
    targetAudience: "",
    competitors: "",
  });

  const [researchId, setResearchId] = useState<string | null>(null);
  const [researchStatus, setResearchStatus] = useState<ResearchStatus | null>(
    null
  );
  const [researchReport, setResearchReport] = useState<ResearchReport | null>(
    null
  );
  const [enhancedReport, setEnhancedReport] =
    useState<EnhancedResearchReport | null>(null);
  const [activeSection, setActiveSection] = useState<string>("executive");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Таймер и метрики исследования
  const [researchStartTime, setResearchStartTime] = useState<number | null>(
    null
  );
  const [researchDuration, setResearchDuration] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  // Health status state
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);

  // Автофокус на первое поле формы и предотвращение автоскролла
  useEffect(() => {
    // Скроллим страницу в начало
    window.scrollTo(0, 0);

    // Устанавливаем фокус на первое поле формы
    if (productNameInputRef.current) {
      productNameInputRef.current.focus();
    }
  }, []);

  // Load health status on mount and refresh every 30 seconds
  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        // HARDCODED FOR NOW - env var not working
        const healthApiBaseUrl = "http://localhost:8005";
        const response = await fetch(`${healthApiBaseUrl}/api/v1/agents/health`);

        if (response.ok) {
          const data = await response.json();
          setHealthStatus(data);
        } else {
          console.error("[Health Check] Failed to fetch health status:", response.status);
        }
      } catch (error) {
        console.error("[Health Check] Error fetching health status:", error);
      } finally {
        setIsLoadingHealth(false);
      }
    };

    // Fetch immediately
    fetchHealthStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const businessTypeOptions = [
    {
      value: "B2C" as BusinessType,
      label: "B2C - Бизнес для потребителей (розница, FMCG, мода)",
    },
    {
      value: "B2B" as BusinessType,
      label: "B2B - Бизнес для бизнеса (производство, корпоративные решения)",
    },
    {
      value: "B2B2C" as BusinessType,
      label: "B2B2C - Через бизнес потребителям",
    },
    {
      value: "C2C" as BusinessType,
      label: "C2C - Потребитель-потребителю (платформы, маркетплейсы)",
    },
    {
      value: "D2C" as BusinessType,
      label: "D2C - Прямые продажи потребителям (бренды напрямую)",
    },
  ];

  const productTypeOptions = [
    // B2C категории
    {
      value: "retail_fmcg" as ProductType,
      label: "Розница и FMCG",
      category: "B2C",
    },
    {
      value: "fashion_apparel" as ProductType,
      label: "Мода и одежда",
      category: "B2C",
    },
    {
      value: "electronics" as ProductType,
      label: "Техника и электроника",
      category: "B2C",
    },
    {
      value: "food_beverage" as ProductType,
      label: "Продукты питания и напитки",
      category: "B2C",
    },
    {
      value: "digital_apps" as ProductType,
      label: "Цифровые приложения для потребителей",
      category: "B2C",
    },

    // B2B категории
    {
      value: "manufacturing" as ProductType,
      label: "Производство",
      category: "B2B",
    },
    {
      value: "wholesale_trade" as ProductType,
      label: "Оптовая торговля",
      category: "B2B",
    },
    {
      value: "corporate_solutions" as ProductType,
      label: "Корпоративные решения",
      category: "B2B",
    },
    {
      value: "business_tech" as ProductType,
      label: "Технологии для бизнеса",
      category: "B2B",
    },

    // Маркетплейсы и платформы
    {
      value: "marketplace" as ProductType,
      label: "Маркетплейс/Платформа",
      category: "Платформы",
    },
    {
      value: "p2p_platform" as ProductType,
      label: "P2P платформа",
      category: "Платформы",
    },

    // SaaS и цифровые платформы
    { value: "saas_b2b" as ProductType, label: "B2B SaaS", category: "SaaS" },
    { value: "saas_b2c" as ProductType, label: "B2C SaaS", category: "SaaS" },
    {
      value: "cloud_platform" as ProductType,
      label: "Облачная платформа",
      category: "SaaS",
    },

    // Промышленные рынки
    {
      value: "industrial_equipment" as ProductType,
      label: "Промышленное оборудование",
      category: "Промышленность",
    },
    {
      value: "logistics" as ProductType,
      label: "Логистика",
      category: "Промышленность",
    },
    {
      value: "construction" as ProductType,
      label: "Строительство",
      category: "Промышленность",
    },
    {
      value: "energy" as ProductType,
      label: "Энергетика",
      category: "Промышленность",
    },
    {
      value: "agriculture" as ProductType,
      label: "Сельское хозяйство",
      category: "Промышленность",
    },

    // Услуги
    {
      value: "consulting" as ProductType,
      label: "Консалтинг",
      category: "Услуги",
    },
    {
      value: "healthcare" as ProductType,
      label: "Медицина",
      category: "Услуги",
    },
    {
      value: "education" as ProductType,
      label: "Образование",
      category: "Услуги",
    },
    {
      value: "tourism_hospitality" as ProductType,
      label: "Туризм и гостиничный бизнес",
      category: "Услуги",
    },
    {
      value: "financial_services" as ProductType,
      label: "Финансовые услуги",
      category: "Услуги",
    },
    {
      value: "horeca" as ProductType,
      label: "HoReCa (отели, рестораны, кафе)",
      category: "Услуги",
    },
    {
      value: "professional_services" as ProductType,
      label: "Профессиональные услуги",
      category: "Услуги",
    },

    // Общее
    { value: "other" as ProductType, label: "Другое", category: "Другое" },
  ];

  const localizationOptions = [
    { value: "local" as Localization, label: "Местный рынок" },
    { value: "global" as Localization, label: "Глобальный рынок" },
  ];

  const researchGoalOptions = [
    { value: "market_entry" as ResearchGoal, label: "Выход на рынок" },
    {
      value: "product_testing" as ResearchGoal,
      label: "Тестирование продукта",
    },
    {
      value: "competitive_analysis" as ResearchGoal,
      label: "Конкурентный анализ",
    },
    {
      value: "target_audience" as ResearchGoal,
      label: "Анализ целевой аудитории",
    },
    {
      value: "pricing_research" as ResearchGoal,
      label: "Ценовое исследование",
    },
    { value: "brand_awareness" as ResearchGoal, label: "Узнаваемость бренда" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleButtonSelect = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessTypeToggle = (type: BusinessType) => {
    setFormData((prev) => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter((t) => t !== type)
        : [...prev.businessTypes, type],
    }));
  };

  const handleProductTypeToggle = (type: ProductType) => {
    setFormData((prev) => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter((t) => t !== type)
        : [...prev.productTypes, type],
    }));
  };

  const handleGoalToggle = (goal: ResearchGoal) => {
    setFormData((prev) => ({
      ...prev,
      researchGoals: prev.researchGoals.includes(goal)
        ? prev.researchGoals.filter((g) => g !== goal)
        : [...prev.researchGoals, goal],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setResearchStartTime(Date.now()); // Запуск таймера
    setResearchDuration(null); // Сброс предыдущей длительности
    console.log("[Market Research] Starting research submission...");
    console.log("[Market Research] Form data:", formData);

    if (
      !formData.productName ||
      !formData.productDescription ||
      !formData.country ||
      formData.businessTypes.length === 0 ||
      formData.productTypes.length === 0 ||
      !formData.localization ||
      formData.researchGoals.length === 0
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // CRITICAL: Health check BEFORE starting research
    console.log("[HEALTH CHECK] Checking all system components before starting research...");
    // HARDCODED FOR NOW - env var not working
    const healthApiBaseUrl = "http://localhost:8005";

    try {
      const healthResponse = await fetch(`${healthApiBaseUrl}/api/v1/agents/health`);

      if (!healthResponse.ok) {
        throw new Error(`Health check failed: HTTP ${healthResponse.status}`);
      }

      const healthData = await healthResponse.json();
      console.log("[HEALTH CHECK] Response:", healthData);

      if (!healthData.all_ready) {
        // Find which components failed
        const failedComponents = healthData.agents
          .filter((agent: any) => !agent.ready && !agent.optional)
          .map((agent: any) => `${agent.name}: ${agent.error || 'offline'}`)
          .join('\n');

        setError(
          `❌ System is not ready to start research!\n\n` +
          `The following components are unavailable:\n${failedComponents}\n\n` +
          `Please ensure all services are running and try again.`
        );
        setIsSubmitting(false);
        console.error("[HEALTH CHECK] System not ready:", failedComponents);
        return;
      }

      console.log("[HEALTH CHECK] ✓ All critical components are ready!");

    } catch (healthError) {
      console.error("[HEALTH CHECK] Error:", healthError);
      setError(
        `❌ Failed to check system readiness: ${healthError instanceof Error ? healthError.message : String(healthError)}\n\n` +
        `Make sure Market Research Service is running on port 8005.`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        session_id: `session_${Date.now()}`,
        answers: {
          product_or_service: {
            answer: formData.productDescription,
            timestamp: new Date().toISOString(),
            files: [],
          },
          target_audience_type: {
            answer: formData.businessTypes,
            timestamp: new Date().toISOString(),
            files: [],
          },
          location: {
            answer: formData.region
              ? `${formData.country}, ${formData.region}`
              : formData.country,
            timestamp: new Date().toISOString(),
            files: [],
          },
          business_stage: {
            answer: "Развитие",
            timestamp: new Date().toISOString(),
            files: [],
          },
          competitors: {
            answer: formData.competitors || "Неизвестно",
            timestamp: new Date().toISOString(),
            files: [],
          },
          investment_needed: {
            answer: "$50000",
            timestamp: new Date().toISOString(),
            files: [],
          },
        },
      };

      console.log(
        "[Market Research] Sending request to market-research-service..."
      );
      console.log("[Market Research] Request data:", requestData);

      // Get API base URL from environment or use default
      const apiBaseUrl =
        "http://localhost:8005";

      const response = await fetch(
        `${apiBaseUrl}/api/v1/research/from-onboarding`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      console.log("[Market Research] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Ошибка запуска исследования (${response.status}). ` +
            `Проверьте, что бэкенд сервис запущен на ${apiBaseUrl}. ` +
            `Ошибка: ${errorText.substring(0, 200)}`
        );
      }

      const result = await response.json();
      console.log(
        "[Market Research] Research started with ID:",
        result.research_id
      );
      console.log("[Market Research] Initial status:", result);
      setResearchId(result.research_id);
      setResearchStatus(result);
      pollResearchStatus(result.research_id);
    } catch (err: any) {
      console.error("[Market Research] Error starting research:", err);
      // Network error or other fetch error
      if (
        err.message?.includes("fetch") ||
        err.message?.includes("network") ||
        err.code === "ECONNREFUSED" ||
        err.message?.includes("Failed to fetch")
      ) {
        setError(
          `Не удалось подключиться к бэкенд сервису. ` +
            `Убедитесь, что сервис маркетингового исследования запущен на ${
              process.env.NEXT_PUBLIC_SOLUTIONS_API_URL ||
              "http://localhost:8002"
            }. ` +
            `Ошибка: ${err.message || "Соединение отклонено"}`
        );
      } else {
        setError(err.message || "Ошибка при запуске исследования");
      }
      setIsSubmitting(false);
    }
  };

  const pollResearchStatus = async (id: string) => {
    console.log("[Market Research] Starting status polling for ID:", id);

    let retries = 0;
    const maxRetries = 3;
    let pollInterval = 3000; // Start with 3 seconds
    const maxPollInterval = 15000; // Max 15 seconds

    // Get API base URL from environment or use default
    const apiBaseUrl =
      "http://localhost:8005";

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/research/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const status: ResearchStatus = await response.json();

        // Сброс счетчика ошибок при успешном запросе
        retries = 0;
        setResearchStatus(status);

        if (status.status === "completed") {
          console.log("=".repeat(80));
          console.log("✅ ✅ ✅ RESEARCH COMPLETED! ✅ ✅ ✅");
          console.log("=".repeat(80));
          console.log("[Market Research] Fetching report...");
          clearInterval(interval);
          setIsSubmitting(false);

          // Вычисляем длительность исследования
          if (researchStartTime) {
            const endTime = Date.now();
            const durationMs = endTime - researchStartTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            setResearchDuration({ minutes, seconds });
            console.log(
              `[Market Research] Duration: ${minutes} min ${seconds} sec`
            );
          }

          fetchResearchReport(id);
        } else if (status.status === "failed") {
          clearInterval(interval);
          setIsSubmitting(false);
          setError(
            `Исследование не удалось выполнить: ${
              status.error || "Неизвестная ошибка"
            }`
          );
        } else if (status.status === "in_progress" && status.progress >= 65) {
          // Увеличиваем интервал опроса для долгих операций
          pollInterval = Math.min(pollInterval * 1.5, maxPollInterval);
          clearInterval(interval);
          setTimeout(() => pollResearchStatus(id), pollInterval);
        }
      } catch (err: any) {
        console.error("Ошибка получения статуса:", err);
        retries++;

        if (retries >= maxRetries) {
          clearInterval(interval);
          setIsSubmitting(false);
          // Network error or other fetch error
          if (
            err.message?.includes("fetch") ||
            err.message?.includes("network") ||
            err.code === "ECONNREFUSED" ||
            err.message?.includes("Failed to fetch")
          ) {
            setError(
              `Не удается получить статус исследования. ` +
                `Проверьте, что бэкенд сервис запущен на ${apiBaseUrl}. ` +
                `Ошибка: ${err.message || "Соединение отклонено"}`
            );
          } else {
            setError(
              `Не удается получить статус исследования. ` +
                `Пожалуйста, проверьте соединение. Ошибка: ${
                  err.message || "Неизвестная ошибка"
                }`
            );
          }
        } else {
          // Экспоненциальное увеличение интервала при ошибках
          pollInterval = Math.min(pollInterval * 2, maxPollInterval);
        }
      }
    }, pollInterval);

    // Безопасный таймаут
    setTimeout(() => {
      clearInterval(interval);
      if (researchStatus?.status === "in_progress") {
        setIsSubmitting(false);
        setError(
          "Исследование занимает больше времени, чем ожидалось. Попробуйте обновить страницу позже."
        );
      }
    }, 600000); // Увеличено до 10 минут
  };

  const fetchResearchReport = async (id: string) => {
    console.log("[Market Research] Fetching research report for ID:", id);

    // Get API base URL from environment or use default
    const apiBaseUrl =
      "http://localhost:8005";

    try {
      // Fetch enhanced report (new format)
      const enhancedResponse = await fetch(
        `${apiBaseUrl}/api/v1/research/${id}/enhanced-report`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        }
      );

      if (enhancedResponse.ok) {
        const enhancedData = await enhancedResponse.json();
        console.log("=".repeat(80));
        console.log("📊 ENHANCED REPORT RECEIVED!");
        console.log("=".repeat(80));
        console.log("[Market Research] Product:", enhancedData.product_name);
        console.log("[Market Research] Industry:", enhancedData.industry);
        console.log("[Market Research] Location:", enhancedData.location);
        console.log(
          "[Market Research] Key Findings:",
          enhancedData.executive_summary?.key_findings?.length
        );
        console.log(
          "[Market Research] Competitors:",
          enhancedData.competitive_analysis?.competitors?.length
        );
        console.log(
          "[Market Research] Target Segments:",
          enhancedData.target_audience?.segments?.length
        );

        // DETAILED LOGGING - FULL RESPONSE
        console.log("\n🔍 ПОЛНЫЙ ОТВЕТ ОТ БЭКЕНДА:");
        console.log(
          "Executive Summary:",
          JSON.stringify(enhancedData.executive_summary, null, 2)
        );
        console.log(
          "\nMarket Analysis TAM:",
          enhancedData.market_analysis?.market_size?.tam_value
        );
        console.log(
          "Market Analysis SAM:",
          enhancedData.market_analysis?.market_size?.sam_value
        );
        console.log(
          "Current Trends:",
          enhancedData.market_analysis?.market_trends?.current_trends
        );
        console.log(
          "\nTarget Audience Segments:",
          enhancedData.target_audience?.segments?.length
        );
        if (enhancedData.target_audience?.segments?.[0]) {
          console.log(
            "First Segment:",
            JSON.stringify(enhancedData.target_audience.segments[0], null, 2)
          );
        }
        console.log(
          "\nDirect Competitors:",
          enhancedData.competitive_analysis?.direct_competitors?.length
        );
        if (enhancedData.competitive_analysis?.direct_competitors?.[0]) {
          console.log(
            "First Competitor:",
            JSON.stringify(
              enhancedData.competitive_analysis.direct_competitors[0],
              null,
              2
            )
          );
        }
        console.log("=".repeat(80));
        setEnhancedReport(enhancedData);
        return; // Success, exit early
      } else if (enhancedResponse.status === 404) {
        // Enhanced report not found, try old format
        console.warn(
          "Enhanced report not available (404), falling back to old format"
        );
        try {
          const response = await fetch(
            `${apiBaseUrl}/api/v1/research/${id}/report`,
            {
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setResearchReport(data.report);
          } else {
            throw new Error(
              `Failed to fetch old format report: ${response.status}`
            );
          }
        } catch (fallbackErr: any) {
          console.error(
            "[Market Research] Error fetching old format report:",
            fallbackErr
          );
          setError(
            `Не удалось получить отчет. Статус: ${enhancedResponse.status}. Проверьте, что бэкенд сервис запущен на ${apiBaseUrl}`
          );
        }
      } else {
        // Server error (500, 503, etc.) - don't try fallback
        const errorText = await enhancedResponse
          .text()
          .catch(() => "Unknown error");
        console.error(
          `[Market Research] Enhanced report error: ${enhancedResponse.status}`,
          errorText
        );
        setError(
          `Ошибка сервера при получении отчета (${enhancedResponse.status}). ` +
            `Проверьте, что бэкенд сервис маркетингового исследования запущен на ${apiBaseUrl}. ` +
            `Ошибка: ${errorText.substring(0, 200)}`
        );
      }
    } catch (err: any) {
      console.error("[Market Research] Error fetching report:", err);
      // Network error or other fetch error
      if (
        err.message?.includes("fetch") ||
        err.message?.includes("network") ||
        err.code === "ECONNREFUSED"
      ) {
        setError(
          `Не удалось подключиться к бэкенд сервису на ${apiBaseUrl}. ` +
            `Убедитесь, что сервис маркетингового исследования запущен. ` +
            `Ошибка: ${err.message || "Соединение отклонено"}`
        );
      } else {
        setError(
          `Ошибка при получении отчета: ${err.message || "Неизвестная ошибка"}`
        );
      }
    }
  };

  const handleDownload = async (format: "docx" | "pdf") => {
    if ((!enhancedReport && !researchReport) || !researchId) return;

    try {
      // Get API base URL from environment or use default
      const apiBaseUrl =
        "http://localhost:8005";

      const response = await fetch(
        `${apiBaseUrl}/api/v1/research/${researchId}/report/${format}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка загрузки ${format.toUpperCase()} файла`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `market-research-${researchId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      setError(
        err.message || `Ошибка при скачивании ${format.toUpperCase()} файла`
      );
    }
  };

  const handleReset = () => {
    setFormData({
      productName: "",
      productDescription: "",
      country: "",
      region: "",
      businessTypes: [],
      productTypes: [],
      localization: "",
      researchGoals: [],
      targetAudience: "",
      competitors: "",
    });
    setResearchId(null);
    setResearchStatus(null);
    setResearchReport(null);
    setEnhancedReport(null);
    setActiveSection("executive");
    setError(null);
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>
              <FiBarChart2
                style={{ marginRight: "1rem", verticalAlign: "middle" }}
              />
              Маркетинговое Исследование
            </h1>
            <p className={styles.heroDescription}>
              Полноценное маркетинговое исследование рынка с актуальными
              текущими данными, анализом конкурентов, сегментацией целевой
              аудитории, а также разработкой ценовой стратегии.
            </p>
          </div>
        </div>

        {error && (
          <div className={styles.errorSection}>
            <div className={styles.errorAlert}>
              <FiAlertCircle className={styles.errorIcon} size={24} />
              <div className={styles.errorContent}>
                <h3 className={styles.errorTitle}>Ошибка</h3>
                <p className={styles.errorMessage}>{error}</p>
                <button
                  className={styles.retryButton}
                  onClick={() => setError(null)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Health Status Panel */}
        {!isLoadingHealth && healthStatus && (
          <div className={styles.healthSection}>
            <div className={styles.healthCard}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏥</span>
                System Health
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.9rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: healthStatus.all_ready ? '#d4edda' : '#f8d7da',
                  color: healthStatus.all_ready ? '#155724' : '#721c24',
                  fontWeight: 500
                }}>
                  {healthStatus.all_ready ? '✓ Ready' : '✗ Not Ready'}
                </span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {healthStatus.agents.map((agent: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid',
                      borderColor: agent.ready ? '#c3e6cb' : agent.optional ? '#fff3cd' : '#f5c6cb',
                      borderRadius: '8px',
                      backgroundColor: agent.ready ? '#f7fdf9' : agent.optional ? '#fffef5' : '#fff5f6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>
                      {agent.ready ? '✅' : agent.optional ? '⚠️' : '❌'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {agent.name}
                        {agent.port && <span style={{ color: '#6c757d', fontSize: '0.85rem' }}> :{agent.port}</span>}
                        {agent.optional && <span style={{ color: '#856404', fontSize: '0.75rem', marginLeft: '0.25rem' }}>(opt.)</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: agent.ready ? '#28a745' : agent.optional ? '#856404' : '#dc3545' }}>
                        {agent.status}
                      </div>
                      {agent.error && (
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.25rem' }}>
                          {agent.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6c757d', textAlign: 'right' }}>
                Updated: {new Date(healthStatus.timestamp).toLocaleTimeString('en-US')}
              </div>
            </div>
          </div>
        )}

        {/* Warning when system is not ready */}
        {!isLoadingHealth && healthStatus && !healthStatus.all_ready && (
          <div className={styles.errorSection}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto 2rem',
              padding: '1rem',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <FiAlertCircle size={24} color="#856404" />
              <div>
                <strong style={{ color: '#856404', fontSize: '0.95rem' }}>System Not Ready</strong>
                <p style={{ margin: '0.25rem 0 0', color: '#856404', fontSize: '0.9rem' }}>
                  Some system components are unavailable. Research will only be available when all required components are ready.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2>Данные для исследования</h2>
            <p className={styles.formDescription}>
              Внесите информацию о вашей идее или проекте. Чем больше информации
              вы предоставите, тем точнее и актуальнее будет исследование рынка.
              Поля, отмеченные звездочкой (*), обязательны для заполнения.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.section}>
                <h3>Базовая информация</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Название продукта или услуги *
                  </label>
                  <input
                    ref={productNameInputRef}
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Например: Специализированная кофейня"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Описание *</label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Дайте описание продукта или услуги так, как видите его вы ..."
                    rows={4}
                    required
                  />
                </div>

                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Страна *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Например: Россия или США"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Регион (опционально)</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Например: Калининград"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Тип бизнеса * (можно выбрать несколько)</h3>
                <div className={styles.buttonGroup}>
                  {businessTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        formData.businessTypes.includes(option.value)
                          ? styles.buttonActive
                          : styles.button
                      }
                      onClick={() => handleBusinessTypeToggle(option.value)}
                    >
                      {formData.businessTypes.includes(option.value) && (
                        <FiCheck style={{ marginRight: "0.5rem" }} />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Тип продукта или услуги * (можно выбрать несколько)</h3>
                <div className={styles.buttonGroup}>
                  {productTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        formData.productTypes.includes(option.value)
                          ? styles.buttonActive
                          : styles.button
                      }
                      onClick={() => handleProductTypeToggle(option.value)}
                    >
                      {formData.productTypes.includes(option.value) && (
                        <FiCheck style={{ marginRight: "0.5rem" }} />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Локализация рынка *</h3>
                <div className={styles.buttonGroup}>
                  {localizationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        formData.localization === option.value
                          ? styles.buttonActive
                          : styles.button
                      }
                      onClick={() =>
                        handleButtonSelect("localization", option.value)
                      }
                    >
                      {formData.localization === option.value && (
                        <FiCheck style={{ marginRight: "0.5rem" }} />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Цели исследования * (можно выбрать несколько)</h3>
                <div className={styles.buttonGroup}>
                  {researchGoalOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        formData.researchGoals.includes(option.value)
                          ? styles.buttonActive
                          : styles.button
                      }
                      onClick={() => handleGoalToggle(option.value)}
                    >
                      {formData.researchGoals.includes(option.value) && (
                        <FiCheck style={{ marginRight: "0.5rem" }} />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h3>Дополнительная информация</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Целевая аудитория (опционально)
                  </label>
                  <textarea
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Опишите, как вы представляете вашу целевую аудиторию..."
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Известные конкуренты (опционально)
                  </label>
                  <input
                    type="text"
                    name="competitors"
                    value={formData.competitors}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Например: Starbucks, Местная кофейня"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !healthStatus?.all_ready}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner} />
                    Gathering and analyzing data...
                  </>
                ) : !healthStatus?.all_ready ? (
                  <>
                    <FiAlertCircle />
                    System Not Ready
                  </>
                ) : (
                  <>
                    <FiBarChart2 />
                    Start Research
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {researchStatus && researchStatus.status !== "completed" && (
          <div className={styles.progressSection}>
            <div className={styles.progressCard}>
              <h2>Выполняется исследование...</h2>
              <p className={styles.progressInfoText}>
                Исследование рынка может занять от 3 до 7 минут. Мы собираем
                данные из разных источников, проверяем их актуальность,
                анализируем и сводим в отчет.
              </p>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${researchStatus.progress || 0}%` }}
                />
              </div>
              <p className={styles.progressText}>
                {researchStatus.progress || 0}% - {researchStatus.current_stage}
              </p>
              <p className={styles.progressSubtext}>
                ID исследования: {researchId}
              </p>
            </div>
          </div>
        )}

        {enhancedReport && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <div>
                  <h2>Маркетинговый отчет</h2>
                  <p className={styles.reportSubtitle}>
                    {enhancedReport.product_name} • {enhancedReport.industry} •{" "}
                    {enhancedReport.location}
                  </p>
                </div>
              </div>

              <div className={styles.resultsBody}>
                {/* MESSAGE: REPORT READY */}
                <div className={styles.section}>
                  <p style={{ fontSize: '1.2rem', textAlign: 'center', padding: '3rem', color: '#1e6078', fontWeight: 500 }}>
                    ✅ Your market research report has been successfully generated!<br /><br />
                    Download the full report in DOCX or PDF format below.
                  </p>
                </div>

                {/* ALL REPORT SECTIONS HIDDEN - AVAILABLE FOR DOWNLOAD ONLY */}
                <div style={{ display: 'none' }}>
                {/* Executive Summary Section */}
                <div className={styles.section}>
                  <h3>Резюме исследования</h3>

                  {/* Метрики исследования */}
                  {researchDuration && (
                    <div className={styles.subsection}>
                      <div className={styles.researchMetrics}>
                        <div className={styles.metricItem}>
                          <strong>Длительность исследования:</strong>{" "}
                          {researchDuration.minutes} мин{" "}
                          {researchDuration.seconds} сек
                        </div>
                        {enhancedReport.raw_research_data && (
                          <>
                            {Object.keys(enhancedReport.raw_research_data)
                              .length > 0 && (
                              <div className={styles.metricItem}>
                                <strong>Обработано источников:</strong>{" "}
                                {Object.values(
                                  enhancedReport.raw_research_data
                                ).reduce((acc: number, section: any) => {
                                  const results = section?.results || [];
                                  return (
                                    acc +
                                    results.reduce(
                                      (sum: number, r: any) =>
                                        sum + (r?.sources?.length || 0),
                                      0
                                    )
                                  );
                                }, 0)}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.subsection}>
                    <h4>Заданные цели исследования</h4>
                    <ul className={styles.bulletList}>
                      {enhancedReport.executive_summary.research_objectives.map(
                        (obj, idx) => (
                          <li key={idx}>{obj}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Ключевые находки</h4>
                    <div className={styles.keyFindingsGrid}>
                      {enhancedReport.executive_summary.key_findings.map(
                        (finding, idx) => (
                          <div key={idx} className={styles.findingCard}>
                            <span className={styles.findingNumber}>
                              {idx + 1}
                            </span>
                            <p>{finding}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Стратегические рекомендации</h4>
                    <ul className={styles.bulletList}>
                      {enhancedReport.executive_summary.strategic_recommendations.map(
                        (rec, idx) => (
                          <li key={idx}>{rec}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Обзор рыночных возможностей</h4>
                    <p className={styles.summaryText}>
                      {
                        enhancedReport.executive_summary
                          .market_opportunity_summary
                      }
                    </p>
                  </div>
                </div>

                {/* Market Analysis Section */}
                <div className={styles.section}>
                  <h3>Анализ рынка</h3>

                  <div className={styles.subsection}>
                    <h4>Размер рынка</h4>
                    <div className={styles.marketSizeGrid}>
                      {enhancedReport.market_analysis.market_size.tam_value && (
                        <div className={styles.metricCard}>
                          <h5>Общий доступный рынок (TAM)</h5>
                          <p className={styles.metricValue}>
                            {
                              enhancedReport.market_analysis.market_size
                                .tam_value
                            }
                          </p>
                          <p className={styles.metricDescription}>
                            {
                              enhancedReport.market_analysis.market_size
                                .tam_description
                            }
                          </p>
                        </div>
                      )}
                      {enhancedReport.market_analysis.market_size.sam_value && (
                        <div className={styles.metricCard}>
                          <h5>Обслуживаемый доступный рынок (SAM)</h5>
                          <p className={styles.metricValue}>
                            {
                              enhancedReport.market_analysis.market_size
                                .sam_value
                            }
                          </p>
                          <p className={styles.metricDescription}>
                            {
                              enhancedReport.market_analysis.market_size
                                .sam_description
                            }
                          </p>
                        </div>
                      )}
                      {enhancedReport.market_analysis.market_size.som_value && (
                        <div className={styles.metricCard}>
                          <h5>Достижимая доля рынка (SOM)</h5>
                          <p className={styles.metricValue}>
                            {
                              enhancedReport.market_analysis.market_size
                                .som_value
                            }
                          </p>
                          <p className={styles.metricDescription}>
                            {
                              enhancedReport.market_analysis.market_size
                                .som_description
                            }
                          </p>
                        </div>
                      )}
                    </div>
                    {enhancedReport.market_analysis.market_size.growth_rate && (
                      <p className={styles.growthRate}>
                        <strong>Темп роста:</strong>{" "}
                        {enhancedReport.market_analysis.market_size.growth_rate}
                      </p>
                    )}
                  </div>

                  <div className={styles.subsection}>
                    <h4>Рыночные тренды</h4>
                    <div className={styles.trendsGrid}>
                      <div className={styles.trendCard}>
                        <h5>Текущие тренды</h5>
                        <ul>
                          {enhancedReport.market_analysis.market_trends.current_trends?.map(
                            (trend, idx) => <li key={idx}>{trend}</li>
                          ) || <li>Нет данных</li>}
                        </ul>
                      </div>
                      <div className={styles.trendCard}>
                        <h5>Драйверы роста</h5>
                        <ul>
                          {enhancedReport.market_analysis.market_trends.growth_drivers?.map(
                            (driver, idx) => <li key={idx}>{driver}</li>
                          ) || <li>Нет данных</li>}
                        </ul>
                      </div>
                      <div className={styles.trendCard}>
                        <h5>Барьеры рынка</h5>
                        <ul>
                          {enhancedReport.market_analysis.market_trends.market_barriers?.map(
                            (barrier, idx) => <li key={idx}>{barrier}</li>
                          ) || <li>Нет данных</li>}
                        </ul>
                      </div>
                      <div className={styles.trendCard}>
                        <h5>Прогноз развития</h5>
                        <p>
                          {enhancedReport.market_analysis.market_trends
                            .future_outlook || "Нет данных"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {enhancedReport.market_analysis.market_maturity && (
                    <div className={styles.subsection}>
                      <h4>Зрелость рынка</h4>
                      <p className={styles.summaryText}>
                        {enhancedReport.market_analysis.market_maturity}
                      </p>
                    </div>
                  )}

                  {enhancedReport.market_analysis.regulatory_environment && (
                    <div className={styles.subsection}>
                      <h4>Регуляторная среда</h4>
                      <p className={styles.summaryText}>
                        {enhancedReport.market_analysis.regulatory_environment}
                      </p>
                    </div>
                  )}
                </div>

                {/* Target Audience Section */}
                <div className={styles.section}>
                  <h3>Анализ целевой аудитории</h3>

                  <div className={styles.subsection}>
                    <h4>Сегменты целевой аудитории</h4>
                    <div className={styles.segmentsGrid}>
                      {enhancedReport.target_audience.segments.map(
                        (segment, idx) => (
                          <div key={idx} className={styles.segmentCard}>
                            <div className={styles.segmentHeader}>
                              <h5>{segment.segment_name}</h5>
                              {segment.priority && (
                                <span
                                  className={`${styles.priorityBadge} ${
                                    styles[`priority${segment.priority}`]
                                  }`}
                                >
                                  Приоритет: {segment.priority}
                                </span>
                              )}
                            </div>
                            {segment.segment_size && (
                              <p className={styles.segmentSize}>
                                <strong>Размер:</strong> {segment.segment_size}
                              </p>
                            )}

                            <div className={styles.segmentDetails}>
                              {segment.demographics.length > 0 && (
                                <div>
                                  <h6>Демография</h6>
                                  <ul>
                                    {segment.demographics.map((demo, i) => (
                                      <li key={i}>{demo}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {segment.psychographics.length > 0 && (
                                <div>
                                  <h6>Психография</h6>
                                  <ul>
                                    {segment.psychographics.map((psycho, i) => (
                                      <li key={i}>{psycho}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {segment.behaviors.length > 0 && (
                                <div>
                                  <h6>Поведение</h6>
                                  <ul>
                                    {segment.behaviors.map((behavior, i) => (
                                      <li key={i}>{behavior}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {segment.pain_points.length > 0 && (
                                <div>
                                  <h6>Болевые точки</h6>
                                  <ul>
                                    {segment.pain_points.map((pain, i) => (
                                      <li key={i}>{pain}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {segment.needs.length > 0 && (
                                <div>
                                  <h6>Потребности</h6>
                                  <ul>
                                    {segment.needs.map((need, i) => (
                                      <li key={i}>{need}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {segment.buying_motivations.length > 0 && (
                                <div>
                                  <h6>Мотивация к покупке</h6>
                                  <ul>
                                    {segment.buying_motivations.map(
                                      (mot, i) => (
                                        <li key={i}>{mot}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {enhancedReport.target_audience.customer_journey && (
                    <div className={styles.subsection}>
                      <h4>Путь клиента (Customer Journey)</h4>
                      <p className={styles.summaryText}>
                        {enhancedReport.target_audience.customer_journey}
                      </p>
                    </div>
                  )}

                  {enhancedReport.target_audience.decision_making_process && (
                    <div className={styles.subsection}>
                      <h4>Процесс принятия решения</h4>
                      <p className={styles.summaryText}>
                        {enhancedReport.target_audience.decision_making_process}
                      </p>
                    </div>
                  )}
                </div>

                {/* Competitive Analysis Section */}
                <div className={styles.section}>
                  <h3>Конкурентный анализ</h3>

                  <div className={styles.subsection}>
                    <h4>Обзор конкурентного ландшафта</h4>
                    <p className={styles.summaryText}>
                      {
                        enhancedReport.competitive_analysis
                          .competitive_landscape_overview
                      }
                    </p>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Прямые конкуренты</h4>
                    <div className={styles.competitorsGrid}>
                      {enhancedReport.competitive_analysis.direct_competitors.map(
                        (comp: CompetitorProfile, idx: number) => (
                          <div key={idx} className={styles.competitorCard}>
                            <div className={styles.competitorHeader}>
                              <h5>{comp.name}</h5>
                              <span
                                className={`${styles.competitorTypeBadge} ${
                                  styles[comp.competitor_type]
                                }`}
                              >
                                {comp.competitor_type}
                              </span>
                            </div>

                            {comp.market_position && (
                              <p className={styles.marketPosition}>
                                <strong>Позиция:</strong> {comp.market_position}
                              </p>
                            )}
                            {comp.market_share && (
                              <p className={styles.marketShare}>
                                <strong>Доля рынка:</strong> {comp.market_share}
                              </p>
                            )}

                            <div className={styles.competitorDetails}>
                              {comp.strengths.length > 0 && (
                                <div>
                                  <h6>Сильные стороны</h6>
                                  <ul>
                                    {comp.strengths.map(
                                      (str: string, i: number) => (
                                        <li key={i}>{str}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                              {comp.weaknesses.length > 0 && (
                                <div>
                                  <h6>Слабые стороны</h6>
                                  <ul>
                                    {comp.weaknesses.map(
                                      (weak: string, i: number) => (
                                        <li key={i}>{weak}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                              {comp.products_services.length > 0 && (
                                <div>
                                  <h6>Продукты/услуги</h6>
                                  <ul>
                                    {comp.products_services.map(
                                      (prod: string, i: number) => (
                                        <li key={i}>{prod}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                              {comp.pricing && (
                                <p>
                                  <strong>Ценообразование:</strong>{" "}
                                  {comp.pricing}
                                </p>
                              )}
                              {comp.unique_value_proposition && (
                                <p>
                                  <strong>
                                    Уникальное ценностное предложение:
                                  </strong>{" "}
                                  {comp.unique_value_proposition}
                                </p>
                              )}
                              {(comp.website ||
                                (comp.social_links &&
                                  comp.social_links.length > 0)) && (
                                <div
                                  style={{
                                    marginTop: "1rem",
                                    paddingTop: "1rem",
                                    borderTop: "1px solid #e2e8f0",
                                  }}
                                >
                                  <h6 style={{ marginBottom: "0.5rem" }}>
                                    Ссылки
                                  </h6>
                                  {comp.website && (
                                    <p style={{ margin: "0.25rem 0" }}>
                                      <strong>Сайт:</strong>{" "}
                                      <a
                                        href={comp.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#1e6078" }}
                                      >
                                        {comp.website}
                                      </a>
                                    </p>
                                  )}
                                  {comp.social_links &&
                                    comp.social_links.length > 0 && (
                                      <div style={{ margin: "0.5rem 0" }}>
                                        <strong>Соцсети:</strong>
                                        <ul
                                          style={{
                                            margin: "0.25rem 0",
                                            paddingLeft: "1.5rem",
                                          }}
                                        >
                                          {comp.social_links.map(
                                            (link: string, i: number) => (
                                              <li key={i}>
                                                <a
                                                  href={link}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  style={{ color: "#1e6078" }}
                                                >
                                                  {link}
                                                </a>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {enhancedReport.competitive_analysis.indirect_competitors
                    .length > 0 && (
                    <div className={styles.subsection}>
                      <h4>Косвенные конкуренты</h4>
                      <div className={styles.competitorsGrid}>
                        {enhancedReport.competitive_analysis.indirect_competitors.map(
                          (comp: CompetitorProfile, idx: number) => (
                            <div key={idx} className={styles.competitorCard}>
                              <div className={styles.competitorHeader}>
                                <h5>{comp.name}</h5>
                                <span
                                  className={`${styles.competitorTypeBadge} ${
                                    styles[comp.competitor_type]
                                  }`}
                                >
                                  {comp.competitor_type}
                                </span>
                              </div>
                              {comp.market_position && (
                                <p className={styles.marketPosition}>
                                  <strong>Позиция:</strong>{" "}
                                  {comp.market_position}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {enhancedReport.competitive_analysis.swot && (
                    <div className={styles.subsection}>
                      <h4>SWOT Анализ</h4>
                      <div className={styles.swotGrid}>
                        <div className={styles.swotCard}>
                          <h5>Сильные стороны</h5>
                          <ul>
                            {enhancedReport.competitive_analysis.swot.strengths.map(
                              (str: string, idx: number) => (
                                <li key={idx}>{str}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className={styles.swotCard}>
                          <h5>Слабые стороны</h5>
                          <ul>
                            {enhancedReport.competitive_analysis.swot.weaknesses.map(
                              (weak: string, idx: number) => (
                                <li key={idx}>{weak}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className={styles.swotCard}>
                          <h5>Возможности</h5>
                          <ul>
                            {enhancedReport.competitive_analysis.swot.opportunities.map(
                              (opp: string, idx: number) => (
                                <li key={idx}>{opp}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className={styles.swotCard}>
                          <h5>Угрозы</h5>
                          <ul>
                            {enhancedReport.competitive_analysis.swot.threats.map(
                              (threat: string, idx: number) => (
                                <li key={idx}>{threat}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.twoColumnGrid}>
                    <div className={styles.subsection}>
                      <h4>Конкурентные преимущества</h4>
                      <ul className={styles.bulletList}>
                        {enhancedReport.competitive_analysis.competitive_advantages.map(
                          (adv: string, idx: number) => (
                            <li key={idx}>{adv}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className={styles.subsection}>
                      <h4>Рыночные ниши</h4>
                      <ul className={styles.bulletList}>
                        {enhancedReport.competitive_analysis.market_gaps.map(
                          (gap: string, idx: number) => (
                            <li key={idx}>{gap}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pricing Analysis Section */}
                <div className={styles.section}>
                  <h3>Ценовой анализ</h3>

                  {enhancedReport.pricing_analysis.market_price_range && (
                    <div className={styles.subsection}>
                      <h4>Диапазон цен на рынке</h4>
                      <p className={styles.summaryText}>
                        {enhancedReport.pricing_analysis.market_price_range}
                      </p>
                    </div>
                  )}

                  <div className={styles.subsection}>
                    <h4>Цены конкурентов</h4>
                    <div className={styles.pricingTable}>
                      <table>
                        <thead>
                          <tr>
                            <th>Конкурент</th>
                            <th>Диапазон цен</th>
                            <th>Модель ценообразования</th>
                            <th>Ценностное предложение</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enhancedReport.pricing_analysis.competitive_pricing.map(
                            (price, idx) => (
                              <tr key={idx}>
                                <td>{price.competitor_name}</td>
                                <td>{price.price_range}</td>
                                <td>{price.pricing_model}</td>
                                <td>{price.value_proposition}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Стратегии ценообразования</h4>
                    <ul className={styles.bulletList}>
                      {enhancedReport.pricing_analysis.pricing_strategies.map(
                        (strategy, idx) => (
                          <li key={idx}>{strategy}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {enhancedReport.pricing_analysis.recommended_pricing && (
                    <div className={styles.subsection}>
                      <h4>Рекомендуемая цена</h4>
                      <p className={styles.summaryText}>
                        {enhancedReport.pricing_analysis.recommended_pricing}
                      </p>
                    </div>
                  )}

                  {enhancedReport.pricing_analysis
                    .price_sensitivity_analysis && (
                    <div className={styles.subsection}>
                      <h4>Анализ чувствительности к цене</h4>
                      <p className={styles.summaryText}>
                        {
                          enhancedReport.pricing_analysis
                            .price_sensitivity_analysis
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Strategic Recommendations Section */}
                <div className={styles.section}>
                  <h3>Стратегические рекомендации</h3>

                  <div className={styles.subsection}>
                    <h4>Позиционирование</h4>
                    <p className={styles.summaryText}>
                      {
                        enhancedReport.strategic_recommendations
                          .positioning_statement
                      }
                    </p>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Стратегия выхода на рынок</h4>
                    <p className={styles.summaryText}>
                      {
                        enhancedReport.strategic_recommendations
                          .go_to_market_strategy
                      }
                    </p>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Маркетинговые каналы</h4>
                    <ul className={styles.bulletList}>
                      {enhancedReport.strategic_recommendations.marketing_channels?.map(
                        (channel, idx) => <li key={idx}>{channel}</li>
                      ) || <li>Нет данных</li>}
                    </ul>
                  </div>

                  <div className={styles.subsection}>
                    <h4>Метрики успеха (KPI)</h4>
                    <ul className={styles.bulletList}>
                      {enhancedReport.strategic_recommendations.success_metrics?.map(
                        (metric, idx) => <li key={idx}>{metric}</li>
                      ) || <li>Нет данных</li>}
                    </ul>
                  </div>

                  <div className={styles.subsection}>
                    <h4>План действий</h4>
                    <div className={styles.actionPlanGrid}>
                      {enhancedReport.strategic_recommendations.action_plan.map(
                        (action, idx) => (
                          <div key={idx} className={styles.actionCard}>
                            <div className={styles.actionHeader}>
                              <span
                                className={`${styles.priorityBadge} ${
                                  styles[`priority${action.priority}`]
                                }`}
                              >
                                Приоритет: {action.priority}
                              </span>
                              <span className={styles.timeline}>
                                {action.timeline}
                              </span>
                            </div>
                            <p className={styles.actionText}>{action.action}</p>
                            {action.responsible && (
                              <p className={styles.responsible}>
                                <strong>Ответственный:</strong>{" "}
                                {action.responsible}
                              </p>
                            )}
                            {action.expected_outcome && (
                              <p className={styles.outcome}>
                                <strong>Ожидаемый результат:</strong>{" "}
                                {action.expected_outcome}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                </div> {/* End of hidden block */}

                {/* DOWNLOAD BUTTONS */}
                <div className={styles.section}>
                  <div className={styles.downloadButtons}>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("docx")}
                    >
                      <FiFile /> Скачать в DOCX
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("pdf")}
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      <FiDownload /> Скачать в PDF
                    </button>
                  </div>
                </div>
                <div className={styles.resetSection}>
                  <button className={styles.resetButton} onClick={handleReset}>
                    <FiRefreshCw /> Исследовать еще раз
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {researchReport && !enhancedReport && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <h2>Market Research Report</h2>
              </div>
              <div className={styles.resultsBody}>
                {/* СООБЩЕНИЕ: ОТЧЕТ ГОТОВ */}
                <div className={styles.section}>
                  <p style={{ fontSize: '1.2rem', textAlign: 'center', padding: '3rem', color: '#1e6078', fontWeight: 500 }}>
                    ✅ Your market research report has been successfully generated!<br /><br />
                    Download the full report in DOCX or PDF format below.
                  </p>
                </div>

                {/* КНОПКИ СКАЧИВАНИЯ */}
                <div className={styles.section}>
                  <div className={styles.downloadButtons}>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("docx")}
                    >
                      <FiFile /> Download DOCX
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("pdf")}
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      <FiDownload /> Download PDF
                    </button>
                  </div>
                </div>
                <div className={styles.resetSection}>
                  <button className={styles.resetButton} onClick={handleReset}>
                    <FiRefreshCw /> Research Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.disclaimer}>
          <p>
            <strong>Важно:</strong> Это тестовая версия сервиса. Результаты
            могут быть неполными. Сервис использует AI-агенты, живой поиск для
            сбора и проверки данных.
          </p>
        </div>
      </main>
    </div>
  );
}
