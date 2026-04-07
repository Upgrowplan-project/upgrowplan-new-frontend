import BusinessPulsePageEn from "./page.en";
import BusinessPulsePageRu from "./page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function BusinessPulseLocalePage({ params }: Params) {
  return params.locale === "ru" ? <BusinessPulsePageRu /> : <BusinessPulsePageEn />;
}
