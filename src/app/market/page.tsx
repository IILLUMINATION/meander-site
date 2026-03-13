"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  Download,
  Heart,
  Clock,
  User,
  LogOut,
  Filter,
  Grid3X3,
  List,
  Search,
  CheckCircle,
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

const genreOptions = [
  "Приключения",
  "Фантастика",
  "Фэнтези",
  "Хоррор",
  "Детектив",
  "Романтика",
  "Комедия",
  "Драма",
  "Исторический",
  "Другое",
];

export default function MarketPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Загрузка пользователя из localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("meander_user");
    const savedToken = localStorage.getItem("meander_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Загрузка квестов
  useEffect(() => {
    loadQuests();
  }, [sortBy]);

  const loadQuests = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("meander_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_URL}/quests`, { headers });
      let loadedQuests: Quest[] = response.data;

      // Фильтрация по жанру
      if (selectedGenre !== "all") {
        loadedQuests = loadedQuests.filter(
          (q) => q.genres?.includes(selectedGenre) || q.category === selectedGenre
        );
      }

      // Поиск
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        loadedQuests = loadedQuests.filter(
          (q) =>
            q.title.toLowerCase().includes(query) ||
            q.description?.toLowerCase().includes(query)
        );
      }

      // Сортировка
      if (sortBy === "popular") {
        loadedQuests.sort((a, b) => b.like_count - a.like_count);
      } else if (sortBy === "downloads") {
        loadedQuests.sort((a, b) => b.downloads_count - a.downloads_count);
      } else if (sortBy === "newest") {
        loadedQuests.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "updated") {
        loadedQuests.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      }

      setQuests(loadedQuests);
    } catch (err: any) {
      console.error("Failed to load quests:", err);
      setError(err.message || "Не удалось загрузить квесты");
    } finally {
      setLoading(false);
    }
  };

  // Обработка входа через Google
  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        console.error("No credential received");
        return;
      }

      // Отправляем ID токен на бэкенд
      const response = await axios.post(`${API_URL}/auth/google/token`, {
        idToken: credentialResponse.credential,
      });

      const { token, user } = response.data;
      
      // Сохраняем в localStorage
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " Б";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " КБ";
    return (bytes / (1024 * 1024)).toFixed(1) + " МБ";
  };

  const handleDownload = async (questId: string) => {
    try {
      // Отмечаем скачивание на сервере
      if (user) {
        await axios.post(
          `${API_URL}/quests/${questId}/download`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("meander_token")}`,
            },
          }
        );
      }
      // Скачивание файла
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
        { is_like: isLike },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("meander_token")}`,
          },
        }
      );
      loadQuests(); // Обновляем после голосования
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || ""}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-neutral-300">{user.full_name}</span>
                  {user.is_verified && (
                    <CheckCircle className="w-4 h-4 text-accent" />
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-neutral-400 hover:text-accent transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
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

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-6">
              <span className="text-accent">Маркет квестов</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Открывай и создавай текстовые квесты. Публикуй свои истории и проходи чужие.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Поиск квестов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadQuests()}
                  className="pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-foreground placeholder-neutral-500 focus:outline-none focus:border-accent/50 w-64"
                />
              </div>

              {/* Genre Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-neutral-500" />
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setTimeout(loadQuests, 0);
                  }}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
                >
                  <option value="all">Все жанры</option>
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
              >
                <option value="popular">Популярные</option>
                <option value="downloads">По скачиваниям</option>
                <option value="newest">Новые</option>
                <option value="updated">Обновлённые</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-accent text-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-foreground"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-accent text-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-foreground"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Quests Grid/List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="text-neutral-500">Загрузка квестов...</div>
            </div>
          ) : quests.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-neutral-500">
                {searchQuery || selectedGenre !== "all"
                  ? "Квесты не найдены"
                  : "Квесты пока не опубликованы"}
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={
                    viewMode === "grid"
                      ? "bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-900 hover:border-accent/30 transition-colors"
                      : "bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-900 hover:border-accent/30 transition-colors flex"
                  }
                >
                  {/* Preview Image */}
                  <div
                    className={
                      viewMode === "grid"
                        ? "aspect-video bg-neutral-950 flex items-center justify-center"
                        : "w-48 aspect-square bg-neutral-950 flex items-center justify-center flex-shrink-0"
                    }
                  >
                    {quest.preview_image_url ? (
                      <img
                        src={quest.preview_image_url}
                        alt={quest.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-neutral-600 text-4xl">🎮</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium">{quest.title}</h3>
                      {quest.is_demo && (
                        <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                          Демо
                        </span>
                      )}
                    </div>

                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                      {quest.description}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <User className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-400">
                        {quest.author_name || "Аноним"}
                      </span>
                      {quest.author_is_verified && (
                        <CheckCircle className="w-3 h-3 text-accent" />
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Heart className="w-4 h-4" />
                        <span>{quest.like_count}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Download className="w-4 h-4" />
                        <span>{quest.downloads_count}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-4 h-4" />
                        <span>{quest.estimated_playtime} мин</span>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quest.genres?.slice(0, 3).map((genre, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownload(quest.id)}
                        className="flex-1 px-4 py-2 bg-accent hover:bg-accent-hover text-black text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Скачать
                      </button>
                      <button
                        onClick={() => handleVote(quest.id, true)}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-accent"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto text-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} IILLUMINAT. Meander. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
