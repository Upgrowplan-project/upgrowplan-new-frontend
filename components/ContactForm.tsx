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
    invalidEmail: "Введите корректный Email",
    successAlert: "Сообщение отправлено! Мы свяжемся с вами в ближайшее время.",
    errorAlert: "Не удалось отправить сообщение. Попробуйте позднее.",
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
    invalidEmail: "Please enter a valid email",
    successAlert: "Message sent! We will get back to you soon.",
    errorAlert: "Failed to send message. Please try again later.",
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
  const [error, setError] = useState("");

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
      setError(t.invalidEmail);
      return;
    }
    setError("");

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
      alert(t.successAlert);
      onSuccess?.();
    } catch (err) {
      console.error("Error sending contact message:", err);
      alert(t.errorAlert);
    }
  };

  return (
    <form
      className={className}
      style={style}
      onSubmit={handleSubmit}
    >
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
          className={`form-control ${error ? "is-invalid" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
        />
        {error && <div className="invalid-feedback">{error}</div>}
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
          <a href="/privacy" target="_blank">
            {t.policyLinkOne}
          </a>{" "}
          {t.policyTextBetween}{" "}
          <a href="/privacy" target="_blank">
            {t.policyLinkTwo}
          </a>
          {t.policyTextAfter}
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!isChecked}
      >
        {t.submitLabel}
      </button>
    </form>
  );
}
