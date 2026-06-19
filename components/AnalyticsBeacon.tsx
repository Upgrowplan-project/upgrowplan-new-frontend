"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MONITORING_URL =
  process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";

function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getId(storage: Storage, key: string): string {
  let v = storage.getItem(key);
  if (!v) {
    v = uuid();
    storage.setItem(key, v);
  }
  return v;
}

/**
 * Anonymous pageview beacon → monitoring service. No cookies, no PII.
 * Fires on every route change. Best-effort: failures are swallowed silently.
 */
export default function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Не считаем просмотры самого дашборда мониторинга.
    if (pathname && pathname.includes("/monitoring")) return;

    try {
      const visitorId = getId(window.localStorage, "up_vid");
      const sessionId = getId(window.sessionStorage, "up_sid");
      const params = new URLSearchParams(window.location.search);

      const payload = {
        path: pathname || window.location.pathname,
        url: window.location.href,
        referrer: document.referrer || null,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        visitor_id: visitorId,
        session_id: sessionId,
        locale: navigator.language || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        event_type: "pageview",
      };

      const endpoint = `${MONITORING_URL.replace(/\/$/, "")}/api/monitoring/pageview`;
      const body = JSON.stringify(payload);

      let sent = false;
      if (navigator.sendBeacon) {
        try {
          sent = navigator.sendBeacon(
            endpoint,
            new Blob([body], { type: "application/json" })
          );
        } catch {
          sent = false;
        }
      }
      if (!sent) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* beacon must never break the app */
    }
  }, [pathname]);

  return null;
}
