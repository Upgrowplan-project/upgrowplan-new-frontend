"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../apiConfig";
import { marketResearchFetch } from "./apiFetch";

/** [21.10 · owner] Beta panel on the Market Research page: «beta testing · runs left N». Rendered outside the form and
 *  the result blocks, so it stays for the whole cycle (form → progress → result). `refreshKey` changes when a research
 *  starts or its status changes — the count is re-read after the charge and after a refund of a failed run. */
export default function BetaRunsPanel({ locale, refreshKey }: { locale: "ru" | "en"; refreshKey: string }) {
  const enabled = process.env.NEXT_PUBLIC_MRS_BETA_ACCESS_ENFORCED === "true";
  const [state, setState] = useState<{ signedIn: boolean; admin: boolean; runs: number | null }>({ signedIn: true, admin: false, runs: null });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (!localStorage.getItem("token")) {
      setState({ signedIn: false, admin: false, runs: null });
      return;
    }
    let active = true;
    (async () => {
      try {
        const me = await marketResearchFetch(`${API_BASE}/users/me`);
        if (me.status === 401) {
          if (active) setState({ signedIn: false, admin: false, runs: null });
          return;
        }
        const role = String((await me.json().catch(() => ({})))?.role || "").toUpperCase();
        const ba = await marketResearchFetch(`${API_BASE}/users/me/beta-access`);
        const runs = ba.ok ? Number((await ba.json())?.marketResearchRunsRemaining ?? 0) : null;
        if (active) setState({ signedIn: true, admin: role === "ADMIN", runs });
      } catch {
        // the panel is informational — the run itself is still checked by the service
      }
    })();
    return () => { active = false; };
  }, [enabled, refreshKey]);

  if (!enabled) return null;
  const ru = locale === "ru";
  let text: string;
  if (!state.signedIn) {
    text = ru ? "Бета-тестирование · войдите по ссылке из приглашения, чтобы запустить исследование."
              : "Beta testing · sign in via your invitation link to run a study.";
  } else if (state.admin) {
    text = ru ? "Бета-тестирование · администратор: запуски не списываются." : "Beta testing · administrator: runs are not charged.";
  } else if (state.runs === null) {
    text = ru ? "Бета-тестирование · проверяем доступные запуски…" : "Beta testing · checking your runs…";
  } else {
    text = ru ? `Бета-тестирование · осталось запусков исследования: ${state.runs}` : `Beta testing · Market Research runs left: ${state.runs}`;
  }
  return (
    <div role="status" style={{ maxWidth: 960, margin: "1rem auto 0", padding: "0.75rem 1rem", borderRadius: 8,
      background: "#eef6f8", border: "1px solid #b9dbe3", color: "#176b83", fontWeight: 500 }}>
      {text}
    </div>
  );
}
