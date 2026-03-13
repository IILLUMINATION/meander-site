import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Meander | Текстовые квесты",
  description: "Meander - бесплатная программа для создания и прохождения текстовых квестов. Визуальный редактор скриптов, ветвящиеся сюжеты, поддержка изображений и аудио.",
  keywords: ["текстовые квесты", "создание игр", "визуальная новелла", "редактор скриптов", "Meander"],
  authors: [{ name: "IILLUMINAT" }],
  creator: "IILLUMINAT",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://meander.ru",
    siteName: "Meander",
    title: "Meander | Текстовые квесты",
    description: "Бесплатная программа для создания и прохождения текстовых квестов",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Meander - Текстовые квесты",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meander | Текстовые квесты",
    description: "Бесплатная программа для создания и прохождения текстовых квестов",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Google OAuth Client ID (должен совпадать с бэкендом)
const GOOGLE_CLIENT_ID = "410112450155-828dsu9o968v0vdg2g0870ioaafoa0is.apps.googleusercontent.com";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="canonical" href="https://meander.ru" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
