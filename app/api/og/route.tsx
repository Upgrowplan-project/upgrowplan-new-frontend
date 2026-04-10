import { ImageResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const title = searchParams.get("title") ?? "Upgrowplan";
  const description =
    searchParams.get("description") ??
    "AI Business Plans & Market Research";
  const locale = searchParams.get("locale") ?? "en";

  // Clamp length to avoid overflow
  const safeTitle = title.length > 60 ? title.slice(0, 57) + "…" : title;
  const safeDesc =
    description.length > 120 ? description.slice(0, 117) + "…" : description;

  const logoUrl = `${origin}/LogoUpGrowSmall2.png`;

  const isRu = locale === "ru";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #EBF8FF 0%, #F0FFF4 100%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circle — top right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "rgba(46,125,50,0.08)",
            display: "flex",
          }}
        />
        {/* Decorative circle — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "rgba(21,101,192,0.06)",
            display: "flex",
          }}
        />

        {/* Header: logo + brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            width={56}
            height={56}
            style={{ borderRadius: "8px" }}
            alt="Upgrowplan logo"
          />
          <span
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#0d1b2a",
              letterSpacing: "-0.5px",
            }}
          >
            Upgrowplan
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: "800",
              color: "#0d1b2a",
              lineHeight: "1.15",
              letterSpacing: "-1px",
            }}
          >
            {safeTitle}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#4a5568",
              lineHeight: "1.5",
              maxWidth: "900px",
            }}
          >
            {safeDesc}
          </div>
        </div>

        {/* Footer badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#2E7D32",
              borderRadius: "8px",
              padding: "10px 22px",
              color: "white",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            upgrowplan.com
          </div>
          {isRu && (
            <div
              style={{
                display: "flex",
                background: "#1565C0",
                borderRadius: "8px",
                padding: "10px 22px",
                color: "white",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              RU
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
