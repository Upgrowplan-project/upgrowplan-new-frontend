"use client";

import { useMemo, useState } from "react";
import Header from "../../../components/Header";
import styles from "./finBuddy.module.css";
import {
  FiUploadCloud,
  FiZap,
  FiEdit3,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

const SCENARIOS = [
  {
    id: "coffee",
    title: "Кофе на бегу",
    description:
      "Мятый чек из кафе. OCR должен вытащить итог и категорию 'Питание/Представительские'.",
    image:
      "https://images.unsplash.com/photo-1461988091159-192b6df7054f?auto=format&fit=crop&w=900&q=80",
    result: {
      amount: "28.50",
      currency: "ILS",
      date: "2026-03-21",
      category: "Питание / Представительские",
      budgetImpact: "ok",
    },
    raw: {
      vendor: "Coffee Corner",
      confidence: 0.91,
      fields: {
        total_amount: 28.5,
        currency: "ILS",
        receipt_date: "2026-03-21",
        category: "Food & Entertainment",
      },
    },
  },
  {
    id: "equipment",
    title: "Закупка оборудования",
    description:
      "Счет-фактура на ноутбуки и канцелярию. AI должен распознать 'Основные средства'.",
    image:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=900&q=80",
    result: {
      amount: "12480.00",
      currency: "USD",
      date: "2026-03-18",
      category: "Основные средства",
      budgetImpact: "ok",
    },
    raw: {
      vendor: "Office Supply Pro",
      confidence: 0.86,
      fields: {
        total_amount: 12480,
        currency: "USD",
        receipt_date: "2026-03-18",
        category: "Assets",
      },
    },
  },
  {
    id: "travel",
    title: "Заграничная командировка",
    description:
      "Чек в евро. Система подтягивает курс и показывает сумму в основной валюте.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    result: {
      amount: "620.00",
      currency: "EUR",
      date: "2026-03-10",
      category: "Командировки",
      budgetImpact: "ok",
    },
    raw: {
      vendor: "Berlin Stay",
      confidence: 0.79,
      fields: {
        total_amount: 620,
        currency: "EUR",
        receipt_date: "2026-03-10",
        category: "Travel",
        base_currency_total: 2440,
        base_currency: "ILS",
        fx_rate: 3.94,
      },
    },
  },
  {
    id: "marketing",
    title: "Превышение лимита",
    description:
      "Загрузка чека, который выводит маркетинг в красную зону.",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80",
    result: {
      amount: "3950.00",
      currency: "ILS",
      date: "2026-03-20",
      category: "Маркетинг",
      budgetImpact: "over",
    },
    raw: {
      vendor: "AdSphere",
      confidence: 0.83,
      fields: {
        total_amount: 3950,
        currency: "ILS",
        receipt_date: "2026-03-20",
        category: "Marketing",
      },
      budget_alert: {
        category: "Marketing",
        threshold: 10000,
        actual: 11500,
        over_by_percent: 15,
      },
    },
  },
];

const STAGES = ["OCR...", "Классификация...", "Анализ бюджета..."];

export default function FinBuddyPlaygroundRu() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [imageUrl, setImageUrl] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState<number | null>(null);
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [result, setResult] = useState(SCENARIOS[0].result);
  const [raw, setRaw] = useState(SCENARIOS[0].raw);
  const [reportSent, setReportSent] = useState(false);

  const previewImage = useMemo(() => {
    if (localPreview) return localPreview;
    if (imageUrl.trim()) return imageUrl.trim();
    return activeScenario.image;
  }, [localPreview, imageUrl, activeScenario]);

  const simulateProcessing = () => {
    setReportSent(false);
    setStageIndex(0);
    setTimeout(() => setStageIndex(1), 900);
    setTimeout(() => setStageIndex(2), 1700);
    setTimeout(() => {
      setStageIndex(null);
      setResult(activeScenario.result);
      setRaw(activeScenario.raw);
    }, 2500);
  };

  const onScenarioSelect = (id: string) => {
    const scenario = SCENARIOS.find((item) => item.id === id);
    if (!scenario) return;
    setActiveScenario(scenario);
    setResult(scenario.result);
    setRaw(scenario.raw);
    setImageUrl("");
    setLocalPreview(null);
    setReportSent(false);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    setImageUrl("");
  };

  const budgetWarning = result.budgetImpact === "over";

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.badge}>Fin Buddy Playground</p>
            <h1>Тестовая зона AI-учета расходов</h1>
            <p className={styles.subtitle}>
              Быстро проверяйте, как Fin Buddy читает чеки, классифицирует
              расходы и предупреждает о бюджетных рисках.
            </p>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.heroStat}>
              <span>Время обработки</span>
              <strong>~2.5 сек</strong>
            </div>
            <div className={styles.heroStat}>
              <span>Средняя точность</span>
              <strong>91%</strong>
            </div>
            <div className={styles.heroStat}>
              <span>Очередь</span>
              <strong>Celery + OCR</strong>
            </div>
          </div>
        </section>

        <section className={styles.scenarios}>
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              className={
                scenario.id === activeScenario.id
                  ? styles.scenarioActive
                  : styles.scenario
              }
              onClick={() => onScenarioSelect(scenario.id)}
              type="button"
            >
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
            </button>
          ))}
        </section>

        <section className={styles.playground}>
          <div className={styles.pane}>
            <div className={styles.paneHeader}>
              <h2>Загрузка</h2>
              <FiUploadCloud />
            </div>
            <label className={styles.dropZone}>
              <input type="file" accept="image/*" onChange={onFileChange} />
              <span>Перетащите чек или загрузите файл</span>
            </label>
            <div className={styles.toggle}>
              <button
                type="button"
                className={mode === "auto" ? styles.toggleActive : styles.toggleBtn}
                onClick={() => setMode("auto")}
              >
                Авто
              </button>
              <button
                type="button"
                className={
                  mode === "manual" ? styles.toggleActive : styles.toggleBtn
                }
                onClick={() => setMode("manual")}
              >
                Ручной выбор категории
              </button>
            </div>
            <label className={styles.inputLabel}>
              URL изображения
              <input
                className={styles.input}
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://.../receipt.jpg"
              />
            </label>
            <button className={styles.primaryBtn} onClick={simulateProcessing}>
              Запустить обработку
            </button>
            <div className={styles.modeHint}>
              <FiEdit3 />
              <span>
                Режим {mode === "auto" ? "AI" : "ручной"} влияет на
                классификацию и уверенность.
              </span>
            </div>
          </div>

          <div className={styles.paneWide}>
            <div className={styles.paneHeader}>
              <h2>Процесс</h2>
              <FiZap />
            </div>
            <div className={styles.preview}>
              <div
                className={styles.previewImage}
                style={{ backgroundImage: `url(${previewImage})` }}
              />
              <div className={styles.box} style={{ top: "18%", left: "12%" }} />
              <div className={styles.box} style={{ top: "52%", left: "62%" }} />
              <div className={styles.box} style={{ top: "70%", left: "24%" }} />
            </div>
            <div className={styles.stages}>
              {STAGES.map((stage, index) => (
                <div
                  key={stage}
                  className={
                    stageIndex === null
                      ? styles.stageIdle
                      : index <= stageIndex
                      ? styles.stageActive
                      : styles.stageIdle
                  }
                >
                  <span>{stage}</span>
                  {stageIndex !== null && index === stageIndex && (
                    <div className={styles.spinner} />
                  )}
                </div>
              ))}
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h3>Результат</h3>
                <FiCheckCircle />
              </div>
              <div className={styles.resultGrid}>
                <label>
                  Сумма
                  <input value={result.amount} readOnly />
                </label>
                <label>
                  Валюта
                  <input value={result.currency} readOnly />
                </label>
                <label>
                  Дата
                  <input value={result.date} readOnly />
                </label>
                <label>
                  Категория
                  <input value={result.category} readOnly />
                </label>
              </div>
              {budgetWarning && (
                <div className={styles.budgetAlert}>
                  <FiAlertTriangle />
                  Внимание! Бюджет на маркетинг превышен на 15%.
                </div>
              )}
            </div>
          </div>

          <div className={styles.pane}>
            <div className={styles.paneHeader}>
              <h2>Аналитика</h2>
              <FiZap />
            </div>
            <div className={styles.jsonBlock}>
              <pre>{JSON.stringify(raw, null, 2)}</pre>
            </div>
            <div className={styles.chart}>
              <div className={styles.chartHeader}>Расходы за месяц</div>
              <div className={styles.chartBars}>
                <div className={styles.bar} style={{ height: "50%" }} />
                <div className={styles.bar} style={{ height: "65%" }} />
                <div className={styles.bar} style={{ height: "72%" }} />
                <div
                  className={budgetWarning ? styles.barAlert : styles.bar}
                  style={{ height: "90%" }}
                />
              </div>
            </div>
            <button
              className={styles.reportBtn}
              onClick={() => setReportSent(true)}
            >
              {reportSent ? "Спасибо, кейс отправлен" : "Report Issue"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
