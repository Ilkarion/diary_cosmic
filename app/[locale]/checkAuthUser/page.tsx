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

        if (res.ok && res.data?.user) {
          sessionStorage.removeItem("reload404")
          router.push("/user")
          return
        }

        if (res.ok && !res.data?.user) {
          sessionStorage.removeItem("reload404")
          router.push("/sign")
          return
        }

        if (!res.ok) {

          if (res.error instanceof Response) {

            // 404 обработка
            if (res.error.status === 404 ||res.error.status === 403) {
              const alreadyReloaded = sessionStorage.getItem("reload404")

              if (!alreadyReloaded) {
                sessionStorage.setItem("reload404", "true")
                window.location.reload()
                return
              } else {
                sessionStorage.removeItem("reload404")
                router.push("/sign")
                return
              }
            }

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