import ModelOnePageEn from "../../../fin-model/model1/page.en";
import ModelOnePageRu from "../../../fin-model/model1/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function FinModelOneLocalePage({ params }: Params) {
  return params.locale === "ru" ? <ModelOnePageRu /> : <ModelOnePageEn />;
}

