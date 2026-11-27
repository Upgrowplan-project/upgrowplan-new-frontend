// [25.10 · owner «В»] the research backend and its search agent sleep on Heroku after ~30 min idle and take ~20 s +
// ~28 s to wake one after the other (prod 24.10 15:20:52 → 15:21:44: ~52 s until «Система готова»). The pages a tester
// lands on first (invite, emailed sign-in link) start that wake-up: one readiness request wakes the backend, and its
// check of the search agent wakes the agent. Fire-and-forget: no answer is awaited, any failure is ignored.
const MARKET_RESEARCH_API =
  process.env.NEXT_PUBLIC_MARKET_RESEARCH_API_URL || "http://localhost:8005";

export function wakeResearchServices(): void {
  try {
    // keepalive: the request survives the redirect to the research page that follows a sign-in
    fetch(`${MARKET_RESEARCH_API}/api/v1/agents/health`, { cache: "no-store", keepalive: true }).catch(() => {});
  } catch {
    // never let the wake-up affect the page
  }
}

// [27.11 · owner «будить сервис при отправке чекбокса про объект исследования»] the site-account service (user-service) also
// sleeps on Heroku Eco; the research start checks the account there and gave 503 «Could not verify the site account» on prod
// 27.11 04:15 (MRS waited 10.6 s, the service was up 4 s later). The object checkbox starts the object window (~10 s of model
// work + the reader's time) — enough for the service to wake. Public endpoint, no token; fire-and-forget.
const USER_API = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api").replace(/\/$/, "");

export function wakeUserService(): void {
  try {
    fetch(`${USER_API}/stats/public`, { cache: "no-store", keepalive: true }).catch(() => {});
  } catch {
    // never let the wake-up affect the page
  }
}
