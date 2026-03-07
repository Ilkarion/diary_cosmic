'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userInfo } from "@/app/[locale]/allFunctions/user/functions"
import "./showUserData.scss"
import { UserData } from "@/app/[locale]/allTypes/typesTS"

import { useTranslations } from "next-intl"
import { getUpdateUserStatus, getUserInfo, setUpdateUser, setUserInfo } from "@/app/[locale]/store/userInfo/functions"

export default function ShowUser() {
  const router = useRouter()
  const [data, setData] = useState<UserData | null>(null)
  const t = useTranslations("UserInfoHeader")

  useEffect(() => {
    async function loadUser() {
      // Берем данные из Zustand и сразу оборачиваем в UserData
      let userData: UserData = { user: getUserInfo() }

      const needsUpdate = getUpdateUserStatus()
      if (needsUpdate) {
        const res = await userInfo()

        if (!res.ok) {
          router.push("/checkAuthUser")
          return
        }

        if (res.data?.user) {
          const { username, email, created_at } = res.data.user
          setUserInfo(username, email, created_at)
          userData = { user: { username, email, created_at } }
        }

        setUpdateUser(false)
      }

      setData(userData)
    }

    loadUser()
  }, [router])

  return (
    <>
      {data ? (
        <div className="greetingText">
          <h1>{t("greeting")}{data.user?.username || "Friend"}</h1>
          <p>{t("quote")}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}