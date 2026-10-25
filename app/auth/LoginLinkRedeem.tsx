"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../apiConfig";
import LoginLinkForm from "./LoginLinkForm";
import { refusalMessage, storeSession, type Locale } from "./linkMessages";
import { wakeResearchServices } from "../solutions/marketResearch/wakeResearchServices";

// [22.10] page behind the emailed one-time sign-in link (/<locale>/auth/link?token=…).
export default function LoginLinkRedeem({ locale }: { locale: Locale }) {
  const ru = locale === "ru";
  const started = useRef(false);
  const [message, setMessage] = useState(ru ? "Входим…" : "Signing you in…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    wakeResearchServices();
    const token = new URLSearchParams(window.location.search).get("token");
    // the token leaves the address bar at once: the language switch keeps path + query and would reuse a one-time link
    window.history.replaceState(null, "", window.location.pathname);
    if (!token) {
      setFailed(true);
      setMessage(refusalMessage("INVITE_INVALID", locale));
      return;
    }
    fetch(`${API_BASE}/auth/login-link/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setFailed(true);
        setMessage(refusalMessage(data.code, locale));
        return;
      }
      storeSession(data);
      setMessage(ru ? "Вы вошли. Открываем исследование…" : "You are signed in. Opening Market Research…");
      window.location.replace(`/${locale}/solutions/marketResearch`);
    }).catch(() => {
      setFailed(true);
      setMessage(ru ? "Не удалось войти. Проверьте интернет и откройте ссылку ещё раз." : "Could not sign in. Check your connection and open the link again.");
    });
  }, [locale, ru]);

  return <main className="container py-5" style={{ maxWidth: 680 }}>
    <div className={`alert ${failed ? "alert-danger" : "alert-info"}`} role="status">{message}</div>
    {failed && <LoginLinkForm locale={locale} />}
  </main>;
}
