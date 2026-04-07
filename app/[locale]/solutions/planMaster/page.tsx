import PlanMasterPageEn from "./page.en";
import PlanMasterPageRu from "./page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function PlanMasterLocalePage({ params }: Params) {
  return params.locale === "ru" ? <PlanMasterPageRu /> : <PlanMasterPageEn />;
}
