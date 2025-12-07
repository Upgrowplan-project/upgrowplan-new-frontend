import PlanPageEn from "../../../solutions/plan/page.en";
import PlanPageRu from "../../../solutions/plan/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function PlanLocalePage({ params }: Params) {
  return params.locale === "ru" ? <PlanPageRu /> : <PlanPageEn />;
}



