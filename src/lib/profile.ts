// Публичная карточка автора, как её отдаёт GET /profiles/<id>. Тип живёт отдельно
// от клиента: серверная страница не может импортировать его из файла с "use client".
export interface Profile {
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
