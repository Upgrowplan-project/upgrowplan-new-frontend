import OpenAbroadPageEn from "../../../solutions/openAbroad/page.en";
import OpenAbroadPageRu from "../../../solutions/openAbroad/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function OpenAbroadLocalePage({ params }: Params) {
  return params.locale === "ru" ? <OpenAbroadPageRu /> : <OpenAbroadPageEn />;
}



