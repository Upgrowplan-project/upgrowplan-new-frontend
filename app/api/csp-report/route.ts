import { NextResponse } from "next/server";

// Receives browser CSP violation reports (Content-Security-Policy-Report-Only).
// Nothing is stored: reports are written to server logs (Vercel → Logs) so we
// can inventory real script/connect origins before switching CSP to enforce.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new NextResponse(null, { status: 413 });
    }
    let report: unknown = raw;
    try {
      report = JSON.parse(raw);
    } catch {
      // keep raw text
    }
    console.log(
      "[csp-report]",
      JSON.stringify({
        ua: request.headers.get("user-agent") ?? "",
        report,
      }),
    );
  } catch {
    // never fail the caller
  }
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return new NextResponse(null, { status: 405 });
}
