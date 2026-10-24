"use client";

import { useEffect, useState } from "react";
import { accessTokenClaims } from "../app/auth/refreshAccessToken";

/**
 * [24.10 · владелец] Одна проверка «админ ли» для шапки и мобильного меню (пункт «Мониторинг»): в мобильном меню
 * пункта не было — список был статичным, проверка роли жила только в Header.
 * Кэш в сессии привязан к аккаунту (email из токена): вход по ссылке-приглашению меняет аккаунт в той же вкладке —
 * прежний кэш «админ» показывал тестеру пункт «Мониторинг» (21.10). Другой аккаунт → роль спрашивается заново.
 * Страница и API мониторинга защищены отдельно — это только видимость пункта.
 */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let token: string | null = null;
    try {
      token = localStorage.getItem("token"); // secret-scan: allow — reads the signed-in user's session from the browser, no secret in code (owner 14.10)
    } catch {
      token = null;
    }
    if (!token) {
      setIsAdmin(false);
      try {
        sessionStorage.removeItem("up_is_admin");
      } catch {
        /* ignore */
      }
      return;
    }
    const account = accessTokenClaims(token)?.sub || "";
    try {
      const cached = sessionStorage.getItem("up_is_admin");
      if (cached !== null && cached.startsWith(`${account}|`)) {
        setIsAdmin(cached.endsWith("|1"));
        return;
      }
    } catch {
      /* ignore */
    }
    let cancelled = false;
    import("../app/auth/authService")
      .then((m) => m.getUserProfile())
      .then((p) => {
        const admin = p?.role === "ADMIN";
        if (!cancelled) setIsAdmin(admin);
        try {
          sessionStorage.setItem("up_is_admin", `${account}|${admin ? "1" : "0"}`);
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return isAdmin;
}
