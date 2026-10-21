"use client";

import { API_BASE } from "../apiConfig";

// The ONE silent renewal of the 15-minute access token by the 90-day refresh token, shared by the site (axios
// interceptor in authService), Monitoring and Market Research. User service ROTATES the refresh token on every use,
// so two parallel renewals would make the second one fail (and the site would sign the user out) — concurrent callers
// therefore share one in-flight request.
let inflight: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!inflight) {
    inflight = (async () => {
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
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

/** Claims of the access token (`sub` = account email, `exp`); null when unreadable. No signature check — UI hints only. */
export function accessTokenClaims(token: string | null): { sub?: string; exp?: number } | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

/** Seconds until the access token expires (from its own `exp`); null when unknown. */
export function accessTokenSecondsLeft(token: string | null): number | null {
  const exp = accessTokenClaims(token)?.exp;
  return typeof exp === "number" ? exp - Math.floor(Date.now() / 1000) : null;
}
