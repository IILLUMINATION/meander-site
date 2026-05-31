"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CredentialResponse } from "@react-oauth/google";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import QuestCover from "@/components/QuestCover";
import {
  LogOut,
  CheckCircle,
  Star,
  Download,
  Heart,
  Share2,
  MoreVertical,
  Users,
  Grid3x3,
  Library,
  Zap,
  ChevronRight,
  Edit3,
  ArrowLeft,
} from "lucide-react";

const API_URL = "/api/be";

interface UserProfile {
  id: string;
  google_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  role: string;
  created_at: string;
  followers_count: number;
  following_count: number;
  bio: string | null;
  streak_count: number;
  last_activity_date: string | null;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  author_name?: string;
  preview_image_url: string | null;
  download_url: string;
  version: string;
  like_count: number;
  downloads_count: number;
  average_rating: number;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: string;
  quest_id: string;
  quest_title?: string;
  author_id: string;
  author_name: string;
  text_content: string;
  rating: number | null;
  created_at: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  xp_reward: number;
  is_secret: boolean;
  category: string;
  achieved_at: string;
}

interface CurrentUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
}

const achievementIcons: Record<string, string> = {
  "publisher_debut": "🎉",
  "first_step": "👣",
  "bookworm": "📚",
  "library_keeper": "📖",
  "generous": "💝",
  "critic": "✍️",
  "explorer": "🗺️",
  "early_adopter": "🚀",
  "verified_author": "✓",
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quests" | "reviews" | "achievements">("quests");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("meander_user");
    const savedToken = localStorage.getItem("meander_token");
    if (savedUser && savedToken) {
      const user = JSON.parse(savedUser);
      setCurrentUser({
        id: user.id,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
      });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && currentUser && currentUser.id !== userId) {
      loadFollowStatus();
    }
  }, [userId, currentUser]);

  const getTokenHeaders = () => {
    const token = localStorage.getItem("meander_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, questsRes, reviewsRes, achievementsRes] = await Promise.all([
        axios.get(`${API_URL}/profiles/${userId}`),
        axios.get(`${API_URL}/profiles/${userId}/quests`),
        axios.get(`${API_URL}/profiles/${userId}/reviews`),
        axios.get(`${API_URL}/profiles/${userId}/achievements`),
      ]);

      setProfile(profileRes.data);
      setQuests(questsRes.data || []);
      setReviews(reviewsRes.data || []);
      setAchievements(achievementsRes.data || []);
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      setError(err.response?.data?.error || "Не удалось загрузить профиль");
    } finally {
      setLoading(false);
    }
  };

  const loadFollowStatus = async () => {
    const token = localStorage.getItem("meander_token");
    if (!token || !currentUser || currentUser.id === userId) return;

    try {
      const followRes = await axios.get(
        `${API_URL}/profiles/${userId}/is-following`,
        { headers: getTokenHeaders() }
      );
      setIsFollowing(followRes.data.isFollowing || false);
    } catch (e) {
      console.log("Could not load follow status:", e);
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
      setCurrentUser({
        id: user.id,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
      });
      setTimeout(loadProfileData, 100);
    } catch (err: any) {
      console.error("Sign in error:", err);
      alert("Ошибка входа: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("meander_user");
    localStorage.removeItem("meander_token");
    setCurrentUser(null);
    setIsFollowing(false);
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert("Войдите чтобы подписаться");
      return;
    }

    try {
      setFollowLoading(true);
      await axios.post(
        `${API_URL}/profiles/${userId}/follow`,
        { is_following: !isFollowing },
        { headers: getTokenHeaders() }
      );
      setIsFollowing(!isFollowing);
      await loadProfileData();
    } catch (err: any) {
      console.error("Follow error:", err);
      alert("Ошибка: " + (err.response?.data?.error || err.message));
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    alert("Ссылка скопирована в буфер обмена");
  };

  const isOwnProfile = currentUser?.id === userId;
  const totalLikes = quests.reduce((sum, q) => sum + (q.like_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neutral-400">Загрузка...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          currentUser={currentUser}
          onSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
          title="Профиль не найден"
        />
        <div className="pt-32 px-6 max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-neutral-400 mb-4">{error || "Профиль не найден"}</div>
            <Link href="/market" className="text-accent hover:underline">
              Вернуться в маркет
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ProfileSidebar = (
    <div className="w-full">
      <div className="relative mb-14 sm:mb-16">
        <div className="profile-banner relative w-full aspect-[16/8] sm:aspect-[16/7] lg:aspect-[20/8] rounded-3xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-[20%] right-[15%] text-white/30 text-2xl">✦</span>
            <span className="absolute top-[35%] right-[28%] text-white/20 text-xl">✦</span>
            <span className="absolute top-[55%] right-[10%] text-white/25 text-lg">✦</span>
            <span className="absolute top-[40%] right-[8%] w-12 h-3 rounded-full bg-white/10 blur-sm" />
            <span className="absolute bottom-[20%] right-[20%] w-8 h-2 rounded-full bg-white/10 blur-sm" />
          </div>

          {profile.is_verified && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-white">Проверенный</span>
            </div>
          )}
        </div>

        <div className="absolute -bottom-10 left-4 sm:left-5">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || ""}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-background"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-2xl font-bold border-4 border-background">
              {getInitials(profile.full_name)}
            </div>
          )}
        </div>
      </div>

      <div className="px-1 mb-5">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground truncate">
            {profile.full_name || "Аноним"}
          </h2>
          <div className="hidden lg:block">
            <ProfileMenu
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              menuRef={menuRef}
              onShare={handleShare}
            />
          </div>
        </div>
        <p className="text-sm text-neutral-400">
          С нами с {new Date(profile.created_at).toLocaleDateString("ru-RU", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>

      {profile.bio && (
        <div className="px-1 mb-5">
          <div className="bg-[var(--m3-surface-container)] rounded-2xl px-5 py-4">
            <p className="text-[15px] text-neutral-200 leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </div>
        </div>
      )}

      {!isOwnProfile && (
        <div className="px-1 mb-5">
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`w-full py-3 rounded-full font-medium transition-colors ${
              isFollowing
                ? "bg-[var(--m3-surface-container)] hover:bg-[var(--m3-surface-container-high)] text-foreground"
                : "bg-accent hover:bg-accent-hover text-black"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {followLoading ? "Загрузка..." : isFollowing ? "Отписаться" : "Подписаться"}
          </button>
        </div>
      )}

      <div className="px-1 mb-5">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <StatTile
            icon={<Grid3x3 className="w-5 h-5 text-neutral-300" />}
            value={quests.length}
            label="Квесты"
          />
          <StatTile
            icon={<Heart className="w-5 h-5 text-neutral-300" />}
            value={totalLikes}
            label="Лайки"
          />
          <StatTile
            icon={<Users className="w-5 h-5 text-neutral-300" />}
            value={profile.followers_count}
            label="Подписч."
          />
          <StatTile
            icon={<Library className="w-5 h-5 text-neutral-300" />}
            value={profile.following_count}
            label="Подписки"
          />
        </div>
      </div>

      {profile.streak_count > 0 && (
        <div className="px-1 mb-6">
          <div className="flex items-center justify-between bg-[var(--m3-surface-container)] rounded-2xl px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-[15px] font-medium text-foreground">Серия активности</div>
                <div className="text-xs text-neutral-400">{profile.streak_count} дней подряд</div>
              </div>
            </div>
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      )}
    </div>
  );

  const TabsContent = (
    <div className="w-full">
      <div className="px-1 mb-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <TabChip
            active={activeTab === "quests"}
            onClick={() => setActiveTab("quests")}
            icon={<Library className="w-4 h-4" />}
            label="Публикации"
          />
          <TabChip
            active={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
            icon={<Star className="w-4 h-4" />}
            label="Отзывы"
          />
          <TabChip
            active={activeTab === "achievements"}
            onClick={() => setActiveTab("achievements")}
            icon={<Zap className="w-4 h-4" />}
            label="Достижения"
          />
        </div>
      </div>

      <div className="px-1">
        {activeTab === "quests" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {quests.length === 0 ? (
              <div className="col-span-full text-center py-16 text-neutral-500">
                У пользователя пока нет квестов
              </div>
            ) : (
              quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                У пользователя пока нет отзывов
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {achievements.length === 0 ? (
              <div className="col-span-full text-center py-16 text-neutral-500">
                У пользователя пока нет достижений
              </div>
            ) : (
              achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentUser={currentUser}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        title={profile.full_name || "Профиль"}
      />

      <main className="pt-6 pb-24 px-4 sm:px-6">
        <div className="max-w-xl lg:max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-8">
          <div className="lg:self-start">
            {ProfileSidebar}
          </div>
          <div className="lg:pt-2">
            {TabsContent}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProfileMenu({
  menuOpen,
  setMenuOpen,
  menuRef,
  onShare,
}: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onShare: () => void;
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v: boolean) => !v)}
        className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-neutral-300"
        title="Меню"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[180px] rounded-2xl bg-[var(--m3-surface-container-high)] border border-white/10 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <button
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              onShare();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-white/5 transition-colors text-left"
          >
            <Share2 className="w-4 h-4 text-neutral-300" />
            <span>Поделиться</span>
          </button>
        </div>
      )}
    </div>
  );
}

function TabChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "bg-accent/15 text-accent border border-accent/30"
          : "bg-transparent text-neutral-300 border border-neutral-800 hover:border-neutral-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-[var(--m3-surface-container)] rounded-2xl px-3 py-4 flex flex-col items-center justify-center gap-1.5">
      <div className="opacity-80">{icon}</div>
      <div className="text-xl sm:text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-[11px] sm:text-xs text-neutral-400 text-center leading-tight">{label}</div>
    </div>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <Link
      href={`/market/${quest.id}`}
      className="bg-[var(--m3-surface-container)] rounded-2xl overflow-hidden hover:bg-[var(--m3-surface-container-high)] transition-colors"
    >
      <div className="aspect-video bg-neutral-950">
        <QuestCover
          src={quest.preview_image_url}
          alt={quest.title}
          className="m3-profile-quest-cover"
          imgClassName="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium line-clamp-1 text-foreground">{quest.title}</h3>
        <p className="text-neutral-400 text-sm line-clamp-2">{quest.description}</p>
        <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{quest.like_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{quest.downloads_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{typeof quest.average_rating === 'number' ? quest.average_rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-[var(--m3-surface-container)] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-2">
        <Link
          href={`/market/${review.quest_id}`}
          className="font-medium text-accent hover:underline"
        >
          {review.quest_title || "Квест"}
        </Link>
        {review.rating && review.rating > 0 && (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  review.rating && star <= review.rating
                    ? "fill-accent text-accent"
                    : "text-neutral-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {review.text_content && (
        <p className="text-neutral-200 text-[15px] leading-relaxed mb-2">
          {review.text_content}
        </p>
      )}
      <div className="text-xs text-neutral-500">
        {new Date(review.created_at).toLocaleDateString("ru-RU", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const icon = achievementIcons[achievement.id] || "🏆";

  return (
    <div className="bg-[var(--m3-surface-container)] rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1 text-foreground truncate">{achievement.name}</h3>
          <p className="text-neutral-400 text-sm mb-2 line-clamp-2">{achievement.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              {new Date(achievement.achieved_at).toLocaleDateString("ru-RU")}
            </span>
            {achievement.xp_reward > 0 && (
              <span className="text-accent font-medium">+{achievement.xp_reward} XP</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({
  currentUser,
  onSignIn,
  onSignOut,
  title,
}: {
  currentUser: CurrentUser | null;
  onSignIn: (response: CredentialResponse) => void;
  onSignOut: () => void;
  title?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: title || "Meander", url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {}
    setMenuOpen(false);
  };

  return (
    <header className="m3-top-app-bar">
      <div className="m3-top-app-bar-inner">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = "/market";
            }
          }}
          className="m3-back-button"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Link href="/" className="m3-logo m3-logo-link">
          <img src="/images/logo.svg" alt="Meander" className="h-7 md:h-8 w-auto" />
        </Link>
        {title && <span className="m3-header-title-mobile">{title}</span>}

        <div className="m3-header-end">
          {currentUser ? (
            <Link href={`/profile/${currentUser.id}`} className="flex items-center gap-2 m3-header-user">
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name || ""}
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{
                    background: "var(--m3-surface-container-high)",
                    color: "var(--m3-on-surface-variant)",
                    fontSize: 12,
                  }}
                >
                  {getInitials(currentUser.full_name)}
                </div>
              )}
              <span className="hidden sm:inline m3-body-medium">{currentUser.full_name}</span>
              {currentUser.is_verified && (
                <CheckCircle className="w-4 h-4" style={{ color: "var(--m3-primary)" }} />
              )}
            </Link>
          ) : (
            <GoogleSignInButton onSuccess={onSignIn} />
          )}

          {currentUser && (
            <button
              type="button"
              className="m3-icon-button"
              onClick={onSignOut}
              aria-label="Выйти"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="m3-nav-desktop">
          <Link href="/market">Маркет</Link>
        </nav>
      </div>
    </header>
  );
}

function getInitials(name: string | null) {
  if (!name || name.length === 0) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}