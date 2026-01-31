"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeEn from "./[locale]/page.en";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 1) Check lang param e.g., /?lang=ru or /?lang=en
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam === "ru") {
      router.push("/ru");
      return;
    }

    if (langParam === "en") {
      // set cookie preference and stay on root (English)
      document.cookie = `NEXT_LOCALE=en; path=/; max-age=31536000`;
      return;
    }

    // 2) Check cookie preference
    const cookieLocale = getCookie("NEXT_LOCALE");
    if (cookieLocale === "ru") {
      router.push("/ru");
      return;
    }
    if (cookieLocale === "en") {
      // Explicitly prefer English - stay on '/' (do nothing)
      return;
    }

    // 3) Auto-detect only if no explicit preference set
    const navigatorLang = navigator.language.split("-")[0];
    if (navigatorLang === "ru") {
      router.push("/ru");
    }
  }, [router]);

  // Render English homepage on root
  return <HomeEn />;
}
