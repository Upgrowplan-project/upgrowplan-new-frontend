"use client";

import { useState, useMemo } from "react";
import Header from "../../../components/Header";
import styles from "./synthFocusLab.module.css";
import { FiUsers, FiCheck, FiAlertCircle, FiDownload, FiRefreshCw, FiClock, FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import HealthCheck from "../../[locale]/solutions/synthFocusLab/components/HealthCheck";
import EnGrade from "../../../components/EnGrade";

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
  { value: "russia", label: "Russia" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "japan", label: "Japan" },
  { value: "china", label: "China" },
  { value: "india", label: "India" },
  { value: "brazil", label: "Brazil" },
  { value: "mexico", label: "Mexico" },
  { value: "south_korea", label: "South Korea" },
  { value: "netherlands", label: "Netherlands" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "poland", label: "Poland" },
  { value: "turkey", label: "Turkey" },
  { value: "uae", label: "UAE" },
  { value: "singapore", label: "Singapore" },
  { value: "israel", label: "Israel" },
  { value: "other", label: "Other" },
];

const INDUSTRY_OPTIONS = [
  { value: "b2b_saas", label: "IT / SaaS / B2B Software", icon: "💻" },
  { value: "physical_food", label: "Food & Beverages (Wine, Food Products)", icon: "🍷" },
  { value: "physical_fashion", label: "Clothing & Accessories", icon: "👔" },
  { value: "physical_electronics", label: "Electronics & Gadgets", icon: "📱" },
  { value: "services_education", label: "Education & Training", icon: "📚" },
  { value: "services_fitness", label: "Fitness & Sports", icon: "💪" },
  { value: "services_beauty", label: "Beauty & Health", icon: "💄" },
  { value: "services_consulting", label: "Consulting & Professional Services", icon: "💼" },
  { value: "industrial_manufacturing", label: "Manufacturing & Equipment", icon: "🏭" },
  { value: "real_estate", label: "Real Estate", icon: "🏠" },
  { value: "fintech", label: "Financial Services", icon: "💰" },
  { value: "healthtech", label: "Medicine & Healthcare", icon: "⚕️" },
  { value: "ecommerce", label: "Marketplace / E-commerce", icon: "🛒" },
  { value: "travel_hospitality", label: "Travel & Hospitality", icon: "✈️" },
  { value: "other", label: "Other", icon: "📦" },
];

const RESEARCH_GOALS = [
  { value: "target_audience", label: "Who is my target audience?" },
  { value: "pain_points", label: "What problems/pains does my product solve?" },
  { value: "price_point", label: "What price are they willing to pay?" },
  { value: "decision_criteria", label: "What criteria do they choose by?" },
  { value: "competitive_position", label: "How do I compare to competitors?" },
  { value: "market_fit", label: "Is there product-market fit?" },
];

const INFO_SECTIONS = [
  {
    id: 1,
    title: "How it Works",
    content: (
      <>
        <p style={{marginBottom: "0.5rem"}}>Instead of long and expensive searches for real respondents, we create digital twins of your audience using multi-level simulation technology:</p>
        <ul style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}>
          <li style={{marginBottom: "0.5rem"}}><strong>Persona Generation:</strong> Based on your product and location, AI models 5–10 detailed Buyer Personas. These are not just "portraits", but archetypes with unique behavior: from conservative pragmatists to digital innovators.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Live Search and Context (New!):</strong> The system doesn't guess — it fact-checks. Our Search Agent scans the real market in the specified location: finds competitor prices, reads live reviews on maps, and studies current regional news.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Mentality and Cultural Code Awareness (New!):</strong> We added a "humanity layer". The service analyzes the socio-demographic and religious landscape of the location. A respondent in Tel Aviv will answer taking into account local business traditions, while in a Muslim country the system will automatically account for cultural taboos and specific values.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Virtual Survey:</strong> Based on the personas, the system creates 25+ unique virtual respondents. Each is endowed with their own character, income level, and personal habits.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>400+ Interviews in One Cycle:</strong> We ask them dozens of deep questions. The neural network models their answers as if they were real people in Kaliningrad, Haifa, or New York. The coherence (logic) of answers reaches 80% and above.</li>
        </ul>
        <p style={{marginTop: "1rem", fontStyle: "italic", fontSize: "0.9rem", color: "#64748b"}}><strong>Important:</strong> Since the system performs real data verification and deep cultural context checks, the process takes 15 to 30 minutes. This is necessary to ensure data validity that you wouldn't be ashamed to show an investor or use in a real strategy.</p>
      </>
    )
  },
  {
    id: 2,
    title: "What is Needed form You?",
    content: (
      <>
        <p style={{marginBottom: "0.5rem"}}>The quality of the report depends 90% on the input data. For the "magic" to work, it is important to pay attention to three parameters in the interface:</p>
        <ul style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}>
          <li style={{marginBottom: "0.5rem"}}><strong>Project Description:</strong> The more details (venue size, unique features, specific product varieties), the less "fluff" there will be in respondent reports.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Geo-targeting (Location):</strong> Specify the city or region as precisely as possible. This activates the search for local competitors and currency adaptation (e.g., calculations in Shekels for Israel).</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Depth Parameters:</strong> In the UX, you can set the number of personas, respondents, and questions yourself.</li>
        </ul>
        <p style={{marginTop: "0.5rem"}}>More questions = deeper insights, but longer wait time.</p>
      </>
    )
  },
  {
    id: 3,
    title: "What the Result Will Be",
    content: (
      <>
        <p style={{marginBottom: "0.5rem"}}>As a result, you download a Comprehensive Research Report — a document that will become the foundation of your marketing:</p>
        <ul style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}>
          <li style={{marginBottom: "0.5rem"}}><strong>Segmentation and Portraits:</strong> Learn who your ideal client is, and who you shouldn't waste budget on.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Pain Map and "Killer Features":</strong> Real formulations of barriers and triggers. You will understand exactly what makes a person choose you over a neighbor.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>User Journey:</strong> A step-by-step scenario — from the moment the client gets the "itch" to the moment of payment.</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Ready Action Plan:</strong> Specific recommendations on prices, promotion channels (Instagram, Telegram, maps), and offers for each segment.</li>
        </ul>
      </>
    )
  }
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

  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (id: number) => {
    setActiveSection(prev => prev === id ? null : id);
  };

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
    if (!formData.industryCategory || formData.industryCategory.length === 0) {
      setError("Select product category");
      return;
    }
    if (!formData.targetAudienceType || formData.targetAudienceType.length === 0) {
      setError("Select audience type (B2B/B2C/B2B2C)");
      return;
    }
    if (formData.researchGoals.length < 3) {
      setError("Select at least 3 research goals");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStartTime(new Date()); // Record start timestamp

    // Save goals count before submission
    setSubmittedGoalsCount(formData.researchGoals.length);

    try {
      const response = await fetch("http://localhost:8004/api/research", {
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
      setError(err instanceof Error ? err.message : "Error creating research");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollResearchStatus = async (researchId: number) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8004/api/research/${researchId}`);
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

        // Status messages in English
        const statusMessages: Record<string, string> = {
          "pending": "Pending...",
          "classifying_product": "Classifying product...",
          "generating_personas": "Generating personas...",
          "creating_respondents": "Creating respondents...",
          "generating_questions": "Generating questions...",
          "conducting_survey": "Conducting survey...",
          "generating_report": "Generating report...",
          "completed": "Completed",
          "failed": "Failed"
        };

        const statusMsg = statusMessages[data.status] || data.status;

        // Update progress and status message
        setCurrentProgress(progressPercent);

        // Build detailed status message with respondent count if available
        let detailedStatusMsg = statusMsg;
        if (data.respondents_count !== undefined && data.personas_count !== undefined) {
          const expectedRespondents = formData.personasCount * formData.respondentsPerPersona;
          if (data.respondents_count > 0 || data.personas_count > 0) {
            detailedStatusMsg = `${statusMsg} — Respondents: ${data.respondents_count}/${expectedRespondents}`;
          }
        }
        setCurrentStatusMessage(detailedStatusMsg);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling status:", err);
        setError("Error fetching status");
      }
    }, 3000);
  };

  const handleDownloadReport = async () => {
    if (!researchStatus) return;

    try {
      // [FIX] Use GET request to instant download endpoint (pre-generated DOCX)
      const response = await fetch(`http://localhost:8004/api/research/${researchStatus.id}/export/docx`, {
        method: "GET"  // Changed from POST to GET
      });

      if (!response.ok) {
        throw new Error("Error downloading report");
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
      const message = err instanceof Error ? err.message : "Error downloading report";
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
              Synth Focus Lab 1.2
            </h1>
            <p className={styles.heroDescription} style={{ marginBottom: "2rem", lineHeight: "1.6" }}>
              Do you want to understand who your customers are? What they think about your product? The best way is to ask these people, conduct a survey, or a focus group. Imagine you don't need to spend weeks finding respondents, conducting interviews, and transcribing recordings. Our service does this for you using Synthetic Research technology.
            </p>

            <div style={{ marginTop: "2rem" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "1rem" 
              }}>
                {INFO_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    type="button"
                    style={{
                      padding: "1rem",
                      background: activeSection === section.id ? "#1e6078" : "white",
                      color: activeSection === section.id ? "white" : "#1e6078",
                      border: "2px solid #1e6078",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {section.title}
                    {activeSection === section.id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                ))}
              </div>

              {activeSection !== null && (
                <div style={{
                  marginTop: "1rem",
                  padding: "1.5rem",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  color: "#334155",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  animation: "fadeIn 0.3s ease-in-out"
                }}>
                  {INFO_SECTIONS.find(s => s.id === activeSection)?.content}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className={styles.contentLayout}>
          {/* Main Content Column */}
          <div className={styles.mainContent}>

            {/* Service Status Section */}
            <section className={styles.formSection} style={{ padding: 0, margin: "0 0 1rem" }}>
              <HealthCheck onStatusChange={setServicesReady} locale="en" />
            </section>

            {/* Main Form Content */}
            <div className={styles.formSection} style={{ padding: 0 }}>
              <div className={styles.card}>
                <h2>Create Research</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Product Description */}
                  <div className={styles.section}>
                    <h3>Product Description</h3>
                    <textarea
                      className={styles.textarea}
                      value={formData.productDescription}
                      onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                      placeholder="Describe your product or service in detail..."
                      required
                      rows={5}
                    />
                  </div>

                  {/* Industry Category */}
                  <div className={styles.section}>
                    <h3>Product Category *</h3>
                    <p className={styles.formDescription}>
                      Select category for accurate personas (no IT terms for physical goods)
                    </p>
                    <select
                      className={styles.select}
                      value={formData.industryCategory}
                      onChange={(e) => setFormData({ ...formData, industryCategory: e.target.value as IndustryCategory })}
                      required
                      style={{
                        borderColor: error && (!formData.industryCategory || formData.industryCategory.length === 0) ? "#dc2626" : undefined,
                        borderWidth: error && (!formData.industryCategory || formData.industryCategory.length === 0) ? "2px" : undefined
                      }}
                    >
                      <option value="">Select category...</option>
                      {INDUSTRY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                    {error && (!formData.industryCategory || formData.industryCategory.length === 0) && (
                      <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                        ⚠️ This field is required
                      </p>
                    )}
                  </div>

                  {/* Target Audience Type */}
                  <div className={styles.section}>
                    <h3>Audience Type *</h3>
                    <div
                      className={styles.radioGroup}
                      style={{
                        borderColor: error && (!formData.targetAudienceType || formData.targetAudienceType.length === 0) ? "#dc2626" : undefined,
                        borderWidth: error && (!formData.targetAudienceType || formData.targetAudienceType.length === 0) ? "2px" : undefined,
                        borderStyle: error && (!formData.targetAudienceType || formData.targetAudienceType.length === 0) ? "solid" : undefined,
                        borderRadius: error && (!formData.targetAudienceType || formData.targetAudienceType.length === 0) ? "8px" : undefined,
                        padding: error && (!formData.targetAudienceType || formData.targetAudienceType.length === 0) ? "1rem" : undefined
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
                        <span>B2B (Business to Business)</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="audienceType"
                          value="b2c"
                          checked={formData.targetAudienceType === "b2c"}
                          onChange={(e) => setFormData({ ...formData, targetAudienceType: e.target.value as TargetAudienceType })}
                        />
                        <span>B2C (Business to Consumer)</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="audienceType"
                          value="b2b2c"
                          checked={formData.targetAudienceType === "b2b2c"}
                          onChange={(e) => setFormData({ ...formData, targetAudienceType: e.target.value as TargetAudienceType })}
                        />
                        <span>B2B2C (Combined Model)</span>
                      </label>
                    </div>
                    {error && (!formData.targetAudienceType || formData.targetAudienceType.length === 0) && (
                      <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                        ⚠️ Please select audience type
                      </p>
                    )}
                  </div>

                  {/* Research Goals as Buttons */}
                  <div className={styles.section}>
                    <h3>Research Goals * (minimum 3)</h3>
                    <p className={styles.formDescription}>
                      Select questions you want to get answers for
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
                      Selected: {formData.researchGoals.length} / min. 3
                    </div>
                  </div>

                  {/* Country and City */}
                  <div className={styles.section}>
                    <h3>Country and City</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Country</label>
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
                        <label className={styles.label}>City (optional)</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="E.g.: New York"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Research Parameters */}
                  <div className={styles.section}>
                    <h3><FiClock style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />Research Parameters</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "0.75rem" }}>
                      <div>
                        <label className={styles.label} style={{ marginBottom: "0.25rem", display: "block", fontSize: "0.9rem" }}>
                          Personas: <strong>{formData.personasCount}</strong>
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
                          Respondents: <strong>{formData.respondentsPerPersona}</strong>
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
                          Questions: <strong>{formData.questionsPerGoal}</strong>
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
                        <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Total Respondents:</span>
                        <span style={{ color: "#1e6078", fontSize: "1rem", fontWeight: "700" }}>{researchMetrics.totalRespondents}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Research Goals:</span>
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
                        ~{researchMetrics.estimatedMinutes} min
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
                    disabled={isSubmitting || Boolean(researchStatus && researchStatus.status !== "completed" && researchStatus.status !== "failed")}
                  >
                    {researchStatus && researchStatus.status !== "completed" && researchStatus.status !== "failed" ? (
                      <>
                        <FiRefreshCw className={styles.spinning} /> Conducting Research...
                      </>
                    ) : isSubmitting ? (
                      <>
                        <FiRefreshCw className={styles.spinning} /> Creating Research...
                      </>
                    ) : (
                      <>
                        <FiCheck /> Create Research
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Success/Progress Section - Below Form */}
            <div className={styles.formSection} style={{ padding: 0 }}>
              {/* Progress Section - Show when research is running */}
              {researchStatus && researchStatus.status !== "completed" && researchStatus.status !== "failed" && (
                <div className={styles.card}>
                  <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#334155" }}>
                    <FiRefreshCw style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    Research Progress
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
                        Research Completed!
                      </h3>
                      <p style={{
                        fontSize: "0.95rem",
                        color: "#155724",
                        opacity: 0.9
                      }}>
                        Report is ready to download
                      </p>
                      <p style={{
                        fontSize: "0.9rem",
                        color: "#155724",
                        opacity: 0.8,
                        marginTop: "0.5rem"
                      }}>
                        Execution time: <strong>{getElapsedTime()} min</strong>
                      </p>
                    </div>

                    {/* Download Section: Button (Left) + QR Code (Right) */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1rem",
                      marginTop: "0.5rem",
                      alignItems: "center"
                    }}>
                      {/* Download Button */}
                      <button
                        className={styles.downloadButton}
                        onClick={handleDownloadReport}
                        style={{
                          padding: "1rem",
                          fontSize: "1.1rem",
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
                        <FiDownload size={20} /> Download Report
                      </button>

                      {/* QR Code */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        background: "white",
                        borderRadius: "8px",
                        border: "2px solid #28a745"
                      }}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8004'}/api/research/${researchStatus.id}/download-qr`}
                          alt="QR Code for download"
                          style={{
                            width: "120px",
                            height: "120px",
                            display: "block"
                          }}
                        />
                        <span style={{
                          fontSize: "0.75rem",
                          color: "#155724",
                          fontWeight: "500",
                          textAlign: "center"
                        }}>
                          Download on mobile
                        </span>
                      </div>
                    </div>
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
                    <h3 style={{ color: "#721c24", marginBottom: "0.5rem" }}>Research Failed</h3>
                    <p style={{ color: "#721c24", fontSize: "0.9rem" }}>
                      {researchStatus.error_message || "An unknown error occurred"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className={styles.sidebarContent}>
             <div style={{ position: "sticky", top: "1rem" }}>
               <EnGrade sessionId={researchStatus?.id?.toString() || ""} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
