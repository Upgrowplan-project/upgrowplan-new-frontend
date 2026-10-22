"use client";

import { useState } from "react";
import { API_BASE } from "../apiConfig";
import type { Locale } from "./linkMessages";

// [22.10] accounts from invites have no password; a one-time sign-in link to the account's email lets a tester in on
// any device. The answer is the same whether or not the address has an account (User service /auth/login-link).
export default function LoginLinkForm({ locale }: { locale: Locale }) {
  const ru = locale === "ru";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const r = await fetch(`${API_BASE}/auth/login-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });
      if (r.ok) { setState("sent"); return; }
      const data = await r.json().catch(() => ({}));
      setState("error");
      setError(data.code === "EMAIL_INVALID"
        ? (ru ? "Проверьте адрес почты." : "Please check the email address.")
        : (ru ? "Вход по ссылке сейчас недоступен. Напишите нам на info@upgrowplan.com." : "Sign-in links are unavailable right now. Please write to info@upgrowplan.com."));
    } catch {
      setState("error");
      setError(ru ? "Не удалось отправить запрос. Проверьте интернет и попробуйте ещё раз." : "Could not send the request. Check your connection and try again.");
    }
  }

  if (state === "sent") {
    return <div className="alert alert-success" role="status">
      {ru
        ? "Если для этой почты есть аккаунт, мы отправили на неё ссылку для входа. Она действует 30 минут. Письмо может оказаться в «Промоакциях» или «Спаме»."
        : "If there is an account for this email, we have sent it a sign-in link. It is valid for 30 minutes. The email may land in Promotions or Spam."}
    </div>;
  }

  return <form onSubmit={submit} className="d-flex flex-column gap-2" style={{ maxWidth: 420 }}>
    <label className="small text-muted" htmlFor="login-link-email">
      {ru ? "Войти без пароля — пришлём ссылку на почту" : "Sign in without a password — we will email you a link"}
    </label>
    <input id="login-link-email" type="email" required className="form-control" value={email}
           placeholder={ru ? "Ваша почта" : "Your email"} onChange={(e) => setEmail(e.target.value)} />
    <button type="submit" className="btn btn-outline-primary" disabled={state === "sending" || !email.trim()}>
      {state === "sending" ? (ru ? "Отправляем…" : "Sending…") : (ru ? "Получить ссылку для входа" : "Email me a sign-in link")}
    </button>
    {state === "error" && <div className="text-danger small">{error}</div>}
  </form>;
}
