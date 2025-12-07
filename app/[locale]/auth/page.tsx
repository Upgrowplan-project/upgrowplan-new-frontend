import AuthPageEn from "../../auth/page.en";
import AuthPageRu from "../../auth/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function AuthLocalePage({ params }: Params) {
  return params.locale === "ru" ? <AuthPageRu /> : <AuthPageEn />;
}



