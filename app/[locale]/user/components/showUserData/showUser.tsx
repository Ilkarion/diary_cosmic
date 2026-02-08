'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userInfo } from "../../functions/funstions"
import "./showUserData.scss"

import { useTranslations } from "next-intl"

type UserData = {
  user: {
    username: string
    email: string
    created_at: string
  }
}

export default function ShowUser() {
  const router = useRouter()
  const [data, setData] = useState<UserData | null>(null)
  const t = useTranslations("UserInfoHeader")

  useEffect(() => {
    async function getUserData() {
      const res = await userInfo()

      if (!res.ok) {
        router.push("/sign")
        return
      }

      setData(res.data || null)
    }

    getUserData()
  }, [router])

  return (
    <>
      {data ? (
        <div className="greetingText">
          <h1>{t("greeting")}{data.user.username}</h1>
          <p>{t("quote")}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
