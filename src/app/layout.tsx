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
  "Meander — бесплатная программа с открытым исходным кодом (AGPL-3.0) для создания и прохождения текстовых квестов: визуальный редактор скриптов, ветвящиеся сюжеты, изображения и аудио. Без рекламы и платных подписок. Есть на Android, iPhone, iPad и Mac в App Store, а также для Windows и Linux. В маркете — сотни историй от авторов, живое сообщество — в Telegram и ВК, сейчас идёт конкурс квестов с призовым фондом.";

export const metadata: Metadata = {
  // Домен задаёт один SITE_ORIGIN из src/lib/seo.ts: метаданные, canonical,
  // robots и sitemap должны ссылаться на один и тот же хост.
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Meander — текстовые квесты",
    template: "%s | Meander",
  },
  description: DESCRIPTION,
  keywords: ["текстовые квесты", "создание игр", "визуальная новелла", "редактор скриптов", "interactive fiction", "Meander", "открытый исходный код", "open source", "AGPL", "App Store", "iPhone", "iPad", "Mac", "macOS", "конкурс квестов", "сообщество"],
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
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* locale обязателен: без него Google берёт язык браузера, и экранный
            диктор читает невидимую iframe кнопки «Über Google anmelden». */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="ru">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
