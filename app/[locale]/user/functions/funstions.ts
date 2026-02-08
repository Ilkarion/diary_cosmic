//get user info
// functions/funstions.ts
import { useTranslations } from "next-intl";
type UserData = {
  user: {
    username: string
    email: string
    created_at: string
  }
}
export async function userInfo(): Promise<{
  ok: boolean;
  data?: { user: { username: string; email: string; created_at: string } };
  error?: string | Error | Response;
}> {
  try {
    let res = await fetch("https://your-book-backend-1.onrender.com/api/me", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // Попробуем обновить токен
      const refreshRes = await fetch("https://your-book-backend-1.onrender.com/api/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        return { ok: false, error: "No token" };
      }

      res = await fetch("https://your-book-backend-1.onrender.com/api/me", {
        credentials: "include",
      });
    }

    if (!res.ok) {
      return { ok: false, error: res };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    // гарантируем возврат всегда
    if (err instanceof Error) {
      return { ok: false, error: err };
    }
    return { ok: false, error: "Unknown error" }; // <-- для любых других случаев
  }
}




export async function refreshToken() {
  const res = await fetch("https://your-book-backend-1.onrender.com/api/refresh", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Refresh token invalid or expired");

  return res.json(); // Token refreshed
}

