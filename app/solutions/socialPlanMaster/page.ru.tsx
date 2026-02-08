"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import styles from "./socialPlanMaster.module.css";
import {
  FiBarChart2,
  FiCheck,
  FiAlertCircle,
  FiDownload,
  FiFile,
  FiRefreshCw,
} from "react-icons/fi";

type BusinessType = "B2B" | "B2C" | "B2B2C" | "C2C" | "D2C";
type FundingPurpose =
  | "working_capital"
  | "equipment"
  | "transport"
  | "property";

interface FormData {
  businessIdea: string;
  region: string;
  city: string;
  hasExactAddress: boolean;
  exactAddress: string;
  businessTypes: BusinessType[];
  fundingPurposes: FundingPurpose[];
  ownCapital: string;
  investedOwn: string;
  loanCapital: string;
  investedLoan: string;
  spendingPeriod: string;
  plannedHeadcount?: string;
  businessRegistered?: "yes" | "no";
  businessLegalForm?: "self_employed" | "ip" | "ooo";
  initiatorProfile?: string;
  okvadCode?: string;
}

interface SynthesisStatus {
  synthesis_id: string;
  current_stage: string;
  progress: number;
  error?: string;
  logs?: string[];
  status?:
    | "pending"
    | "in_progress"
    | "completed"
    | "failed"
    | "needs_adjustment";
  recommendations?: Array<{
    type: string;
    text: string;
    action: string;
    adjustment?: any;
  }>;
  problems?: Array<{
    type: string;
    severity: string;
    reality_check: string;
    expert_risk: string;
    context: any;
  }>;
  financials_preview?: {
    net_profit_monthly: number;
    ebitda_monthly: number;
    total_investment: number;
    payback_months: number;
  };
}

interface SynthesisResult {
  synthesis_id: string;
  status: string;
  market_research_quality: string;
  warnings: string[];
  tech_chain?: any;
  marketing_plan?: any;
  social_analysis?: any;
  docx_path?: string;
  created_at?: string;
  synthesis_text?: string;
  financials?: any;
}

const cleanMarkdown = (text: string): string => {
  if (!text) return "";

  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^[\s]*[-*•]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`(.+?)`/g, "$1")
    .trim();
};

export default function SocialPlanMasterPage() {
  const businessIdeaInputRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState<FormData>({
    businessIdea: "",
    region: "",
    city: "",
    hasExactAddress: false,
    exactAddress: "",
    businessTypes: [],
    fundingPurposes: [],
    ownCapital: "",
    investedOwn: "",
    loanCapital: "",
    investedLoan: "",
    spendingPeriod: "",
    plannedHeadcount: "",
    businessRegistered: "no",
    businessLegalForm: undefined,
    initiatorProfile: "",
    okvadCode: "",
  });

  const [synthesisId, setSynthesisId] = useState<string | null>(null);
  const [synthesisStatus, setSynthesisStatus] =
    useState<SynthesisStatus | null>(null);
  const [synthesisResult, setSynthesisResult] =
    useState<SynthesisResult | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAdjustments, setSelectedAdjustments] = useState<string[]>([]);

  const [synthesisStartTime, setSynthesisStartTime] = useState<number | null>(
    null,
  );
  const [synthesisDuration, setSynthesisDuration] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (businessIdeaInputRef.current) {
      businessIdeaInputRef.current.focus();
    }

    return () => {
      if (pollingIntervalRef.current) {
        console.log(
          "[Social Plan Master] Cleaning up polling interval on unmount",
        );
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const healthApiBaseUrl =
          process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL ||
          "http://localhost:8004";
        console.log(
          "[Health Check] Fetching from:",
          `${healthApiBaseUrl}/api/health`,
        );
        const response = await fetch(`${healthApiBaseUrl}/api/health`);

        if (response.ok) {
          const data = await response.json();
          console.log("[Health Check] ✅ Data received:", data);
          setHealthStatus(data);
        } else {
          console.error(
            "[Health Check] Failed to fetch health status:",
            response.status,
          );
        }
      } catch (error) {
        console.error("[Health Check] Error fetching health status:", error);
      } finally {
        setIsLoadingHealth(false);
      }
    };

    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const businessTypeOptions = [
    {
      value: "B2C" as BusinessType,
      label: "B2C - Потребители",
    },
    {
      value: "B2B" as BusinessType,
      label: "B2B - Бизнес",
    },
    {
      value: "B2B2C" as BusinessType,
      label: "B2B2C - Комбо",
    },
    {
      value: "C2C" as BusinessType,
      label: "C2C - P2P",
    },
    {
      value: "D2C" as BusinessType,
      label: "D2C - Прямые продажи",
    },
  ];

  const fundingPurposeOptions = [
    { value: "working_capital" as FundingPurpose, label: "Оборотные средства" },
    { value: "equipment" as FundingPurpose, label: "Оборудование" },
    { value: "transport" as FundingPurpose, label: "Транспорт" },
    { value: "property" as FundingPurpose, label: "Недвижимость" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleFundingPurposeToggle = (purpose: FundingPurpose) => {
    setFormData((prev) => ({
      ...prev,
      fundingPurposes: prev.fundingPurposes.includes(purpose)
        ? prev.fundingPurposes.filter((p) => p !== purpose)
        : [...prev.fundingPurposes, purpose],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Clear previous results and reset timer for new generation
    setSynthesisResult(null);
    setSynthesisDuration(null);
    setSynthesisStartTime(Date.now()); // Set NEW start time

    console.log("[Social Plan Master] Starting synthesis submission...");
    console.log("[Social Plan Master] Form data:", formData);

    if (
      !formData.businessIdea ||
      !formData.region ||
      !formData.city ||
      formData.businessTypes.length === 0 ||
      formData.fundingPurposes.length === 0 ||
      !formData.ownCapital ||
      !formData.loanCapital ||
      !formData.spendingPeriod
    ) {
      setError("Пожалуйста, заполните все обязательные поля");
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        business_idea: formData.businessIdea,
        region: formData.region,
        city: formData.city,
        exact_address:
          formData.hasExactAddress && formData.exactAddress.trim()
            ? formData.exactAddress.trim()
            : undefined,
        business_types: formData.businessTypes,
        funding_purposes: formData.fundingPurposes,
        own_capital: parseInt(formData.ownCapital),
        invested_own: parseInt(formData.investedOwn) || 0,
        loan_capital: parseInt(formData.loanCapital),
        invested_loan: parseInt(formData.investedLoan) || 0,
        spending_period_months: parseInt(formData.spendingPeriod),
        team_count: formData.plannedHeadcount
          ? parseInt(formData.plannedHeadcount)
          : undefined,
        business_registered: formData.businessRegistered === "yes",
        business_legal_form: formData.businessLegalForm,
        initiator_profile: formData.initiatorProfile,
        okvad_code: formData.okvadCode,
      };

      console.log(
        "[Social Plan Master] Sending request to synthesis-service...",
      );
      console.log("[Social Plan Master] Request data:", requestData);

      const apiBaseUrl = "http://localhost:8004";

      const response = await fetch(`${apiBaseUrl}/api/synthesis/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("[Social Plan Master] Response status:", response.status);

      // Handle validation errors (422 - business plan validation failed)
      if (response.status === 422) {
        console.log("[Social Plan Master] Validation error detected (422)");
        try {
          const errorData = await response.json();
          console.log("[Social Plan Master] Error data:", errorData);

          const errorMessage =
            errorData.message ||
            errorData.error ||
            "Бизнес-план не прошел валидацию. Проверьте финансовые показатели.";

          setError(`⚠️ Бизнес-план отклонен валидацией:\n\n${errorMessage}`);
          setIsSubmitting(false);
          setSynthesisStartTime(null); // Сброс времени при ошибке
          return;
        } catch (parseError) {
          console.error(
            "[Social Plan Master] Failed to parse 422 response:",
            parseError,
          );
          const errorText = await response.text().catch(() => "Unknown error");
          setError(`⚠️ Бизнес-план отклонен валидацией:\n\n${errorText}`);
          setIsSubmitting(false);
          setSynthesisStartTime(null); // Сброс времени при ошибке
          return;
        }
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        setSynthesisStartTime(null); // Сброс времени при ошибке
        throw new Error(
          `Ошибка запуска синтеза (${response.status}). ` +
            `Проверьте, что бэкенд сервис запущен на ${apiBaseUrl}. ` +
            `Ошибка: ${errorText.substring(0, 200)}`,
        );
      }

      const result = await response.json();
      console.log(
        "[Social Plan Master] Synthesis started with ID:",
        result.synthesis_id,
      );
      console.log("[Social Plan Master] Initial status:", result);

      setSynthesisId(result.synthesis_id);
      setSynthesisStatus(result);
      pollSynthesisStatus(result.synthesis_id);
    } catch (err: any) {
      console.error("[Social Plan Master] Error starting synthesis:", err);
      setSynthesisStartTime(null); // Сброс времени при любой ошибке
      if (
        err.message?.includes("fetch") ||
        err.message?.includes("network") ||
        err.code === "ECONNREFUSED" ||
        err.message?.includes("Failed to fetch")
      ) {
        setError(
          `Не удалось подключиться к бэкенд сервису. ` +
            `Убедитесь, что сервис синтеза запущен на http://localhost:8004. ` +
            `Ошибка: ${err.message || "Соединение отклонено"}`,
        );
      } else {
        setError(err.message || "Ошибка при запуске синтеза");
      }
      setIsSubmitting(false);
    }
  };

  const pollSynthesisStatus = async (id: string) => {
    console.log("=".repeat(80));
    console.log("🔄 [POLLING] Starting status polling for ID:", id);
    console.log("=".repeat(80));

    if (pollingIntervalRef.current) {
      console.log(
        "⚠️ [POLLING] Clearing existing interval before starting new one",
      );
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    let retries = 0;
    const maxRetries = 3;
    const pollInterval = 2000;
    let pollCount = 0;

    let previousStatus = "";
    let previousProgress = -1;
    let previousStage = "";

    const apiBaseUrl = "http://localhost:8004";

    const interval = setInterval(async () => {
      pollCount++;

      try {
        const response = await fetch(`${apiBaseUrl}/api/synthesis/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const status: SynthesisStatus = await response.json();

        retries = 0;

        previousStatus = status.status || "";
        previousProgress = status.progress;
        previousStage = status.current_stage || "";

        setSynthesisStatus(status);

        if (status.status === "completed") {
          console.log("=".repeat(80));
          console.log("✅ ✅ ✅ SYNTHESIS COMPLETED! ✅ ✅ ✅");
          console.log("=".repeat(80));
          console.log("[Social Plan Master] Fetching result...");

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          clearInterval(interval);
          setIsSubmitting(false);

          if (synthesisStartTime) {
            const endTime = Date.now();
            const durationMs = endTime - synthesisStartTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            setSynthesisDuration({ minutes, seconds });
            console.log(
              `[Social Plan Master] Duration: ${minutes} min ${seconds} sec`,
            );
          }

          fetchSynthesisResult(id);
        } else if (
          status.status === "failed" ||
          status.status === "needs_adjustment"
        ) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          clearInterval(interval);
          setIsSubmitting(false);

          if (status.status === "needs_adjustment") {
            setError(status.error || "Бизнес-план требует корректировки");
          } else {
            setError(
              `Синтез не удалось выполнить: ${
                status.error || "Неизвестная ошибка"
              }`,
            );
          }
          setSynthesisStartTime(null); // Сброс времени при ошибке синтеза
        }
      } catch (err: any) {
        console.error(`❌ [POLLING #${pollCount}] Error:`, err);
        retries++;

        if (retries >= maxRetries) {
          console.error(
            `❌ [POLLING] Max retries (${maxRetries}) reached. Stopping polling.`,
          );
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          clearInterval(interval);
          setIsSubmitting(false);
          setSynthesisStartTime(null); // Сброс времени при ошибке поллинга
          setError(`Ошибка при опросе статуса: ${err.message}`);
        }
      }
    }, pollInterval);

    pollingIntervalRef.current = interval;
  };

  const fetchSynthesisResult = async (id: string) => {
    try {
      const apiBaseUrl = "http://localhost:8004";

      const response = await fetch(`${apiBaseUrl}/api/synthesis/${id}/result`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка получения результата: ${response.status}`);
      }

      const result: SynthesisResult = await response.json();
      console.log("[Social Plan Master] Result fetched:", result);
      setSynthesisResult(result);
    } catch (err: any) {
      console.error("[Social Plan Master] Error fetching result:", err);
      setError(`Ошибка при получении результата: ${err.message}`);
    }
  };

  const handleDownloadDocx = async () => {
    if (!synthesisId) {
      setError("ID синтеза не найден");
      return;
    }

    try {
      const apiBaseUrl = "http://localhost:8004";
      const response = await fetch(
        `${apiBaseUrl}/api/synthesis/download/${synthesisId}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка скачивания: ${response.status}`,
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `social-plan-${synthesisId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("[Social Plan Master] Document downloaded successfully");
    } catch (err: any) {
      console.error("[Social Plan Master] Error downloading document:", err);
      setError(`Ошибка при скачивании документа: ${err.message}`);
    }
  };

  const handleContinueGeneration = async () => {
    if (!synthesisId || selectedAdjustments.length === 0) return;

    // Если выбран «вручную» / «пересмотреть концепцию» — возврат к форме
    const manualActions = ["manual_fix", "stop_generation", "add_funds"];
    if (selectedAdjustments.some((a) => manualActions.includes(a))) {
      handleReset();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSelectedAdjustments([]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL || "http://localhost:8004"}/api/synthesis/${synthesisId}/continue`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected_actions: selectedAdjustments,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      // Перезапускаем polling
      pollSynthesisStatus(synthesisId);
    } catch (err: any) {
      setError(`Ошибка при продолжении генерации: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const toggleAdjustment = (actionType: string) => {
    setSelectedAdjustments((prev) =>
      prev.includes(actionType)
        ? prev.filter((t) => t !== actionType)
        : [...prev, actionType],
    );
  };

  const handleReset = () => {
    setSynthesisId(null);
    setSynthesisStatus(null);
    setSynthesisResult(null);
    setError(null);
    setActiveSection("overview");
    setSynthesisStartTime(null);
    setSynthesisDuration(null);
    setSelectedAdjustments([]);
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Генератор бизнес-плана для социального контракта</h1>
            <p className={styles.heroDescription}>
              Создайте комплексный бизнес-план для вашего бизнеса с анализом
              рынка, целевой аудитории и стратегическими рекомендациями
            </p>
          </div>
        </section>

        {/* Error Display (только для реальных ошибок, НЕ для needs_adjustment) */}
        {error && synthesisStatus?.status !== "needs_adjustment" && (
          <div className={styles.errorBox}>
            <div className={styles.errorContent}>
              <FiAlertCircle className={styles.errorIcon} />
              <div>
                <h3>Ошибка</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Results */}
        {isSubmitting || synthesisResult ? (
          <section className={styles.resultsSection}>
            {isSubmitting && synthesisStatus && (
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <FiBarChart2 className={styles.progressIcon} />
                  <h2>Синтез в процессе...</h2>
                </div>

                <div className={styles.progressDetails}>
                  <div className={styles.progressHeaderInfo}>
                    <p className={styles.stageText}>
                      {synthesisStatus.current_stage || "Инициализация..."}
                    </p>
                    <span className={styles.progressPercent}>
                      {synthesisStatus.progress}%
                    </span>
                  </div>
                  <div className={styles.progressBarWrapper}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${Math.min(synthesisStatus.progress, 100)}%`,
                      }}
                    />
                  </div>

                  {/* Key Progress Events */}
                  <div className={styles.progressEventsContainer}>
                    <h4 className={styles.eventsTitle}>📊 Ключевые этапы:</h4>
                    <div className={styles.progressEventsList}>
                      {/* Extract key progress from logs */}
                      {synthesisStatus.logs &&
                        synthesisStatus.logs.length > 0 && (
                          <>
                            {synthesisStatus.logs
                              .filter((log) =>
                                /\[INFO\]|ЭТАП|Архетип|Deep Research|DOCX|Финан|ГОТОВ/.test(
                                  log,
                                ),
                              )
                              .slice(-5)
                              .map((log, idx) => {
                                const match = log.match(/\[([^\]]+)\]/);
                                const timestamp = match ? match[1] : "";
                                const message = log
                                  .replace(/\[[^\]]*\]/g, "")
                                  .trim();
                                return (
                                  <div
                                    key={idx}
                                    className={styles.progressEvent}
                                  >
                                    <span className={styles.eventTime}>
                                      {timestamp}
                                    </span>
                                    <span className={styles.eventMessage}>
                                      {message}
                                    </span>
                                  </div>
                                );
                              })}
                          </>
                        )}
                    </div>
                  </div>
                </div>

                {/* Full Logs */}
                {synthesisStatus.logs && synthesisStatus.logs.length > 0 && (
                  <div className={styles.fullLogsContainer}>
                    <div className={styles.logsHeader}>
                      <h4>📝 Полные логи синтеза:</h4>
                      <span className={styles.logCount}>
                        ({synthesisStatus.logs.length} событий)
                      </span>
                    </div>
                    <div className={styles.logsScroll}>
                      {synthesisStatus.logs.map((log, idx) => {
                        const isError = log.includes("[ERROR]");
                        const isWarning = log.includes("[WARNING]");
                        const isDeepSearch = log.includes("[DEEP_SEARCH]");
                        return (
                          <div
                            key={idx}
                            className={`${styles.logLine} ${
                              isError
                                ? styles.logError
                                : isWarning
                                  ? styles.logWarning
                                  : isDeepSearch
                                    ? styles.logDeepSearch
                                    : ""
                            }`}
                          >
                            <span className={styles.logNumber}>{idx + 1}</span>
                            <span className={styles.logText}>{log}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Smart Adjuster Recommendations */}
                {synthesisStatus.status === "needs_adjustment" && (
                  <div className={styles.adjustmentCard}>
                    {/* Заголовок */}
                    <div className={styles.adjustmentHeader}>
                      <FiAlertCircle className={styles.adjustmentIcon} />
                      <h3>Внимание: {synthesisStatus.error}</h3>
                    </div>

                    {/* Блок 1: Reality Check — что не сходится */}
                    {synthesisStatus.problems?.map((problem, idx) => (
                      <div key={idx} className={styles.problemBlock}>
                        <div className={styles.realityCheck}>
                          <p>{problem.reality_check}</p>
                        </div>
                        {/* Блок 2: Expert Risk — почему это плохо */}
                        <div className={styles.expertRisk}>
                          <p style={{ fontWeight: 500, marginBottom: "4px" }}>
                            Почему это важно:
                          </p>
                          <p>{problem.expert_risk}</p>
                        </div>
                      </div>
                    ))}

                    {/* Блок 3: Варианты решения */}
                    <p
                      style={{
                        margin: "16px 0 8px",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                      }}
                    >
                      Что мы можем сделать?
                    </p>
                    <div className={styles.recommendationsList}>
                      {synthesisStatus.recommendations?.map((rec, idx) => (
                        <div
                          key={idx}
                          className={`${styles.recItem} ${selectedAdjustments.includes(rec.type) ? styles.recItemSelected : ""}`}
                          onClick={() => toggleAdjustment(rec.type)}
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedAdjustments.includes(rec.type)}
                              onChange={() => toggleAdjustment(rec.type)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ accentColor: "#4f46e5" }}
                            />
                            <div className={styles.recText}>{rec.text}</div>
                          </div>
                          <div className={styles.recAction}>{rec.action}</div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.adjustmentActions}>
                      <button
                        className={styles.fixManuallyBtn}
                        onClick={handleReset}
                      >
                        Исправить вручную
                      </button>
                      <button
                        className={styles.autoFixBtn}
                        onClick={handleContinueGeneration}
                        disabled={
                          selectedAdjustments.length === 0 || isSubmitting
                        }
                      >
                        {isSubmitting ? "Генерация..." : "Продолжить генерацию"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {synthesisResult && (
              <>
                <div className={styles.successCard}>
                  <div className={styles.successHeader}>
                    <FiCheck className={styles.successIcon} />
                    <h2>Синтез успешно завершен!</h2>
                  </div>
                  {synthesisDuration && (
                    <p className={styles.durationText}>
                      ⏱️ Время синтеза: {synthesisDuration.minutes} мин{" "}
                      {synthesisDuration.seconds} сек
                    </p>
                  )}
                </div>

                {/* Results Content - ТОЛЬКО РЕЗЮМЕ */}
                <div className={styles.resultsContent}>
                  <div className={styles.resultCard}>
                    <h3>Резюме проекта</h3>
                    <div className={styles.synthesisTextContainer}>
                      {synthesisResult.synthesis_text ? (
                        <div
                          className={styles.synthesisText}
                          dangerouslySetInnerHTML={{
                            __html: synthesisResult.synthesis_text
                              .replace(/\n/g, "<br />")
                              .replace(/### (.*?)<br \/>/g, "<h4>$1</h4>")
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/- /g, "• "),
                          }}
                        />
                      ) : (
                        <p>Текст синтеза недоступен</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Download and Reset Buttons */}
                <div className={styles.actionButtons}>
                  <button
                    className={styles.downloadBtn}
                    onClick={handleDownloadDocx}
                  >
                    <FiDownload /> Скачать DOCX
                  </button>
                  <button className={styles.resetBtn} onClick={handleReset}>
                    <FiRefreshCw /> Начать заново
                  </button>
                </div>
              </>
            )}
          </section>
        ) : (
          /* Form Section */
          <section className={styles.formSection}>
            <div className={styles.card}>
              <h2>Внесите ваши данные</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Business Idea */}
                <div className={styles.section}>
                  <h3>📋 Описание идеи бизнеса *</h3>
                  <textarea
                    ref={businessIdeaInputRef}
                    name="businessIdea"
                    placeholder="Описание вашей бизнес-идеи (что вы хотите продавать, кому, почему это нужно)"
                    value={formData.businessIdea}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={4}
                  />
                </div>

                {/* Region and City */}
                <div className={styles.doubleRow}>
                  <div className={styles.section}>
                    <h3>🗺️ Регион *</h3>
                    <input
                      type="text"
                      name="region"
                      placeholder="Например: Калининградская область"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.section}>
                    <h3>🏙️ Город *</h3>
                    <input
                      type="text"
                      name="city"
                      placeholder="Например: Зеленоградск"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Exact Address */}
                <div className={styles.section}>
                  <div className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      id="hasExactAddress"
                      name="hasExactAddress"
                      checked={formData.hasExactAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasExactAddress: e.target.checked,
                          exactAddress: e.target.checked
                            ? prev.exactAddress
                            : "",
                        }))
                      }
                      className={styles.checkbox}
                    />
                    <label
                      htmlFor="hasExactAddress"
                      className={styles.checkboxLabel}
                    >
                      📍 Есть точный адрес бизнеса
                    </label>
                  </div>
                  {formData.hasExactAddress && (
                    <div className={styles.addressField}>
                      <input
                        type="text"
                        name="exactAddress"
                        placeholder="Например: ул. Ленина, д. 15"
                        value={formData.exactAddress}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                      <p className={styles.hint}>
                        Укажите точный адрес для расчёта расстояния до
                        конкурентов
                      </p>
                    </div>
                  )}
                </div>

                {/* Business Types */}
                <div className={styles.section}>
                  <h3>💼 Тип бизнеса *</h3>
                  <div className={styles.buttonGroupInline}>
                    {businessTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.toggleButton} ${
                          formData.businessTypes.includes(option.value)
                            ? styles.active
                            : ""
                        }`}
                        onClick={() => handleBusinessTypeToggle(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Funding Purposes */}
                <div className={styles.section}>
                  <h3>💸 На какие цели требуется финансирование *</h3>
                  <div className={styles.buttonGroup}>
                    {fundingPurposeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.toggleButton} ${
                          formData.fundingPurposes.includes(option.value)
                            ? styles.active
                            : ""
                        }`}
                        onClick={() => handleFundingPurposeToggle(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financial Section */}
                <div className={styles.section}>
                  <h3>💰 Финансирование *</h3>

                  <div className={styles.doubleRow}>
                    <div>
                      <label className={styles.label}>
                        Собственные средства (тыс. ₽) *
                      </label>
                      <input
                        type="number"
                        name="ownCapital"
                        placeholder="Например: 500"
                        value={formData.ownCapital}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>
                        Из них уже вложено (тыс. ₽)
                      </label>
                      <input
                        type="number"
                        name="investedOwn"
                        placeholder="Например: 100"
                        value={formData.investedOwn}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.doubleRow}>
                    <div>
                      <label className={styles.label}>
                        Заемные средства (тыс. ₽) *
                      </label>
                      <input
                        type="number"
                        name="loanCapital"
                        placeholder="Например: 300"
                        value={formData.loanCapital}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label className={styles.label}>
                        Из них уже вложено (тыс. ₽)
                      </label>
                      <input
                        type="number"
                        name="investedLoan"
                        placeholder="Например: 50"
                        value={formData.investedLoan}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.singleRow}>
                    <label className={styles.label}>
                      Период расходования средств (месяцы) *
                    </label>
                    <input
                      type="number"
                      name="spendingPeriod"
                      placeholder="Например: 12"
                      value={formData.spendingPeriod}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Headcount (Optional) */}
                <div className={styles.section}>
                  <h3>👥 Плановая численность команды (опционально)</h3>
                  <input
                    type="number"
                    name="plannedHeadcount"
                    placeholder="Количество сотрудников"
                    value={formData.plannedHeadcount}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* OKVAD Code */}
                <div className={styles.section}>
                  <h3>🔢 Ваш ОКВЭД (опционально)</h3>
                  <input
                    type="text"
                    name="okvadCode"
                    placeholder="Например: 56.10"
                    value={formData.okvadCode}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* Business Registration Status */}
                <div className={styles.section}>
                  <h3>📋 Ваш бизнес зарегистрирован? *</h3>
                  <div className={styles.buttonGroupInline}>
                    <button
                      type="button"
                      className={`${styles.toggleButton} ${
                        formData.businessRegistered === "yes"
                          ? styles.active
                          : ""
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          businessRegistered: "yes",
                          businessLegalForm: undefined,
                        })
                      }
                    >
                      Да
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleButton} ${
                        formData.businessRegistered === "no"
                          ? styles.active
                          : ""
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          businessRegistered: "no",
                          businessLegalForm: undefined,
                        })
                      }
                    >
                      Нет
                    </button>
                  </div>
                </div>

                {/* Legal Form (shown only if registered) */}
                {formData.businessRegistered === "yes" && (
                  <div className={styles.section}>
                    <h3>⚖️ Организационно-правовая форма *</h3>
                    <select
                      name="businessLegalForm"
                      value={formData.businessLegalForm || ""}
                      onChange={handleInputChange}
                      className={styles.input}
                    >
                      <option value="">Выберите форму</option>
                      <option value="self_employed">Самозанятый</option>
                      <option value="ip">
                        Индивидуальный предприниматель (ИП)
                      </option>
                      <option value="ooo">
                        Общество с ограниченной ответственностью (ООО)
                      </option>
                    </select>
                  </div>
                )}

                {/* Initiator Profile */}
                <div className={styles.section}>
                  <h3>🎯 Данные об инициаторе проекта *</h3>
                  <label className={styles.label}>
                    Опишите ваш опыт, навыки, образование, дайте ссылкии на
                    профили в соцсетях или ваши каналы, все что поможет для
                    реализации проекта
                  </label>
                  <textarea
                    name="initiatorProfile"
                    placeholder="Например: образование кондитера, опыт работы пекарем, аккаунт в vc.ru ....."
                    value={formData.initiatorProfile}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className={styles.submitSection}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Обработка..." : "Создать бизнес-план"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
