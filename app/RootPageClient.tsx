"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/** Handles language detection & redirect to /ru when needed. Renders nothing. */
export default function RootPageClient() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam === "ru") {
      router.push("/ru");
      return;
    }
    if (langParam === "en") {
      document.cookie = `NEXT_LOCALE=en; path=/; max-age=31536000`;
      return;
    }

    const cookieLocale = getCookie("NEXT_LOCALE");
    if (cookieLocale === "ru") {
      router.push("/ru");
      return;
    }
    if (cookieLocale === "en") return;

    const navigatorLang = navigator.language.split("-")[0];
    if (navigatorLang === "ru") {
      router.push("/ru");
    }
  }, [router]);

  return null;
}
