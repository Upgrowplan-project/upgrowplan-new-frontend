// Единая выгрузка «Посещаемость + SEO + GEO» в один CSV.
// Сборка отделена от сети (buildSeoGeoCsv — чистая функция), чтобы её можно было
// проверить на фикстуре. Источник, который не ответил, попадает в файл строкой
// «ОШИБКА», а не пустой секцией, и возвращается в failed — UI показывает его.

import { monitoringFetch } from "./api";

type Cell = string | number | boolean | null | undefined;

export type Fetched<T = any> = { ok: true; data: T } | { ok: false; error: string };

export const reportPaths = (days: number) => ({
  analytics: `/api/monitoring/analytics?days=${days}`,
  timeseries: `/api/monitoring/visibility/timeseries?days=${days}`,
  summary: `/api/monitoring/visibility/summary`,
  googleQueries: `/api/monitoring/visibility/top?source=google&dimension=query&limit=100`,
  googlePages: `/api/monitoring/visibility/top?source=google&dimension=page&limit=50`,
  bingQueries: `/api/monitoring/visibility/top?source=bing&dimension=query&limit=50`,
  bingPages: `/api/monitoring/visibility/top?source=bing&dimension=page&limit=50`,
  geo: `/api/monitoring/geo?limit=500`,
  bots: `/api/monitoring/visibility/bot-crawls?days=${days}`,
  aiReferrals: `/api/monitoring/visibility/ai-referrals?days=${days}`,
});

export type ReportKey = keyof ReturnType<typeof reportPaths>;
export type ReportInput = Record<ReportKey, Fetched>;

const SOURCE_LABEL: Record<ReportKey, string> = {
  analytics: "Посещаемость",
  timeseries: "GSC/Bing по дням",
  summary: "GSC/Bing сводка",
  googleQueries: "Топ запросов Google",
  googlePages: "Топ страниц Google",
  bingQueries: "Топ запросов Bing",
  bingPages: "Топ страниц Bing",
  geo: "Упоминания в нейросетях",
  bots: "Визиты AI-ботов",
  aiReferrals: "Переходы из нейросетей",
};

// Лимит выборки в monitoring-service get_bot_crawls (.limit(200)).
export const BOT_EVENTS_API_CAP = 200;

const LLM_LABELS: Record<string, string> = {
  gemini: "Gemini (авто)",
  chatgpt: "ChatGPT",
  bing: "Bing Copilot",
  perplexity: "Perplexity",
  claude: "Claude",
  manual: "Другая",
};

function csvEsc(v: Cell): string {
  if (v == null) return "";
  let s = String(v);
  // Защита от CSV-инъекции: запросы GSC, пути и ответы нейросетей — внешний ввод.
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const toCsv = (headers: string[], rows: Cell[][]) =>
  [headers, ...rows].map((row) => row.map(csvEsc).join(",")).join("\n");

const pct = (v: number | null | undefined) => `${((v || 0) * 100).toFixed(2)}%`;
const pos = (v: number | null | undefined) => (v != null ? Number(v).toFixed(1) : "");
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);

export function buildSeoGeoCsv(
  input: ReportInput,
  days: number,
  now: Date
): { csv: string; failed: string[] } {
  const parts: string[] = [];
  const failed = new Set<string>();
  const stamp = now.toISOString().slice(0, 16).replace("T", " ");

  const section = (key: ReportKey, title: string, headers: string[], rows: (d: any) => Cell[][], note?: (d: any) => string | null) => {
    parts.push("", `# ${title}`);
    const src = input[key];
    if (!src.ok) {
      parts.push(`ОШИБКА: данные не получены (${src.error})`);
      failed.add(SOURCE_LABEL[key]);
      return;
    }
    const n = note?.(src.data);
    if (n) parts.push(`# ${n}`);
    const r = rows(src.data);
    parts.push(toCsv(headers, r));
    if (r.length === 0) parts.push("(нет данных)");
  };

  parts.push(`# Upgrowplan — отчёт «Посещаемость + SEO + GEO»`);
  parts.push(`# Сформирован: ${stamp} UTC; период: последние ${days} дн.`);

  // ── Посещаемость ────────────────────────────────────────────
  section("analytics", "Посещаемость — итоги за период", ["Показатель", "Значение"], (d) => [
    ["Просмотры", d?.totals?.pageviews ?? ""],
    ["Уникальные посетители", d?.totals?.unique_visitors ?? ""],
    ["Сессии", d?.totals?.sessions ?? ""],
    ["Запущено исследований", d?.funnel?.researches ?? ""],
    ["Оценок", d?.funnel?.ratings ?? ""],
  ]);
  section("analytics", "Посещаемость — по дням", ["Дата", "Просмотры", "Посетители"], (d) =>
    arr(d?.timeseries).map((p) => [p.date, p.views, p.visitors])
  );
  const top = (field: string, title: string, head: string) =>
    section("analytics", title, [head, "Просмотры"], (d) =>
      arr(d?.[field]).map((r) => [r.key || "(нет)", r.count])
    );
  top("top_pages", "Посещаемость — топ страниц", "Страница");
  top("top_sources", "Посещаемость — источники (utm_source)", "Источник");
  top("top_referrers", "Посещаемость — рефереры", "Реферер");
  top("countries", "Посещаемость — страны", "Страна");
  top("devices", "Посещаемость — устройства", "Устройство");
  top("browsers", "Посещаемость — браузеры", "Браузер");

  // ── SEO: Google Search Console + Bing ───────────────────────
  section("summary", "SEO — сводка GSC/Bing (всё накопленное окно, не период отчёта)",
    ["Источник", "Показы", "Клики", "CTR", "Обновлено"], (d) =>
      ["google", "bing"].map((s) => [
        s === "google" ? "Google" : "Bing",
        d?.[s]?.impressions ?? 0, d?.[s]?.clicks ?? 0, pct(d?.[s]?.ctr), d?.[s]?.last_fetched ?? "",
      ])
  );
  for (const [src, label] of [["google", "Google Search Console"], ["bing", "Bing Webmaster"]] as const) {
    section("timeseries", `SEO — ${label} по дням`, ["Дата", "Показы", "Клики", "CTR", "Позиция"], (d) =>
      arr(d?.[src]).map((p) => [p.date, p.impressions, p.clicks, pct(p.ctr), pos(p.position)])
    );
  }
  const searchTop = (key: ReportKey, title: string, head: string) =>
    section(key, `${title} (окно последнего скана)`, [head, "Показы", "Клики", "CTR", "Позиция"], (d) =>
      arr(d).map((r) => [r.key, r.impressions, r.clicks, pct(r.ctr), pos(r.position)])
    );
  searchTop("googleQueries", "SEO — топ запросов Google", "Запрос");
  searchTop("googlePages", "SEO — топ страниц Google", "Страница");
  searchTop("bingQueries", "SEO — топ запросов Bing", "Запрос");
  searchTop("bingPages", "SEO — топ страниц Bing", "Страница");

  // ── GEO: упоминания в нейросетях (фильтр по периоду на клиенте) ──
  const cutoff = now.getTime() - days * 86_400_000;
  const inPeriod = (it: any) => it?.created_at && new Date(it.created_at).getTime() >= cutoff;
  section("geo", "GEO — упоминания бренда по нейросетям", ["Нейросеть", "Проверок", "Упомянут", "Доля", "Ошибочных проверок"], (d) => {
    const items = arr(d?.items).filter(inPeriod);
    const errors = arr(d?.error_items).filter(inPeriod);
    const llms = Array.from(new Set([...items, ...errors].map((i) => i.llm)));
    return llms.map((llm) => {
      const own = items.filter((i) => i.llm === llm);
      const hit = own.filter((i) => i.mentioned).length;
      return [
        LLM_LABELS[llm] || llm, own.length, hit,
        own.length ? `${Math.round((hit / own.length) * 100)}%` : "",
        errors.filter((i) => i.llm === llm).length,
      ];
    });
  });
  section("geo", "GEO — проверки нейросетей", ["Дата", "Нейросеть", "Запрос", "Упомянут", "Позиция", "Способ", "Фрагмент"], (d) =>
    arr(d?.items).filter(inPeriod).map((it) => [
      String(it.created_at).slice(0, 10), LLM_LABELS[it.llm] || it.llm, it.query,
      it.mentioned ? "Да" : "Нет", it.position || "", it.auto ? "авто" : "вручную",
      (it.excerpt || "").replace(/\s+/g, " "),
    ])
  );

  // ── GEO: переходы людей по ссылкам из ответов нейросетей ────
  section("aiReferrals", "GEO — переходы из нейросетей по источникам",
    ["Нейросеть", "Визитов", "Уникальных посетителей", "Просмотров", "Страниц за визит"], (d) =>
      arr(d?.by_source).map((s) => [s.source, s.visits, s.unique_visitors, s.pageviews, s.pages_per_visit])
  );
  section("aiReferrals", "GEO — страницы, на которые ссылались нейросети", ["Страница входа", "Нейросеть", "Визитов"], (d) =>
    arr(d?.landing_pages).map((p) => [p.path, p.source, p.visits])
  );
  section("aiReferrals", "GEO — визиты из нейросетей (текст запроса нейросети не передают)",
    ["Начало", "Нейросеть", "Страница входа", "Путь по сайту", "Страниц", "Длительность, с", "Повторный",
     "Устройство", "Браузер", "ОС", "Язык", "Часовой пояс", "Страна", "utm_source", "Реферер", "URL входа"], (d) =>
      arr(d?.visits).map((v) => [
        v.started_at, v.source, v.landing_path, arr(v.pages).join(" > "), v.pages_count,
        v.pages_count > 1 ? v.duration_sec : "", v.returning_visitor ? "да" : "нет",
        v.device_type, v.browser, v.os, v.locale, v.timezone, v.country, v.utm_source, v.referrer, v.landing_url,
      ])
  );

  // ── GEO: визиты AI-краулеров ────────────────────────────────
  const capNote = (d: any) =>
    (d?.total_events ?? 0) >= BOT_EVENTS_API_CAP
      ? `ВНИМАНИЕ: API считает не более ${BOT_EVENTS_API_CAP} последних событий — итоги за период могут быть занижены`
      : null;
  section("bots", "GEO — визиты AI-ботов по ботам", ["Бот", "Визитов"], (d) =>
    [["Всего", d?.total_events ?? 0], ...Object.entries(d?.by_bot || {}).sort((a: any, b: any) => b[1] - a[1]) as Cell[][]],
    capNote
  );
  section("bots", "GEO — визиты AI-ботов по страницам", ["Страница", "Боты", "Визитов", "Первый визит", "Последний визит", "Дней до обнаружения"], (d) =>
    arr(d?.by_page).map((p) => [p.path, arr(p.bots).join(" "), p.count, p.first_crawl, p.last_crawl, p.days_to_first_crawl ?? ""]),
    capNote
  );
  section("bots", "GEO — последние визиты AI-ботов", ["Когда", "Бот", "Страница"], (d) =>
    arr(d?.recent_events).map((e) => [e.crawled_at, e.bot_name, e.url_path])
  );

  return { csv: parts.join("\n"), failed: Array.from(failed) };
}

async function fetchJson(path: string): Promise<Fetched> {
  try {
    const res = await monitoringFetch(path);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true, data: await res.json() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Скачивает отчёт; возвращает источники, которые не ответили (пусто = всё получено). */
export async function downloadSeoGeoReport(days: number): Promise<string[]> {
  const paths = reportPaths(days);
  const keys = Object.keys(paths) as ReportKey[];
  const results = await Promise.all(keys.map((k) => fetchJson(paths[k])));
  const input = Object.fromEntries(keys.map((k, i) => [k, results[i]])) as ReportInput;

  const now = new Date();
  const { csv, failed } = buildSeoGeoCsv(input, days, now);
  if (failed.length === keys.length) {
    throw new Error("Ни один источник не ответил — файл не сформирован");
  }

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-geo-report-${now.toISOString().slice(0, 10)}-${days}d.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return failed;
}
