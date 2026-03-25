import PlanMasterDescriptionPageEn from "../../../../solutions/planMaster/descriptionPage/page.en";
import PlanMasterDescriptionPageRu from "../../../../solutions/planMaster/descriptionPage/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function PlanMasterDescriptionLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <PlanMasterDescriptionPageRu />
  ) : (
    <PlanMasterDescriptionPageEn />
  );
}
