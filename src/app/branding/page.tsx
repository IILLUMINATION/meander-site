"use client";

import Link from "next/link";
import { Download } from "lucide-react";

const brandingAssets = [
  {
    name: "Логотип на тёмном фоне",
    description: "PNG с прозрачным фоном",
    image: "/images/лого на тёмном фоне.png",
    download: "/images/лого на тёмном фоне.png",
  },
  {
    name: "Логотип SVG",
    description: "Векторный формат для любого размера",
    image: "/images/лого свг без фона.svg",
    download: "/images/лого свг без фона.svg",
  },
  {
    name: "Обои для рабочего стола",
    description: "1920×1080, PNG",
    image: "/images/обои на рабочий стол пк для раздела брендинг который ты потом добавишь.png",
    download: "/images/обои на рабочий стол пк для раздела брендинг который ты потом добавишь.png",
  },
];

export default function BrandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-900">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/лого свг без фона.svg"
              alt="Meander"
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-accent transition-colors"
          >
            ← На главную
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-6">
              <span className="text-accent">Брендинг</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Логотипы, обои и другие материалы для прессы и партнёров
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brandingAssets.map((asset, index) => (
              <div
                key={index}
                className="bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-900"
              >
                <div className="aspect-video bg-neutral-950 flex items-center justify-center p-8">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{asset.name}</h3>
                    <p className="text-neutral-400 text-sm">{asset.description}</p>
                  </div>
                  <a
                    href={asset.download}
                    download
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                    Скачать
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Дополнительная информация */}
          <div className="mt-16 p-8 bg-neutral-900/50 rounded-lg border border-neutral-900">
            <h2 className="text-xl font-light mb-4">Использование логотипа</h2>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>• Используйте SVG версию для печати и веба</li>
              <li>• Минимальный размер: 24px в высоту</li>
              <li>• Не изменяйте цвета и пропорции логотипа</li>
              <li>• Сохраняйте достаточное пространство вокруг логотипа</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto text-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} IILLUMINAT. Meander. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
