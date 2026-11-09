import { TriangleAlert } from "lucide-react";

/**
 * Честная плашка про веб-плеер.
 *
 * Плеер умеет запускать квесты, но это ранняя альфа: часть вещей там не
 * работает или разъезжается, и у пользователя не должно складываться
 * впечатления, что браузер заменяет приложение. Стоит рядом с каждой кнопкой
 * «играть в браузере» — и на главной, и на странице квеста в маркете.
 */
export default function WebPlayerWarning({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-3 p-3 md:p-4 ${className}`}
      style={{
        background: "var(--m3-error-container)",
        color: "var(--m3-on-error-container)",
        borderRadius: "var(--m3-radius-lg)",
      }}
    >
      <TriangleAlert className="w-5 h-5 flex-shrink-0 mt-0.5" strokeWidth={2} />
      <p className="m3-body-small">
        <strong>Веб-плеер — сырая альфа.</strong> Играть в браузере можно, но
        это тестовая сборка: возможны сбои, пустые экраны и вёрстка, которая
        разъезжается на телефоне. Полноценно квесты идут в{" "}
        <a href="/#download" className="underline">
          приложении
        </a>
        . Нашли баг — напишите в{" "}
        <a
          href="https://t.me/meanderRU"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          @meanderRU
        </a>
        .
      </p>
    </div>
  );
}
