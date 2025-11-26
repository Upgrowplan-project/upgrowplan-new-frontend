import AboutPageEn from "../../about/page.en";
import AboutPageRu from "../../about/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function AboutLocalePage({ params }: Params) {
  return params.locale === "ru" ? <AboutPageRu /> : <AboutPageEn />;
}

