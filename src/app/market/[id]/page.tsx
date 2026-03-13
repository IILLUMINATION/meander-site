"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
  Star,
  ArrowLeft,
  Share2,
  Flag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Edit2,
  X,
  QrCode,
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
  const [userVote, setUserVote] = useState<boolean | null>(null); // true = like, false = dislike
  const [userReview, setUserReview] = useState<{ rating: number; text_content: string; hasData: boolean } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("meander_user");
    const savedToken = localStorage.getItem("meander_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (questId && user) {
      loadQuestData();
    }
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

      // Проверяем авторизацию через токен (не через user state)
      const token = localStorage.getItem("meander_token");
      if (token) {
        // Загружаем голос пользователя
        try {
          const voteRes = await axios.get(`${API_URL}/quests/${questId}/my-vote`, { headers: getTokenHeaders() });
          console.log("Vote response:", voteRes.data);
          if (voteRes.data && voteRes.data.is_like !== undefined) {
            setUserVote(voteRes.data.is_like);
          } else if (voteRes.data && Object.keys(voteRes.data).length === 0) {
            // Пустой объект - нет голоса
            setUserVote(null);
          }
        } catch (e: any) {
          console.log("No vote yet:", e.response?.data || e.message);
          setUserVote(null);
        }

        // Загружаем отзыв пользователя
        try {
          const reviewRes = await axios.get(`${API_URL}/quests/${questId}/my-review`, { headers: getTokenHeaders() });
          console.log("Review response:", reviewRes.data);
          
          // Проверяем есть ли данные (rating ИЛИ text_content)
          const hasRating = reviewRes.data && reviewRes.data.rating !== undefined && reviewRes.data.rating !== null && reviewRes.data.rating > 0;
          const hasText = reviewRes.data && reviewRes.data.text_content && reviewRes.data.text_content.trim().length > 0;
          
          if (hasRating || hasText) {
            const reviewData = {
              rating: reviewRes.data.rating || 0,
              text_content: reviewRes.data.text_content || "",
              hasData: hasRating || hasText,
            };
            setUserReview(reviewData);
            if (hasText) {
              setReviewText(reviewRes.data.text_content);
              setReviewRating(reviewRes.data.rating || 5);
            } else if (hasRating) {
              // Только рейтинг без текста
              setReviewRating(reviewRes.data.rating);
              setIsEditingReview(true); // Предлагаем добавить текст
            }
          } else {
            // Отзыва нет вообще
            setUserReview(null);
            setReviewText("");
            setReviewRating(5);
            setIsEditingReview(false);
          }
        } catch (e: any) {
          console.log("No review yet:", e.response?.data || e.message);
          setUserReview(null);
          setReviewText("");
          setReviewRating(5);
          setIsEditingReview(false);
        }
      }
    } catch (err: any) {
      console.error("Failed to load quest:", err);
      setError(err.response?.data?.error || "Не удалось загрузить квест");
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
      setTimeout(() => loadQuestData(), 200);
    } catch (err: any) {
      console.error("Sign in error:", err);
      alert("Ошибка входа: " + (err.response?.data?.error || err.message));
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
      window.open(`${API_URL}/quests/${questId}/file`, "_blank");
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleVote = async (isLike: boolean) => {
    if (!user) {
      alert("Войдите чтобы голосовать");
      return;
    }
    try {
      // Если голос совпадает - убираем, если нет - меняем
      const action = userVote === isLike ? 'remove' : 'set';
      
      await axios.post(
        `${API_URL}/quests/${questId}/vote`,
        { action, is_like: isLike },
        { headers: getTokenHeaders() }
      );
      
      // Обновляем состояние
      setUserVote(userVote === isLike ? null : isLike);
      
      // Перезагружаем данные для обновления счетчиков
      await loadQuestData();
    } catch (err: any) {
      console.error("Vote error:", err);
      alert("Ошибка голосования: " + (err.response?.data?.error || err.message));
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
      
      const newReview = { rating: reviewRating, text_content: reviewText };
      setUserReview(newReview);
      setReviewText("");
      setReviewRating(5);
      setIsEditingReview(false);
      
      await loadQuestData();
    } catch (err: any) {
      console.error("Review error:", err);
      alert("Ошибка: " + (err.response?.data?.error || err.message));
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

  const translateGenre = (genre: string) => {
    return genreTranslations[genre] || genre;
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    alert("Ссылка скопирована в буфер обмена");
  };

  const handleReport = () => {
    alert("Функция жалобы будет добавлена позже");
  };

  const handleOpenQR = () => {
    setShowQRCode(true);
  };

  const handleCloseQR = () => {
    setShowQRCode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neutral-400">Загрузка...</div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />
        <div className="pt-32 px-6 max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-neutral-400 mb-4">{error || "Квест не найден"}</div>
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
      <Header user={user} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            href="/market"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в маркет
          </Link>

          {/* Quest Header */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Cover Image */}
            <div className="aspect-square bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900">
              {quest.preview_image_url ? (
                <img
                  src={quest.preview_image_url}
                  alt={quest.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-600 text-6xl">
                  🎮
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-light">{quest.title}</h1>
                  {quest.is_demo && (
                    <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded">
                      Демо
                    </span>
                  )}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-neutral-500" />
                  {quest.author_id ? (
                    <Link
                      href={`/profile/${quest.author_id}`}
                      className="text-neutral-300 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <span>{quest.author_name || "Аноним"}</span>
                      {quest.author_is_verified && (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      )}
                    </Link>
                  ) : (
                    <span className="text-neutral-300">{quest.author_name || "Аноним"}</span>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {quest.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-neutral-800 text-neutral-300 text-sm rounded"
                    >
                      {translateGenre(genre)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-neutral-400 mb-1">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-light">{quest.like_count}</div>
                  <div className="text-xs text-neutral-500">Лайков</div>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-neutral-400 mb-1">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-light">{quest.downloads_count}</div>
                  <div className="text-xs text-neutral-500">Скачиваний</div>
                </div>
                <div className="bg-neutral-900/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-neutral-400 mb-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-light">{quest.estimated_playtime}</div>
                  <div className="text-xs text-neutral-500">Минут</div>
                </div>
              </div>

              {/* Vote Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote(true)}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    userVote === true
                      ? "bg-accent text-black"
                      : "bg-neutral-800 text-neutral-400 hover:text-accent"
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Нравится</span>
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    userVote === false
                      ? "bg-neutral-700 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:text-accent"
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>Не нравится</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Скачать {formatFileSize(quest.quest_size_bytes)}
                </button>
                <button
                  onClick={handleOpenQR}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400"
                  title="QR-код для открытия в приложении"
                >
                  <QrCode className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReport}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-neutral-900/30 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-medium mb-4">Описание</h2>
            <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {quest.description || "Описание отсутствует"}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Отзывы ({reviews.length})
            </h2>

            {/* User's Review - Display at top if exists */}
            {user && userReview && userReview.hasData && !isEditingReview && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-8">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || ""}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-accent font-bold">
                        {getInitials(user.full_name)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-accent">Ваш отзыв</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= userReview.rating
                                ? "fill-accent text-accent"
                                : "text-neutral-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingReview(true)}
                    className="p-2 text-neutral-400 hover:text-accent transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                {userReview.text_content && (
                  <p className="text-neutral-300 leading-relaxed">
                    {userReview.text_content}
                  </p>
                )}
              </div>
            )}

            {/* Write/Edit Review Form */}
            {user && isEditingReview ? (
              <div className="bg-neutral-900/30 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    {userReview?.text_content ? "Редактировать отзыв" : "Оставить отзыв"}
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="p-2 text-neutral-400 hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <label className="text-sm text-neutral-400 mb-2 block">Оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-1 transition-colors ${
                          star <= reviewRating ? "text-accent" : "text-neutral-600"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Напишите ваш отзыв..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-accent/50 min-h-[120px]"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={submitReview}
                    disabled={isSubmittingReview || (!reviewText.trim() && !reviewRating)}
                    className="flex-1 px-6 py-2 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmittingReview ? "Отправка..." : "Опубликовать"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : user && !userReview?.hasData ? (
              <div className="bg-neutral-900/30 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium mb-4">Оставить отзыв</h3>

                {/* Rating */}
                <div className="mb-4">
                  <label className="text-sm text-neutral-400 mb-2 block">Оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-1 transition-colors ${
                          star <= reviewRating ? "text-accent" : "text-neutral-600"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Напишите ваш отзыв..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-accent/50 min-h-[120px]"
                />

                <button
                  onClick={submitReview}
                  disabled={isSubmittingReview || (!reviewText.trim() && !reviewRating)}
                  className="mt-4 px-6 py-2 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingReview ? "Отправка..." : "Опубликовать отзыв"}
                </button>
              </div>
            ) : !user ? (
              <div className="bg-neutral-900/30 rounded-lg p-6 mb-8 text-center">
                <p className="text-neutral-400 mb-4">Войдите чтобы оставить отзыв</p>
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={() => alert("Ошибка входа")}
                  text="signin_with"
                  theme="filled_black"
                  size="medium"
                  width={150}
                />
              </div>
            ) : null}

            {/* Other Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                userReview?.hasData ? null : (
                  <div className="text-neutral-500 text-center py-8">
                    Отзывов пока нет
                  </div>
                )
              ) : (
                reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-neutral-900/30 rounded-lg p-6"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {/* Avatar */}
                        {review.author_avatar_url ? (
                          <img
                            src={review.author_avatar_url}
                            alt={review.author_name || "User"}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold flex-shrink-0">
                            {getInitials(review.author_name)}
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{review.author_name || "Аноним"}</div>
                              <div className="text-xs text-neutral-500">
                                {new Date(review.created_at).toLocaleDateString("ru-RU", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
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
                            <p className="text-neutral-300 leading-relaxed mt-2">
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

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleCloseQR}>
          <div className="bg-neutral-900 rounded-lg p-8 max-w-sm mx-4 border border-neutral-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Открыть в приложении</h3>
              <button
                onClick={handleCloseQR}
                className="p-2 text-neutral-400 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${API_URL}/share/quest/${questId}`)}`}
                alt="QR Code"
                className="w-full h-auto"
              />
            </div>
            
            <p className="text-neutral-400 text-sm text-center mb-4">
              Отсканируйте QR-код чтобы открыть квест в приложении Meander
            </p>
            
            <button
              onClick={handleCloseQR}
              className="w-full px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <Footer />
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
            href="/market"
            className="text-sm text-neutral-400 hover:text-accent transition-colors"
          >
            Маркет
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <Link href={`/profile/${user.id}`}>
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || ""}
                      className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-accent transition-all"
                    />
                  </Link>
                ) : (
                  <Link href={`/profile/${user.id}`}>
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold hover:ring-2 hover:ring-accent transition-all">
                      {getInitials(user.full_name)}
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
