"use client";

import { useState } from "react";
import styles from "./grade.module.css";

const TOTAL_STEPS = 5;

interface GradeData {
  overall?: number;
  clarity?: number;
  usefulness?: number;
  accuracy?: number;
  business_value?: number;
  nps?: number;
  tags?: string[];
  feedback?: string;
}

interface GradeProps {
  sessionId: string;
}

const LOW_TAGS = [
  "Неточные данные",
  "Сложно читать",
  "Долго ждать",
  "Нет нужной информации",
  "Плохой интерфейс",
  "Другое",
];

const HIGH_TAGS = [
  "Глубина анализа",
  "Точность данных",
  "Практичность выводов",
  "Скорость генерации",
  "Удобный интерфейс",
  "Соответствие запросу",
];

function ScaleRow({
  min = 1,
  max = 10,
  value,
  onChange,
  size = "lg",
}: {
  min?: number;
  max?: number;
  value?: number;
  onChange: (v: number) => void;
  size?: "lg" | "sm";
}) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const baseClass = size === "lg" ? styles.pill : styles.pillSm;
  const activeClass = size === "lg" ? styles.pillActive : styles.pillSmActive;
  return (
    <div className={size === "lg" ? styles.scaleLg : styles.scaleSm}>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          className={baseClass + (value === n ? " " + activeClass : "")}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function RuGrade({ sessionId }: GradeProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "bck">("fwd");
  const [data, setData] = useState<GradeData>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isLow = (data.overall ?? 10) <= 5;
  const tags = isLow ? LOW_TAGS : HIGH_TAGS;

  function go(next: number) {
    setDir(next > step ? "fwd" : "bck");
    setStep(next);
  }

  function set<K extends keyof GradeData>(key: K, val: GradeData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  function toggleTag(tag: string) {
    setData((d) => {
      const cur = d.tags ?? [];
      return { ...d, tags: cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag] };
    });
  }

  async function submit() {
    try {
      setStatus("submitting");
      setErrorMsg("");

      // Build combined feedback: tags + free text
      const tagLine = data.tags?.length ? `[${data.tags.join(", ")}]` : "";
      const commentLine = data.feedback?.trim() ?? "";
      const feedbackStr = [tagLine, commentLine].filter(Boolean).join("\n") || undefined;

      const apiUrl = process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overall: data.overall,
          clarity: data.clarity,
          usefulness: data.usefulness,
          accuracy: data.accuracy,
          design: data.business_value,   // reuse design column for business_value
          recommend: data.nps,            // reuse recommend column for NPS
          feedback: feedbackStr,
          session_id: sessionId,
          service_name: "market_research",
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      if (!res.ok) throw new Error("http error");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Не удалось отправить. Попробуйте позже.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.successCard}>
            <span className={styles.successIcon}>🙏</span>
            <p className={styles.successTitle}>Спасибо за отзыв!</p>
            <p className={styles.successText}>Это помогает нам делать сервис лучше.</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerIcon}>💬</span>
          <div className={styles.headerText}>
            <h3>Оцените отчёт</h3>
            <p>Займёт 1 минуту · анонимно</p>
          </div>
          <span className={styles.stepCount}>{step + 1} / {TOTAL_STEPS}</span>
        </div>

        {/* Progress */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.dots}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span key={i} className={styles.dot + (i <= step ? " " + styles.dotActive : "")} />
          ))}
        </div>

        {/* Animated step */}
        <div className={styles.stepWrap}>
          <div key={step} className={dir === "fwd" ? styles.enterFwd : styles.enterBck}>

            {/* ── Step 0: Overall ──────────────────────────── */}
            {step === 0 && (
              <div>
                <div className={styles.stepTitle}>Как вам результат в целом?</div>
                <div className={styles.stepHint}>Оцените от 1 до 10</div>
                <ScaleRow value={data.overall} onChange={(v) => set("overall", v)} />
                <div className={styles.scaleLabels}>
                  <span>Ужасно</span>
                  <span>Отлично</span>
                </div>
                <div className={styles.btnRow}>
                  <span />
                  <button
                    type="button"
                    className={styles.nextBtn}
                    disabled={data.overall === undefined}
                    onClick={() => go(1)}
                  >
                    Далее →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 1: Dimensions ───────────────────────── */}
            {step === 1 && (
              <div>
                <div className={styles.stepTitle}>Параметры качества</div>
                <div className={styles.stepHint}>Оцените каждый параметр от 1 до 10</div>
                <div className={styles.dimGrid}>
                  {(
                    [
                      ["clarity", "Понятность"],
                      ["usefulness", "Полезность"],
                      ["accuracy", "Точность"],
                      ["business_value", "Ценность"],
                    ] as [keyof GradeData, string][]
                  ).map(([key, label]) => (
                    <div key={key} className={styles.dimRow}>
                      <span className={styles.dimLabel}>{label}</span>
                      <ScaleRow
                        size="sm"
                        value={data[key] as number | undefined}
                        onChange={(v) => set(key, v)}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.scaleLabels}>
                  <span>1 — Плохо</span>
                  <span>10 — Отлично</span>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(0)}>
                    ← Назад
                  </button>
                  <button type="button" className={styles.nextBtn} onClick={() => go(2)}>
                    Далее →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: NPS ──────────────────────────────── */}
            {step === 2 && (
              <div>
                <div className={styles.stepTitle}>Порекомендуете коллегам?</div>
                <div className={styles.stepHint}>0 — точно нет, 10 — однозначно да</div>
                <ScaleRow
                  min={0}
                  max={10}
                  value={data.nps}
                  onChange={(v) => set("nps", v)}
                />
                <div className={styles.npsZones}>
                  <span className={styles.npsDetractor}>Критики 0–6</span>
                  <span className={styles.npsPassive}>Нейтральные 7–8</span>
                  <span className={styles.npsPromoter}>Фанаты 9–10</span>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(1)}>
                    ← Назад
                  </button>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    disabled={data.nps === undefined}
                    onClick={() => go(3)}
                  >
                    Далее →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Smart tags ───────────────────────── */}
            {step === 3 && (
              <div>
                <div className={styles.stepTitle}>
                  {isLow ? "Что пошло не так?" : "Что понравилось больше всего?"}
                </div>
                <div className={styles.stepHint}>Можно выбрать несколько</div>
                <div className={styles.tagGrid}>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={
                        styles.tag +
                        ((data.tags ?? []).includes(tag) ? " " + styles.tagActive : "")
                      }
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(2)}>
                    ← Назад
                  </button>
                  <button type="button" className={styles.nextBtn} onClick={() => go(4)}>
                    Далее →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 4: Comment + submit ─────────────────── */}
            {step === 4 && (
              <div>
                <div className={styles.stepTitle}>Комментарий</div>
                <div className={styles.stepHint}>Необязательно — поделитесь деталями</div>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Что можно улучшить? Что особенно помогло?"
                  value={data.feedback ?? ""}
                  onChange={(e) => set("feedback", e.target.value)}
                />
                {status === "error" && (
                  <div className={styles.errorMsg}>{errorMsg}</div>
                )}
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(3)}>
                    ← Назад
                  </button>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    disabled={status === "submitting"}
                    onClick={submit}
                  >
                    {status === "submitting" ? "Отправляем..." : "Отправить отзыв"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
