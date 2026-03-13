"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  Download,
  Heart,
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
} from "lucide-react";

const API_URL = "https://backend.meander.sbs";

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
  const [error, setError] = useState<string | null>(null);

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

  const getTokenHeaders = () => {
    const token = localStorage.getItem("meander_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadQuests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/quests`, { headers: getTokenHeaders() });
      setAllQuests(response.data);
    } catch (err: any) {
      console.error("Failed to load quests:", err);
      setError(err.message || "Не удалось загрузить квесты");
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
      window.open(`${API_URL}/quests/${questId}/file`, "_blank");
    } catch (err) {
      console.error("Download error:", err);
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
        { action: 'set', is_like: isLike },
        { headers: getTokenHeaders() }
      );
      // Перезагружаем все квесты для обновления счётчиков
      await loadQuests();
    } catch (err: any) {
      console.error("Vote error:", err);
      alert("Ошибка голосования: " + (err.response?.data?.error || err.message));
    }
  };

  // Фильтрация и сортировка
  const getFilteredQuests = (questList: Quest[], category: string | null) => {
    let filtered = [...questList];

    if (category === "verified") {
      return filtered.filter(q => q.author_is_verified);
    }
    if (category === "trending") {
      return filtered.sort((a, b) => {
        const scoreA = a.downloads_count + (a.like_count * 5);
        const scoreB = b.downloads_count + (b.like_count * 5);
        return scoreB - scoreA;
      }).slice(0, 10);
    }
    if (category) {
      filtered = filtered.filter(q => 
        q.genres.includes(category) || q.category === category
      );
    }

    return filtered;
  };

  const filteredQuests = getFilteredQuests(
    searchQuery 
      ? allQuests.filter(q => 
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allQuests,
    selectedCategory
  );

  const newQuests = allQuests
    .filter(q => !q.is_demo)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  const popularQuests = allQuests
    .filter(q => !q.is_demo)
    .sort((a, b) => {
      const scoreA = a.downloads_count + (a.like_count * 5);
      const scoreB = b.downloads_count + (b.like_count * 5);
      return scoreB - scoreA;
    })
    .slice(0, 10);

  const verifiedQuests = allQuests
    .filter(q => q.author_is_verified && !q.is_demo);

  const undiscoveredQuests = allQuests
    .filter(q => q.downloads_count < 100 && !q.is_demo)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  const demoQuests = allQuests.filter(q => q.is_demo);

  const featuredQuests = allQuests
    .filter(q => q.is_featured)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Найти историю..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-foreground placeholder-neutral-500 focus:outline-none focus:border-accent/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-foreground"
                >
                  <span className="text-lg">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key ?? "all"}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? "bg-accent text-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          {!searchQuery && !selectedCategory && (
            <>
              {/* Editor's Choice */}
              {featuredQuests.length > 0 && (
                <section className="mb-12">
                  <SectionHeader 
                    icon={<Sparkles className="w-5 h-5" />} 
                    title="Выбор редакции" 
                  />
                  <HorizontalQuestList 
                    quests={featuredQuests}
                    onDownload={handleDownload}
                    onVote={handleVote}
                  />
                </section>
              )}

              {/* Undiscovered Gems */}
              <section className="mb-12">
                <SectionHeader 
                  icon={<Diamond className="w-5 h-5" />} 
                  title="Скрытые алмазы"
                  subtitle="Попробуй что-то новое от начинающих авторов"
                />
                <HorizontalQuestList 
                  quests={undiscoveredQuests}
                  onDownload={handleDownload}
                  onVote={handleVote}
                />
              </section>

              {/* Trending */}
              <section className="mb-12">
                <SectionHeader 
                  icon={<TrendingUp className="w-5 h-5" />} 
                  title="В тренде" 
                />
                <HorizontalQuestList 
                  quests={popularQuests}
                  onDownload={handleDownload}
                  onVote={handleVote}
                />
              </section>

              {/* New Releases */}
              <section className="mb-12">
                <SectionHeader 
                  icon={<Star className="w-5 h-5" />} 
                  title="Библиотека новинок" 
                />
                <QuestGrid 
                  quests={newQuests}
                  onDownload={handleDownload}
                  onVote={handleVote}
                />
              </section>

              {/* Demo Versions */}
              {demoQuests.length > 0 && (
                <section className="mb-12">
                  <SectionHeader 
                    icon={<FlaskConical className="w-5 h-5" />} 
                    title="Демо версии"
                    subtitle="Недоделанные квесты. Секция для тестов и отзывов."
                  />
                  <HorizontalQuestList 
                    quests={demoQuests.slice(0, 10)}
                    onDownload={handleDownload}
                    onVote={handleVote}
                  />
                </section>
              )}
            </>
          )}

          {/* Search Results / Category Filter */}
          {(searchQuery || selectedCategory) && (
            <section className="mb-12">
              <SectionHeader 
                icon={<Search className="w-5 h-5" />} 
                title={
                  searchQuery 
                    ? `Результаты поиска: "${searchQuery}"`
                    : categories.find(c => c.key === selectedCategory)?.label || "Фильтр"
                }
              />
              <QuestGrid 
                quests={filteredQuests}
                onDownload={handleDownload}
                onVote={handleVote}
              />
            </section>
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="text-neutral-500">Загрузка квестов...</div>
            </div>
          )}

          {!loading && filteredQuests.length === 0 && (searchQuery || selectedCategory) && (
            <div className="text-center py-20">
              <div className="text-neutral-500">Квесты не найдены</div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Section Header Component
function SectionHeader({ 
  icon, 
  title, 
  subtitle 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-accent">{icon}</span>
        <h2 className="text-xl font-medium">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-neutral-500 text-sm">{subtitle}</p>
      )}
    </div>
  );
}

// Horizontal Quest List (for featured sections)
function HorizontalQuestList({ 
  quests, 
  onDownload, 
  onVote 
}: { 
  quests: Quest[]; 
  onDownload: (id: string) => void;
  onVote: (id: string, isLike: boolean) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {quests.map((quest) => (
        <QuestCard 
          key={quest.id} 
          quest={quest} 
          compact 
          onDownload={() => onDownload(quest.id)}
          onVote={(isLike) => onVote(quest.id, isLike)}
        />
      ))}
    </div>
  );
}

// Quest Grid
function QuestGrid({ 
  quests, 
  onDownload, 
  onVote 
}: { 
  quests: Quest[]; 
  onDownload: (id: string) => void;
  onVote: (id: string, isLike: boolean) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

// Quest Card Component
function QuestCard({ 
  quest, 
  compact = false,
  onDownload,
  onVote,
}: { 
  quest: Quest; 
  compact?: boolean;
  onDownload: () => void;
  onVote: (isLike: boolean) => void;
}) {
  return (
    <div
      className={`bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-900 hover:border-accent/30 transition-colors ${
        compact ? "min-w-[160px] w-[160px]" : ""
      }`}
    >
      {/* Cover Image */}
      <Link
        href={`/market/${quest.id}`}
        className={`block bg-neutral-950 ${compact ? "aspect-[3/4]" : "aspect-video"}`}
      >
        {quest.preview_image_url ? (
          <img
            src={quest.preview_image_url}
            alt={quest.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-600 text-4xl">
            🎮
          </div>
        )}
      </Link>

      {/* Content */}
      <div className={`p-4 ${compact ? "space-y-2" : "space-y-3"}`}>
        <Link
          href={`/market/${quest.id}`}
          className="block"
        >
          <div className="flex items-start justify-between">
            <h3 className={`font-medium line-clamp-1 ${compact ? "text-sm" : ""}`}>
              {quest.title}
            </h3>
            {quest.is_demo && (
              <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded">
                Демо
              </span>
            )}
          </div>
        </Link>

        {!compact && (
          <p className="text-neutral-400 text-sm line-clamp-2">
            {quest.description}
          </p>
        )}

        {/* Author */}
        <div className="flex items-center gap-2 text-sm">
          <User className="w-3 h-3 text-neutral-500" />
          {quest.author_id ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/profile/${quest.author_id}`;
              }}
              className="text-neutral-400 truncate hover:text-accent transition-colors cursor-pointer"
            >
              {quest.author_name || "Аноним"}
            </span>
          ) : (
            <span className="text-neutral-400 truncate">
              {quest.author_name || "Аноним"}
            </span>
          )}
          {quest.author_is_verified && (
            <CheckCircle className="w-3 h-3 text-accent flex-shrink-0" />
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{quest.like_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{quest.downloads_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{quest.estimated_playtime} мин</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="flex-1 px-3 py-2 bg-accent hover:bg-accent-hover text-black text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            {!compact && "Скачать"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header({
  user,
  onSignIn,
  onSignOut,
}: {
  user: UserProfile | null;
  onSignIn: (response: CredentialResponse) => void;
  onSignOut: () => void;
}) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-900">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/лого свг без фона.svg"
            alt="Meander"
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-accent transition-colors"
          >
            На главную
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  <Link href={`/profile/${user.id}`}>
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || ""}
                      className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-accent transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </Link>
                ) : (
                  <Link href={`/profile/${user.id}`}>
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 hover:ring-2 hover:ring-accent transition-all">
                      <User className="w-4 h-4" />
                    </div>
                  </Link>
                )}
                <Link
                  href={`/profile/${user.id}`}
                  className="text-sm text-neutral-300 hover:text-accent transition-colors"
                >
                  {user.full_name}
                </Link>
                {user.is_verified && (
                  <CheckCircle className="w-4 h-4 text-accent" />
                )}
              </div>
              <button
                onClick={onSignOut}
                className="p-2 text-neutral-400 hover:text-accent transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={onSignIn}
              onError={() => alert("Ошибка входа через Google")}
              text="signin_with"
              theme="filled_black"
              size="medium"
              width={120}
            />
          )}
        </div>
      </nav>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto text-center text-neutral-600 text-sm">
        <p>© {new Date().getFullYear()} IILLUMINAT. Meander. Все права защищены.</p>
      </div>
    </footer>
  );
}
