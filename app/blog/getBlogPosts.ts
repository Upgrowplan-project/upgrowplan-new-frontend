import { allStaticPosts, staticPostsRuBilingual, enPostMeta, BilingualPost } from "./staticPosts";

const BLOB_PATHNAME = "blog-posts.json";
const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

export const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "crocs-brandsories": "crocs-brand-story-idiotic-footwear",
  "netflix-brandsory": "netflix-40-dollar-late-fee-story",
  "how-upgrowplan-works-rag": "how-upgrowplan-rag-works",
  "ai-bubble-gigants-race": "ai-bubble-investment-who-pays",
  "informal-metrics-memes-kfactor": "informal-business-metrics-memes-kfactor",
  "pivot-business-strategy": "pivot-business-strategy-slack-instagram",
  "planned-obsolescence-business": "planned-obsolescence-for-against",
  "dyson-5127-prototypes": "dyson-5127-prototypes-innovation",
  "gde-tsennik-introvert": "price-tag-introverts-buying-behavior",
  "5-answers-client-says-expensive": "5-responses-client-says-too-expensive",
  "marketing-quotes-founders": "marketing-quotes-drucker-kotler-godin",
  "ecommerce-moved": "ecommerce-moved-tiktok-youtube-instagram",
  "ai-adolescence-risks": "ai-adolescence-risks-amodei",
};

const mirroredLocalePairs: Array<{ enId: number; ruId: number }> = [
  { enId: 207, ruId: 1016 },
  { enId: 208, ruId: 1015 },
  { enId: 209, ruId: 1014 },
  { enId: 210, ruId: 1013 },
  { enId: 211, ruId: 1012 },
  { enId: 212, ruId: 1008 },
  { enId: 213, ruId: 1009 },
  { enId: 214, ruId: 1010 },
  { enId: 215, ruId: 1011 },
  { enId: 216, ruId: 1001 },
  { enId: 217, ruId: 1002 },
  { enId: 218, ruId: 1003 },
  { enId: 219, ruId: 1004 },
  { enId: 220, ruId: 1005 },
];

const manualLocaleOverrides: Record<number, Partial<BilingualPost>> = {
  201: {
    titleRu: "Бизнесу больше 5 000 лет",
    descriptionRu:
      "Самая ранняя зафиксированная сделка относится к 3200 году до н.э. в Уруке: контракт на поставку ячменя на глиняной табличке. Что 5 225 лет торговли говорят о запуске бизнеса сегодня.",
    messageRu: `🏺 Бизнесу больше 5 000 лет!

Друзья, нашёл ещё одну «древнейшую профессию» 😂

Самая ранняя зафиксированная сделка относится примерно к 3200 году до н.э. в древнем городе Урук в Месопотамии (современный Ирак). Это был контракт на поставку ячменя, записанный на глиняной табличке.

И сколько это назад? Примерно 5 225 лет!

Получается, люди ведут бизнес и заключают сделки уже больше пяти тысяч лет. Если нам кажется, что предпринимательство — это что-то модное и новое, стоит вспомнить Урук: всё началось с ячменя и глины, а сегодня стартовать можно с идеи и цифр.

Всем хорошего дня!
#brandstories`,
  },
  202: {
    titleRu: "Искусственный интеллект ≠ юридический интеллект: галлюцинации ИИ в праве",
    descriptionRu:
      "Юристы в США, Великобритании, России, Австралии и Канаде теряли дела и лицензии из-за ссылок на выдуманные ИИ-судебные решения. Реальные кейсы и как не попасть в ту же ловушку.",
    messageRu: `⚖️ Искусственный интеллект ≠ юридический интеллект

ИИ-инструменты вроде ChatGPT уже активно используют в юридической работе: для подготовки документов, поиска прецедентов и написания правовых позиций. Но у технологии есть серьёзная проблема: галлюцинации — выдуманные ссылки и дела, которые выглядят правдоподобно, но не существуют.

Несколько тревожных примеров:

🇷🇺 Россия. ИИ «соврал» при подготовке документов.
Представители адвокатского сообщества предупреждали коллег:
• ИИ иногда допускает фактические ошибки и вводит в заблуждение при подготовке юридически значимых текстов.
• Публикация такого контента без проверки может привести не просто к ошибке, а к обвинениям в фальсификации доказательств.
Источник: Российская газета

🇺🇸 США: юристы лишались лицензий из-за «придуманных дел»
В 2024 году несколько адвокатов сослались в судебных документах на несуществующие прецеденты, сгенерированные ChatGPT.
• Суд признал ссылки недействительными.
• Дела были проиграны.
• Один из юристов потерял работу и лицензию.
Источник: BBC

🇬🇧 Великобритания: Высокий суд против ИИ-фантазий
Юристы подали 45 ссылок на дела — 18 оказались выдуманными. В другом случае пяти решений просто не существовало.
• Суд ввёл санкции.
• Материалы передали регуляторам.
Источник: The Guardian

🇦🇺 Австралия: ошибка в деле об убийстве
Королевский адвокат использовал ИИ для подготовки документов. Итог: ложные цитаты и решения, которых никогда не было.
• Разбирательство затянулось.
• Юристу пришлось публично извиняться в суде.
Источник: AP News

🇨🇦 Канада: компенсация издержек за «галлюцинации»
Юрист в Британской Колумбии сослался на вымышленные дела.
• Суд обязал его оплатить судебные расходы другой стороны.
• Судья прямо указал: ИИ не оправдывает халатность.
Источник: HCAMag

Что говорят эксперты:
• ИИ не заменяет работу юриста — он лишь подсказывает. Проверка обязательна.
• Даже профессиональные юридические системы вроде Lexis+ и Westlaw AI галлюцинируют в 17–33% случаев.

Вывод: используйте ИИ как помощника, а не как авторитет. Самый безопасный путь — вручную проверять каждый факт и каждую ссылку. Лучше всего работает гибридный подход: автоматизированный сервис собирает факты, ИИ синтезирует и анализирует, а человек делает выводы.

#AI #LegalTech #Hallucinations`,
  },
  203: {
    titleRu: "Венчурные фонды и бизнес-ангелы: как стартапам привлекать капитал",
    descriptionRu:
      "Для кого подходит венчурное финансирование, какие фонды инвестируют на стадиях pre-seed и seed, что ждут ангелы и как правильно приходить к ним с бизнес-планом.",
    messageRu: `💰 Есть деньги? Часть 2: венчурные фонды и бизнес-ангелы

Для кого подходит такой тип финансирования?

Венчурные фонды и бизнес-ангелы — это источники капитала для стартапов, которые хотят быстро расти и масштабироваться. Они подходят компаниям, которые:
• создают инновационные продукты или технологии;
• обладают высоким потенциалом роста и масштабирования;
• готовы делиться долей в обмен на инвестиции;
• хотят получить не только деньги, но и экспертизу, связи и менторство.

Если ваш бизнес соответствует этим критериям, венчурные инвесторы могут стать стратегическими партнёрами.

🏦 Венчурные фонды

1. ФРИИ (Фонд развития интернет-инициатив)
Поддерживает стартапы стадий pre-seed и seed в IT, AI, кибербезопасности и других технологических направлениях. Размер инвестиций: 240–800 млн рублей.

2. Сколково
Финансирует стартапы в образовании, digital, AR/VR, Big Data, AI и IoT. Инвестирует на стадиях Round A и Pre-IPO, диапазон — 50–500 млн рублей.

3. РВК
Государственный фонд фондов, созданный для развития венчурного рынка России и поддержки стартапов на разных стадиях.

4. Московский венчурный фонд
Финансовый партнёр московских технологических компаний, который помогает довести MVP до работающего бизнеса и масштабировать устойчивые проекты.

5. Softline Venture Partners
Корпоративный венчурный фонд, инвестирующий в ранние IT- и технологические стартапы.

👼 Бизнес-ангелы

1. RAE (Russian Angels) — сообщество ангелов, поддерживающих стартапы в разных сферах.
2. AngelsDeck — платформа для поиска инвесторов и стартапов с разными форматами взаимодействия.
3. Business Angels RF — площадка, которая соединяет стартапы и инвесторов, позволяет публиковать идеи и находить партнёров.

Как привлекать инвестиции:
• подготовьте качественный бизнес-план — он помогает инвестору понять цели и стратегию;
• сделайте короткую и ясную презентацию;
• будьте готовы к вопросам — заранее продумайте питч;
• ищите подходящих инвесторов — тех, кому интересна ваша отрасль и стадия развития.

Что получают фонды и ангелы:
• долю в компании: 10–50% в зависимости от стадии и объёма инвестиций;
• права и контроль: вето на ключевые решения, место в совете, доступ к отчётности;
• выход из инвестиции: обычно через 3–7 лет — IPO, продажу доли или иной механизм.

Итог: венчурные фонды и бизнес-ангелы — это реальный путь к капиталу. Главное — хорошо подготовиться и понимать условия игры.

#methodology #fundraising`,
  },
  204: {
    titleRu: "Меню без символов валюты: психология, которая увеличивает средний чек",
    descriptionRu:
      "Эксперимент ресторана Culinary Institute of America показал: если убрать символы валюты, средний чек растёт. Как подача цены меняет поведение покупателей.",
    messageRu: `🍽️ Меню без цен — точнее, без валюты. Хитрость или ошибка?

Привет! Есть здесь кто-нибудь из ресторанного бизнеса?

Ресторан St. Andrew's Café при Culinary Institute of America в Нью-Йорке провёл эксперимент: убрал из меню символы валюты — и средний чек вырос. 🙄

Почему это сработало? Психология восприятия, денежные сигналы и то, как мозг принимает решения.

Что они сделали и к чему это привело:
• убрали или скрыли символы валюты;
• сделали цены менее заметными — встроили их в описание, а не ставили отдельно;
• добавили дорогие «якоря», чтобы умеренные по цене блюда выглядели выгоднее.

Результаты:
• люди тратили меньше, когда рядом с ценой был знак "$" или слово «доллар»;
• формат меню влияет на средний чек — без явного денежного сигнала люди чаще выбирают более дорогие позиции;
• работает эффект компромисса: средний вариант побеждает, если в меню есть слишком дорогие и слишком дешёвые якоря.

Как использовать это на практике:
• протестируйте меню без символов валюты в печатной или цифровой версии;
• уберите или минимизируйте знак валюты;
• визуально выделяйте историю блюда или раздел, а не цену;
• добавьте премиальный «якорь», чтобы соседние позиции казались разумнее;
• измеряйте результат: средний чек, долю премиальных заказов, реакцию клиентов.

Вывод: меню — это не просто список блюд. Это инструмент управления восприятием. Играя с форматом, визуалом и «ценовыми сигналами», можно влиять на выбор клиента, часто даже незаметно для него самого.

Я лично ни разу не видел меню совсем без цен, а вот меню без символов валюты — часто. Если встречали такое, напишите.

#businessinsights`,
  },
  205: {
    titleRu: "GEO: как попасть бренду в ответы ИИ",
    descriptionRu:
      "65% генеративных движков отдают приоритет свежему контенту. Бренды в верхнем квартиле по упоминаниям получают в 10 раз больше ссылок в AI-ответах. Практический разбор Generative Engine Optimization.",
    messageRu: `🤖 GEO: как бренду попасть в ответы ИИ

Поиск меняется — и маркетологи по всему миру уже нервничают.
Мы всё чаще спрашиваем у ИИ-чатов, что купить и куда пойти. Значит, брендам нужно научиться попадать в эти ответы.

Классического SEO уже недостаточно. На сцену выходит GEO (Generative Engine Optimization) — оптимизация под AI-ответы.

Что такое GEO и Reference Rate?
• GEO — это создание контента так, чтобы ИИ-модели использовали его как основу для своих ответов.
• Reference Rate показывает, как часто ИИ упоминает ваш сайт или бренд в ответах. Чем выше показатель, тем выше доверие и видимость в новой выдаче.

Почему это важно:
• 65% генеративных движков предпочитают контент, опубликованный или обновлённый за последние 12 месяцев;
• бренды из верхних 25% по упоминаниям получают в 10 раз больше ссылок в AI-ответах;
• в индустриях, где компании адаптировали контент под AI-видимость, эффект доходил почти до 50%.

Как оптимизировать контент под GEO:

1. Делайте понятную структуру: заголовки H1-H3, короткие абзацы, списки.
2. Добавляйте разметку: Schema.org, JSON-LD, alt text. У картинок должны быть осмысленные названия, а не "foto2.jpg", потому что ИИ «не видит» изображения как человек.
3. Используйте проверяемые данные: статистику, исследования, экспертные цитаты.
4. Форматы вроде «Топ-10», «X против Y» и сравнительные таблицы повышают шанс попасть в AI-ответ.
5. Пишите так, как люди спрашивают чат-ботов: «как выбрать...», «какие шаги...», «что лучше...».
6. Наращивайте авторитет: кейсы, отзывы, white papers.
7. Проверьте, что AI-crawlers вроде OAI-SearchBot и DeepSeek Crawler не заблокированы в robots.txt.

Итог: куда идут пользователи, туда придёт реклама или рекомендации. Вопрос только в том, смогут ли бренды получать это место органически или потом будут платить и за AI-размещение.

#GEO #ReferenceRate #DigitalMarketing`,
  },
  206: {
    titleRu: "Раздел бизнес-плана «Инициатор проекта»: то, что чаще всего упускают",
    descriptionRu:
      "Почему банки и инвесторы особенно внимательно читают этот раздел и почему его нельзя отдавать на откуп ИИ. Чек-лист того, что нужно показать, чтобы повысить доверие.",
    messageRu: `📋 Раздел бизнес-плана: «Инициатор проекта»

Продолжаю серию о разделах бизнес-плана — сегодня о части, которую многие просто пропускают. Я видел бизнес-планы, написанные с помощью ИИ, и этот раздел там либо отсутствует, либо заполнен формально. Это ошибка.

Этот блок почти всегда читают особенно внимательно. Если вы пишете план для себя, чтобы понять затраты и сроки, его значение ниже. Но если речь идёт о привлечении финансирования, раздел обязателен.

Для банка, фонда или инвестора главный вопрос звучит так: кто стоит за проектом и можно ли этому человеку доверить деньги?

Речь не только об образовании и должностях. Инвестор хочет увидеть реального человека с опытом, компетенциями и мотивацией. Нужно показать, что инициатор способен взять ответственность, довести проект до результата и в конечном счёте вернуть инвестиции.

Для стартапа акцент смещается на команду. Масштабируемый бизнес не строится в одиночку. Инвесторы часто ставят именно на команду: на её энергию, согласованность и то, как складываются компетенции. Чем дольше наблюдаю стартапы, тем сильнее убеждаюсь: решает не сама идея, а способность команды адаптироваться, вовремя делать pivot и сохранять доверие к продукту.

И ещё одно важное замечание: этот раздел нельзя делегировать ИИ. ChatGPT или DeepSeek не знают вас, вашу историю, победы и ошибки. Они не объяснят, почему именно вы способны реализовать этот проект. Здесь нужен ваш голос.

Чек-лист: что включить в раздел «Об инициаторе проекта»
• краткая биография: образование, ключевой опыт, достижения;
• релевантный опыт и навыки для отрасли проекта;
• роль и зона ответственности инициатора в проекте;
• личная мотивация: почему именно вам важен этот проект;
• для стартапа — информация о команде: кто за что отвечает и какие компетенции уже покрыты;
• награды, публикации, профессиональное признание — если есть.

Вывод: раздел «Инициатор проекта» — не формальность. Это ваша визитная карточка. Чем честнее и содержательнее вы себя показываете, тем выше доверие и тем ближе инвестиции.

#methodology #checklist #businessplansections`,
  },
  1006: {
    titleEn: "Anthropic Unveiled Mythos: Its Most Powerful Model for Code and Cybersecurity",
    descriptionEn:
      "Claude Mythos Preview is Anthropic's gated frontier model for coding and agentic work. It reportedly found thousands of vulnerabilities in critical infrastructure and is available only as a restricted research preview.",
    messageEn: `Anthropic unveiled Mythos.
Then showed it — and hid it again.

In simple terms, Claude Mythos Preview is not just another chat model. Anthropic describes it as its strongest frontier model for coding and agentic tasks. The company also says it immediately found thousands of vulnerabilities in critical infrastructure, which is why access is limited to a gated research preview.

The interesting part is not only what it can do, but how well it can do it. Anthropic openly admits that if a model can deeply understand and modify complex code, it can also become very effective at finding ways to break that code. That is why Mythos is being deployed inside Project Glasswing with AWS, Apple, Google, Microsoft, JPMorganChase, the Linux Foundation, and others. They are using it defensively rather than in a free-for-all experiment.

What makes Mythos different from ordinary AI models? It is not simply smarter in general. It is more powerful and more dangerous in a narrow zone: code, autonomous task execution, and cybersecurity. Anthropic explicitly calls it an unreleased frontier model, and in its own risk report says the overall risk is still very low, but higher than for previous models. In other words, the model is excellent — perhaps a little too excellent — so the company is still figuring out the leash.

What is happening right now?
There does not seem to be a public release yet. On the official page, Mythos is labeled a gated research preview rather than a normal product. For Project Glasswing participants it is available via Claude API, Bedrock, Vertex AI, and Microsoft Foundry, but that is controlled access, not broad availability.

Bottom line:
AI is getting better at writing code, finding bugs, and running processes without a human in the loop. At the same time, the idea of "let the model handle it on its own" looks less and less safe. With Mythos, Anthropic seems to be saying very loudly: not yet, not now. But they have certainly created a lot of anticipation for a later release.`,
  },
  1007: {
    titleEn: "Elevator Pitch: How to Explain a Startup in 60 Seconds",
    descriptionEn:
      "Sometimes you find yourself in an elevator with an investor and only have one minute. A simple formula helps: who it is for, what problem it solves, what you do, and how you are different.",
    messageEn: `Elevator pitch.
Gone in 60 seconds.

Sometimes, by chance or not, you end up in the same elevator as an investor.
That means you have a chance to present your project to someone who might invest money or at least give truly useful feedback.

There is a myth that if your product is great, it will "sell itself."
In reality, if you cannot explain what you do in 60 seconds, that is bad news: either the product is still vague, or you do not yet understand how to present it. And that is normal. Someone virtually tailoring custom shoes does not also have to be a born public speaker.

But how do you do it in one minute? For a founder who lives with the project day and night, it is hard to compress everything into a single minute without producing a mess.

A good elevator pitch is never just a description. It is the core meaning.

A simple formula:

1. Who it is for
2. What problem it solves
3. What exactly you do
4. How you are different (optional, because you may not fit it into a minute)

Sometimes this exercise makes it obvious that there are no clear answers to those simple questions. Or the explanation drags on forever. If you have to spend half the minute explaining the problem itself, that is already a warning sign.
That is where the rules of a strong value proposition come back into play.

In short, this is a good way to understand whether what you are building is truly needed at all. At that point, the investor is almost secondary.

I recommend everyone try it. Create a 60-second elevator pitch just for yourself. Sometimes it is surprisingly hard to summarize in one minute the thing you have been obsessed with for years.

Take care!`,
  },
};

async function getBlobUrl(): Promise<string | null> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "blog-posts" });
    const found = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    return found?.url ?? null;
  } catch {
    return null;
  }
}

function enrichPosts(basePosts: BilingualPost[]): BilingualPost[] {
  // Build slug → ruPost map for Russian content merging
  const ruBySlug = new Map<string, BilingualPost>(
    staticPostsRuBilingual
      .filter((p) => p.slug)
      .map((p) => [p.slug!, p])
  );

  const enriched = basePosts.map((p) => {
    // Apply EN metadata (slug, title, description) from enPostMeta if missing
    const enMeta = enPostMeta[p.id];
    const withEnMeta: BilingualPost = enMeta ? {
      ...p,
      slug: p.slug || enMeta.slug,
      titleEn: p.titleEn || enMeta.titleEn,
      descriptionEn: p.descriptionEn || enMeta.descriptionEn,
    } : p;

    // Merge Russian content by slug
    const slug = withEnMeta.slug;
    if (slug && ruBySlug.has(slug)) {
      const ru = ruBySlug.get(slug)!;
      ruBySlug.delete(slug);
      return {
        ...withEnMeta,
        messageRu: withEnMeta.messageRu || ru.messageRu,
        titleRu: withEnMeta.titleRu || ru.titleRu,
        descriptionRu: withEnMeta.descriptionRu || ru.descriptionRu,
        category: withEnMeta.category || ru.category,
        author: withEnMeta.author || ru.author,
      };
    }
    return withEnMeta;
  });

  const byId = new Map<number, BilingualPost>(enriched.map((post) => [post.id, post]));

  for (const { enId, ruId } of mirroredLocalePairs) {
    const enPost = byId.get(enId);
    const ruPost = byId.get(ruId);
    if (!enPost || !ruPost) continue;

    enPost.titleRu ||= ruPost.titleRu;
    enPost.descriptionRu ||= ruPost.descriptionRu;
    enPost.messageRu ||= ruPost.messageRu;
    enPost.category ||= ruPost.category;
    enPost.author ||= ruPost.author;

    ruPost.titleEn ||= enPost.titleEn;
    ruPost.descriptionEn ||= enPost.descriptionEn;
    ruPost.messageEn ||= enPost.messageEn;
  }

  for (const post of enriched) {
    const override = manualLocaleOverrides[post.id];
    if (!override) continue;
    Object.assign(post, {
      ...override,
      titleEn: post.titleEn || override.titleEn,
      titleRu: post.titleRu || override.titleRu,
      descriptionEn: post.descriptionEn || override.descriptionEn,
      descriptionRu: post.descriptionRu || override.descriptionRu,
      messageEn: post.messageEn || override.messageEn || "",
      messageRu: post.messageRu || override.messageRu || "",
    });
  }

  // Add Russian-only posts not matched to any EN post
  const ruOnlyPosts = [...ruBySlug.values()];

  return [...enriched, ...ruOnlyPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBlogPosts(): Promise<BilingualPost[]> {
  if (!HAS_BLOB) return enrichPosts(allStaticPosts);

  try {
    const url = await getBlobUrl();
    if (url) {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const blobPosts: BilingualPost[] = await res.json();
        return enrichPosts(blobPosts);
      }
    }
  } catch {}

  return enrichPosts(allStaticPosts);
}

export async function getCanonicalBlogPosts(): Promise<BilingualPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.slug && !BLOG_SLUG_REDIRECTS[post.slug]);
}

export async function getBlogPostBySlug(slug: string): Promise<BilingualPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
