"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const query = searchParams
    ? searchParams.toString()
      ? `?${searchParams.toString()}`
      : ""
    : "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // For next-intl with [locale] structure, pathname already includes locale prefix
  // Extract the path without locale for building hrefs
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "/";
  const baseHref = pathWithoutLocale === "" ? "/" : pathWithoutLocale;
  
  // Function to switch locale while preserving current path
  const switchLocale = (newLocale: string) => {
    const newPath = `/${newLocale}${baseHref === "/" ? "" : baseHref}${query}`;
    router.push(newPath);
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, margin: 0 }}>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{ backgroundColor: "#d7ecf6", margin: 0, padding: "0.5rem 0" }}
      >
        <div className="container">
          <Link href={`/${locale}`} className="navbar-brand d-flex align-items-center">
            <Image
              src="/LogoUpGrowSmall2.png"
              alt="Up&Grow Logo"
              width={40}
              height={40}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <span
              className="ms-2"
              style={{ color: "#1e6078", fontWeight: "bold" }}
            >
              {t("brand")}
            </span>
          </Link>
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
          <div
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link href={`/${locale}/products`} className="nav-link" style={{ color: "#0785f6" }}>
                  {t("products")}
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`/${locale}/solutions`} className="nav-link" style={{ color: "#0785f6" }}>
                  {t("solutions")}
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`/${locale}/blog`} className="nav-link" style={{ color: "#0785f6" }}>
                  {t("blog")}
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`/${locale}/about`} className="nav-link" style={{ color: "#0785f6" }}>
                  {t("about")}
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`/${locale}/contacts`} className="nav-link" style={{ color: "#0785f6" }}>
                  {t("contacts")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={isLoggedIn ? `/${locale}/account` : `/${locale}/auth`}
                  className="nav-link"
                  style={{ color: "#0785f6" }}
                >
                  {isLoggedIn ? t("account") : t("login")}
                </Link>
              </li>
              <li className="nav-item d-flex align-items-center ms-3">
                {/* Language switcher */}
                <button
                  onClick={() => switchLocale("en")}
                  className={`btn btn-sm ${
                    locale === "en" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  aria-label="Switch to English"
                  style={{ marginRight: 6 }}
                >
                  EN
                </button>

                <button
                  onClick={() => switchLocale("ru")}
                  className={`btn btn-sm ${
                    locale === "ru" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  aria-label="Switch to Russian"
                >
                  RU
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
