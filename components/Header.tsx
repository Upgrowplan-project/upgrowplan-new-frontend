"use client";

import Image from "next/image";
import { useState, useEffect, Suspense, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Simple inline translations - no next-intl
const translations = {
  en: {
    products: "Products",
    solutions: "Solutions",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    login: "Log In",
    logout: "Logout",
    account: "Account",
    monitoring: "Monitoring",
    menu: "Menu",
  },
  ru: {
    products: "Продукты",
    solutions: "Решения",
    blog: "Блог",
    about: "О нас",
    contact: "Контакты",
    login: "Вход",
    logout: "Выход",
    account: "Аккаунт",
    monitoring: "Мониторинг",
    menu: "Меню",
  },
};

function HeaderContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  // Determine locale from pathname
  const isRussian = pathname.startsWith("/ru");
  const locale = isRussian ? "ru" : "en";
  const t = translations[locale];

  const query = searchParams
    ? searchParams.toString()
      ? `?${searchParams.toString()}`
      : ""
    : "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      setIsAdmin(false);
      try {
        sessionStorage.removeItem("up_is_admin");
      } catch {
        /* ignore */
      }
      return;
    }
    // Кэш в сессии: не дёргаем /users/me на каждой навигации.
    try {
      const cached = sessionStorage.getItem("up_is_admin");
      if (cached !== null) {
        setIsAdmin(cached === "1");
        return;
      }
    } catch {
      /* ignore */
    }
    // Пункт «Мониторинг» показываем только админу (роль из профиля).
    import("../app/auth/authService")
      .then((m) => m.getUserProfile())
      .then((p) => {
        const admin = p?.role === "ADMIN";
        setIsAdmin(admin);
        try {
          sessionStorage.setItem("up_is_admin", admin ? "1" : "0");
        } catch {
          /* ignore */
        }
      })
      .catch(() => setIsAdmin(false));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".language-dropdown-container")) {
        setLanguageDropdownOpen(false);
      }
    };

    if (languageDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [languageDropdownOpen]);

  // Extract the path without locale for building hrefs
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "/";
  const baseHref = pathWithoutLocale === "" ? "/" : pathWithoutLocale;

  // Function to switch locale while preserving current path
  const switchLocale = (newLocale: string) => {
    // Save locale preference to cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year

    // For 'en', don't add prefix; for 'ru', add /ru prefix
    const localePrefix = newLocale === "en" ? "" : `/${newLocale}`;
    // If baseHref is "/", we want just the locale prefix (or empty for en)
    const pathPart = baseHref === "/" ? "" : baseHref;
    const newPath = `${localePrefix}${pathPart}${query}` || "/";
    router.push(newPath);
  };

  const homeLink = locale === "en" ? "/" : "/ru";
  const toggleLanguageDropdown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLanguageDropdownOpen((prev) => !prev);
  };
  const GlobeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 12h18M5 8h14M5 16h14" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 5000, margin: 0, overflow: "visible" }}>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{
          backgroundColor: "#d7ecf6",
          margin: 0,
          padding: "0.5rem 1rem",
          overflow: "visible",
        }}
      >
        {/* Mobile: Home icon on the left */}
        <div className="mobile-home-icon">
          <Link
            href={homeLink}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Home"
          >
            <Image
              src="/icons/home-icon.png"
              alt="Home"
              width={32}
              height={32}
              sizes="32px"
              priority={false}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Link>
        </div>

        {/* Logo and Brand Name */}
        <Link
          href={homeLink}
          className="navbar-brand d-flex align-items-center"
          style={{
            marginRight: "auto",
          }}
        >
          <Image
            src="/LogoUpGrowSmall2.png"
            alt="Up&Grow Logo"
            width={40}
            height={40}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <span
            className="ms-2"
            style={{
              color: "#1e6078",
              fontWeight: "bold",
              fontFamily:
                'var(--font-inter), "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif',
              letterSpacing: "0.01em",
            }}
          >
            Upgrowplan
          </span>
        </Link>

        {/* Mobile: Language switcher (Globe) on the right */}
        <div className="mobile-language-switcher">
          <button
            onClick={() => switchLocale(locale === "en" ? "ru" : "en")}
            style={{
              background: "none",
              border: "none",
              color: "#01346e",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "0.5rem",
            }}
            aria-label="Switch language"
            title={locale === "en" ? "Переключить на РУ" : "Switch to EN"}
          >
            <GlobeIcon />
          </button>
        </div>

        {/* Desktop burger menu */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible navigation menu */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link
                href={locale === "en" ? "/solutions" : "/ru/solutions"}
                className="nav-link"
                style={{ color: "#0785f6" }}
              >
                {t.solutions}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href={locale === "en" ? "/blog" : "/ru/blog"}
                className="nav-link"
                style={{ color: "#0785f6" }}
              >
                {t.blog}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href={locale === "en" ? "/about" : "/ru/about"}
                className="nav-link"
                style={{ color: "#0785f6" }}
              >
                {t.about}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href={locale === "en" ? "/contacts" : "/ru/contacts"}
                className="nav-link"
                style={{ color: "#0785f6" }}
              >
                {t.contact}
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link
                  href={locale === "en" ? "/monitoring" : "/ru/monitoring"}
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  {t.monitoring}
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                href={
                  isLoggedIn
                    ? locale === "en"
                      ? "/account"
                      : "/ru/account"
                    : locale === "en"
                      ? "/auth"
                      : "/ru/auth"
                }
                className="nav-link"
                style={{ color: "#0785f6" }}
              >
                {isLoggedIn ? t.account : t.login}
              </Link>
            </li>
            <li
              className="nav-item d-flex align-items-center ms-3 language-dropdown-container"
              style={{ position: "relative" }}
            >
              {/* Desktop: Language switcher with dropdown */}
              <button
                type="button"
                onClick={toggleLanguageDropdown}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0785f6",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  marginTop: "-0.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 5001,
                }}
                aria-label="Switch language"
                title={locale === "en" ? "Переключить язык" : "Switch language"}
              >
                <GlobeIcon />
              </button>

              {/* Language dropdown menu */}
              {languageDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    backgroundColor: "#ffffff",
                    border: "1px solid #d0d0d0",
                    borderRadius: "8px",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    zIndex: 5002,
                    width: "auto",
                    minWidth: "110px",
                    marginTop: "0.5rem",
                  }}
                >
                  {/* Show languages in reverse order based on current locale */}
                  {locale === "ru" ? (
                    // If RU is current: EN first, RU second
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          switchLocale("en");
                          setLanguageDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.6rem 0.8rem",
                          border: "none",
                          background: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "0.6rem",
                          color: "#0785f6",
                          fontSize: "0.95rem",
                          borderBottom: "1px solid #f0f0f0",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Image
                          src="/icons/en-icon.png"
                          alt="English"
                          width={20}
                          height={20}
                          style={{ borderRadius: "50%" }}
                        />
                        <span>en</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          switchLocale("ru");
                          setLanguageDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.6rem 0.8rem",
                          border: "none",
                          background: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "0.6rem",
                          color: "#0785f6",
                          fontSize: "0.95rem",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Image
                          src="/icons/ru-icon.png"
                          alt="Русский"
                          width={20}
                          height={20}
                          style={{ borderRadius: "50%" }}
                        />
                        <span>ru</span>
                      </button>
                    </>
                  ) : (
                    // If EN is current: RU first, EN second
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          switchLocale("ru");
                          setLanguageDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.6rem 0.8rem",
                          border: "none",
                          background: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "0.6rem",
                          color: "#0785f6",
                          fontSize: "0.95rem",
                          borderBottom: "1px solid #f0f0f0",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Image
                          src="/icons/ru-icon.png"
                          alt="Русский"
                          width={20}
                          height={20}
                          style={{ borderRadius: "50%" }}
                        />
                        <span>ru</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          switchLocale("en");
                          setLanguageDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.6rem 0.8rem",
                          border: "none",
                          background: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "0.6rem",
                          color: "#0785f6",
                          fontSize: "0.95rem",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Image
                          src="/icons/en-icon.png"
                          alt="English"
                          width={20}
                          height={20}
                          style={{ borderRadius: "50%" }}
                        />
                        <span>en</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  );
}
