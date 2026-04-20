"use client";

import Header from "@/components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type CaseItem = {
  id: string;
  title: string;
  subtitle: string;
  logs: string[];
  chatTitle: string;
  participants: string[];
  messages: Array<{ author: string; side: "left" | "right"; text: string }>;
};

const CASES: CaseItem[] = [
  {
    id: "food-subscription",
    title: "Доставка еды по подписке",
    subtitle: "Тест спроса в Тель-Авиве для busy professionals",
    logs: [
      "> Анализ культурного кода региона: Тель-Авив... Done",
      "> Генерация 10 Buyer Personas... OK",
      "> Search Agent: сканирование отзывов конкурентов...",
      "> Validator: сверка ценового диапазона и ожиданий...",
    ],
    chatTitle: "Кейс: подписка на готовое питание",
    participants: [
      "Скептик",
      "Новатор",
      "Консерватор",
      "Рационалист",
      "Импульсивный покупатель",
      "Родитель",
    ],
    messages: [
      {
        author: "Скептик",
        side: "left",
        text: "Я не вижу причины платить ежемесячно, если качество блюд не стабильно.",
      },
      {
        author: "Новатор",
        side: "right",
        text: "Подписка с гибким меню интересна, если можно менять рацион без штрафа.",
      },
      {
        author: "Рационалист",
        side: "left",
        text: "Критично показать экономию времени и прозрачный состав каждого блюда.",
      },
      {
        author: "Родитель",
        side: "right",
        text: "Куплю только при наличии детской линейки и понятных аллергенов.",
      },
      {
        author: "Консерватор",
        side: "left",
        text: "Если доставка опаздывает более двух раз в месяц, я отменяю подписку.",
      },
    ],
  },
  {
    id: "ai-yoga",
    title: "ИИ-тренер по йоге",
    subtitle: "Проверка гипотезы монетизации в Хайфе",
    logs: [
      "> Анализ культурного кода региона: Хайфа... Done",
      "> Генерация 8 Buyer Personas... OK",
      "> Search Agent: сканирование фитнес-приложений...",
      "> Validator: проверка чувствительности к цене...",
    ],
    chatTitle: "Кейс: персональный digital-тренер",
    participants: [
      "Скептик",
      "Профессионал",
      "Новатор",
      "Экономный пользователь",
      "Wellness-аудитория",
      "Техно-энтузиаст",
    ],
    messages: [
      {
        author: "Профессионал",
        side: "left",
        text: "Платить готов, если ИИ корректирует технику по видео в реальном времени.",
      },
      {
        author: "Экономный пользователь",
        side: "right",
        text: "Подписка выше 15 долларов в месяц выглядит завышенной для старта.",
      },
      {
        author: "Скептик",
        side: "left",
        text: "Без верификации методологии это воспринимается как развлекательный продукт.",
      },
      {
        author: "Техно-энтузиаст",
        side: "right",
        text: "Нужна интеграция со smart-watch, иначе ценность ниже конкурентов.",
      },
      {
        author: "Wellness-аудитория",
        side: "left",
        text: "Мне важнее персональные сценарии восстановления, а не общий план тренировок.",
      },
    ],
  },
  {
    id: "eco-hotel",
    title: "Эко-отель",
    subtitle: "Сценарная проверка для туристического рынка",
    logs: [
      "> Анализ культурного кода региона: Север Израиля... Done",
      "> Генерация 12 Buyer Personas... OK",
      "> Search Agent: анализ отзывов эко-локаций...",
      "> Validator: стресс-проверка сезонности спроса...",
    ],
    chatTitle: "Кейс: эко-отель с премиальным сервисом",
    participants: [
      "Скептик",
      "Семейный турист",
      "Digital-nomad",
      "Эко-активист",
      "Премиальный сегмент",
      "Бюджетный путешественник",
    ],
    messages: [
      {
        author: "Эко-активист",
        side: "left",
        text: "Поддержу проект, если будут реальные метрики экологичности, а не маркетинговые лозунги.",
      },
      {
        author: "Премиальный сегмент",
        side: "right",
        text: "Важно сочетание устойчивости и приватности, иначе это не premium.",
      },
      {
        author: "Семейный турист",
        side: "left",
        text: "Нужна инфраструктура для детей, иначе я выбираю классический отель.",
      },
      {
        author: "Digital-nomad",
        side: "right",
        text: "Стабильный интернет и рабочие зоны обязательны для длительного проживания.",
      },
      {
        author: "Скептик",
        side: "left",
        text: "Проект жизнеспособен только при четкой сезонной модели загрузки и управлении тарифами.",
      },
    ],
  },
  {
    id: "b2b-analytics",
    title: "B2B аналитика для ритейла",
    subtitle: "Глубинная оценка барьеров покупки",
    logs: [
      "> Анализ культурного кода региона: Центральная Европа... Done",
      "> Генерация 7 Buyer Personas... OK",
      "> Search Agent: сбор сигналов по конкурентам...",
      "> Validator: проверка ROI-гипотез и ценовой модели...",
    ],
    chatTitle: "Кейс: SaaS-аналитика для торговых сетей",
    participants: [
      "Скептик",
      "CFO",
      "Категорийный менеджер",
      "IT-директор",
      "Операционный директор",
      "Новатор",
    ],
    messages: [
      {
        author: "CFO",
        side: "left",
        text: "Без доказуемого сокращения потерь минимум на 5% покупка не пройдет комитет.",
      },
      {
        author: "IT-директор",
        side: "right",
        text: "Нужна интеграция с текущим стеком за 2 недели, иначе внедрение тормозит.",
      },
      {
        author: "Категорийный менеджер",
        side: "left",
        text: "Ценность появится, если рекомендации будут по SKU, а не общими по категории.",
      },
      {
        author: "Операционный директор",
        side: "right",
        text: "Требуется прозрачная логика выводов, чтобы команда доверяла решениям ИИ.",
      },
      {
        author: "Скептик",
        side: "left",
        text: "Слишком агрессивная цена входа снижает конверсию даже при сильном продукте.",
      },
    ],
  },
];

const ENGINEERING_TABS = [
  {
    id: "how",
    label: "Как это работает",
    intro:
      "Вместо долгих и дорогих поисков реальных респондентов мы создаем цифровых двойников вашей аудитории, используя технологию многоуровневой симуляции:",
    content: [
      "Генерация Персон: На основе вашего продукта и локации ИИ моделирует 5-10 детализированных Buyer Personas. Это не просто «портреты», а архетипы с уникальным поведением: от консервативных прагматиков до цифровых новаторов.",
      "Живой поиск и контекст (New!): Система не гадает - она проверяет факты. Наш Search Agent сканирует реальный рынок в указанной локации: находит цены конкурентов, читает живые отзывы на картах и изучает актуальные новости региона.",
      "Учет менталитета и культурного кода (New!): Мы добавили «слой человечности». Сервис анализирует социально-демографический и религиозный ландшафт локации. Респондент в Тель-Авиве будет отвечать с учетом местных бизнес-традиций, а в мусульманской стране система автоматически учтет культурные табу и специфические ценности.",
      "Виртуальный опрос: На базе персон система создает 25+ уникальных виртуальных респондентов. Каждый наделен своим характером, уровнем дохода и личными привычками.",
      "400+ интервью за один цикл: Мы «задаем» им десятки глубоких вопросов. Нейросеть моделирует их ответы так, как если бы это были реальные люди в Калининграде, Хайфе или Нью-Йорке. Когерентность (логика) ответов достигает 80% и выше.",
    ],
    note:
      "Важно: Поскольку система проводит реальный поиск данных и глубокую проверку культурного контекста, процесс занимает от 15 до 30 минут. Это необходимо для обеспечения валидности данных, которые не стыдно показать инвестору или использовать в реальной стратегии.",
  },
  {
    id: "input",
    label: "Что нужно от вас",
    intro:
      "Для старта нужны данные о продукте и аудитории. Чем детальнее заполните поля - тем точнее будут сценарии и ответы.",
    content: [
      "Описание продукта, его ключевой ценности и гипотез.",
      "Категория и тип целевой аудитории (B2B/B2C/B2B2C).",
      "География (страна/город) и параметры выборки.",
      "Цели исследования, чтобы мы правильно сформировали вопросы.",
    ],
  },
  {
    id: "output",
    label: "Что вы получите",
    intro:
      "Вы получаете готовый отчет с инсайтами, сегментами и практическими выводами для продукта.",
    content: [
      "Портреты персон и их мотивации.",
      "Результаты опросов и анализ ответов.",
      "Рекомендации по позиционированию и сообщениям.",
      "Итоговый отчет, готовый для презентации.",
    ],
  },
];

const DEPTH_OPTIONS = [
  { id: "brief", label: "Брифинг", factor: 0.82 },
  { id: "deep", label: "Глубинное интервью", factor: 0.93 },
  { id: "stress", label: "Стресс-тест", factor: 1.0 },
];

export default function SynthFocusLabDescriptionRu() {
  const [activeCaseId, setActiveCaseId] = useState(CASES[0].id);
  const [activeTab, setActiveTab] = useState(ENGINEERING_TABS[0].id);
  const [respondents, setRespondents] = useState(120);
  const [depth, setDepth] = useState(DEPTH_OPTIONS[1].id);
  const [betaCode, setBetaCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [logLineIndex, setLogLineIndex] = useState(0);
  const [logCharIndex, setLogCharIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);

  const activeCase = useMemo(
    () => CASES.find((c) => c.id === activeCaseId) ?? CASES[0],
    [activeCaseId],
  );

  const activeTabContent = useMemo(
    () => ENGINEERING_TABS.find((t) => t.id === activeTab) ?? ENGINEERING_TABS[0],
    [activeTab],
  );

  const selectedDepth = useMemo(
    () => DEPTH_OPTIONS.find((d) => d.id === depth) ?? DEPTH_OPTIONS[1],
    [depth],
  );

  const validity = useMemo(() => {
    const base = 62 + (respondents / 500) * 28;
    const result = Math.min(99, Math.round(base * selectedDepth.factor));
    return result;
  }, [respondents, selectedDepth.factor]);

  useEffect(() => {
    setTypedLogs([]);
    setLogLineIndex(0);
    setLogCharIndex(0);
    setVisibleMessages(0);
  }, [activeCaseId]);

  useEffect(() => {
    if (logLineIndex >= activeCase.logs.length) return;
    const currentLine = activeCase.logs[logLineIndex];
    const timer = setTimeout(
      () => {
        if (logCharIndex < currentLine.length) {
          setTypedLogs((prev) => {
            const next = [...prev];
            next[logLineIndex] = currentLine.slice(0, logCharIndex + 1);
            return next;
          });
          setLogCharIndex((prev) => prev + 1);
        } else {
          setLogLineIndex((prev) => prev + 1);
          setLogCharIndex(0);
        }
      },
      logCharIndex === 0 ? 300 : 14,
    );
    return () => clearTimeout(timer);
  }, [activeCase.logs, logCharIndex, logLineIndex]);

  useEffect(() => {
    if (visibleMessages >= activeCase.messages.length) return;
    const timer = setTimeout(() => {
      setVisibleMessages((prev) => prev + 1);
    }, 520);
    return () => clearTimeout(timer);
  }, [activeCase.messages.length, visibleMessages]);

  return (
    <div className="synth-page">
      <Header />
      <main>
        <section className="hero section-blue">
          <div className="container hero-grid">
            <div>
              <h1>
                <span className="dark">SynthFocusLab:</span>{" "}
                <span className="accent">
                  Узнайте правду до того, как предложите продукт рынку.
                </span>
              </h1>
              <p className="lead">
                Виртуальные фокус-группы на базе ИИ-респондентов. Глубинные
                интервью с цифровыми копиями вашей аудитории без затрат на
                рекрутинг.
              </p>
              <button className="cta">Начать симуляцию</button>
            </div>
            <div className="avatar-cloud" aria-label="Аватары респондентов">
              {[
                "Скептик",
                "Новатор",
                "Консерватор",
                "Рационалист",
                "Прагматик",
                "Визионер",
              ].map((label, idx) => (
                <motion.div
                  key={label}
                  className="avatar-chip"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                >
                  <span className="avatar-dot" />
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="simulation section-white">
          <div className="container">
            <h2>Live Simulation: интерактивный чат с виртуальной аудиторией</h2>
            <p className="sub">
              Выберите бизнес-идею, запустите симуляцию и наблюдайте, как
              система собирает и проверяет аргументы до формирования вывода.
            </p>

            <div className="case-grid">
              {CASES.map((item) => (
                <button
                  key={item.id}
                  className={`case-card${activeCaseId === item.id ? " active" : ""}`}
                  onClick={() => setActiveCaseId(item.id)}
                >
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </button>
              ))}
            </div>

            <div className="live-grid">
              <div className="terminal">
                <div className="terminal-title">AI Log</div>
                <div className="terminal-body">
                  {typedLogs.map((line, idx) => (
                    <div key={`${activeCaseId}-log-${idx}`} className="terminal-line">
                      {line}
                    </div>
                  ))}
                  {logLineIndex < activeCase.logs.length && (
                    <div className="terminal-line cursor">_</div>
                  )}
                </div>
              </div>

              <div className="chat">
                <div className="chat-head">
                  <div>
                    <strong>{activeCase.chatTitle}</strong>
                    <div className="participants">
                      {activeCase.participants.join(" / ")}
                    </div>
                  </div>
                </div>
                <div className="chat-body">
                  {activeCase.messages.slice(0, visibleMessages).map((m, idx) => (
                    <div
                      key={`${activeCaseId}-msg-${idx}`}
                      className={`msg ${m.side === "right" ? "right" : "left"}`}
                    >
                      <div className="author">{m.author}</div>
                      <div className="bubble">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="modules section-blue">
          <div className="container">
            <h2>Инженерные модули SynthFocusLab</h2>
            <div className="tab-row">
              {ENGINEERING_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="tab-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <h3 className="tab-heading">{activeTabContent.label}</h3>
                  {activeTabContent.intro && (
                    <p className="tab-intro">{activeTabContent.intro}</p>
                  )}
                  <ul>
                    {activeTabContent.content.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {activeTabContent.note && (
                    <p className="tab-note">{activeTabContent.note}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="constructor section-white">
          <div className="container">
            <h2>Конструктор исследования</h2>
            <div className="constructor-grid">
              <div className="card">
                <label htmlFor="respondents">
                  Количество респондентов: <strong>{respondents}</strong>
                </label>
                <input
                  id="respondents"
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={respondents}
                  onChange={(e) => setRespondents(Number(e.target.value))}
                />
                <div className="avatar-matrix" aria-hidden="true">
                  {Array.from({
                    length: Math.max(12, Math.min(60, Math.round(respondents / 8))),
                  }).map((_, idx) => (
                    <span key={`dot-${idx}`} className="matrix-dot" />
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="depth-title">Глубина опроса</div>
                <div className="depth-row">
                  {DEPTH_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      className={`depth-btn${depth === option.id ? " active" : ""}`}
                      onClick={() => setDepth(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="validity">
                  <div className="validity-head">
                    <span>Валидность данных</span>
                    <strong>{validity}%</strong>
                  </div>
                  <div className="validity-track">
                    <motion.div
                      className="validity-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${validity}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                </div>

                <button className="cta calc">Рассчитать стоимость сессии</button>
              </div>
            </div>
          </div>
        </section>

        <section className="beta-access section-blue">
          <div className="container beta-wrap">
            <h2>Beta Access</h2>
            <p>
              Введите код из приглашения для доступа к полному функционалу.
            </p>
            <div className="beta-row">
              <input
                type="text"
                value={betaCode}
                onChange={(e) => setBetaCode(e.target.value)}
                placeholder="Код бета-тестера"
              />
              <button className="cta">Войти в SynthFocusLab</button>
            </div>
          </div>
        </section>

        <section className="beta-form section-white">
          <div className="container">
            <h2>Присоединяйтесь к закрытому тестированию</h2>
            <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                placeholder="Описание вашего проекта"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                rows={5}
              />
              <button className="cta submit" type="submit">
                Отправить заявку
              </button>
            </form>
          </div>
        </section>

      </main>

      <style jsx>{`
        .synth-page {
          background: #ffffff;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          color: #1e6078;
        }

        .section-white {
          background: #ffffff;
          padding: 5rem 0;
        }

        .section-blue {
          background: #f0f7ff;
          padding: 5rem 0;
        }

        h1,
        h2 {
          letter-spacing: -0.02em;
          margin: 0;
        }

        h2 {
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          text-align: center;
          margin-bottom: 0.75rem;
          color: #01346e;
          font-weight: 700;
        }

        .hero h1 {
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 700;
          color: #1e6078;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .dark {
          color: #1e6078;
          font-weight: 700;
        }

        .accent {
          color: #0683f5;
          font-weight: 600;
        }

        .lead,
        .sub {
          margin-top: 1rem;
          color: #1e6078;
          line-height: 1.6;
          font-size: 1.06rem;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 2rem;
          align-items: center;
        }

        .cta {
          margin-top: 1.25rem;
          border: none;
          border-radius: 12px;
          background: #0683f5;
          color: #ffffff;
          font-weight: 700;
          padding: 0.85rem 1.25rem;
          box-shadow: 0 14px 28px rgba(6, 131, 245, 0.26);
        }

        .avatar-cloud {
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid rgba(6, 131, 245, 0.2);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
          padding: 1.2rem;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .avatar-chip {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(6, 131, 245, 0.25);
          padding: 0.5rem 0.75rem;
          font-weight: 600;
          font-size: 0.92rem;
          background: #f7fbff;
        }

        .avatar-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0683f5, #1e6078);
          flex: 0 0 10px;
        }

        .case-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.9rem;
          margin-top: 1.5rem;
        }

        .case-card {
          text-align: left;
          border-radius: 14px;
          border: 1px solid rgba(6, 131, 245, 0.28);
          background: #f8fbff;
          padding: 0.9rem;
          display: grid;
          gap: 0.35rem;
          color: #1e6078;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .case-card strong {
          font-size: 0.98rem;
          color: #1e6078;
        }

        .case-card span {
          font-size: 0.86rem;
          opacity: 0.9;
        }

        .case-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(6, 131, 245, 0.14);
        }

        .case-card.active {
          border-color: #0683f5;
          background: rgba(6, 131, 245, 0.08);
        }

        .live-grid {
          margin-top: 1.2rem;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 1rem;
        }

        .terminal,
        .chat {
          border: 1px solid rgba(30, 96, 120, 0.2);
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        }

        .terminal-title {
          background: #e9f4ff;
          color: #1e6078;
          padding: 0.75rem 0.9rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(30, 96, 120, 0.14);
        }

        .terminal-body {
          min-height: 290px;
          max-height: 290px;
          overflow: auto;
          padding: 0.85rem;
          background: #0f2133;
          color: #bfe2ff;
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 0.85rem;
        }

        .terminal-line {
          margin-bottom: 0.45rem;
          white-space: pre-wrap;
          line-height: 1.45;
        }

        .cursor {
          color: #7dd36e;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.3;
          }
        }

        .chat-head {
          padding: 0.85rem 0.95rem;
          border-bottom: 1px solid rgba(30, 96, 120, 0.14);
          background: #f7fbff;
        }

        .participants {
          margin-top: 0.35rem;
          font-size: 0.82rem;
          color: #4c6d7c;
        }

        .chat-body {
          min-height: 290px;
          max-height: 290px;
          overflow: auto;
          padding: 0.85rem;
          background: #fbfdff;
          display: grid;
          gap: 0.65rem;
        }

        .msg {
          max-width: 85%;
          display: grid;
          gap: 0.22rem;
        }

        .msg.left {
          justify-self: start;
        }

        .msg.right {
          justify-self: end;
        }

        .author {
          font-size: 0.77rem;
          opacity: 0.8;
        }

        .bubble {
          border-radius: 12px;
          padding: 0.62rem 0.7rem;
          line-height: 1.45;
          font-size: 0.92rem;
        }

        .msg.left .bubble {
          background: #edf5ff;
          border: 1px solid rgba(6, 131, 245, 0.2);
        }

        .msg.right .bubble {
          background: #0683f5;
          color: #ffffff;
        }

        .tab-row {
          margin-top: 1.2rem;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tab-btn {
          border-radius: 999px;
          border: 2px solid #0683f5;
          color: #0683f5;
          background: transparent;
          padding: 0.58rem 1.05rem;
          font-weight: 700;
        }

        .tab-btn.active {
          background: #0683f5;
          color: #ffffff;
        }

        .tab-content {
          margin-top: 1rem;
          border-radius: 16px;
          border: 1px solid rgba(6, 131, 245, 0.2);
          background: #ffffff;
          padding: 1.1rem;
        }

        .tab-content ul {
          margin: 0;
          padding-left: 1.2rem;
          line-height: 1.6;
          color: #1e6078;
        }

        .tab-heading {
          margin: 0 0 0.5rem 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e6078;
        }

        .tab-intro {
          margin: 0 0 0.8rem 0;
          color: #1e6078;
          line-height: 1.6;
        }

        .tab-note {
          margin: 0.8rem 0 0 0;
          color: #1e6078;
          line-height: 1.6;
          font-style: italic;
        }

        .constructor-grid {
          margin-top: 1.2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .card {
          border-radius: 16px;
          border: 1px solid rgba(6, 131, 245, 0.2);
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
          padding: 1rem;
        }

        input[type="range"] {
          width: 100%;
          margin: 0.8rem 0;
        }

        .avatar-matrix {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 0.35rem;
          margin-top: 0.65rem;
        }

        .matrix-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: rgba(6, 131, 245, 0.5);
        }

        .depth-title {
          font-weight: 700;
          margin-bottom: 0.6rem;
        }

        .depth-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .depth-btn {
          border: 1px solid rgba(6, 131, 245, 0.35);
          background: #f7fbff;
          color: #1e6078;
          border-radius: 10px;
          padding: 0.5rem 0.7rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .depth-btn.active {
          background: #0683f5;
          border-color: #0683f5;
          color: #ffffff;
        }

        .validity {
          margin-top: 1rem;
        }

        .validity-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
          font-size: 0.92rem;
        }

        .validity-track {
          height: 10px;
          border-radius: 999px;
          background: #e6f1ff;
          overflow: hidden;
        }

        .validity-bar {
          height: 100%;
          background: linear-gradient(90deg, #7dd36e, #0683f5);
        }

        .calc {
          margin-top: 1rem;
        }

        .beta-wrap {
          max-width: 860px;
        }

        .beta-row {
          margin-top: 0.85rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.65rem;
        }

        input,
        textarea {
          border: 1px solid rgba(30, 96, 120, 0.25);
          border-radius: 12px;
          padding: 0.72rem 0.8rem;
          font-size: 0.95rem;
        }

        .form-grid {
          max-width: 760px;
          margin: 1rem auto 0;
          display: grid;
          gap: 0.75rem;
        }

        .submit {
          width: fit-content;
        }

        @media (max-width: 991px) {
          .hero-grid,
          .live-grid,
          .constructor-grid {
            grid-template-columns: 1fr;
          }

          .case-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 575px) {
          .section-white,
          .section-blue {
            padding: 3.4rem 0;
          }

          .case-grid {
            grid-template-columns: 1fr;
          }

          .beta-row {
            grid-template-columns: 1fr;
          }

          .cta {
            width: 100%;
          }

          .submit {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
