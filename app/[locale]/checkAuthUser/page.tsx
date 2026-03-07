'use client'

import "./scss/check.scss"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userInfo } from '../allFunctions/user/functions'
import { useTranslations } from "next-intl"

export default function CheckAuthUser() {
  const t = useTranslations("CheckAuthUser")
  const router = useRouter()
  const [statusMsg, setStatusMsg] = useState<string>(t("defaultStatus"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkUser() {
      try {
        const res = await userInfo()

        if (cancelled) return

        // Если fetch вернул ok и есть пользователь
        if (res.ok && res.data?.user) {
          router.push("/user")
          return
        }

        // Если fetch вернул ok, но user нет
        if (res.ok && !res.data?.user) {
          router.push("/sign")
          return
        }

        // Если fetch вернул ошибку
        if (!res.ok) {
          // Если есть объект Response
          if (res.error instanceof Response) {
            if (res.error.status === 401 || res.error.status === 403) {
              router.push("/sign")
              return
            } else {
              setStatusMsg(`Server error: ${res.error.status}`)
            }
          } else if (res.error instanceof Error) {
            setStatusMsg(`Error: ${res.error.message}`)
          } else if (typeof res.error === "string") {
            setStatusMsg(res.error)
          } else {
            setStatusMsg(t("unknownError"))
          }

          // редирект через 3 секунды для остальных ошибок
          setTimeout(() => {
            if (!cancelled) router.push("/")
          }, 3000)
        }
      } catch (err) {
        if (!cancelled) {
          setStatusMsg("Network error: Server is not available")
          setTimeout(() => router.push("/"), 3000)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
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