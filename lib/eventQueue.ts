// [25.11 · владелец «давай (а)»] Копилка событий аналитики. Каждый просмотр страницы и заход ИИ-робота раньше сразу уходил
// в мониторинг и будил его (Heroku Eco засыпает через 30 мин: 7 из 14 пробуждений за 33.7 ч 24–25.11 — просмотры). Теперь
// события копятся в Upstash Redis (Vercel Storage, переменные KV_REST_API_URL / KV_REST_API_TOKEN), а /api/analytics/flush
// раз в сутки (Vercel Cron) отправляет их в мониторинг одной пачкой. Без копилки — сразу в мониторинг, как раньше.
// Работает и в middleware (edge): только fetch, без библиотек Node.

// EVENT_QUEUE_KEY — только для проверок (отдельный список, чтобы тестовые события не ушли в мониторинг как настоящие)
export const QUEUE_KEY = process.env.EVENT_QUEUE_KEY || "up:events";
const QUEUE_MAX = 20000; // предел копилки: при долгом сбое отправки старые события вытесняются, память не растёт

type Kv = { url: string; token: string };

function kv(): Kv | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function queueConfigured(): boolean {
  return kv() !== null;
}

/** Несколько команд Redis одним запросом (Upstash REST /pipeline); ошибка любой команды — исключение. */
export async function kvCommands(cmds: string[][]): Promise<unknown[]> {
  const c = kv();
  if (!c) throw new Error("event queue is not configured");
  const r = await fetch(`${c.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`event queue HTTP ${r.status}`);
  const out = (await r.json()) as { result?: unknown; error?: string }[];
  const failed = out.find((x) => x && x.error);
  if (failed) throw new Error(`event queue: ${failed.error}`);
  return out.map((x) => x.result);
}

export type QueuedEvent =
  | { kind: "pageview"; data: Record<string, unknown> }
  | { kind: "bot_crawl"; data: Record<string, unknown> };

export async function pushEvent(ev: QueuedEvent): Promise<void> {
  await kvCommands([
    ["RPUSH", QUEUE_KEY, JSON.stringify(ev)],
    ["LTRIM", QUEUE_KEY, String(-QUEUE_MAX), "-1"],
  ]);
}

/** Пачка в мониторинг (/api/monitoring/events-batch, ключ X-Ingest-Token). Возвращает код ответа (0 — сеть / нет настроек). */
export async function postBatch(
  pageviews: Record<string, unknown>[],
  botCrawls: Record<string, unknown>[],
  timeoutMs = 25000,
): Promise<{ status: number; body: string }> {
  const base = process.env.NEXT_PUBLIC_MONITORING_API_URL;
  const token = process.env.MONITORING_INGEST_TOKEN;
  if (!base || !token) return { status: 0, body: "monitoring url or ingest token is not set" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${base.replace(/\/$/, "")}/api/monitoring/events-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Ingest-Token": token },
      body: JSON.stringify({ pageviews, bot_crawls: botCrawls }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    return { status: r.status, body: (await r.text()).slice(0, 300) };
  } catch (e) {
    return { status: 0, body: String(e).slice(0, 300) };
  } finally {
    clearTimeout(timer);
  }
}

/** Заход ИИ-робота: в копилку, без неё — сразу в мониторинг (прежний адрес /bot-crawl). Никогда не бросает. */
export async function reportBotCrawl(crawl: Record<string, unknown>): Promise<void> {
  try {
    if (queueConfigured()) {
      await pushEvent({ kind: "bot_crawl", data: crawl });
      return;
    }
    const base = process.env.NEXT_PUBLIC_MONITORING_API_URL;
    const token = process.env.MONITORING_INGEST_TOKEN;
    if (base && token) {
      await fetch(`${base.replace(/\/$/, "")}/api/monitoring/bot-crawl`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Ingest-Token": token },
        body: JSON.stringify(crawl),
      });
    }
  } catch {
    /* аналитика никогда не ломает ответ сайта */
  }
}
