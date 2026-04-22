"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";
export default function AboutPage() {
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="col-md-6 mb-4 d-flex justify-content-center">
      <div
        className="card p-4 h-100 w-100 text-dark border-0"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.backgroundColor = "#d9ebf5";
          el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
          el.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.backgroundColor = "#fff";
          el.style.boxShadow = "none";
          el.style.transform = "scale(1)";
        }}
      >
        {children}
      </div>
    </div>
  );

  // Компонент для блоков на полную ширину (без hover-эффекта)
  const FullWidthCard = ({ children }: { children: React.ReactNode }) => (
    <div className="col-12 mb-4">
      <div
        className="card p-4 text-dark border-0 full-width-block"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
        }}
      >
        {children}
      </div>
    </div>
  );

  // Компонент для карточки члена команды
  const TeamMemberCard = ({
    name,
    role,
    description,
    photoSrc,
  }: {
    name: string;
    role: string;
    description: string;
    photoSrc: string;
  }) => (
    <div className="col-md-4 mb-4">
      <div
        className="text-center p-3"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          height: "100%",
        }}
      >
        <div className="mx-auto mb-3" style={{ width: "80px", height: "80px" }}>
          <Image
            src={photoSrc}
            alt={`${name} фото`}
            width={80}
            height={80}
            className="rounded-circle"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
        <h5 className="mb-2" style={{ color: "#1e6078" }}>
          {name}
        </h5>
        <p className="text-muted small mb-3">{role}</p>
        <p className="mb-0 small">{description}</p>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* КОНТЕНТ СТРАНИЦЫ */}
      <main className="container py-3">

        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center mb-4" style={{ color: "#1e6078" }}>
              Наша команда
            </h2>
            <p className="mb-4 text-center">
              Upgrowplan — это небольшая независимая команда экспертов, которая
              сочетает глубокие знания в области экономики с современными
              технологиями для создания инструментов планирования и развития
              бизнеса.
            </p>

            <div className="row">
              <TeamMemberCard
                name="Денис Налетов"
                role="Основатель, экономист, full-stack разработчик"
                description="Более 15 лет опыта в бизнес-планировании и консалтинге. Специализируется на финансовом моделировании, интеграции ИИ в бизнес-процессы и разработке цифровых решений для малого и среднего бизнеса."
                photoSrc="/images/denis.jpg"
                /* Добавить пропс для отключения инициалов, если есть */
              />
              <TeamMemberCard
                name="Наталья Ковалева"
                role="Экономист, бизнес-аналитик"
                description="Финансовый аналитик, опыт в предоставлении экономических услуг: маркетинговые исследования, планы, ТЭО, получение инвестиций, управленческий и бухгалтерский учет, получение субсидий и грантов, обслуживание кредитных портфелей"
                photoSrc="/images/kovaleva.jpg"
              />
              <TeamMemberCard
                name="Дмитрий Волков"
                role="Веб-разработчик, технический специалист"
                description="опытный разработчик, специализирующийся на серверной части приложения и обработки данных. Занимается интеграцией API, оптимизацией систем, а также управлением базами данных и взаимодействием с внешними сервисами"
                photoSrc="/images/dima.jpg"
              />
            </div>
          </FullWidthCard>
        </div>

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Что мы делаем:
            </h2>
            <p>
              Мы создаём инструменты, которые помогают запускать и развивать
              бизнес. <br />
              Upgrowplan — это индивидуальные персонализированные решения и
              цифровые сервисы, которые объединяют бизнес-экспертизу и
              современные технологии. Мы автоматизируем расчёты, визуализируем
              данные, подсказываем, как двигаться, и помогаем принимать
              обоснованные решения.
            </p>
            <p>
              <em>Основано на нашем опыте. Улучшается вместе с вами.</em>
            </p>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Наш подход
            </h2>
            <ul>
              <li>
                Практика, а не теория. Всё основано на реальных задачах
                клиентов.
              </li>
              <li>
                Экономика + технологии. Мы объединяем классическую экспертизу с
                возможностями автоматизации, визуализации и аналитики.
              </li>
              <li>
                Мы не используем модели нейросетей на этапе сбора данных, а
                наоборот изолируем ИИ от формирования ядра контекста.
              </li>
              <li>
                В процессе генерации документов используется технология RAG -
                Retriveal-Augmented Generation. Это значит что контекст для
                конткретной задачи формируется независимо от ИИ, а на основе
                живого поиска по актуальным данным
              </li>
            </ul>
          </Card>
        </div>

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Отрасли
            </h2>
            <ul>
              <li>Фермерские хозяйства и агротуризм — 119 проектов</li>
              <li>Строительство (дома, отели) — 6 проектов</li>
              <li>Кафе и рестораны — 7 проектов</li>
              <li>Логистика и дистрибуция — 12 проектов</li>
              <li>Производственные компании - 5 проектов</li>
              <li>Технологические и сервисные стартапы - 6 проектов</li>
              <li>
                Прочие направления — от агротуризма до международной логистики
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Компетенции
            </h2>
            <ul>
              <li>экономический и финансовый анализ</li>
              <li>математический анализ и экономические модели</li>
              <li>классическая и цифровая маркетинговая экспертиза</li>
              <li>налоговое и финансовое право</li>
              <li>управление ресурсами, проектами, кадрами</li>
              <li>системы учета данных 1С, SAP, Power BI</li>
              <li>обработка данных Excel, SQL, Mongo DB</li>
            </ul>
          </Card>
        </div>

        {/* Блок "Новый блок" - на полную ширину */}

        <div className="row">
          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Куда мы движемся:
            </h2>
            <ul>
              <li>
                Конструктор бизнес-планов — с гибкой структурой и актуальными
                данными
              </li>
              <li>
                Финансовая модель нового поколения — с визуализацией, ИИ и
                API-интеграцией
              </li>
              <li>
                Интеллектуальная поддержка — LLM с динамическими параметрами,
                дополнением контекста через живой поиск
              </li>
              <li>Централизованный доступ к дашбордам и инструментам</li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Стэк технологий
            </h2>
            <ul>
              <li>интеграции LLM API</li>
              <li>Генерация документов с дополненным поиском (RAG)</li>
              <li>тонкую настройку промптов и параметров</li>
              <li>обогащение моделей собственными датасетами</li>
              <li>CI/CD пайплайны</li>
              <li>
                Стек: Java, Spring Boot, Node.js, SQL, MongoDB, RabbitMQ, Power
                BI, LLM tools (OpenAI, LangChain и др.)
              </li>
            </ul>
          </Card>
        </div>

        {/* Блок "Мы открыты" - на полную ширину */}
        <div className="row justify-content-center">
          <FullWidthCard>
            <h2 className="text-center" style={{ color: "#1e6078" }}>
              Мы открыты
            </h2>
            <p className="text-center">
              Upgrowplan развивается вместе с сообществом. Мы ценим обратную
              связь, любим эксперименты и открыты к партнёрствам.
              <br />
              Если вы хотите предложить идею, протестировать бета-функции или
              просто поговорить — <Link href="/contacts">
                оставьте заявку
              </Link>{" "}
              или напишите нам напрямую.
            </p>
          </FullWidthCard>
        </div>
      </main>
    </div>
  );
}
