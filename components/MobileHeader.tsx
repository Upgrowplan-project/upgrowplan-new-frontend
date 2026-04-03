"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const translations = {
  en: {
    ru: "Русский",
    en: "English",
  },
  ru: {
    ru: "Русский (РУ)",
    en: "English (EN)",
  },
};

export default function MobileHeader() {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "/";

  // Determine locale from pathname
  const isRussian = pathname.startsWith("/ru");
  const locale = isRussian ? "ru" : "en";
  const t = translations[locale];

  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "/";
  const query = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  ).toString();
  const queryString = query ? `?${query}` : "";

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) {
      setShowLanguageMenu(false);
      return;
    }

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    const localePrefix = newLocale === "en" ? "" : `/${newLocale}`;
    const pathPart = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    const newPath = `${localePrefix}${pathPart}${queryString}` || "/";
    router.push(newPath);
    setShowLanguageMenu(false);
  };

  const homeLink = locale === "en" ? "/" : "/ru";

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(1, 52, 110, 0.1)",
          padding: "0.75rem 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          {/* Left: Home icon */}
          <Link
            href={homeLink}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#01346e",
              fontSize: "1.25rem",
              textDecoration: "none",
            }}
            title="Home"
          >
            <i className="bi bi-house-fill" />
          </Link>

          {/* Center: Logo + Brand Name */}
          <Link
            href={homeLink}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Image
              src="/LogoUpGrowSmall2.png"
              alt="Upgrowplan"
              width={32}
              height={32}
              style={{ width: "32px", height: "auto" }}
            />
            <span
              style={{
                color: "#01346e",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Upgrowplan
            </span>
          </Link>

          {/* Right: Language Switcher */}
          <div style={{ position: "relative", width: "40px" }}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: "1.25rem",
                color: "#01346e",
                width: "100%",
              }}
              title="Language"
            >
              <i className="bi bi-globe2" />
            </button>

            {/* Language Dropdown Menu */}
            {showLanguageMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(1, 52, 110, 0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(1, 52, 110, 0.15)",
                  overflow: "hidden",
                  zIndex: 1000,
                  minWidth: "140px",
                }}
              >
                <button
                  onClick={() => switchLocale("ru")}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "none",
                    background:
                      locale === "ru"
                        ? "rgba(6, 131, 245, 0.1)"
                        : "transparent",
                    color: locale === "ru" ? "#0683f5" : "#01346e",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: locale === "ru" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(6, 131, 245, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      locale === "ru"
                        ? "rgba(6, 131, 245, 0.1)"
                        : "transparent";
                  }}
                >
                  🇷🇺 {t.ru}
                </button>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(1, 52, 110, 0.1)",
                  }}
                />
                <button
                  onClick={() => switchLocale("en")}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "none",
                    background:
                      locale === "en"
                        ? "rgba(6, 131, 245, 0.1)"
                        : "transparent",
                    color: locale === "en" ? "#0683f5" : "#01346e",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: locale === "en" ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(6, 131, 245, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      locale === "en"
                        ? "rgba(6, 131, 245, 0.1)"
                        : "transparent";
                  }}
                >
                  🇺🇸 {t.en}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for Tab Bar at bottom */}
      <div style={{ height: "70px" }} />
    </>
  );
}
