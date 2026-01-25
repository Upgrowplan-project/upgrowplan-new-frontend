"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { hasConsent, acceptAllCookies, rejectAllCookies } from "../lib/cookieConsent";
import CookieSettings from "./CookieSettings";

interface CookieBannerProps {
  locale: "en" | "ru";
}

const translations = {
  en: {
    gdpr: {
      title: "We value your privacy",
      description:
        "We use cookies to analyze site traffic, personalize content, and provide social media features. By clicking 'Accept All', you consent to our use of cookies.",
      acceptAll: "Accept All",
      rejectAll: "Reject All",
      settings: "Cookie Settings",
      privacyPolicy: "Privacy Policy",
    },
  },
  ru: {
    simple: {
      description:
        "Мы используем файлы cookie для работы сайта и сбора статистики. Продолжая использовать наш сайт, вы соглашаетесь с",
      privacyPolicy: "Политикой конфиденциальности",
      accept: "Понятно",
      details: "Подробнее",
    },
  },
};

export default function CookieBanner({ locale }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consentGiven = hasConsent();
    setIsVisible(!consentGiven);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const handleAcceptSimple = () => {
    // For Russian version, accept all by default
    acceptAllCookies();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // GDPR version (English - strict)
  if (locale === "en") {
    const t = translations.en.gdpr;
    return (
      <>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
            zIndex: 9999,
            padding: "1.5rem",
            borderTop: "3px solid #1e6078",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Content */}
            <div>
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#1e6078",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                }}
              >
                🍪 {t.title}
              </h3>
              <p style={{ margin: 0, color: "#555", fontSize: "0.95rem" }}>
                {t.description}{" "}
                <Link
                  href="/privacy"
                  style={{
                    color: "#0785f6",
                    textDecoration: "underline",
                  }}
                >
                  {t.privacyPolicy}
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleAcceptAll}
                style={{
                  padding: "0.75rem 2rem",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#0785f6",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(7, 133, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0670d1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(7, 133, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0785f6";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(7, 133, 246, 0.3)";
                }}
              >
                {t.acceptAll}
              </button>

              <button
                onClick={handleRejectAll}
                style={{
                  padding: "0.75rem 2rem",
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
                  e.currentTarget.style.borderColor = "#999";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.borderColor = "#ccc";
                }}
              >
                {t.rejectAll}
              </button>

              <button
                onClick={() => setShowSettings(true)}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#0785f6",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  textDecoration: "underline",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0670d1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#0785f6";
                }}
              >
                {t.settings}
              </button>
            </div>
          </div>
        </div>

        <CookieSettings
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            setIsVisible(false);
          }}
          locale={locale}
        />
      </>
    );
  }

  // Russian version (simple notification)
  const t = translations.ru.simple;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1e6078",
        color: "#ffffff",
        zIndex: 9999,
        padding: "1rem 1.5rem",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Text */}
        <p style={{ margin: 0, fontSize: "0.95rem", flex: "1 1 auto" }}>
          🍪 {t.description}{" "}
          <Link
            href="/ru/privacy"
            style={{
              color: "#d7ecf6",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            {t.privacyPolicy}
          </Link>
          .
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #d7ecf6",
              borderRadius: "6px",
              backgroundColor: "transparent",
              color: "#d7ecf6",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(215, 236, 246, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {t.details}
          </button>

          <button
            onClick={handleAcceptSimple}
            style={{
              padding: "0.5rem 1.5rem",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#0785f6",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(7, 133, 246, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0670d1";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0785f6";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {t.accept}
          </button>
        </div>
      </div>

      <CookieSettings
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          setIsVisible(false);
        }}
        locale={locale}
      />
    </div>
  );
}
