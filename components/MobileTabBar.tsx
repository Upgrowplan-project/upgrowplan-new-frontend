"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface TabItem {
  id: number;
  icon: string;
  label: { ru: string; en: string };
  href?: string;
  action?: string;
}

const tabs: TabItem[] = [
  {
    id: 1,
    icon: "bi-list",
    label: { ru: "Меню", en: "Menu" },
    action: "toggleMenu",
  },
  {
    id: 2,
    icon: "bi-grid",
    label: { ru: "Решения", en: "Solutions" },
    href: "/solutions",
  },
  {
    id: 3,
    icon: "bi-magic",
    label: { ru: "", en: "" },
    href: "/solutions/planMaster/descriptionPage",
  },
  {
    id: 4,
    icon: "bi-activity",
    label: { ru: "Pulse", en: "Pulse" },
    href: "/solutions/marketResearch/descriptionPage",
  },
  {
    id: 5,
    icon: "bi-person",
    label: { ru: "Вход", en: "Login" },
    href: "/auth",
  },
];

export default function MobileTabBar({
  onMenuOpen,
}: {
  onMenuOpen?: () => void;
}) {
  const pathname = usePathname() || "/";

  // Determine locale and clean path
  const isRussian = pathname.startsWith("/ru");
  const locale = isRussian ? "ru" : "en";
  const localePrefix = isRussian ? "/ru" : "";

  // Normalize pathname for comparison (remove locale prefix)
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "/";

  // Function to check if tab is active
  const isActive = (href?: string): boolean => {
    if (!href) return false;
    if (href === "/") {
      return pathWithoutLocale === "/" || pathWithoutLocale === "";
    }
    return pathWithoutLocale.startsWith(href);
  };

  // Function to build full URL with locale prefix
  const buildUrl = (href: string): string => {
    return `${localePrefix}${href}`;
  };

  const handleTabClick = (tab: TabItem) => {
    if (tab.action === "toggleMenu") {
      onMenuOpen?.();
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(1, 52, 110, 0.1)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 998,
        boxShadow: "0 -4px 12px rgba(1, 52, 110, 0.08)",
      }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        const isCentral = tab.id === 3;
        const isMenu = tab.action === "toggleMenu";

        // For menu button, use a button instead of Link
        if (isMenu) {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.3rem",
                background: "none",
                border: "none",
                textDecoration: "none",
                fontSize: "0.75rem",
                color: "#4c5a70",
                fontWeight: "500",
                transition: "all 0.3s ease",
                flex: 1,
                height: "100%",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <i
                className={`bi ${tab.icon}`}
                style={{
                  fontSize: "1.5rem",
                  transition: "all 0.2s ease",
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: "500",
                }}
              >
                {tab.label[locale]}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={tab.id}
            href={buildUrl(tab.href || "/")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
              textDecoration: "none",
              fontSize: "0.75rem",
              color: active ? "#0683f5" : "#4c5a70",
              fontWeight: active ? "600" : "500",
              transition: "all 0.3s ease",
              flex: 1,
              height: "100%",
              position: isCentral ? "relative" : "relative",
              transform: isCentral && active ? "translateY(-8px)" : "none",
            }}
          >
            {isCentral ? (
              // Central button with image - WITH LABEL "Создать"
              <>
                <Image
                  src="/icons/create-doc-icon.png"
                  alt="Create"
                  width={32}
                  height={32}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginBottom: "4px",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: "500",
                    color: "#0683f5",
                  }}
                >
                  Создать
                </span>
              </>
            ) : (
              // Regular tabs - WITH LABEL
              <>
                <i
                  className={`bi ${tab.icon}`}
                  style={{
                    fontSize: "1.5rem",
                    transition: "all 0.2s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: active ? "600" : "500",
                  }}
                >
                  {tab.label[locale]}
                </span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
