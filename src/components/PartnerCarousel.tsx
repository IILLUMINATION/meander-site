"use client";

import { useState, useRef, useEffect } from "react";
import { HeartHandshake, Sparkles, ChevronRight } from "lucide-react";

interface Partner {
  name: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

const partners: Partner[] = [
  {
    name: "onlysq",
    title: "При поддержке OnlySQ",
    subtitle: "AI API платформа · 141 модель · onlysq.ru",
    href: "https://onlysq.ru",
    icon: <HeartHandshake className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    label: "Партнёр",
  },
  {
    name: "techai",
    title: "При поддержке TechAI",
    subtitle: "Telegram-бот для создания квестов с помощью ИИ · t.me/mindteamai_bot",
    href: "https://t.me/mindteamai_bot",
    icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    label: "Партнёр",
  },
];

function getDesktopColSpan(index: number, total: number): string {
  if (total === 1) return "md:col-span-2";
  if (total === 2) return "md:col-span-1";
  if (total === 3) {
    return index === 0 ? "md:col-span-2" : "md:col-span-1";
  }
  if (total % 2 === 1 && total > 3) {
    return index === 0 ? "md:col-span-2" : "md:col-span-1";
  }
  return "md:col-span-1";
}

interface CardProps {
  partner: Partner;
  className?: string;
}

function PartnerCard({ partner: p, className = "" }: CardProps) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block group ${className}`}
    >
      <div
        className="p-5 md:p-6 transition-colors hover:brightness-110 h-full flex items-center"
        style={{
          background: "var(--m3-surface-container-low)",
          borderRadius: "var(--m3-radius-lg)",
        }}
      >
        <div className="flex items-center gap-4 w-full">
          <div
            className="p-3 flex-shrink-0"
            style={{
              background: "var(--m3-secondary-container)",
              borderRadius: "var(--m3-radius-md)",
              color: "var(--m3-on-secondary-container)",
            }}
          >
            {p.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="m3-label-large uppercase tracking-widest"
                style={{ color: "var(--m3-secondary)" }}
              >
                {p.label}
              </span>
              <ChevronRight
                className="w-4 h-4 group-hover:translate-x-1 transition-all"
                style={{ color: "var(--m3-outline)" }}
              />
            </div>
            <h2 className="m3-title-large md:m3-headline-small">
              {p.title}
            </h2>
            <p
              className="m3-body-small md:m3-body-medium mt-1"
              style={{ color: "var(--m3-on-surface-variant)" }}
            >
              {p.subtitle}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function PartnerCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActiveSlide(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <div className="md:hidden">
        <div
          ref={scrollerRef}
          className="flex items-stretch overflow-x-auto snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex-shrink-0 w-full snap-start px-1.5 first:pl-0 last:pr-0 flex"
            >
              <PartnerCard partner={p} className="w-full" />
            </div>
          ))}
        </div>
        {partners.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {partners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className="transition-all rounded-full"
                style={{
                  width: idx === activeSlide ? "20px" : "8px",
                  height: "8px",
                  background:
                    idx === activeSlide
                      ? "var(--m3-primary)"
                      : "var(--m3-outline-variant)",
                }}
                aria-label={`Слайд ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:grid grid-cols-2 gap-4 auto-rows-fr items-stretch">
        {partners.map((p, idx) => (
          <PartnerCard
            key={p.name}
            partner={p}
            className={getDesktopColSpan(idx, partners.length)}
          />
        ))}
      </div>
    </>
  );
}