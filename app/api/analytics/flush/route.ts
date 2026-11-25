import { NextRequest, NextResponse } from "next/server";
import { QUEUE_KEY, kvCommands, postBatch, queueConfigured } from "@/lib/eventQueue";

// [25.11 · владелец «давай (а)»] Раз в сутки (vercel.json → crons) копилка просмотров и заходов ИИ-роботов уходит в мониторинг
// пачками по CHUNK. Из копилки событие удаляется только после ответа 200 мониторинга; ответ не 200 — остаётся до следующего раза.
// Новые события дописываются в конец списка, а удаляются только первые отправленные — запись во время отправки не теряется.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHUNK = 1000;
const MAX_ROUNDS = 10;
const RETRY_PAUSE_MS = 8000; // спящий мониторинг (Heroku Eco) просыпается за секунды — одна повторная попытка

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json({ ok: false, error: "CRON_SECRET is not set" }, 503);
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return json({ ok: false }, 401);
  if (!queueConfigured()) return json({ ok: true, queue: "not configured" });

  const sent = { pageviews: 0, bot_crawls: 0, unreadable: 0 };
  let rounds = 0;
  try {
    while (rounds < MAX_ROUNDS) {
      const [items] = await kvCommands([["LRANGE", QUEUE_KEY, "0", String(CHUNK - 1)]]);
      const list = Array.isArray(items) ? (items as string[]) : [];
      if (!list.length) break;
      const pageviews: Record<string, unknown>[] = [];
      const botCrawls: Record<string, unknown>[] = [];
      for (const raw of list) {
        try {
          const ev = JSON.parse(raw);
          if (ev?.kind === "pageview" && ev.data) pageviews.push(ev.data);
          else if (ev?.kind === "bot_crawl" && ev.data) botCrawls.push(ev.data);
          else sent.unreadable++;
        } catch {
          sent.unreadable++;
        }
      }
      let r = await postBatch(pageviews, botCrawls);
      if (r.status !== 200) {
        await new Promise((ok) => setTimeout(ok, RETRY_PAUSE_MS));
        r = await postBatch(pageviews, botCrawls);
      }
      if (r.status !== 200) {
        const [left] = await kvCommands([["LLEN", QUEUE_KEY]]);
        return json({ ok: false, monitoring_status: r.status, monitoring_body: r.body, sent, left }, 502);
      }
      await kvCommands([["LTRIM", QUEUE_KEY, String(list.length), "-1"]]);
      sent.pageviews += pageviews.length;
      sent.bot_crawls += botCrawls.length;
      rounds++;
    }
    const [left] = await kvCommands([["LLEN", QUEUE_KEY]]);
    return json({ ok: true, sent, rounds, left });
  } catch (e) {
    return json({ ok: false, error: String(e).slice(0, 300), sent }, 500);
  }
}
