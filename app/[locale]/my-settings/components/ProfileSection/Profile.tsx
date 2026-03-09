'use client'

import { useEffect, useState } from "react"
import "./profile.scss"
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions"
import Image from "next/image"

import personIcon from "@/public/imgs/user.svg"

import { getUserInfo, setUpdateUser } from "@/app/[locale]/store/userInfo/functions"
import { changeEmailRequest, changeUsername } from "@/app/[locale]/allFunctions/mySettings/functions"
import { userInfo } from "@/app/[locale]/allFunctions/user/functions"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export default function Profile() {

  const t = useTranslations("SettingsPage.Profile")


  const router = useRouter()

  const user = getUserInfo()
  const username = user.username
  const gmail = user.email

  const [nickname, setNickname] = useState(username || "")
  const [email, setEmail] = useState(gmail || "")

  useEffect(() => {

    async function loadUser() {

      if (username && gmail) return

      const resProfile = await userInfo()

      if (!resProfile.ok) {
        router.push("/checkAuthUser")
        return
      }

      if (resProfile.data?.user) {
        const { username, email } = resProfile.data.user
        setNickname(username)
        setEmail(email)
      }

    }

    loadUser()

  }, [])

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {

      if (nickname === username && email === gmail) {
        addTextErrors("No changes in your username or email", "info")
        return
      }

      if (nickname !== username && email === gmail) {
        const res = await changeUsername(nickname)
        addTextErrors(res.message, "success")
        setUpdateUser(true)
        return
      }

      if (nickname === username && email !== gmail) {
        const res = await changeEmailRequest(email)
        addTextErrors(res.message, "success")
        setUpdateUser(true)
        return
      }

      if (nickname !== username && email !== gmail) {
        const res = await changeUsername(nickname)
        addTextErrors(res.message, "success")

        const resE = await changeEmailRequest(email)
        addTextErrors(resE.message, "success")

        setUpdateUser(true)
      }

    } catch (e) {
      if (e instanceof Error) {
        addTextErrors(e.message, "error")
      }
    }
  }

  return (
    <section className="profile-card">
      <h3 className="profile-title">
        <div className="profile-icon">
          <Image src={personIcon} alt="" />
        </div>
        {t("header")}
      </h3>

      <form onSubmit={handleSaveProfile} className="profile-form">

        <div className="profile-field">
          <label htmlFor="nickname">{t("field_nickname")}</label>
          <input
            id="nickname"
            type="text"
            placeholder={t("nickname_placeholder")}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="email">{t("field_email")}</label>
          <input
            id="email"
            type="email"
            placeholder={t("email_placeholder")}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="profile-btn">
          {t("btn")}
        </button>

      </form>
    </section>
  )
}