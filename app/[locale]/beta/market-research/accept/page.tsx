import AcceptInvite from "@/app/beta/AcceptInvite";

export default function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return <AcceptInvite locale={locale === "ru" ? "ru" : "en"} />;
}
