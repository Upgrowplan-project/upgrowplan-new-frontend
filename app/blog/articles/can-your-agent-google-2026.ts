import type { BilingualPost } from "../staticPosts";

export const canYourAgentGooglePost: BilingualPost = {
  id: 5007,
  slug: "can-your-agent-google-search-api-costs-2026",
  category: "ИИ",
  author: "Denis Naletov",
  createdAt: "2026-11-06T10:00:00.000Z",
  titleRu: "Может ли загуглить ваш агент? И сколько теперь это стоит?",
  titleEn: "Can Your AI Agent Google? And What Does It Cost Now?",
  descriptionRu:
    "Свежие и проверяемые данные из интернета нужны не каждому агенту. Разбираю закрытие Google Custom Search API, тарифы поисковых провайдеров для ИИ и цену автоматического сбора данных.",
  descriptionEn:
    "Not every AI agent needs live web data. A look at Google Custom Search API’s shutdown, search providers for AI, and the real cost of collecting fresh, verifiable information.",
  metaTitleRu: "Может ли ИИ-агент гуглить? Поиск в интернете и цены API",
  metaTitleEn: "Can AI Agents Search Google? Web Search APIs and Their Costs",
  metaDescriptionRu:
    "Google закроет Custom Search JSON API 1 января 2027 года. Какие поисковые API доступны ИИ-агентам, сколько стоят запросы и почему данные — часть экономики продукта.",
  metaDescriptionEn:
    "Google will discontinue Custom Search JSON API on January 1, 2027. Compare web search APIs for AI agents, query costs, and why data belongs in your product economics.",
  messageRu: "",
  messageEn: "",
  bodyRu: `
<p>Во-первых, не всем это нужно. Кто-то делает помощника для работы на ноутбуке или в Google Drive. А если в процессе надо собрать данные в интернете — да ещё и <strong>реальные</strong>, от которых зависит результат? Тут ой-ва-вой 🥹</p>

<p>ИИ шагает по планете: все кому не лень массово генерируют продукты — для себя, на продажу или просто по фану. Но если продукт зависит от свежих и проверяемых данных, добыча этих данных не будет бесплатной. И теперь просто «загуглить» — то есть дать агенту доступ к поисковому индексу — становится сложнее.</p>

<h2>Google закрывает Custom Search API</h2>
<p>Google объявил, что <a href="https://developers.google.com/custom-search/v1/overview">Custom Search JSON API будет отключён 1 января 2027 года</a>. Новым клиентам API уже недоступен; действующим дали время перейти на альтернативу. Для тех, кто пользовался им как удобным pay-as-you-go способом получать поисковые результаты по API, это означает необходимость менять поисковую цепочку.</p>

<p>По условиям <a href="https://developers.google.com/custom-search/terms">Custom Search API</a> права на отображение, хранение и дальнейшее использование результатов зависят от договора и конкретного сценария. Не стоит автоматически считать, что то, что можно открыть в браузере или получить по одному API, можно без ограничений собирать, кэшировать и скармливать ИИ. Условия нужно проверять отдельно для каждого источника.</p>

<h2>Что с ценой Vertex AI Search?</h2>
<p>Я видел оценку, что переход на Vertex обойдётся минимум в $30 000 в месяц. Важное уточнение: <strong>это не универсальная минимальная цена Google Vertex AI Search</strong>. В публичном прайсе есть pay-as-you-go: $1,50 за 1 000 запросов в Standard Edition и $4 за 1 000 — в Enterprise Edition. Есть и режим с подпиской на пропускную способность: для него указаны минимальная ёмкость 1 000 запросов в минуту и 50 ГБ хранилища. Итог зависит от выбранного режима, объёма и дополнительных функций. Смотрите <a href="https://cloud.google.com/generative-ai-app-builder/pricing">официальный прайс</a> и считайте свою нагрузку, а не только громкую цифру.</p>

<h2>Какие есть альтернативы?</h2>
<p>Вот провайдеры, которые я рассматривал для поиска и сбора данных. Цены и лимиты ниже — мой снимок тарифов на 6 ноября 2026 года; условия меняются, поэтому перед интеграцией перепроверьте их на сайтах сервисов.</p>

<ul>
  <li><strong><a href="https://exa.ai/pricing">Exa AI</a></strong> — векторный нейропоиск по смыслу, извлечение чистого Markdown. На дату моего сравнения: 10 000–20 000 запросов в месяц бесплатно ($10 кредитов), затем Search — около $7 за 1 000 запросов.</li>
  <li><strong><a href="https://www.tavily.com/pricing">Tavily Search</a></strong> — поиск, парсинг и очистка страниц для ИИ-агентов. Бесплатно 1 000 кредитов в месяц; далее $0,008 за кредит или план за $30 в месяц. Запрос и другие операции могут расходовать кредиты по-разному.</li>
  <li><strong><a href="https://serper.dev">Serper.dev</a></strong> — быстрый доступ к органической выдаче Google в JSON, удобно для каталогов вроде G2 и Capterra. По моему сравнению: бонус 2 500 запросов, затем Starter — $50 за 50 000 запросов; на больших объёмах эффективная цена ниже.</li>
  <li><strong><a href="https://brave.com/search/api/">Brave Search API</a></strong> — независимый поисковый индекс. В моём сравнении тариф Web Search начинался примерно с $5 за 1 000 запросов.</li>
  <li><strong><a href="https://dataforseo.com/pricing/serp">DataForSEO</a></strong> — Google Organic SERP API; использую как запасной вариант, когда другие цепочки поиска возвращают пустой результат. Цена зависит от режима: примерно $0,60 за 1 000 запросов в очереди до пяти минут и до $2 за 1 000 в live-режиме.</li>
  <li><strong><a href="https://serpapi.com/pricing">SerpApi</a></strong> — платный резерв для доступа к поисковой выдаче Google. На дату сравнения: 250 бесплатных запросов в месяц и подписка от $25 в месяц.</li>
</ul>

<p>В целом специализированный поиск для ИИ — это примерно от $1 до $15 за 1 000 запросов, в зависимости от провайдера, глубины поиска и того, включено ли извлечение текста. Это не вся стоимость исследования: добавьте повторные запросы, парсинг, проверку источников и работу самого агента.</p>

<h2>Что делать?</h2>
<ol>
  <li><strong>Искать и использовать альтернативы.</strong> У провайдеров разная специализация: один лучше находит смысловой контекст, другой дешевле отдаёт SERP, третий хорошо извлекает содержимое страниц.</li>
  <li><strong>Включить получение данных в экономику продукта.</strong> Данные — это не бесплатное приложение к ИИ; их добыча, очистка и проверка стоят денег.</li>
  <li><strong>Помнить про ручную работу.</strong> Человек по-прежнему может сам искать и разбирать материалы. Но его время тоже стоит денег — иногда дороже, чем работа помощника.</li>
</ol>

<p>Вот такой подарочек приготовил нам Google — будем сильнее.</p>

<p>А я продолжаю тестировать свой сервис — <a href="https://www.upgrowplan.com/ru/solutions/marketResearch/descriptionPage">честный маркетинговый отчёт за 15 минут</a>. Если хотите попробовать, напишите в комментариях — дам доступ.</p>

<p><em>Добрейшего всем!</em></p>
`,
  bodyEn: `
<p>First of all, not everyone needs this. Some people build an assistant that works on a laptop or in Google Drive. But what if it has to collect data from the web — and, heaven forbid, <strong>real</strong> data that can make or break the result? Yikes 🥹</p>

<p>AI is spreading everywhere. People are building products at scale — for themselves, to sell, or just for fun. But if a product depends on fresh, verifiable information, collecting that information won’t be free. And simply “Googling it” — giving an agent access to a search index — is getting harder.</p>

<h2>Google is discontinuing Custom Search API</h2>
<p>Google has announced that the <a href="https://developers.google.com/custom-search/v1/overview">Custom Search JSON API will be discontinued on January 1, 2027</a>. It is already unavailable to new customers; existing customers have time to move to an alternative. For teams using it as a convenient pay-as-you-go way to retrieve search results through an API, that means reworking their search pipeline.</p>

<p>Under the <a href="https://developers.google.com/custom-search/terms">Custom Search API terms</a>, rights to display, store, and further use results depend on the agreement and the use case. Don’t assume that anything you can open in a browser or retrieve through an API can be collected, cached, and fed to AI without restrictions. Check the terms for each source and use case.</p>

<h2>What about Vertex AI Search pricing?</h2>
<p>I’ve seen estimates saying a move to Vertex would cost at least $30,000 a month. One important correction: <strong>that is not a universal minimum price for Google Vertex AI Search</strong>. Its public pricing includes pay-as-you-go at $1.50 per 1,000 queries for Standard Edition and $4 per 1,000 for Enterprise Edition. There is also a subscription model for query capacity, with a stated minimum capacity of 1,000 queries per minute and 50 GB of storage. The total depends on the pricing model, workload, and add-ons. Check the <a href="https://cloud.google.com/generative-ai-app-builder/pricing">official pricing page</a> and calculate your own traffic instead of relying on one headline figure.</p>

<h2>What are the alternatives?</h2>
<p>Here are providers I considered for search and data collection. The prices and limits below are my snapshot from November 6, 2026; terms change, so verify them on each provider’s site before integrating.</p>

<ul>
  <li><strong><a href="https://exa.ai/pricing">Exa AI</a></strong> — semantic vector search and clean Markdown extraction. In my comparison: 10,000–20,000 free requests a month ($10 in credits), then Search at about $7 per 1,000 requests.</li>
  <li><strong><a href="https://www.tavily.com/pricing">Tavily Search</a></strong> — search, parsing, and page cleanup for AI agents. 1,000 free credits a month, then $0.008 per credit or a $30 monthly plan. Searches and other operations may consume credits differently.</li>
  <li><strong><a href="https://serper.dev">Serper.dev</a></strong> — fast access to Google organic results in JSON, useful for directories such as G2 and Capterra. My comparison showed a 2,500-query bonus, then a Starter plan at $50 for 50,000 queries; effective rates drop at higher volumes.</li>
  <li><strong><a href="https://brave.com/search/api/">Brave Search API</a></strong> — an independent search index. In my comparison, Web Search worked out to about $5 per 1,000 requests.</li>
  <li><strong><a href="https://dataforseo.com/pricing/serp">DataForSEO</a></strong> — Google Organic SERP API; I use it as a fallback when other search chains return empty results. Pricing depends on the mode: roughly $0.60 per 1,000 requests in a queue of up to five minutes, and up to $2 per 1,000 in live mode.</li>
  <li><strong><a href="https://serpapi.com/pricing">SerpApi</a></strong> — a paid fallback for Google search results. On the date of my comparison: 250 free searches a month and plans starting at $25 per month.</li>
</ul>

<p>In broad terms, AI-focused search providers charge about $1–$15 per 1,000 requests, depending on the provider, search depth, and whether page extraction is included. That is not the full research cost: account for retries, parsing, source checks, and the agent’s own work.</p>

<h2>So, what can you do?</h2>
<ol>
  <li><strong>Look for and use alternatives.</strong> Providers specialize differently: one may be better at semantic context, another may return SERPs more cheaply, and a third may excel at extracting page content.</li>
  <li><strong>Include data acquisition in your product economics.</strong> Data is not a free add-on to AI; collecting, cleaning, and checking it costs money.</li>
  <li><strong>Remember the human option.</strong> A person can still search and review material by hand. But human time costs money too — sometimes more than an AI assistant.</li>
</ol>

<p>That’s Google’s little gift to us. We’ll get stronger.</p>

<p>I’m continuing to test my service — an <a href="https://www.upgrowplan.com/solutions/marketResearch/descriptionPage">honest marketing report in 15 minutes</a>. If you’d like to try it, leave a comment and I’ll share access.</p>

<p><em>Wishing you all the best!</em></p>
`,
};
