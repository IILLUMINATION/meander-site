"use client";

import Link from "next/link";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";

export default function InfoCards() {
  return (
    <section
      className="py-12 md:py-24 px-4 md:px-6"
      style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
    >
      <div className="max-w-4xl mx-auto">
        <Link href="/docs" className="block group">
          <div className="m3-card-outlined p-6 md:p-10">
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="p-3 flex-shrink-0"
                style={{
                  background: "var(--m3-primary-container)",
                  borderRadius: "var(--m3-radius-lg)",
                }}
              >
                <BookOpen
                  className="w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={1.5}
                  style={{ color: "var(--m3-on-primary-container)" }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="m3-label-large uppercase tracking-widest"
                    style={{ color: "var(--m3-primary)" }}
                  >
                    Документация
                  </span>
                  <ChevronRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-all"
                    style={{ color: "var(--m3-outline)" }}
                  />
                </div>
                <h2
                  className="m3-headline-large mb-3 group-hover:text-accent transition-colors"
                  style={{ color: "var(--m3-on-surface)" }}
                >
                  Научись создавать квесты
                </h2>
                <p
                  className="m3-body-large"
                  style={{ color: "var(--m3-on-surface-variant)" }}
                >
                  Пошаговые гайды от установки до публикации. Разберись в редакторе,
                  мультимедиа, ветвлениях и маркете.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="m3-badge">Быстрый старт</span>
                  <span className="m3-badge">Видео-гайды</span>
                  <span className="m3-badge">Формат .mnd</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <a
          href="https://t.me/mindteamai_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="block group mt-4 md:mt-6"
        >
          <div className="m3-card-outlined p-6 md:p-10">
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="p-3 flex-shrink-0"
                style={{
                  background: "var(--m3-tertiary-container)",
                  borderRadius: "var(--m3-radius-lg)",
                }}
              >
                <Sparkles
                  className="w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={1.5}
                  style={{ color: "var(--m3-on-tertiary-container)" }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="m3-label-large uppercase tracking-widest"
                    style={{ color: "var(--m3-tertiary)" }}
                  >
                    TechAI
                  </span>
                  <ChevronRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-all"
                    style={{ color: "var(--m3-outline)" }}
                  />
                </div>
                <h2
                  className="m3-headline-large mb-3 group-hover:text-accent transition-colors"
                  style={{ color: "var(--m3-on-surface)" }}
                >
                  Создай квест через TechAI
                </h2>
                <p
                  className="m3-body-large"
                  style={{ color: "var(--m3-on-surface-variant)" }}
                >
                  Опиши идею в Telegram-боте — он сгенерирует структуру квеста, диалоги и
                  ветвления. Получи готовый .mnd за минуты.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="m3-badge">@mindteamai_bot</span>
                  <span className="m3-badge">AI-генерация</span>
                  <span className="m3-badge">Без кода</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}