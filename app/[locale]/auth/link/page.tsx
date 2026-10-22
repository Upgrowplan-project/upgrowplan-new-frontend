import LoginLinkRedeem from "@/app/auth/LoginLinkRedeem";

export default function Page({ params }: { params: { locale: string } }) {
  return <LoginLinkRedeem locale={params.locale === "ru" ? "ru" : "en"} />;
}
