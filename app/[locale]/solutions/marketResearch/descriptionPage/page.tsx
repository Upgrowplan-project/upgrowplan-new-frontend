import MarketResearchDescriptionPageEn from "../../../../solutions/marketResearch/descriptionPage/page.en";
import MarketResearchDescriptionPageRu from "../../../../solutions/marketResearch/descriptionPage/page.ru";

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
