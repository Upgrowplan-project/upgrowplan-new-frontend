"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";
  const [demoIndex, setDemoIndex] = useState(0);

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === "en") {
      return path;
    }
    return `/${locale}${path}`;
  };

  const demoQueries = [
    {
      title: "Кофейня",
      city: "Лиссабон",
      insights: ["12 локальных конкурентов", "Средний чек €4.20", "Спрос +5.8%"],
    },
    {
      title: "Йога-студия",
      city: "Торонто",
      insights: ["18 студий рядом", "Топ-канал: Instagram", "Удержание 3.2 месяца"],
    },
    {
      title: "Груминг-салон",
      city: "Мельбурн",
      insights: ["9 прямых конкурентов", "Средний чек AU$68", "Спрос +7.1% YoY"],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % demoQueries.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-2026">
      <Header />

      <main>
        <section className="hero-2026">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Бизнес-планы, которые действительно получают финансирование.</h1>
              <p className="hero-subtitle">
                На базе AI-агентов и верификации экспертов. Финмодель и анализ рынка
                с живыми данными — за минуты. 260+ успешных проектов и 14+ лет
                практики.
              </p>
              <div className="hero-cta">
                <Link href={getLocalePath("/solutions")} className="btn btn-primary btn-lg">
                  Попробовать платформу
                </Link>
                <Link href={getLocalePath("/contacts")} className="btn btn-outline-primary btn-lg">
                  Поговорить с экспертом
                </Link>
              </div>
              <div className="hero-proof">
                <div>
                  <span className="proof-number">260+</span>
                  <span className="proof-label">запущенных проектов</span>
                </div>
                <div>
                  <span className="proof-number">14+ лет</span>
                  <span className="proof-label">экспертизы</span>
                </div>
                <div>
                  <span className="proof-number">UNIDO / EBRD</span>
                  <span className="proof-label">стандарты моделей</span>
                </div>
              </div>
            </div>
            <div className="hero-demo">
              <div className="demo-card">
                <div className="demo-header">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                  <span className="demo-title">Agent Console</span>
                </div>
                <div className="demo-body">
                  <div className="demo-line">
                    Ищем конкурентов для {demoQueries[demoIndex].title} в{" "}
                    {demoQueries[demoIndex].city}...
                  </div>
                  <div className="demo-line">
                    {demoQueries[demoIndex].insights[0]}
                  </div>
                  <div className="demo-line">
                    {demoQueries[demoIndex].insights[1]}
                  </div>
                  <div className="demo-line">
                    {demoQueries[demoIndex].insights[2]}
                  </div>
                  <div className="demo-result">Источники подтверждены</div>
                </div>
              </div>
              <div className="hero-image">
                <Image
                  src="/images/why-important.jpg"
                  alt="Дашборд основателя"
                  width={560}
                  height={380}
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container split-2026">
          <div className="split-card hover-card">
            <p className="split-kicker">AI Self-Service</p>
            <h3>Быстро и умно для ранней стадии</h3>
            <p>
              Живой бизнес-план с RAG-верификацией, автоматическими финмоделями и
              мгновенным расчетом рынка.
            </p>
            <ul>
              <li>Агентные сценарии вместо чата</li>
              <li>Данные с источниками</li>
              <li>Экспорт в формат инвесторов</li>
            </ul>
            <Link href={getLocalePath("/solutions")} className="link-arrow">
              Посмотреть AI-инструменты →
            </Link>
          </div>
          <div className="split-card highlight hover-card">
            <p className="split-kicker">Expert-Led</p>
            <h3>Премиальные планы для банков и инвесторов</h3>
            <p>
              Планы от команды экспертов по стандартам UNIDO/EBRD с глубокой
              аналитикой и финансовой моделью.
            </p>
            <ul>
              <li>Кастомные допущения и стресс-тесты</li>
              <li>Реальные кейсы и бенчмарки</li>
              <li>Прямое сопровождение команды</li>
            </ul>
            <Link href={getLocalePath("/products")} className="link-arrow">
              Экспертные решения →
            </Link>
          </div>
        </section>

        <section className="container feature-2026">
          <div className="section-title">
            <h2>Ваш виртуальный совет директоров</h2>
            <p>
              Стек 2026 года, который спорит с идеей, проверяет спрос и показывает
              рынку реальные цифры.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="feature-card hover-card">
                <h4>Агент-скептик</h4>
                <p>
                  Находит слабые места в стратегии раньше инвестора и предлагает
                  способы усиления.
                </p>
                <div className="feature-tag">Стресс-тест идеи</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card hover-card">
                <h4>Persona Focus Groups</h4>
                <p>
                  Задайте вопросы вашей персоне и получите честный ответ на
                  основе данных.
                </p>
                <div className="feature-tag">Голос клиента</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-card hover-card">
                <h4>Market Digest</h4>
                <p>
                  Еженедельный пульс рынка с движениями конкурентов и трендами
                  спроса.
                </p>
                <div className="feature-tag">Живой документ</div>
              </div>
            </div>
          </div>
        </section>

        <section className="container trust-2026">
          <div className="trust-grid">
            <div>
              <h2>Сигналы доверия, которые закрывают сделки</h2>
              <p>
                14+ лет бизнес-планирования + AI-агенты, которые проверяют
                источники. Числа защищены, логика ясна, план проходит серьезную
                проверку.
              </p>
              <div className="trust-list">
                <div>Соответствие UNIDO / EBRD / Lean Canvas</div>
                <div>260+ проектов в разных индустриях</div>
                <div>Фокус на non-excel основателей</div>
              </div>
            </div>
            <div className="trust-cases">
              <div className="case-card hover-card">
                <h5>От идеи до $2.45M</h5>
                <p>Инвестиции после проверки цены и юнит-экономики.</p>
              </div>
              <div className="case-card hover-card">
                <h5>План для банка за 12 дней</h5>
                <p>Ритейл получил одобрение после анализа спроса.</p>
              </div>
              <div className="case-card hover-card">
                <h5>Новый рынок за 3 недели</h5>
                <p>Карта конкурентов + налоги + GTM стратегия.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container compare-2026">
          <h2>Почему Upgrowplan — другой уровень</h2>
          <div className="compare-table">
            <div className="compare-head">Обычные AI-планеры</div>
            <div className="compare-head accent">Upgrowplan 2026</div>
            <div>«Галлюцинируют» цифрами</div>
            <div className="accent">RAG-верификация + источники</div>
            <div>Всегда говорят «да»</div>
            <div className="accent">Агент-скептик и стресс-тест</div>
            <div>Статичный PDF</div>
            <div className="accent">Живой дашборд + weekly digest</div>
            <div>Вы сами придумываете клиента</div>
            <div className="accent">Persona AI отвечает честно</div>
          </div>
        </section>

        <section className="container insight-2026">
          <div className="insight-card">
            <div className="insight-copy">
              <h2>Instant Market Insight</h2>
              <p>
                Введите идею и локацию. Мы покажем проверенные факты и быстрый
                конкурентный срез, чтобы доказать работу агента.
              </p>
              <div className="insight-form">
                <input
                  type="text"
                  placeholder="Кофейная подписка в Лиссабоне"
                  aria-label="Идея и локация"
                />
                <button type="button" className="btn btn-primary">
                  Получить экспресс-анализ
                </button>
              </div>
            </div>
            <div className="insight-result">
              <div className="insight-line">Размер рынка: €42M, +6.2% YoY</div>
              <div className="insight-line">Средний чек: €18.90 / месяц</div>
              <div className="insight-line">12 прямых конкурентов</div>
              <div className="insight-line">Топ-канал: Instagram + delivery apps</div>
            </div>
          </div>
        </section>

        <section className="container steps-2026">
          <div className="section-title">
            <h2>Магия в 3 клика</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card hover-card">
              <span className="step-number">01</span>
              <h5>Опишите идею</h5>
              <p>Пару строк текста или ссылка на сайт.</p>
            </div>
            <div className="step-card hover-card">
              <span className="step-number">02</span>
              <h5>Агенты уходят в работу</h5>
              <p>Сбор данных, верификация, скептик, фокус-группы.</p>
            </div>
            <div className="step-card hover-card">
              <span className="step-number">03</span>
              <h5>Получите результат</h5>
              <p>План + финмодель + исследование + weekly digest.</p>
            </div>
          </div>
        </section>

        <section className="text-center cta-2026">
          <h2 className="cta-text">Хватит гадать. Начните побеждать.</h2>
          <p className="cta-text">
            Запускайтесь уверенно: проверенные цифры, история для инвестора и
            рынок, который говорит сам за себя.
          </p>
          <div className="hero-cta">
            <Link href={getLocalePath("/solutions")} className="btn btn-primary btn-lg">
              Попробовать бесплатно
            </Link>
            <Link href={getLocalePath("/contacts")} className="btn btn-outline-primary btn-lg">
              Поговорить со стратегом
            </Link>
          </div>
        </section>
      </main>

      <style jsx>{`
        .home-2026 {
          background: #ffffff;
          color: #1e6078;
        }

        .hero-2026 {
          padding: 5rem 0 3rem;
          background: radial-gradient(1200px 600px at 10% 10%, rgba(7, 133, 246, 0.12), transparent 60%),
            linear-gradient(120deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.02));
        }

        .hero-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: start;
        }

        .hero-kicker {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #1e6078;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .hero-2026 h1 {
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 700;
          color: #1e6078;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #1e6078;
          margin-bottom: 1.75rem;
          max-width: 540px;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .hero-proof {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          font-size: 0.85rem;
          color: #1e6078;
        }

        .proof-number {
          display: block;
          font-weight: 700;
          font-size: 1.05rem;
          color: #1e6078;
        }

        .proof-label {
          display: block;
        }

        .hero-demo {
          display: grid;
          gap: 1.5rem;
        }

        .demo-card {
          background: #0f1f2a;
          color: #ecf6ff;
          border-radius: 18px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 20px 50px rgba(9, 30, 66, 0.25);
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .demo-title {
          margin-left: auto;
          color: #8bc4ff;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot-red {
          background: #ff5f57;
        }

        .dot-yellow {
          background: #febc2e;
        }

        .dot-green {
          background: #28c840;
        }

        .demo-line {
          padding: 0.45rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.95rem;
        }

        .demo-result {
          margin-top: 0.9rem;
          background: rgba(7, 133, 246, 0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .hero-image {
          background: #ffffff;
          padding: 0.5rem;
          border-radius: 18px;
          box-shadow: 0 12px 32px rgba(9, 30, 66, 0.18);
        }

        .split-2026 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 3.5rem 0;
        }

        .split-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: none;
          border: none;
        }

        .split-card.highlight {
          background: linear-gradient(140deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.08));
          border: 1px solid rgba(7, 133, 246, 0.2);
        }

        .split-kicker {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.8rem;
          color: #1e6078;
          font-weight: 600;
        }

        .split-card ul {
          padding-left: 1.1rem;
          margin: 1rem 0;
          color: #1e6078;
        }

        .link-arrow {
          color: #0785f6;
          font-weight: 600;
          text-decoration: none;
        }

        .feature-2026 {
          padding: 2.5rem 0 3.5rem;
        }

        .section-title h2 {
          color: #1e6078;
          margin-bottom: 0.75rem;
        }

        .section-title p {
          color: #1e6078;
          max-width: 680px;
        }

        .feature-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: none;
          height: 100%;
        }

        .feature-tag {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #1e6078;
          font-weight: 600;
        }

        .trust-2026 {
          padding: 3rem 0;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          align-items: center;
        }

        .trust-list div {
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #1e6078;
        }

        .trust-cases {
          display: grid;
          gap: 1rem;
        }

        .case-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.25rem;
          border: none;
        }

        .compare-2026 {
          padding: 2.5rem 0 3rem;
        }

        .compare-table {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 1fr));
          gap: 0.75rem 1rem;
          margin-top: 1.5rem;
          background: #ffffff;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 10px 24px rgba(9, 30, 66, 0.08);
        }

        .compare-head {
          font-weight: 700;
          color: #1e6078;
        }

        .compare-head.accent {
          color: #1e6078;
        }

        .compare-table .accent {
          color: #1e6078;
          font-weight: 600;
        }

        .insight-2026 {
          padding: 2.5rem 0 3.5rem;
        }

        .insight-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          background: #0f1f2a;
          color: #ecf6ff;
          border-radius: 20px;
          padding: 2rem;
        }

        .insight-form {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .insight-form input {
          flex: 1;
          min-width: 220px;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: none;
        }

        .insight-result {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.25rem;
          font-size: 0.95rem;
          display: grid;
          gap: 0.6rem;
        }

        .steps-2026 {
          padding: 3rem 0 4rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        .step-card {
          border-radius: 16px;
          padding: 1.5rem;
          background: #ffffff;
          box-shadow: none;
        }

        .step-number {
          font-weight: 700;
          color: #0785f6;
        }

        .cta-2026 {
          padding: 3rem 0 4rem;
          background: linear-gradient(120deg, rgba(7, 133, 246, 0.1), rgba(30, 96, 120, 0.05));
        }

        .cta-2026 {
          color: #1e6078;
        }

        .cta-text {
          color: #1e6078 !important;
        }

        .cta-2026 .hero-cta {
          justify-content: center;
        }

        .hover-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: none;
        }

        .hover-card:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          transform: scale(1.03);
          background-color: #d9ebf5;
        }

        .split-card.highlight {
          background: linear-gradient(140deg, rgba(30, 96, 120, 0.06), rgba(7, 133, 246, 0.08));
        }

        .split-card.highlight.hover-card:hover {
          background: linear-gradient(140deg, rgba(30, 96, 120, 0.08), rgba(7, 133, 246, 0.12));
        }

        @media (max-width: 767px) {
          .hero-2026 {
            padding: 3.5rem 0 2.5rem;
          }

          .hero-demo {
            order: -1;
          }

          .hero-cta {
            width: 100%;
          }

          .hero-cta :global(.btn) {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
