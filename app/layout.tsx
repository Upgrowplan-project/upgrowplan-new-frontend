// Root layout - required by Next.js
// The actual localized layout is in app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title:
    "Upgrowplan | Business plans, Financial models, Analytics, Market research",
  description: "Upgrowplan — future planning service",
  icons: {
    icon: "/favicon.ico",
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
      <body className={`${inter.variable} antialiased`}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
