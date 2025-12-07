import ProductsPageEn from "../../products/page.en";
import ProductsPageRu from "../../products/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function ProductsLocalePage({ params }: Params) {
  return params.locale === "ru" ? <ProductsPageRu /> : <ProductsPageEn />;
}



