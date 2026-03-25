"use client";

import Header from "../../../../components/Header";

const INFO_SECTIONS = [
  {
    id: 1,
    title: "Как это работает",
    content: (
      <>
        <p style={{ marginBottom: "0.5rem" }}>
          Вместо долгих и дорогих поисков реальных респондентов мы создаем
          цифровых двойников вашей аудитории, используя технологию
          многоуровневой симуляции:
        </p>
        <ul
          style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Генерация Персон:</strong> На основе вашего продукта и
            локации ИИ моделирует 5–10 детализированных Buyer Personas. Это не
            просто «портреты», а архетипы с уникальным поведением: от
            консервативных прагматиков до цифровых новаторов.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Живой поиск и контекст (New!):</strong> Система не гадает —
            она проверяет факты. Наш Search Agent сканирует реальный рынок в
            указанной локации: находит цены конкурентов, читает живые отзывы на
            картах и изучает актуальные новости региона.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Учет менталитета и культурного кода (New!):</strong> Мы
            добавили «слой человечности». Сервис анализирует
            социально-демографический и религиозный ландшафт локации. Респондент
            в Тель-Авиве будет отвечать с учетом местных бизнес-традиций, а в
            мусульманской стране система автоматически учтет культурные табу и
            специфические ценности.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Виртуальный опрос:</strong> На базе персон система создает
            25+ уникальных виртуальных респондентов. Каждый наделен своим
            характером, уровнем дохода и личными привычками.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>400+ интервью за один цикл:</strong> Мы «задаем» им десятки
            глубоких вопросов. Нейросеть моделирует их ответы так, как если бы
            это были реальные люди в Калининграде, Хайфе или Нью-Йорке.
            Когерентность (логика) ответов достигает 80% и выше.
          </li>
        </ul>
        <p
          style={{
            marginTop: "1rem",
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          <strong>Важно:</strong> Поскольку система проводит реальный поиск
          данных и глубокую проверку культурного контекста, процесс занимает от
          15 до 30 минут. Это необходимо для обеспечения валидности данных,
          которые не стыдно показать инвестору или использовать в реальной
          стратегии.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Что нужно от вас",
    content: (
      <>
        <p style={{ marginBottom: "0.5rem" }}>
          Для старта нужны данные о продукте и аудитории. Чем детальнее
          заполните поля — тем точнее будут сценарии и ответы.
        </p>
        <ul
          style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            Описание продукта, его ключевой ценности и гипотез.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Категория и тип целевой аудитории (B2B/B2C/B2B2C).
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            География (страна/город) и параметры выборки.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Цели исследования, чтобы мы правильно сформировали вопросы.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    title: "Что получите",
    content: (
      <>
        <p style={{ marginBottom: "0.5rem" }}>
          Вы получаете готовый отчет с инсайтами, сегментами и практическими
          выводами для продукта.
        </p>
        <ul
          style={{ paddingLeft: "1.5rem", listStyle: "disc", color: "#334155" }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            Портреты персон и их мотивации.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Результаты опросов и анализ ответов.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Рекомендации по позиционированию и сообщениям.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Итоговый отчет, готовый для презентации.
          </li>
        </ul>
      </>
    ),
  },
];

export default function SynthFocusLabDescriptionPageRu() {
  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Synth Focus Lab
        </h1>
        <div className="row g-4">
          {INFO_SECTIONS.map((section) => (
            <div className="col-12" key={section.id}>
              <div className="card p-4 border-0 shadow-sm">
                <h2 className="h5 mb-3" style={{ color: "#1e6078" }}>
                  {section.title}
                </h2>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
