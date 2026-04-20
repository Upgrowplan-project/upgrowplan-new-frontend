import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { breadcrumbSchema, breadcrumbs, consultingProductsSchema, type ConsultingProduct } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import ProductsPageEn from "../../products/page.en";
import ProductsPageRu from "../../products/page.ru";

type Params = { params: { locale: string } };

const productsEn: ConsultingProduct[] = [
  { name: "AgroPack. Standard business plan", description: "A document package (business plan, appendices, presentation) for applying to agricultural subsidies/grants. Prepared according to regulatory documentation.", price: "200" },
  { name: "Lean Canvas. Startup proposal", description: "For innovative and tech startups. Iterative approach, focus on problem and value. Includes pitch deck preparation.", price: "150" },
  { name: "Core Plan. Basic package", description: "Development of all main business-plan sections: marketing, production plan, risk assessment, extended financials.", price: "400" },
  { name: "Pitch Pro. Detailed business plan", description: "A detailed plan for fundraising: marketing strategy, SWOT analysis, financial model (UNIDO/EBRD style) with discounted cash flows.", price: "1000" },
  { name: "StartUp Zoom. Consultation", description: "Online consultation: introduction, task discussion, choosing collaboration format, terms and schedule.", price: "0" },
  { name: "Smart Numbers. Financial calculations", description: "Financial analytics: scenarios, cash flows, profitability calculations.", price: "80" },
  { name: "Pure Analyze. Marketing/financial analysis", description: "Market, marketing and risk analysis. An independent perspective on your business.", price: "50" },
  { name: "Partner Track. Long-term collaboration", description: "Regular updates to business plans, online analysis of new scenarios and maintenance of relationships with investors and banks.", price: "50", unitText: "MON" },
  { name: "Site Onboard. Website development", description: "Landing page or multi-page site for presenting your project. Modern solution for investors and customers.", price: "50" },
];

const productsRu: ConsultingProduct[] = [
  { name: "AgroPack. Стандартный бизнес-план", description: "Пакет документов для подачи на сельскохозяйственные субсидии/гранты. Составлен по нормативной документации.", price: "200" },
  { name: "Lean Canvas. Стартап-предложение", description: "Для инновационных и технологических стартапов. Итеративный подход, фокус на проблеме и ценности. Включает подготовку pitch deck.", price: "150" },
  { name: "Core Plan. Базовый пакет", description: "Разработка всех основных разделов бизнес-плана: маркетинг, производственный план, оценка рисков, расширенные финансы.", price: "400" },
  { name: "Pitch Pro. Детальный бизнес-план", description: "Детальный план для привлечения финансирования: маркетинговая стратегия, SWOT-анализ, финансовая модель (UNIDO/EBRD) с дисконтированными денежными потоками.", price: "1000" },
  { name: "StartUp Zoom. Консультация", description: "Онлайн-консультация: знакомство, обсуждение задачи, выбор формата сотрудничества, сроки и условия.", price: "0" },
  { name: "Smart Numbers. Финансовые расчёты", description: "Финансовая аналитика: сценарии, денежные потоки, расчёты рентабельности.", price: "80" },
  { name: "Pure Analyze. Маркетинговый/финансовый анализ", description: "Анализ рынка, маркетинга и рисков. Независимый взгляд на ваш бизнес.", price: "50" },
  { name: "Partner Track. Долгосрочное сотрудничество", description: "Регулярное обновление бизнес-планов, онлайн-анализ новых сценариев и поддержка отношений с инвесторами и банками.", price: "50", unitText: "MON" },
  { name: "Site Onboard. Разработка сайта", description: "Лендинг или многостраничный сайт для презентации вашего проекта. Современное решение для инвесторов и клиентов.", price: "50" },
];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.products;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function ProductsLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const products = locale === "ru" ? productsRu : productsEn;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs.products(locale)),
          ...consultingProductsSchema(products, locale),
        ]}
      />
      {locale === "ru" ? <ProductsPageRu /> : <ProductsPageEn />}
    </>
  );
}
