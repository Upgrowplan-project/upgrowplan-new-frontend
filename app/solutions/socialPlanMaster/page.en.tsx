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
type ProductType =
  | "retail_fmcg"
  | "fashion_apparel"
  | "electronics"
  | "food_beverage"
  | "digital_apps"
  | "manufacturing"
  | "wholesale_trade"
  | "corporate_solutions"
  | "business_tech"
  | "marketplace"
  | "p2p_platform"
  | "saas_b2b"
  | "saas_b2c"
  | "cloud_platform"
  | "industrial_equipment"
  | "logistics"
  | "construction"
  | "energy"
  | "agriculture"
  | "consulting"
  | "healthcare"
  | "education"
  | "tourism_hospitality"
  | "financial_services"
  | "horeca"
  | "professional_services"
  | "other";

interface FormData {
  businessIdea: string;
  targetMarket: string;
  businessCategory: string;
  region: string;
  businessTypes: BusinessType[];
  productTypes: ProductType[];
  initialInvestment: string;
  plannedHeadcount: string;
  hasSocialImpact: boolean;
}

interface SynthesisStatus {
  synthesis_id: string;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "failed"
    | "needs_adjustment";
  progress: number;
  current_stage: string;
  error?: string;
  recommendations?: Array<{ type: string; text: string; action: string }>;
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

export default function SocialPlanMasterPageEN() {
  const businessIdeaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    businessIdea: "",
    targetMarket: "",
    businessCategory: "",
    region: "",
    businessTypes: [],
    productTypes: [],
    initialInvestment: "",
    plannedHeadcount: "",
    hasSocialImpact: false,
  });

  const [synthesisId, setSynthesisId] = useState<string | null>(null);
  const [synthesisStatus, setSynthesisStatus] =
    useState<SynthesisStatus | null>(null);
  const [synthesisResult, setSynthesisResult] =
    useState<SynthesisResult | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      label: "B2C - Consumers",
    },
    {
      value: "B2B" as BusinessType,
      label: "B2B - Business",
    },
    {
      value: "B2B2C" as BusinessType,
      label: "B2B2C - Combination",
    },
    {
      value: "C2C" as BusinessType,
      label: "C2C - Peer-to-Peer",
    },
    {
      value: "D2C" as BusinessType,
      label: "D2C - Direct Sales",
    },
  ];

  const productTypeOptions = [
    { value: "retail_fmcg" as ProductType, label: "Retail / FMCG" },
    { value: "fashion_apparel" as ProductType, label: "Fashion" },
    { value: "electronics" as ProductType, label: "Electronics" },
    { value: "food_beverage" as ProductType, label: "Food & Beverage" },
    { value: "digital_apps" as ProductType, label: "Digital Apps" },
    { value: "manufacturing" as ProductType, label: "Manufacturing" },
    { value: "wholesale_trade" as ProductType, label: "Wholesale" },
    {
      value: "corporate_solutions" as ProductType,
      label: "Corporate Solutions",
    },
    { value: "business_tech" as ProductType, label: "B2B Tech" },
    { value: "marketplace" as ProductType, label: "Marketplace" },
    { value: "p2p_platform" as ProductType, label: "P2P Platform" },
    { value: "saas_b2b" as ProductType, label: "B2B SaaS" },
    { value: "saas_b2c" as ProductType, label: "B2C SaaS" },
    { value: "cloud_platform" as ProductType, label: "Cloud Platform" },
    {
      value: "industrial_equipment" as ProductType,
      label: "Industrial Equipment",
    },
    { value: "logistics" as ProductType, label: "Logistics" },
    { value: "construction" as ProductType, label: "Construction" },
    { value: "energy" as ProductType, label: "Energy" },
    { value: "agriculture" as ProductType, label: "Agriculture" },
    { value: "consulting" as ProductType, label: "Consulting" },
    { value: "healthcare" as ProductType, label: "Healthcare" },
    { value: "education" as ProductType, label: "Education" },
    {
      value: "tourism_hospitality" as ProductType,
      label: "Tourism / Hospitality",
    },
    { value: "financial_services" as ProductType, label: "Financial Services" },
    { value: "horeca" as ProductType, label: "HoReCa" },
    {
      value: "professional_services" as ProductType,
      label: "Professional Services",
    },
    { value: "other" as ProductType, label: "Other" },
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

  const handleProductTypeToggle = (type: ProductType) => {
    setFormData((prev) => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter((t) => t !== type)
        : [...prev.productTypes, type],
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
      !formData.targetMarket ||
      !formData.businessCategory ||
      !formData.region ||
      formData.businessTypes.length === 0 ||
      formData.productTypes.length === 0 ||
      !formData.initialInvestment ||
      !formData.plannedHeadcount
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        business_idea: formData.businessIdea,
        target_market: formData.targetMarket,
        business_category: formData.businessCategory,
        region: formData.region,
        business_types: formData.businessTypes,
        product_types: formData.productTypes,
        initial_investment: parseInt(formData.initialInvestment),
        planned_headcount: parseInt(formData.plannedHeadcount),
        has_social_impact: formData.hasSocialImpact,
      };

      console.log(
        "[Social Plan Master] Sending request to synthesis-service...",
      );
      console.log("[Social Plan Master] Request data:", requestData);

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL ||
        "http://localhost:8004";
      const response = await fetch(`${apiBaseUrl}/api/synthesis/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("[Social Plan Master] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Synthesis error (${response.status}). ` +
            `Make sure backend service is running on ${apiBaseUrl}. ` +
            `Error: ${errorText.substring(0, 200)}`,
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
      if (
        err.message?.includes("fetch") ||
        err.message?.includes("network") ||
        err.code === "ECONNREFUSED" ||
        err.message?.includes("Failed to fetch")
      ) {
        setError(
          `Failed to connect to backend service. ` +
            `Make sure synthesis service is running on http://localhost:8004. ` +
            `Error: ${err.message || "Connection refused"}`,
        );
      } else {
        setError(err.message || "Error starting synthesis");
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

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL || "http://localhost:8004";
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

        previousStatus = status.status;
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
        } else if (status.status === "needs_adjustment") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          clearInterval(interval);
          setIsSubmitting(false);
          setError(status.error || "Business plan requires adjustment");
        } else if (status.status === "failed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          clearInterval(interval);
          setIsSubmitting(false);
          setError(`Synthesis failed: ${status.error || "Unknown error"}`);
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
          setError(`Polling error: ${err.message}`);
        }
      }
    }, pollInterval);

    pollingIntervalRef.current = interval;
  };

  const fetchSynthesisResult = async (id: string) => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL ||
        "http://localhost:8004";
      const response = await fetch(`${apiBaseUrl}/api/synthesis/${id}/result`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching result: ${response.status}`);
      }

      const result: SynthesisResult = await response.json();
      console.log("[Social Plan Master] Result fetched:", result);
      setSynthesisResult(result);
    } catch (err: any) {
      console.error("[Social Plan Master] Error fetching result:", err);
      setError(`Error fetching result: ${err.message}`);
    }
  };

  const handleDownloadDocx = async () => {
    if (!synthesisResult?.docx_path) {
      setError("Document not available");
      return;
    }

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL ||
        "http://localhost:8004";
      const response = await fetch(
        `${apiBaseUrl}/api/synthesis/download/${synthesisId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`Download error: ${response.status}`);
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
    } catch (err: any) {
      console.error("[Social Plan Master] Error downloading document:", err);
      setError(`Document download error: ${err.message}`);
    }
  };

  const handleReset = () => {
    setSynthesisId(null);
    setSynthesisStatus(null);
    setSynthesisResult(null);
    setError(null);
    setActiveSection("overview");
    setSynthesisStartTime(null); // Reset timer
    setSynthesisDuration(null); // Clear duration
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>🚀 Social Plan Generator</h1>
            <p className={styles.heroDescription}>
              Create a comprehensive social plan for your business with impact
              analysis, target audience insights and strategic recommendations
            </p>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className={styles.errorBox}>
            <div className={styles.errorContent}>
              <FiAlertCircle className={styles.errorIcon} />
              <div>
                <h3>Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Results */}
        {isSubmitting ||
        synthesisResult ||
        synthesisStatus?.status === "needs_adjustment" ? (
          <section className={styles.resultsSection}>
            {isSubmitting && synthesisStatus && (
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <FiBarChart2 className={styles.progressIcon} />
                  <h2>Synthesis in progress...</h2>
                </div>

                <div className={styles.progressDetails}>
                  <div className={styles.progressHeaderInfo}>
                    <p className={styles.stageText}>
                      {synthesisStatus.current_stage || "Initializing..."}
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
                    <h4 className={styles.eventsTitle}>📊 Key Stages:</h4>
                    <div className={styles.progressEventsList}>
                      {/* Extract key progress from logs */}
                      {synthesisStatus.logs &&
                        synthesisStatus.logs.length > 0 && (
                          <>
                            {synthesisStatus.logs
                              .filter((log) =>
                                /\[INFO\]|STAGE|Archetype|Deep Research|DOCX|Financial|READY/.test(
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
                      <h4>📝 Full Synthesis Logs:</h4>
                      <span className={styles.logCount}>
                        ({synthesisStatus.logs.length} events)
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
              </div>
            )}

            {synthesisResult && (
              <>
                <div className={styles.successCard}>
                  <div className={styles.successHeader}>
                    <FiCheck className={styles.successIcon} />
                    <h2>Synthesis completed successfully!</h2>
                  </div>
                  {synthesisDuration && (
                    <p className={styles.durationText}>
                      ⏱️ Synthesis time: {synthesisDuration.minutes} min{" "}
                      {synthesisDuration.seconds} sec
                    </p>
                  )}
                </div>

                {/* Results Content - Summary */}
                <div className={styles.resultsContent}>
                  <div className={styles.resultCard}>
                    <h3>Business Plan Summary</h3>
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
                        <p>Synthesis text is not available</p>
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
                    <FiDownload /> Download DOCX
                  </button>
                  <button className={styles.resetBtn} onClick={handleReset}>
                    <FiRefreshCw /> Start Over
                  </button>
                </div>
              </>
            )}
          </section>
        ) : (
          /* Form Section */
          <section className={styles.formSection}>
            <div className={styles.card}>
              <h2>Synthesis Parameters</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Business Idea */}
                <div className={styles.section}>
                  <h3>📋 Business Idea Description *</h3>
                  <input
                    ref={businessIdeaInputRef}
                    type="text"
                    name="businessIdea"
                    placeholder="Description of your business idea"
                    value={formData.businessIdea}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* Target Market */}
                <div className={styles.section}>
                  <h3>🎯 Target Market *</h3>
                  <textarea
                    name="targetMarket"
                    placeholder="Description of target market and audience"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                {/* Business Category */}
                <div className={styles.section}>
                  <h3>🏭 Business Category *</h3>
                  <input
                    type="text"
                    name="businessCategory"
                    placeholder="E.g., specialty coffee, e-commerce, saas"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* Region */}
                <div className={styles.section}>
                  <h3>📍 Region *</h3>
                  <input
                    type="text"
                    name="region"
                    placeholder="E.g., Kaliningrad, Russia"
                    value={formData.region}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* Business Types */}
                <div className={styles.section}>
                  <h3>💼 Business Type *</h3>
                  <div className={styles.buttonGroup}>
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

                {/* Product Types */}
                <div className={styles.section}>
                  <h3>📦 Product Type *</h3>
                  <div className={styles.buttonGroup}>
                    {productTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.toggleButton} ${
                          formData.productTypes.includes(option.value)
                            ? styles.active
                            : ""
                        }`}
                        onClick={() => handleProductTypeToggle(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment */}
                <div className={styles.section}>
                  <h3>💰 Initial Investment ($) *</h3>
                  <input
                    type="number"
                    name="initialInvestment"
                    placeholder="E.g., 50000"
                    value={formData.initialInvestment}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* Headcount */}
                <div className={styles.section}>
                  <h3>👥 Planned Team Size *</h3>
                  <input
                    type="number"
                    name="plannedHeadcount"
                    placeholder="Number of employees"
                    value={formData.plannedHeadcount}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                {/* Social Impact */}
                <div className={styles.section}>
                  <h3>🌱 Social Impact</h3>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="hasSocialImpact"
                      checked={formData.hasSocialImpact}
                      onChange={handleInputChange}
                    />
                    <span>Business has social / environmental impact</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className={styles.submitSection}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "🚀 Start Synthesis"}
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
