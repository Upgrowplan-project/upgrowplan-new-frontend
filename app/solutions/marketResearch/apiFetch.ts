import { accessTokenSecondsLeft, refreshAccessToken } from "../../auth/refreshAccessToken";

/** Attach the signed-in site account to Market Research API calls.
 * Only attach site credentials when the production beta feature is enabled;
 * local testing keeps its current request behavior.
 *
 * [21.10 · owner] The access token lives 15 minutes; this call used it as stored, so a tester who opened the page
 * later than that got 401 «The site session is invalid or expired» (naletov@bk.ru: accepted 02:36, token expired
 * 02:51, run 03:25). Now the token is renewed BEFORE the call when it has < 60 s left (a 401 run attempt still costs a
 * validation call and a rate-limit slot), and once more after a 401 — safe: MRS checks the account before creating a
 * research or charging a run.
 */
export async function marketResearchFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const beta = process.env.NEXT_PUBLIC_MRS_BETA_ACCESS_ENFORCED === "true" && typeof window !== "undefined";
  const send = (token: string | null) => {
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };
  if (!beta) return send(null);
  let token = window.localStorage.getItem("token"); // secret-scan: allow — reads the signed-in user's session from the browser, no secret in code
  const left = accessTokenSecondsLeft(token);
  if (left !== null && left < 60) token = (await refreshAccessToken()) || token;
  const res = await send(token);
  if (res.status !== 401) return res;
  const renewed = await refreshAccessToken();
  return renewed ? send(renewed) : res;
}
