import { NextResponse } from "next/server";

// Server-side proxy for exchangerate-api.com so the API key never ships in the browser bundle.
// Response shape mirrors the upstream payload the Open Abroad pages already consume.
// Cached for an hour: rates change daily, and the free plan is quota-limited.
export const revalidate = 3600;

const KEY = process.env.EXCHANGERATE_API_KEY || process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY || "";

export async function GET() {
  if (!KEY) {
    return NextResponse.json({ result: "error", "error-type": "not-configured" }, { status: 503 });
  }
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${KEY}/latest/USD`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data?.result !== "success") {
      return NextResponse.json(
        { result: "error", "error-type": data?.["error-type"] ?? "upstream" },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { result: "success", base_code: "USD", conversion_rates: data.conversion_rates },
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } },
    );
  } catch {
    return NextResponse.json({ result: "error", "error-type": "unreachable" }, { status: 502 });
  }
}
