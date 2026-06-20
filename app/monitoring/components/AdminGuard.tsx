"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserProfile } from "@/app/auth/authService";

/**
 * Пускает на страницу мониторинга только администратора (role === ADMIN),
 * проверяя профиль через user-service. Не-залогиненных шлёт на /auth,
 * залогиненных не-админов — на главную.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRu = pathname.startsWith("/ru");
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace(isRu ? "/ru/auth" : "/auth");
      return;
    }
    let cancelled = false;
    getUserProfile()
      .then((p) => {
        if (cancelled) return;
        if (p?.role === "ADMIN") {
          setState("ok");
        } else {
          setState("denied");
          router.replace(isRu ? "/ru" : "/");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState("denied");
        router.replace(isRu ? "/ru/auth" : "/auth");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "ok") return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6c757d",
      }}
    >
      {state === "denied" ? "Доступ только для администратора…" : "Проверка доступа…"}
    </div>
  );
}
