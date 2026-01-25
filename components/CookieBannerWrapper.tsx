"use client";

import { usePathname } from "next/navigation";
import CookieBanner from "./CookieBanner";

export default function CookieBannerWrapper() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";

  return <CookieBanner locale={locale} />;
}
