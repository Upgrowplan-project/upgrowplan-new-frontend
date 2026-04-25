import EnPage from "./page.en";
import RuPage from "./page.ru";

type Params = { params: { locale: string } };

export default function MarketResearchDescriptionPage({ params }: Params) {
  return params.locale === "ru" ? <RuPage /> : <EnPage />;
}
