import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SITE_ORIGIN } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const DESCRIPTION =
  "Meander — бесплатная программа для создания и прохождения текстовых квестов: визуальный редактор скриптов, ветвящиеся сюжеты, изображения и аудио. В маркете — сотни историй от авторов.";

export const metadata: Metadata = {
  // Домен задаёт один SITE_ORIGIN из src/lib/seo.ts: метаданные, canonical,
  // robots и sitemap должны ссылаться на один и тот же хост.
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Meander — текстовые квесты",
    template: "%s | Meander",
  },
  description: DESCRIPTION,
  keywords: ["текстовые квесты", "создание игр", "визуальная новелла", "редактор скриптов", "interactive fiction", "Meander"],
  authors: [{ name: "IILLUMINAT" }],
  creator: "IILLUMINAT",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_ORIGIN,
    siteName: "Meander",
    title: "Meander — текстовые квесты",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Meander — текстовые квесты",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GOOGLE_CLIENT_ID = "410112450155-828dsu9o968v0vdg2g0870ioaafoa0is.apps.googleusercontent.com";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
