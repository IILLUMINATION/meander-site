"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { CredentialResponse } from "@react-oauth/google";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import {
  Download,
  Heart,
  HeartHandshake,
  Clock,
  User,
  LogOut,
  CheckCircle,
  Search,
  Star,
  Sparkles,
  TrendingUp,
  Diamond,
  FlaskConical,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import HeroCarousel, { CarouselQuest } from "@/components/HeroCarousel";
import PartnerCarousel from "@/components/PartnerCarousel";
import QuestCover from "@/components/QuestCover";

const API_URL = "/api/be";

interface Quest {
  id: string;
  title: string;
  description: string;
  author_id: string;
  author_name?: string;
  author_is_verified?: boolean;
  preview_image_url: string | null;
  download_url: string;
  version: string;
  node_count: number;
  estimated_playtime: number;
  quest_size_bytes: number;
  status: string;
  category: string;
  genres: string[];
  like_count: number;
  dislike_count: number;
  downloads_count: number;
  average_rating: number;
  is_demo: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  google_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  role: string;
}

const categories = [
  { key: null, label: "Все" },
  { key: "trending", label: "В тренде" },
  { key: "verified", label: "Проверенные" },
  { key: "Fantasy", label: "Фэнтези" },
  { key: "Sci-Fi", label: "Фантастика" },
  { key: "Horror", label: "Ужасы" },
  { key: "Adventure", label: "Приключения" },
  { key: "Mystery", label: "Мистика" },
  { key: "Romance", label: "Романтика" },
  { key: "Comedy", label: "Комедия" },
  { key: "Thriller", label: "Триллер" },
  { key: "Historical", label: "Исторический" },
  { key: "Drama", label: "Драма" },
];

export default function MarketPage() {
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(24);

  useEffect(() => {
    const savedUser = localStorage.getItem("meander_user");
    const savedToken = localStorage.getItem("meander_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    loadQuests();
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    setDisplayCount(24);
  }, [debouncedSearch, selectedCategory]);

  const getTokenHeaders = () => {
    const token = localStorage.getItem("meander_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadQuests = async (attempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/quests`, { headers: getTokenHeaders() });
      setAllQuests(response.data);
    } catch (err: any) {
      console.error("Failed to load quests:", err);
      const status = err?.response?.status;
      if (status === 429 && attempt < 3) {
        const retryAfter = Number(err?.response?.headers?.["retry-after"]);
        const delay = (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1500 * Math.pow(2, attempt));
        setError(`Слишком много запросов. Повторим через ${Math.ceil(delay / 1000)} с…`);
        setTimeout(() => loadQuests(attempt + 1), delay);
        return;
      }
      if (status === 429) {
        setError("Сервер перегружен, попробуй обновить страницу через минуту");
      } else {
        setError(err?.response?.data?.error || err?.message || "Не удалось загрузить квесты");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) return;
      const response = await axios.post(`${API_URL}/auth/google/token`, {
        idToken: credentialResponse.credential,
      });
      const { token, user } = response.data;
      localStorage.setItem("meander_token", token);
      localStorage.setItem("meander_user", JSON.stringify(user));
      setUser(user);
    } catch (err: any) {
      console.error("Sign in error:", err);
      alert("Ошибка входа: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("meander_user");
    localStorage.removeItem("meander_token");
    setUser(null);
  };

  const handleDownload = async (questId: string) => {
    try {
      if (user) {
        await axios.post(
          `${API_URL}/quests/${questId}/download`,
          {},
          { headers: getTokenHeaders() }
        );
      }
      const found = allQuests.find((q) => q.id === questId);
      const safeTitle = (found?.title || "quest")
        .replace(/[\\/:*?"<>|]+/g, "")
        .trim() || "quest";
      const filename = `${safeTitle}.mnd`;
      const res = await axios.get(`${API_URL}/quests/${questId}/file`, {
        headers: getTokenHeaders(),
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Не удалось скачать квест");
    }
  };

  const handleVote = async (questId: string, isLike: boolean) => {
    if (!user) {
      alert("Войдите чтобы голосовать");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/quests/${questId}/vote`,
        { action: "set", is_like: isLike },
        { headers: getTokenHeaders() }
      );
      await loadQuests();
    } catch (err: any) {
      console.error("Vote error:", err);
      alert("Ошибка голосования: " + (err.response?.data?.error || err.message));
    }
  };

  const getFilteredQuests = (questList: Quest[], category: string | null) => {
    let filtered = [...questList];
    if (category === "verified") {
      return filtered.filter((q) => q.author_is_verified);
    }
    if (category === "trending") {
      return filtered
        .sort((a, b) => {
          const scoreA = a.downloads_count + a.like_count * 5;
          const scoreB = b.downloads_count + b.like_count * 5;
          return scoreB - scoreA;
        })
        .slice(0, 10);
    }
    if (category) {
      filtered = filtered.filter(
        (q) => q.genres.includes(category) || q.category === category
      );
    }
    return filtered;
  };

  const filteredQuests = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    const base = query
      ? allQuests.filter(
          (q) =>
            q.title.toLowerCase().includes(query) ||
            q.description?.toLowerCase().includes(query)
        )
      : allQuests;
    return getFilteredQuests(base, selectedCategory);
  }, [allQuests, debouncedSearch, selectedCategory]);

  const visibleQuests = useMemo(
    () => filteredQuests.slice(0, displayCount),
    [filteredQuests, displayCount]
  );

  const newQuests = useMemo(
    () =>
      allQuests
        .filter((q) => !q.is_demo)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 10),
    [allQuests]
  );

  const popularQuests = useMemo(
    () =>
      allQuests
        .filter((q) => !q.is_demo)
        .sort((a, b) => {
          const scoreA = a.downloads_count + a.like_count * 5;
          const scoreB = b.downloads_count + b.like_count * 5;
          return scoreB - scoreA;
        })
        .slice(0, 10),
    [allQuests]
  );

  const undiscoveredQuests = useMemo(() => {
    const pool = allQuests.filter((q) => q.downloads_count < 100 && !q.is_demo);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 10);
  }, [allQuests]);

  const demoQuests = useMemo(() => allQuests.filter((q) => q.is_demo), [allQuests]);

  const featuredQuests = useMemo(
    () => allQuests.filter((q) => q.is_featured).slice(0, 5),
    [allQuests]
  );

  const isSearchPending = searchQuery !== debouncedSearch;

  return (
    <div className="min-h-screen m3-surface">
      <Header
        user={user}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="pt-6 pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="m3-market-search">
              <Search className="m3-search-icon w-5 h-5" />
              <input
                type="text"
                placeholder="Найти историю..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="m3-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="m3-icon-button m3-search-clear"
                  aria-label="Очистить"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div
            className="m3-collapsible"
            data-collapsed={searchQuery ? "true" : "false"}
            aria-hidden={searchQuery ? "true" : "false"}
          >
            <div className="m3-collapsible-inner">
              <div className="mb-6 md:mb-8">
                <PartnerCarousel />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 md:mb-8 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.key ?? "all"}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`m3-chip${selectedCategory === cat.key ? " is-selected" : ""}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div
              className="mb-8 p-4 text-center"
              style={{
                background: "var(--m3-error-container)",
                color: "var(--m3-on-error-container)",
                borderRadius: "var(--m3-radius-md)",
              }}
            >
              {error}
            </div>
          )}

          {!searchQuery && !selectedCategory && (
            <>
              {featuredQuests.length > 0 && (
                <section className="mb-10 md:mb-14">
                  <SectionHeader
                    icon={<Sparkles className="w-5 h-5" />}
                    title="Выбор редакции"
                  />
                  <HeroCarousel quests={toCarouselQuests(featuredQuests)} />
                </section>
              )}

              {undiscoveredQuests.length > 0 && (
                <section className="mb-10 md:mb-14">
                  <SectionHeader
                    icon={<Diamond className="w-5 h-5" />}
                    title="Скрытые алмазы"
                    subtitle="Попробуй что-то новое от начинающих авторов"
                  />
                  <HeroCarousel quests={toCarouselQuests(undiscoveredQuests)} />
                </section>
              )}

              {popularQuests.length > 0 && (
                <section className="mb-10 md:mb-14">
                  <SectionHeader
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="В тренде"
                  />
                  <HeroCarousel quests={toCarouselQuests(popularQuests)} />
                </section>
              )}

              {newQuests.length > 0 && (
                <section className="mb-10 md:mb-14">
                  <SectionHeader
                    icon={<Star className="w-5 h-5" />}
                    title="Свежие новинки"
                    subtitle="Что недавно появилось на маркете"
                  />
                  <HeroCarousel quests={toCarouselQuests(newQuests)} />
                </section>
              )}

              {demoQuests.length > 0 && (
                <section className="mb-10 md:mb-14">
                  <SectionHeader
                    icon={<FlaskConical className="w-5 h-5" />}
                    title="Демо версии"
                    subtitle="Недоделанные квесты. Секция для тестов и отзывов."
                  />
                  <HeroCarousel quests={toCarouselQuests(demoQuests.slice(0, 10))} />
                </section>
              )}
            </>
          )}

          {(debouncedSearch || selectedCategory) && (
            <section className="mb-12">
              <SectionHeader
                icon={<Search className="w-5 h-5" />}
                title={
                  debouncedSearch
                    ? `Результаты поиска: "${debouncedSearch}"`
                    : categories.find((c) => c.key === selectedCategory)?.label ||
                      "Фильтр"
                }
              />
              <QuestGrid
                quests={visibleQuests}
                onDownload={handleDownload}
                onVote={handleVote}
              />
              {filteredQuests.length > visibleQuests.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setDisplayCount((c) => c + 24)}
                    className="m3-button-outlined"
                  >
                    Показать ещё ({filteredQuests.length - visibleQuests.length})
                  </button>
                </div>
              )}
            </section>
          )}

          {(loading || isSearchPending) && (
            <div className="text-center py-20">
              <div className="m3-body-medium m3-text-secondary">
                {loading ? "Загрузка квестов..." : "Поиск..."}
              </div>
            </div>
          )}

          {!loading &&
            !isSearchPending &&
            filteredQuests.length === 0 &&
            (debouncedSearch || selectedCategory) && (
              <div className="text-center py-20">
                <div className="m3-body-medium m3-text-secondary">
                  Квесты не найдены
                </div>
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function toCarouselQuests(quests: Quest[]): CarouselQuest[] {
  return quests.map((q) => ({
    id: q.id,
    title: q.title,
    preview_image_url: q.preview_image_url,
    author_name: q.author_name,
    author_is_verified: q.author_is_verified,
    is_demo: q.is_demo,
    downloads_count: q.downloads_count,
    average_rating: q.average_rating,
    estimated_playtime: q.estimated_playtime,
  }));
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 md:mb-6 px-1">
      <div className="flex items-center gap-3 mb-1.5">
        <span style={{ color: "var(--m3-primary)" }}>{icon}</span>
        <h2 className="m3-headline-small md:m3-headline-medium">{title}</h2>
      </div>
      {subtitle && (
        <p className="m3-body-small m3-text-secondary ml-8">{subtitle}</p>
      )}
    </div>
  );
}

function QuestGrid({
  quests,
  onDownload,
  onVote,
}: {
  quests: Quest[];
  onDownload: (id: string) => void;
  onVote: (id: string, isLike: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onDownload={() => onDownload(quest.id)}
          onVote={(isLike) => onVote(quest.id, isLike)}
        />
      ))}
    </div>
  );
}

function QuestCard({
  quest,
  onDownload,
}: {
  quest: Quest;
  onDownload: () => void;
  onVote: (isLike: boolean) => void;
}) {
  return (
    <div className="m3-quest-card">
      <Link href={`/market/${quest.id}`} className="m3-quest-card-media block">
        <QuestCover
          src={quest.preview_image_url}
          alt={quest.title}
          className="m3-quest-card-cover"
        />
        {quest.is_demo && (
          <div className="m3-quest-card-demo">
            <span className="m3-badge m3-badge-primary">Демо</span>
          </div>
        )}
      </Link>

      <div className="m3-quest-card-body">
        <Link href={`/market/${quest.id}`} className="block">
          <h3 className="m3-quest-card-title">{quest.title}</h3>
        </Link>

        <p className="m3-quest-card-desc">{quest.description}</p>

        <div className="m3-quest-card-author">
          <User className="w-3.5 h-3.5" strokeWidth={1.5} />
          {quest.author_id ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/profile/${quest.author_id}`;
              }}
              className="m3-quest-card-author-name truncate"
            >
              {quest.author_name || "Аноним"}
            </span>
          ) : (
            <span className="truncate">{quest.author_name || "Аноним"}</span>
          )}
          {quest.author_is_verified && (
            <CheckCircle
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "var(--m3-primary)" }}
            />
          )}
        </div>

        <div className="m3-quest-card-stats">
          <span className="m3-quest-card-stat">
            <Heart className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{quest.like_count}</span>
          </span>
          <span className="m3-quest-card-stat">
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{quest.downloads_count}</span>
          </span>
          <span className="m3-quest-card-stat">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{quest.estimated_playtime} мин</span>
          </span>
        </div>

        <div className="m3-quest-card-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="m3-quest-card-download"
          >
            <Download className="w-4 h-4" strokeWidth={2} />
            <span>Скачать</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({
  user,
  onSignIn,
  onSignOut,
  onOpenDrawer,
}: {
  user: UserProfile | null;
  onSignIn: (response: CredentialResponse) => void;
  onSignOut: () => void;
  onOpenDrawer: () => void;
}) {
  return (
    <header className="m3-top-app-bar">
      <div className="m3-top-app-bar-inner">
        <button
          onClick={onOpenDrawer}
          className="m3-icon-button m3-mobile-only"
          aria-label="Меню"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="m3-logo">
          <img
            src="/images/logo.svg"
            alt="Meander"
            className="h-8 w-auto"
          />
        </Link>

        <div className="m3-desktop-only items-center gap-4" style={{ marginLeft: "auto" }}>
          {user ? (
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                <Link href={`/profile/${user.id}`}>
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || ""}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    className="w-9 h-9 rounded-full object-cover"
                    style={{ border: "2px solid transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "var(--m3-primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </Link>
              ) : (
                <Link href={`/profile/${user.id}`}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: "var(--m3-surface-container-high)",
                      color: "var(--m3-on-surface-variant)",
                    }}
                  >
                    <User className="w-4 h-4" />
                  </div>
                </Link>
              )}
              <Link
                href={`/profile/${user.id}`}
                className="m3-body-medium hover:underline"
              >
                {user.full_name}
              </Link>
              {user.is_verified && (
                <CheckCircle
                  className="w-4 h-4"
                  style={{ color: "var(--m3-primary)" }}
                />
              )}
              <button
                onClick={onSignOut}
                className="m3-icon-button"
                aria-label="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <GoogleSignInButton onSuccess={onSignIn} variant="wide" />
          )}
        </div>

        <div
          className="m3-mobile-only items-center gap-2"
          style={{ marginLeft: "auto" }}
        >
          {user && (
            user.avatar_url ? (
              <Link href={`/profile/${user.id}`}>
                <img
                  src={user.avatar_url}
                  alt={user.full_name || ""}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link href={`/profile/${user.id}`}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--m3-surface-container-high)",
                    color: "var(--m3-on-surface-variant)",
                  }}
                >
                  <User className="w-4 h-4" />
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}

function MobileDrawer({
  open,
  onClose,
  user,
  onSignIn,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSignIn: (response: CredentialResponse) => void;
  onSignOut: () => void;
}) {
  const links = [
    { href: "/", label: "Главная" },
    { href: "/#features", label: "Возможности" },
    { href: "/#download", label: "Скачать" },
    { href: "/market", label: "Маркет" },
    { href: "/branding", label: "Брендинг" },
    { href: "/docs", label: "Документация" },
    { href: "/#roadmap", label: "Roadmap" },
  ];

  return (
    <>
      <div
        className={`m3-drawer-scrim ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`m3-drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Меню навигации"
      >
        <div className="m3-drawer-header">
          <button
            onClick={onClose}
            className="m3-icon-button"
            aria-label="Закрыть меню"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="m3-drawer-list">
          {links.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="m3-drawer-item"
            >
              <span>{link.label}</span>
            </Link>
          ))}

          <div
            style={{
              height: 1,
              margin: "8px 16px",
              background: "var(--m3-outline-variant)",
            }}
          />

          {links.slice(4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="m3-drawer-item"
            >
              <span>{link.label}</span>
            </Link>
          ))}

          <div
            style={{
              height: 1,
              margin: "8px 16px",
              background: "var(--m3-outline-variant)",
            }}
          />
          {user ? (
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="m3-drawer-item w-full text-left"
              style={{ background: "transparent", border: "none" }}
            >
              <LogOut className="w-5 h-5 mr-2" style={{ color: "var(--m3-on-surface-variant)" }} />
              <span>Выйти</span>
            </button>
          ) : (
            <div className="m3-drawer-item" style={{ justifyContent: "center" }}>
              <GoogleSignInButton onSuccess={(r) => { onSignIn(r); onClose(); }} />
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}