"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import styles from "../form-styles.module.css";

export default function FinModelPage() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") || "ru"; // Default Russia for RU page
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [resultHtml, setResultHtml] = useState(
    '<i class="fa fa-spinner fa-spin"></i> Ваш результат появится здесь после расчета.'
  );
  
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    businessName: "",
    businessType: "", // Тип бизнеса/профессии
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
     // Убираем нецифровые символы (кроме точки)
     if (!value) return "";
     const rawValue = value.replace(/,/g, ""); 
     if (isNaN(Number(rawValue))) return value; 
     
     // Форматируем с запятыми как разделителями тысяч
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
    
    // Для числовых полей добавляем форматирование
    if (["revenue", "salaryExpense", "rentExpense", "suppliesExpense", "otherExpense", "investment", "variableExpensesValue"].includes(name)) {
        const raw = parseNumberInput(value);
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
      const parsedVal = typeof val === 'string' ? val.replace(/,/g, "") : val;
      dataRaw[key] = parsedVal === "" || parsedVal === null ? null : Number(parsedVal);
    });
    dataRaw.variableExpensesIsPercent =
      dataRaw.variableExpensesIsPercent === "true";

    setResultHtml(
      '<i class="fa fa-spinner fa-spin"></i> Выполняется расчет...'
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

      if (!resp.ok) throw new Error("Ошибка сервера");
      const result = await resp.json();
      
      // Check if Osek Patur limit will be exceeded
      const formatNumber = (num: number) => num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      // Calculate annual revenue for warnings
      const monthlyRevenue = Number(parseNumberInput(formData.revenue)) || 0;
      const annualRevenue = monthlyRevenue * 12;
      let warningMessage = "";

      if (country === "il" && formData.taxSystem === "osek_patur") {
        if (annualRevenue > 120) { // 120,000 ILS in thousands
          warningMessage = `
            <div class="alert alert-warning mt-3" role="alert">
              <strong>⚠️ Важно:</strong> Ваша прогнозируемая годовая выручка (${formatNumber(annualRevenue)} тыс. шек.) превышает лимит Эсек Патур в 120,000 шек./год.
              <br/>Вы будете автоматически переведены в статус <strong>Эсек Мурше</strong> (НДС 17% + прогрессивный налог).
              <br/>Расчет учитывает этот переход после 12 месяцев.
            </div>
          `;
        }
      } else if (country === "ru" || !country) {
         // Russian limits logic (in thousands RUB)
         // NPD: 2,400 (2.4 mln)
         // Patent: 60,000 (60 mln)
         // USN (VAT limit): 60,000 (60 mln)
         // USN (Limit): 450,000 (450 mln)
         
         if (formData.taxSystem === "npd" && annualRevenue > 2400) {
             warningMessage = `
            <div class="alert alert-danger mt-3" role="alert">
              <strong>⚠️ Критично:</strong> Годовая выручка (${formatNumber(annualRevenue)} тыс. ₽) превышает лимит НПД (2.4 млн ₽).
              <br/>Вам необходимо перейти на ИП (УСН/Патент) или ООО. Расчет может быть некорректен для НПД.
            </div>`;
         } else if (formData.taxSystem === "patent" && annualRevenue > 60000) {
              warningMessage = `
            <div class="alert alert-danger mt-3" role="alert">
              <strong>⚠️ Критично:</strong> Годовая выручка (${formatNumber(annualRevenue)} тыс. ₽) превышает лимит Патента (60 млн ₽).
              <br/>Вы потеряете право на патент и будете переведены на ОСНО (или УСН, если подавали заявление).
            </div>`;
         } else if ((formData.taxSystem === "usn_6" || formData.taxSystem === "usn_15")) {
             if (annualRevenue > 450000) {
                  warningMessage = `
                <div class="alert alert-danger mt-3" role="alert">
                  <strong>⚠️ Критично:</strong> Годовая выручка (${formatNumber(annualRevenue)} тыс. ₽) превышает лимит УСН (450 млн ₽).
                  <br/>Вы обязаны перейти на ОСНО. Расчет будет переключен на ОСНО автоматически (в разработке).
                </div>`;
             } else if (annualRevenue > 60000) {
                  warningMessage = `
                <div class="alert alert-warning mt-3" role="alert">
                  <strong>⚠️ Внимание (2025):</strong> Годовая выручка (${formatNumber(annualRevenue)} тыс. ₽) превышает 60 млн ₽.
                  <br/>Вы обязаны платить НДС (обычно 5% или 7%) даже на УСН. Расчет будет скорректирован.
                </div>`;
             }
         }
      }
      
      const currency = country === "il" ? "₪" : "₽";

      setResultHtml(`
        ${warningMessage}
        <div><b>Чистая прибыль (NP):</b> ${(result.totalNetProfit ?? 0).toFixed(
          2
        )} тыс ${currency}</div>
        <div><b>Рентабельность инвестиций (ROI):</b> ${(
          result.roi ?? 0
        ).toFixed(2)}%</div>
        <div><b>Срок окупаемости (PP):</b> ${
          result.paybackMonth > 0
            ? result.paybackMonth + " месяцев"
            : "Не достигнута"
        }</div>
        <div><b>EBITDA:</b> ${(result.ebitda ?? 0).toFixed(2)} тыс ${currency}</div>
        <div><b>Cash Flow:</b> ${(result.cashFlow ?? 0).toFixed(2)} тыс ${currency}</div>
        <div><b>Точка безубыточности:</b> ${
          result.breakEvenMonth > 0
            ? result.breakEvenMonth + " месяцев"
            : "Не достигнута"
        }</div>
      `);
    } catch (err: any) {
      setResultHtml("Ошибка при расчёте: " + err.message);
    }
  };

  return (
    <div>
      <Header />

      <main className={styles.pageContainer}>
        <h1>Генератор финансовой модели ({country === "il" ? "Израиль" : "Россия"}). Ver. {country === "il" ? "IL.001" : "RU.003"}</h1>

        <div className="details-toggle">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setDetailsOpen(!detailsOpen);
            }}
          >
            {detailsOpen
              ? "Скрыть ▲"
              : "Подробнее о сервисе финансовой модели ▼"}
          </a>
          {detailsOpen && (
            <div id="details-content">
              <p>
                Заполните форму для получения расчета. Чем больше данных, тем точнее результат.
              </p>
              {country === "il" && (
                <div className="mt-3">
                  <h6>Налоговые системы Израиля:</h6>
                  <ul className="small">
                    <li><strong>Эсек Патур:</strong> Без НДС. Лимит годового оборота ~120,000 шек. Прогрессивный подоходный налог 10-20%.</li>
                    <li><strong>Эсек Мурше:</strong> НДС 17% (можно возвращать входящий НДС). Прогрессивный подоходный налог 10-47%.</li>
                    <li><strong>Хевра Баам (ХП):</strong> Корпоративный налог 23%. Налог на дивиденды 25-30% (не включен в расчет).</li>
                  </ul>
                  <p className="small text-muted">
                    💡 Социальные отчисления работодателя (~14%) автоматически добавляются к расходам.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==== Форма ==== */}
        <form
          id="financeForm"
          className={styles.formContainer}
          onSubmit={handleSubmit}
        >
          {/* Общие данные */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Общие данные</legend>
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Имя"
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
                  placeholder="Название проекта"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Тип бизнеса / Деятельности */}
            <div className={styles.row}>
              <div className={styles.inputWithIcon} style={{ gridColumn: "1 / -1" }}>
                <i className="fa fa-briefcase"></i>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    {country === "il" ? "Выберите тип деятельности" : "Выберите форму бизнеса"}
                  </option>
                  
                  {country === "il" ? (
                    <>
                      <option value="other">Другое (Общий бизнес - доступен Эсек Патур)</option>
                      <option value="medical">Медицинские/Парамедицинские услуги</option>
                      <option value="legal">Юридические услуги (Адвокат)</option>
                      <option value="accounting">Бухгалтерия/Счетоводство</option>
                      <option value="engineering">Инженерные/Архитектурные услуги</option>
                      <option value="insurance">Страховой агент</option>
                      <option value="detective">Частный детектив</option>
                      <option value="auditor">Аудитор</option>
                      <option value="consultant">Консультант по управлению</option>
                      <option value="writer">Писатель</option>
                      <option value="realtor">Брокер по недвижимости</option>
                      <option value="teacher">Преподаватель/Учитель</option>
                    </>
                  ) : (
                    <>
                      <option value="self_employed">Самозанятый (НПД)</option>
                      <option value="ip">Индивидуальный предприниматель (ИП)</option>
                      <option value="ooo">Общество с ограниченной ответственностью (ООО)</option>
                      <option value="ao">Акционерное общество (АО)</option>
                    </>
                  )}
                </select>
              </div>
            </div>


            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-percent"></i>
                <select
                  name="taxSystem"
                  value={formData.taxSystem}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Налоговая система</option>
                  {country === "il" ? (
                    <>
                      {/* Только "other" (общий бизнес) может использовать Эсек Патур */}
                      {(formData.businessType === "other" || !formData.businessType) && (
                        <option value="osek_patur">Эсек Патур (без НДС, прогрессивный 10-20%)</option>
                      )}
                      <option value="osek_murshe">Эсек Мурше (НДС 17%, прогрессивный 10-47%)</option>
                      <option value="company_ltd">Хевра Баам (корпоративный 23%)</option>
                    </>
                  ) : (
                    <>
                     {/* Логика для России */}
                     {(formData.businessType === "self_employed" || formData.businessType === "ip") && (
                        <option value="npd">НПД (Самозанятый) - 4-6%, лимит 2.4 млн</option>
                     )}
                     {formData.businessType === "ip" && (
                        <option value="patent">Патент (ПСН) - фикс, лимит 60 млн</option>
                     )}
                     {(formData.businessType === "ip" || formData.businessType === "ooo" || formData.businessType === "ao") && (
                        <>
                           <option value="usn_6">УСН "Доходы" (6%) - лимит 450 млн</option>
                           <option value="usn_15">УСН "Доходы-Расходы" (15%) - лимит 450 млн</option>
                        </>
                     )}
                     {(formData.businessType === "ip" || formData.businessType === "ooo") && (
                        <>
                           <option value="ausn_dohodi">АУСН "Доходы" (8%)</option>
                           <option value="ausn_dohodi_rashodi">АУСН "Д-Р" (20%)</option>
                        </>
                     )}
                     {formData.businessType !== "self_employed" && (
                        <option value="osno">ОСНО (НДС 20% + Налог на прибыль/НДФЛ)</option>
                     )}
                    </>
                  )}
                </select>
                {country === "il" && formData.businessType && formData.businessType !== "other" && (
                  <small className="text-muted d-block mt-1">
                    ⚠️ Ваша профессия требует обязательной регистрации плательщиком НДС (Эсек Мурше или Хевра Баам)
                  </small>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-calendar"></i>
                <input
                  type="number"
                  name="horizon"
                  placeholder="Срок планирования, лет"
                  min={1}
                  max={20}
                  value={formData.horizon}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Доходы */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Доходы ежемесячные, тыс ₽</legend>
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-chart-line"></i>
                <input
                  type="text"
                  name="revenue"
                  placeholder="Выручка"
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
                  placeholder="Рост, %"
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
                    Запланируйте рост выручки, например 2 % от начального
                    значения ежемесячной выручки
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
                  <option value="">Период роста</option>
                  <option value="monthly">Каждый месяц</option>
                  <option value="2months">Каждые 2 мес</option>
                  <option value="quarter">Ежеквартально</option>
                  <option value="halfyear">Раз в полгода</option>
                </select>
                {hintsVisible["hint-growth-period"] && (
                  <div className={styles.inputHint} id="hint-growth-period">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-growth-period")}
                    >
                      ×
                    </span>
                    Запланируйте, как часто растет выручка, например рост 2 %
                    каждый месяц
                  </div>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-chart-line"></i>
                <input
                  type="number"
                  name="otherIncome"
                  placeholder="Прочие доходы"
                  value={formData.otherIncome}
                  onChange={handleInputChange}
                />
                {hintsVisible["hint-other-income"] && (
                  <div className={styles.inputHint} id="hint-other-income">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-other-income")}
                    >
                      ×
                    </span>
                    Денежные поступления кроме выручки, например доходы от акций
                    или другого бизнеса
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Переменные расходы */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Переменные расходы ежемесячные, тыс ₽
            </legend>
            <div className={styles.row}>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-sliders-h"></i>
                <select
                  name="variableExpensesIsPercent"
                  value={formData.variableExpensesIsPercent}
                  onChange={handleInputChange}
                >
                  <option value="true">в % от выручки</option>
                  <option value="false">в рублях</option>
                </select>
              </div>
              <div className={styles.inputWithIcon}>
                <i className="fa fa-ruble-sign"></i>
                <input
                  type="text"
                  name="variableExpensesValue"
                  placeholder="Переменные расходы (% или сумма)"
                  value={formData.variableExpensesValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Постоянные расходы */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Постоянные расходы ежемесячные, тыс {country === "il" ? "₪" : "₽"}
            </legend>
            {country === "il" && (
              <p className="small text-muted mb-2">
                💡 Примечание: Социальные отчисления работодателя (~14%) автоматически добавляются к расходам
              </p>
            )}
            <div className={`${styles.row} ${styles.rowFour}`}>
              <input
                type="text"
                name="suppliesExpense"
                placeholder="Закупки"
                value={formData.suppliesExpense}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="salaryExpense"
                placeholder="Зарплата"
                value={formData.salaryExpense}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="rentExpense"
                placeholder="Аренда"
                value={formData.rentExpense}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="otherExpense"
                placeholder="Прочие"
                value={formData.otherExpense}
                onChange={handleInputChange}
              />
            </div>
          </fieldset>

          {/* Инвестиции */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Инвестиционные данные</legend>
            <div className={`${styles.row} ${styles.rowFour}`}>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  name="investment"
                  placeholder={`Инвестиции, тыс ${country === "il" ? "₪" : "₽"}`}
                  value={formData.investment}
                  onChange={handleInputChange}
                />
                {hintsVisible["hint-invest"] && (
                  <div className={styles.inputHint} id="hint-invest">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-invest")}
                    >
                      ×
                    </span>
                    Сумма инвестиций, необходимая на старте проекта
                  </div>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  name="loanPercent"
                  placeholder="% по кредиту"
                  value={formData.loanPercent}
                  onChange={handleInputChange}
                />
                {hintsVisible["hint-loan-percent"] && (
                  <div className={styles.inputHint} id="hint-loan-percent">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-loan-percent")}
                    >
                      ×
                    </span>
                    Годовая процентная ставка по кредиту
                  </div>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  name="loanHoliday"
                  placeholder="Кредит. каникулы, мес"
                  value={formData.loanHoliday}
                  onChange={handleInputChange}
                />
                {hintsVisible["hint-loan-holiday"] && (
                  <div className={styles.inputHint} id="hint-loan-holiday">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-loan-holiday")}
                    >
                      ×
                    </span>
                    Период, когда тело кредита не погашается
                  </div>
                )}
              </div>
              <div className={styles.inputWithIcon}>
                <input
                  type="number"
                  name="loanTerm"
                  placeholder="Срок кредита, лет"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                />
                {hintsVisible["hint-loan-term"] && (
                  <div className={styles.inputHint} id="hint-loan-term">
                    <span
                      className={styles.closeTooltip}
                      onClick={() => hideTooltip("hint-loan-term")}
                    >
                      ×
                    </span>
                    Общий срок возврата кредита
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <div className="form-check mb-3 d-flex align-items-center justify-content-center">
             <input 
               className="form-check-input me-2" 
               type="checkbox" 
               id="privacy-check" 
               required 
               checked={isPrivacyAgreed}
               onChange={(e) => setIsPrivacyAgreed(e.target.checked)}
             />
             <label className="form-check-label" htmlFor="privacy-check" style={{fontSize: '0.9em', textAlign: 'left'}}>
               Отправляя форму, вы соглашаетесь с <a href="/ru/privacy" target="_blank" rel="noreferrer">Политикой конфиденциальности</a> / политикой по защите персональных данных
             </label>
          </div>

          <div style={{ textAlign: "center" }}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!isPrivacyAgreed}
              style={{ opacity: isPrivacyAgreed ? 1 : 0.5, cursor: isPrivacyAgreed ? 'pointer' : 'not-allowed' }}
            >
              Рассчитать
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
