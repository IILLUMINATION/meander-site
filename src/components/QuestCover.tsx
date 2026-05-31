"use client";

import { useState } from "react";

interface QuestCoverProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  placeholderEmoji?: string;
  loading?: "lazy" | "eager";
  draggable?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function QuestCover({
  src,
  alt,
  className = "",
  imgClassName = "",
  placeholderEmoji = "🎮",
  loading = "lazy",
  draggable = false,
  onError,
}: QuestCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const hasImage = !!src && !errored;

  return (
    <div className={`m3-cover ${className}`}>
      <div
        className="m3-cover-skeleton"
        data-hidden={hasImage && loaded ? "true" : "false"}
        aria-hidden="true"
      />
      {hasImage ? (
        <img
          src={src!}
          alt={alt}
          loading={loading}
          draggable={draggable}
          className={`m3-cover-img ${imgClassName}`}
          data-loaded={loaded ? "true" : "false"}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setErrored(true);
            onError?.(e);
          }}
        />
      ) : (
        !src && (
          <div className="m3-cover-placeholder" aria-hidden="true">
            {placeholderEmoji}
          </div>
        )
      )}
    </div>
  );
}