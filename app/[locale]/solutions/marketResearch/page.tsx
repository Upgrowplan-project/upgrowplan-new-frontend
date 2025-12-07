import MarketResearchPageEn from "../../../solutions/marketResearch/page.en";
import MarketResearchPageRu from "../../../solutions/marketResearch/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function MarketResearchLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <MarketResearchPageRu />
  ) : (
    <MarketResearchPageEn />
  );
}



