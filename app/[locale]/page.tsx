import HomePageEn from "./page.en";
import HomePageRu from "./page.ru";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  return locale === "ru" ? <HomePageRu /> : <HomePageEn />;
}

