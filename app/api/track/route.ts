import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { postBatch, pushEvent, queueConfigured } from "@/lib/eventQueue";

// [25.11 · владелец «давай (а)»] Просмотр страницы с этого же сайта (components/AnalyticsBeacon.tsx) → копилка
// (lib/eventQueue.ts), в мониторинг — пачкой раз в сутки. Страна, браузер и отпечаток IP считаются здесь — той же формулой,
// что в мониторинге (_hash_ip: sha256 «upgrowplan-salt::<ip>», первые 32 знака), поэтому подсчёт посетителей не разъезжается.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = [
  "path", "url", "referrer", "utm_source", "utm_medium", "utm_campaign",
  "visitor_id", "session_id", "locale", "timezone", "event_type", "event_name",
];
const BODY_MAX = 8000;

function hashIp(ip: string): string | null {
  return ip ? createHash("sha256").update(`upgrowplan-salt::${ip}`).digest("hex").slice(0, 32) : null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > BODY_MAX) return new NextResponse(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!body || typeof body.path !== "string" || !body.path) return new NextResponse(null, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const k of FIELDS) {
    const v = body[k];
    if (typeof v === "string") data[k] = v.slice(0, 1024);
  }
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.ip || "";
  data.ip_hash = hashIp(ip);
  data.country = req.headers.get("x-vercel-ip-country") || null;
  data.user_agent = (req.headers.get("user-agent") || "").slice(0, 1000);
  data.created_at = new Date().toISOString();

  try {
    if (queueConfigured()) await pushEvent({ kind: "pageview", data });
    else await postBatch([data], []); // копилка не подключена — сразу, как раньше
  } catch {
    /* аналитика никогда не ломает сайт */
  }
  return new NextResponse(null, { status: 204 });
}
