"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  CheckCircle,
  Download,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import QuestCover from "@/components/QuestCover";

export interface CarouselQuest {
  id: string | number;
  title: string;
  preview_image_url?: string | null;
  author_name?: string | null;
  author_is_verified?: boolean;
  is_demo?: boolean;
  downloads_count: number;
  average_rating: number;
  estimated_playtime?: number;
}

interface HeroCarouselProps {
  quests: CarouselQuest[];
}

interface Dims {
  big: number;
  small: number;
  gap: number;
  pad: number;
  h: number;
  w: number;
}

interface VelocitySample {
  t: number;
  x: number;
}

export default function HeroCarousel({ quests }: HeroCarouselProps) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    lastX: number;
    active: boolean;
    pointerId: number | null;
    moved: boolean;
    samples: VelocitySample[];
    offset: number;
    rafId: number | null;
    pendingOffset: number;
  }>({
    startX: 0,
    lastX: 0,
    active: false,
    pointerId: null,
    moved: false,
    samples: [],
    offset: 0,
    rafId: null,
    pendingOffset: 0,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dims, setDims] = useState<Dims>({
    big: 420,
    small: 200,
    gap: 12,
    pad: 16,
    h: 420,
    w: 800,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const compute = () => {
      const w = wrap.clientWidth;
      const isMobile = w < 768;
      const pad = 16;
      const gap = isMobile ? 8 : 12;
      const small = isMobile ? 64 : 180;
      let big = w - pad * 2 - gap - small;
      const maxBig = isMobile ? 560 : 420;
      const minBig = 280;
      big = Math.max(minBig, Math.min(maxBig, big));
      const h = isMobile ? big : Math.min(big, 360);
      setDims({ big, small, gap, pad, h, w });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const pitch = dims.small + dims.gap;
  const lastIdx = quests.length - 1;
  const midTranslate = (dims.w - dims.big) / 2 - activeIndex * pitch;
  const leftClamp = dims.pad;
  const rightClamp = dims.w - dims.pad - dims.big - lastIdx * pitch;
  const baseTranslate = rightClamp >= leftClamp
    ? leftClamp
    : Math.max(rightClamp, Math.min(leftClamp, midTranslate));

  const applyDragOffset = useCallback((offset: number) => {
    dragRef.current.pendingOffset = offset;
    if (dragRef.current.rafId !== null) return;
    dragRef.current.rafId = requestAnimationFrame(() => {
      dragRef.current.rafId = null;
      const track = trackRef.current;
      if (!track) return;
      const tx = baseTranslate + dragRef.current.pendingOffset;
      track.style.transform = `translate3d(${tx}px, 0, 0)`;
    });
  }, [baseTranslate]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (isDragging) {
      track.style.transition = "none";
      return;
    }
    track.style.transition = "transform 360ms cubic-bezier(0.22, 0.61, 0.36, 1)";
    track.style.transform = `translate3d(${baseTranslate}px, 0, 0)`;
  }, [baseTranslate, isDragging]);

  const go = useCallback(
    (idx: number) => {
      setActiveIndex(Math.max(0, Math.min(quests.length - 1, idx)));
    },
    [quests.length],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX,
      lastX: e.clientX,
      active: true,
      pointerId: e.pointerId,
      moved: false,
      samples: [{ t: performance.now(), x: e.clientX }],
      offset: 0,
      rafId: null,
      pendingOffset: 0,
    };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    let dx = e.clientX - dragRef.current.startX;
    dragRef.current.lastX = e.clientX;
    if (Math.abs(dx) > 8 && !dragRef.current.moved) {
      dragRef.current.moved = true;
      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      } catch {}
    }

    const atStart = activeIndex === 0 && dx > 0;
    const atEnd = activeIndex === quests.length - 1 && dx < 0;
    if (atStart || atEnd) {
      const sign = dx >= 0 ? 1 : -1;
      const abs = Math.abs(dx);
      dx = sign * Math.min(abs * 0.35, pitch * 0.6);
    }

    const now = performance.now();
    const samples = dragRef.current.samples;
    samples.push({ t: now, x: e.clientX });
    while (samples.length > 1 && now - samples[0].t > 120) {
      samples.shift();
    }

    dragRef.current.offset = dx;
    applyDragOffset(dx);
  };

  const finishDrag = (cancelled = false) => {
    if (!dragRef.current.active) return;
    const dx = dragRef.current.lastX - dragRef.current.startX;
    const samples = dragRef.current.samples;
    dragRef.current.active = false;
    if (dragRef.current.rafId !== null) {
      cancelAnimationFrame(dragRef.current.rafId);
      dragRef.current.rafId = null;
    }
    dragRef.current.offset = 0;
    dragRef.current.pendingOffset = 0;
    setIsDragging(false);
    if (cancelled) return;

    let velocity = 0;
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.t - first.t;
      if (dt > 0) velocity = (last.x - first.x) / dt;
    }

    const absDx = Math.abs(dx);
    const absV = Math.abs(velocity);
    const dragTrigger = pitch * 0.22;
    const flickTrigger = 0.45;
    const triggered = absDx >= dragTrigger || absV >= flickTrigger;

    if (triggered && absDx >= 8) {
      const dir = (absV >= flickTrigger && absV > absDx / 80)
        ? (velocity < 0 ? 1 : -1)
        : (dx < 0 ? 1 : -1);

      const stepUnit = pitch + dims.big * 0.55;
      let steps = 1 + Math.floor(absDx / stepUnit);
      if (absV >= 1.2) steps += 1;
      if (absV >= 2.0) steps += 1;
      steps = Math.max(1, Math.min(3, steps));
      setActiveIndex((prev) => {
        const maxIdx = quests.length - 1;
        return Math.max(0, Math.min(maxIdx, prev + dir * steps));
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    finishDrag();
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };
  const onPointerCancel = () => finishDrag(true);

  const wheelAccum = useRef(0);
  const wheelResetTimer = useRef<number | null>(null);
  const questsLenRef = useRef(quests.length);
  useEffect(() => {
    questsLenRef.current = quests.length;
  }, [quests.length]);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const STEP_PX = 70;
    const MAX_STEPS_PER_EVENT = 5;
    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaY;
      const dx = e.deltaX;
      const primary = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      if (Math.abs(primary) < 4) return;
      e.preventDefault();

      if (Math.sign(primary) !== Math.sign(wheelAccum.current) && wheelAccum.current !== 0) {
        wheelAccum.current = 0;
      }
      wheelAccum.current += primary;

      const absAccum = Math.abs(wheelAccum.current);
      if (absAccum >= STEP_PX) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        const rawSteps = Math.floor(absAccum / STEP_PX);
        const steps = Math.min(MAX_STEPS_PER_EVENT, rawSteps);
        wheelAccum.current -= dir * steps * STEP_PX;
        setActiveIndex((prev) => {
          const maxIdx = questsLenRef.current - 1;
          return Math.max(0, Math.min(maxIdx, prev + dir * steps));
        });
      }

      if (wheelResetTimer.current !== null) {
        window.clearTimeout(wheelResetTimer.current);
      }
      wheelResetTimer.current = window.setTimeout(() => {
        wheelAccum.current = 0;
        wheelResetTimer.current = null;
      }, 140);
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrap.removeEventListener("wheel", onWheel);
      if (wheelResetTimer.current !== null) {
        window.clearTimeout(wheelResetTimer.current);
        wheelResetTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(activeIndex + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(quests.length - 1);
    }
  };

  const onItemClick = (idx: number, questId: string | number) =>
    (e: React.MouseEvent) => {
      if (dragRef.current.moved) {
        e.preventDefault();
        return;
      }
      if (idx !== activeIndex) {
        e.preventDefault();
        go(idx);
        return;
      }
      void questId;
    };

  return (
    <div
      ref={wrapRef}
      className="m3-carousel-wrap"
      tabIndex={0}
      role="region"
      aria-label="Карусель квестов"
      onKeyDown={onKey}
      style={
        {
          "--m3-big": `${dims.big}px`,
          "--m3-small": `${dims.small}px`,
          "--m3-gap": `${dims.gap}px`,
          "--m3-pad": `${dims.pad}px`,
          "--m3-h": `${dims.h}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="m3-carousel-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          ref={trackRef}
          className="m3-carousel-track"
          style={{
            willChange: "transform",
          }}
        >
          {quests.map((quest, index) => {
            const isActive = index === activeIndex;
            return (
              <Link
                key={quest.id}
                href={`/market/${quest.id}`}
                className="m3-carousel-item"
                data-active={isActive ? "true" : "false"}
                draggable={false}
                aria-label={quest.title}
                onClick={onItemClick(index, quest.id)}
              >
                <div className="m3-carousel-item-media">
                  <QuestCover
                    src={quest.preview_image_url}
                    alt={quest.title}
                    loading="lazy"
                    draggable={false}
                    className="m3-carousel-cover"
                  />

                  <div className="m3-carousel-item-rank">
                    <span
                      className="m3-badge"
                      style={
                        index === 0
                          ? { background: "#f5c518", color: "#000" }
                          : index === 1
                          ? { background: "#c0c0c0", color: "#000" }
                          : index === 2
                          ? { background: "#cd7f32", color: "#000" }
                          : undefined
                      }
                    >
                      #{index + 1}
                    </span>
                  </div>

                  {quest.is_demo && (
                    <div className="m3-carousel-item-demo">
                      <span className="m3-badge m3-badge-primary">Демо</span>
                    </div>
                  )}

                  <div className="m3-carousel-item-overlay">
                    <h3 className="m3-carousel-item-title">{quest.title}</h3>
                    <div className="m3-carousel-item-meta">
                      <span className="m3-carousel-item-author">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {quest.author_name || "Аноним"}
                        </span>
                        {quest.author_is_verified && (
                          <CheckCircle
                            className="w-3 h-3 flex-shrink-0"
                            style={{ color: "var(--m3-primary)" }}
                          />
                        )}
                      </span>
                    </div>
                    <div className="m3-carousel-item-stats">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {quest.downloads_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {quest.average_rating > 0
                          ? Number(quest.average_rating).toFixed(1)
                          : "—"}
                      </span>
                      {quest.estimated_playtime &&
                      quest.estimated_playtime > 0 ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />~
                          {quest.estimated_playtime} мин
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="m3-carousel-dots" role="tablist">
        {quests.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`m3-carousel-dot ${
              i === activeIndex ? "is-active" : ""
            }`}
            onClick={() => go(i)}
            aria-label={`Квест ${i + 1}`}
            aria-selected={i === activeIndex}
          />
        ))}
      </div>

      <button
        type="button"
        className="m3-carousel-nav m3-carousel-nav-prev"
        onClick={() => go(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Предыдущая карточка"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>
      <button
        type="button"
        className="m3-carousel-nav m3-carousel-nav-next"
        onClick={() => go(activeIndex + 1)}
        disabled={activeIndex === quests.length - 1}
        aria-label="Следующая карточка"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}