"use client";

import React, { useState, useEffect, FormEvent } from "react";
import styles from "./openAbroad.module.css";
import Header from "../../../components/Header";

interface TaxInfo {
  vat: string;
  profit_tax: string;
  payroll_tax: string;
  other_taxes: string;
}

interface BusinessResponse {
  country: string;
  business_type: string;
  currency: string;
  registration_cost_local: string;
  registration_cost_rub: string;
  required_documents: string[];
  required_documents_foreigner?: string[];
  remote_registration: string;
  taxes: TaxInfo;
  taxes_simplified?: TaxInfo;
  simplified_tax_threshold?: string;
  tax_authority_url: string;
  licensing_required: string;
  registration_period_days: string;
  average_rent_office_per_sqm: string;
  average_rent_retail_per_sqm: string;
  average_rent_warehouse_per_sqm: string;
  commercial_loan_rate: string;
  deposit_rate: string;
  central_bank_rate: string;
  central_bank_url: string;
  major_bank_name: string;
  major_bank_url: string;
  economic_freedom_index: string;
}

interface ValidationResponse {
  is_valid: boolean;
  corrected_business_type: string | null;
  message: string;
}

// Always use real API in production
const USE_MOCK_DATA = false;

// Countries without economic freedom index
const COUNTRIES_WITHOUT_INDEX = [
  "Andorra",
  "Antigua and Barbuda",
  "Grenada",
  "Hong Kong",
  "Iraq",
  "Libya",
  "Liechtenstein",
  "Macao",
  "Marshall Islands",
  "Monaco",
  "Nauru",
  "Palau",
  "Saint Kitts and Nevis",
  "San Marino",
  "Somalia",
  "South Sudan",
  "Syria",
  "Tuvalu",
  "Vatican City",
  "Yemen",
];

// Full list of countries for selection (localized names retained)
const ALL_COUNTRIES = [
  "Австралия",
  "Австрия",
  "Азербайджан",
  "Албания",
  "Алжир",
  "Аргентина",
  "Армения",
  "Афганистан",
  "Багамы",
  "Бангладеш",
  "Барбадос",
  "Бахрейн",
  "Беларусь",
  "Белиз",
  "Бельгия",
  "Бенин",
  "Болгария",
  "Боливия",
  "Босния и Герцеговина",
  "Ботсвана",
  "Бразилия",
  "Бруней",
  "Буркина-Фасо",
  "Бурundi",
  "Бутан",
  "Вануату",
  "Великобритания",
  "Венгрия",
  "Венесуэла",
  "Вьетнам",
  "Габон",
  "Гаити",
  "Гайана",
  "Гамбия",
  "Гана",
  "Гватемала",
  "Гвинея",
  "Гвинея-Бисау",
  "Германия",
  "Гондурас",
  "Греция",
  "Грузия",
  "Дания",
  "Джибути",
  "Доминика",
  "Доминиканская Республика",
  "Египет",
  "Замбия",
  "Зимбабве",
  "Израиль",
  "Индия",
  "Индонезия",
  "Иордания",
  "Иран",
  "Ирландия",
  "Исландия",
  "Испания",
  "Италия",
  "Кабо-Верде",
  "Казахстан",
  "Камбоджа",
  "Камерун",
  "Канада",
  "Катар",
  "Кения",
  "Кипр",
  "Киргизия",
  "Кирибати",
  "Китай",
  "Колумбия",
  "Коморы",
  "Конго",
  "Корея Северная",
  "Корея Южная",
  "Коста-Рика",
  "Кот-д'Ивуар",
  "Куба",
  "Кувейт",
  "Лаос",
  "Латвия",
  "Лесото",
  "Либерия",
  "Ливан",
  "Литва",
  "Люксембург",
  "Маврикий",
  "Мавритания",
  "Мадагаскар",
  "Малави",
  "Малайзия",
  "Мали",
  "Мальдивы",
  "Мальта",
  "Марокко",
  "Мексика",
  "Мозамбик",
  "Молдова",
  "Монголия",
  "Мьянма",
  "Намибия",
  "Непал",
  "Нигер",
  "Нигерия",
  "Нидерланды",
  "Никарагуа",
  "Новая Зеландия",
  "Норвегия",
  "ОАЭ",
  "Оман",
  "Пакистан",
  "Панама",
  "Папуа — Новая Гвинея",
  "Парагвай",
  "Перу",
  "Польша",
  "Португалия",
  "Россия",
  "Руанда",
  "Румыния",
  "Сальвадор",
  "Самоа",
  "Саудовская Аравия",
  "Северная Македония",
  "Сейшелы",
  "Сенегал",
  "Сербия",
  "Сингапур",
  "Словакия",
  "Словения",
  "Соломоновы Острова",
  "Судан",
  "Суринам",
  "США",
  "Сьерра-Леоне",
  "Таджикистан",
  "Таиланд",
  "Танзания",
  "Того",
  "Тонга",
  "Тринидад и Тобаго",
  "Тунис",
  "Туркменистан",
  "Турция",
  "Уганда",
  "Узбекистан",
  "Украина",
  "Уругвай",
  "Фиджи",
  "Филиппины",
  "Финляндия",
  "Франция",
  "Хорватия",
  "ЦАР",
  "Чад",
  "Черногория",
  "Чехия",
  "Чили",
  "Швейцария",
  "Швеция",
  "Шри-Ланка",
  "Эквадор",
  "Экваториальная Гвинея",
  "Эритрея",
  "Эсватини",
  "Эстония",
  "Эфиопия",
  "ЮАР",
  "Ямайка",
  "Япония",
];

// Mock data for testing
const getMockData = (
  country: string,
  businessType: string
): BusinessResponse => {
  return {
    country: country,
    business_type: businessType,
    currency: "BYN",
    registration_cost_local: "1600-4800",
    registration_cost_rub: "50000-150000",
    required_documents: [
      "Passport",
      "Business plan",
      "Certificate of no criminal record",
      "Proof of registered address",
      "Company charter",
      "Financial statements (if available)",
    ],
    required_documents_foreigner: [
      "International passport",
      "Visa or residence permit",
      "Work permit",
      "Business plan",
      "Certificate of no criminal record from country of origin",
      "Proof of registered address",
      "Company charter",
      "Notarized translations of documents",
    ],
    remote_registration:
      "Partially: initial documents can be submitted online, but final registration may require in-person presence",
    taxes: {
      vat: "21%",
      profit_tax: "19%",
      payroll_tax: "33.8%",
      other_taxes: "Local taxes 2-3%, tourist levy",
    },
    taxes_simplified: {
      vat: "0%",
      profit_tax: "15%",
      payroll_tax: "33.8%",
      other_taxes: "Local taxes 1-2%",
    },
    simplified_tax_threshold: "60000000",
    tax_authority_url: "https://www.financnisprava.cz",
    licensing_required:
      "Required: sanitary license, fire-safety compliance certificate for premises, medical books for staff",
    registration_period_days: "5-10",
    average_rent_office_per_sqm: "15-25",
    average_rent_retail_per_sqm: "30-50",
    average_rent_warehouse_per_sqm: "8-15",
    commercial_loan_rate: "5-8%",
    deposit_rate: "2-3%",
    central_bank_rate: "4.5%",
    central_bank_url: "https://www.ecb.europa.eu",
    major_bank_name: "Deutsche Bank",
    major_bank_url: "https://www.deutschebank.de",
    economic_freedom_index: "74.8",
  };
};

export default function OpenAbroadPage() {
  const [country, setCountry] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<
    "local" | "rub" | "usd"
  >("local");
  const [taxRegime, setTaxRegime] = useState<"general" | "simplified">(
    "general"
  );
  const [citizenship, setCitizenship] = useState<"citizen" | "foreigner">(
    "citizen"
  );
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {
      USD: 1,
      RUB: 95,
      EUR: 0.92,
      BYN: 3.2,
      BHD: 0.376,
      AED: 3.67,
      CNY: 7.2,
      GBP: 0.79,
      JPY: 150,
      KZT: 450,
      TRY: 34,
    }
  );

  // API URL from environment variables
  // Development: uses http://localhost:8001 (local backend without prefix)
  // Production: uses Heroku URL with /openabroad prefix
  const API_URL =
    process.env.NEXT_PUBLIC_OPENABROAD_API_URL || "http://localhost:8001";
  const API_PREFIX = process.env.NEXT_PUBLIC_OPENABROAD_API_URL
    ? "/openabroad"
    : "";
  const EXCHANGE_API_KEY = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY;

  // Load current exchange rates when component mounts
  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (!EXCHANGE_API_KEY) {
        console.warn("ExchangeRate API key not found, using default rates");
        return;
      }

      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/USD`
        );
        const data = await response.json();

        if (data.result === "success") {
          setExchangeRates(data.conversion_rates);
          console.log("✅ Exchange rates loaded successfully");
        } else {
          console.error(
            "❌ Failed to load exchange rates:",
            data["error-type"]
          );
        }
      } catch (error) {
        console.error("❌ Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, [EXCHANGE_API_KEY]);

  // Convert numeric string from source currency to selected display currency
  const convertCurrency = (value: string, fromCurrency: string): string => {
    if (!value || value === "Данные недоступны") return value;

    // If it's a range (e.g. "500-1500")
    const rangeMatch = value.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);

      const fromRate = exchangeRates[fromCurrency.toUpperCase()] || 1;
      const toRate =
        displayCurrency === "local"
          ? 1
          : displayCurrency === "rub"
          ? exchangeRates["RUB"]
          : exchangeRates["USD"];
      const targetCurrency =
        displayCurrency === "local"
          ? fromCurrency
          : displayCurrency === "rub"
          ? "RUB"
          : "USD";

      const convertedMin = Math.round((min / fromRate) * toRate);
      const convertedMax = Math.round((max / fromRate) * toRate);

      return `${convertedMin}-${convertedMax}`;
    }

    // If it's a single number
    const numberMatch = value.match(/^(\d+(?:\.\d+)?)$/);
    if (numberMatch) {
      const num = parseFloat(numberMatch[1]);
      const fromRate = exchangeRates[fromCurrency.toUpperCase()] || 1;
      const toRate =
        displayCurrency === "local"
          ? 1
          : displayCurrency === "rub"
          ? exchangeRates["RUB"]
          : exchangeRates["USD"];

      const converted = Math.round((num / fromRate) * toRate);
      return converted.toString();
    }

    return value;
  };

  // Get currency symbol for display
  const getCurrencySymbol = (): string => {
    if (displayCurrency === "rub") return "₽";
    if (displayCurrency === "usd") return "$";
    return result?.currency || "";
  };

  // Get exchange rate text for display
  const getExchangeRateText = (): string => {
    if (!result) return "";

    const localCurrency = result.currency.toUpperCase();
    const localRate = exchangeRates[localCurrency] || 1;

    if (displayCurrency === "usd") {
      // Show rate of local currency to USD
      return `1 USD = ${localRate.toFixed(2)} ${localCurrency}`;
    } else if (displayCurrency === "rub") {
      // Show rate of local currency to RUB via USD
      const rubRate = exchangeRates["RUB"];
      const crossRate = (rubRate / localRate).toFixed(2);
      return `1 ${localCurrency} = ${crossRate} RUB`;
    }

    return ""; // No rate for local currency
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!country.trim() || !businessType.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // DEBUG: Log API configuration
    console.log("🔍 API Configuration:", {
      API_URL,
      API_PREFIX,
      fullValidationUrl: `${API_URL}${API_PREFIX}/api/validate-business-type`,
      fullBusinessInfoUrl: `${API_URL}${API_PREFIX}/api/business-info`,
      envVar: process.env.NEXT_PUBLIC_OPENABROAD_API_URL,
    });

    // AI-based validation of business type via backend
    try {
      console.log("📤 Sending validation request...");
      const validationResponse = await fetch(
        `${API_URL}${API_PREFIX}/api/validate-business-type`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_type: businessType.trim(),
          }),
        }
      );

      if (validationResponse.ok) {
        const validationData: ValidationResponse =
          await validationResponse.json();

        if (!validationData.is_valid) {
          setError(`Invalid business type. ${validationData.message}`);
          setLoading(false);
          return;
        }

        // If backend returned corrected name, use it
        if (validationData.corrected_business_type) {
          setBusinessType(validationData.corrected_business_type);
        }
      }
      // If validation fails, continue without it
    } catch (validationError) {
      console.warn("Validation not available, continuing without it");
    }

    // Mock mode
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockData = getMockData(country.trim(), businessType.trim());
      setResult(mockData);
      setLoading(false);
      return;
    }

    // Real API mode
    try {
      const response = await fetch(
        `${API_URL}${API_PREFIX}/api/business-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: country.trim(),
            business_type: businessType.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: "Server error",
        }));
        throw new Error(
          errorData.detail || `Failed to fetch data (status ${response.status})`
        );
      }

      const data: BusinessResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Request error:", err);

      let errorMessage = "An error occurred while fetching data";

      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to the server. Check your internet connection.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCountry("");
    setBusinessType("");
    setResult(null);
    setError(null);
  };

  return (
    <main className={styles.container}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="text-brand">Start a business abroad</h1>
          <p className={styles.heroDescription}>
            Get practical information on how to open a business in any country
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={styles.input}
                  required
                >
                  <option value="">Select a country</option>
                  {ALL_COUNTRIES.map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                  ))}
                </select>
                <small className={styles.helpText}>
                  Choose a country from the list
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="businessType" className={styles.label}>
                  Business type
                </label>
                <input
                  type="text"
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Bakery, IT company"
                  className={styles.input}
                  required
                />
                <small className={styles.helpText}>
                  Describe your business type in detail, e.g. online English
                  school
                </small>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Analyzing data...
                </>
              ) : (
                <>✈️ Get information</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className={styles.errorSection}>
          <div className={styles.errorAlert}>
            <div className={styles.errorIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className={styles.errorContent}>
              <h3 className={styles.errorTitle}>Failed to retrieve data</h3>
              <p className={styles.errorMessage}>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  handleSubmit(new Event("submit") as any);
                }}
                className={styles.retryButton}
              >
                Try again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {result && (
        <section className={styles.resultsSection}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsHeader}>
              <h2>
                Opening a &quot;{result.business_type}&quot; business in &quot;
                {result.country}&quot;
              </h2>
            </div>

            {/* Currency Selector */}
            <div className={styles.currencySelector}>
              <label className={styles.currencySelectorLabel}>
                Report currency:
              </label>
              <div className={styles.currencySelectorButtons}>
                <button
                  onClick={() => setDisplayCurrency("local")}
                  className={
                    displayCurrency === "local"
                      ? styles.currencyButtonActive
                      : styles.currencyButton
                  }
                >
                  {result.currency} (Local currency)
                </button>
                <button
                  onClick={() => setDisplayCurrency("rub")}
                  className={
                    displayCurrency === "rub"
                      ? styles.currencyButtonActive
                      : styles.currencyButton
                  }
                >
                  ₽ RUB (Ruble)
                </button>
                <button
                  onClick={() => setDisplayCurrency("usd")}
                  className={
                    displayCurrency === "usd"
                      ? styles.currencyButtonActive
                      : styles.currencyButton
                  }
                >
                  $ USD (US Dollar)
                </button>
              </div>
              {getExchangeRateText() && (
                <small className={styles.exchangeRateText}>
                  Exchange rate: {getExchangeRateText()}
                </small>
              )}
            </div>

            <div className={styles.resultsBody}>
              {/* Main Info Section */}
              <div className={styles.section}>
                <h3>Main information</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Registration cost:</span>
                    <span className={styles.infoValue}>
                      {convertCurrency(
                        result.registration_cost_local,
                        result.currency
                      )}{" "}
                      {getCurrencySymbol()}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Registration period:
                    </span>
                    <span className={styles.infoValue}>
                      {result.registration_period_days} business days
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Remote registration:
                    </span>
                    <span>{result.remote_registration}</span>
                  </div>
                </div>
              </div>

              {/* Documents and Licensing */}
              <div className={styles.section}>
                <h3>Required documents & licensing</h3>

                {/* Citizenship Selector */}
                {result.required_documents_foreigner && (
                  <div className={styles.citizenshipSelector}>
                    <label className={styles.citizenshipSelectorLabel}>
                      Select your status in {result.country}:
                    </label>
                    <div className={styles.citizenshipSelectorButtons}>
                      <button
                        onClick={() => setCitizenship("citizen")}
                        className={
                          citizenship === "citizen"
                            ? styles.citizenshipButtonActive
                            : styles.citizenshipButton
                        }
                      >
                        Citizen
                      </button>
                      <button
                        onClick={() => setCitizenship("foreigner")}
                        className={
                          citizenship === "foreigner"
                            ? styles.citizenshipButtonActive
                            : styles.citizenshipButton
                        }
                      >
                        Non-citizen
                      </button>
                    </div>
                  </div>
                )}

                <ul className={styles.documentsList}>
                  {(citizenship === "foreigner" &&
                  result.required_documents_foreigner
                    ? result.required_documents_foreigner
                    : result.required_documents
                  ).map((doc, index) => (
                    <li key={index} className={styles.documentItem}>
                      {doc}
                    </li>
                  ))}
                  <li className={styles.documentItem}>
                    <strong>Licensing:</strong> {result.licensing_required}
                  </li>
                </ul>
              </div>

              {/* Taxes */}
              <div className={styles.section}>
                <h3>Taxes (%)</h3>

                {/* Tax Regime Selector */}
                {result.taxes_simplified && (
                  <div className={styles.taxRegimeSelector}>
                    <label className={styles.taxRegimeSelectorLabel}>
                      Select possible tax regime
                    </label>

                    {result.simplified_tax_threshold && (
                      <div className={styles.revenueInputContainer}>
                        <label className={styles.revenueInputLabel}>
                          Your monthly revenue ({result.currency}):
                        </label>
                        <input
                          type="number"
                          value={monthlyRevenue}
                          onChange={(e) => setMonthlyRevenue(e.target.value)}
                          placeholder="Enter amount"
                          className={styles.revenueInput}
                        />
                        {monthlyRevenue && (
                          <small className={styles.revenueCalculation}>
                            Annual revenue:{" "}
                            {(parseFloat(monthlyRevenue) * 12).toLocaleString()}{" "}
                            {result.currency}
                            {parseFloat(monthlyRevenue) * 12 <=
                            parseFloat(result.simplified_tax_threshold) ? (
                              <span className={styles.revenueEligible}>
                                {" "}
                                ✓ You may be eligible for the simplified tax
                                regime
                              </span>
                            ) : (
                              <span className={styles.revenueNotEligible}>
                                {" "}
                                ✗ Threshold exceeded for simplified regime (
                                {result.simplified_tax_threshold}{" "}
                                {result.currency})
                              </span>
                            )}
                          </small>
                        )}
                      </div>
                    )}

                    <div className={styles.taxRegimeSelectorButtons}>
                      <button
                        onClick={() => setTaxRegime("general")}
                        className={
                          taxRegime === "general"
                            ? styles.taxRegimeButtonActive
                            : styles.taxRegimeButton
                        }
                      >
                        General regime
                      </button>
                      <button
                        onClick={() => setTaxRegime("simplified")}
                        className={
                          taxRegime === "simplified"
                            ? styles.taxRegimeButtonActive
                            : styles.taxRegimeButton
                        }
                      >
                        Simplified regime
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.taxesGrid}>
                  <div className={styles.taxItem}>
                    <small>VAT</small>
                    <strong>
                      {taxRegime === "simplified" && result.taxes_simplified
                        ? result.taxes_simplified.vat.replace("%", "")
                        : result.taxes.vat.replace("%", "")}
                    </strong>
                  </div>
                  <div className={styles.taxItem}>
                    <small>Profit tax</small>
                    <strong>
                      {taxRegime === "simplified" && result.taxes_simplified
                        ? result.taxes_simplified.profit_tax.replace("%", "")
                        : result.taxes.profit_tax.replace("%", "")}
                    </strong>
                  </div>
                  <div className={styles.taxItem}>
                    <small>Payroll tax</small>
                    <strong>
                      {taxRegime === "simplified" && result.taxes_simplified
                        ? result.taxes_simplified.payroll_tax.replace("%", "")
                        : result.taxes.payroll_tax.replace("%", "")}
                    </strong>
                  </div>
                  <div className={styles.taxItem}>
                    <small>Other taxes</small>
                    <strong>
                      {taxRegime === "simplified" && result.taxes_simplified
                        ? result.taxes_simplified.other_taxes
                        : result.taxes.other_taxes}
                    </strong>
                  </div>
                </div>
                {result.tax_authority_url && (
                  <p className={styles.taxLinkBottom}>
                    <a
                      href={result.tax_authority_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.taxLink}
                    >
                      Official website of the country's tax authority →
                    </a>
                  </p>
                )}
              </div>

              {/* Rent */}
              <div className={styles.section}>
                <h3>Average rent (per 1 m²/month, {getCurrencySymbol()})</h3>
                <div className={styles.rentGrid}>
                  <div className={styles.rentItem}>
                    <h4>Office</h4>
                    <p className={styles.rentValue}>
                      {convertCurrency(
                        result.average_rent_office_per_sqm,
                        result.currency
                      )}
                    </p>
                  </div>
                  <div className={styles.rentItem}>
                    <h4>Retail</h4>
                    <p className={styles.rentValue}>
                      {convertCurrency(
                        result.average_rent_retail_per_sqm,
                        result.currency
                      )}
                    </p>
                  </div>
                  <div className={styles.rentItem}>
                    <h4>Warehouse</h4>
                    <p className={styles.rentValue}>
                      {convertCurrency(
                        result.average_rent_warehouse_per_sqm,
                        result.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className={styles.section}>
                <h3>Financial information (annual %)</h3>
                <div className={styles.financialGrid}>
                  <div className={styles.financialItem}>
                    <small>Commercial loans</small>
                    <strong>
                      {result.commercial_loan_rate.replace("%", "").trim()}
                    </strong>
                    {result.major_bank_url && (
                      <a
                        href={result.major_bank_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.financialLink}
                      >
                        {result.major_bank_name} →
                      </a>
                    )}
                  </div>
                  <div className={styles.financialItem}>
                    <small>Deposit rate</small>
                    <strong>
                      {result.deposit_rate
                        ? result.deposit_rate.replace("%", "").trim()
                        : "No data"}
                    </strong>
                    {result.major_bank_url && (
                      <a
                        href={result.major_bank_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.financialLink}
                      >
                        {result.major_bank_name} →
                      </a>
                    )}
                  </div>
                  <div className={styles.financialItem}>
                    <small>Central bank policy rate</small>
                    <strong>
                      {result.central_bank_rate
                        ? result.central_bank_rate.replace("%", "").trim()
                        : "No data"}
                    </strong>
                    {result.central_bank_url && (
                      <a
                        href={result.central_bank_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.financialLink}
                      >
                        Central Bank site →
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Economic Freedom Index */}
              <div className={styles.section}>
                <h3>
                  Economic Freedom Index{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Economic_freedom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.infoLink}
                  >
                    ?
                  </a>
                </h3>
                <p className={styles.infoValue}>
                  {COUNTRIES_WITHOUT_INDEX.includes(result.country)
                    ? "No data"
                    : `${result.economic_freedom_index} out of 100`}
                </p>
                <small className={styles.indexNote}>
                  Heritage Foundation rating (range 0-100)
                </small>
              </div>
            </div>

            {/* Reset Button */}
            <div className={styles.resetSection}>
              <button onClick={handleReset} className={styles.resetButton}>
                New search
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      {result && (
        <section className={styles.disclaimer}>
          <p>
            <strong>Note:</strong> Data is collected from public sources and may
            not reflect the latest legal changes. We recommend consulting
            professional lawyers and accountants before making decisions.
          </p>
        </section>
      )}

      {/* Footer Info */}
      <section className={styles.footerInfo}>
        <p>
          Powered by AI • All data is verified •
          <a href="https://www.upgrowplan.com" className="nav-link-custom">
            {" "}
            Upgrowplan
          </a>
        </p>
      </section>
    </main>
  );
}
