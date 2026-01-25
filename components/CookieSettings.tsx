"use client";

import { useState } from "react";
import { saveConsent } from "../lib/cookieConsent";

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "en" | "ru";
}

const translations = {
  en: {
    title: "Cookie Preferences",
    description: "We use cookies to enhance your browsing experience and analyze site traffic. You can choose which types of cookies to allow.",
    essential: "Essential Cookies",
    essentialDesc: "Required for the website to function properly. Cannot be disabled.",
    analytical: "Analytical Cookies",
    analyticalDesc: "Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    marketing: "Marketing Cookies",
    marketingDesc: "Used to track visitors across websites to display relevant advertisements.",
    savePreferences: "Save Preferences",
    acceptAll: "Accept All",
    rejectAll: "Reject All",
  },
  ru: {
    title: "Настройки Cookie",
    description: "Мы используем файлы cookie для улучшения вашего опыта и анализа трафика. Вы можете выбрать, какие типы cookie разрешить.",
    essential: "Обязательные Cookie",
    essentialDesc: "Необходимы для работы сайта. Не могут быть отключены.",
    analytical: "Аналитические Cookie",
    analyticalDesc: "Помогают понять, как посетители взаимодействуют с сайтом, собирая анонимную информацию.",
    marketing: "Маркетинговые Cookie",
    marketingDesc: "Используются для отслеживания посетителей на сайтах для показа релевантной рекламы.",
    savePreferences: "Сохранить настройки",
    acceptAll: "Принять всё",
    rejectAll: "Отклонить всё",
  },
};

export default function CookieSettings({ isOpen, onClose, locale }: CookieSettingsProps) {
  const t = translations[locale];
  const [preferences, setPreferences] = useState({
    essential: true,
    analytical: false,
    marketing: false,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    saveConsent({
      analytical: preferences.analytical,
      marketing: preferences.marketing,
    });
    onClose();
  };

  const handleAcceptAll = () => {
    saveConsent({
      analytical: true,
      marketing: true,
    });
    onClose();
  };

  const handleRejectAll = () => {
    saveConsent({
      analytical: false,
      marketing: false,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#1e6078", fontSize: "1.5rem" }}>
            {t.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#666",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem" }}>
          <p style={{ color: "#555", marginBottom: "1.5rem" }}>
            {t.description}
          </p>

          {/* Essential Cookies */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0, color: "#1e6078", fontSize: "1.1rem" }}>
                {t.essential}
              </h3>
              <input
                type="checkbox"
                checked={true}
                disabled
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              {t.essentialDesc}
            </p>
          </div>

          {/* Analytical Cookies */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0, color: "#1e6078", fontSize: "1.1rem" }}>
                {t.analytical}
              </h3>
              <input
                type="checkbox"
                checked={preferences.analytical}
                onChange={(e) =>
                  setPreferences({ ...preferences, analytical: e.target.checked })
                }
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              {t.analyticalDesc}
            </p>
          </div>

          {/* Marketing Cookies */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0, color: "#1e6078", fontSize: "1.1rem" }}>
                {t.marketing}
              </h3>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences({ ...preferences, marketing: e.target.checked })
                }
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              {t.marketingDesc}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleRejectAll}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#666",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            {t.rejectAll}
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #0785f6",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#0785f6",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#d7ecf6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            {t.savePreferences}
          </button>
          <button
            onClick={handleAcceptAll}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#0785f6",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0670d1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0785f6";
            }}
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
