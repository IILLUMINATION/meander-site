"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { CredentialResponse } from "@react-oauth/google";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import QuestCover from "@/components/QuestCover";
import {
  Download,
  Heart,
  Clock,
  LogOut,
  CheckCircle,
  Star,
  Share2,
  Flag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Edit2,
  X,
  ArrowLeft,
} from "lucide-react";

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

interface Review {
  id: string;
  quest_id: string;
  author_id: string;
  author_name: string;
  author_avatar_url: string | null;
  text_content: string;
  rating: number | null;
  created_at: string;
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

const genreTranslations: Record<string, string> = {
  "Fantasy": "Фэнтези",
  "Sci-Fi": "Фантастика",
  "Horror": "Ужасы",
  "Adventure": "Приключения",
  "Mystery": "Мистика",
  "Romance": "Романтика",
  "Comedy": "Комедия",
  "Thriller": "Триллер",
  "Historical": "Исторический",
  "Drama": "Драма",
};

function getInitials(name: string | null) {
  if (!name || name.length === 0) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function QuestDetailPage() {
  const params = useParams();
  const questId = params?.id as string;

  const [quest, setQuest] = useState<Quest | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [userReview, setUserReview] = useState<{ rating: number; text_content: string; hasData: boolean } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("meander_user");
    const savedToken = localStorage.getItem("meander_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (questId) {
      loadQuestData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questId, user]);

  const getTokenHeaders = () => {
    const token = localStorage.getItem("meander_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadQuestData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [questRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/quests/${questId}`, { headers: getTokenHeaders() }),
        axios.get(`${API_URL}/quests/${questId}/reviews`, { headers: getTokenHeaders() }),
      ]);

      setQuest(questRes.data);
      setReviews(reviewsRes.data || []);

      const token = localStorage.getItem("meander_token");
      if (token) {
        try {
          const voteRes = await axios.get(`${API_URL}/quests/${questId}/my-vote`, { headers: getTokenHeaders() });
          if (voteRes.data && voteRes.data.is_like !== undefined) {
            setUserVote(voteRes.data.is_like);
          } else {
            setUserVote(null);
          }
        } catch {
          setUserVote(null);
        }

        try {
          const reviewRes = await axios.get(`${API_URL}/quests/${questId}/my-review`, { headers: getTokenHeaders() });
          const hasRating = reviewRes.data && reviewRes.data.rating !== undefined && reviewRes.data.rating !== null && reviewRes.data.rating > 0;
          const hasText = reviewRes.data && reviewRes.data.text_content && reviewRes.data.text_content.trim().length > 0;

          if (hasRating || hasText) {
            setUserReview({
              rating: reviewRes.data.rating || 0,
              text_content: reviewRes.data.text_content || "",
              hasData: true,
            });
            if (hasText) {
              setReviewText(reviewRes.data.text_content);
              setReviewRating(reviewRes.data.rating || 5);
            } else if (hasRating) {
              setReviewRating(reviewRes.data.rating);
              setIsEditingReview(true);
            }
          } else {
            setUserReview(null);
            setReviewText("");
            setReviewRating(5);
            setIsEditingReview(false);
          }
        } catch {
          setUserReview(null);
          setReviewText("");
          setReviewRating(5);
          setIsEditingReview(false);
        }
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Не удалось загрузить квест");
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
      const { token, user: u } = response.data;
      localStorage.setItem("meander_token", token);
      localStorage.setItem("meander_user", JSON.stringify(u));
      setUser(u);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      alert("Ошибка входа: " + (e.response?.data?.error || e.message));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("meander_user");
    localStorage.removeItem("meander_token");
    setUser(null);
    setUserVote(null);
    setUserReview(null);
    setReviewText("");
    setReviewRating(5);
    setIsEditingReview(false);
  };

  const handleDownload = async () => {
    try {
      if (user) {
        await axios.post(
          `${API_URL}/quests/${questId}/download`,
          {},
          { headers: getTokenHeaders() }
        );
      }
      const res = await axios.get(`${API_URL}/quests/${questId}/file`, {
        headers: getTokenHeaders(),
        responseType: "blob",
      });
      const safeTitle = (quest?.title || "quest")
        .replace(/[\\/:*?"<>|]+/g, "")
        .trim() || "quest";
      const filename = `${safeTitle}.mnd`;
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

  const handleVote = async (isLike: boolean) => {
    if (!user) {
      alert("Войдите чтобы голосовать");
      return;
    }
    try {
      const action = userVote === isLike ? "remove" : "set";
      await axios.post(
        `${API_URL}/quests/${questId}/vote`,
        { action, is_like: isLike },
        { headers: getTokenHeaders() }
      );
      setUserVote(userVote === isLike ? null : isLike);
      await loadQuestData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      alert("Ошибка голосования: " + (e.response?.data?.error || e.message));
    }
  };

  const submitReview = async () => {
    if (!user) {
      alert("Войдите чтобы оставить отзыв");
      return;
    }
    if (!reviewText.trim() && !reviewRating) {
      alert("Введите текст отзыва или поставьте оценку");
      return;
    }
    try {
      setIsSubmittingReview(true);
      await axios.post(
        `${API_URL}/quests/${questId}/review`,
        { text_content: reviewText, rating: reviewRating },
        { headers: getTokenHeaders() }
      );
      setUserReview({ rating: reviewRating, text_content: reviewText, hasData: true });
      setIsEditingReview(false);
      await loadQuestData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      alert("Ошибка: " + (e.response?.data?.error || e.message));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const cancelEdit = () => {
    setIsEditingReview(false);
    if (userReview) {
      setReviewText(userReview.text_content);
      setReviewRating(userReview.rating);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " Б";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " КБ";
    return (bytes / (1024 * 1024)).toFixed(1) + " МБ";
  };

  const translateGenre = (genre: string) => genreTranslations[genre] || genre;

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    alert("Ссылка скопирована в буфер обмена");
  };

  const handleReport = () => alert("Функция жалобы будет добавлена позже");

  if (loading) {
    return (
      <div className="min-h-screen m3-surface flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-full animate-spin mx-auto mb-4"
            style={{
              border: "2px solid var(--m3-outline-variant)",
              borderTopColor: "var(--m3-primary)",
            }}
          />
          <p className="m3-body-small m3-text-secondary">Загрузка квеста...</p>
        </div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen m3-surface">
        <Header user={user} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} title="Квест не найден" />
        <div className="pt-32 px-6 max-w-4xl mx-auto text-center py-20">
          <h1 className="m3-headline-large mb-4">Квест не найден</h1>
          <p className="m3-body-medium m3-text-secondary mb-6">{error}</p>
          <Link href="/market" className="m3-btn m3-btn-filled">
            Вернуться в маркет
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen m3-surface">
      <Header user={user} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} title={quest.title} />

      <main className="pt-6 pb-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
            <div
              className="aspect-square overflow-hidden"
              style={{
                background: "var(--m3-surface-container)",
                borderRadius: "var(--m3-radius-lg)",
              }}
            >
              <QuestCover
                src={quest.preview_image_url}
                alt={quest.title}
                loading="eager"
                className="m3-quest-detail-cover"
                imgClassName="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-2 space-y-5">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="m3-headline-large">{quest.title}</h1>
                  {quest.is_demo && (
                    <span
                      className="px-3 py-1 m3-label-large flex-shrink-0"
                      style={{
                        background: "var(--m3-secondary-container)",
                        color: "var(--m3-on-secondary-container)",
                        borderRadius: "var(--m3-radius-sm)",
                      }}
                    >
                      Демо
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  {quest.author_id ? (
                    <Link
                      href={`/profile/${quest.author_id}`}
                      className="m3-body-medium inline-flex items-center gap-2 hover:underline"
                      style={{ color: "var(--m3-on-surface)" }}
                    >
                      <span>{quest.author_name || "Аноним"}</span>
                      {quest.author_is_verified && (
                        <CheckCircle className="w-4 h-4" style={{ color: "var(--m3-primary)" }} />
                      )}
                    </Link>
                  ) : (
                    <span className="m3-body-medium">{quest.author_name || "Аноним"}</span>
                  )}
                </div>

                {quest.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {quest.genres.map((genre, i) => (
                      <span key={i} className="m3-chip" style={{ pointerEvents: "none" }}>
                        {translateGenre(genre)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatCard icon={<Heart className="w-5 h-5" />} value={quest.like_count} label="Лайков" />
                <StatCard icon={<Download className="w-5 h-5" />} value={quest.downloads_count} label="Скачиваний" />
                <StatCard icon={<Clock className="w-5 h-5" />} value={quest.estimated_playtime} label="Минут" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVote(true)}
                  className={`m3-btn w-full ${userVote === true ? "m3-btn-filled" : "m3-btn-tonal"}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Нравится
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className={`m3-btn w-full ${userVote === false ? "m3-btn-filled" : "m3-btn-tonal"}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  Не нравится
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={handleDownload} className="m3-btn m3-btn-filled flex-1">
                  <Download className="w-4 h-4" />
                  Скачать {formatFileSize(quest.quest_size_bytes)}
                </button>
                <button onClick={handleShare} className="m3-icon-button" aria-label="Поделиться">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={handleReport} className="m3-icon-button" aria-label="Пожаловаться">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="m3-card mb-10 md:mb-12">
            <h2 className="m3-title-large mb-3">Описание</h2>
            <p className="m3-body-medium whitespace-pre-wrap" style={{ color: "var(--m3-on-surface-variant)", lineHeight: 1.6 }}>
              {quest.description || "Описание отсутствует"}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="m3-title-large mb-5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Отзывы ({reviews.length})
            </h2>

            {user && userReview && userReview.hasData && !isEditingReview && (
              <div
                className="mb-6 p-5"
                style={{
                  background: "var(--m3-primary-container)",
                  color: "var(--m3-on-primary-container)",
                  borderRadius: "var(--m3-radius-lg)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || ""}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                        style={{ background: "var(--m3-primary)", color: "var(--m3-on-primary)" }}
                      >
                        {getInitials(user.full_name)}
                      </div>
                    )}
                    <div>
                      <div className="m3-label-large">Ваш отзыв</div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4"
                            style={{
                              fill: star <= userReview.rating ? "currentColor" : "transparent",
                              opacity: star <= userReview.rating ? 1 : 0.3,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingReview(true)}
                    className="m3-icon-button"
                    aria-label="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                {userReview.text_content && (
                  <p className="m3-body-medium" style={{ lineHeight: 1.6 }}>
                    {userReview.text_content}
                  </p>
                )}
              </div>
            )}

            {user && isEditingReview ? (
              <div className="m3-card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="m3-title-medium">
                    {userReview?.text_content ? "Редактировать отзыв" : "Оставить отзыв"}
                  </h3>
                  <button onClick={cancelEdit} className="m3-icon-button" aria-label="Закрыть">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="m3-label-large m3-text-secondary mb-2 block">Оценка</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                        style={{
                          color: star <= reviewRating ? "var(--m3-primary)" : "var(--m3-outline)",
                        }}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Напишите ваш отзыв..."
                  className="m3-textarea w-full"
                  style={{ minHeight: 120 }}
                />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={submitReview}
                    disabled={isSubmittingReview || (!reviewText.trim() && !reviewRating)}
                    className="m3-btn m3-btn-filled flex-1"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmittingReview ? "Отправка..." : "Опубликовать"}
                  </button>
                  <button onClick={cancelEdit} className="m3-btn m3-btn-tonal">
                    Отмена
                  </button>
                </div>
              </div>
            ) : user && !userReview?.hasData ? (
              <div className="m3-card mb-6">
                <h3 className="m3-title-medium mb-4">Оставить отзыв</h3>

                <div className="mb-4">
                  <label className="m3-label-large m3-text-secondary mb-2 block">Оценка</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                        style={{
                          color: star <= reviewRating ? "var(--m3-primary)" : "var(--m3-outline)",
                        }}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Напишите ваш отзыв..."
                  className="m3-textarea w-full"
                  style={{ minHeight: 120 }}
                />

                <button
                  onClick={submitReview}
                  disabled={isSubmittingReview || (!reviewText.trim() && !reviewRating)}
                  className="m3-btn m3-btn-filled mt-4"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingReview ? "Отправка..." : "Опубликовать отзыв"}
                </button>
              </div>
            ) : !user ? (
              <div className="m3-card mb-6 text-center">
                <p className="m3-body-medium m3-text-secondary mb-4">Войдите чтобы оставить отзыв</p>
                <div className="flex justify-center">
                  <GoogleSignInButton onSuccess={handleGoogleSignIn} variant="wide" />
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              {reviews.length === 0 ? (
                userReview?.hasData ? null : (
                  <div
                    className="text-center py-10 m3-body-medium m3-text-secondary"
                    style={{
                      background: "var(--m3-surface-container-low)",
                      borderRadius: "var(--m3-radius-lg)",
                    }}
                  >
                    Отзывов пока нет
                  </div>
                )
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="m3-card">
                    <div className="flex items-start gap-3">
                      {review.author_avatar_url ? (
                        <img
                          src={review.author_avatar_url}
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          alt={review.author_name || "User"}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                          style={{
                            background: "var(--m3-surface-container-high)",
                            color: "var(--m3-on-surface-variant)",
                          }}
                        >
                          {getInitials(review.author_name)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="min-w-0">
                            <div className="m3-title-small truncate">{review.author_name || "Аноним"}</div>
                            <div className="m3-body-small m3-text-secondary">
                              {new Date(review.created_at).toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          {review.rating && review.rating > 0 && (
                            <div className="flex gap-0.5 flex-shrink-0">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="w-4 h-4"
                                  style={{
                                    color: review.rating && star <= review.rating
                                      ? "var(--m3-primary)"
                                      : "var(--m3-outline)",
                                    fill: review.rating && star <= review.rating ? "currentColor" : "transparent",
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {review.text_content && (
                          <p className="m3-body-medium mt-2" style={{ color: "var(--m3-on-surface-variant)", lineHeight: 1.6 }}>
                            {review.text_content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div
      className="p-4 text-center"
      style={{
        background: "var(--m3-surface-container-low)",
        borderRadius: "var(--m3-radius-md)",
      }}
    >
      <div className="flex items-center justify-center m3-text-secondary mb-1">
        {icon}
      </div>
      <div className="m3-headline-small">{value}</div>
      <div className="m3-body-small m3-text-secondary">{label}</div>
    </div>
  );
}

function Header({
  user,
  onSignIn,
  onSignOut,
  title,
}: {
  user: UserProfile | null;
  onSignIn: (response: CredentialResponse) => void;
  onSignOut: () => void;
  title?: string;
}) {

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
          {user ? (
            <Link href={`/profile/${user.id}`} className="flex items-center gap-2 m3-header-user">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || ""}
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
                  {getInitials(user.full_name)}
                </div>
              )}
              <span className="hidden sm:inline m3-body-medium">{user.full_name}</span>
              {user.is_verified && (
                <CheckCircle className="w-4 h-4" style={{ color: "var(--m3-primary)" }} />
              )}
            </Link>
          ) : (
            <GoogleSignInButton onSuccess={onSignIn} />
          )}

          {user && (
            <button
              type="button"
              onClick={onSignOut}
              className="m3-icon-button"
              aria-label="Выйти"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="m3-nav-desktop">
          <Link href="/market" style={{ color: "var(--m3-primary)" }}>Маркет</Link>
        </nav>
      </div>
    </header>
  );
}