"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const locale = useLocale();
  const t = useTranslations("footer");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === 'en') {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <footer className="bg-light py-4">
      <div className="container d-flex justify-content-between align-items-center small flex-wrap">
        <div className="text-muted">
          © {new Date().getFullYear()} Upgrowplan. {t("copyright")}
        </div>
        <ul className="list-inline mb-0" style={{ marginBottom: 0 }}>
          <li className="list-inline-item">
            <Link href={getLocalePath("/")} style={{ textDecoration: "none", color: "#0785f6" }}>
              {t("home")}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/products")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t("products")}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/solutions")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t("solutions")}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/about")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t("about")}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/blog")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t("blog")}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/contacts")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t("contacts")}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={isLoggedIn ? getLocalePath("/account") : getLocalePath("/auth")}
              style={{
                textDecoration: "none",
                color: "#0785f6",
              }}
            >
              {isLoggedIn ? t("account") : t("signIn")}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
