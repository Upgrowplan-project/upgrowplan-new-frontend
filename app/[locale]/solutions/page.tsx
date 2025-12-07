import SolutionsPageEn from "../../solutions/page.en";
import SolutionsPageRu from "../../solutions/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function SolutionsLocalePage({ params }: Params) {
  return params.locale === "ru" ? <SolutionsPageRu /> : <SolutionsPageEn />;
}



