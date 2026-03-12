"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  LayoutGrid,
  GitBranch,
  Image,
  Save,
  Globe,
  Package,
  Smartphone,
  Laptop,
  Monitor,
  Terminal,
  MonitorPlay,
  Send,
  Youtube,
  MessageSquare,
  Shield,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Визуальный редактор скриптов",
    description: "Создавайте квесты без написания кода. Интуитивный интерфейс для построения логики.",
  },
  {
    icon: GitBranch,
    title: "Ветвящиеся сюжеты",
    description: "Условия, выборы и множественные концовки. Полная свобода творчества.",
  },
  {
    icon: Image,
    title: "Мультимедиа",
    description: "Поддержка изображений, аудио и кастомных шрифтов для атмосферы.",
  },
  {
    icon: Save,
    title: "Сохранения",
    description: "Автосохранения и слоты сохранений. Без рекламы и ограничений.",
  },
  {
    icon: Globe,
    title: "Маркет квестов",
    description: "Публикуйте свои истории и проходите чужие. Лайки, подписки, отзывы.",
  },
  {
    icon: Package,
    title: "Открытый формат",
    description: "Экспорт/импорт в .mnd. Формат полностью открытый, можно править вручную.",
  },
];

const platforms = [
  { name: "Android", icon: Smartphone, type: "android" },
  { name: "iOS", icon: Laptop, type: "ios" },
  { name: "macOS", icon: MonitorPlay, type: "macos" },
  { name: "Linux", icon: Terminal, type: "linux" },
  { name: "Windows", icon: Monitor, type: "windows" },
];

const downloadLinks = {
  android: {
    googlePlay: "https://play.google.com/store/apps/details?id=com.IILLUMINAT.meadner",
    github: "https://github.com/IILLUMINATION/meanderPUBLIC/releases/download/2.7.7%2B208/Release.Android.apk",
    apkpure: "https://apkpure.com/ru/meander-%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B5-%D0%BA%D0%B2%D0%B5%D1%81%D1%82%D1%8B/com.IILLUMINAT.meadner",
    trashbox: "https://trashbox.ru/topics/185703/meander-tekstovye-kvesty-1.0.1",
    rustore: "https://www.rustore.ru/catalog/app/com.IILLUMINAT.meadner",
  },
  ios: {
    github: "https://github.com/IILLUMINATION/meanderPUBLIC/releases/download/2.7.7%2B208/Release.iOs.ipa",
  },
  macos: {
    github: "https://github.com/IILLUMINATION/meanderPUBLIC/releases/download/2.7.7%2B208/Release.Macos.zip",
  },
  linux: {
    github: "https://github.com/IILLUMINATION/meanderPUBLIC/releases/download/2.7.7%2B208/Release.Linux.zip",
  },
  windows: {
    github: "https://github.com/IILLUMINATION/meanderPUBLIC/releases/download/2.7.7%2B208/Release.Windows.zip",
  },
};

const roadmapItems = [
  {
    title: "Поддержка Lua",
    description: "Возможность написания скриптов на Lua для продвинутой логики",
    status: "planned",
  },
];

const socialLinks = [
  { name: "Telegram канал", url: "https://t.me/meanderRU", icon: Send },
  { name: "YouTube", url: "https://www.youtube.com/@meanderRU", icon: Youtube },
  { name: "Форум в TG", url: "https://t.me/mndForum", icon: MessageSquare },
  { name: "Simplex чат", url: "https://smp10.simplex.im/g#tFj94ScyihNimJ1Nga7AXylCi7ebUvi9fsa-oxlwr4s", icon: Shield },
  { name: "Boosty", url: "https://boosty.to/iilluminat/posts/8e4bc65c-f106-4560-b158-973d6e8a65f6", icon: Heart },
];

export default function Home() {
  const [currentPlatform, setCurrentPlatform] = useState("android");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const detectPlatform = () => {
      const ua = navigator.userAgent;
      if (/android/i.test(ua)) {
        return "android";
      } else if (/iPad|iPhone|iPod/.test(ua)) {
        return "ios";
      } else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) {
        return "macos";
      } else if (/Linux/.test(ua)) {
        return "linux";
      } else if (/Windows/.test(ua)) {
        return "windows";
      }
      return "android";
    };

    const platform = detectPlatform();
    setDetectedPlatform(platform);
    setCurrentPlatform(platform);
    
    // Показываем QR только на десктопных платформах И на широком экране
    const isDesktopPlatform = ["macos", "linux", "windows"].includes(platform);
    const isWideScreen = window.innerWidth >= 768;
    setIsDesktop(isDesktopPlatform && isWideScreen);
    
    // Обновляем при изменении размера окна
    const handleResize = () => {
      setIsDesktop(isDesktopPlatform && window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDownloadLink = (platform: string) => {
    if (platform === "android") {
      return downloadLinks.android.googlePlay;
    }
    if (platform === "ios") {
      return downloadLinks.ios.github;
    }
    if (platform === "macos") {
      return downloadLinks.macos.github;
    }
    if (platform === "linux") {
      return downloadLinks.linux.github;
    }
    if (platform === "windows") {
      return downloadLinks.windows.github;
    }
    return downloadLinks.android.github;
  };

  const getAlternativeLinks = (platform: string) => {
    if (platform === "android") {
      const links = downloadLinks.android;
      return [
        { name: "GitHub (APK)", url: links.github },
        { name: "APKPure", url: links.apkpure },
        { name: "TrashBox", url: links.trashbox },
        { name: "RuStore (старая версия)", url: links.rustore, note: true },
      ];
    }
    return [];
  };

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
          <div className="flex items-center gap-8">
            <ul className="flex gap-6 text-sm text-neutral-400 hidden md:flex">
              <li>
                <Link href="#features" className="hover:text-accent transition-colors">
                  Возможности
                </Link>
              </li>
              <li>
                <Link href="#download" className="hover:text-accent transition-colors">
                  Скачать
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="hover:text-accent transition-colors">
                  Галерея
                </Link>
              </li>
              <li>
                <Link href="/branding" className="hover:text-accent transition-colors">
                  Брендинг
                </Link>
              </li>
              <li>
                <Link href="#roadmap" className="hover:text-accent transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
            <a
              href="#download"
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-black text-sm font-medium rounded-lg transition-colors"
            >
              Скачать
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-light tracking-wider">
            <span className="text-accent">Meander</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-neutral-300">
            Текстовые квесты
          </p>
          <p className="max-w-2xl mx-auto text-neutral-400 leading-relaxed text-lg">
            Бесплатная программа для создания и прохождения текстовых квестов.
            Визуальный редактор, ветвящиеся сюжеты и маркет историй.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href={getDownloadLink(currentPlatform)}
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors text-lg"
            >
              Скачать
            </a>
            <Link
              href="#gallery"
              className="px-8 py-4 border border-neutral-700 hover:border-neutral-500 transition-colors rounded-lg text-lg"
            >
              Смотреть демо
            </Link>
          </div>
        </div>
        
        {/* Мокапы телефонов */}
        <div className="flex justify-center gap-8 mt-16">
          <img
            src="/images/мокап телефон с мокапом из гугл плей но именно телефон без фона.png"
            alt="Meander на Android"
            className="h-64 md:h-80 w-auto object-contain"
          />
          <img
            src="/images/мокап телефон с мокапом из гугл плей но именно телефон без фона 2.png"
            alt="Meander интерфейс"
            className="h-64 md:h-80 w-auto object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-light tracking-widest mb-12 text-center">
            возможности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-neutral-900/50 rounded-lg hover:bg-neutral-900 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-accent mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 px-6 bg-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-widest mb-12">
            скачать
          </h2>
          
          {/* Platform selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.type}
                onClick={() => setCurrentPlatform(platform.type)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  currentPlatform === platform.type
                    ? "bg-accent text-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-foreground"
                }`}
              >
                <platform.icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Main download button */}
          <div className="flex flex-col items-center gap-12 mb-12">
            <a
              href={getDownloadLink(currentPlatform)}
              className="inline-block px-12 py-5 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors text-lg"
            >
              Скачать для {platforms.find(p => p.type === currentPlatform)?.name}
            </a>

            {/* QR Code для Google Play на десктопе */}
            {isDesktop && (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG
                    value={downloadLinks.android.googlePlay}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-center text-neutral-500 text-sm mt-4">
                  или скачайте на Android
                </p>
              </div>
            )}
          </div>

          {/* Alternative links for Android */}
          {currentPlatform === "android" && (
            <div className="space-y-3 text-sm">
              <p className="text-neutral-500">Другие источники:</p>
              <div className="flex flex-wrap justify-center gap-4">
                {getAlternativeLinks("android").map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className={`text-neutral-400 hover:text-accent transition-colors ${
                      link.note ? "text-neutral-600" : ""
                    }`}
                  >
                    {link.name} {link.note && "(старая версия)"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* GitHub releases */}
          <div className="mt-12 pt-8 border-t border-neutral-900">
            <a
              href="https://github.com/IILLUMINATION/meanderPUBLIC/releases"
              className="text-neutral-400 hover:text-accent transition-colors text-sm"
            >
              → Архив всех релизов на GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Gallery/Demo Section */}
      <section id="gallery" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-light tracking-widest mb-12 text-center">
            галерея / демо
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video bg-neutral-950 rounded-lg overflow-hidden">
              <img
                src="/images/мокап программы из гугл плей красивый(не реальный скрин).jpg"
                alt="Скриншот программы из Google Play"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-neutral-950 rounded-lg overflow-hidden">
              <img
                src="/images/мокап программы из гугл плей красивый(не реальный скрин) 2.jpg"
                alt="Скриншот интерфейса"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-neutral-950 rounded-lg overflow-hidden">
              <img
                src="/images/мокап программы из гугл плей красивый(не реальный скрин) 3.jpg"
                alt="Скриншот редактора"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-neutral-950 rounded-lg overflow-hidden">
              <img
                src="/images/мокап программы из гугл плей красивый(не реальный скрин) 4.jpg"
                alt="Скриншот программы"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-neutral-950 rounded-lg overflow-hidden">
              <img
                src="/images/мокап новость о выходе новой версии.png"
                alt="Новость о выходе новой версии"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-neutral-950 rounded-lg overflow-hidden">
              <img
                src="/images/мокап о создании чата в simplex.png"
                alt="Чат в Simplex"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 px-6 bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light tracking-widest mb-12 text-center">
            roadmap
          </h2>
          <div className="space-y-4">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-neutral-900 rounded-lg border border-neutral-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-neutral-400 text-sm">{item.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-lg ${
                      item.status === "planned"
                        ? "bg-neutral-800 text-neutral-400"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {item.status === "planned" ? "Запланировано" : "В работе"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section id="links" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light tracking-widest mb-12">
            ссылки
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 hover:border-accent/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto text-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} IILLUMINAT. Meander. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
