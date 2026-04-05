"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  /** If set, replaces the default locale menu (e.g. Blog + FAQ only). */
  customItems?: { label: string; href: string }[];
}

const menuItems = {
  ru: [
    { label: "Главная", href: "/" },
    { label: "Продукты", href: "/products" },
    { label: "Решения", href: "/solutions" },
    { label: "Блог", href: "/blog" },
    { label: "О нас", href: "/about" },
    { label: "Контакты", href: "/contacts" },
  ],
  en: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Solutions", href: "/solutions" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contacts", href: "/contacts" },
  ],
};

export default function MobileMenu({
  isOpen,
  onClose,
  customItems,
}: MobileMenuProps) {
  const pathname = usePathname() || "/";
  const isRussian = pathname.startsWith("/ru");
  const locale = isRussian ? "ru" : "en";
  const localePrefix = isRussian ? "/ru" : "";
  const items =
    customItems && customItems.length > 0 ? customItems : menuItems[locale];

  const buildUrl = (href: string): string => {
    if (href === "/") return localePrefix || "/";
    return `${localePrefix}${href}`;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 997,
            animation: "fadeIn 0.3s ease",
          }}
        />
      )}

      {/* Bottom Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          maxHeight: "80vh",
          overflowY: "auto",
          transition: "transform 0.3s ease",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Handle Bar */}
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: "#e0e8f0",
            borderRadius: "2px",
            margin: "12px auto 20px",
          }}
        />

        {/* Menu Title */}
        <div
          style={{
            padding: "0 20px 16px",
            borderBottom: "1px solid rgba(1, 52, 110, 0.1)",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              color: "#01346e",
              fontSize: "1.125rem",
              margin: 0,
              fontWeight: 600,
            }}
          >
            {locale === "ru" ? "Меню" : "Menu"}
          </h3>
        </div>

        {/* Menu Items */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={buildUrl(item.href)}
              onClick={onClose}
              style={{
                padding: "16px 20px",
                color: "#01346e",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 500,
                borderBottom: "1px solid rgba(1, 52, 110, 0.05)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(6, 131, 245, 0.06)";
                e.currentTarget.style.paddingLeft = "24px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.paddingLeft = "20px";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Close Padding */}
        <div style={{ height: "100px" }} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
