"use client";

import { usePathname } from "next/navigation";
import EnPage from "../../[locale]/solutions/planMaster/page.en";
import RuPage from "../../[locale]/solutions/planMaster/page.ru";

export default function Page() {
  const pathname = usePathname();
  const isRussian = pathname.startsWith("/ru");

  return isRussian ? <RuPage /> : <EnPage />;
}
