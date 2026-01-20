"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Simple inline translations
const translations = {
  en: {
    copyright: "All rights reserved.",
    home: "Home",
    products: "Products",
    solutions: "Solutions",
    blog: "Blog",
    about: "About",
    contacts: "Contacts",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  ru: {
    copyright: "Все права защищены.",
    home: "Главная",
    products: "Продукты",
    solutions: "Решения",
    blog: "Блог",
    about: "О нас",
    contacts: "Контакты",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
  }
};

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname() || "/";
  
  // Determine locale from pathname
  const isRussian = pathname.startsWith("/ru");
  const locale = isRussian ? "ru" : "en";
  const t = translations[locale];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === 'en') {
      return path;
    }
    return `/ru${path}`;
  };

  return (
    <footer className="bg-light py-4">
      <div className="container d-flex justify-content-between align-items-center small flex-wrap">
        <div className="text-muted">
          © {new Date().getFullYear()} Upgrowplan. {t.copyright}
        </div>
        <ul className="list-inline mb-0" style={{ marginBottom: 0 }}>
          <li className="list-inline-item">
            <Link href={getLocalePath("/")} style={{ textDecoration: "none", color: "#0785f6" }}>
              {t.home}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/products")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t.products}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/solutions")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t.solutions}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/blog")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t.blog}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/about")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t.about}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/contacts")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t.contacts}
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={getLocalePath("/privacy")}
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              {t.privacy}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
