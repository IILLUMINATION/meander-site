import { ExternalLink, Play } from "lucide-react";

interface DemoPlayerProps {
  questId: string;
  title: string;
  previewUrl?: string | null;
}

/**
 * Играбельная витрина вместо галереи скриншотов.
 *
 * iframe здесь не используется: движку нужны COOP/COEP, а главная живёт без
 * них (иначе ломаются внешние ресурсы). Во встроенном фрейме WASM падал с
 * `RuntimeError: unreachable`; отдельная вкладка получает заголовки `/play/`
 * и работает. Клик по обложке и кнопка ведут в один и тот же адрес.
 */
export default function DemoPlayer({ questId, title, previewUrl }: DemoPlayerProps) {
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
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        <a
          href={playerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-video md:aspect-auto md:min-h-[360px]"
          aria-label={`Открыть демо «${title}» в новой вкладке`}
        >
          <img
            src={previewUrl || "/images/devices/clip-welcome.webp"}
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
            Открой квест в новой вкладке: движок Meander работает в браузере,
            архив остаётся на сервере. Ни установки, ни аккаунта.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={playerHref}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-btn m3-btn-filled"
            >
              <Play className="h-4 w-4" /> Играть
            </a>
            <a
              href="/market"
              className="m3-btn m3-btn-outlined"
            >
              <ExternalLink className="h-4 w-4" /> Другие квесты
            </a>
          </div>
          <p className="m3-body-small" style={{ color: "var(--m3-outline)" }}>
            Нужен браузер с WebAssembly. На телефоне удобнее открыть в новой вкладке.
          </p>
        </div>
      </div>
    </div>
  );
}