import PrivacyPageEn from "../../privacy/page.en";
import PrivacyPageRu from "../../privacy/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function PrivacyLocalePage({ params }: Params) {
  // Simple locale switching similar to other pages
  return params.locale === "ru" ? <PrivacyPageRu /> : <PrivacyPageEn />;
}
