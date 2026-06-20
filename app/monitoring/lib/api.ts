"use client";

import { API_BASE } from "../../apiConfig";

// Базовые URL мониторинга.
export const MONITORING_BASE =
  process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
export const MONITORING_WS =
  process.env.NEXT_PUBLIC_MONITORING_WS_URL || "ws://localhost:8000";

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

// Тихое продление access-токена по refresh-токену (длинная сессия админа).
async function refreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const rt = localStorage.getItem("refreshToken");
  if (!rt) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    if (d.token) localStorage.setItem("token", d.token);
    if (d.refreshToken) localStorage.setItem("refreshToken", d.refreshToken);
    return d.token || null;
  } catch {
    return null;
  }
}

/**
 * fetch к monitoring API с admin-Bearer токеном и авто-refresh при 401.
 * path — абсолютный путь, начиная с "/api/...".
 */
export async function monitoringFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const doFetch = (tok: string | null) => {
    const headers = new Headers(init.headers || {});
    if (tok) headers.set("Authorization", `Bearer ${tok}`);
    return fetch(`${MONITORING_BASE}${path}`, { ...init, headers });
  };
  let res = await doFetch(getToken());
  if (res.status === 401) {
    const nt = await refreshToken();
    if (nt) res = await doFetch(nt);
  }
  return res;
}
