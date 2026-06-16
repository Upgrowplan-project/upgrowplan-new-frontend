"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import Grade from "../../../components/Grade";
import styles from "./marketResearch.module.css";
import {
  FiBarChart2,
  FiCheck,
  FiAlertCircle,
  FiDownload,
  FiFile,
  FiRefreshCw,
} from "react-icons/fi";

// Countries where Google CSE coverage is limited — reports may have lower confidence.
// Shown as a soft warning in the UI; backend still processes the request.
const LOW_COVERAGE_COUNTRIES = new Set([
  "Vietnam", "China", "Bangladesh", "Pakistan", "Sri Lanka",
  "Tanzania", "Nigeria", "Kenya", "Ethiopia",
  "Myanmar", "Cambodia", "Laos",
  "Nepal", "Mongolia",
]);

// Backend base URL. On Vercel set NEXT_PUBLIC_MARKET_RESEARCH_API_URL to the deployed
// Heroku app (e.g. https://your-mrs.herokuapp.com). Falls back to localhost for dev.
// NEXT_PUBLIC_ vars are inlined at build time — must be set in the Vercel project.
const API_BASE =
  process.env.NEXT_PUBLIC_MARKET_RESEARCH_API_URL || "http://localhost:8005";

// Predefined countries: value=English (sent to API/geocoding), label=Russian (shown to user)
// Sorted by Russian label. English value ensures DRA queries don't need geocoding for country part.
const COUNTRIES = [
  { value: "Australia", label: "Австралия" },
  { value: "Austria", label: "Австрия" },
  { value: "Azerbaijan", label: "Азербайджан" },
  { value: "Argentina", label: "Аргентина" },
  { value: "Armenia", label: "Армения" },
  { value: "Bangladesh", label: "Бангладеш" },
  { value: "Belarus", label: "Беларусь" },
  { value: "Belgium", label: "Бельгия" },
  { value: "Bulgaria", label: "Болгария" },
  { value: "Brazil", label: "Бразилия" },
  { value: "UK", label: "Великобритания" },
  { value: "Hungary", label: "Венгрия" },
  { value: "Vietnam", label: "Вьетнам" },
  { value: "Germany", label: "Германия" },
  { value: "Greece", label: "Греция" },
  { value: "Georgia", label: "Грузия" },
  { value: "Denmark", label: "Дания" },
  { value: "Egypt", label: "Египет" },
  { value: "Israel", label: "Израиль" },
  { value: "India", label: "Индия" },
  { value: "Indonesia", label: "Индонезия" },
  { value: "Ireland", label: "Ирландия" },
  { value: "Spain", label: "Испания" },
  { value: "Italy", label: "Италия" },
  { value: "Kazakhstan", label: "Казахстан" },
  { value: "Canada", label: "Канада" },
  { value: "China", label: "Китай" },
  { value: "Colombia", label: "Колумбия" },
  { value: "South Korea", label: "Корея (Южная)" },
  { value: "Kyrgyzstan", label: "Кыргызстан" },
  { value: "Latvia", label: "Латвия" },
  { value: "Lithuania", label: "Литва" },
  { value: "Malaysia", label: "Малайзия" },
  { value: "Mexico", label: "Мексика" },
  { value: "Moldova", label: "Молдова" },
  { value: "Morocco", label: "Марокко" },
  { value: "Netherlands", label: "Нидерланды" },
  { value: "New Zealand", label: "Новая Зеландия" },
  { value: "Norway", label: "Норвегия" },
  { value: "UAE", label: "ОАЭ" },
  { value: "Pakistan", label: "Пакистан" },
  { value: "Peru", label: "Перу" },
  { value: "Philippines", label: "Филиппины" },
  { value: "Poland", label: "Польша" },
  { value: "Portugal", label: "Португалия" },
  { value: "Romania", label: "Румыния" },
  { value: "Russia", label: "Россия" },
  { value: "Saudi Arabia", label: "Саудовская Аравия" },
  { value: "Serbia", label: "Сербия" },
  { value: "Singapore", label: "Сингапур" },
  { value: "Slovakia", label: "Словакия" },
  { value: "USA", label: "США" },
  { value: "Tajikistan", label: "Таджикистан" },
  { value: "Thailand", label: "Таиланд" },
  { value: "Taiwan", label: "Тайвань" },
  { value: "Tanzania", label: "Танзания" },
  { value: "Tunisia", label: "Тунис" },
  { value: "Turkey", label: "Турция" },
  { value: "Uzbekistan", label: "Узбекистан" },
  { value: "Ukraine", label: "Украина" },
  { value: "Finland", label: "Финляндия" },
  { value: "France", label: "Франция" },
  { value: "Croatia", label: "Хорватия" },
  { value: "Czech Republic", label: "Чехия" },
  { value: "Chile", label: "Чили" },
  { value: "Switzerland", label: "Швейцария" },
  { value: "Sweden", label: "Швеция" },
  { value: "Sri Lanka", label: "Шри-Ланка" },
  { value: "Estonia", label: "Эстония" },
  { value: "South Africa", label: "ЮАР" },
  { value: "Japan", label: "Япония" },
] as const;

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
  | "pet_grooming"
  | "childcare"
  | "photography_studio"
  | "car_dealership"
  | "coworking"
  // Медиа и развлечения
  | "entertainment_media"
  // Недвижимость
  | "real_estate"
  // Транспорт
  | "transport_mobility"
  // Ремонт и сервис
  | "auto_services"
  | "electronics_repair"
  | "clothing_repair"
  // Ивент
  | "event_services"
  // Мебель и интерьер
  | "furniture_interior"
  // Аптека и оптика
  | "pharmacy_optics"
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
  // Дополнительные поля
  targetAudience: string;
  competitors: string;
}
// Pre-flight validation contract (mirrors backend request_validator.ValidationResult)
interface ValidationAction {
  label: string;
  type: "set_field" | "clear_field";
  field: string;
  value?: string;
}
interface ValidationIssue {
  field: string;
  code: string;
  message: string;
  actions?: ValidationAction[];
}
interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

interface PipelineAgent {
  name: string;
  status: "waiting" | "running" | "completed" | "timeout" | "failed";
  started_at?: string;
  elapsed_s?: number;
  wave?: number;
}

interface PipelineEvent {
  time: string;
  text: string;
  level: "info" | "warn";
}

interface PipelineStatus {
  agents: PipelineAgent[];
  events: PipelineEvent[];
  progress: number;
  wave_current: number;
  wave_total: number;
}

interface ResearchStatus {
  research_id: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  current_stage: string;
  error?: string;
  pipeline_status?: PipelineStatus;
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
  const [validationErrors, setValidationErrors] = useState<ValidationIssue[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResearchPaused, setIsResearchPaused] = useState(false);
  const isCompletedView = Boolean(enhancedReport || researchReport);

  const buildCompletionSubtitle = () => {
    const productName =
      enhancedReport?.product_name || formData.productName || "Маркетинговый отчет";
    const industry = (enhancedReport?.industry || "").trim();
    const location =
      enhancedReport?.location ||
      [formData.region, formData.country].filter(Boolean).join(", ");
    // Короткий subtitle: только название • отрасль • локация
    return [productName, industry, location].filter(Boolean).join(" • ");
  };

  // 2–3 строки из executive summary для отображения на странице результатов
  const buildExecutiveSummaryPreview = (): string[] => {
    const es = enhancedReport?.executive_summary;
    if (!es) return [];
    const lines: string[] = [];
    if (es.market_opportunity_summary) {
      lines.push(es.market_opportunity_summary);
    }
    if (es.key_findings?.length) {
      lines.push(...es.key_findings.slice(0, 2));
    }
    return lines.slice(0, 3);
  };

  // Таймер и метрики исследования
  const [researchStartTime, setResearchStartTime] = useState<number | null>(
    null
  );
  const [researchDuration, setResearchDuration] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Health status state
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [healthExpanded, setHealthExpanded] = useState(false);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"docx" | "pdf" | null>(null);

  // Ref для хранения polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTokenRef = useRef<string | null>(null);
  const isResearchPausedRef = useRef<boolean>(false);

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
      const healthApiBaseUrl = API_BASE;
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

    const apiBaseUrl = API_BASE;
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
    electronics: "Магазины электроники и гаджетов",
    food_beverage: "Food & Beverage",
    digital_apps: "Цифровые приложения",
    manufacturing: "Производство",
    wholesale_trade: "Оптовая торговля",
    corporate_solutions: "Корпоративные решения",
    business_tech: "Технологии для бизнеса",
    marketplace: "Маркетплейс / Платформа",
    p2p_platform: "P2P Платформа",
    saas_b2b: "B2B SaaS / Онлайн-сервис для бизнеса",
    saas_b2c: "B2C SaaS / Онлайн-сервис для частных лиц",
    cloud_platform: "Облачная платформа",
    industrial_equipment: "Промышленное оборудование",
    logistics: "Логистика",
    construction: "Строительство и подрядчики",
    energy: "Энергетика",
    agriculture: "Сельское хозяйство",
    consulting: "Консалтинг",
    healthcare: "Медицина и клиники",
    education: "Образование",
    tourism_hospitality: "Туризм и гостиничный бизнес",
    financial_services: "Финансовые услуги",
    horeca: "HoReCa",
    professional_services: "Профессиональные услуги",
    wellness_fitness: "Фитнес и Велнес",
    beauty_personal_care: "Красота и уход",
    home_services: "Дом и быт: клининг, ремонт, бытовые услуги",
    legal_services: "Юридические услуги",
    pet_services: "Зоотовары и ветеринария",
    entertainment_media: "Развлечения и медиа (онлайн)",
    real_estate: "Недвижимость",
    transport_mobility: "Транспорт: такси, каршеринг, мобильность",
    auto_services: "Автосервис и уход за автомобилем",
    electronics_repair: "Ремонт техники и сервисные центры",
    clothing_repair: "Ателье и ремонт одежды",
    event_services: "Организация мероприятий",
    furniture_interior: "Мебель, интерьер и декор",
    pharmacy_optics: "Аптека и оптика",
    pet_grooming: "Студия груминга",
    childcare: "Детские центры и сады",
    photography_studio: "Фотостудии и видеопродакшн",
    car_dealership: "Автосалоны и авторынки",
    coworking: "Коворкинги и аренда офисов",
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
    // HoReCa
    { value: "horeca",              label: "HoReCa (кафе, рестораны, бары, отели)", category: "HoReCa и питание" },
    { value: "tourism_hospitality", label: "Туризм и гостиничный бизнес",           category: "HoReCa и питание" },
    { value: "food_beverage",       label: "Продукты питания и напитки (производство/продажа)", category: "HoReCa и питание" },
    // Ремонт и сервис
    { value: "auto_services",       label: "Автосервис, автомойка, шиномонтаж",      category: "Ремонт и сервис" },
    { value: "electronics_repair",  label: "Ремонт техники (телефоны, ноутбуки, бытовая)", category: "Ремонт и сервис" },
    { value: "home_services",       label: "Дом и быт (клининг, бытовые услуги, курьеры)", category: "Ремонт и сервис" },
    { value: "clothing_repair",     label: "Ателье, ремонт одежды и обуви",          category: "Ремонт и сервис" },
    // Розница и потребительские товары
    { value: "retail_fmcg",         label: "Розница и FMCG (магазины, супермаркеты)", category: "Розница" },
    { value: "fashion_apparel",     label: "Мода и одежда",                           category: "Розница" },
    { value: "electronics",         label: "Магазины электроники и гаджетов",          category: "Розница" },
    { value: "furniture_interior",  label: "Мебель, интерьер и декор",                category: "Розница" },
    { value: "pharmacy_optics",     label: "Аптека, оптика, медицинские товары",       category: "Розница" },
    // Здоровье и красота
    { value: "wellness_fitness",    label: "Фитнес, йога, велнес, спа",               category: "Здоровье и красота" },
    { value: "beauty_personal_care",label: "Салоны красоты, барбершопы, маникюр",     category: "Здоровье и красота" },
    { value: "healthcare",          label: "Медицинские клиники и диагностика",        category: "Здоровье и красота" },
    { value: "pet_services",        label: "Зоомагазины и ветеринария",               category: "Здоровье и красота" },
    { value: "pet_grooming",        label: "Студия груминга (стрижка и уход за питомцами)", category: "Здоровье и красота" },
    // Образование и профессиональные услуги
    { value: "education",           label: "Образование и онлайн-обучение",            category: "Образование и услуги" },
    { value: "childcare",           label: "Детские центры, развивающие клубы, частные сады", category: "Образование и услуги" },
    { value: "consulting",          label: "Консалтинг (персональные услуги)",         category: "Образование и услуги" },
    { value: "professional_services",label: "Агентства и аутсорсинг (маркетинг, HR, бухгалтерия)", category: "Образование и услуги" },
    { value: "legal_services",      label: "Юридические услуги",                      category: "Образование и услуги" },
    { value: "event_services",      label: "Организация мероприятий и ивент-агентства", category: "Образование и услуги" },
    { value: "photography_studio",  label: "Фотостудии и видеопродакшн",              category: "Образование и услуги" },
    { value: "coworking",           label: "Коворкинги и аренда офисов",              category: "Образование и услуги" },
    // Недвижимость и строительство
    { value: "real_estate",         label: "Недвижимость (агентства, PropTech)",       category: "Недвижимость и строительство" },
    { value: "construction",        label: "Строительство и ремонт помещений",         category: "Недвижимость и строительство" },
    { value: "car_dealership",      label: "Автосалоны и авторынки",                  category: "Недвижимость и строительство" },
    // Цифровые продукты и SaaS
    { value: "digital_apps",        label: "Мобильные и веб-приложения (B2C)",         category: "Цифровые продукты" },
    { value: "saas_b2b",            label: "B2B SaaS / Онлайн-сервисы для бизнеса",    category: "Цифровые продукты" },
    { value: "saas_b2c",            label: "B2C SaaS / Онлайн-сервисы для частных лиц", category: "Цифровые продукты" },
    { value: "cloud_platform",      label: "Облачная платформа / инфраструктура",      category: "Цифровые продукты" },
    { value: "marketplace",         label: "Маркетплейс / Агрегатор",                 category: "Цифровые продукты" },
    { value: "p2p_platform",        label: "P2P платформа",                           category: "Цифровые продукты" },
    { value: "entertainment_media", label: "Развлечения, медиа, стриминг (онлайн)",    category: "Цифровые продукты" },
    // B2B и промышленность
    { value: "manufacturing",       label: "Производство",                            category: "B2B и промышленность" },
    { value: "wholesale_trade",     label: "Оптовая торговля",                        category: "B2B и промышленность" },
    { value: "corporate_solutions", label: "Корпоративные решения",                   category: "B2B и промышленность" },
    { value: "business_tech",       label: "Технологии для бизнеса",                  category: "B2B и промышленность" },
    { value: "industrial_equipment",label: "Промышленное оборудование",               category: "B2B и промышленность" },
    { value: "logistics",           label: "Логистика и доставка",                    category: "B2B и промышленность" },
    { value: "transport_mobility",  label: "Транспорт: такси, каршеринг, мобильность", category: "B2B и промышленность" },
    { value: "energy",              label: "Энергетика",                              category: "B2B и промышленность" },
    { value: "agriculture",         label: "Сельское хозяйство",                      category: "B2B и промышленность" },
    // Финансы
    { value: "financial_services",  label: "Финансовые услуги и страхование",          category: "Финансы" },
    // Общее
    { value: "other",               label: "Другое",                                  category: "Другое" },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // Google long-name → frontend COUNTRIES value (only known divergences).
  const normalizeCountryValue = (name: string): string => {
    const aliases: Record<string, string> = {
      "United States": "USA",
      "United Kingdom": "UK",
      "United Arab Emirates": "UAE",
      Czechia: "Czech Republic",
    };
    const mapped = aliases[name] || name;
    return COUNTRIES.some((c) => c.value === mapped) ? mapped : name;
  };

  // Apply a one-click validation fix to the form, then let the user resubmit.
  const handleApplyValidationAction = (action: ValidationAction) => {
    const key =
      action.field === "country" ? "country" : action.field === "region" ? "region" : null;
    if (!key) return;
    let value = action.type === "clear_field" ? "" : action.value || "";
    if (key === "country" && value) value = normalizeCountryValue(value);
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);
    setValidationWarnings([]);
    setIsSubmitting(true);
    setIsResearchPaused(false);
    setElapsedSeconds(0);
    setResearchStartTime(Date.now()); // Запуск таймера
    setResearchDuration(null); // Сброс предыдущей длительности
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    elapsedTimerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
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
    const healthApiBaseUrl = API_BASE;

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

    // Parse competitors string → array
    const competitorsList = formData.competitors
      ? formData.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : undefined;

    // Derive industry from selected product type (first selected)
    const primaryProductType = formData.productTypes[0];
    const industryStr = productTypeToIndustry[primaryProductType] ?? primaryProductType;

    // Build ResearchRequest directly — no onboarding mapper indirection.
    // Built once: used for both pre-flight validation and submission.
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
      // Optional extras
      ...(formData.targetAudience ? { target_audience_description: formData.targetAudience } : {}),
      ...(competitorsList && competitorsList.length > 0 ? { competitors: competitorsList } : {}),
    };

    // PRE-FLIGHT VALIDATION — coherence + injection gate BEFORE launching the
    // pipeline (no research started, no cost). Authoritative gate is also
    // enforced in /research/direct; this is for instant UX. On network failure
    // we proceed and let the backend gate decide.
    try {
      const validateResp = await fetch(`${healthApiBaseUrl}/api/v1/research/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (validateResp.ok) {
        const verdict: ValidationResult = await validateResp.json();
        setValidationWarnings(verdict.warnings || []);
        if (!verdict.valid) {
          setValidationErrors(verdict.errors || []);
          if (elapsedTimerRef.current) {
            clearInterval(elapsedTimerRef.current);
            elapsedTimerRef.current = null;
          }
          setIsSubmitting(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }
    } catch (validationErr) {
      console.warn("[Validation] pre-flight skipped (backend gate is authoritative):", validationErr);
    }
    setValidationErrors([]);

    try {
      try {
        localStorage.setItem(LAST_REQUEST_FORM_DATA_KEY, JSON.stringify(formData));
      } catch (e) {
        console.warn("Не удалось сохранить данные последнего запроса:", e);
      }

      console.log(
        "[Market Research] Sending request to market-research-service (direct)..."
      );
      console.log("[Market Research] Request data:", requestData);

      // Get API base URL from environment or use default
      // HARDCODED FOR NOW - env var not working
      const apiBaseUrl = API_BASE;

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
        // 422 = authoritative validation gate rejected the request (e.g. direct
        // API call or a race after pre-flight). Render structured field errors.
        if (response.status === 422) {
          const body = await response.json().catch(() => null);
          const verdict: ValidationResult | undefined = body?.detail ?? body;
          if (verdict?.errors?.length) {
            setValidationErrors(verdict.errors);
            setValidationWarnings(verdict.warnings || []);
            setIsSubmitting(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        }
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
    if (isResearchPausedRef.current) return;

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
    const maxTransientFailures = 360; // ~15 min with 2.5s interval
    const maxPollingDurationMs = 90 * 60 * 1000; // 90 min
    const startedAt = Date.now();

    let pollCount = 0;
    let hardFailures = 0;
    let transientFailures = 0;

    // Get API base URL from environment or use default
    const apiBaseUrl =
      API_BASE;

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (pollingTokenRef.current === pollingToken) {
        pollingTokenRef.current = null;
      }
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    };

    const scheduleNext = () => {
      if (pollingTokenRef.current !== pollingToken) return;
      pollingIntervalRef.current = setTimeout(runPoll, pollInterval);
    };

    const runPoll = async () => {
      if (pollingTokenRef.current !== pollingToken || isResearchPausedRef.current) return;

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
      API_BASE;

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
    isResearchPausedRef.current = true;
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    pollingTokenRef.current = null;
    setIsSubmitting(false);
    setIsResearchPaused(true);
  };

  const handleResumeResearch = () => {
    if (!researchId) return;
    isResearchPausedRef.current = false; // синхронно до вызова pollResearchStatus
    setError(null);
    setIsResearchPaused(false);
    setIsSubmitting(true);
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    elapsedTimerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    pollResearchStatus(researchId);
  };

  const handleRestartResearch = async () => {
    try {
      if (researchId) {
        const apiBaseUrl = API_BASE;
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
      const apiBaseUrl = API_BASE;

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
              MarketSense — ИИ-инструмент исследования рынка
            </h1>
            <p className={styles.heroDescription}>
              Живые веб-данные, анализ конкурентов и оценка рынка. MarketSense
              помогает фаундерам и аналитикам собирать актуальные данные,
              валидировать источники, картировать конкурентов, сегментировать
              целевую аудиторию и оценивать объём рынка за минуты, а не недели.
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

        {/* Pre-flight validation issues (errors block submit, warnings are advisory) */}
        {(validationErrors.length > 0 || validationWarnings.length > 0) && (
          <div className={styles.errorSection}>
            {validationErrors.length > 0 && (
              <div
                style={{
                  border: "1px solid #f3b1b1",
                  background: "#fdecec",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: validationWarnings.length > 0 ? "0.75rem" : 0,
                }}
              >
                <h3 style={{ display: "flex", alignItems: "center", gap: 8, color: "#b42318", margin: "0 0 0.5rem" }}>
                  <FiAlertCircle size={20} /> Проверьте данные запроса
                </h3>
                <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {validationErrors.map((issue, i) => (
                    <li key={`${issue.code}-${i}`} style={{ color: "#742a2a" }}>
                      <span>{issue.message}</span>
                      {issue.actions && issue.actions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                          {issue.actions.map((action, j) => (
                            <button
                              key={j}
                              type="button"
                              onClick={() => handleApplyValidationAction(action)}
                              style={{
                                border: "1px solid #b42318",
                                background: "#fff",
                                color: "#b42318",
                                borderRadius: 8,
                                padding: "4px 10px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {validationWarnings.length > 0 && (
              <div
                style={{
                  border: "1px solid #f0d28a",
                  background: "#fdf6e3",
                  borderRadius: 12,
                  padding: "0.75rem 1.25rem",
                }}
              >
                <strong style={{ color: "#8a6d1f" }}>Предупреждения (можно продолжить):</strong>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem" }}>
                  {validationWarnings.map((issue, i) => (
                    <li key={`${issue.code}-${i}`} style={{ color: "#8a6d1f" }}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Health Status — строка-плейсхолдер ВО ВРЕМЯ первой проверки, чтобы
            блок присутствовал сразу при загрузке страницы (не «выпрыгивал» позже).
            Пока идёт проверка — «Проверка…»; при сбое — ошибка + ретрай. */}
        {(isLoadingHealth || !healthStatus) && (
          <div className={styles.healthSection}>
            <div className={styles.healthCard} style={{ padding: "0.6rem 1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {isLoadingHealth ? (
                  <>
                    <FiRefreshCw className={styles.spin} />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#64748b" }}>
                      Проверка состояния системы…
                    </span>
                  </>
                ) : (
                  <>
                    <FiAlertCircle color="#b42318" />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#b42318" }}>
                      Не удалось получить статус системы
                    </span>
                    <button
                      type="button"
                      className={styles.healthRefreshButton}
                      onClick={() => fetchHealthStatus(true)}
                      disabled={isRefreshingHealth}
                      title="Повторить проверку"
                    >
                      <FiRefreshCw className={isRefreshingHealth ? styles.spin : ""} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Health Status — компактная полоса готовности. Точки = по компоненту
            (цвет несёт состояние даже свёрнутой). Детали авто-раскрываются при
            сбое; по клику можно развернуть полный список. Для оператора. */}
        {!isLoadingHealth && healthStatus && (() => {
          const agents: any[] = healthStatus.agents || [];
          const readyCount = agents.filter((a) => a.ready).length;
          const showDetail = healthExpanded || !healthStatus.all_ready;
          const detailAgents = healthExpanded ? agents : agents.filter((a) => !a.ready);
          return (
            <div className={styles.healthSection}>
              <div
                className={styles.healthCard}
                onClick={() => setHealthExpanded((v) => !v)}
                style={{ cursor: "pointer", padding: "0.6rem 1rem" }}
                title="Показать/скрыть детали компонентов"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {agents.map((a, i) => (
                      <span
                        key={i}
                        title={`${a.name}: ${a.status}`}
                        style={{
                          width: 9, height: 9, borderRadius: "50%",
                          background: a.ready ? "#22c55e" : a.optional ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: healthStatus.all_ready ? "#166534" : "#b42318" }}>
                    {healthStatus.all_ready ? "Система готова к работе" : "Система не готова"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>{readyCount}/{agents.length}</span>
                  <span style={{ flex: 1 }} />
                  <button
                    type="button"
                    className={styles.healthRefreshButton}
                    onClick={(e) => { e.stopPropagation(); fetchHealthStatus(true); }}
                    disabled={isRefreshingHealth}
                    title="Обновить статусы сервисов"
                  >
                    <FiRefreshCw className={isRefreshingHealth ? styles.spin : ""} />
                  </button>
                  <span style={{ color: "#9aa", fontSize: "0.8rem", transform: healthExpanded ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
                </div>

                {showDetail && (
                  <div
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.5rem", marginTop: "0.65rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {detailAgents.map((agent: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: "0.5rem 0.65rem",
                          border: "1px solid",
                          borderColor: agent.ready ? "#c3e6cb" : agent.optional ? "#fff3cd" : "#f5c6cb",
                          borderRadius: 8,
                          backgroundColor: agent.ready ? "#f7fdf9" : agent.optional ? "#fffef5" : "#fff5f6",
                          display: "flex", alignItems: "center", gap: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "1.1rem" }}>{agent.ready ? "✅" : agent.optional ? "⚠️" : "❌"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: "0.85rem" }}>
                            {agent.name}
                            {agent.port && <span style={{ color: "#6c757d", fontSize: "0.8rem" }}> :{agent.port}</span>}
                            {agent.optional && <span style={{ color: "#856404", fontSize: "0.72rem", marginLeft: "0.25rem" }}>(опц.)</span>}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: agent.ready ? "#28a745" : agent.optional ? "#856404" : "#dc3545" }}>{agent.status}</div>
                          {agent.error && <div style={{ fontSize: "0.72rem", color: "#6c757d", marginTop: "0.2rem" }}>{agent.error}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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
            {(isSubmitting && !isResearchPaused) ? (() => {
              // ── WAITING VIEW (исследование идёт): сводка запроса + динамическое
              //    превью разделов (загорается по pipeline_status) + блок доверия.
              const pipeline = researchStatus?.pipeline_status;
              const agentMap: Record<string, PipelineAgent> = {};
              (pipeline?.agents ?? []).forEach((a) => { agentMap[a.name] = a; });
              const statusOf = (agent: string): string =>
                researchStatus?.status === "completed"
                  ? "completed"
                  : agentMap[agent]?.status || "waiting";
              const S_ICON: Record<string, string> = { waiting: "○", running: "▶", completed: "✓", timeout: "⚠", failed: "✗" };
              const S_COLOR: Record<string, string> = { waiting: "#9aa7b4", running: "#0683f5", completed: "#16a34a", timeout: "#f97316", failed: "#ef4444" };
              const sectionDefs = [
                { label: "Объём рынка — TAM / SAM / SOM", agent: "MarketSizingAgent" },
                { label: "Конкурентный анализ", agent: "CompetitorAnalysisAgent" },
                { label: "Ценовой анализ конкурентов", agent: "CompetitorAnalysisAgent" },
                { label: "Целевая аудитория и сегменты", agent: "TargetAudienceAgent" },
                { label: "Тренды и драйверы рынка", agent: "TrendsAnalysisAgent" },
                { label: "Потребительские инсайты", agent: "ConsumerInsightsAgent" },
                { label: "Стратегические рекомендации", agent: "ValidationAgent" },
              ];
              const location = [formData.region, formData.country].filter(Boolean).join(", ");
              const goals = formData.researchGoals
                .map((g) => researchGoalOptions.find((o) => o.value === g)?.label || g)
                .join(" · ");
              const industry = productTypeToIndustry[formData.productTypes[0]] ?? formData.productTypes[0];
              const summaryRows: [string, string][] = [
                ["Продукт", formData.productName],
                ["Локация", location || "—"],
                ["Тип бизнеса", formData.businessTypes.join(", ")],
                ["Отрасль", industry],
                ["Цели", goals],
              ];
              if (formData.priceSegment) {
                summaryRows.push(["Сегмент", priceSegmentOptions.find((o) => o.value === formData.priceSegment)?.label || formData.priceSegment]);
              }
              return (
                <div>
                  <h2 style={{ marginBottom: "0.35rem" }}>Исследуем ваш рынок</h2>
                  <p className={styles.formDescription} style={{ marginBottom: "1.1rem" }}>
                    Это занимает ~10–15 минут — 6 агентов собирают данные из реальных источников.
                    Вкладку можно оставить открытой; прогресс и логи — ниже.
                  </p>

                  {/* Сводка запроса — подтверждение «что исследуем» */}
                  <div style={{ border: "1px solid #e3e8ef", background: "#f8fafc", borderRadius: 12, padding: "0.9rem 1.1rem", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.6rem", color: "#0b1a21" }}>Что исследуем</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem 1.25rem" }}>
                      {summaryRows.filter(([, v]) => v && v.trim()).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", gap: "0.5rem", fontSize: "0.88rem" }}>
                          <span style={{ color: "#64748b", minWidth: 96 }}>{k}</span>
                          <span style={{ color: "#0b1a21", fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Превью разделов отчёта — загорается по мере готовности агентов */}
                  <div style={{ border: "1px solid #e3e8ef", borderRadius: 12, padding: "0.9rem 1.1rem", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.6rem", color: "#0b1a21" }}>Что будет в отчёте</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.4rem 1.25rem" }}>
                      {sectionDefs.map((s, i) => {
                        const st = statusOf(s.agent);
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.88rem" }}>
                            <span style={{ color: S_COLOR[st] || "#9aa7b4", width: 16, textAlign: "center", fontWeight: 700 }}>
                              {S_ICON[st] || "○"}
                            </span>
                            <span style={{ color: st === "completed" ? "#0b1a21" : "#475569", fontWeight: st === "running" ? 600 : 400 }}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Блок доверия / методология */}
                  <div style={{ border: "1px solid #dbeafe", background: "#f0f7ff", borderRadius: 12, padding: "0.9rem 1.1rem", marginBottom: "0.5rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem", color: "#0b1a21" }}>Пока идёт анализ</div>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#334155", fontSize: "0.86rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <li>Данные из реальных источников — Google Places, Statista, отраслевые отчёты. Мы не выдумываем цифры.</li>
                      <li>Каждая метрика привязана к источнику; модельные оценки честно помечаются как индикативные.</li>
                      <li>Результат универсален: рынок, конкуренты, аудитория, тренды, инсайты, цены и стратегия.</li>
                    </ul>
                    <div style={{ marginTop: "0.55rem", fontSize: "0.8rem", color: "#64748b" }}>
                      Можно остановить в любой момент — сессия сохраняется до 1 часа.
                    </div>
                  </div>
                </div>
              );
            })() : (
              <>
                <h2>Данные для исследования</h2>
                <p className={styles.formDescription}>
                  Внесите информацию о вашей идее или проекте. Чем больше информации
                  вы предоставите, тем точнее и актуальнее будет исследование рынка.
                  Поля, отмеченные звездочкой (*), обязательны для заполнения.
                </p>
              </>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Поля формы скрываются во время исследования — показываются снова при паузе */}
              {(!isSubmitting || isResearchPaused) && (<>
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
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    >
                      <option value="">— Выберите страну —</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {formData.country && LOW_COVERAGE_COUNTRIES.has(formData.country) && (
                      <p style={{
                        marginTop: "0.5rem",
                        fontSize: "0.8rem",
                        color: "#b45309",
                        backgroundColor: "#fffbeb",
                        border: "1px solid #fcd34d",
                        borderRadius: "6px",
                        padding: "0.5rem 0.75rem",
                        lineHeight: 1.4,
                      }}>
                        ⚠️ Для этого рынка публичных данных может быть меньше — отчёт возможно будет иметь низкую достоверность.
                      </p>
                    )}
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

              {/* === ТИП ПРЕДЛОЖЕНИЯ === */}
              <div className={styles.section}>
                <h3>Тип предложения (опционально)</h3>
                <p className={styles.formDescription} style={{ marginBottom: "0.75rem" }}>
                  Помогает точнее определить аудиторию и конкурентное поле
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
              </>)} {/* /(!isSubmitting || isResearchPaused) */}

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
                  {/* Сообщение о паузе */}
                  <div className={styles.pauseInfoBanner}>
                    <span style={{ fontSize: "1.15rem" }}>⏸</span>
                    <div>
                      <strong>Исследование приостановлено</strong>
                      <p>
                        Бэкенд продолжает работу — данные не теряются.
                        Сессия сохраняется <strong>до 1 часа</strong>. Нажмите «Продолжить»,
                        чтобы вернуться к результатам, или «Обновить запрос», чтобы
                        изменить параметры и запустить новое исследование.
                      </p>
                    </div>
                  </div>
                  <div className={styles.pausedButtons}>
                    <button
                      type="button"
                      className={styles.resumeButton}
                      onClick={handleResumeResearch}
                    >
                      ▶ Продолжить исследование
                    </button>
                    <button
                      type="button"
                      className={styles.restartButton}
                      onClick={handleRestartResearch}
                    >
                      ✎ Обновить запрос
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {researchStatus && researchStatus.status !== "completed" && (() => {
          const pipeline = researchStatus.pipeline_status;
          const progressPct = pipeline?.progress ?? researchStatus.progress ?? 0;
          const elapsedMin = Math.floor(elapsedSeconds / 60);
          const etaMin = progressPct > 5
            ? Math.ceil(elapsedMin / progressPct * (100 - progressPct))
            : null;

          const WAVE_LABELS: Record<number, string> = {
            1: "Сбор данных (5 агентов)",
            2: "Проверка и валидация",
          };
          const WAVE_AGENTS: Record<number, string[]> = {
            1: ["MarketSizingAgent", "CompetitorAnalysisAgent", "TargetAudienceAgent", "TrendsAnalysisAgent", "ConsumerInsightsAgent"],
            2: ["ValidationAgent"],
          };
          const AGENT_DISPLAY: Record<string, string> = {
            "MarketSizingAgent":       "Анализ рынка (TAM/SAM/SOM)",
            "CompetitorAnalysisAgent": "Конкурентный анализ",
            "TargetAudienceAgent":     "Целевая аудитория",
            "TrendsAnalysisAgent":     "Тренды и драйверы",
            "ConsumerInsightsAgent":   "Потребительские инсайты",
            "ValidationAgent":         "Валидация данных",
          };
          const STATUS_ICON: Record<string, string> = {
            waiting:   "○",
            running:   "▶",
            completed: "✅",
            timeout:   "⚠",
            failed:    "✗",
          };
          const STATUS_COLOR: Record<string, string> = {
            waiting:   "#4b7ab0",
            running:   "#60a5fa",
            completed: "#4ade80",
            timeout:   "#fb923c",
            failed:    "#f87171",
          };

          const agentMap: Record<string, PipelineAgent> = {};
          (pipeline?.agents ?? []).forEach(a => { agentMap[a.name] = a; });

          // ── Палитра терминала (как в descriptionPage HERO) ──────────────
          const T = {
            bg:        "#0f1f2a",
            headerBg:  "#0b1a21",
            border:    "#01346e",
            textMain:  "rgba(236,246,255,0.90)",
            textDim:   "#4b7ab0",
            textMuted: "rgba(236,246,255,0.55)",
            accent:    "#8bc4ff",
            green:     "#7dd36e",
            orange:    "#f97316",
            red:       "#ef4444",
            mono:      '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
          } as const;

          return (
            <div className={styles.progressSection}>
              {/* ── TERMINAL CARD ───────────────────────────────────────────── */}
              <div style={{
                background: T.bg,
                borderRadius: 14,
                border: `1px solid ${T.border}`,
                boxShadow: "0 12px 32px rgba(1,52,110,0.22)",
                overflow: "hidden",
              }}>

                {/* ── TITLE BAR ── */}
                <div style={{
                  background: T.headerBg,
                  padding: "0.65rem 1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid rgba(1,52,110,0.5)`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {/* Traffic-light dots */}
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: T.red,    display: "inline-block" }} />
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: T.green,  display: "inline-block" }} />
                    <span style={{ color: T.accent, fontSize: "0.82rem", fontWeight: 600, marginLeft: "0.5rem", fontFamily: T.mono }}>
                      AI Research Log
                    </span>
                  </div>
                  <span style={{ color: T.textDim, fontSize: "0.78rem", fontFamily: T.mono, fontVariantNumeric: "tabular-nums" }}>
                    {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:{String(elapsedSeconds % 60).padStart(2, "0")}
                  </span>
                </div>

                {/* ── PROGRESS BAR ── */}
                <div style={{ padding: "0.75rem 1.25rem 0", background: "rgba(11,26,33,0.6)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ flex: 1, height: 5, background: "rgba(1,52,110,0.35)", borderRadius: 3 }}>
                      <div style={{
                        height: "100%", width: `${progressPct}%`,
                        background: `linear-gradient(90deg, #0683f5, ${T.accent})`,
                        borderRadius: 3, transition: "width 0.6s ease",
                        boxShadow: `0 0 8px ${T.accent}55`,
                      }} />
                    </div>
                    <span style={{ color: T.accent, fontSize: "0.9rem", fontWeight: 700, fontFamily: T.mono, minWidth: "2.8rem" }}>
                      {progressPct}%
                    </span>
                  </div>
                  <div style={{ color: T.textMuted, fontSize: "0.82rem", marginTop: "0.4rem", fontFamily: T.mono }}>
                    {researchStatus.current_stage}
                    {etaMin !== null && etaMin > 0 && ` — ~${etaMin} мин`}
                  </div>
                </div>

                {/* ── BODY ── */}
                <div style={{ padding: "0.9rem 1.25rem 1.1rem", fontFamily: T.mono }}>

                  {/* Waves + agents */}
                  {pipeline ? (
                    <div>
                      {[1, 2].map(wave => {
                        const waveAgentNames = WAVE_AGENTS[wave] ?? [];
                        const hasAnyActivity = waveAgentNames.some(n => agentMap[n]);
                        if (!hasAnyActivity && wave > (pipeline.wave_current ?? 1)) return null;
                        return (
                          <div key={wave} style={{ marginBottom: "0.75rem" }}>
                            <div style={{
                              fontSize: "0.72rem", color: T.textDim, fontWeight: 700,
                              textTransform: "uppercase", letterSpacing: "0.12em",
                              marginBottom: "0.4rem", borderBottom: `1px solid rgba(1,52,110,0.3)`,
                              paddingBottom: "0.2rem",
                            }}>
                              ── Этап {wave}: {WAVE_LABELS[wave]}
                            </div>
                            {waveAgentNames.map(agentName => {
                              const agent = agentMap[agentName];
                              const status = agent?.status ?? "waiting";
                              const icon = STATUS_ICON[status] ?? "○";
                              const color = STATUS_COLOR[status] ?? T.textDim;
                              const elapsed = agent?.elapsed_s;
                              const isRunning = status === "running";
                              return (
                                <div key={agentName} style={{
                                  display: "flex", alignItems: "center", gap: "0.6rem",
                                  padding: "0.22rem 0.35rem",
                                  borderRadius: 5,
                                  marginBottom: "0.1rem",
                                  background: isRunning ? "rgba(96,165,250,0.07)" : "transparent",
                                  fontSize: "0.95rem",
                                }}>
                                  <span style={{ color, fontWeight: 700, minWidth: "1.1rem", fontSize: status === "completed" ? "1.0rem" : "0.85rem", textAlign: "center" }}>
                                    {icon}
                                  </span>
                                  <span style={{
                                    color: status === "waiting" ? T.textDim : T.textMain,
                                    fontWeight: status === "completed" ? 600 : 400,
                                  }}>
                                    {AGENT_DISPLAY[agentName] ?? agentName}
                                  </span>
                                  {isRunning && (
                                    <span style={{ marginLeft: "0.4rem", color: "#60a5fa", fontSize: "0.78rem", animation: "none" }}>
                                      ● работает...
                                    </span>
                                  )}
                                  {elapsed != null && elapsed > 0 && (
                                    <span style={{ marginLeft: "auto", color: status === "completed" ? T.green : T.textDim, fontSize: "0.78rem" }}>
                                      {elapsed < 60 ? `${Math.round(elapsed)}с` : `${(elapsed / 60).toFixed(1)}м`}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fallback: простой список 6 этапов */
                    <div>
                      {([
                        [10, "Анализ рынка (TAM/SAM/SOM)"],
                        [30, "Конкурентный анализ"],
                        [50, "Целевая аудитория"],
                        [70, "Тренды и драйверы"],
                        [85, "Потребительские инсайты"],
                        [95, "Валидация данных"],
                      ] as [number, string][]).map(([threshold, label], idx) => {
                        const done = progressPct >= threshold;
                        return (
                          <div key={idx} style={{
                            display: "flex", alignItems: "center", gap: "0.6rem",
                            padding: "0.22rem 0.35rem", borderRadius: 5, fontSize: "0.95rem",
                            marginBottom: "0.1rem",
                          }}>
                            <span style={{ color: done ? T.green : T.textDim, fontWeight: 700, fontSize: done ? "1.0rem" : "0.85rem", minWidth: "1.1rem", textAlign: "center" }}>
                              {done ? "✅" : "○"}
                            </span>
                            <span style={{ color: done ? T.textMain : T.textDim, fontWeight: done ? 600 : 400 }}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Live event feed */}
                  {pipeline && pipeline.events && pipeline.events.length > 0 && (
                    <div style={{ marginTop: "0.8rem", borderTop: `1px solid rgba(1,52,110,0.4)`, paddingTop: "0.6rem" }}>
                      <div style={{ fontSize: "0.72rem", color: T.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
                        ── События
                      </div>
                      {pipeline.events.slice(-5).map((ev, i) => (
                        <div key={i} style={{ fontSize: "0.82rem", color: ev.level === "warn" ? T.orange : T.textMuted, padding: "0.1rem 0", display: "flex", gap: "0.6rem" }}>
                          <span style={{ color: T.textDim, minWidth: "3.5rem", flexShrink: 0 }}>{ev.time}</span>
                          <span>{ev.text}</span>
                        </div>
                      ))}
                      <div style={{ color: T.accent, fontSize: "0.9rem", marginTop: "0.3rem" }}>▮</div>
                    </div>
                  )}

                  {/* Research ID */}
                  <div style={{ marginTop: "0.7rem", fontSize: "0.76rem", color: T.textDim, letterSpacing: "0.04em" }}>
                    ID: {researchId}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
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
                <div className={styles.section} style={{ textAlign: "center", padding: "1.5rem 1rem 0.5rem" }}>
                  <p style={{ fontSize: "1.2rem", color: "#1e6078", fontWeight: 600, marginBottom: "1rem" }}>
                    ✅ Ваш маркетинговый отчет успешно сформирован!
                  </p>
                  {/* Краткий preview из executive summary */}
                  {buildExecutiveSummaryPreview().length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 auto", maxWidth: 600, textAlign: "left" }}>
                      {buildExecutiveSummaryPreview().map((line, i) => (
                        <li key={i} style={{ fontSize: "0.95rem", color: "#374151", padding: "0.3rem 0", borderLeft: "3px solid #D04A02", paddingLeft: "0.75rem", marginBottom: "0.4rem" }}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
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
        )}
        {researchReport && !enhancedReport && (
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

        {isCompletedView && researchId && (
          <Grade sessionId={researchId} />
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


