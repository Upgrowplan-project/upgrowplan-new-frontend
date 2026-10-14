/** Attach the signed-in site account to Market Research API calls.
 * Only attach site credentials when the production beta feature is enabled;
 * local testing keeps its current request behavior.
 */
export function marketResearchFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (process.env.NEXT_PUBLIC_MRS_BETA_ACCESS_ENFORCED === "true" && typeof window !== "undefined") {
    const token = window.localStorage.getItem("token"); // secret-scan: allow — reads the signed-in user's session from the browser, no secret in code
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
}
