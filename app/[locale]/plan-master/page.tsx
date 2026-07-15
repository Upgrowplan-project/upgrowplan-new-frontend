import type { Metadata } from "next";
import PageRu from "../../solutions/plan/page.ru";
import PageEn from "../../solutions/plan/page.en";

type Params = { params: { locale: string } };

// Сам генератор (чат-онбординг) — это инструмент, не индексируемая посадочная страница.
export const metadata: Metadata = {
  title: "PlanMaster — генератор бизнес-плана",
  robots: { index: false, follow: false },
};

export default function PlanMasterAppPage({ params }: Params) {
  const isRu = params.locale === "ru";
  return isRu ? <PageRu /> : <PageEn />;
}
