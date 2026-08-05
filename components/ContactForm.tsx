"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ContactFormLocale = "ru" | "en";

type ContactFormProps = {
  locale: ContactFormLocale;
  onSuccess?: () => void;
  initialMessage?: string;
  className?: string;
  style?: CSSProperties;
};

const copy = {
  ru: {
    nameLabel: "Имя",
    namePlaceholder: "Введите ваше имя",
    emailLabel: "Email",
    emailPlaceholder: "Введите ваш email",
    messageLabel: "Сообщение",
    messagePlaceholder: "Введите ваше сообщение",
    policyTextBefore: "Отправляя данное сообщение, я ознакомился и согласился с",
    policyTextBetween: "и",
    policyTextAfter: ".",
    policyLinkOne: "Политикой конфиденциальности",
    policyLinkTwo: "Политикой обработки персональных данных",
    submitLabel: "Отправить сообщение",
    sending: "Отправка...",
    invalidEmail: "Введите корректный Email",
    successTitle: "Сообщение отправлено!",
    successText: "Мы свяжемся с вами в ближайшее время.",
    errorTitle: "Не удалось отправить сообщение.",
    errorText: "Попробуйте позднее или напишите нам напрямую.",
    sendAnother: "Отправить ещё",
  },
  en: {
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    messageLabel: "Message",
    messagePlaceholder: "Enter your message",
    policyTextBefore: "By sending this message I have read and agree with the",
    policyTextBetween: "and the",
    policyTextAfter: ".",
    policyLinkOne: "Privacy Policy",
    policyLinkTwo: "Personal Data Processing Policy",
    submitLabel: "Send message",
    sending: "Sending...",
    invalidEmail: "Please enter a valid email",
    successTitle: "Message sent!",
    successText: "We will get back to you soon.",
    errorTitle: "Failed to send message.",
    errorText: "Please try again later or contact us directly.",
    sendAnother: "Send another",
  },
} as const;

export default function ContactForm({
  locale,
  onSuccess,
  initialMessage,
  className,
  style,
}: ContactFormProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(initialMessage || "");
  const [fieldError, setFieldError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const t = copy[locale];

  useEffect(() => {
    if (typeof initialMessage === "string") {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldError(t.invalidEmail);
      return;
    }
    setFieldError("");
    setStatus("sending");

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/monitoring/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      setName("");
      setEmail("");
      setMessage("");
      setIsChecked(false);
      setStatus("success");
      onSuccess?.();
    } catch (err) {
      console.error("Error sending contact message:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={className}
        style={{ ...style, textAlign: "center", padding: "2rem 1rem" }}
      >
        <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>✅</div>
        <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#16a34a", marginBottom: "0.25rem" }}>
          {t.successTitle}
        </p>
        <p style={{ color: "#4b5563", marginBottom: "1.25rem" }}>{t.successText}</p>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setStatus("idle")}
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form
      className={className}
      style={style}
      onSubmit={handleSubmit}
    >
      {status === "error" && (
        <div
          className="alert alert-danger py-2 mb-3 small d-flex align-items-center gap-2"
          role="alert"
        >
          <span>⚠️</span>
          <span><strong>{t.errorTitle}</strong> {t.errorText}</span>
        </div>
      )}
      <div className="mb-3">
        <label htmlFor={`name-${locale}`} className="form-label">
          {t.nameLabel}
        </label>
        <input
          type="text"
          id={`name-${locale}`}
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor={`email-${locale}`} className="form-label">
          {t.emailLabel}
        </label>
        <input
          type="email"
          id={`email-${locale}`}
          className={`form-control ${fieldError ? "is-invalid" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
        />
        {fieldError && <div className="invalid-feedback">{fieldError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor={`message-${locale}`} className="form-label">
          {t.messageLabel}
        </label>
        <textarea
          id={`message-${locale}`}
          className="form-control"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
          required
        ></textarea>
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id={`policyCheck-${locale}`}
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label className="form-check-label" htmlFor={`policyCheck-${locale}`}>
          {t.policyTextBefore}{" "}
          <a href={locale === "ru" ? "/ru/privacy" : "/privacy"} target="_blank">
            {t.policyLinkOne}
          </a>{" "}
          {t.policyTextBetween}{" "}
          <a href={locale === "ru" ? "/ru/privacy" : "/privacy"} target="_blank">
            {t.policyLinkTwo}
          </a>
          {t.policyTextAfter}
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!isChecked || status === "sending"}
      >
        {status === "sending" ? t.sending : t.submitLabel}
      </button>
    </form>
  );
}
