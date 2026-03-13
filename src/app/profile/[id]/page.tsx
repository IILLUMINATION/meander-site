"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  User,
  LogOut,
  CheckCircle,
  Calendar,
  Star,
  Download,
  Heart,
  MessageSquare,
  Award,
  Share2,
  ExternalLink,
  Flag,
} from "lucide-react";

const API_URL = "https://backend.meander.sbs";

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
    // Загружаем статус подписки после загрузки currentUser
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
      // Обновляем профиль для обновления счётчиков подписчиков
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

  const handleReport = () => {
    alert("Функция жалобы будет добавлена позже");
  };

  const isOwnProfile = currentUser?.id === userId;

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
        />
        <div className="pt-32 px-6 max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-neutral-400 mb-4">{error || "Профиль не найден"}</div>
            <Link href="/market" className="text-accent hover:underline">
              ← Вернуться в маркет
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentUser={currentUser}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-neutral-900/50 rounded-lg p-8 mb-8 border border-neutral-900">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || ""}
                    className="w-32 h-32 rounded-full object-cover border-2 border-accent/30"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-4xl font-bold border-2 border-accent/30">
                    {getInitials(profile.full_name)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-light">{profile.full_name || "Аноним"}</h1>
                      {profile.is_verified && (
                        <CheckCircle className="w-6 h-6 text-accent" />
                      )}
                      {profile.role === 'admin' && (
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded">
                          Администратор
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        На сайте с {new Date(profile.created_at).toLocaleDateString("ru-RU", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleShare}
                      className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleReport}
                      className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-neutral-300 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-light text-accent">{quests.length}</span>
                    <span className="text-neutral-400">квестов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-light text-accent">{profile.followers_count}</span>
                    <span className="text-neutral-400">подписчиков</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-light text-accent">{profile.following_count}</span>
                    <span className="text-neutral-400">подписок</span>
                  </div>
                  {profile.streak_count > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-light text-accent">🔥 {profile.streak_count}</span>
                      <span className="text-neutral-400">дней подряд</span>
                    </div>
                  )}
                </div>

                {/* Follow Button */}
                {!isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        : "bg-accent hover:bg-accent-hover text-black"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {followLoading ? "Загрузка..." : isFollowing ? "Отписаться" : "Подписаться"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-neutral-900">
            <button
              onClick={() => setActiveTab("quests")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "quests"
                  ? "text-accent border-b-2 border-accent"
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              Квесты ({quests.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "text-accent border-b-2 border-accent"
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              Отзывы ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "achievements"
                  ? "text-accent border-b-2 border-accent"
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              Достижения ({achievements.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "quests" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quests.length === 0 ? (
                <div className="col-span-full text-center py-20 text-neutral-500">
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
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-20 text-neutral-500">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.length === 0 ? (
                <div className="col-span-full text-center py-20 text-neutral-500">
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
      </main>

      <Footer />
    </div>
  );
}

// Quest Card Component
function QuestCard({ quest }: { quest: Quest }) {
  return (
    <Link
      href={`/market/${quest.id}`}
      className="bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-900 hover:border-accent/30 transition-colors"
    >
      <div className="aspect-video bg-neutral-950">
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
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-medium line-clamp-1">{quest.title}</h3>
        <p className="text-neutral-400 text-sm line-clamp-2">{quest.description}</p>
        <div className="flex items-center gap-4 text-xs text-neutral-400">
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

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-neutral-900/30 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <Link
          href={`/market/${review.quest_id}`}
          className="font-medium text-accent hover:underline"
        >
          {review.quest_title || "Квест"}
        </Link>
        {review.rating && review.rating > 0 && (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? "fill-accent text-accent"
                    : "text-neutral-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {review.text_content && (
        <p className="text-neutral-300 leading-relaxed mb-3">
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

// Achievement Card Component
function AchievementCard({ achievement }: { achievement: Achievement }) {
  const icon = achievementIcons[achievement.id] || "🏆";

  return (
    <div className="bg-neutral-900/30 rounded-lg p-4 border border-neutral-900">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{achievement.name}</h3>
          <p className="text-neutral-400 text-sm mb-2">{achievement.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              {new Date(achievement.achieved_at).toLocaleDateString("ru-RU")}
            </span>
            {achievement.xp_reward > 0 && (
              <span className="text-accent">+{achievement.xp_reward} XP</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header({
  currentUser,
  onSignIn,
  onSignOut,
}: {
  currentUser: CurrentUser | null;
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
            href="/market"
            className="text-sm text-neutral-400 hover:text-accent transition-colors"
          >
            Маркет
          </Link>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link
                href={`/profile/${currentUser.id}`}
                className="flex items-center gap-2"
              >
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name || ""}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold">
                    {getInitials(currentUser.full_name)}
                  </div>
                )}
                <span className="text-sm text-neutral-300">{currentUser.full_name}</span>
                {currentUser.is_verified && (
                  <CheckCircle className="w-4 h-4 text-accent" />
                )}
              </Link>
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

// Helper function
function getInitials(name: string | null) {
  if (!name || name.length === 0) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
