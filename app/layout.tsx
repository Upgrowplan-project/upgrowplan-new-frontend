// Root layout - required by Next.js
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Script from "next/script";
import MobileNavWrapper from "@/components/MobileNavLayout";
import AOSWrapper from "./AOSWrapper";

// CSS here covers ALL pages including English routes (non-prefixed /solutions/... etc.)
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default:
      "Upgrowplan — AI Business Plan Generator with Market Validation, Synthetic Respondents & Financial Model",
    template: "%s | Upgrowplan",
  },
  description:
    "AI business plan generator that validates before it generates: synthetic respondent testing, live market research from 50+ sources, UNIDO/EBRD investor-ready plan, Python financial model — Skeptic Agent verified, no hallucinations.",
  metadataBase: new URL("https://www.upgrowplan.com"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "Upgrowplan",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Upgrowplan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params?: { locale?: string };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const locale = params?.locale || "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <AOSWrapper />
        <MobileNavWrapper>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        </MobileNavWrapper>
        <Footer />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
