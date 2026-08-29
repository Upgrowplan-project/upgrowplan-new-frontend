"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MESSAGES = {
  en: {
    title: "Server maintenance in progress",
    body: "Our backend services are temporarily unavailable. The site and blog work as usual. Generation features (business plans, market research, financial models) will be back online September 1st.",
    dismiss: "Got it",
  },
  ru: {
    title: "Технические работы на сервере",
    body: "Серверные сервисы временно недоступны. Сайт и блог работают в обычном режиме. Функции генерации (бизнес-планы, исследование рынка, финансовые модели) вернутся 1 сентября.",
    dismiss: "Понятно",
  },
};

export default function ServerDownBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const locale = pathname?.startsWith("/ru") ? "ru" : "en";
  const t = MESSAGES[locale];

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("backend-unavailable", handler);
    return () => window.removeEventListener("backend-unavailable", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#1e3a4f",
        color: "#fff",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.25)",
        fontSize: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>🔧</span>
        <div>
          <strong>{t.title}.</strong>{" "}
          <span style={{ opacity: 0.85 }}>{t.body}</span>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.4)",
          color: "#fff",
          borderRadius: 6,
          padding: "4px 14px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontSize: 13,
        }}
      >
        {t.dismiss}
      </button>
    </div>
  );
}
