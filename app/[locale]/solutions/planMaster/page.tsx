import PlanMasterPageRu from "../../../solutions/planMaster/page.ru";
import PlanMasterPageEn from "../../../solutions/planMaster/page.en";

type Params = {
  params: {
    locale: string;
  };
};

export default function PlanMasterLocalePage({ params }: Params) {
  return params.locale === "ru" ? <PlanMasterPageRu /> : <PlanMasterPageEn />;
}
