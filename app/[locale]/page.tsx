"use client";

import HomePageEn from "./page.en";
import HomePageRu from "./page.ru";
import { use } from "react";

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  return locale === "ru" ? <HomePageRu /> : <HomePageEn />;
}
