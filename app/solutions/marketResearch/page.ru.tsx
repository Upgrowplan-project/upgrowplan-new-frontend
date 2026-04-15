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
type OfferingType = "product" | "service" | "hybrid";
type OfferingSubType =
  | "physical"
  | "digital"
  | "one_time"
  | "subscription"
  | "hourly"
  | "product_plus_service";
type PriceSegment = "budget" | "mid" | "premium";
type RevenueRange =
  | "under_1m"
  | "1m_10m"
  | "10m_50m"
  | "50m_500m"
  | "over_500m";
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
  | "wellness_fitness"
  | "beauty_personal_care"
  | "home_services"
  | "legal_services"
  | "pet_services"
  // Медиа и развлечения
  | "entertainment_media"
  // Недвижимость
  | "real_estate"
  // Транспорт
  | "transport_mobility"
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
  // Тип предложения
  offeringType: OfferingType | "";
  offeringSubType: OfferingSubType | "";
  // Ценовой сегмент
  priceSegment: PriceSegment | "";
  // Стадия бизнеса
  isExistingBusiness: boolean;
  annualRevenueRange: RevenueRange | "";
  yearsOperating: string;
  // Дополнительные поля
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
  const LAST_REQUEST_FORM_DATA_KEY = "marketResearch:lastRequestFormData:ru";

  const defaultFormData: FormData = {
    productName: "",
    productDescription: "",
    country: "",
    region: "",
    businessTypes: [],
    productTypes: [],
    localization: "",
    researchGoals: [],
    offeringType: "",
    offeringSubType: "",
    priceSegment: "",
    isExistingBusiness: false,
    annualRevenueRange: "",
    yearsOperating: "",
    targetAudience: "",
    competitors: "",
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);

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
  const [isResearchPaused, setIsResearchPaused] = useState(false);
  const isCompletedView = Boolean(enhancedReport || researchReport);

  const buildCompletionSubtitle = () => {
    const productName =
      enhancedReport?.product_name || formData.productName || "Маркетинговый отчет";
    const fullDesc =
      (formData.productDescription || enhancedReport?.industry || "").trim();
    const location =
      enhancedReport?.location ||
      [formData.region, formData.country].filter(Boolean).join(", ");

    const shortDesc = fullDesc ? fullDesc.split(".")[0].trim() : "";
    const left = `${productName}${fullDesc ? " " + fullDesc : ""}`.trim();
    const middle = `${productName}${shortDesc ? " " + shortDesc : ""}`.trim();
    const right = location || "";

    return [left, middle, right].filter(Boolean).join(" • ");
  };

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
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"docx" | "pdf" | null>(null);

  // Ref для хранения polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTokenRef = useRef<string | null>(null);

  // Автофокус на первое поле формы и предотвращение автоскролла
  useEffect(() => {
    // Скроллим страницу в начало
    window.scrollTo(0, 0);

    // Устанавливаем фокус на первое поле формы
    if (productNameInputRef.current) {
      productNameInputRef.current.focus();
    }

    // Cleanup: очистка polling interval при unmount
    return () => {
      if (pollingIntervalRef.current) {
        console.log("[Market Research] Cleaning up polling interval on unmount");
        clearTimeout(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      pollingTokenRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(LAST_REQUEST_FORM_DATA_KEY);
      if (!savedRaw) return;

      const saved = JSON.parse(savedRaw) as FormData;
      if (saved && typeof saved === "object") {
        setFormData((prev) => ({ ...prev, ...saved }));
      }
    } catch (e) {
      console.warn("Не удалось восстановить данные последнего запроса:", e);
    }
  }, []);

  const fetchHealthStatus = async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setIsRefreshingHealth(true);
      }
      // HARDCODED FOR NOW - env var not working
      const healthApiBaseUrl = "http://localhost:8005";
      console.log("[Health Check] Fetching from:", `${healthApiBaseUrl}/api/v1/agents/health`);
      const response = await fetch(`${healthApiBaseUrl}/api/v1/agents/health`);

      if (response.ok) {
        const data = await response.json();
        console.log("[Health Check] ✅ Data received:", data);
        setHealthStatus(data);
        console.log("[Health Check] State updated, isLoading will be set to false");
      } else {
        console.error("[Health Check] Failed to fetch health status:", response.status);
      }
    } catch (error) {
      console.error("[Health Check] Error fetching health status:", error);
    } finally {
      setIsLoadingHealth(false);
      if (manualRefresh) {
        setIsRefreshingHealth(false);
      }
      console.log("[Health Check] isLoadingHealth set to false");
    }
  };

  // Load health status on mount and refresh every 30 seconds
  useEffect(() => {

    // Fetch immediately
    console.log("[Health Check] Component mounted, starting fetch...");
    fetchHealthStatus(false);

    // Refresh every 30 seconds
    const interval = setInterval(() => fetchHealthStatus(false), 30000);

    return () => clearInterval(interval);
  }, []);

  // Watchdog: if polling missed transition to completed, force-sync by research_id.
  useEffect(() => {
    if (!researchId || enhancedReport || researchReport || isResearchPaused) return;
    if (!isSubmitting && researchStatus?.status !== "in_progress" && researchStatus?.status !== "pending") return;

    const apiBaseUrl = "http://localhost:8005";
    const watchdog = setInterval(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/research/${researchId}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        if (!response.ok) return;
        const status: ResearchStatus = await response.json();
        setResearchStatus(status);

        if (status.status === "completed") {
          if (pollingIntervalRef.current) {
            clearTimeout(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          pollingTokenRef.current = null;
          setIsSubmitting(false);
          await fetchResearchReport(researchId);
        } else if (status.status === "failed") {
          setIsSubmitting(false);
          setIsResearchPaused(false);
          setError(
            `Исследование не удалось выполнить: ${
              status.error || status.current_stage || "Неизвестная ошибка"
            }`
          );
        }
      } catch {
        // ignore watchdog errors; main polling handles retries/logging
      }
    }, 10000);

    return () => clearInterval(watchdog);
  }, [researchId, enhancedReport, researchReport, isSubmitting, isResearchPaused, researchStatus?.status]);

  const productTypeToIndustry: Record<ProductType, string> = {
    retail_fmcg: "Розница и FMCG",
    fashion_apparel: "Мода и одежда",
    electronics: "Техника и электроника",
    food_beverage: "Food & Beverage",
    digital_apps: "Цифровые приложения",
    manufacturing: "Производство",
    wholesale_trade: "Оптовая торговля",
    corporate_solutions: "Корпоративные решения",
    business_tech: "Технологии для бизнеса",
    marketplace: "Маркетплейс / Платформа",
    p2p_platform: "P2P Платформа",
    saas_b2b: "B2B SaaS",
    saas_b2c: "B2C SaaS",
    cloud_platform: "Облачная платформа",
    industrial_equipment: "Промышленное оборудование",
    logistics: "Логистика",
    construction: "Строительство",
    energy: "Энергетика",
    agriculture: "Сельское хозяйство",
    consulting: "Консалтинг",
    healthcare: "Медицина",
    education: "Образование",
    tourism_hospitality: "Туризм и гостиничный бизнес",
    financial_services: "Финансовые услуги",
    horeca: "HoReCa",
    professional_services: "Профессиональные услуги",
    wellness_fitness: "Фитнес и Велнес",
    beauty_personal_care: "Красота и уход",
    home_services: "Дом и быт",
    legal_services: "Юридические услуги",
    pet_services: "Зоотовары и ветеринария",
    entertainment_media: "Развлечения и медиа",
    real_estate: "Недвижимость",
    transport_mobility: "Транспорт и мобильность",
    other: "Другое",
  };

  const offeringTypeOptions = [
    { value: "product" as OfferingType, label: "Продукт", desc: "Физический или цифровой товар" },
    { value: "service" as OfferingType, label: "Услуга", desc: "Почасовая, разовая или подписка" },
    { value: "hybrid" as OfferingType, label: "Гибрид", desc: "Продукт + услуга (кофейня, клиника)" },
  ];

  const offeringSubTypeOptions: Record<OfferingType, { value: OfferingSubType; label: string }[]> = {
    product: [
      { value: "physical", label: "Физический товар" },
      { value: "digital", label: "Цифровой продукт" },
    ],
    service: [
      { value: "one_time", label: "Разовая услуга" },
      { value: "subscription", label: "Подписка / абонемент" },
      { value: "hourly", label: "Почасовая оплата" },
    ],
    hybrid: [
      { value: "product_plus_service", label: "Товар + сопровождение" },
    ],
  };

  const priceSegmentOptions = [
    { value: "budget" as PriceSegment, label: "Эконом", desc: "Масс-маркет, низкий ценовой сегмент" },
    { value: "mid" as PriceSegment, label: "Средний", desc: "Средний ценовой сегмент" },
    { value: "premium" as PriceSegment, label: "Премиум", desc: "Премиум и люкс" },
  ];

  const revenueRangeOptions = [
    { value: "under_1m" as RevenueRange, label: "До 1 млн ₽/год" },
    { value: "1m_10m" as RevenueRange, label: "1–10 млн ₽/год" },
    { value: "10m_50m" as RevenueRange, label: "10–50 млн ₽/год" },
    { value: "50m_500m" as RevenueRange, label: "50–500 млн ₽/год" },
    { value: "over_500m" as RevenueRange, label: "Свыше 500 млн ₽/год" },
  ];

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

  const productTypeOptions: { value: ProductType; label: string; category: string }[] = [
    // Розница и потребительские товары
    { value: "retail_fmcg",        label: "Розница и FMCG",                  category: "Розница" },
    { value: "fashion_apparel",    label: "Мода и одежда",                   category: "Розница" },
    { value: "electronics",        label: "Техника и электроника",            category: "Розница" },
    { value: "food_beverage",      label: "Продукты питания и напитки",       category: "Розница" },
    // HoReCa
    { value: "horeca",             label: "HoReCa (кафе, рестораны, отели)", category: "HoReCa" },
    { value: "tourism_hospitality",label: "Туризм и гостиничный бизнес",     category: "HoReCa" },
    // Велнес и красота
    { value: "wellness_fitness",   label: "Фитнес и Велнес",                 category: "Велнес и красота" },
    { value: "beauty_personal_care",label: "Красота и уход",                 category: "Велнес и красота" },
    { value: "healthcare",         label: "Медицина и клиники",              category: "Велнес и красота" },
    { value: "pet_services",       label: "Зоотовары и ветеринария",         category: "Велнес и красота" },
    // Образование и профессии
    { value: "education",          label: "Образование",                     category: "Образование и услуги" },
    { value: "consulting",         label: "Консалтинг",                      category: "Образование и услуги" },
    { value: "professional_services", label: "Профессиональные услуги",      category: "Образование и услуги" },
    { value: "legal_services",     label: "Юридические услуги",              category: "Образование и услуги" },
    // Дом и быт
    { value: "home_services",      label: "Дом и быт (клининг, ремонт)",     category: "Дом и быт" },
    { value: "real_estate",        label: "Недвижимость",                    category: "Дом и быт" },
    { value: "construction",       label: "Строительство",                   category: "Дом и быт" },
    // Цифровые продукты
    { value: "digital_apps",       label: "Цифровые приложения (B2C)",       category: "Цифровые продукты" },
    { value: "saas_b2b",           label: "B2B SaaS",                        category: "Цифровые продукты" },
    { value: "saas_b2c",           label: "B2C SaaS",                        category: "Цифровые продукты" },
    { value: "cloud_platform",     label: "Облачная платформа",              category: "Цифровые продукты" },
    { value: "marketplace",        label: "Маркетплейс / Платформа",         category: "Цифровые продукты" },
    { value: "p2p_platform",       label: "P2P платформа",                   category: "Цифровые продукты" },
    { value: "entertainment_media",label: "Развлечения и медиа",             category: "Цифровые продукты" },
    // B2B и промышленность
    { value: "manufacturing",      label: "Производство",                    category: "B2B и промышленность" },
    { value: "wholesale_trade",    label: "Оптовая торговля",                category: "B2B и промышленность" },
    { value: "corporate_solutions",label: "Корпоративные решения",           category: "B2B и промышленность" },
    { value: "business_tech",      label: "Технологии для бизнеса",          category: "B2B и промышленность" },
    { value: "industrial_equipment",label: "Промышленное оборудование",      category: "B2B и промышленность" },
    { value: "logistics",          label: "Логистика",                       category: "B2B и промышленность" },
    { value: "energy",             label: "Энергетика",                      category: "B2B и промышленность" },
    { value: "agriculture",        label: "Сельское хозяйство",              category: "B2B и промышленность" },
    { value: "transport_mobility", label: "Транспорт и мобильность",         category: "B2B и промышленность" },
    // Финансы
    { value: "financial_services", label: "Финансовые услуги",               category: "Финансы" },
    // Общее
    { value: "other",              label: "Другое",                          category: "Другое" },
  ];

  // Grouped structure for the multi-select panel
  const productTypesByCategory = productTypeOptions.reduce<Record<string, typeof productTypeOptions>>(
    (acc, opt) => {
      if (!acc[opt.category]) acc[opt.category] = [];
      acc[opt.category].push(opt);
      return acc;
    },
    {}
  );

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
    setIsResearchPaused(false);
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
      setError("Пожалуйста, заполните все обязательные поля");
      setIsSubmitting(false);
      return;
    }

    // CRITICAL: Health check BEFORE starting research
    console.log("[HEALTH CHECK] Проверка всех компонентов системы перед запуском исследования...");
    // HARDCODED FOR NOW - env var not working
    const healthApiBaseUrl = "http://localhost:8005";

    try {
      const healthResponse = await fetch(`${healthApiBaseUrl}/api/v1/agents/health`);

      if (!healthResponse.ok) {
        throw new Error(`Проверка здоровья системы не удалась: HTTP ${healthResponse.status}`);
      }

      const healthData = await healthResponse.json();
      console.log("[HEALTH CHECK] Ответ:", healthData);

      if (!healthData.all_ready) {
        // Найти компоненты, которые не работают
        const failedComponents = healthData.agents
          .filter((agent: any) => !agent.ready && !agent.optional)
          .map((agent: any) => `${agent.name}: ${agent.error || 'offline'}`)
          .join('\n');

        setError(
          `❌ Система не готова к запуску исследования!\n\n` +
          `Следующие компоненты недоступны:\n${failedComponents}\n\n` +
          `Пожалуйста, убедитесь что все сервисы запущены и повторите попытку.`
        );
        setIsSubmitting(false);
        console.error("[HEALTH CHECK] Система не готова:", failedComponents);
        return;
      }

      console.log("[HEALTH CHECK] ✓ Все критические компоненты готовы!");

    } catch (healthError) {
      console.error("[HEALTH CHECK] Ошибка:", healthError);
      setError(
        `❌ Не удалось проверить готовность системы: ${healthError instanceof Error ? healthError.message : String(healthError)}\n\n` +
        `Убедитесь что Market Research Service запущен на порту 8005.`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      try {
        localStorage.setItem(LAST_REQUEST_FORM_DATA_KEY, JSON.stringify(formData));
      } catch (e) {
        console.warn("Не удалось сохранить данные последнего запроса:", e);
      }

      // Parse competitors string → array
      const competitorsList = formData.competitors
        ? formData.competitors.split(",").map((c) => c.trim()).filter(Boolean)
        : undefined;

      // Derive industry from selected product type (first selected)
      const primaryProductType = formData.productTypes[0];
      const industryStr = productTypeToIndustry[primaryProductType] ?? primaryProductType;

      // Build ResearchRequest directly — no onboarding mapper indirection
      const requestData: Record<string, unknown> = {
        product_name: formData.productName,
        product_description: formData.productDescription,
        country: formData.country,
        ...(formData.region ? { region: formData.region } : {}),
        // business_type: API expects single value; take first selected
        business_type: formData.businessTypes[0],
        // product_type: same — take first selected
        product_type: primaryProductType,
        localization: formData.localization,
        industry: industryStr,
        research_goals: formData.researchGoals,
        // Offering & pricing (optional — omit if not set)
        ...(formData.offeringType ? { offering_type: formData.offeringType } : {}),
        ...(formData.offeringSubType ? { offering_sub_type: formData.offeringSubType } : {}),
        ...(formData.priceSegment ? { price_segment: formData.priceSegment } : {}),
        // Business stage
        is_existing_business: formData.isExistingBusiness,
        ...(formData.isExistingBusiness && formData.annualRevenueRange
          ? { annual_revenue_range: formData.annualRevenueRange }
          : {}),
        ...(formData.isExistingBusiness && formData.yearsOperating
          ? { years_operating: parseInt(formData.yearsOperating, 10) }
          : {}),
        // Optional extras
        ...(formData.targetAudience ? { target_audience_description: formData.targetAudience } : {}),
        ...(competitorsList && competitorsList.length > 0 ? { competitors: competitorsList } : {}),
      };

      console.log(
        "[Market Research] Sending request to market-research-service (direct)..."
      );
      console.log("[Market Research] Request data:", requestData);

      // Get API base URL from environment or use default
      // HARDCODED FOR NOW - env var not working
      const apiBaseUrl = "http://localhost:8005";

      const response = await fetch(
        `${apiBaseUrl}/api/v1/research/direct`,
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

      // ===== LOG AGENTS STATUS =====
      if (result.agents_status) {
        console.log("=" .repeat(80));
        console.log("🔍 AGENT HEALTH CHECK RESULTS:");
        console.log("=" .repeat(80));

        result.agents_status.agents.forEach((agent: any) => {
          const statusEmoji = agent.ready ? "✅" : "❌";
          console.log(
            `${statusEmoji} ${agent.name} (port ${agent.port}): ${agent.status}`
          );
          if (agent.error) {
            console.log(`   Error: ${agent.error}`);
          }
        });

        console.log(`Overall Ready: ${result.agents_status.all_ready}`);
        console.log("=" .repeat(80));

        // If agents are not ready, show error
        if (!result.agents_status.all_ready) {
          console.error("❌ Cannot start research: Critical agents are not ready!");
        }
      }

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
    if (isResearchPaused) return;

    console.log("=".repeat(80));
    console.log("🔄 [POLLING] Starting status polling for ID:", id);
    console.log("=".repeat(80));

    // Clear any existing timer first
    if (pollingIntervalRef.current) {
      console.log("⚠️ [POLLING] Clearing existing interval before starting new one");
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    const pollingToken = `${id}:${Date.now()}`;
    pollingTokenRef.current = pollingToken;

    const pollInterval = 2500;
    const maxHardFailures = 15;
    const maxTransientFailures = 180; // ~7.5 min with 2.5s interval
    const maxPollingDurationMs = 45 * 60 * 1000; // 45 min
    const startedAt = Date.now();

    let pollCount = 0;
    let hardFailures = 0;
    let transientFailures = 0;

    // Get API base URL from environment or use default
    const apiBaseUrl =
      "http://localhost:8005";

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (pollingTokenRef.current === pollingToken) {
        pollingTokenRef.current = null;
      }
    };

    const scheduleNext = () => {
      if (pollingTokenRef.current !== pollingToken) return;
      pollingIntervalRef.current = setTimeout(runPoll, pollInterval);
    };

    const runPoll = async () => {
      if (pollingTokenRef.current !== pollingToken || isResearchPaused) return;

      const elapsed = Date.now() - startedAt;
      if (elapsed >= maxPollingDurationMs) {
        stopPolling();
        setIsSubmitting(false);
        setIsResearchPaused(false);
        setError(
          "Исследование выполняется слишком долго. Выполните синхронизацию статуса или запустите заново."
        );
        return;
      }

      pollCount++;

      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/research/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          if ([429, 502, 503, 504].includes(response.status)) {
            transientFailures++;
            if (transientFailures >= maxTransientFailures) {
              stopPolling();
              setIsSubmitting(false);
              setIsResearchPaused(false);
              setError("Временные ошибки сети/API. Попробуйте обновить статус или перезапустить исследование.");
              return;
            }
            scheduleNext();
            return;
          }
          hardFailures++;
          if (hardFailures >= maxHardFailures) {
            stopPolling();
            setIsSubmitting(false);
            setIsResearchPaused(false);
            setError(`Не удается получить статус исследования (HTTP ${response.status}).`);
            return;
          }
          scheduleNext();
          return;
        }

        const status: ResearchStatus = await response.json();
        hardFailures = 0;
        transientFailures = 0;

        setResearchStatus(status);

        if (status.status === "completed") {
          console.log("=".repeat(80));
          console.log("✅ ✅ ✅ RESEARCH COMPLETED! ✅ ✅ ✅");
          console.log("=".repeat(80));
          console.log("[Market Research] Fetching report...");

          stopPolling();
          setIsSubmitting(false);
          setIsResearchPaused(false);

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

          await fetchResearchReport(id);
          return;
        } else if (status.status === "failed") {
          stopPolling();
          setIsSubmitting(false);
          setIsResearchPaused(false);
          setError(
            `Исследование не удалось выполнить: ${
              status.error || status.current_stage || "Неизвестная ошибка"
            }`
          );
          return;
        }

        scheduleNext();
      } catch (err: any) {
        console.error(`❌ [POLLING #${pollCount}] Error:`, err);
        const isTransient =
          err?.message?.includes("fetch") ||
          err?.message?.includes("network") ||
          err?.message?.includes("Failed to fetch") ||
          err?.name === "AbortError";

        if (isTransient) {
          transientFailures++;
          if (transientFailures >= maxTransientFailures) {
            stopPolling();
            setIsSubmitting(false);
            setIsResearchPaused(false);
            setError(
              `Не удается получить статус исследования. Проверьте сервис на ${apiBaseUrl}.`
            );
            return;
          }
        } else {
          hardFailures++;
          if (hardFailures >= maxHardFailures) {
            stopPolling();
            setIsSubmitting(false);
            setIsResearchPaused(false);
            setError(
              `Не удается получить статус исследования. Ошибка: ${
                err.message || "Неизвестная ошибка"
              }`
            );
            return;
          }
        }

        scheduleNext();
      }
    };

    console.log("✅ [POLLING] Timer mode enabled. Polling every", pollInterval, "ms");
    await runPoll();
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

  const handlePauseResearch = () => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingTokenRef.current = null;
    setIsSubmitting(false);
    setIsResearchPaused(true);
  };

  const handleResumeResearch = () => {
    if (!researchId) return;
    setError(null);
    setIsResearchPaused(false);
    setIsSubmitting(true);
    pollResearchStatus(researchId);
  };

  const handleRestartResearch = async () => {
    try {
      if (researchId) {
        const apiBaseUrl = "http://localhost:8005";
        await fetch(`${apiBaseUrl}/api/v1/research/${researchId}`, {
          method: "DELETE",
        });
      }
    } catch (e) {
      console.warn("Не удалось отменить текущее исследование на сервере:", e);
    } finally {
      handleReset({ preserveFormData: true, useSavedFormData: true });
    }
  };

  const handleDownload = async (format: "docx" | "pdf") => {
    if ((!enhancedReport && !researchReport) || !researchId) return;
    if (downloadingFormat) return;

    setDownloadingFormat(format);
    try {
      const apiBaseUrl = "http://localhost:8005";

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
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleReset = (options?: {
    preserveFormData?: boolean;
    useSavedFormData?: boolean;
  }) => {
    const preserveFormData = options?.preserveFormData ?? false;
    const useSavedFormData = options?.useSavedFormData ?? false;

    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingTokenRef.current = null;

    if (!preserveFormData) {
      setFormData(defaultFormData);
    } else if (useSavedFormData) {
      try {
        const savedRaw = localStorage.getItem(LAST_REQUEST_FORM_DATA_KEY);
        if (savedRaw) {
          const saved = JSON.parse(savedRaw) as FormData;
          if (saved && typeof saved === "object") {
            setFormData((prev) => ({ ...prev, ...saved }));
          }
        }
      } catch (e) {
        console.warn("Не удалось восстановить сохранённые поля:", e);
      }
    }

    setResearchId(null);
    setResearchStatus(null);
    setResearchReport(null);
    setEnhancedReport(null);
    setActiveSection("executive");
    setError(null);
    setIsSubmitting(false);
    setIsResearchPaused(false);
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
                Состояние Системы
                <button
                  type="button"
                  className={styles.healthRefreshButton}
                  onClick={() => fetchHealthStatus(true)}
                  disabled={isRefreshingHealth}
                  title="Обновить статусы сервисов"
                >
                  <FiRefreshCw className={isRefreshingHealth ? styles.spin : ""} />
                  Обновить
                </button>
                <span style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.9rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: healthStatus.all_ready ? '#d4edda' : '#f8d7da',
                  color: healthStatus.all_ready ? '#155724' : '#721c24',
                  fontWeight: 500
                }}>
                  {healthStatus.all_ready ? '✓ Готово' : '✗ Не готово'}
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
                        {agent.port && <span style={{ color: '#6c757d', fontSize: '0.85rem' }}> :{ agent.port}</span>}
                        {agent.optional && <span style={{ color: '#856404', fontSize: '0.75rem', marginLeft: '0.25rem' }}>(опц.)</span>}
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
                Обновлено: {new Date(healthStatus.timestamp).toLocaleTimeString('ru-RU')}
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
                <strong style={{ color: '#856404', fontSize: '0.95rem' }}>Система не готова</strong>
                <p style={{ margin: '0.25rem 0 0', color: '#856404', fontSize: '0.9rem' }}>
                  Некоторые компоненты системы недоступны. Исследование будет доступно только когда все обязательные компоненты будут готовы.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isCompletedView && (
          <>
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
                <div className={styles.productTypeSelectWrapper}>
                  {/* Selected tags */}
                  {formData.productTypes.length > 0 && (
                    <div className={styles.selectedTagsRow}>
                      {formData.productTypes.map((t) => {
                        const opt = productTypeOptions.find((o) => o.value === t);
                        return (
                          <span key={t} className={styles.selectedTag}>
                            {opt?.label ?? t}
                            <button
                              type="button"
                              className={styles.selectedTagRemove}
                              onClick={() => handleProductTypeToggle(t)}
                              aria-label={`Убрать ${opt?.label}`}
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {/* Grouped checkbox panel */}
                  <div className={styles.productTypePanel}>
                    {Object.entries(productTypesByCategory).map(([category, opts]) => (
                      <div key={category} className={styles.productTypeCategoryBlock}>
                        <div className={styles.productTypeCategoryHeader}>{category}</div>
                        {opts.map((opt) => {
                          const checked = formData.productTypes.includes(opt.value);
                          return (
                            <label
                              key={opt.value}
                              className={`${styles.productTypeCheckLabel}${checked ? " " + styles.checkedItem : ""}`}
                            >
                              <input
                                type="checkbox"
                                className={styles.productTypeCheckbox}
                                checked={checked}
                                onChange={() => handleProductTypeToggle(opt.value)}
                              />
                              {opt.label}
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
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

              {/* === СТАДИЯ БИЗНЕСА === */}
              <div className={styles.section}>
                <h3>Стадия бизнеса *</h3>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={!formData.isExistingBusiness ? styles.buttonActive : styles.button}
                    onClick={() => setFormData((prev) => ({ ...prev, isExistingBusiness: false, annualRevenueRange: "", yearsOperating: "" }))}
                  >
                    {!formData.isExistingBusiness && <FiCheck style={{ marginRight: "0.5rem" }} />}
                    Новый бизнес / стартап
                  </button>
                  <button
                    type="button"
                    className={formData.isExistingBusiness ? styles.buttonActive : styles.button}
                    onClick={() => setFormData((prev) => ({ ...prev, isExistingBusiness: true }))}
                  >
                    {formData.isExistingBusiness && <FiCheck style={{ marginRight: "0.5rem" }} />}
                    Действующий бизнес
                  </button>
                </div>

                {formData.isExistingBusiness && (
                  <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Годовая выручка (опционально)</label>
                      <div className={styles.buttonGroup}>
                        {revenueRangeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            className={formData.annualRevenueRange === opt.value ? styles.buttonActive : styles.button}
                            onClick={() => handleButtonSelect("annualRevenueRange", opt.value)}
                          >
                            {formData.annualRevenueRange === opt.value && <FiCheck style={{ marginRight: "0.5rem" }} />}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Лет на рынке (опционально)</label>
                      <input
                        type="number"
                        name="yearsOperating"
                        value={formData.yearsOperating}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Например: 3"
                        min={0}
                        max={100}
                        style={{ maxWidth: "180px" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* === ТИП ПРЕДЛОЖЕНИЯ === */}
              <div className={styles.section}>
                <h3>Тип предложения (опционально)</h3>
                <p className={styles.formDescription} style={{ marginBottom: "0.75rem" }}>
                  Помогает точнее построить финансовую модель
                </p>
                <div className={styles.buttonGroup}>
                  {offeringTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={formData.offeringType === opt.value ? styles.buttonActive : styles.button}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          offeringType: prev.offeringType === opt.value ? "" : opt.value,
                          offeringSubType: "",
                        }))
                      }
                    >
                      {formData.offeringType === opt.value && <FiCheck style={{ marginRight: "0.5rem" }} />}
                      <span>
                        <strong>{opt.label}</strong>
                        <span style={{ fontWeight: 400, marginLeft: "0.4rem", opacity: 0.75 }}>— {opt.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {formData.offeringType && offeringSubTypeOptions[formData.offeringType].length > 0 && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <label className={styles.label} style={{ marginBottom: "0.5rem" }}>Уточните тип</label>
                    <div className={styles.buttonGroup}>
                      {offeringSubTypeOptions[formData.offeringType].map((sub) => (
                        <button
                          key={sub.value}
                          type="button"
                          className={formData.offeringSubType === sub.value ? styles.buttonActive : styles.button}
                          onClick={() => handleButtonSelect("offeringSubType", formData.offeringSubType === sub.value ? "" : sub.value)}
                        >
                          {formData.offeringSubType === sub.value && <FiCheck style={{ marginRight: "0.5rem" }} />}
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* === ЦЕНОВОЙ СЕГМЕНТ === */}
              <div className={styles.section}>
                <h3>Ценовой сегмент (опционально)</h3>
                <p className={styles.formDescription} style={{ marginBottom: "0.75rem" }}>
                  Влияет на анализ конкурентов и целевой аудитории
                </p>
                <div className={styles.buttonGroup}>
                  {priceSegmentOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={formData.priceSegment === opt.value ? styles.buttonActive : styles.button}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          priceSegment: prev.priceSegment === opt.value ? "" : opt.value,
                        }))
                      }
                    >
                      {formData.priceSegment === opt.value && <FiCheck style={{ marginRight: "0.5rem" }} />}
                      <span>
                        <strong>{opt.label}</strong>
                        <span style={{ fontWeight: 400, marginLeft: "0.4rem", opacity: 0.75 }}>— {opt.desc}</span>
                      </span>
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

              {!isResearchPaused ? (
                <div className={styles.submitActionsRow}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting || !healthStatus?.all_ready}
                  >
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner} />
                        Собираем и анализируем данные ...
                      </>
                    ) : !healthStatus?.all_ready ? (
                      <>
                        <FiAlertCircle />
                        Система не готова
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Начать исследование
                      </>
                    )}
                  </button>

                  {isSubmitting && (
                    <button
                      type="button"
                      className={styles.stopButton}
                      onClick={handlePauseResearch}
                    >
                      Остановить
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.pausedActionsRow}>
                  <button
                    type="button"
                    className={styles.resumeButton}
                    onClick={handleResumeResearch}
                  >
                    Продолжить исследование
                  </button>
                  <button
                    type="button"
                    className={styles.restartButton}
                    onClick={handleRestartResearch}
                  >
                    Начать заново
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {researchStatus && researchStatus.status !== "completed" && (
          <div className={styles.progressSection}>
            <div className={styles.progressCard}>
              <h2>🔬 Выполняется исследование...</h2>
              <p className={styles.progressInfoText}>
                Система анализирует рынок с помощью AI-агентов. Процесс занимает 1-3 минуты.
              </p>

              {/* Progress Bar */}
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${researchStatus.progress || 0}%` }}
                />
              </div>

              {/* Current Status */}
              <div className={styles.statusRow}>
                <span className={styles.progressBadge}>
                  {researchStatus.progress || 0}%
                </span>
                <span className={styles.statusText}>
                  {researchStatus.current_stage}
                </span>
              </div>

              {/* Agent Process Visualization */}
              <div className={styles.agentStages}>
                <div className={styles.stageItem + (researchStatus.progress >= 10 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageIcon}>
                    {researchStatus.progress >= 10 ? '✓' : '1'}
                  </div>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageName}>Анализ рынка</div>
                    <div className={styles.stageDesc}>Market Sizing Agent</div>
                  </div>
                </div>

                <div className={styles.stageItem + (researchStatus.progress >= 30 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageIcon}>
                    {researchStatus.progress >= 30 ? '✓' : '2'}
                  </div>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageName}>Конкуренты</div>
                    <div className={styles.stageDesc}>Competitor Analysis Agent</div>
                  </div>
                </div>

                <div className={styles.stageItem + (researchStatus.progress >= 50 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageIcon}>
                      {researchStatus.progress >= 50 ? '✓' : '3'}
                    </div>
                    <div className={styles.stageName}>Аудитория</div>
                    <div className={styles.stageDesc}>Target Audience Agent</div>
                  </div>
                </div>

                <div className={styles.stageItem + (researchStatus.progress >= 60 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageIcon}>
                    {researchStatus.progress >= 60 ? '✓' : '4'}
                  </div>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageName}>Тренды</div>
                    <div className={styles.stageDesc}>Trends Analysis Agent</div>
                  </div>
                </div>

                <div className={styles.stageItem + (researchStatus.progress >= 70 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageIcon}>
                    {researchStatus.progress >= 70 ? '✓' : '5'}
                  </div>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageName}>Инсайты</div>
                    <div className={styles.stageDesc}>Consumer Insights Agent</div>
                  </div>
                </div>

                <div className={styles.stageItem + (researchStatus.progress >= 80 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageIcon}>
                    {researchStatus.progress >= 80 ? '✓' : '6'}
                  </div>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageName}>Финансы</div>
                    <div className={styles.stageDesc}>Financial Modeling Agent</div>
                  </div>
                </div>

                <div className={styles.stageItem + (researchStatus.progress >= 95 ? ' ' + styles.stageActive : '')}>
                  <div className={styles.stageIcon}>
                    {researchStatus.progress >= 95 ? '✓' : '7'}
                  </div>
                  <div className={styles.stageInfo}>
                    <div className={styles.stageName}>Генерация отчета</div>
                    <div className={styles.stageDesc}>Report Generation</div>
                  </div>
                </div>
              </div>

              <p className={styles.progressSubtext}>
                ID: {researchId}
              </p>
            </div>
          </div>
        )}
          </>
        )}

        {enhancedReport && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <h2>Маркетинговый отчет</h2>
                <p className={styles.reportSubtitle}>{buildCompletionSubtitle()}</p>
              </div>
              <div className={styles.resultsBody}>
                <div className={styles.section}>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      textAlign: "center",
                      padding: "2rem 1rem",
                      color: "#1e6078",
                      fontWeight: 600,
                    }}
                  >
                    ✅ Ваш маркетинговый отчет успешно сформирован!
                  </p>
                </div>

                <div className={styles.section}>
                  <div className={styles.downloadButtons}>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("docx")}
                      disabled={!!downloadingFormat}
                      style={downloadingFormat === "docx" ? { opacity: 0.7, cursor: "wait" } : undefined}
                    >
                      {downloadingFormat === "docx" ? (
                        <><FiDownload className={styles.spinIcon} /> Скачиваем отчёт...</>
                      ) : (
                        <><FiFile /> Скачать в DOCX</>
                      )}
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("pdf")}
                      disabled={!!downloadingFormat}
                      style={{ backgroundColor: "#dc2626", ...(downloadingFormat === "pdf" ? { opacity: 0.7, cursor: "wait" } : {}) }}
                    >
                      {downloadingFormat === "pdf" ? (
                        <><FiDownload className={styles.spinIcon} /> Скачиваем отчёт...</>
                      ) : (
                        <><FiDownload /> Скачать в PDF</>
                      )}
                    </button>
                  </div>
                </div>
                <div className={styles.resetSection}>
                  <button
                    className={styles.resetButton}
                    onClick={() =>
                      handleReset({ preserveFormData: true, useSavedFormData: true })
                    }
                  >
                    <FiRefreshCw /> Исследовать еще раз
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}\n        {researchReport && !enhancedReport && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <h2>Маркетинговый отчет</h2>
                <p className={styles.reportSubtitle}>{buildCompletionSubtitle()}</p>
              </div>
              <div className={styles.resultsBody}>
                {/* СООБЩЕНИЕ: ОТЧЕТ ГОТОВ */}
                <div className={styles.section}>
                  <p style={{ fontSize: '1.2rem', textAlign: 'center', padding: '2rem 1rem', color: '#1e6078', fontWeight: 600 }}>
                    ✅ Ваш маркетинговый отчет успешно сформирован!
                  </p>
                </div>

                {/* КНОПКИ СКАЧИВАНИЯ */}
                <div className={styles.section}>
                  <div className={styles.downloadButtons}>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("docx")}
                      disabled={!!downloadingFormat}
                      style={downloadingFormat === "docx" ? { opacity: 0.7, cursor: "wait" } : undefined}
                    >
                      {downloadingFormat === "docx" ? (
                        <><FiDownload className={styles.spinIcon} /> Скачиваем отчёт...</>
                      ) : (
                        <><FiFile /> Скачать в DOCX</>
                      )}
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("pdf")}
                      disabled={!!downloadingFormat}
                      style={{ backgroundColor: "#dc2626", ...(downloadingFormat === "pdf" ? { opacity: 0.7, cursor: "wait" } : {}) }}
                    >
                      {downloadingFormat === "pdf" ? (
                        <><FiDownload className={styles.spinIcon} /> Скачиваем отчёт...</>
                      ) : (
                        <><FiDownload /> Скачать в PDF</>
                      )}
                    </button>
                  </div>
                </div>
                <div className={styles.resetSection}>
                  <button
                    className={styles.resetButton}
                    onClick={() =>
                      handleReset({ preserveFormData: true, useSavedFormData: true })
                    }
                  >
                    <FiRefreshCw /> Исследовать еще раз
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isCompletedView && (
          <div className={styles.disclaimer}>
            <p>
              <strong>Важно:</strong> Это тестовая версия сервиса. Результаты
              могут быть неполными. Сервис использует AI-агенты, живой поиск для
              сбора и проверки данных.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


