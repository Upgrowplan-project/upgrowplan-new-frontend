import ContactsPageEn from "../../contacts/page.en";
import ContactsPageRu from "../../contacts/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function ContactsLocalePage({ params }: Params) {
  return params.locale === "ru" ? <ContactsPageRu /> : <ContactsPageEn />;
}

