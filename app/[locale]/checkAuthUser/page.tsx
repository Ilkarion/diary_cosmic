'use client'

import "./scss/check.scss"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userInfo } from "../user/functions/funstions"

import { useTranslations } from "next-intl"

export default function CheckAuthUser() {
  const t = useTranslations("CheckAuthUser")
  const router = useRouter()
  const [statusMsg, setStatusMsg] = useState<string>(t("defaultStatus"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkUser() {
      const res = await userInfo()

      if (cancelled) return

      if (res.ok && res.data?.user) {
        router.push("/user")
      } else if (res.ok && !res.data?.user) {
        router.push("/sign")
      } else if (res.error) {
        if (res.error instanceof Response) {
          setStatusMsg(`Server error: ${res.error.status}`)
        } else if (res.error instanceof Error) {
          setStatusMsg(`Error: ${res.error.message}`)
        } else if (typeof res.error === "string") {
          setStatusMsg(res.error)
        } else {
          setStatusMsg(t("unknownError"))
        }

        // редирект через 3 секунды
        setTimeout(() => {
          if (!cancelled) router.push("/")
        }, 3000)
      }

      if (!cancelled) setLoading(false)
    }

    checkUser()

    return () => { cancelled = true }
  }, [router])

  return (
    <div className="bg-check">
      <p className="bg-check__text">{statusMsg}</p>

      {loading && (
        <div className="loader-dots">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
        </div>
      )}
    </div>
  )
}
