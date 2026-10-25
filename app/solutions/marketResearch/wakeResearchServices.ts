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
