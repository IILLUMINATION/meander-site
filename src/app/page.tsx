"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
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
  Menu,
  X,
  Download,
  User,
  Star,
  ChevronRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import InfoCards from "@/components/InfoCards";

const API_URL = "/api/be";

interface Quest {
  id: string;
  title: string;
  description: string;
  author_id: string;
  author_name?: string;
  author_is_verified?: boolean;
  preview_image_url: string | null;
  like_count: number;
  dislike_count: number;
  downloads_count: number;
  average_rating: number;
  is_demo: boolean;
  estimated_playtime: number;
  created_at: string;
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topQuests, setTopQuests] = useState<Quest[]>([]);
  const [questsLoading, setQuestsLoading] = useState(true);

  useEffect(() => {
    const loadTopQuests = async () => {
      try {
        const res = await axios.get(`${API_URL}/quests`);
        const sorted = [...res.data]
          .sort((a: Quest, b: Quest) => b.downloads_count - a.downloads_count)
          .slice(0, 5);
        setTopQuests(sorted);
      } catch {
        setTopQuests([]);
      } finally {
        setQuestsLoading(false);
      }
    };
    loadTopQuests();
  }, []);

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

    const isDesktopPlatform = ["macos", "linux", "windows"].includes(platform);
    const isWideScreen = window.innerWidth >= 768;
    setIsDesktop(isDesktopPlatform && isWideScreen);

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
        { name: "RuStore", url: links.rustore, note: true },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--m3-surface)" }}>
      <header className="m3-top-app-bar">
        <nav className="m3-top-app-bar-inner justify-between">
          <Link href="/" className="m3-logo">
            <img
              src="/images/logo.svg"
              alt="Meander"
              className="h-7 md:h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link href="#features" className="m3-nav-item">Возможности</Link>
            <Link href="#download" className="m3-nav-item">Скачать</Link>
            <Link href="/market" className="m3-nav-item">Маркет</Link>
            <Link href="#gallery" className="m3-nav-item">Галерея</Link>
            <Link href="/branding" className="m3-nav-item">Брендинг</Link>
            <Link href="/docs" className="m3-nav-item">Документация</Link>
            <Link href="#roadmap" className="m3-nav-item">Roadmap</Link>
            <a href="#download" className="m3-btn m3-btn-filled ml-2">
              Скачать
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:!hidden m3-icon-button ml-auto"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

      </header>

      <div
        className={`m3-drawer-scrim md:hidden ${mobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`m3-drawer md:hidden ${mobileMenuOpen ? "is-open" : ""}`}
        aria-hidden={!mobileMenuOpen}
        aria-label="Главное меню"
      >
        <div className="m3-drawer-header">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="m3-icon-button"
            aria-label="Закрыть меню"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="m3-drawer-list">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Возможности
          </Link>
          <Link href="#download" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Скачать
          </Link>
          <Link href="/market" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Маркет
          </Link>
          <hr className="m3-drawer-divider" />
          <Link href="#gallery" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Галерея
          </Link>
          <Link href="/branding" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Брендинг
          </Link>
          <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Документация
          </Link>
          <Link href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Roadmap
          </Link>
        </nav>
        <div className="m3-drawer-footer">
          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="m3-btn m3-btn-filled w-full"
          >
            Скачать
          </a>
        </div>
      </aside>

      <section className="min-h-[calc(100svh-4rem)] md:min-h-screen flex flex-col items-center justify-center px-4 pt-14 md:pt-20 pb-8">
        <div className="text-center space-y-5 max-w-4xl">
          <h1 className="m3-display-large" style={{ color: "var(--m3-primary)" }}>
            Meander
          </h1>
          <p className="m3-headline-medium" style={{ color: "var(--m3-on-surface)" }}>
            Текстовые квесты
          </p>
          <p
            className="max-w-2xl mx-auto m3-body-large"
            style={{ color: "var(--m3-on-surface-variant)" }}
          >
            Бесплатная программа для создания и прохождения текстовых квестов.
            Визуальный редактор, ветвящиеся сюжеты и маркет историй.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <a
              href={getDownloadLink(currentPlatform)}
              className="m3-btn m3-btn-filled m3-btn-lg"
            >
              Скачать
            </a>
            <a href="#gallery" className="m3-btn m3-btn-outlined m3-btn-lg">
              Смотреть демо
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-4 md:gap-8 mt-10 md:mt-16">
          <img
            src="/images/phone-mockup-1.png"
            alt="Meander на Android"
            className="h-48 md:h-80 w-auto object-contain"
          />
          <img
            src="/images/phone-mockup-2.png"
            alt="Meander интерфейс"
            className="h-48 md:h-80 w-auto object-contain"
          />
        </div>
      </section>

      <section
        id="features"
        className="py-12 md:py-24 px-4 md:px-6"
        style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            возможности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="m3-card">
                <feature.icon
                  className="w-7 h-7 md:w-8 md:h-8 mb-3"
                  strokeWidth={1.5}
                  style={{ color: "var(--m3-primary)" }}
                />
                <h3 className="m3-title-large mb-2" style={{ color: "var(--m3-on-surface)" }}>
                  {feature.title}
                </h3>
                <p className="m3-body-medium" style={{ color: "var(--m3-on-surface-variant)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="download"
        className="py-12 md:py-24 px-4 md:px-6"
        style={{ background: "var(--m3-surface-container-lowest)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            скачать
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10">
            {platforms.map((platform) => (
              <button
                key={platform.type}
                onClick={() => setCurrentPlatform(platform.type)}
                className={`m3-chip ${currentPlatform === platform.type ? "is-selected" : ""}`}
              >
                <platform.icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          <div className="m3-download-card mb-8 md:mb-10">
            {currentPlatform === "android" ? (
              <div className="m3-download-android">
                <div className="m3-download-android-main">
                  <a
                    href={downloadLinks.android.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Скачать в Google Play"
                    style={{ display: "inline-block", lineHeight: 0 }}
                  >
                    <img
                      src="/google-play-ru.svg"
                      alt="Доступно в Google Play"
                      style={{ height: 56, width: "auto", display: "block" }}
                    />
                  </a>
                  <p
                    className="m3-body-small mt-3"
                    style={{ color: "var(--m3-on-surface-variant)" }}
                  >
                    Рекомендуемый способ установки
                  </p>
                </div>
                {isDesktop && (
                  <div className="m3-download-qr">
                    <div className="m3-download-qr-frame">
                      <QRCodeSVG
                        value={downloadLinks.android.googlePlay}
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p
                      className="m3-body-small mt-3"
                      style={{ color: "var(--m3-on-surface-variant)" }}
                    >
                      Сканируй с телефона
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="m3-download-desktop">
                <a
                  href={getDownloadLink(currentPlatform)}
                  className="m3-btn m3-btn-filled m3-btn-lg"
                >
                  <Download className="w-5 h-5" strokeWidth={1.5} />
                  <span>
                    Скачать для {platforms.find((p) => p.type === currentPlatform)?.name}
                  </span>
                </a>
                <p
                  className="m3-body-small mt-4"
                  style={{ color: "var(--m3-on-surface-variant)" }}
                >
                  Прямая загрузка с GitHub Releases
                </p>
              </div>
            )}
          </div>

          {currentPlatform === "android" && (
            <div className="m3-download-alt">
              <p
                className="m3-label-large uppercase tracking-widest mb-4"
                style={{ color: "var(--m3-on-surface-variant)", fontSize: "0.75rem" }}
              >
                Альтернативные источники
              </p>
              <div className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-3">
                {getAlternativeLinks("android").map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="m3-btn m3-btn-outlined"
                    style={link.note ? { opacity: 0.7 } : undefined}
                  >
                    {link.name}
                    {link.note && (
                      <span className="m3-body-small" style={{ color: "var(--m3-outline)" }}>
                        (старая)
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div
            className="mt-10 md:mt-14 pt-6 md:pt-8"
            style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
          >
            <a
              href="https://github.com/IILLUMINATION/meanderPUBLIC/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="m3-btn m3-btn-text"
            >
              Архив всех релизов на GitHub
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            галерея / демо
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { src: "/images/screenshot-1.jpg", alt: "Скриншот программы из Google Play" },
              { src: "/images/screenshot-2.jpg", alt: "Скриншот интерфейса" },
              { src: "/images/screenshot-3.jpg", alt: "Скриншот редактора" },
              { src: "/images/screenshot-4.jpg", alt: "Скриншот программы" },
              { src: "/images/screenshot-news.png", alt: "Новость о выходе новой версии" },
              { src: "/images/screenshot-simplex.png", alt: "Чат в Simplex" },
            ].map((shot, i) => (
              <div
                key={i}
                className="aspect-video overflow-hidden"
                style={{
                  background: "var(--m3-surface-container-lowest)",
                  borderRadius: "var(--m3-radius-lg)",
                }}
              >
                <img src={shot.src} alt={shot.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <InfoCards />

      <section
        className="py-12 md:py-24 px-4 md:px-6"
        style={{ background: "var(--m3-surface-container-lowest)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <h2
              className="m3-headline-medium tracking-widest uppercase"
              style={{ color: "var(--m3-on-surface)", fontSize: "1.125rem" }}
            >
              топ квестов
            </h2>
            <Link href="/market" className="m3-btn m3-btn-text">
              Все на маркете <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {questsLoading ? (
            <div
              className="m3-carousel-wrap"
              style={
                {
                  "--m3-big": "min(calc(100vw - 136px), 480px)",
                  "--m3-small": "56px",
                  "--m3-gap": "8px",
                  "--m3-pad": "16px",
                  "--m3-h": "min(calc(100vw - 136px), 480px)",
                } as React.CSSProperties
              }
            >
              <div className="m3-carousel-viewport" aria-hidden="true">
                <div className="m3-carousel-track">
                  <div
                    className="m3-carousel-item animate-pulse"
                    data-active="true"
                    style={{ background: "var(--m3-surface-container-high)" }}
                  />
                  <div
                    className="m3-carousel-item animate-pulse"
                    style={{ background: "var(--m3-surface-container)" }}
                  />
                  <div
                    className="m3-carousel-item animate-pulse"
                    style={{ background: "var(--m3-surface-container)" }}
                  />
                </div>
              </div>
            </div>
          ) : topQuests.length > 0 ? (
            <HeroCarousel quests={topQuests} />
          ) : (
            <div className="text-center py-12">
              <p className="m3-body-medium" style={{ color: "var(--m3-on-surface-variant)" }}>
                Пока нет квестов на маркете
              </p>
              <Link href="/market" className="m3-btn m3-btn-text mt-4">
                Станьте первым →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        id="roadmap"
        className="py-12 md:py-24 px-4 md:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            roadmap
          </h2>
          <div className="space-y-3 md:space-y-4">
            {roadmapItems.map((item, index) => (
              <div key={index} className="m3-card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <h3
                      className="m3-title-large mb-1.5"
                      style={{ color: "var(--m3-on-surface)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="m3-body-medium"
                      style={{ color: "var(--m3-on-surface-variant)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={`m3-badge self-start ${
                      item.status === "planned" ? "" : "m3-badge-primary"
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

      <Footer />
    </div>
  );
}
