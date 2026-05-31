"use client";

import React from "react";
import Link from "next/link";
import { Send, Youtube, MessageSquare, Shield, Heart } from "lucide-react";

const socialLinks = [
  { name: "Telegram канал", url: "https://t.me/meanderRU", icon: Send },
  { name: "YouTube", url: "https://www.youtube.com/@meanderRU", icon: Youtube },
  { name: "Форум в TG", url: "https://t.me/mndForum", icon: MessageSquare },
  { name: "Simplex чат", url: "https://smp10.simplex.im/g#tFj94ScyihNimJ1Nga7AXylCi7ebUvi9fsa-oxlwr4s", icon: Shield },
  { name: "Boosty", url: "https://boosty.to/iilluminat/posts/8e4bc65c-f106-4560-b158-973d6e8a65f6", icon: Heart },
];

const downloadLinks = {
  android: {
    googlePlay: "https://play.google.com/store/apps/details?id=com.IILLUMINAT.meadner",
    github: "https://github.com/IILLUMINATION/meanderPUBLIC/releases/download/2.7.7%2B208/Release.Android.apk",
  },
};

interface FooterProps {
  bgColor?: string;
}

export default function Footer({ bgColor }: FooterProps = {}) {
  const customStyle = bgColor
    ? ({ "--m3-footer-bg": bgColor } as React.CSSProperties)
    : undefined;
  return (
    <footer className="m3-footer-main" style={customStyle}>
      <div className="m3-footer-fade" aria-hidden="true" />
      <div className="m3-footer-wave" aria-hidden="true">
        <svg
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 12 Q 12.5 4 25 12 T 50 12 T 75 12 T 100 12 T 125 12 T 150 12 T 175 12 T 200 12 T 225 12 T 250 12 T 275 12 T 300 12 T 325 12 T 350 12 T 375 12 T 400 12 T 425 12 T 450 12 T 475 12 T 500 12 T 525 12 T 550 12 T 575 12 T 600 12 T 625 12 T 650 12 T 675 12 T 700 12 T 725 12 T 750 12 T 775 12 T 800 12 T 825 12 T 850 12 T 875 12 T 900 12 T 925 12 T 950 12 T 975 12 T 1000 12 T 1025 12 T 1050 12 T 1075 12 T 1100 12 T 1125 12 T 1150 12 T 1175 12 T 1200 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="m3-footer-inner">
        <div className="m3-footer-grid">
          <div className="m3-footer-brand">
            <Link href="/" className="m3-footer-brand-logo" aria-label="Meander">
              <img src="/images/logo.svg" alt="" />
              <span className="m3-footer-brand-name">Meander</span>
            </Link>
            <p className="m3-footer-brand-text">
              Meander - бесплатная программа для создания и прохождения текстовых квестов.
              Открытый формат .mnd, без рекламы и ограничений.
            </p>
          </div>

          <div className="m3-footer-section">
            <p className="m3-footer-section-title">Сообщество</p>
            <div className="m3-footer-socials">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-footer-social-item"
                  aria-label={link.name}
                >
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="m3-footer-section">
            <p className="m3-footer-section-title">Скачать</p>
            <div className="m3-footer-socials">
              <a
                href={downloadLinks.android.googlePlay}
                target="_blank"
                rel="noopener noreferrer"
                className="m3-footer-social-item"
              >
                <span>Google Play</span>
              </a>
              <a
                href={downloadLinks.android.github}
                target="_blank"
                rel="noopener noreferrer"
                className="m3-footer-social-item"
              >
                <span>GitHub (APK)</span>
              </a>
              <a
                href="https://github.com/IILLUMINATION/meanderPUBLIC/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="m3-footer-social-item"
              >
                <span>Все релизы</span>
              </a>
            </div>
          </div>
        </div>

        <div className="m3-footer-bottom">
          <a
            href={downloadLinks.android.googlePlay}
            target="_blank"
            rel="noopener noreferrer"
            className="m3-footer-bottom-gplay"
            aria-label="Скачать в Google Play"
          >
            <img src="/google-play-ru.svg" alt="Доступно в Google Play" />
          </a>
          <div className="m3-footer-bottom-links">
            <span
              className="m3-footer-bottom-link"
              style={{ color: "var(--m3-outline)" }}
            >
              © {new Date().getFullYear()} IILLUMINAT. Meander
            </span>
            <Link href="/branding" className="m3-footer-bottom-link">
              Брендинг
            </Link>
            <Link href="/docs" className="m3-footer-bottom-link">
              Документация
            </Link>
            <a
              href="https://github.com/IILLUMINATION/meanderPUBLIC"
              target="_blank"
              rel="noopener noreferrer"
              className="m3-footer-bottom-link"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}