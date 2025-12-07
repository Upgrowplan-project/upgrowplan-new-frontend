import AccountPageEn from "../../account/page.en";
import AccountPageRu from "../../account/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function AccountLocalePage({ params }: Params) {
  return params.locale === "ru" ? <AccountPageRu /> : <AccountPageEn />;
}



