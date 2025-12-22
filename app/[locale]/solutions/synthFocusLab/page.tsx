import SynthFocusLabPageRu from "../../../solutions/synthFocusLab/page.ru";
import SynthFocusLabPageEn from "../../../solutions/synthFocusLab/page.en";

type Params = {
  params: {
    locale: string;
  };
};

export default function SynthFocusLabLocalePage({ params }: Params) {
  return params.locale === "ru" ? <SynthFocusLabPageRu /> : <SynthFocusLabPageEn />;
}
