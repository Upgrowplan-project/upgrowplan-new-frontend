import type { BilingualPost } from "../staticPosts";

const businessHubAnnouncement =
  "https://community.openai.com/t/introducing-businesses-in-chatgpt-in-beta/1414865";

export const openAiBusinessHubPost: BilingualPost = {
  id: 5008,
  slug: "openai-business-hub-chatgpt-2026",
  category: "ИИ",
  author: "Denis Naletov",
  createdAt: "2026-11-22T00:00:00.000Z",
  titleRu: "Business Hub от OpenAI: ChatGPT становится каналом для бизнеса",
  titleEn: "OpenAI Business Hub: ChatGPT Is Becoming a Business Channel",
  descriptionRu:
    "OpenAI запустила Business Hub в бета-версии: профиль компании в ChatGPT, аналитика упоминаний и переходов, товарные фиды и Business Agent. Разбираю возможности и ограничения запуска.",
  descriptionEn:
    "OpenAI has launched Business Hub in beta: business profiles in ChatGPT, mention and click insights, product feeds, and Business Agents. Here’s what the launch offers — and where it is limited.",
  metaTitleRu: "OpenAI Business Hub: профиль бизнеса, аналитика и AI-агент",
  metaTitleEn: "OpenAI Business Hub: Business Profiles, Insights, and AI Agents",
  metaDescriptionRu:
    "Что такое Business Hub от OpenAI, как компании управляют профилем в ChatGPT, смотрят аналитику, подключают товары и создают Business Agent. География и ограничения бета-версии.",
  metaDescriptionEn:
    "What OpenAI Business Hub does: manage a company profile in ChatGPT, view engagement insights, connect products, and create a Business Agent. Beta access and regional limits explained.",
  messageRu: "",
  messageEn: "",
  bodyRu: `
<p>10 ноября 2026 года OpenAI запустила в бета-версии <strong>Business Hub</strong> — новую платформу для компаний. Она позволяет управлять присутствием бизнеса внутри ChatGPT, смотреть агрегированную аналитику взаимодействия и создавать собственного AI-агента для общения с клиентами.</p>

<p><strong>Главная идея:</strong> ChatGPT — помимо привычного чата — становится прямым каналом коммуникации и продаж. Привет всем GEO-маркетологам!</p>

<h2>Что можно делать в Business Hub?</h2>
<ul>
  <li><strong>Управлять профилем компании.</strong> Заявить права на карточку бизнеса, подтвердить его и поддерживать актуальность контактов, сайта и информации об услугах.</li>
  <li><strong>Смотреть аналитику.</strong> OpenAI сообщает, что компании смогут видеть агрегированные данные: упоминания бизнеса в ChatGPT, переходы на сайт и популярные темы запросов, в которых компанию цитируют. Пользователям не показывают чужие переписки.</li>
  <li><strong>Создать Business Agent.</strong> Подготовить агента на основе инструкций и данных компании. Он сможет отвечать на вопросы, рассказывать о предложениях и помогать клиентам понять следующий шаг.</li>
  <li><strong>Подключить каталог товаров.</strong> Для подходящих компаний доступны товарные фиды с ценами и наличием, в том числе интеграция с Shopify.</li>
</ul>

<p>Подробности возможностей — в <a href="${businessHubAnnouncement}">анонсе OpenAI о запуске Business Hub в бета-версии</a>.</p>

<h2>Где это работает и какие есть ограничения?</h2>
<p>По описанию OpenAI, компании в регионах, где доступен ChatGPT, могут попробовать заявить права на свой бизнес-профиль. Доступ открывается постепенно и зависит от соответствия требованиям и прохождения верификации. На старте Business Agent доступен только подходящим компаниям электронной коммерции и онлайн-сервисам в США.</p>

<p>В процессе подтверждения могут использоваться данные сайта или домена, корпоративная почта, телефон или интеграция с Shopify; для некоторых проверок личности задействуется Persona. Конкретный набор способов может меняться — проверяйте актуальные требования непосредственно в Business Hub.</p>

<h2>А что у конкурентов?</h2>
<ul>
  <li><strong>Google</strong> делает ставку на фундаментальное SEO, Google Business Profile и товарные фиды Merchant Center, чтобы контент и предложения были доступны в поиске и AI Overviews. В собственном руководстве Google говорит, что для GEO по-прежнему важно хорошее SEO: <a href="https://business.google.com/en-all/think/search-and-video/ai-search-era-brand-authority-strategy/">Good SEO is Good GEO</a>.</li>
  <li><strong>Anthropic и Claude</strong> развивают другой путь: подключение корпоративных данных и инструментов к AI-приложениям через <a href="https://modelcontextprotocol.io/introduction">Model Context Protocol (MCP)</a>. Это инфраструктура для профессиональных агентов, а не каталог публичных бизнес-профилей.</li>
</ul>

<p>Так что ChatGPT пока впереди в формате готового бизнес-профиля и агента — по крайней мере, для тех компаний и рынков, которым уже открыли доступ.</p>

<p>Подробности релиза можно изучить в <a href="${businessHubAnnouncement}">официальном анонсе OpenAI</a>. Что скажете, интересно? Делитесь мнением в комментариях 👇</p>

<p>А я пошёл разбираться в этом кабинете. Напишу, что и как!</p>
`,
  bodyEn: `
<p>On November 10, 2026, OpenAI launched <strong>Business Hub</strong> in beta — a new platform for companies. It lets businesses manage their presence in ChatGPT, view aggregated engagement insights, and create their own AI agent to interact with customers.</p>

<p><strong>The big idea:</strong> ChatGPT, beyond the familiar chat, is becoming a direct channel for customer communication and sales. A warm hello to all GEO marketers!</p>

<h2>What can you do in Business Hub?</h2>
<ul>
  <li><strong>Manage a company profile.</strong> Claim a business listing, verify the business, and keep contact details, website, and service information up to date.</li>
  <li><strong>View insights.</strong> OpenAI says businesses will be able to see aggregated information such as mentions in ChatGPT, website clicks, and common topics in conversations where the business is cited. Users’ private conversations are not shared with businesses.</li>
  <li><strong>Create a Business Agent.</strong> Set up an agent using the company’s instructions and information. It can answer questions, explain what the business offers, and help customers decide what to do next.</li>
  <li><strong>Connect a product catalog.</strong> Eligible businesses can provide product feeds with pricing and availability, including through Shopify integration.</li>
</ul>

<p>See <a href="${businessHubAnnouncement}">OpenAI’s announcement of Business Hub in beta</a> for the launch details.</p>

<h2>Where is it available — and what are the limits?</h2>
<p>According to OpenAI, businesses in regions where ChatGPT is available can try to claim their business profile. Access is rolling out gradually and depends on eligibility and verification. At launch, Business Agents are limited to eligible ecommerce and online service businesses in the United States.</p>

<p>Verification may use a business website or domain, company email, phone, or Shopify integration; some identity checks use Persona. The exact options may change, so check the current requirements in Business Hub.</p>

<h2>What are the competitors doing?</h2>
<ul>
  <li><strong>Google</strong> is building on foundational SEO, Google Business Profile, and Merchant Center product feeds to make content and offers available in Search and AI Overviews. Its own guidance says that good SEO remains important for GEO: <a href="https://business.google.com/en-all/think/search-and-video/ai-search-era-brand-authority-strategy/">Good SEO is Good GEO</a>.</li>
  <li><strong>Anthropic and Claude</strong> are taking a different route: connecting organizational data and tools to AI apps through the <a href="https://modelcontextprotocol.io/introduction">Model Context Protocol (MCP)</a>. That is infrastructure for professional agents, rather than a public directory of business profiles.</li>
</ul>

<p>So ChatGPT is ahead for now in the ready-made business-profile-and-agent format — at least for companies and markets that already have access.</p>

<p>Read the <a href="${businessHubAnnouncement}">official OpenAI announcement</a> for more details. What do you think — is this interesting? Share your thoughts in the comments 👇</p>

<p>I’m off to explore the dashboard. I’ll report back on how it works!</p>
`,
};
