import { redirect } from "next/navigation";

type Params = { params: { locale: string } };

export default function PlanLocalePage({ params }: Params) {
  redirect(params.locale === "ru" ? "/ru/ai-business-plan-generator" : "/ai-business-plan-generator");
}
