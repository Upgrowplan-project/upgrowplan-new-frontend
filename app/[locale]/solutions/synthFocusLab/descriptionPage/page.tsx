import SynthFocusLabDescriptionPageEn from "../../../../solutions/synthFocusLab/descriptionPage/page.en";
import SynthFocusLabDescriptionPageRu from "../../../../solutions/synthFocusLab/descriptionPage/page.ru";

type Params = {
  params: {
    locale: string;
  };
};

export default function SynthFocusLabDescriptionLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <SynthFocusLabDescriptionPageRu />
  ) : (
    <SynthFocusLabDescriptionPageEn />
  );
}
