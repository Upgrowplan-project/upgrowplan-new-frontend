import { redirect } from "next/navigation";

type Params = { params: { locale: string } };

export default function PlanMasterDescriptionRedirect({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  redirect(
    locale === "ru" ? "/ru/ai-business-plan-generator" : "/ai-business-plan-generator"
  );
}
