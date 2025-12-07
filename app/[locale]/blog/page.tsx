import BlogPageEn from "../../blog/page.en";
import BlogPageRu from "../../blog/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function BlogLocalePage({ params }: Params) {
  return params.locale === "ru" ? <BlogPageRu /> : <BlogPageEn />;
}



