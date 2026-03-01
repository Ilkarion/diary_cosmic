import { UserData } from "../../allTypes/typesTS"

const API_URL =
  "https://your-book-backend-1.onrender.com/api"

type UserInfoResult = {
  ok: boolean
  data?: UserData
  error?: string | Error | Response
}


// ✅ GET USER INFO
export async function userInfo(): Promise<UserInfoResult> {

  try {

    const res = await fetch(`${API_URL}/me`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // ✅ пользователь просто НЕ залогинен
    // это НЕ ошибка
    if (res.status === 401 || res.status === 403) {
      return {
        ok: true,
        data: {} // user undefined
      }

    }
    // сервер умер
    if (!res.ok) {
      return {
        ok: false,
        error: res,
      }
    }

    const data: UserData = await res.json()
    return {
      ok: true,
      data,
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        ok: false,
        error: err,
      }
    }

    return {
      ok: false,
      error: "Unknown error",
    }

  }

}



// ✅ REFRESH TOKEN (используй отдельно когда реально надо)
export async function refreshToken(): Promise<void> {

  const res = await fetch(
    `${API_URL}/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    throw new Error(
      "Refresh token invalid or expired"
    )
  }

}