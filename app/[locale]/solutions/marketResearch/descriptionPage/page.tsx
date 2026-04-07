import MarketResearchDescriptionPageEn from "./page.en";
import MarketResearchDescriptionPageRu from "./page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function MarketResearchDescriptionLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <MarketResearchDescriptionPageRu />
  ) : (
    <MarketResearchDescriptionPageEn />
  );
}
