"use client";

import { usePathname } from "next/navigation";
import EnPage from "./page.en";
import RuPage from "./page.ru";

export default function Page() {
  const pathname = usePathname();
  const isRussian = pathname.startsWith("/ru");
  
  return isRussian ? <RuPage /> : <EnPage />;
}
