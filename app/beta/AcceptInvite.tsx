"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../apiConfig";
import LoginLinkForm from "../auth/LoginLinkForm";
import { refusalMessage, storeSession } from "../auth/linkMessages";
import { wakeResearchServices } from "../solutions/marketResearch/wakeResearchServices";

export default function AcceptInvite({ locale }: { locale: "en" | "ru" }) {
  const router = useRouter();
  const started = useRef(false);
  const [message, setMessage] = useState(locale === "ru" ? "Проверяем приглашение…" : "Checking your invitation…");
  const [failed, setFailed] = useState(false);
  // [17.10 · владелец] после активации — короткая памятка тестера (вместо автоперехода через 1.6 с)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    wakeResearchServices();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    // [20.10] после активации токен убирается из адреса (?accepted=1): переключатель языка в шапке сохраняет путь и
    // параметры — с токеном страница активировала бы одноразовую ссылку повторно и показала «приглашение недействительно»
    if (!token && params.get("accepted") === "1" && localStorage.getItem("token")) {
      setMessage(locale === "ru" ? "Доступ активирован." : "Access activated.");
      setReady(true);
      return;
    }
    if (!token) {
      setFailed(true);
      setMessage(locale === "ru" ? "В ссылке нет токена приглашения." : "The invitation link is missing its token.");
      return;
    }
    let active = true;
    fetch(`${API_BASE}/auth/beta/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      // [22.10 · prod] the tester's link was used on his phone, not expired — the page names the reason (User service code)
      if (!response.ok) throw new Error(refusalMessage(data.code, locale));
      storeSession(data);
      window.history.replaceState(null, "", `${window.location.pathname}?accepted=1`);
      if (active) {
        setMessage(locale === "ru"
          ? `Доступ активирован. Доступно запусков исследования: ${data.marketResearchRunsRemaining ?? 0}.`
          : `Access activated. Market Research runs available: ${data.marketResearchRunsRemaining ?? 0}.`);
        setReady(true);
      }
    }).catch((error) => {
      if (!active) return;
      setFailed(true);
      setMessage(error instanceof Error ? error.message : (locale === "ru" ? "Не удалось принять приглашение." : "Could not accept the invitation."));
    });
    return () => { active = false; };
  }, [locale, router]);

  return <main className="container py-5" style={{ maxWidth: 680 }}>
    <div className={`alert ${failed ? "alert-danger" : ready ? "alert-success" : "alert-info"}`} role="status">{message}</div>
    {failed && <LoginLinkForm locale={locale} />}
    {ready && (locale === "ru" ? (
      <div>
        <h2 className="h5 mt-3">Как проходит бета-тест</h2>
        <ol>
          <li>В бета-версии лучше выбирать <b>цифровые продукты</b> (SaaS, приложения, платформы); остальные отрасли — в следующем релизе, но попробовать можно. Чем точнее описание продукта, тем точнее конкуренты.</li>
          <li><b>Страна</b> — где зарегистрирована ваша компания: рынок цифрового продукта считается глобальным.</li>
          <li><b>Сколько клиентов в день будет у вашего бизнеса</b> — необязательно, но без этого числа достижимый объём рынка не будет посчитан. Средний чек цифрового продукта указывайте в долларах ($).</li>
          <li>Исследование готовится 15–40 минут. Документ DOCX можно скачать сразу на странице результата; он сохраняется и в «Истории исследований» в личном кабинете.</li>
          <li>После генерации на странице появится короткая оценка отчёта — пожалуйста, заполните её. В комментарии напишите: верны ли конкуренты, похожи ли цены, нашли ли вы ошибку или число без источника.</li>
          <li>Все цифры в отчёте — со ссылкой на источник или с пометкой «допущение» / «не измерено». Если источник не ответил, в отчёте будет «поиск не выполнен».</li>
          <li>Ссылка из приглашения одноразовая. Чтобы войти на другом устройстве или в другом браузере: «Войти» → «Получить ссылку для входа» — пришлём новую ссылку на вашу почту.</li>
        </ol>
        <button className="btn btn-primary" onClick={() => router.replace(`/${locale}/solutions/marketResearch`)}>Перейти к исследованию</button>
      </div>
    ) : (
      <div>
        <h2 className="h5 mt-3">How the beta test works</h2>
        <ol>
          <li>In the beta, <b>digital products</b> (SaaS, apps, platforms) are the better choice; other industries come in the next release, but you can try them. The more precise the product description, the more precise the competitors.</li>
          <li><b>Country</b> — where your company is registered: a digital product market is treated as global.</li>
          <li><b>How many customers per day your business will have</b> — optional, but without it the obtainable market volume will not be calculated. For a digital product give the average check in US dollars ($).</li>
          <li>A study takes 15–40 minutes. The DOCX can be downloaded right on the result page; it is also kept in “Research history” in your account.</li>
          <li>After generation a short report rating appears on the page — please fill it in. In the comment, tell us whether the competitors are right, the prices look real, and whether you found an error or a number without a source.</li>
          <li>Every number in the report has a source link or is marked “assumption” / “not measured”. If a source did not respond, the report says “search not performed”.</li>
          <li>The invitation link is one-time. To sign in on another device or browser: “Sign in” → “Email me a sign-in link” — we will send a new link to your email.</li>
        </ol>
        <button className="btn btn-primary" onClick={() => router.replace(`/${locale}/solutions/marketResearch`)}>Go to Market Research</button>
      </div>
    ))}
  </main>;
}
