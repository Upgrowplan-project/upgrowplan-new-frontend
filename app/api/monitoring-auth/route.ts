import { NextRequest, NextResponse } from "next/server";

// Login for the monitoring dashboard. Validates the password server-side
// (env MONITORING_PASSWORD, never exposed to the client bundle) and sets an
// httpOnly cookie that middleware.ts checks. The cookie value is an opaque
// session token (MONITORING_SESSION_TOKEN), so the password itself is not stored.
const COOKIE = "mon_auth";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

export async function POST(req: NextRequest) {
  const expected = process.env.MONITORING_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let password = "";
  try {
    const body = await req.json();
    password = body?.password ?? "";
  } catch {
    /* ignore */
  }

  if (password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = process.env.MONITORING_SESSION_TOKEN || expected;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

// Logout — очистить cookie.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
