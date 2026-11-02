import { UserData } from "../../allTypes/typesTS"
import { API_URL } from "@/lib/api"

type UserInfoResult = {
  ok: boolean
  data?: UserData
  error?: string | Error | Response
}


// GET user info
export async function userInfo(): Promise<UserInfoResult> {

  try {

    const res = await fetch(`${API_URL}/api/me`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // user just not logged in
    if (res.status === 401 || res.status === 403) {
      return {
        ok: true,
        data: {} // user undefined
      }

    }
    // server died
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



// REFRESH TOKEN
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
