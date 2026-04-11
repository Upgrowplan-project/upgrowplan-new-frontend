import { ImageResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Brand colors
const C = {
  bg: "#d9ebf5",
  blue: "#0683f5",
  green: "#7dd36e",
  dark: "#01346e",
  darkMid: "#014f9e",
  white: "#ffffff",
  textSub: "#2a5a8c",
};

const features = {
  en: ["AI Business Plans", "Market Research", "Financial Modelling"],
  ru: ["ИИ Бизнес-планы", "Исследование рынка", "Финансовое моделирование"],
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const title = searchParams.get("title") ?? "Upgrowplan";
  const description =
    searchParams.get("description") ??
    "AI-powered business planning platform";
  const locale = (searchParams.get("locale") ?? "en") as "en" | "ru";

  const safeTitle = title.length > 52 ? title.slice(0, 49) + "…" : title;
  const safeDesc =
    description.length > 100 ? description.slice(0, 97) + "…" : description;

  const logoUrl = `${origin}/LogoUpGrowSmall2.png`;
  const chips = features[locale] ?? features.en;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          backgroundColor: C.bg,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "8px",
            background: `linear-gradient(90deg, ${C.blue} 0%, ${C.green} 100%)`,
          }}
        />

        {/* Decorative circle — top right */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: `${C.blue}18`,
            display: "flex",
          }}
        />
        {/* Decorative circle — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "820px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `${C.green}22`,
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "52px 80px 0 80px",
            gap: "0px",
          }}
        >
          {/* Header: logo + brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              width={52}
              height={52}
              style={{ borderRadius: "10px" }}
              alt=""
            />
            <span
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: C.dark,
                letterSpacing: "-0.3px",
              }}
            >
              Upgrowplan
            </span>

            {/* Locale badge */}
            <div
              style={{
                display: "flex",
                marginLeft: "16px",
                background: locale === "ru" ? C.blue : C.green,
                borderRadius: "6px",
                padding: "4px 12px",
                color: C.white,
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              {locale.toUpperCase()}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              width: "60px",
              height: "4px",
              background: `linear-gradient(90deg, ${C.blue}, ${C.green})`,
              borderRadius: "2px",
              marginTop: "32px",
            }}
          />

          {/* Page title */}
          <div
            style={{
              display: "flex",
              fontSize: "54px",
              fontWeight: "800",
              color: C.dark,
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
              marginTop: "20px",
              maxWidth: "950px",
            }}
          >
            {safeTitle}
          </div>

          {/* Description */}
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              color: C.textSub,
              lineHeight: "1.5",
              marginTop: "18px",
              maxWidth: "800px",
            }}
          >
            {safeDesc}
          </div>
        </div>

        {/* Bottom bar: feature chips + URL */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 80px 32px 80px",
          }}
        >
          {/* Feature chips */}
          <div style={{ display: "flex", gap: "12px" }}>
            {chips.map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: C.white,
                  border: `2px solid ${C.blue}33`,
                  borderRadius: "50px",
                  padding: "8px 20px",
                  color: C.dark,
                  fontSize: "17px",
                  fontWeight: "600",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    display: "flex",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.blue}, ${C.green})`,
                  }}
                />
                {chip}
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: C.dark,
              borderRadius: "10px",
              padding: "12px 24px",
              color: C.white,
              fontSize: "19px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          >
            upgrowplan.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
