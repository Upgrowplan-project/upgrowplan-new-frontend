import SocialPlanMasterPageRu from "../../../solutions/socialPlanMaster/page.ru";
import SocialPlanMasterPageEn from "../../../solutions/socialPlanMaster/page.en";

type Params = {
  params: {
    locale: string;
  };
};

export default function SocialPlanMasterLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <SocialPlanMasterPageRu />
  ) : (
    <SocialPlanMasterPageEn />
  );
}
