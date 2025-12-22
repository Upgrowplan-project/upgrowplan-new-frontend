"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import styles from "../form-styles.module.css";

export default function FinModelPage() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") || "il"; // Default Israel for EN page
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [resultHtml, setResultHtml] = useState(
    '<i class="fa fa-spinner fa-spin"></i> Your result will appear here after calculation.'
  );

  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    businessName: "",
    businessType: "", // Type of business/profession
    form: "",
    taxSystem: "",
    horizon: "",
    revenue: "",
    revenueGrowthPercent: "",
    revenueGrowthPeriod: "",
    otherIncome: "",
    variableExpensesIsPercent: "true",
    variableExpensesValue: "",
    suppliesExpense: "",
    salaryExpense: "",
    rentExpense: "",
    otherExpense: "",
    investment: "",
    loanPercent: "",
    loanHoliday: "",
    loanTerm: "",
  });

  const [hintsVisible, setHintsVisible] = useState({
    "hint-growth": true,
    "hint-growth-period": true,
    "hint-other-income": true,
    "hint-variable": true,
    "hint-invest": true,
    "hint-loan-percent": true,
    "hint-loan-holiday": true,
    "hint-loan-term": true,
  });

  const formatNumberInput = (value: string) => {
     // Remove non-digit chars (except optional decimal point)
     if (!value) return "";
     const rawValue = value.replace(/,/g, ""); 
     if (isNaN(Number(rawValue))) return value; // If not a number, return as is (or handle error)
     
     // Format with commas
     // Split integer and decimal parts to avoid messing up typing "12."
     const parts = rawValue.split(".");
     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     return parts.join(".");
  };

  const parseNumberInput = (value: string) => {
      if (!value) return "";
      return value.replace(/,/g, "");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // For specific numeric fields, handle formatting
    if (["revenue", "salaryExpense", "rentExpense", "suppliesExpense", "otherExpense", "investment", "variableExpensesValue"].includes(name)) {
        // Remove existing commas to get raw value, then format
        const raw = parseNumberInput(value);
        // Only allow digits and one dot
        if (raw === "" || /^\d*\.?\d*$/.test(raw)) { 
             const formatted = formatNumberInput(raw);
             setFormData((prev) => ({ ...prev, [name]: formatted }));
        }
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const hideTooltip = (id: keyof typeof hintsVisible) => {
    setHintsVisible((prev) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericFields = [
      "investment",
      "loanPercent",
      "loanTerm",
      "loanHoliday",
      "revenue",
      "revenueGrowthPercent",
      "salaryExpense",
      "rentExpense",
      "suppliesExpense",
      "otherExpense",
      "horizon",
      "variableExpensesValue",
    ];

    const dataRaw: Record<string, any> = { ...formData, locale: country };
    numericFields.forEach((key) => {
      const val = dataRaw[key];
      // Parse formatted numbers (remove commas)
      const parsedVal = typeof val === 'string' ? val.replace(/,/g, "") : val;
      dataRaw[key] = parsedVal === "" || parsedVal === null ? null : Number(parsedVal);
    });
    dataRaw.variableExpensesIsPercent =
      dataRaw.variableExpensesIsPercent === "true";

    setResultHtml(
      '<i class="fa fa-spinner fa-spin"></i> Calculating...'
    );

    try {
      const API_URL = process.env.NODE_ENV === "development" 
        ? "http://localhost:8088/api/finance/calculate"
        : "https://upgrowplan-backend-9736a5b5c447.herokuapp.com/api/finance/calculate";
        
      const resp = await fetch(
        API_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataRaw),
        }
      );

      if (!resp.ok) throw new Error("Server Error");
      const result = await resp.json();

      // Display in thousands ILS with comma formatting (e.g., 1,500.00)
      const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      // Check if Osek Patur limit will be exceeded
      let warningMessage = "";
      if (formData.taxSystem === "osek_patur" && country === "il") {
        const monthlyRevenue = Number(formData.revenue) || 0;
        const horizon = Number(formData.horizon) || 1;
        const annualRevenue = monthlyRevenue * 12;
        
        if (annualRevenue > 120) { // 120,000 ILS in thousands
          warningMessage = `
            <div class="alert alert-warning mt-3" role="alert">
              <strong>⚠️ Important:</strong> Your projected annual revenue (${formatNumber(annualRevenue)} thousands ILS) exceeds the Osek Patur limit of 120,000 ILS/year.
              <br/>You will be automatically transitioned to <strong>Osek Murshe</strong> status (VAT 17% + progressive tax).
              <br/>The calculation reflects this transition after 12 months.
            </div>
          `;
        }
      }

      setResultHtml(`
        ${warningMessage}
        <div><b>Net Profit (NP):</b> ${formatNumber(result.totalNetProfit ?? 0)} thousands ILS</div>
        <div><b>ROI:</b> ${(result.roi ?? 0).toFixed(2)}%</div>
        <div><b>Payback Period (PP):</b> ${
          result.paybackMonth > 0
            ? result.paybackMonth + " months"
            : "Not reached"
        }</div>
        <div><b>EBITDA:</b> ${formatNumber(result.ebitda ?? 0)} thousands ILS</div>
        <div><b>Cash Flow:</b> ${formatNumber(result.cashFlow ?? 0)} thousands ILS</div>
        <div><b>Break-even Point:</b> ${
          result.breakEvenMonth > 0
            ? result.breakEvenMonth + " months"
            : "Not reached"
        }</div>
      `);
    } catch (err: any) {
      setResultHtml("Calculation Error: " + err.message);
    }
  };

  return (
    <div>
      <Header />

      <main className={styles.pageContainer}>
        <h1>Financial Model Generator ({country === "il" ? "Israel" : "Russia"}). Ver. {country === "il" ? "IL.001" : "RU.003"}</h1>

        <div className="details-toggle">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setDetailsOpen(!detailsOpen);
            }}
          >
            {detailsOpen
              ? "Hide ▲"
              : "More details ▼"}
          </a>
          {detailsOpen && (
            <div id="details-content">
              <p>
                Fill in the form to get a calculation. The more data, the more accurate the result.
              </p>
              {country === "il" && (
                <div className="mt-3">
                  <h6>Israeli Tax Systems:</h6>
                  <ul className="small">
                    <li><strong>Osek Patur:</strong> No VAT. Annual revenue limit ~120,000 ILS. Progressive income tax 10-20%.</li>
                    <li><strong>Osek Murshe:</strong> VAT 17% (can reclaim input VAT). Progressive income tax 10-47%.</li>
                    <li><strong>Company Ltd:</strong> Corporate tax 23%. Dividend tax 25-30% (not included in calculation).</li>
                  </ul>
                  <p className="small text-muted">
                    💡 Employer social contributions (~14%) are automatically added to expenses.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==== Form ==== */}
        <form
          id="financeForm"
          className={styles.formContainer}
          onSubmit={handleSubmit}
        >
          {/* General Data */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>General Data</legend>
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Name"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-briefcase"></i>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Project Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Business Type - only for Israel */}
            {country === "il" && (
              <div className={styles.row}>
                <div className={styles.inputWithIcon} style={{ gridColumn: "1 / -1" }}>
                  <i className="fa fa-briefcase"></i>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Business Type</option>
                    <option value="other">Other (General Business)</option>
                    <option value="medical">Medical/Paramedical</option>
                    <option value="legal">Legal Services (Lawyer)</option>
                    <option value="accounting">Accounting/Bookkeeping</option>
                    <option value="engineering">Engineering/Architecture</option>
                    <option value="insurance">Insurance Agent</option>
                    <option value="detective">Private Detective</option>
                    <option value="auditor">Auditor</option>
                    <option value="consultant">Management Consultant</option>
                    <option value="writer">Writer</option>
                    <option value="realtor">Real Estate Broker</option>
                    <option value="teacher">Teacher/Educator</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-building"></i>
                <select
                  name="form"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Entity Type</option>
                  <option value="osek_patur">Osek Patur</option>
                  <option value="osek_murshe">Osek Murshe</option>
                  <option value="company_ltd">Company Ltd</option>
                </select>
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-percent"></i>
                <select
                  name="taxSystem"
                  value={formData.taxSystem}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Tax System</option>
                  {/* Only "other" business type can use Osek Patur */}
                  {(country !== "il" || formData.businessType === "other") && (
                    <option value="osek_patur">Osek Patur (No VAT, Progressive 10-20%)</option>
                  )}
                  <option value="osek_murshe">Osek Murshe (VAT 17%, Progressive 10-47%)</option>
                  <option value="company_ltd">Company Ltd (Corporate 23%)</option>
                </select>
                {country === "il" && formData.businessType && formData.businessType !== "other" && (
                  <small className="text-muted d-block mt-1">
                    ⚠️ Your profession requires VAT registration (Osek Murshe or Company Ltd)
                  </small>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-calendar"></i>
                <input
                  type="number"
                  name="horizon"
                  placeholder="Planning Horizon (Years)"
                  min={1}
                  max={20}
                  value={formData.horizon}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Income */}
          <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Monthly Income (thousands ILS)</legend>
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-chart-line"></i>
                <input
                  type="text"
                  name="revenue"
                  placeholder="Revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-arrow-up"></i>
                <input
                  type="number"
                  name="revenueGrowthPercent"
                  placeholder="Growth %"
                  value={formData.revenueGrowthPercent}
                  onChange={handleInputChange}
                />
                {hintsVisible["hint-growth"] && (
                  <div className={styles.inputHint} id="hint-growth">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-growth")}
                    >
                      ×
                    </span>
                    Project revenue growth, e.g., 2% monthly.
                  </div>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-clock"></i>
                <select
                  name="revenueGrowthPeriod"
                  value={formData.revenueGrowthPeriod}
                  onChange={handleInputChange}
                >
                  <option value="">Growth Period</option>
                  <option value="monthly">Monthly</option>
                  <option value="2months">Every 2 months</option>
                  <option value="quarter">Quarterly</option>
                  <option value="halfyear">Semi-annually</option>
                </select>
                {hintsVisible["hint-growth-period"] && (
                  <div className={styles.inputHint} id="hint-growth-period">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-growth-period")}
                    >
                      ×
                    </span>
                    How often revenue grows.
                  </div>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-chart-line"></i>
                <input
                  type="number"
                  name="otherIncome"
                  placeholder="Other Income"
                  value={formData.otherIncome}
                  onChange={handleInputChange}
                />
               
              </div>
            </div>
          </fieldset>

          {/* Variable Expenses */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Variable Expenses (Monthly)
            </legend>
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-sliders-h"></i>
                <select
                  name="variableExpensesIsPercent"
                  value={formData.variableExpensesIsPercent}
                  onChange={handleInputChange}
                >
                  <option value="true">% of Revenue</option>
                  <option value="false">Fixed Amount</option>
                </select>
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-coins"></i>
                <input
                  type="text"
                  name="variableExpensesValue"
                  placeholder="Value (% or sum)"
                  value={formData.variableExpensesValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Fixed Expenses */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Fixed Expenses (Monthly, thousands ILS)
            </legend>
            {country === "il" && (
              <p className="small text-muted mb-2">
                💡 Note: Employer social contributions (~14%) are automatically added to expenses
              </p>
            )}
            <div className={`${styles.row} ${styles.rowFour}`}>
              <input
                type="text"
                name="suppliesExpense"
                placeholder="Supplies"
                value={formData.suppliesExpense}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="salaryExpense"
                placeholder="Salaries"
                value={formData.salaryExpense}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="rentExpense"
                placeholder="Rent"
                value={formData.rentExpense}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="otherExpense"
                placeholder="Other"
                value={formData.otherExpense}
                onChange={handleInputChange}
              />
            </div>
          </fieldset>

          {/* Investment */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Investment Data</legend>
            <div className={`${styles.row} ${styles.rowFour}`}>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  name="investment"
                  placeholder="Investment (thousands ILS)"
                  value={formData.investment}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  name="loanPercent"
                  placeholder="Loan Interest %"
                  value={formData.loanPercent}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  name="loanHoliday"
                  placeholder="Holiday (Months)"
                  value={formData.loanHoliday}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  name="loanTerm"
                  placeholder="Term (Years)"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <div className="form-check mb-3 d-flex align-items-center justify-content-center">
             <input 
               className="form-check-input me-2" 
               type="checkbox" 
               id="privacy-check-en" 
               required 
               checked={isPrivacyAgreed}
               onChange={(e) => setIsPrivacyAgreed(e.target.checked)}
             />
             <label className="form-check-label" htmlFor="privacy-check-en" style={{fontSize: '0.9em', textAlign: 'left'}}>
               By submitting the form, you agree to the <a href="/en/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
             </label>
          </div>

          <div style={{ textAlign: "center" }}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!isPrivacyAgreed}
              style={{ opacity: isPrivacyAgreed ? 1 : 0.5, cursor: isPrivacyAgreed ? 'pointer' : 'not-allowed' }}
            >
              Calculate
            </button>
          </div>
        </form>

        <div
          className={styles.resultBox}
          dangerouslySetInnerHTML={{ __html: resultHtml }}
        />
      </main>
    </div>
  );
}
