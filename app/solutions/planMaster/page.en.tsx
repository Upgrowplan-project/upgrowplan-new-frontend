"use client";

import { useMemo, useState, useEffect } from "react";
import Header from "../../../components/Header";
import Grade from "../../../components/Grade";
import styles from "./planMaster.module.css";
import { FiCheck, FiAlertCircle, FiDownload } from "react-icons/fi";

const PLANMASTER_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_PLANMASTER_URL || "http://localhost:8004";

const COUNTRIES = [
  { label: "United States", value: "United States", currency: "USD" },
  { label: "United Kingdom", value: "United Kingdom", currency: "GBP" },
  { label: "Germany", value: "Germany", currency: "EUR" },
  { label: "India", value: "India", currency: "INR" },
  { label: "China", value: "China", currency: "CNY" },
  { label: "Russia", value: "Russia", currency: "RUB" },
  { label: "Israel", value: "Israel", currency: "ILS" },
];

const BUSINESS_TYPES = ["B2B", "B2C", "B2B2C", "C2C", "D2C"];
const PRODUCT_TYPES = ["service", "retail", "manufacturing", "digital", "other"];
const GOALS = ["Investor", "Bank", "Fund", "Strategic_Self"];
const SCALES = ["micro", "small", "medium", "other"];

interface PlanStatus {
  plan_id: string;
  status: string;
  progress: number;
  current_stage?: string;
  error?: string;
  docx_available?: boolean;
}

export default function PlanMasterPageEn() {
  const [form, setForm] = useState({
    business_idea: "",
    business_description: "",
    country: COUNTRIES[0].value,
    city: "",
    business_type: BUSINESS_TYPES[0],
    product_type: PRODUCT_TYPES[0],
    industry: "",
    goal: GOALS[0],
    scale: SCALES[1],
    target_customers: "",
    investment_amount: "",
    own_capital: "",
    requested_funding: "",
    horizon_years: 5,
    known_competitors: "",
  });

  const [planId, setPlanId] = useState<string | null>(null);
  const [status, setStatus] = useState<PlanStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCurrency = useMemo(() => {
    return COUNTRIES.find((item) => item.value === form.country)?.currency || "USD";
  }, [form.country]);

  useEffect(() => {
    if (!planId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const resp = await fetch(`${PLANMASTER_BASE_URL}/planMaster/${planId}`);
        if (!resp.ok) {
          return;
        }
        const data = (await resp.json()) as PlanStatus;
        setStatus(data);
        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [planId]);

  const updateField = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setStatus(null);
    setPlanId(null);

    const payload = {
      ...form,
      currency: selectedCurrency,
      investment_amount: form.investment_amount
        ? Number(form.investment_amount)
        : undefined,
      own_capital: form.own_capital ? Number(form.own_capital) : undefined,
      requested_funding: form.requested_funding
        ? Number(form.requested_funding)
        : undefined,
      known_competitors: form.known_competitors
        ? form.known_competitors.split(",").map((item) => item.trim())
        : undefined,
    };

    try {
      const resp = await fetch(`${PLANMASTER_BASE_URL}/planMaster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const message = await resp.text();
        throw new Error(message || "Failed to create request");
      }
      const data = await resp.json();
      setPlanId(data.plan_id);
      setStatus({
        plan_id: data.plan_id,
        status: data.status,
        progress: data.progress,
        current_stage: data.current_stage,
      });
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.badge}>Worldwide SME Business Plan Generator</p>
            <h1>Global Business Plan Master</h1>
            <p className={styles.subtitle}>
              Generate a DOCX business plan tailored to your goal, country, and
              market context.
            </p>
          </div>
          <Grade />
        </section>

        <section className={styles.formSection}>
          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.formGrid}>
              <label className={styles.label}>
                Business idea
                <input
                  className={styles.input}
                  value={form.business_idea}
                  onChange={(e) => updateField("business_idea", e.target.value)}
                  placeholder="For example: healthy fast-food chain"
                  required
                />
              </label>
              <label className={styles.label}>
                Country
                <select
                  className={styles.input}
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                >
                  {COUNTRIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                City
                <input
                  className={styles.input}
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="For example: Berlin"
                  required
                />
              </label>
              <label className={styles.label}>
                Currency
                <input className={styles.input} value={selectedCurrency} readOnly />
              </label>
              <label className={styles.label}>
                Business type
                <select
                  className={styles.input}
                  value={form.business_type}
                  onChange={(e) => updateField("business_type", e.target.value)}
                >
                  {BUSINESS_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Product type
                <select
                  className={styles.input}
                  value={form.product_type}
                  onChange={(e) => updateField("product_type", e.target.value)}
                >
                  {PRODUCT_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Industry
                <input
                  className={styles.input}
                  value={form.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  placeholder="For example: Food & Beverage"
                  required
                />
              </label>
              <label className={styles.label}>
                Plan goal
                <select
                  className={styles.input}
                  value={form.goal}
                  onChange={(e) => updateField("goal", e.target.value)}
                >
                  {GOALS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Scale
                <select
                  className={styles.input}
                  value={form.scale}
                  onChange={(e) => updateField("scale", e.target.value)}
                >
                  {SCALES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Investment amount (local currency)
                <input
                  className={styles.input}
                  type="number"
                  value={form.investment_amount}
                  onChange={(e) => updateField("investment_amount", e.target.value)}
                  placeholder="For example: 150000"
                />
              </label>
              <label className={styles.label}>
                Own capital
                <input
                  className={styles.input}
                  type="number"
                  value={form.own_capital}
                  onChange={(e) => updateField("own_capital", e.target.value)}
                  placeholder="For example: 40000"
                />
              </label>
              <label className={styles.label}>
                Requested funding
                <input
                  className={styles.input}
                  type="number"
                  value={form.requested_funding}
                  onChange={(e) => updateField("requested_funding", e.target.value)}
                  placeholder="For example: 110000"
                />
              </label>
              <label className={styles.label}>
                Forecast horizon (years)
                <select
                  className={styles.input}
                  value={form.horizon_years}
                  onChange={(e) => updateField("horizon_years", Number(e.target.value))}
                >
                  {[3, 4, 5, 6, 7].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.label}>
              Business description
              <textarea
                className={styles.textarea}
                value={form.business_description}
                onChange={(e) => updateField("business_description", e.target.value)}
                placeholder="Value proposition, monetization, unique factors"
                required
              />
            </label>

            <label className={styles.label}>
              Target customers
              <textarea
                className={styles.textarea}
                value={form.target_customers}
                onChange={(e) => updateField("target_customers", e.target.value)}
                placeholder="Describe segments and customer needs"
              />
            </label>

            <label className={styles.label}>
              Known competitors
              <input
                className={styles.input}
                value={form.known_competitors}
                onChange={(e) => updateField("known_competitors", e.target.value)}
                placeholder="Comma-separated"
              />
            </label>

            <button className={styles.submit} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating" : "Generate DOCX"}
            </button>

            {error && (
              <div className={styles.error}>
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}
          </form>

          <aside className={styles.statusCard}>
            <h3>Generation status</h3>
            {status ? (
              <div className={styles.statusContent}>
                <p>
                  Stage: <strong>{status.current_stage || "waiting"}</strong>
                </p>
                <p>
                  Progress: <strong>{status.progress}%</strong>
                </p>
                <p>
                  Status: <strong>{status.status}</strong>
                </p>
                {status.status === "completed" && planId && (
                  <a
                    className={styles.download}
                    href={`${PLANMASTER_BASE_URL}/planMaster/${planId}/download`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiDownload /> Download DOCX
                  </a>
                )}
                {status.status === "failed" && (
                  <div className={styles.error}>
                    <FiAlertCircle />
                    <span>Generation failed: {status.error || ""}</span>
                  </div>
                )}
                {status.status === "completed" && (
                  <div className={styles.success}>
                    <FiCheck />
                    <span>Document ready</span>
                  </div>
                )}
              </div>
            ) : (
              <p className={styles.statusHint}>
                Start the flow to see progress and download your DOCX plan.
              </p>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
