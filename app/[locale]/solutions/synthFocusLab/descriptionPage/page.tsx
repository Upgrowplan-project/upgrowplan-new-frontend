import { redirect } from "next/navigation";

type Params = { params: { locale: string } };

export default function SynthFocusLabDescriptionRedirect({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  redirect(
    locale === "ru"
      ? "/ru/solutions/synthetic-customer-research"
      : "/solutions/synthetic-customer-research"
  );
}
