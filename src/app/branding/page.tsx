"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import Footer from "@/components/Footer";

const brandingAssets = [
  {
    name: "Логотип на тёмном фоне",
    description: "PNG с прозрачным фоном",
    image: "/images/logo-dark.png",
    download: "/images/logo-dark.png",
  },
  {
    name: "Логотип SVG",
    description: "Векторный формат для любого размера",
    image: "/images/logo.svg",
    download: "/images/logo.svg",
  },
  {
    name: "Обои для рабочего стола",
    description: "1920×1080, PNG",
    image: "/images/wallpaper.png",
    download: "/images/wallpaper.png",
  },
];

export default function BrandingPage() {
  return (
    <div className="min-h-screen m3-surface">
      <header className="m3-top-app-bar">
        <div className="m3-top-app-bar-inner">
          <Link href="/" className="m3-logo">
            <img
              src="/images/logo.svg"
              alt="Meander"
              className="h-8 w-auto"
            />
          </Link>

        </div>
      </header>

      <main className="pt-24 pb-24">
        <div className="m3-container">
          <div className="text-center mb-16">
            <h1 className="m3-display-large mb-4">
              <span style={{ color: "var(--m3-primary)" }}>Брендинг</span>
            </h1>
            <p className="m3-body-large m3-text-secondary max-w-2xl mx-auto">
              Логотипы, обои и другие материалы для прессы и партнёров
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandingAssets.map((asset, index) => (
              <div
                key={index}
                className="m3-card-elevated overflow-hidden"
                style={{ padding: 0 }}
              >
                <div
                  className="aspect-video flex items-center justify-center p-8"
                  style={{ background: "var(--m3-surface-container-lowest)" }}
                >
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="m3-title-large mb-1">{asset.name}</h3>
                    <p className="m3-body-medium m3-text-secondary">
                      {asset.description}
                    </p>
                  </div>
                  <a
                    href={asset.download}
                    download
                    className="m3-btn m3-btn-filled w-full"
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                    Скачать
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 m3-card-outlined">
            <h2 className="m3-headline-medium mb-4">Использование логотипа</h2>
            <ul className="space-y-2 m3-body-medium m3-text-secondary">
              <li>• Используйте SVG версию для печати и веба</li>
              <li>• Минимальный размер: 24px в высоту</li>
              <li>• Не изменяйте цвета и пропорции логотипа</li>
              <li>• Сохраняйте достаточное пространство вокруг логотипа</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}