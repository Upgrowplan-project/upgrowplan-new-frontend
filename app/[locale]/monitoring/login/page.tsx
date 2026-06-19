"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MonitoringLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ru") ? "ru" : "en";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/monitoring-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const next =
          new URLSearchParams(window.location.search).get("next") ||
          `/${locale}/monitoring`;
        router.replace(next);
        router.refresh();
      } else if (res.status === 503) {
        setError("Доступ не настроен на сервере (MONITORING_PASSWORD).");
      } else {
        setError("Неверный пароль.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fb",
        padding: 16,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 28,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 28 }}>🔒</div>
          <h5 style={{ margin: "8px 0 2px", color: "#1e6078" }}>
            Upgrowplan Monitoring
          </h5>
          <div style={{ color: "#6c757d", fontSize: 14 }}>
            Доступ только для администратора
          </div>
        </div>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="form-control mb-3"
          style={{ borderRadius: 10 }}
        />

        {error && (
          <div className="text-danger small mb-3" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="btn w-100"
          style={{ backgroundColor: "#1e6078", color: "#fff", borderRadius: 10 }}
        >
          {busy ? "Проверка…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
