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
  "Inaccurate data",
  "Hard to read",
  "Too slow",
  "Missing information",
  "Poor interface",
  "Other",
];

const HIGH_TAGS = [
  "Depth of analysis",
  "Data accuracy",
  "Actionable insights",
  "Speed of generation",
  "Easy to use",
  "Matched my request",
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

export default function EnGrade({ sessionId }: GradeProps) {
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
          design: data.business_value,
          recommend: data.nps,
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
      setErrorMsg("Could not submit. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.successCard}>
            <span className={styles.successIcon}>🙏</span>
            <p className={styles.successTitle}>Thank you for your feedback!</p>
            <p className={styles.successText}>It helps us keep improving the service.</p>
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
            <h3>Rate your report</h3>
            <p>Takes 1 minute · anonymous</p>
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
                <div className={styles.stepTitle}>How was the report overall?</div>
                <div className={styles.stepHint}>Rate from 1 to 10</div>
                <ScaleRow value={data.overall} onChange={(v) => set("overall", v)} />
                <div className={styles.scaleLabels}>
                  <span>Terrible</span>
                  <span>Excellent</span>
                </div>
                <div className={styles.btnRow}>
                  <span />
                  <button
                    type="button"
                    className={styles.nextBtn}
                    disabled={data.overall === undefined}
                    onClick={() => go(1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 1: Dimensions ───────────────────────── */}
            {step === 1 && (
              <div>
                <div className={styles.stepTitle}>Quality dimensions</div>
                <div className={styles.stepHint}>Rate each dimension from 1 to 10</div>
                <div className={styles.dimGrid}>
                  {(
                    [
                      ["clarity", "Clarity"],
                      ["usefulness", "Usefulness"],
                      ["accuracy", "Accuracy"],
                      ["business_value", "Value"],
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
                  <span>1 — Poor</span>
                  <span>10 — Excellent</span>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(0)}>
                    ← Back
                  </button>
                  <button type="button" className={styles.nextBtn} onClick={() => go(2)}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: NPS ──────────────────────────────── */}
            {step === 2 && (
              <div>
                <div className={styles.stepTitle}>Would you recommend it to peers?</div>
                <div className={styles.stepHint}>0 — definitely not, 10 — absolutely yes</div>
                <ScaleRow
                  min={0}
                  max={10}
                  value={data.nps}
                  onChange={(v) => set("nps", v)}
                />
                <div className={styles.npsZones}>
                  <span className={styles.npsDetractor}>Detractors 0–6</span>
                  <span className={styles.npsPassive}>Passives 7–8</span>
                  <span className={styles.npsPromoter}>Promoters 9–10</span>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(1)}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    disabled={data.nps === undefined}
                    onClick={() => go(3)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Smart tags ───────────────────────── */}
            {step === 3 && (
              <div>
                <div className={styles.stepTitle}>
                  {isLow ? "What went wrong?" : "What did you like most?"}
                </div>
                <div className={styles.stepHint}>Select all that apply</div>
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
                    ← Back
                  </button>
                  <button type="button" className={styles.nextBtn} onClick={() => go(4)}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 4: Comment + submit ─────────────────── */}
            {step === 4 && (
              <div>
                <div className={styles.stepTitle}>Any comments?</div>
                <div className={styles.stepHint}>Optional — share details</div>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="What could be improved? What was most helpful?"
                  value={data.feedback ?? ""}
                  onChange={(e) => set("feedback", e.target.value)}
                />
                {status === "error" && (
                  <div className={styles.errorMsg}>{errorMsg}</div>
                )}
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => go(3)}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    disabled={status === "submitting"}
                    onClick={submit}
                  >
                    {status === "submitting" ? "Sending..." : "Submit Feedback"}
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
