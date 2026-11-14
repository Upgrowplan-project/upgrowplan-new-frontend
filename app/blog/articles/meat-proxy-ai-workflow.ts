import type { BilingualPost } from "../staticPosts";

export const meatProxyPost: BilingualPost = {
  id: 5006,
  slug: "meat-proxy-ai-workflow",
  category: "ИИ",
  author: "Denis Naletov",
  createdAt: "2026-11-12T10:00:00.000Z",
  titleRu: "Мясной прокси: как я чуть не стал посредником между нейросетями",
  titleEn: "The Meat Proxy: When You Become the Middleware Between AI Agents",
  descriptionRu:
    "Полтора года я создаю SaaS с помощью нейросетей. Рассказываю, как обмен summary между моделями сначала помогал, а потом превратил меня в «мясной прокси» и увёл работу по кругу.",
  descriptionEn:
    "I have spent a year and a half building a SaaS with AI. Here’s how passing summaries between models first seemed helpful, then turned me into a “meat proxy” and sent the work in circles.",
  metaTitleRu: "Мясной прокси: когда человек становится посредником между ИИ",
  metaTitleEn: "The Meat Proxy: When a Human Becomes the Middleware Between AIs",
  metaDescriptionRu:
    "Личный опыт разработки SaaS с нейросетями: почему обмен summary между моделями может создать иллюзию прогресса и почему человеку важно оставаться в контексте.",
  metaDescriptionEn:
    "A founder’s account of building SaaS with AI: how passing summaries between models can create the illusion of progress, and why the human must stay in context.",
  messageRu: "",
  messageEn: "",
  bodyRu: `
<p>Похоже, я придумал для себя такой способ работать над проектом. Называю его <strong>мясным прокси</strong>.</p>

<p>Я уже полтора года пишу код и создаю SaaS-сервис с помощью нейросети. И тут хочу передать горячий привет вайбкодерам, которые говорят:</p>

<blockquote><p>«Ребят, запилил продукт за выходные!»</p></blockquote>

<p>Когда кода становится много, появляются сущности, модули, тестовые среды, облачные базы данных и куча всего вокруг. В какой-то момент становится сложно понимать, что именно пишет нейросеть: коды, сокращения, англицизмы и обозначения, придуманные месяцами раньше и путешествующие в памяти модели — в её контексте.</p>

<p>А я всё это запомнить не могу. В этом, видимо, и есть наша кожаная слабость: мы держим в уме устойчивые выражения, пару паролей и общее направление.</p>

<p>Тогда я просил одну нейросеть сделать summary — конечно, в Markdown, чтобы снизить затраты на токены — и скармливал этот файл другой нейросети или модели. У каждого «собеседника» была своя роль: например, один — разработчик, второй — внешний аудитор. Оба прекрасно понимали весь этот квазиязык. Он был в основном на русском просто потому, что эту кашу заварил я.</p>

<p>Сначала паттерн мне понравился. Казалось, я стал двигаться быстрее и осознаннее. Я просил модели задавать друг другу вопросы, искать слабые места во флоу и так далее.</p>

<p>Но примерно через месяц я понял: в целом движения вперёд нет. То есть движение, конечно, было — очень осознанное, подкреплённое внушительной доказательной базой и описанное уверенным около-научным языком. Только всё шло по кругу. А поскольку обе модели платные, два-три дня в неделю работа могла просто вставать: заканчивались лимиты.</p>

<p>Моё участие постепенно снижалось. Какое-то время я уже не особо вникал в содержание диалогов и файлов.</p>

<p>Главное — я стал замечать, что цели, которые поставил перед собой, понемногу трансформируются и подстраиваются под то, что нейросети могут реализовать. А я сам превращаюсь в прокладку: просто перекидываю задачи из одного диалога в другой.</p>

<p><em>И важно: это были не ответы на однострочные вопросы в обычном чате. Каждый диалог шёл в контролируемой среде, с подробными правилами, чёткими ролями, целями и форматом общения.</em></p>

<p>Конечно, я это прекратил.</p>

<p>Теперь я понимаю: нельзя полагаться на уверенные суждения нейросетей. Нужно читать и проверять всё — до последней запятой.</p>

<p>И самому оставаться полностью в контексте, как бы трудно это ни было. Думаю, эту мысль можно выбить на камне.</p>

<p>Ну вот, примерно так.</p>

<p><em>Всем добрейшего — и да будет свет!</em></p>
`,
  bodyEn: `
<p>I think I stumbled on a way to work on a project. I call it the <strong>meat proxy</strong>.</p>

<p>I’ve been writing code and building a SaaS with the help of AI for a year and a half. And here’s a warm shout-out to the vibe coders who say:</p>

<blockquote><p>“Guys, I shipped a product in a weekend!”</p></blockquote>

<p>As the codebase grows, so do the entities, modules, test environments, cloud databases, and everything around them. At some point, it gets hard to follow what the AI is telling you: code, abbreviations, borrowed jargon, and labels coined months ago that keep traveling around in the model’s memory — its context.</p>

<p>And I can’t keep all of that in my head. That’s our soft, human weakness, I guess: we remember familiar phrases, a couple of passwords, and the general direction.</p>

<p>So I’d ask one AI to write a summary — in Markdown, of course, to save tokens — and feed that file to another AI or model. Each “conversation partner” had a role: one might be the developer, the other an outside auditor. Both understood this whole quasi-language perfectly. It was mostly Russian only because I was the one who had cooked up the whole mess.</p>

<p>At first, I liked the pattern. It seemed like I was moving faster and working more deliberately. I asked the models to exchange questions, look for weak spots in the flow, and so on.</p>

<p>But after about a month, I realized we weren’t really getting anywhere. There was movement, sure — very deliberate, backed by an impressive body of evidence, and described in confident, almost academic language. It just kept going in circles. And since both models were paid, work would grind to a halt two or three days a week when we ran out of usage.</p>

<p>My involvement kept shrinking. For a while, I stopped paying close attention to what was in the conversations and files.</p>

<p>Most importantly, I started noticing that the goals I’d set for myself were gradually changing to fit what the AIs could implement. And I was turning into a go-between — just passing tasks from one conversation to another.</p>

<p><em>And this wasn’t a matter of tossing one-line questions into an ordinary chat. Each conversation ran in a controlled environment, with detailed rules, clear roles, goals, and a defined format.</em></p>

<p>Of course, I stopped doing it.</p>

<p>I understand now that you can’t rely on AI’s confident judgments. You have to read and check everything, down to the last comma.</p>

<p>And you have to stay fully in context yourself, however difficult that may be. I think that’s worth having carved in stone.</p>

<p>That’s about it.</p>

<p><em>Wishing you all the very best — and may there be light!</em></p>
`,
};
