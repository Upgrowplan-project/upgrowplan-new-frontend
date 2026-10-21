"use client";

import { refreshAccessToken } from "../../auth/refreshAccessToken";
import { emitBackendDown, isNetworkError, isServerDownStatus } from "@/lib/backendStatus";

// Базовые URL мониторинга.
export const MONITORING_BASE =
  process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
export const MONITORING_WS =
  process.env.NEXT_PUBLIC_MONITORING_WS_URL || "ws://localhost:8000";

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

// Тихое продление access-токена по refresh-токену (длинная сессия админа) — общая функция сайта.
const refreshToken = refreshAccessToken;

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
  let res: Response;
  try {
    res = await doFetch(getToken());
  } catch (e) {
    if (isNetworkError(e)) emitBackendDown();
    throw e;
  }
  if (isServerDownStatus(res.status)) emitBackendDown();
  if (res.status === 401) {
    const nt = await refreshToken();
    if (nt) {
      try {
        res = await doFetch(nt);
      } catch (e) {
        if (isNetworkError(e)) emitBackendDown();
        throw e;
      }
    }
  }
  return res;
}
