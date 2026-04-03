"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-accent/40 rounded-full shadow-lg transition-all"
      aria-label="Наверх"
    >
      <ArrowUp className="w-5 h-5 text-neutral-400 hover:text-accent transition-colors" />
    </button>
  );
}
