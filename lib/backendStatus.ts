/**
 * Backend availability detection.
 * Fires a window CustomEvent when any backend is unreachable so the global
 * ServerDownBanner can surface it without coupling individual components.
 */

export function emitBackendDown(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("backend-unavailable"));
  }
}

/** True when the error is a network-level failure (server not reachable at all). */
export function isNetworkError(e: unknown): boolean {
  if (!(e instanceof TypeError)) return false;
  const msg = e.message.toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("load failed")
  );
}

/** True for HTTP statuses that indicate a downed/overloaded server. */
export function isServerDownStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504 || status === 521 || status === 522;
}

/**
 * Wraps a fetch call. Emits `backend-unavailable` on network error or 5xx.
 * Re-throws so callers can still handle errors locally.
 */
export async function fetchWithDownDetect(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    const res = await fetch(input, init);
    if (isServerDownStatus(res.status)) {
      emitBackendDown();
    }
    return res;
  } catch (e) {
    if (isNetworkError(e)) emitBackendDown();
    throw e;
  }
}
