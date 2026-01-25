"use client";

import HomePageEn from "./page.en";
import HomePageRu from "./page.ru";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";
  return locale === "ru" ? <HomePageRu /> : <HomePageEn />;
}
