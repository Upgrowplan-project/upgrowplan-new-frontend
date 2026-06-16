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

// Predefined countries: value=English (sent to API/geocoding), label=English (shown to user)
// Sorted alphabetically by label. English value ensures DRA queries don't need geocoding for country part.
const COUNTRIES = [
  { value: "Argentina", label: "Argentina" },
  { value: "Armenia", label: "Armenia" },
  { value: "Australia", label: "Australia" },
  { value: "Austria", label: "Austria" },
  { value: "Azerbaijan", label: "Azerbaijan" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Belarus", label: "Belarus" },
  { value: "Belgium", label: "Belgium" },
  { value: "Brazil", label: "Brazil" },
  { value: "Bulgaria", label: "Bulgaria" },
  { value: "Canada", label: "Canada" },
  { value: "Chile", label: "Chile" },
  { value: "China", label: "China" },
  { value: "Colombia", label: "Colombia" },
  { value: "Croatia", label: "Croatia" },
  { value: "Czech Republic", label: "Czech Republic" },
  { value: "Denmark", label: "Denmark" },
  { value: "Egypt", label: "Egypt" },
  { value: "Estonia", label: "Estonia" },
  { value: "Finland", label: "Finland" },
  { value: "France", label: "France" },
  { value: "Georgia", label: "Georgia" },
  { value: "Germany", label: "Germany" },
  { value: "Greece", label: "Greece" },
  { value: "Hungary", label: "Hungary" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Ireland", label: "Ireland" },
  { value: "Israel", label: "Israel" },
  { value: "Italy", label: "Italy" },
  { value: "Japan", label: "Japan" },
  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "Kyrgyzstan", label: "Kyrgyzstan" },
  { value: "Latvia", label: "Latvia" },
  { value: "Lithuania", label: "Lithuania" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Mexico", label: "Mexico" },
  { value: "Moldova", label: "Moldova" },
  { value: "Morocco", label: "Morocco" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Norway", label: "Norway" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Peru", label: "Peru" },
  { value: "Philippines", label: "Philippines" },
  { value: "Poland", label: "Poland" },
  { value: "Portugal", label: "Portugal" },
  { value: "Romania", label: "Romania" },
  { value: "Russia", label: "Russia" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Serbia", label: "Serbia" },
  { value: "Singapore", label: "Singapore" },
  { value: "Slovakia", label: "Slovakia" },
  { value: "South Africa", label: "South Africa" },
  { value: "South Korea", label: "South Korea" },
  { value: "Spain", label: "Spain" },
  { value: "Sri Lanka", label: "Sri Lanka" },
  { value: "Sweden", label: "Sweden" },
  { value: "Switzerland", label: "Switzerland" },
  { value: "Taiwan", label: "Taiwan" },
  { value: "Tajikistan", label: "Tajikistan" },
  { value: "Tanzania", label: "Tanzania" },
  { value: "Thailand", label: "Thailand" },
  { value: "Tunisia", label: "Tunisia" },
  { value: "Turkey", label: "Turkey" },
  { value: "Ukraine", label: "Ukraine" },
  { value: "UAE", label: "United Arab Emirates" },
  { value: "UK", label: "United Kingdom" },
  { value: "USA", label: "United States" },
  { value: "Uzbekistan", label: "Uzbekistan" },
  { value: "Vietnam", label: "Vietnam" },
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
  const LAST_REQUEST_FORM_DATA_KEY = "marketResearch:lastRequestFormData:en";

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
      enhancedReport?.product_name || formData.productName || "Market research report";
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
            `Research failed: ${
              status.error || status.current_stage || "Unknown error"
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
    retail_fmcg: "Retail & FMCG",
    fashion_apparel: "Fashion & Apparel",
    electronics: "Electronics & Gadget Stores",
    food_beverage: "Food & Beverage",
    digital_apps: "Digital Apps",
    manufacturing: "Manufacturing",
    wholesale_trade: "Wholesale Trade",
    corporate_solutions: "Corporate Solutions",
    business_tech: "Business Technology",
    marketplace: "Marketplace / Platform",
    p2p_platform: "P2P Platform",
    saas_b2b: "B2B SaaS / Online Service for Business",
    saas_b2c: "B2C SaaS / Online Service for Individuals",
    cloud_platform: "Cloud Platform",
    industrial_equipment: "Industrial Equipment",
    logistics: "Logistics",
    construction: "Construction & Contractors",
    energy: "Energy",
    agriculture: "Agriculture",
    consulting: "Consulting",
    healthcare: "Healthcare & Clinics",
    education: "Education",
    tourism_hospitality: "Tourism & Hospitality",
    financial_services: "Financial Services",
    horeca: "HoReCa",
    professional_services: "Professional Services",
    wellness_fitness: "Fitness & Wellness",
    beauty_personal_care: "Beauty & Personal Care",
    home_services: "Home Services: cleaning, repairs, household",
    legal_services: "Legal Services",
    pet_services: "Pet Supplies & Veterinary",
    entertainment_media: "Entertainment & Media (online)",
    real_estate: "Real Estate",
    transport_mobility: "Transport: taxi, carsharing, mobility",
    auto_services: "Auto Service & Car Care",
    electronics_repair: "Electronics Repair & Service Centers",
    clothing_repair: "Tailoring & Clothing Repair",
    event_services: "Event Management",
    furniture_interior: "Furniture, Interior & Decor",
    pharmacy_optics: "Pharmacy & Optics",
    pet_grooming: "Pet Grooming Studio",
    childcare: "Childcare Centers & Kindergartens",
    photography_studio: "Photo & Video Studios",
    car_dealership: "Car Dealerships & Auto Markets",
    coworking: "Coworking & Office Rental",
    other: "Other",
  };

  const offeringTypeOptions = [
    { value: "product" as OfferingType, label: "Product", desc: "Physical or digital good" },
    { value: "service" as OfferingType, label: "Service", desc: "Hourly, one-time or subscription" },
    { value: "hybrid" as OfferingType, label: "Hybrid", desc: "Product + service (café, clinic)" },
  ];

  const offeringSubTypeOptions: Record<OfferingType, { value: OfferingSubType; label: string }[]> = {
    product: [
      { value: "physical", label: "Physical product" },
      { value: "digital", label: "Digital product" },
    ],
    service: [
      { value: "one_time", label: "One-time service" },
      { value: "subscription", label: "Subscription / membership" },
      { value: "hourly", label: "Hourly rate" },
    ],
    hybrid: [
      { value: "product_plus_service", label: "Product + support" },
    ],
  };

  const priceSegmentOptions = [
    { value: "budget" as PriceSegment, label: "Budget", desc: "Mass-market, low price segment" },
    { value: "mid" as PriceSegment, label: "Mid", desc: "Mid price segment" },
    { value: "premium" as PriceSegment, label: "Premium", desc: "Premium & luxury" },
  ];

  const businessTypeOptions = [
    {
      value: "B2C" as BusinessType,
      label: "B2C — Business to consumers (retail, FMCG, fashion)",
    },
    {
      value: "B2B" as BusinessType,
      label: "B2B — Business to business (manufacturing, corporate solutions)",
    },
    {
      value: "B2B2C" as BusinessType,
      label: "B2B2C — Through business to consumers",
    },
    {
      value: "C2C" as BusinessType,
      label: "C2C — Consumer to consumer (platforms, marketplaces)",
    },
    {
      value: "D2C" as BusinessType,
      label: "D2C — Direct to consumer (brands directly)",
    },
  ];

  const productTypeOptions: { value: ProductType; label: string; category: string }[] = [
    // HoReCa & Food
    { value: "horeca",              label: "HoReCa (cafés, restaurants, bars, hotels)", category: "HoReCa & Food" },
    { value: "tourism_hospitality", label: "Tourism & hospitality",                  category: "HoReCa & Food" },
    { value: "food_beverage",       label: "Food & beverages (production/sales)",     category: "HoReCa & Food" },
    // Repair & Service
    { value: "auto_services",       label: "Auto service, car wash, tire service",    category: "Repair & Service" },
    { value: "electronics_repair",  label: "Electronics repair (phones, laptops, appliances)", category: "Repair & Service" },
    { value: "home_services",       label: "Home & household (cleaning, household services, couriers)", category: "Repair & Service" },
    { value: "clothing_repair",     label: "Tailoring, clothing & shoe repair",       category: "Repair & Service" },
    // Retail & consumer goods
    { value: "retail_fmcg",         label: "Retail & FMCG (stores, supermarkets)",    category: "Retail" },
    { value: "fashion_apparel",     label: "Fashion & apparel",                       category: "Retail" },
    { value: "electronics",         label: "Electronics & gadget stores",             category: "Retail" },
    { value: "furniture_interior",  label: "Furniture, interior & decor",             category: "Retail" },
    { value: "pharmacy_optics",     label: "Pharmacy, optics, medical goods",         category: "Retail" },
    // Health & Beauty
    { value: "wellness_fitness",    label: "Fitness, yoga, wellness, spa",            category: "Health & Beauty" },
    { value: "beauty_personal_care",label: "Beauty salons, barbershops, nails",       category: "Health & Beauty" },
    { value: "healthcare",          label: "Medical clinics & diagnostics",           category: "Health & Beauty" },
    { value: "pet_services",        label: "Pet shops & veterinary",                  category: "Health & Beauty" },
    { value: "pet_grooming",        label: "Pet grooming studio (grooming & pet care)", category: "Health & Beauty" },
    // Education & professional services
    { value: "education",           label: "Education & online learning",             category: "Education & Services" },
    { value: "childcare",           label: "Childcare centers, development clubs, private kindergartens", category: "Education & Services" },
    { value: "consulting",          label: "Consulting (personal services)",          category: "Education & Services" },
    { value: "professional_services",label: "Agencies & outsourcing (marketing, HR, accounting)", category: "Education & Services" },
    { value: "legal_services",      label: "Legal services",                          category: "Education & Services" },
    { value: "event_services",      label: "Event management & agencies",             category: "Education & Services" },
    { value: "photography_studio",  label: "Photo & video studios",                   category: "Education & Services" },
    { value: "coworking",           label: "Coworking & office rental",               category: "Education & Services" },
    // Real estate & construction
    { value: "real_estate",         label: "Real estate (agencies, PropTech)",        category: "Real Estate & Construction" },
    { value: "construction",        label: "Construction & renovation",               category: "Real Estate & Construction" },
    { value: "car_dealership",      label: "Car dealerships & auto markets",          category: "Real Estate & Construction" },
    // Digital products & SaaS
    { value: "digital_apps",        label: "Mobile & web apps (B2C)",                 category: "Digital Products" },
    { value: "saas_b2b",            label: "B2B SaaS / online services for business", category: "Digital Products" },
    { value: "saas_b2c",            label: "B2C SaaS / online services for individuals", category: "Digital Products" },
    { value: "cloud_platform",      label: "Cloud platform / infrastructure",         category: "Digital Products" },
    { value: "marketplace",         label: "Marketplace / aggregator",                category: "Digital Products" },
    { value: "p2p_platform",        label: "P2P platform",                            category: "Digital Products" },
    { value: "entertainment_media", label: "Entertainment, media, streaming (online)", category: "Digital Products" },
    // B2B & industry
    { value: "manufacturing",       label: "Manufacturing",                           category: "B2B & Industry" },
    { value: "wholesale_trade",     label: "Wholesale trade",                         category: "B2B & Industry" },
    { value: "corporate_solutions", label: "Corporate solutions",                     category: "B2B & Industry" },
    { value: "business_tech",       label: "Business technology",                     category: "B2B & Industry" },
    { value: "industrial_equipment",label: "Industrial equipment",                    category: "B2B & Industry" },
    { value: "logistics",           label: "Logistics & delivery",                    category: "B2B & Industry" },
    { value: "transport_mobility",  label: "Transport: taxi, carsharing, mobility",   category: "B2B & Industry" },
    { value: "energy",              label: "Energy",                                  category: "B2B & Industry" },
    { value: "agriculture",         label: "Agriculture",                             category: "B2B & Industry" },
    // Finance
    { value: "financial_services",  label: "Financial services & insurance",          category: "Finance" },
    // General
    { value: "other",               label: "Other",                                   category: "Other" },
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
    { value: "local" as Localization, label: "Local market" },
    { value: "global" as Localization, label: "Global market" },
  ];

  const researchGoalOptions = [
    { value: "market_entry" as ResearchGoal, label: "Market entry" },
    {
      value: "product_testing" as ResearchGoal,
      label: "Product testing",
    },
    {
      value: "competitive_analysis" as ResearchGoal,
      label: "Competitive analysis",
    },
    {
      value: "target_audience" as ResearchGoal,
      label: "Target audience analysis",
    },
    {
      value: "pricing_research" as ResearchGoal,
      label: "Pricing research",
    },
    { value: "brand_awareness" as ResearchGoal, label: "Brand awareness" },
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
      setError("Please fill in all required fields");
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
        throw new Error(`System health check failed: HTTP ${healthResponse.status}`);
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
          `❌ The system is not ready to start research!\n\n` +
          `The following components are unavailable:\n${failedComponents}\n\n` +
          `Please make sure all services are running and try again.`
        );
        setIsSubmitting(false);
        console.error("[HEALTH CHECK] System not ready:", failedComponents);
        return;
      }

      console.log("[HEALTH CHECK] ✓ Все критические компоненты готовы!");

    } catch (healthError) {
      console.error("[HEALTH CHECK] Error:", healthError);
      setError(
        `❌ Failed to check system readiness: ${healthError instanceof Error ? healthError.message : String(healthError)}\n\n` +
        `Make sure the Market Research Service is running on port 8005.`
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
          `Failed to start research (${response.status}). ` +
            `Make sure the backend service is running at ${apiBaseUrl}. ` +
            `Error: ${errorText.substring(0, 200)}`
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
          `Failed to connect to the backend service. ` +
            `Make sure the market research service is running at ${
              process.env.NEXT_PUBLIC_SOLUTIONS_API_URL ||
              "http://localhost:8002"
            }. ` +
            `Error: ${err.message || "Connection refused"}`
        );
      } else {
        setError(err.message || "Error starting research");
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
          "Research is taking too long. Sync the status or start it again."
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
              setError("Temporary network/API errors. Try refreshing the status or restarting the research.");
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
            setError(`Unable to fetch research status (HTTP ${response.status}).`);
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
            `Research failed: ${
              status.error || status.current_stage || "Unknown error"
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
              `Unable to fetch research status. Check the service at ${apiBaseUrl}.`
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
              `Unable to fetch research status. Error: ${
                err.message || "Unknown error"
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
            `Failed to fetch the report. Status: ${enhancedResponse.status}. Make sure the backend service is running at ${apiBaseUrl}`
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
          `Server error while fetching the report (${enhancedResponse.status}). ` +
            `Make sure the market research backend service is running at ${apiBaseUrl}. ` +
            `Error: ${errorText.substring(0, 200)}`
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
          `Failed to connect to the backend service at ${apiBaseUrl}. ` +
            `Make sure the market research service is running. ` +
            `Error: ${err.message || "Connection refused"}`
        );
      } else {
        setError(
          `Error fetching the report: ${err.message || "Unknown error"}`
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
        throw new Error(`Error downloading the ${format.toUpperCase()} file`);
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
        err.message || `Error downloading the ${format.toUpperCase()} file`
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
              MarketSense — AI Market Research Tool
            </h1>
            <p className={styles.heroDescription}>
              Live web research, competitor analysis, and market sizing.
              MarketSense helps founders and analysts collect live web data,
              validate sources, map competitors, segment the target audience,
              and estimate market size in minutes, not weeks.
            </p>
          </div>
        </div>

        {error && (
          <div className={styles.errorSection}>
            <div className={styles.errorAlert}>
              <FiAlertCircle className={styles.errorIcon} size={24} />
              <div className={styles.errorContent}>
                <h3 className={styles.errorTitle}>Error</h3>
                <p className={styles.errorMessage}>{error}</p>
                <button
                  className={styles.retryButton}
                  onClick={() => setError(null)}
                >
                  Close
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
                  <FiAlertCircle size={20} /> Please review your request
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
                <strong style={{ color: "#8a6d1f" }}>Warnings (you can proceed):</strong>
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
                      Checking system status…
                    </span>
                  </>
                ) : (
                  <>
                    <FiAlertCircle color="#b42318" />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#b42318" }}>
                      Could not get system status
                    </span>
                    <button
                      type="button"
                      className={styles.healthRefreshButton}
                      onClick={() => fetchHealthStatus(true)}
                      disabled={isRefreshingHealth}
                      title="Retry check"
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
                title="Show/hide component details"
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
                    {healthStatus.all_ready ? "System is ready" : "System not ready"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>{readyCount}/{agents.length}</span>
                  <span style={{ flex: 1 }} />
                  <button
                    type="button"
                    className={styles.healthRefreshButton}
                    onClick={(e) => { e.stopPropagation(); fetchHealthStatus(true); }}
                    disabled={isRefreshingHealth}
                    title="Refresh service statuses"
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
                            {agent.optional && <span style={{ color: "#856404", fontSize: "0.72rem", marginLeft: "0.25rem" }}>(opt.)</span>}
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
                <strong style={{ color: '#856404', fontSize: '0.95rem' }}>System not ready</strong>
                <p style={{ margin: '0.25rem 0 0', color: '#856404', fontSize: '0.9rem' }}>
                  Some system components are unavailable. Research will be available only once all required components are ready.
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
                { label: "Market size — TAM / SAM / SOM", agent: "MarketSizingAgent" },
                { label: "Competitive analysis", agent: "CompetitorAnalysisAgent" },
                { label: "Competitor pricing analysis", agent: "CompetitorAnalysisAgent" },
                { label: "Target audience & segments", agent: "TargetAudienceAgent" },
                { label: "Market trends & drivers", agent: "TrendsAnalysisAgent" },
                { label: "Consumer insights", agent: "ConsumerInsightsAgent" },
                { label: "Strategic recommendations", agent: "ValidationAgent" },
              ];
              const location = [formData.region, formData.country].filter(Boolean).join(", ");
              const goals = formData.researchGoals
                .map((g) => researchGoalOptions.find((o) => o.value === g)?.label || g)
                .join(" · ");
              const industry = productTypeToIndustry[formData.productTypes[0]] ?? formData.productTypes[0];
              const summaryRows: [string, string][] = [
                ["Product", formData.productName],
                ["Location", location || "—"],
                ["Business type", formData.businessTypes.join(", ")],
                ["Industry", industry],
                ["Goals", goals],
              ];
              if (formData.priceSegment) {
                summaryRows.push(["Segment", priceSegmentOptions.find((o) => o.value === formData.priceSegment)?.label || formData.priceSegment]);
              }
              return (
                <div>
                  <h2 style={{ marginBottom: "0.35rem" }}>Researching your market</h2>
                  <p className={styles.formDescription} style={{ marginBottom: "1.1rem" }}>
                    This takes ~10–15 minutes — 6 agents gather data from real sources.
                    You can keep the tab open; progress and logs are below.
                  </p>

                  {/* Сводка запроса — подтверждение «что исследуем» */}
                  <div style={{ border: "1px solid #e3e8ef", background: "#f8fafc", borderRadius: 12, padding: "0.9rem 1.1rem", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.6rem", color: "#0b1a21" }}>What we're researching</div>
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
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.6rem", color: "#0b1a21" }}>What's in the report</div>
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
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem", color: "#0b1a21" }}>While the analysis runs</div>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#334155", fontSize: "0.86rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <li>Data from real sources — Google Places, Statista, industry reports. We don't invent numbers.</li>
                      <li>Every metric is tied to a source; modeled estimates are honestly flagged as indicative.</li>
                      <li>The result is comprehensive: market, competitors, audience, trends, insights, pricing and strategy.</li>
                    </ul>
                    <div style={{ marginTop: "0.55rem", fontSize: "0.8rem", color: "#64748b" }}>
                      You can stop at any time — the session is kept for up to 1 hour.
                    </div>
                  </div>
                </div>
              );
            })() : (
              <>
                <h2>Research data</h2>
                <p className={styles.formDescription}>
                  Tell us about your idea or project. The more detail you
                  provide, the more accurate and relevant the market research
                  will be. Fields marked with an asterisk (*) are required.
                </p>
              </>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Поля формы скрываются во время исследования — показываются снова при паузе */}
              {(!isSubmitting || isResearchPaused) && (<>
              <div className={styles.section}>
                <h3>Basic information</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Product or service name *
                  </label>
                  <input
                    ref={productNameInputRef}
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., Specialty coffee shop"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Description *</label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Describe your product or service as you see it ..."
                    rows={4}
                    required
                  />
                </div>

                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    >
                      <option value="">— Select a country —</option>
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
                        ⚠️ Public data for this market may be limited — the report may have lower confidence.
                      </p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Region (optional)</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="e.g., San Diego"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Business type * (multiple choice)</h3>
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
                <h3>Product or service type * (multiple choice)</h3>
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
                              aria-label={`Remove ${opt?.label}`}
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
                <h3>Market localization *</h3>
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
                <h3>Research goals * (multiple choice)</h3>
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
                <h3>Offering type (optional)</h3>
                <p className={styles.formDescription} style={{ marginBottom: "0.75rem" }}>
                  Helps pinpoint the audience and competitive field
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
                    <label className={styles.label} style={{ marginBottom: "0.5rem" }}>Specify the type</label>
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
                <h3>Price segment (optional)</h3>
                <p className={styles.formDescription} style={{ marginBottom: "0.75rem" }}>
                  Affects competitor and target-audience analysis
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
                <h3>Additional information</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Target audience (optional)
                  </label>
                  <textarea
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Describe how you picture your target audience..."
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Known competitors (optional)
                  </label>
                  <input
                    type="text"
                    name="competitors"
                    value={formData.competitors}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., Starbucks, local coffee shop"
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
                        Collecting and analyzing data ...
                      </>
                    ) : !healthStatus?.all_ready ? (
                      <>
                        <FiAlertCircle />
                        System not ready
                      </>
                    ) : (
                      <>
                        <FiBarChart2 />
                        Start research
                      </>
                    )}
                  </button>

                  {isSubmitting && (
                    <button
                      type="button"
                      className={styles.stopButton}
                      onClick={handlePauseResearch}
                    >
                      Stop
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.pausedActionsRow}>
                  {/* Сообщение о паузе */}
                  <div className={styles.pauseInfoBanner}>
                    <span style={{ fontSize: "1.15rem" }}>⏸</span>
                    <div>
                      <strong>Research paused</strong>
                      <p>
                        The backend keeps running — no data is lost.
                        The session is kept <strong>for up to 1 hour</strong>. Click “Resume”
                        to return to the results, or “Edit request” to
                        change the parameters and start a new research.
                      </p>
                    </div>
                  </div>
                  <div className={styles.pausedButtons}>
                    <button
                      type="button"
                      className={styles.resumeButton}
                      onClick={handleResumeResearch}
                    >
                      ▶ Resume research
                    </button>
                    <button
                      type="button"
                      className={styles.restartButton}
                      onClick={handleRestartResearch}
                    >
                      ✎ Edit request
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
            1: "Data collection (5 agents)",
            2: "Review & validation",
          };
          const WAVE_AGENTS: Record<number, string[]> = {
            1: ["MarketSizingAgent", "CompetitorAnalysisAgent", "TargetAudienceAgent", "TrendsAnalysisAgent", "ConsumerInsightsAgent"],
            2: ["ValidationAgent"],
          };
          const AGENT_DISPLAY: Record<string, string> = {
            "MarketSizingAgent":       "Market analysis (TAM/SAM/SOM)",
            "CompetitorAnalysisAgent": "Competitive analysis",
            "TargetAudienceAgent":     "Target audience",
            "TrendsAnalysisAgent":     "Trends & drivers",
            "ConsumerInsightsAgent":   "Consumer insights",
            "ValidationAgent":         "Data validation",
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
                    {etaMin !== null && etaMin > 0 && ` — ~${etaMin} min`}
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
                              ── Stage {wave}: {WAVE_LABELS[wave]}
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
                                      ● running...
                                    </span>
                                  )}
                                  {elapsed != null && elapsed > 0 && (
                                    <span style={{ marginLeft: "auto", color: status === "completed" ? T.green : T.textDim, fontSize: "0.78rem" }}>
                                      {elapsed < 60 ? `${Math.round(elapsed)}s` : `${(elapsed / 60).toFixed(1)}m`}
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
                        [10, "Market analysis (TAM/SAM/SOM)"],
                        [30, "Competitive analysis"],
                        [50, "Target audience"],
                        [70, "Trends & drivers"],
                        [85, "Consumer insights"],
                        [95, "Data validation"],
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
                        ── Events
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
                <h2>Market research report</h2>
                <p className={styles.reportSubtitle}>{buildCompletionSubtitle()}</p>
              </div>
              <div className={styles.resultsBody}>
                <div className={styles.section} style={{ textAlign: "center", padding: "1.5rem 1rem 0.5rem" }}>
                  <p style={{ fontSize: "1.2rem", color: "#1e6078", fontWeight: 600, marginBottom: "1rem" }}>
                    ✅ Your market research report is ready!
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
                        <><FiDownload className={styles.spinIcon} /> Downloading report...</>
                      ) : (
                        <><FiFile /> Download DOCX</>
                      )}
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("pdf")}
                      disabled={!!downloadingFormat}
                      style={{ backgroundColor: "#dc2626", ...(downloadingFormat === "pdf" ? { opacity: 0.7, cursor: "wait" } : {}) }}
                    >
                      {downloadingFormat === "pdf" ? (
                        <><FiDownload className={styles.spinIcon} /> Downloading report...</>
                      ) : (
                        <><FiDownload /> Download PDF</>
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
                    <FiRefreshCw /> Run another research
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
                <h2>Market research report</h2>
                <p className={styles.reportSubtitle}>{buildCompletionSubtitle()}</p>
              </div>
              <div className={styles.resultsBody}>
                {/* СООБЩЕНИЕ: ОТЧЕТ ГОТОВ */}
                <div className={styles.section}>
                  <p style={{ fontSize: '1.2rem', textAlign: 'center', padding: '2rem 1rem', color: '#1e6078', fontWeight: 600 }}>
                    ✅ Your market research report is ready!
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
                        <><FiDownload className={styles.spinIcon} /> Downloading report...</>
                      ) : (
                        <><FiFile /> Download DOCX</>
                      )}
                    </button>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleDownload("pdf")}
                      disabled={!!downloadingFormat}
                      style={{ backgroundColor: "#dc2626", ...(downloadingFormat === "pdf" ? { opacity: 0.7, cursor: "wait" } : {}) }}
                    >
                      {downloadingFormat === "pdf" ? (
                        <><FiDownload className={styles.spinIcon} /> Downloading report...</>
                      ) : (
                        <><FiDownload /> Download PDF</>
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
                    <FiRefreshCw /> Run another research
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
              <strong>Important:</strong> This is a beta version of the service.
              Results may be incomplete. The service uses AI agents and live web
              search to gather and verify data.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


