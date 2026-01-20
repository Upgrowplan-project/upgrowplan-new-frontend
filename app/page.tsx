"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Определяем язык браузера или используем 'en' по умолчанию
    const userLang = navigator.language.split('-')[0];
    const locale = userLang === 'ru' ? 'ru' : 'en';
    router.push(`/${locale}`);
  }, [router]);
  
  return null;
}

