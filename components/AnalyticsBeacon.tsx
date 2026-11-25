"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

function analyticsUrl(raw: string, keepUtm: boolean): string | null {
  try {
    const url = new URL(raw, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const safeParams = new URLSearchParams();
    if (keepUtm) {
      url.searchParams.forEach((value, key) => {
        const normalized = key.toLowerCase();
        if (normalized.startsWith("utm_") || ["gclid", "msclkid", "fbclid"].includes(normalized)) {
          safeParams.append(key, value);
        }
      });
    }
    url.search = safeParams.toString();
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Anonymous pageview beacon → this site's /api/track (queued, sent to monitoring once a day — app/api/analytics/flush).
 * No cookies, no PII. Fires on every route change. Best-effort: failures are swallowed silently.
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
        // Keep only campaign attribution. Invite/auth/query tokens must never
        // leave the browser through the anonymous analytics beacon.
        url: analyticsUrl(window.location.href, true),
        referrer: document.referrer ? analyticsUrl(document.referrer, false) : null,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        visitor_id: visitorId,
        session_id: sessionId,
        locale: navigator.language || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        event_type: "pageview",
      };

      const endpoint = "/api/track";
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
