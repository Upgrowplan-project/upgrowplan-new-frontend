"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Modal } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";

export default function Home() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";

  const logLines = useMemo(
    () => [
      {
        text: "[Agent: Pitch Pro] Создание Pitch Deck... OK",
        speed: 26,
      },
      {
        text: "[Agent: Market Sense] Конкуренты в Лиссабоне... Найдено 12",
        speed: 20,
        source: { name: "Google Maps" },
      },
      {
        text: "[Agent: Skeptic] Маржа 30%... ВНИМАНИЕ: Слишком оптимистично",
        speed: 18,
      },
      {
        text: "[Agent: Fin Pilot] Financial Model (CapEx/OpEx)... Завершено",
        speed: 24,
      },
      {
        text: "Поиск по живым источникам (10+)... VERIFIED",
        speed: 22,
        source: { name: "Statista" },
      },
    ],
    [],
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<typeof logLines>([]);
  const [isPausing, setIsPausing] = useState(false);
  const [metricsActive, setMetricsActive] = useState(false);
  const [vatRate, setVatRate] = useState(0);
  const [marketSize, setMarketSize] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const proofRef = useRef<HTMLDivElement | null>(null);
  const skepticRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const antiSliderRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const bizMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [skepticActive, setSkepticActive] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const shuffle = <T,>(items: T[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const personas = [
    {
      name: "Peter",
      age: 68,
      role: "Resident",
      income: "30–40k руб/мес",
      preferences: ["Price/Quality", "Quiet", "Trust", "Как раньше"],
      data: "Based on 620 local reviews",
      caseTitle: "Craft Beer Bar",
      image: "/images/personas/mark.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Добрый день, Peter. Планируем открыть крафтовый пивбар в вашем доме. Цены — премиум, атмосфера — тихий лофт. Как вам идея? 🍻",
          time: "10:02",
        },
        {
          speaker: "avatar",
          text: "Лофт? Премиум? В нашем доме уже есть разливное за 80 рублей. Я туда не хожу, шумно и контингент... А крафт за 300? Это кто пить будет, молодёжь ваша? 👴🏻",
          time: "10:03",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "Мы делаем упор на тишину и культуру пития. Никакого шума после 22:00.",
          time: "10:04",
        },
        {
          speaker: "avatar",
          text: "Quiet после 22:00? До этого вы все так обещаете. А потом будут орать под окнами. И вообще, пиво за 300... я лучше дочке на подарок добавлю. Не пойду я к вам. 😕",
          time: "10:05",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis NOT validated. Низкий интерес целевой аудитории (пенсионеры) из-за цены и страха шума. Рекомендуем пересмотреть район.",
          time: "10:06",
        },
      ],
    },
    {
      name: "Oksana",
      age: 28,
      role: "Office Professional",
      income: "120–150k руб/мес",
      preferences: ["Aesthetics", "Time", "Status", "Technology"],
      data: "Based on 1.1k office surveys",
      caseTitle: "Family Bakery Near Office",
      image: "/images/personas/lina.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Oksana, привет. Открываем семейную кондитерскую рядом с вашим офисом. Детские праздники, ростовые куклы, торты под заказ. Будете заходить? 🍰",
          time: "11:10",
        },
        {
          speaker: "avatar",
          text: "Рядом с офисом — это хорошо. Но «семейная» и «ростовые куклы»? Это значит, что там постоянно будет шумно и много детей. А я после работы хочу тишины и красивый кофе... ☕️✨",
          time: "11:11",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "У нас будет отдельная зона для тихих встреч. И очень эстетичный интерьер.",
          time: "11:12",
        },
        {
          speaker: "avatar",
          text: "Отдельная зона? Если торты вкусные, я может и зайду один раз на пробу. Но куклы... У меня нет детей. Для свидания я выберу другое место, а для кофе — вашу эстетику может заглушить плач. 50/50. 😐",
          time: "11:13",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis PARTIALLY validated. Интерес есть к продукту (эстетика/кофе), но концепция «семейной» кондитерской отпугивает платежеспособную аудиторию без детей.",
          time: "11:14",
        },
      ],
    },
    {
      name: "Maria",
      age: 35,
      role: "Bakery Owner",
      income: "200–250k руб/мес",
      preferences: ["Unit Economics", "Operations", "Quality", "Competition"],
      data: "Based on 1.2k HoReCa reviews",
      caseTitle: "Tool-Sharing Service",
      image: "/images/personas/anna.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Maria, добрый день. Планируем сервис шеринга дорогих инструментов: перфораторы, тепловизоры. Как вы, как предприниматель, оцениваете идею? 🛠",
          time: "12:20",
        },
        {
          speaker: "avatar",
          text: "Хм. Идея интересная. Я сама в пекарню миксер за 150к покупала. Но как вы решите вопрос с залогом и, главное, с логистикой и ремонтом? 🤯",
          time: "12:21",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "Залог — через блокировку на карте. Ремонт — страховка. Доставка — курьеры.",
          time: "12:22",
        },
        {
          speaker: "avatar",
          text: "Курьеры? Это же дорого. А если перфоратор сломали «случайно»? Кто это будет проверять? Если цена аренды будет 1000 рублей, вы не покроете операционные расходы. Я бы не рискнула, слишком сложная логистика. 📈📉",
          time: "12:23",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis NOT validated. Высокие операционные расходы и риски (логистика/ремонт) убивают юнит-экономику для этой целевой аудитории.",
          time: "12:24",
        },
      ],
    },
    {
      name: "Nikita",
      age: 21,
      role: "Student Dreamer",
      income: "15–20k руб/мес",
      preferences: ["Trends", "Hype", "Ecology", "Community"],
      data: "Based on 900 student interviews",
      caseTitle: "Online Calligraphy School",
      image: "/images/personas/student.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Nikita, привет. Тестируем идею онлайн-школы каллиграфии. Это успокаивает, развивает мозг и сейчас в тренде на экологичность. Запишешься на курс? ✍️",
          time: "13:05",
        },
        {
          speaker: "avatar",
          text: "Вау. Онлайн-школа... но медленное письмо? Я в универе лекции не пишу, все в Notion. У меня времени нет на «медленно». Это какой-то хайп для бумеров. 😴",
          time: "13:06",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "Это позволяет разгрузить мозг от гаджетов. Community, оффлайн встречи.",
          time: "13:07",
        },
        {
          speaker: "avatar",
          text: "Оффлайн встречи — это круче. Но каллиграфия? Я лучше пойду на курсы по AI или хотя бы гончарному делу. Там продукт можно потрогать. А буквы писать... не, это не для меня, сорри. 🤷‍♂️",
          time: "13:08",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis NOT validated. Целевая аудитория (студенты) ценит скорость и практичный результат, а не «медленные» хайпы. Тренд экологичности не работает в этом контексте.",
          time: "13:09",
        },
      ],
    },
    {
      name: "Victor Borisovich",
      age: 62,
      role: "Director",
      income: "400k+ руб/мес",
      preferences: ["Risks", "Scale", "Financial Model", "Strategy"],
      data: "Based on 420 director interviews",
      caseTitle: "Franchise: Auto Washes",
      image: "/images/personas/director.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Victor Borisovich, добрый день. Рассматриваем покупку франшизы автоматических моек. Quality среднее, но скорость (3 минуты) и низкая маржа. Что скажете? 🚗💨",
          time: "14:30",
        },
        {
          speaker: "avatar",
          text: "Скорость — это отлично, москвичи это ценят. Низкая маржа? Это сколько? Если чистая прибыль 5% — это не бизнес, это благотворительность. Покажите финмодель. 📊🧐",
          time: "14:31",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "Вот скриншот нашей финансовой модели. Капекс высокий, но окупаемость — 18 месяцев за счет оборота.",
          time: "14:32",
        },
        {
          speaker: "avatar",
          text: "Окупаемость 18 месяцев при капексе 10 млн? Это при загрузке 24/7? В Москве рынок перенасыщен, конкуренты (у которых качество выше) задушат вас ценой. Я бы не стал вкладываться, риск масштабируемости слишком высок. Не верю я в 3 минуты без потери качества. 📉❌",
          time: "14:33",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis NOT validated. Опытный инвестор считает финансовую модель слишком оптимистичной, а рыночную конкуренцию в Москве — фатальной.",
          time: "14:34",
        },
      ],
    },
    {
      name: "Elena",
      age: 43,
      role: "Homemaker",
      income: "70–90k руб/мес",
      preferences: ["Convenience", "Time", "Children", "Loyalty"],
      data: "Based on 1.5k household surveys",
      caseTitle: "Cleaning Subscription",
      image: "/images/personas/homemaker.jpg",
      dialog: [
        {
          speaker: "skeptic",
          text: "Elena, здравствуйте. Открываем сервис регулярной уборки квартир по подписке. 2 раза в месяц, фиксированная цена, те же клинеры. Будете пользоваться? 🧹✨",
          time: "15:40",
        },
        {
          speaker: "avatar",
          text: "Подписка на уборку? Это было бы супер. У меня двое детей, и к выходным квартира превращается в поле битвы. Но мне важен один клинер, чтобы я не боялась оставить его дома. 🥰",
          time: "15:41",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "Да, мы гарантируем, что к вам будет ходить одна и та же клинер, обученная по нашему стандарту. И залог не нужен.",
          time: "15:42",
        },
        {
          speaker: "avatar",
          text: "Отлично. Цена 5000 рублей за две уборки в месяц — это приемлемо. Если клинер действительно хорошая, я сэкономлю себе 8 часов жизни. Я запишусь! И подругам посоветую. ❤️🗓",
          time: "15:43",
          status: "Прочитано ✓✓",
        },
        {
          speaker: "skeptic",
          text: "[RAG Validation]: Hypothesis VALIDATED. Сервис закрывает боли целевой аудитории (домохозяйки) по времени и доверию при приемлемой цене. Высокий виральный потенциал.",
          time: "15:44",
        },
      ],
    },
  ];
  const [shuffledPersonas, setShuffledPersonas] = useState(personas);
  const [visiblePersonas, setVisiblePersonas] = useState(personas.slice(0, 3));
  const [activePersona, setActivePersona] = useState(0);
  const [visibleDialog, setVisibleDialog] = useState<
    Array<{
      speaker: "skeptic" | "avatar";
      text: string;
      time?: string;
      status?: string;
    }>
  >([]);
  const [typingSpeaker, setTypingSpeaker] = useState<
    "skeptic" | "avatar" | null
  >(null);
  const [isPersonaFading, setIsPersonaFading] = useState(false);
  const [pulseTab, setPulseTab] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "ready" | "denied"
  >("idle");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [geoLabel, setGeoLabel] = useState<string>("");
  const [sliderPos, setSliderPos] = useState(75);
  const [isSliding, setIsSliding] = useState(false);
  const [deepLines, setDeepLines] = useState<
    Array<{ ts: string; tag: string; text: string; typed?: string }>
  >([]);
  const [deepLineIndex, setDeepLineIndex] = useState(0);
  const [deepCharIndex, setDeepCharIndex] = useState(0);
  const deepLogRef = useRef<HTMLDivElement | null>(null);
  const [metricMode, setMetricMode] = useState<"owner" | "cfo">("owner");
  const [realityAnswers, setRealityAnswers] = useState<Array<null | boolean>>([
    null,
    null,
    null,
  ]);
  const [showContactModal, setShowContactModal] = useState(false);

  const deepLogSource = useMemo(
    () => [
      {
        ts: "[02:14:45]",
        tag: "SEARCH_AGENT",
        text: "Сканирование цен на коммерческую недвижимость в г. Хайфа... Найдено 24 объекта.",
      },
      {
        ts: "[02:14:48]",
        tag: "TAX_ENGINE",
        text: "Сверка с налоговым кодексом 2026. Обновление ставок НДС и муниципальных сборов.",
      },
      {
        ts: "[02:14:52]",
        tag: "COMPETITOR_V2",
        text: 'Анализ отзывов Google Maps для кофейни "X" и "Y". Выявление слабых зон (Wi-Fi, сервис).',
      },
      {
        ts: "[02:14:55]",
        tag: "RAG_VALIDATE",
        text: "Подтверждение данных о пешеходном трафике (ул. Герцля). Источник: Google Traffic Data.",
      },
      {
        ts: "[02:15:01]",
        tag: "PERSONA_SIM",
        text: "Запуск 6 симуляций аватаров. Тестирование эластичности спроса при цене 22₪ за латте.",
      },
      {
        ts: "[02:15:05]",
        tag: "FIN_MODEL",
        text: "Пересчет точки безубыточности с учетом инфляционного коэффициента 3.2%.",
      },
    ],
    [],
  );
  const activePersonaData = visiblePersonas[activePersona];

  useEffect(() => {
    const current = logLines[lineIndex];
    if (!current) return;

    if (isPausing) {
      const pauseTimer = setTimeout(() => setIsPausing(false), 600);
      return () => clearTimeout(pauseTimer);
    }

    const typingTimer = setTimeout(() => {
      if (charIndex < current.text.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setDisplayedLines((prev) => {
          const next = [...prev, current];
          return next.slice(-4);
        });
        setCharIndex(0);
        setLineIndex((prev) => (prev + 1) % logLines.length);
        setIsPausing(true);
      }
    }, current.speed ?? 28);

    return () => clearTimeout(typingTimer);
  }, [charIndex, isPausing, lineIndex, logLines]);

  useEffect(() => {
    const shuffled = shuffle(personas);
    setShuffledPersonas(shuffled);
    setVisiblePersonas(shuffled.slice(0, 3));
    setActivePersona(0);
  }, []);

  useEffect(() => {
    if (!proofRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMetricsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(proofRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!metricsActive) return;
    const start = performance.now();
    const duration = 900;
    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setVatRate(Math.round(17 * progress));
      setMarketSize(parseFloat((1.2 * progress).toFixed(2)));
      setGrowthRate(parseFloat((6.4 * progress).toFixed(1)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [metricsActive]);

  useEffect(() => {
    if (!skepticRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkepticActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(skepticRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!skepticActive) return;
    const start = performance.now();
    const duration = 800;
    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setConfidence(Math.round(65 * progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [skepticActive]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPulseTab((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const seed = deepLogSource
      .slice(0, 3)
      .map((line) => ({ ...line, typed: line.text }));
    setDeepLines(seed);
    setDeepLineIndex(3);
    setDeepCharIndex(0);
  }, [deepLogSource]);

  useEffect(() => {
    if (!deepLogSource.length) return;
    const current = deepLogSource[deepLineIndex % deepLogSource.length];
    const text = current.text;
    const speed = 12;
    const timer = setTimeout(() => {
      if (deepCharIndex < text.length) {
        setDeepCharIndex((prev) => prev + 1);
        setDeepLines((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.text === current.text) {
            last.typed = text.slice(0, deepCharIndex + 1);
          } else {
            next.push({ ...current, typed: text.slice(0, deepCharIndex + 1) });
          }
          return next.slice(-6);
        });
      } else {
        setDeepCharIndex(0);
        setDeepLineIndex((prev) => prev + 1);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [deepCharIndex, deepLineIndex, deepLogSource]);

  useEffect(() => {
    if (!deepLogRef.current) return;
    deepLogRef.current.scrollTop = deepLogRef.current.scrollHeight;
  }, [deepLines]);

  useEffect(() => {
    if (!isSliding) return;
    const updatePos = (clientX: number) => {
      const wrap = antiSliderRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 40), rect.width - 40);
      setSliderPos(Math.round((x / rect.width) * 100));
    };
    const onMove = (event: MouseEvent) => updatePos(event.clientX);
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePos(touch.clientX);
    };
    const onUp = () => setIsSliding(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [isSliding]);

  const allAnswered = realityAnswers.every((value) => value !== null);
  const anyNo = realityAnswers.some((value) => value === false);

  useEffect(() => {
    if (!pulseRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPulseActive(true);
          if (geoStatus === "idle") {
            requestLocation();
          }
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(pulseRef.current);
    return () => observer.disconnect();
  }, [geoStatus]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const defaultCenter: [number, number] = [34.9896, 32.794];
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCenter,
      zoom: 12.2,
      interactive: true,
    });

    mapRef.current = map;

    const addBusinessMarkers = (center: [number, number]) => {
      bizMarkersRef.current.forEach((marker) => marker.remove());
      bizMarkersRef.current = [];
      const offsets = [
        [0.008, 0.004],
        [-0.006, 0.003],
        [0.004, -0.006],
        [-0.004, -0.005],
        [0.002, 0.008],
      ];
      offsets.forEach(([dx, dy], idx) => {
        const el = document.createElement("div");
        el.className = `biz-marker ${idx % 2 === 0 ? "biz-red" : "biz-yellow"}`;
        el.innerHTML = `<span>${idx + 1}</span>`;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([center[0] + dx, center[1] + dy])
          .addTo(map);
        bizMarkersRef.current.push(marker);
      });
    };

    map.on("load", () => {
      addBusinessMarkers(defaultCenter);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    const center: [number, number] = [userLocation.lon, userLocation.lat];
    mapRef.current.flyTo({ center, zoom: 13 });
    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "user-marker";
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(center)
        .addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLngLat(center);
    }
    const offsets = [
      [0.004, 0.003],
      [-0.004, 0.002],
      [0.003, -0.004],
      [-0.003, -0.003],
      [0.002, 0.005],
    ];
    bizMarkersRef.current.forEach((marker) => marker.remove());
    bizMarkersRef.current = [];
    offsets.forEach(([dx, dy], idx) => {
      const el = document.createElement("div");
      el.className = `biz-marker ${idx % 2 === 0 ? "biz-red" : "biz-yellow"}`;
      el.innerHTML = `<span>${idx + 1}</span>`;
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([center[0] + dx, center[1] + dy])
        .addTo(mapRef.current!);
      bizMarkersRef.current.push(marker);
    });

    const controller = new AbortController();
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${center[0]},${center[1]}.json?types=neighborhood,locality,place&language=ru&access_token=${token}`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((data) => {
        const feature = data?.features?.[0];
        if (feature?.place_name) {
          setGeoLabel(feature.place_name);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [userLocation]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGeoStatus("ready");
      },
      () => {
        setGeoStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 5000 },
    );
  };

  useEffect(() => {
    if (visiblePersonas.length === 0) return;
    const rotateMs = 9000;
    const intervalId = setInterval(() => {
      setActivePersona((prev) => (prev + 1) % visiblePersonas.length);
    }, rotateMs);
    return () => clearInterval(intervalId);
  }, [visiblePersonas.length, activePersona]);

  useEffect(() => {
    setIsPersonaFading(true);
    const timer = setTimeout(() => setIsPersonaFading(false), 220);
    return () => clearTimeout(timer);
  }, [activePersona]);

  useEffect(() => {
    const persona = visiblePersonas[activePersona];
    if (!persona) return;
    let cancelled = false;
    const timers: number[] = [];
    setVisibleDialog([]);
    setTypingSpeaker(null);

    const run = (index = 0) => {
      if (cancelled) return;
      if (index >= persona.dialog.length) {
        setTypingSpeaker(null);
        return;
      }
      const message = persona.dialog[index];
      const baseDelay = message.speaker === "skeptic" ? 520 : 700;
      setTypingSpeaker(message.speaker);
      const typingDelay = baseDelay + Math.floor(Math.random() * 320);
      const t1 = window.setTimeout(() => {
        if (cancelled) return;
        setTypingSpeaker(null);
        setVisibleDialog((prev) => [...prev, message]);
        const t2 = window.setTimeout(() => run(index + 1), 380);
        timers.push(t2);
      }, typingDelay);
      timers.push(t1);
    };

    run(0);
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [activePersona, visiblePersonas]);

  // Helper to create locale-aware path (en = no prefix, ru = /ru prefix)
  const getLocalePath = (path: string) => {
    if (locale === "en") {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <div className="home-2026">
      <Header />

      <main>
        <section className="hero-2026">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Stop guessing. Start winning.</h1>
              <p className="hero-subtitle">
                Мы вылечили ИИ от галлюцинаций. Upgrowplan использует данные
                рынка и конкурентов, моделирует ваших клиентов и проверяет
                качество документа агентом-скептиком, чтобы создать план,
                который выдержит встречу с реальностью, а не просто красиво
                выглядит на бумаге.
              </p>
              <div className="hero-cta">
                <Link
                  href={getLocalePath("/solutions")}
                  className="btn btn-primary btn-lg"
                >
                  Explore
                </Link>
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => setShowContactModal(true)}
                >
                  Write to Expert
                </button>
              </div>
              <div className="hero-proof">
                <div>
                  <span className="proof-number">260+</span>
                  <span className="proof-label">projects launched</span>
                </div>
                <div>
                  <span className="proof-number">14+ лет</span>
                  <span className="proof-label">expertise</span>
                </div>
                <div>
                  <span className="proof-number">UNIDO / EBRD</span>
                  <span className="proof-label">industry standards</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rag-proof section-pad">
          <div className="container rag-grid">
            <div className="rag-copy">
              <h2>
                Как ИИ-агенты Upgrowplan создают и проверяют планы на живых
                данных.
                <span className="accent-inline">
                  {" "}
                  Не просто генерация текста, а пошаговая валидация каждого
                  факта.
                </span>
              </h2>
              <Link
                href={getLocalePath("/solutions/planMaster/descriptionPage")}
                className="btn btn-primary btn-lg"
              >
                Learn More
              </Link>
            </div>
            <div className="rag-console">
              <div className="console-header">Live Validation...</div>
              <div className="console-body">
                {displayedLines.map((line, idx) => (
                  <div
                    className="console-line log-line"
                    key={`${line.text}-${idx}`}
                  >
                    {line.text}
                    {line.source && (
                      <span className="source-tag">
                        <span className="source-icon" aria-hidden="true">
                          {line.source.name === "Google Maps" ? (
                            <svg viewBox="0 0 24 24" className="icon-svg">
                              <path
                                fill="#0683f5"
                                d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                              />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="icon-svg">
                              <path
                                fill="#7dd36e"
                                d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                              />
                            </svg>
                          )}
                        </span>
                        Источник
                        <span className="source-card">
                          <span className="source-icon" aria-hidden="true">
                            {line.source.name === "Google Maps" ? (
                              <svg viewBox="0 0 24 24" className="icon-svg">
                                <path
                                  fill="#0683f5"
                                  d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                                />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="icon-svg">
                                <path
                                  fill="#7dd36e"
                                  d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                                />
                              </svg>
                            )}
                          </span>
                          {line.source.name}
                        </span>
                      </span>
                    )}
                  </div>
                ))}
                <div className="console-line typing-active">
                  {logLines[lineIndex]?.text.slice(0, charIndex)}
                  <span className="typing-cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`data-proof section-pad${metricsActive ? " is-active" : ""}`}
          ref={proofRef}
        >
          <div className="container">
            <div className="proof-head">
              <h2>
                Забудьте о галлюцинациях ИИ. Каждая цифра в вашем плане имеет
                автора.
                <span className="accent-inline">
                  {" "}
                  Прямые ссылки на официальные отчеты, налоговые кодексы и
                  рыночную аналитику 2026 года.
                </span>
              </h2>
            </div>
            <div className="proof-grid">
              <div className="proof-note">
                <h4>What this means for you</h4>
                <p className="micro-copy">
                  Мы используем RAG (Retrieval-Augmented Generation). ИИ сначала
                  находит актуальные документы, читает их, и только затем пишет
                  ваш план.
                </p>
                <div className="proof-result">
                  Result: 0% fiction, 100% verifiable.
                </div>
              </div>
              <div className="report-card">
                <div className="report-title">Market & Financial Snapshot</div>
                <p className="micro-copy">
                  VAT rate (Israel, 2026):
                  <span className="source-ref">
                    <span className="source-icon-inline" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="icon-svg">
                        <path
                          fill="#01346e"
                          d="M3 10h18v2H3zM5 12h14v8H5zM7 4h10l2 4H5z"
                        />
                      </svg>
                    </span>{" "}
                    {vatRate}% [1]
                    <span className="source-card">
                      <span className="source-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="icon-svg">
                          <path
                            fill="#01346e"
                            d="M3 10h18v2H3zM5 12h14v8H5zM7 4h10l2 4H5z"
                          />
                        </svg>
                      </span>
                      Министерство финансов Израиля, 2026
                      <span className="source-quote">
                        «Стандартная ставка НДС — 17% на 2026 год».
                      </span>
                      <a
                        href="https://www.gov.il"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Перейти к источнику
                      </a>
                    </span>
                  </span>
                </p>
                <p className="micro-copy">
                  Market size (coffee subscriptions):
                  <span className="source-ref">
                    <span className="source-icon-inline" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="icon-svg">
                        <path
                          fill="#7dd36e"
                          d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                        />
                      </svg>
                    </span>{" "}
                    ${marketSize}B [2]
                    <span className="source-card">
                      <span className="source-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="icon-svg">
                          <path
                            fill="#7dd36e"
                            d="M4 20h3V9H4v11zm5 0h3V4H9v16zm5 0h3v-7h-3v7zm5 0h3v-4h-3v4z"
                          />
                        </svg>
                      </span>
                      Statista Market Outlook, 2026
                      <span className="source-quote">
                        «Рынок coffee subscription достиг $1.2B».
                      </span>
                      <a
                        href="https://www.statista.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Перейти к источнику
                      </a>
                    </span>
                  </span>
                </p>
                <p className="micro-copy">
                  Growth rate YoY:
                  <span className="source-ref">
                    <span className="source-icon-inline" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="icon-svg">
                        <path
                          fill="#0683f5"
                          d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                        />
                      </svg>
                    </span>{" "}
                    {growthRate}% [3]
                    <span className="source-card">
                      <span className="source-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="icon-svg">
                          <path
                            fill="#0683f5"
                            d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
                          />
                        </svg>
                      </span>
                      Google Maps + Reviews Index, 2026
                      <span className="source-quote">
                        «Средний рост спроса 6.4% YoY».
                      </span>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Перейти к источнику
                      </a>
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="skeptic-block section-pad" ref={skepticRef}>
          <div className="container skeptic-grid">
            <div className="skeptic-copy">
              <h2>
                The only AI that isn't afraid to tell you "no".
                <span className="accent-inline">
                  {" "}
                  Ваш Агент-Скептик проверит идею на прочность, найдет скрытые
                  расходы и укажет на перенасыщенный рынок.
                </span>
              </h2>
              <p className="micro-copy">
                Мы готовим вас к худшему сценарию, чтобы вы были готовы к
                лучшему.
              </p>
            </div>
            <div className="skeptic-widget">
              <div className="score-row">
                <span>Confidence Score</span>
                <strong>{confidence}/100</strong>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <div className="skeptic-bubble">
                <span className="skeptic-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="icon-svg">
                    <path
                      fill="#01346e"
                      d="M3 12c3-4 6-6 9-6 3 0 6 2 9 6-3 4-6 6-9 6-3 0-6-2-9-6zm9 3a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                </span>
                «Вы указали рост 20% в месяц. Исторические данные вашей ниши
                показывают максимум 8%. Откуда возьмутся лишние 12%?»
              </div>
              <div className="red-flags">
                <details>
                  <summary>[!] Риск: Competition</summary>
                  <div className="flag-detail">
                    Насыщенность рынка в 3.2 раза выше региональной нормы.
                  </div>
                </details>
                <details>
                  <summary>[!] Риск: Завышенная стоимость лида</summary>
                  <div className="flag-detail">
                    Стоимость привлечения клиента выше плана на 40%.
                  </div>
                </details>
              </div>
              <div className="skeptic-chart">
                <svg
                  viewBox="0 0 240 120"
                  role="img"
                  aria-label="Optimistic vs realistic forecast"
                >
                  <polyline
                    points="10,100 60,70 110,50 160,30 230,20"
                    fill="none"
                    stroke="#7dd36e"
                    strokeDasharray="6 6"
                    strokeWidth="2"
                  />
                  <polyline
                    points="10,100 60,82 110,70 160,60 230,55"
                    fill="none"
                    stroke="#01346e"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="persona-block section-pad">
          <div className="container persona-grid">
            <div className="persona-copy">
              <h2>
                Don't guess. Ask those who will actually buy.
                <span className="accent-inline">
                  {" "}
                  Забудьте о «слепой вере». Upgrowplan создает цифровую копию
                  вашей аудитории в нужном районе и позволяет моментально
                  проверить любую бизнес‑гипотезу.
                </span>
              </h2>
            </div>
            <div className="persona-content">
              <div className="persona-cards">
                {visiblePersonas.map((persona, idx) => (
                  <button
                    key={persona.name}
                    className={`persona-card${activePersona === idx ? " active" : ""}`}
                    onClick={() => {
                      setActivePersona(idx);
                    }}
                  >
                    <div
                      className="persona-avatar"
                      style={{ backgroundImage: `url(${persona.image})` }}
                      aria-hidden="true"
                    ></div>
                    <div className="persona-meta">
                      <strong>
                        {persona.name}, {persona.age}
                      </strong>
                      <div className="persona-role">{persona.role}</div>
                      <div className="persona-income">{persona.income}</div>
                      <div className="persona-tags">
                        {persona.preferences.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <span className="persona-badge">{persona.data}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div
                className={`persona-chat${isPersonaFading ? " is-fading" : ""}`}
              >
                <div className="chat-header">
                  <div>
                    <div className="chat-case">
                      Case: {activePersonaData?.caseTitle}
                    </div>
                    <div className="chat-persona">
                      {activePersonaData?.name}
                    </div>
                  </div>
                  <span className="chat-status">online</span>
                </div>
                <div className="chat-messages">
                  {visibleDialog.map((message, idx) => (
                    <div
                      className={`chat-message ${message.speaker}`}
                      key={`${message.speaker}-${idx}`}
                    >
                      <div className="chat-bubble">{message.text}</div>
                      <div className="chat-meta">
                        <span>{message.time}</span>
                        {message.status && (
                          <span className="chat-check">{message.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {typingSpeaker && (
                    <div className={`chat-message ${typingSpeaker} typing`}>
                      <div className="chat-bubble typing-bubble">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="[Upgrowplan RAG Agent спрашивает...]"
                    disabled
                    aria-label="Upgrowplan RAG Agent asks"
                  />
                  <button type="button" disabled>
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="business-pulse section-pad" ref={pulseRef}>
          <div className="container pulse-grid">
            <div className="pulse-copy">
              <h2>
                Бизнес‑план, который не умеет устаревать.
                <span className="accent-inline">
                  {" "}
                  Мир меняется быстрее, чем вы печатаете отчет. Подписка на
                  Business Pulse заменяет целый отдел маркетинга и юристов. Вы
                  получаете только то, что влияет на вашу прибыль. Каждое утро.
                </span>
              </h2>
              <div className="pulse-tabs">
                {[
                  "Разведка: Опережайте конкурентов.",
                  "Щит: Спите спокойно.",
                  "Рейтинг: Станьте №1 на своей улице.",
                ].map((label, idx) => (
                  <button
                    key={label}
                    className={`pulse-tab${pulseTab === idx ? " active" : ""}`}
                    onClick={() => setPulseTab(idx)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link
                href="/ru/solutions/marketResearch/descriptionPage"
                className="pulse-cta"
              >
                Проверить свою гипотезу
              </Link>
            </div>
            <div className="pulse-dashboard">
              <div className="device-frame">
                <div className="device-header">
                  <span>Business Pulse</span>
                  <span className="live-sync">
                    <span className="live-dot"></span>
                    Live: мониторинг цен и законов
                  </span>
                </div>
                <div className="device-map">
                  <div className="mapbox" ref={mapContainerRef} />
                  <div className="map-actions">
                    <button
                      className="map-btn"
                      onClick={requestLocation}
                      disabled={geoStatus === "loading"}
                    >
                      {geoStatus === "loading"
                        ? "Определяем местоположение..."
                        : geoStatus === "ready"
                          ? "Локация определена"
                          : "Показать мой район"}
                    </button>
                    {geoLabel && (
                      <span className="map-hint">Район: {geoLabel}</span>
                    )}
                    {geoStatus === "denied" && (
                      <span className="map-hint">
                        Доступ к геолокации не предоставлен
                      </span>
                    )}
                  </div>
                </div>
                <div className="pulse-cards">
                  <div
                    className={`pulse-stack${pulseTab === 0 ? " active" : ""}`}
                  >
                    <div className={`pulse-card${pulseActive ? " in" : ""}`}>
                      <div className="pulse-icon">📡</div>
                      <div>
                        <strong>Шпионаж</strong>
                        <p>
                          Ваш главный конкурент обновил меню и снизил цены на
                          латте. Мы пересчитали вашу маржу. Риск оттока
                          клиентов: 12%.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-1${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">🚀</div>
                      <div>
                        <strong>Trends</strong>
                        <p>
                          В соцсетях Хайфы взлетел интерес к "безглютеновым
                          десертам". Пора внедрять, пока это не сделали другие.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-2${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">📢</div>
                      <div>
                        <strong>Голос района</strong>
                        <p>
                          За неделю у соседей +15 отзывов. Главная жалоба —
                          медленный Wi‑Fi. Ваш шанс выделиться.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pulse-stack${pulseTab === 1 ? " active" : ""}`}
                  >
                    <div className={`pulse-card${pulseActive ? " in" : ""}`}>
                      <div className="pulse-icon">🛡</div>
                      <div>
                        <strong>Налоги</strong>
                        <p>
                          С 1-го числа меняется ставка страховых взносов для
                          вашего МСП. Мы уже обновили вашу финансовую модель.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-1${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">⚖️</div>
                      <div>
                        <strong>Законы</strong>
                        <p>
                          Новое требование к маркировке продукции в вашем
                          секторе. Проверьте остатки на складе.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-2${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">⏳</div>
                      <div>
                        <strong>Лицензии</strong>
                        <p>
                          Срок действия разрешения на вывеску истекает через 30
                          дней. Ссылка на автоматическое продление прилагается.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pulse-stack${pulseTab === 2 ? " active" : ""}`}
                  >
                    <div className={`pulse-card${pulseActive ? " in" : ""}`}>
                      <div className="pulse-icon">🏆</div>
                      <div>
                        <strong>Место в лиге</strong>
                        <p>
                          Вы на 2‑м месте по популярности в категории "Завтраки"
                          в своем квартале.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-1${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">📈</div>
                      <div>
                        <strong>The Gap</strong>
                        <p>
                          До 1‑го места не хватило всего 5 положительных
                          упоминаний за неделю. Мы знаем, как их получить.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`pulse-card delay-2${pulseActive ? " in" : ""}`}
                    >
                      <div className="pulse-icon">💸</div>
                      <div>
                        <strong>Бенчмаркинг</strong>
                        <p>
                          Средний чек в районе вырос на 3%. Ваши цены остались
                          прежними — вы теряете чистую прибыль.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="anti-template section-pad">
          <div className="container">
            <div className="anti-title-row">
              <h2>
                Хватит копировать чужие ошибки.
                <span className="accent-inline">
                  {" "}
                  Шаблон — это «средняя температура по больнице». Мы строим ваш
                  бизнес на живых данных вашего города, улицы и ниши.
                </span>
              </h2>
            </div>
            <div className="row align-items-center gy-4">
              <div className="col-lg-8">
                <div className="tablet-frame" ref={antiSliderRef}>
                  <div
                    className="before-after"
                    style={{ ["--slider" as any]: `${sliderPos}%` }}
                  >
                    <div className="layer-upgrow">
                      <div className="upgrow-fixed">
                        <div className="upgrow-live">
                          ● RAG AGENTS: VERIFIED
                        </div>
                        <h4>Strategy: Haifa, Hadar District | April 2026</h4>
                        <p>
                          Студенты Техниона (ул. Герцля) формируют 65% утреннего
                          трафика. Пик: 08:15 — 09:30. Ожидаемый чек: 18–22 ₪.
                        </p>
                        <p>
                          В радиусе 150м — 4 точки. Конкурент "Cafe X" снизил
                          оценку до 3.8. Ваша точка входа: лучший Wi‑Fi и
                          веганское меню (спрос в районе +40%).
                        </p>
                        <p>
                          Аренда лота #442: 8,400 ₪ + муниципальный налог.
                          Лицензия на вывеску в Хайфе: ожидание 14 дней.
                        </p>
                      </div>
                    </div>

                    <div className="layer-template">
                      <div className="template-content">
                        <h4>Типовой бизнес-план кофейни (v.4.2)</h4>
                        <p>
                          Рынок общественного питания демонстрирует стабильный
                          рост в 3-5% ежегодно. Целевая аудитория — мужчины и
                          женщины 18-65 лет...
                        </p>
                        <p className="strike">
                          Необходимо выбрать место с высоким пешеходным
                          трафиком, предпочтительно на первой линии домов...
                        </p>
                        <p>
                          Средняя стоимость аренды в крупном городе составляет
                          $2000. Коэффициент инфляции — стандартный...
                        </p>
                        <div className="template-stamp">
                          ДАННЫЕ ИЗ WIKIPEDIA 2021
                        </div>
                      </div>
                    </div>
                    <div
                      className="divider-line"
                      style={{ left: `${sliderPos}%` }}
                      onMouseDown={() => setIsSliding(true)}
                      onTouchStart={() => setIsSliding(true)}
                    >
                      <span className="divider-hint">↔</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-5">
                <h2>Upgrowplan — это не конструктор. Это интеллект.</h2>
                <p className="micro-copy">
                  Шаблоны — это яд для стартапа. Они дают ложное чувство
                  безопасности, используя цифры, которые не имеют отношения к
                  вашей улице.
                </p>
                <p className="micro-copy">
                  Мы полностью отказались от заготовок. Каждое слово в вашем
                  плане рождается в момент запроса:
                </p>
                <ul>
                  <li>
                    Живой поиск: наши агенты «ногами» обходят интернет вашего
                    города.
                  </li>
                  <li>
                    Никакой воды: мы пишем про цены у вашего соседа справа.
                  </li>
                  <li>
                    Проверка гипотез: данные сверяются с налогами и трендами
                    апреля 2026 года.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="deep-work section-pad">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row align-items-center gy-4">
                  <div className="col-lg-5 text-center">
                    <h2 className="deep-title">
                      15 минут правды против 60 секунд вымысла.
                      <span className="accent-inline">
                        {" "}
                        Фастфуд готовится минуту, но им нельзя питаться долго.
                        Настоящая стратегия требует времени на проверку каждого
                        факта.
                      </span>
                    </h2>
                  </div>
                  <div className="col-lg-7">
                    <div className="deep-terminal">
                      <div className="terminal-title">Live Validation</div>
                      <div className="terminal-lines" ref={deepLogRef}>
                        {deepLines.map((line, idx) => (
                          <div
                            className="terminal-line"
                            key={`${line.ts}-${idx}`}
                          >
                            <span className="ts">{line.ts}</span>
                            <span
                              className={`tag tag-${line.tag.toLowerCase()}`}
                            >
                              {line.tag}
                            </span>
                            <span className="msg">
                              {line.typed ?? line.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="deep-copy">
                  <h4>Почему наши агенты не отвечают мгновенно?</h4>
                  <ul>
                    <li>
                      Мы не галлюцинируем: обычный чат-бот придумывает цифру за
                      секунду. Наш RAG-агент тратит 3 минуты только на поиск
                      реальных объявлений об аренде в вашем районе.
                    </li>
                    <li>
                      Мы сверяем законы: система запрашивает актуальные
                      налоговые справочники.
                    </li>
                    <li>
                      Мы думаем за покупателя: прогоняем идею через 6 цифровых
                      аватаров, чтобы понять, купят они продукт или нет.
                    </li>
                  </ul>
                  <div className="deep-result">
                    Итог: вы тратите 15 минут на ожидание, чтобы сэкономить 15
                    месяцев жизни и миллионы инвестиций в заведомо провальную
                    локацию.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="metrics-life section-pad">
          <div className="container">
            <div className="row align-items-center gy-4">
              <div className="col-lg-5">
                <h2>
                  Метрики, которые понятны обычному человеку.
                  <span className="accent-inline">
                    {" "}
                    Мы понимаем, что вы открываете бизнес, чтобы созидать, а не
                    чтобы круглосуточно смотреть в Excel.
                  </span>
                </h2>
                <ul className="micro-copy">
                  <li>
                    Никакой воды: только те цифры, которые влияют на решение
                    сегодня.
                  </li>
                  <li>
                    Наглядность: визуальные графики вместо бесконечных таблиц.
                  </li>
                  <li>
                    Прогноз на ладони: одно маленькое изменение цены за чашку
                    меняет результат года.
                  </li>
                </ul>
              </div>
              <div className="col-lg-7">
                <div className="metric-visual">
                  <div className="metric-switch">
                    <button
                      className={`switch-btn${metricMode === "cfo" ? " active" : ""}`}
                      onClick={() => setMetricMode("cfo")}
                    >
                      Финансовый директор
                    </button>
                    <button
                      className={`switch-btn${metricMode === "owner" ? " active" : ""}`}
                      onClick={() => setMetricMode("owner")}
                    >
                      Владелец бизнеса
                    </button>
                  </div>
                  <div className="metric-cards">
                    <div
                      className={`metric-card upgrow ${metricMode === "cfo" ? "active" : "faded"}`}
                    >
                      <div className="metric-row">
                        <span className="icon">☕</span>
                        <div>
                          <div className="metric-label">Breakeven Point</div>
                          <div className="metric-value">
                            14 cups / day to cover rent
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">⏳</span>
                        <div>
                          <div className="metric-label">OPEX Optimization</div>
                          <div className="metric-value">
                            Close 1 hour earlier on Monday = 4,000 ₪ saved
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">👤</span>
                        <div>
                          <div className="metric-label">Marketing ROI</div>
                          <div className="metric-value">
                            Each 500 ₪ yields 12 new IG customers
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">📅</span>
                        <div>
                          <div className="metric-label">Payback Period</div>
                          <div className="metric-value">
                            7 months to profitability
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`metric-card upgrow ${metricMode === "owner" ? "active" : "faded"}`}
                    >
                      <div className="metric-row">
                        <span className="icon">☕</span>
                        <div>
                          <div className="metric-label">
                            Точка безубыточности
                          </div>
                          <div className="metric-value">
                            14 чашек латте в день
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">⏳</span>
                        <div>
                          <div className="metric-label">Оптимизация затрат</div>
                          <div className="metric-value">
                            Закрывайтесь на 1 час раньше в ПН
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">👤</span>
                        <div>
                          <div className="metric-label">
                            Эффективность маркетинга
                          </div>
                          <div className="metric-value">
                            500 ₪ → 12 клиентов из Instagram
                          </div>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="icon">📅</span>
                        <div>
                          <div className="metric-label">Срок окупаемости</div>
                          <div className="metric-value">
                            Кофейня выходит в прибыль через 7 месяцев
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="reality-check section-pad">
          <div className="container text-center">
            <div className="reality-inner">
              <h2 className="reality-title">
                Бизнес-план — это не документ для банка. Это ваша страховка от
                банкротства в первый год.
              </h2>
              <p className="micro-copy">
                Квиз на 15 секунд. Мы ценим ваше время
              </p>
            </div>
          </div>

          <div className="container">
            <div className="row g-3 reality-questions">
              {[
                "Вы знаете точную стоимость аренды и муниципальный налог на выбранной улице на апрель 2026?",
                "Вы в курсе, на что жалуются 20% клиентов вашего ближайшего конкурента в Google Maps прямо сейчас?",
                "Ваша финансовая модель учитывает последние изменения в трудовом законодательстве и социальные взносы на текущий квартал?",
              ].map((question, idx) => (
                <div className="col-12 col-md-4" key={question}>
                  <div className="reality-card h-100">
                    <div className="question-text">{question}</div>
                    <div className="answer-buttons">
                      <button
                        className={`answer-btn${realityAnswers[idx] === true ? " active yes" : ""}`}
                        onClick={() =>
                          setRealityAnswers((prev) => {
                            const next = [...prev];
                            next[idx] = true;
                            return next;
                          })
                        }
                      >
                        Да
                      </button>
                      <button
                        className={`answer-btn${realityAnswers[idx] === false ? " active no" : ""}`}
                        onClick={() =>
                          setRealityAnswers((prev) => {
                            const next = [...prev];
                            next[idx] = false;
                            return next;
                          })
                        }
                      >
                        Нет
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container text-center">
            {allAnswered && (
              <div className="reality-outcome">
                {anyNo ? (
                  <>
                    <h3>Time заполнить пробелы.</h3>
                    <p className="micro-copy">
                      Бизнес не прощает галлюцинаций. Даже одна ошибка в расчете
                      аренды или налогах может съесть вашу прибыль за первый
                      год. Наши RAG-агентства уже нашли ответы на эти вопросы.
                      Получите их через 15 минут.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>
                      Впечатляет. Вы входите в 5% подготовленных фаундеров.
                    </h3>
                    <p className="micro-copy">
                      Но профессионалы знают: цена ошибки слишком велика, чтобы
                      доверять одному источнику. Используйте Upgrowplan как
                      Stress-Test: сверьте свои расчеты с независимыми данными
                      ИИ-агентов. Если мы найдем расхождение — это спасет ваши
                      деньги. Если нет — вы получите железобетонную уверенность.
                    </p>
                  </>
                )}
                <div className="reality-actions">
                  <Link
                    href="/ru/solutions/planMaster/descriptionPage"
                    className="btn btn-primary btn-lg"
                  >
                    Создать бизнес-план
                  </Link>
                </div>
              </div>
            )}

            <div className="reality-message">
              <div className="message-text">Остались вопросы?</div>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => setShowContactModal(true)}
              >
                Написать нам
              </button>
            </div>
          </div>
        </section>

        <Modal
          show={showContactModal}
          onHide={() => setShowContactModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Связаться</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ContactForm
              locale="ru"
              className="border p-3 rounded bg-light shadow-sm"
              initialMessage="Интересует консультация по проверке данных"
              onSuccess={() => setShowContactModal(false)}
            />
          </Modal.Body>
        </Modal>
      </main>

      <style jsx>{`
        .home-2026 {
          background: #ffffff;
          color: #171717;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .hero-2026 {
          padding: 5rem 0 3rem;
          background:
            radial-gradient(
              1200px 600px at 10% 10%,
              rgba(7, 133, 246, 0.12),
              transparent 60%
            ),
            linear-gradient(
              120deg,
              rgba(30, 96, 120, 0.06),
              rgba(7, 133, 246, 0.02)
            );
        }

        .section-pad {
          padding: 5rem 0 5rem;
        }

        .persona-content {
          margin-bottom: 1.5rem;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
          text-align: center;
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
          color: #171717;
          margin-bottom: 1.75rem;
          max-width: 620px;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .hero-proof {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          font-size: 0.85rem;
          color: #1e6078;
          max-width: 620px;
          margin: 0 auto;
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

        .hero-copy {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rag-proof {
          background: #d9ebf5;
          border-top: 1px solid rgba(1, 52, 110, 0.15);
          border-bottom: 1px solid rgba(1, 52, 110, 0.15);
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .rag-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          align-items: center;
        }

        .rag-copy h2 {
          color: #01346e;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .rag-copy h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .rag-console {
          background: #0f1f2a;
          border-radius: 14px;
          border: 1px solid #01346e;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.2);
          overflow: hidden;
        }

        .console-header {
          background: #0b1a21;
          color: #ecf6ff;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .console-body {
          padding: 1rem;
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          color: #ecf6ff;
          display: grid;
          gap: 0.6rem;
          height: 200px;
          overflow: hidden;
        }

        .console-line {
          font-size: 0.85rem;
        }

        .warn {
          color: #ffcc66;
          margin-left: 0.35rem;
        }

        .source-tag {
          position: relative;
          margin-left: 0.4rem;
          color: #7dd36e;
          cursor: pointer;
        }

        .source-card {
          position: absolute;
          left: 0;
          top: 130%;
          background: #ffffff;
          color: #01346e;
          border: 1px solid #01346e;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          white-space: nowrap;
          box-shadow: 0 8px 16px rgba(1, 52, 110, 0.2);
          opacity: 0;
          pointer-events: none;
          transform: translateY(6px);
          transition: all 0.2s ease;
          z-index: 5;
        }

        .source-tag:hover .source-card {
          opacity: 1;
          transform: translateY(0);
        }

        .data-proof {
          background: #ffffff;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .proof-head {
          text-align: center;
          max-width: 860px;
          margin: 0 auto 2.5rem;
        }

        .proof-head h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .proof-head h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .proof-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: start;
        }

        .proof-note {
          border: 1px solid rgba(1, 52, 110, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          background: #f7fbff;
        }

        .proof-note h4 {
          color: #01346e;
          margin-bottom: 0.5rem;
        }

        .proof-result {
          margin-top: 0.75rem;
          color: #01346e;
          font-weight: 600;
        }

        .report-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.75rem;
          border: 1px solid rgba(1, 52, 110, 0.1);
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.08);
        }

        .report-title {
          font-weight: 700;
          color: #01346e;
          margin-bottom: 1rem;
        }

        .source-ref {
          position: relative;
          color: #01346e;
          text-decoration: underline;
          text-decoration-style: dotted;
          cursor: pointer;
        }

        .source-icon-inline {
          display: inline-flex;
          align-items: center;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.4s ease;
        }

        .data-proof.is-active .source-icon-inline {
          opacity: 1;
          transform: translateY(0);
        }

        .source-card {
          position: absolute;
          left: 0;
          top: 140%;
          background: #ffffff;
          color: #01346e;
          border: 1px solid rgba(1, 52, 110, 0.25);
          border-radius: 10px;
          padding: 0.75rem;
          width: 240px;
          box-shadow: 0 14px 28px rgba(1, 52, 110, 0.18);
          opacity: 0;
          filter: blur(6px);
          transform: translateY(8px);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .source-ref:hover .source-card {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }

        .source-quote {
          display: block;
          font-size: 0.75rem;
          color: #3b4a63;
          margin: 0.5rem 0;
        }

        .source-card a {
          background: #01346e;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          text-decoration: none;
          display: inline-block;
        }

        .icon-svg {
          width: 16px;
          height: 16px;
          margin-right: 6px;
          vertical-align: middle;
        }

        .skeptic-block {
          background: #d9ebf5;
          border-top: 1px solid rgba(1, 52, 110, 0.12);
        }

        .skeptic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }

        .skeptic-copy h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .skeptic-copy h2 .accent-inline {
          color: #7dd36e;
          font-weight: 600;
        }

        .skeptic-widget {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(1, 52, 110, 0.1);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.12);
          overflow: hidden;
        }

        .skeptic-widget::after {
          content: "";
          position: absolute;
          left: -10%;
          top: 10%;
          width: 120%;
          height: 2px;
          background: rgba(1, 52, 110, 0.35);
          opacity: 0;
        }

        .skeptic-widget:hover::after {
          animation: scan 1.2s ease;
        }

        .score-row {
          display: flex;
          justify-content: space-between;
          color: #01346e;
          font-weight: 600;
        }

        .score-bar {
          margin: 0.5rem 0 1rem;
          height: 8px;
          border-radius: 999px;
          background: rgba(1, 52, 110, 0.1);
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          width: 65%;
          background: #7dd36e;
          transition: width 0.6s ease;
        }

        .skeptic-bubble {
          background: #f7fbff;
          border: 1px solid rgba(1, 52, 110, 0.12);
          border-radius: 12px;
          padding: 0.9rem;
          margin-bottom: 1rem;
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .skeptic-widget:hover .skeptic-bubble {
          animation: shake 0.4s ease;
        }

        .red-flags details {
          margin-bottom: 0.6rem;
          padding: 0.6rem;
          border-radius: 10px;
          border: 1px solid rgba(1, 52, 110, 0.1);
          background: #ffffff;
        }

        .skeptic-widget:hover .red-flags details {
          box-shadow: 0 0 0 2px rgba(1, 52, 110, 0.08);
        }

        .red-flags summary {
          cursor: pointer;
          color: #d64545;
          font-weight: 600;
          list-style: none;
        }

        .flag-detail {
          margin-top: 0.4rem;
          color: #3b4a63;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .red-flags details[open] .flag-detail {
          max-height: 120px;
          opacity: 1;
          animation: detailIn 0.3s ease;
        }

        .skeptic-chart {
          margin-top: 1rem;
        }

        .skeptic-chart svg {
          height: 90px;
        }

        .skeptic-chart p {
          margin-top: 0.5rem;
          color: #01346e;
          font-weight: 600;
        }

        .persona-block {
          background: #ffffff;
        }

        .persona-grid {
          display: grid;
          gap: 2.5rem;
        }

        .persona-copy h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }
        .persona-copy h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .persona-content {
          display: grid;
          grid-template-columns: minmax(240px, 0.9fr) minmax(320px, 2.1fr);
          gap: 2rem;
        }

        .persona-cards {
          display: grid;
          gap: 1rem;
        }

        .persona-card {
          display: flex;
          gap: 0.9rem;
          padding: 1rem;
          border-radius: 14px;
          border: 1px solid rgba(1, 52, 110, 0.1);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          text-align: left;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .persona-card:hover {
          transform: translateY(-3px);
          border-color: #7dd36e;
          box-shadow: 0 12px 26px rgba(125, 211, 110, 0.2);
        }

        .persona-card.active {
          border-color: #0683f5;
          background: rgba(6, 131, 245, 0.08);
          box-shadow: 0 0 0 2px rgba(6, 131, 245, 0.2);
        }

        .persona-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background-color: #d9ebf5;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .persona-meta strong {
          color: #01346e;
        }

        .persona-role {
          color: #2d3f57;
          font-size: 0.86rem;
          margin-top: 0.2rem;
        }

        .persona-income {
          color: #0683f5;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .persona-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin: 0.45rem 0 0.25rem;
        }

        .persona-tags span {
          background: rgba(6, 131, 245, 0.1);
          color: #01346e;
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .persona-badge {
          display: inline-block;
          font-size: 0.75rem;
          color: #01346e;
          background: rgba(1, 52, 110, 0.08);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .persona-chat {
          border-radius: 18px;
          border: 1px solid rgba(1, 52, 110, 0.1);
          background: #f5f8fd;
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
          min-height: 360px;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .persona-chat.is-fading {
          opacity: 0.6;
          transform: translateY(6px);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(1, 52, 110, 0.12);
        }

        .chat-case {
          font-weight: 700;
          color: #01346e;
        }

        .chat-persona {
          font-size: 0.9rem;
          color: #2d3f57;
          margin-top: 0.1rem;
        }

        .chat-status {
          font-size: 0.75rem;
          color: #7dd36e;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .chat-messages {
          display: grid;
          gap: 0.75rem;
          height: 300px;
          overflow: hidden;
          padding-right: 0.25rem;
        }

        .chat-message {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-width: 80%;
        }

        .chat-message.skeptic {
          align-items: flex-start;
        }

        .chat-message.avatar {
          align-items: flex-end;
          margin-left: auto;
        }

        .chat-bubble {
          padding: 0.75rem 0.9rem;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.45;
          box-shadow: 0 6px 16px rgba(9, 30, 66, 0.08);
        }

        .chat-message.skeptic .chat-bubble {
          background: #0683f5;
          color: #ffffff;
          border-bottom-left-radius: 4px;
        }

        .chat-message.avatar .chat-bubble {
          background: #ffffff;
          color: #01346e;
          border-bottom-right-radius: 4px;
        }

        .chat-meta {
          font-size: 0.72rem;
          color: #6a7b93;
          display: flex;
          gap: 0.5rem;
        }

        .chat-check {
          color: #0683f5;
          font-weight: 600;
        }

        .typing-bubble {
          display: flex;
          gap: 0.35rem;
          align-items: center;
          min-width: 52px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          animation: blink 1s infinite;
        }

        .chat-message.avatar .typing-dot {
          background: rgba(1, 52, 110, 0.6);
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chat-input {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        .chat-input input {
          flex: 1;
          border-radius: 12px;
          border: 1px solid rgba(1, 52, 110, 0.12);
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          background: #ffffff;
        }

        .chat-input button {
          border: none;
          background: #0683f5;
          color: #ffffff;
          padding: 0.6rem 0.9rem;
          border-radius: 12px;
          font-weight: 600;
        }

        .anti-template {
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .anti-template h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
        }

        .anti-title-row {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .anti-template h2 .accent-inline {
          color: #7dd36e;
          font-weight: 600;
          font-size: 1em;
          line-height: 1.1;
        }

        .accent-inline {
          font-size: 1em;
          font-weight: 600;
          line-height: 1.1;
        }

        .micro-copy {
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          font-size: 0.95rem;
          line-height: 1.45;
          color: #4c5a70;
          font-weight: 500;
        }

        .tablet-frame {
          position: relative;
          border-radius: 22px;
          border: 2px solid rgba(200, 208, 219, 0.9);
          background: #f7f9fc;
          box-shadow: 0 18px 40px rgba(1, 52, 110, 0.12);
          padding: 1.25rem;
        }

        .before-after {
          position: relative;
          height: 420px;
          border-radius: 16px;
          overflow: hidden;
          background: #f2f4f7;
          --slider: 55%;
        }

        .layer-template,
        .layer-upgrow {
          position: absolute;
          inset: 0;
          height: 100%;
        }

        .layer-template {
          z-index: 2;
          color: #999;
          font-family: "Times New Roman", Times, serif;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.03),
            transparent 60%
          );
          clip-path: inset(0 calc(100% - var(--slider)) 0 0);
        }

        .layer-upgrow {
          z-index: 1;
          overflow: hidden;
          background: #01346e;
          color: #0683f5;
          clip-path: inset(0 0 0 var(--slider));
        }

        .layer-upgrow .upgrow-fixed {
          position: absolute;
          inset: 0;
          width: 100%;
        }

        .template-content {
          padding: 1.8rem 2rem;
          filter: blur(1px);
          opacity: 0.9;
          user-select: none;
        }

        .template-content h4 {
          margin-top: 0;
          text-decoration: line-through;
          color: #888;
        }

        .template-content .strike {
          text-decoration: line-through;
          color: #b05c5c;
        }

        .template-stamp {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(153, 153, 153, 0.8);
        }

        .upgrow-fixed {
          width: 100%;
          padding: 1.8rem 2rem;
          color: #ecf6ff;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          user-select: none;
          padding-left: 20%;
        }

        .upgrow-live {
          font-size: 0.75rem;
          color: #7dd36e;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .divider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 14px;
          background: #7dd36e;
          z-index: 3;
          cursor: col-resize;
        }

        .divider-hint {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(1, 52, 110, 0.85);
          color: #ffffff;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .divider-line::before {
          content: "✋";
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.9rem;
          color: #01346e;
          background: #ffffff;
          border-radius: 999px;
          padding: 0.15rem 0.4rem;
          box-shadow: 0 6px 14px rgba(1, 52, 110, 0.2);
        }

        .divider-line::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 3px;
          background: #7dd36e;
          transform: translateX(-50%);
          box-shadow: 0 0 10px rgba(125, 211, 110, 0.8);
        }

        .anti-template ul {
          padding-left: 1.1rem;
          color: #4c5a70;
          font-weight: 500;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .deep-work {
          background: #d9ebf5;
        }

        .deep-title {
          color: #01346e;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
        }

        .deep-title .accent-inline {
          color: #0683f5;
          font-weight: 600;
          font-size: 1em;
          line-height: 1.1;
        }

        .deep-terminal {
          background: #0f1f2a;
          border: 1px solid #01346e;
          border-radius: 14px;
          padding: 1rem;
          color: #ecf6ff;
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          margin-bottom: 1.5rem;
          box-shadow: 0 12px 24px rgba(1, 52, 110, 0.25);
        }

        .terminal-title {
          color: #ecf6ff;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .terminal-lines {
          display: grid;
          gap: 0.5rem;
          height: 240px;
          overflow-y: auto;
          scrollbar-width: none;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 0, 0, 0.9) 18%,
            #000 100%
          );
        }

        .terminal-lines::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .terminal-line {
          display: grid;
          grid-template-columns: 90px 120px 1fr;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .terminal-line .ts {
          color: rgba(229, 243, 255, 0.6);
        }

        .terminal-line .tag {
          color: #7dd36e;
        }

        .tag.search_agent {
          color: #7dd36e;
        }
        .tag.tax_engine {
          color: #f2b94b;
        }
        .tag.competitor_v2 {
          color: #68a9ff;
        }
        .tag.rag_validate {
          color: #9b8cff;
        }
        .tag.persona_sim {
          color: #ff8aa5;
        }
        .tag.fin_model {
          color: #8fe1c1;
        }

        .deep-copy h4 {
          color: #01346e;
          margin-bottom: 0.75rem;
        }

        .deep-copy ul {
          padding-left: 1.1rem;
          color: #4c5a70;
          font-weight: 500;
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
        }

        .deep-result {
          margin-top: 1rem;
          font-weight: 600;
          color: #01346e;
        }

        .deep-copy {
          margin-top: 1.5rem;
          text-align: left;
          padding: 0 10%;
        }

        .metrics-life {
          background: #ffffff;
        }

        .metrics-life h2 {
          color: #01346e;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .metrics-life h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
          font-size: 1em;
          line-height: 1.1;
        }

        .reality-check {
          background: #f8fafd;
        }

        .reality-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .reality-questions {
          max-width: 100%;
        }

        .reality-check .row.reality-questions {
          max-width: 100%;
        }

        .reality-title {
          color: #7dd36e;
        }

        .reality-questions {
          margin: 2rem 0;
        }

        .reality-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 16px 28px rgba(9, 30, 66, 0.14);
          border: 1px solid rgba(1, 52, 110, 0.08);
          transition: all 0.2s ease;
        }

        .reality-card:hover {
          box-shadow: 0 14px 30px rgba(9, 30, 66, 0.12);
          background: #e9f4ff;
        }

        .question-text {
          color: #01346e;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .answer-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .answer-btn {
          border: 1px solid rgba(1, 52, 110, 0.2);
          background: transparent;
          color: #01346e;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .answer-btn.active.yes {
          background: #0683f5;
          color: #ffffff;
          border-color: #0683f5;
        }

        .answer-btn.active.no {
          background: #ffffff;
          color: #d64545;
          border-color: #d64545;
        }

        .reality-outcome {
          margin-top: 2.5rem;
          animation: fadeIn 0.4s ease;
        }

        .reality-actions {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .reality-note {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: #4c5a70;
        }

        .reality-message {
          margin-top: 2.5rem;
          display: grid;
          justify-items: center;
          gap: 0.75rem;
        }

        .message-text {
          font-weight: 600;
          color: #01346e;
        }

        .metric-switch {
          display: inline-flex;
          gap: 0.5rem;
          background: #f3f6fa;
          padding: 0.4rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          border: 1px solid #e0e0e0;
          justify-content: center;
        }

        .switch-btn {
          border: none;
          background: transparent;
          color: #4c5a70;
          font-weight: 600;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .switch-btn.active {
          background: #0683f5;
          color: #ffffff;
        }

        .metric-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem;
          width: 100%;
        }

        .metric-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .metric-card {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 14px;
          padding: 1.2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .metric-card.old-school {
          font-family: "Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif;
          color: #8a94a6;
          font-size: 0.85rem;
        }

        .metric-card.old-school .card-title {
          font-weight: 700;
          color: #9aa3b2;
          margin-bottom: 0.8rem;
        }

        .metric-line {
          margin-bottom: 0.5rem;
        }

        .metric-card.upgrow {
          display: grid;
          gap: 0.9rem;
          transition:
            opacity 0.35s ease,
            filter 0.35s ease,
            transform 0.35s ease;
        }

        .metric-card.upgrow.faded {
          opacity: 0.35;
          filter: blur(2px);
          pointer-events: none;
          transform: translateY(8px);
        }

        .metric-card.upgrow.active {
          opacity: 1;
          filter: none;
          transform: translateY(0);
        }

        .metric-row {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 0.6rem;
          align-items: start;
        }

        .metric-row .icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          background: rgba(6, 131, 245, 0.12);
          border-radius: 10px;
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .metric-card.upgrow.owner .icon {
          transform: scale(1.05);
        }

        .metric-label {
          font-size: 0.85rem;
          color: #4c5a70;
        }

        .metric-value {
          font-weight: 600;
          color: #01346e;
        }

        .business-pulse {
          background: #d9ebf5;
          border-top: 1px solid rgba(1, 52, 110, 0.12);
        }

        .pulse-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }

        .pulse-copy h2 {
          color: #01346e;
          font-size: clamp(1.7rem, 2.4vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }

        .pulse-copy h2 .accent-inline {
          color: #0683f5;
          font-weight: 600;
        }

        .pulse-tabs {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .pulse-tab {
          border: 1px solid rgba(1, 52, 110, 0.15);
          background: #ffffff;
          color: #01346e;
          padding: 0.7rem 0.9rem;
          border-radius: 12px;
          text-align: left;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .pulse-tab:hover {
          border-color: #7dd36e;
          color: #01346e;
        }

        .pulse-tab.active {
          border-color: #0683f5;
          background: rgba(6, 131, 245, 0.1);
          color: #01346e;
        }

        .pulse-cta {
          border: none;
          background: #01346e;
          color: #ffffff;
          padding: 0.75rem 1.1rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-dashboard {
          display: flex;
          justify-content: center;
        }

        .device-frame {
          background: #0f1f2a;
          color: #ecf6ff;
          border-radius: 24px;
          border: 1px solid rgba(1, 52, 110, 0.6);
          padding: 1.25rem;
          width: min(420px, 100%);
          box-shadow: 0 20px 40px rgba(1, 52, 110, 0.2);
        }

        .device-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .live-sync {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #7dd36e;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7dd36e;
          animation: pulseDot 1.4s infinite ease-in-out;
        }

        .device-map {
          background: #ffffff;
          border-radius: 16px;
          padding: 0.75rem;
          color: #01346e;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }

        .mapbox {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .mapbox .mapboxgl-canvas {
          width: 100% !important;
          height: 100% !important;
        }

        .mapbox::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(6, 131, 245, 0.18),
            rgba(125, 211, 110, 0.12),
            rgba(1, 52, 110, 0.08)
          );
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .biz-marker {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          display: grid;
          place-items: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(1, 52, 110, 0.25);
        }

        .biz-marker.biz-red {
          background: #e2534e;
        }

        .biz-marker.biz-yellow {
          background: #f2b94b;
          color: #1e1e1e;
        }

        .user-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #7dd36e;
          border: 2px solid #01346e;
          box-shadow: 0 0 0 6px rgba(125, 211, 110, 0.25);
        }

        .map-actions {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.6rem;
        }

        .map-btn {
          border: 1px solid rgba(1, 52, 110, 0.2);
          background: #ffffff;
          color: #01346e;
          padding: 0.45rem 0.7rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .map-hint {
          color: #6a7b93;
          font-size: 0.75rem;
        }

        .pulse-cards {
          position: relative;
          min-height: 240px;
        }

        .pulse-stack {
          display: none;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pulse-stack.active {
          display: flex;
        }

        .pulse-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 0.75rem;
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 0.6rem;
          align-items: start;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.45s ease;
        }

        .pulse-card.in {
          opacity: 1;
          transform: translateY(0);
        }

        .pulse-card.delay-1 {
          transition-delay: 0.15s;
        }

        .pulse-card.delay-2 {
          transition-delay: 0.3s;
        }

        .pulse-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          background: rgba(6, 131, 245, 0.2);
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
        }

        .pulse-card strong {
          display: block;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .pulse-card p {
          margin: 0;
          color: rgba(236, 246, 255, 0.9);
          font-size: 0.85rem;
        }

        .persona-votes {
          border-top: 1px solid rgba(1, 52, 110, 0.1);
          padding-top: 1.5rem;
        }

        .votes-title {
          font-weight: 700;
          color: #01346e;
          margin-bottom: 0.8rem;
        }

        .votes-avatars {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }

        .vote-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(1, 52, 110, 0.08);
          background-size: cover;
          background-position: center;
          transition: transform 0.2s ease;
        }

        .vote-avatar:hover {
          transform: translateY(-3px);
        }

        .votes-legend {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .vote {
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .vote.buy {
          background: rgba(125, 211, 110, 0.2);
          color: #2e7d32;
        }

        .vote.maybe {
          background: rgba(1, 52, 110, 0.08);
          color: #3b4a63;
        }

        .vote.no {
          background: rgba(255, 99, 71, 0.2);
          color: #b71c1c;
        }

        .votes-caption {
          margin-top: 0.6rem;
          color: #3b4a63;
        }

        .skeptic-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(1, 52, 110, 0.1);
          flex-shrink: 0;
        }

        .typing-active {
          font-size: 0.85rem;
          color: #8bc4ff;
          min-height: 1.25rem;
        }

        .log-line {
          font-size: 0.82rem;
          color: rgba(236, 246, 255, 0.85);
          animation: lineIn 0.35s ease;
        }

        .demo-result {
          margin-top: 0.9rem;
          background: rgba(7, 133, 246, 0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-weight: 600;
        }

        .rag-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rag-label {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          color: #8bc4ff;
          font-weight: 600;
        }

        .rag-text {
          flex: 1;
        }

        .rag-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1ed88a;
          animation: pulseDot 1.6s infinite ease-in-out;
        }

        .rag-result {
          margin-top: 0.9rem;
          font-weight: 600;
          color: #1ed88a;
        }

        @keyframes pulseDot {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes lineIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scan {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(220px);
          }
        }

        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          50% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes detailIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @media (max-width: 767px) {
          .section-pad {
            padding: 3rem 0 3rem;
          }

          .hero-2026 {
            padding: 3rem 0 2rem;
          }

          .hero-2026 h1 {
            font-size: clamp(1.8rem, 5vw, 2.4rem);
            margin-bottom: 0.75rem;
          }

          h2 {
            text-align: center;
          }

          .hero-subtitle {
            font-size: 0.95rem;
            margin-bottom: 1.25rem;
          }

          .hero-cta {
            width: 100%;
            gap: 0.75rem;
          }

          .hero-cta :global(.btn) {
            width: 100%;
            font-size: 0.9rem;
            padding: 0.6rem 0.9rem;
          }

          .hero-proof {
            gap: 0.75rem;
          }

          .rag-copy {
            text-align: center;
          }

          .rag-grid {
            gap: 1.5rem;
          }

          .rag-console {
            border-radius: 10px;
          }

          .console-body {
            padding: 0.75rem;
            height: 180px;
            overflow: hidden;
          }

          .proof-grid {
            gap: 1.5rem;
          }

          .skeptic-grid {
            gap: 1.5rem;
          }

          .source-card {
            position: static;
            opacity: 1;
            filter: none;
            transform: none;
            margin-top: 0.5rem;
            width: 100%;
          }

          .persona-content {
            grid-template-columns: 1fr;
          }

          .persona-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .chat-messages {
            height: 260px;
          }

          .pulse-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .pulse-tabs {
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .pulse-tab {
            font-size: 0.85rem;
            padding: 0.6rem 0.8rem;
          }

          .anti-wrap {
            grid-template-columns: 1fr;
          }

          .anti-blade {
            display: none;
          }

          .anti-template {
            background: #ffffff;
          }

          .deep-task-banner {
            flex-direction: column;
          }

          .reality-questions {
            gap: 1rem;
          }

          .reality-card {
            padding: 1rem;
          }

          .metric-row {
            grid-template-columns: 28px 1fr;
            gap: 0.5rem;
          }

          .metric-row .icon {
            width: 28px;
            height: 28px;
            font-size: 0.9rem;
          }

          .metric-label {
            font-size: 0.8rem;
          }

          .metric-value {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .section-pad {
            padding: 2.5rem 0 2.5rem;
          }

          .hero-2026 {
            padding: 2rem 0 1.5rem;
          }

          .hero-2026 h1 {
            font-size: clamp(1.5rem, 6vw, 2rem);
            margin-bottom: 0.5rem;
          }

          h2 {
            text-align: center;
          }

          .hero-subtitle {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }

          .hero-cta {
            flex-direction: column;
            gap: 0.6rem;
          }

          .hero-proof {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .proof-number {
            font-size: 0.95rem;
          }

          .rag-copy h2,
          .skeptic-copy h2,
          .pulse-copy h2 {
            font-size: clamp(1.3rem, 4vw, 1.8rem);
            margin-bottom: 0.75rem;
          }

          .console-body {
            padding: 0.5rem;
            gap: 0.4rem;
            height: 140px;
            overflow: hidden;
          }

          .console-line {
            font-size: 0.75rem;
          }

          .report-card {
            padding: 1rem;
          }

          .skeptic-widget {
            padding: 1rem;
          }

          .red-flags details {
            padding: 0.4rem;
          }

          .pulse-card {
            padding: 1rem;
          }

          .pulse-icon {
            font-size: 1.5rem;
          }

          .search-wrapper {
            gap: 0.5rem;
          }

          .answer-buttons {
            gap: 0.5rem;
          }

          .answer-btn {
            flex: 1;
            font-size: 0.85rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
