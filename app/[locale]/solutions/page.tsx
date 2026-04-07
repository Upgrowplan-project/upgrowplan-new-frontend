import SolutionsPageEn from "./page.en";
import SolutionsPageRu from "./page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function SolutionsLocalePage({ params }: Params) {
  return params.locale === "ru" ? <SolutionsPageRu /> : <SolutionsPageEn />;
}



