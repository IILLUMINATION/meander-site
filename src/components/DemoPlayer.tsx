"use client";

import { useState } from "react";
import { ExternalLink, Play, X } from "lucide-react";

interface DemoPlayerProps {
  questId: string;
  title: string;
  previewUrl?: string | null;
}

/**
 * Играбельная витрина вместо тупиковой галереи скриншотов.
 *
 * iframe ставится только после клика: страница квеста не должна тянуть
 * 6+ МБ wasm и архив до того, как человек выбрал «играть». Плеер живёт на
 * том же origin (/play/), поэтому COOP/COEP и загрузка архива работают без
 * CORS-обходов.
 */
export default function DemoPlayer({ questId, title, previewUrl }: DemoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const playerHref = `/play/?quest=${encodeURIComponent(questId)}`;

  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: "var(--m3-radius-lg)",
        border: "1px solid var(--m3-outline-variant)",
        background: "var(--m3-surface-container-lowest)",
      }}
    >
      {playing ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="absolute right-3 top-3 z-10 m3-icon-button"
            style={{ background: "var(--m3-surface-container-high)" }}
            aria-label="Закрыть демо"
          >
            <X className="h-5 w-5" />
          </button>
          <iframe
            src={playerHref}
            title={`Играть: ${title}`}
            loading="lazy"
            allow="autoplay; fullscreen"
            style={{ width: "100%", height: "min(72vh, 620px)", border: 0 }}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <a
            href={playerHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-video md:aspect-auto md:min-h-[360px]"
            aria-label={`Открыть демо «${title}» в новой вкладке`}
          >
            <img
              src={previewUrl || "/images/screenshot-1.jpg"}
              alt=""
              className="h-full w-full object-cover"
            />
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,.28)" }}
            >
              <span className="m3-btn m3-btn-filled">
                <Play className="h-4 w-4" /> Играть в браузере
              </span>
            </span>
          </a>
          <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
            <p className="m3-label-large uppercase tracking-widest" style={{ color: "var(--m3-primary)" }}>
              демо без установки
            </p>
            <h3 className="m3-headline-small">{title}</h3>
            <p className="m3-body-medium" style={{ color: "var(--m3-on-surface-variant)" }}>
              Открой квест прямо здесь: движок Meander работает в браузере,
              архив остаётся на сервере. Ни установки, ни аккаунта.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="m3-btn m3-btn-filled"
                onClick={() => setPlaying(true)}
              >
                <Play className="h-4 w-4" /> Играть здесь
              </button>
              <a
                href={playerHref}
                target="_blank"
                rel="noopener noreferrer"
                className="m3-btn m3-btn-outlined"
              >
                <ExternalLink className="h-4 w-4" /> В новой вкладке
              </a>
            </div>
            <p className="m3-body-small" style={{ color: "var(--m3-outline)" }}>
              Нужен браузер с WebAssembly. На телефоне удобнее в новой вкладке.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}