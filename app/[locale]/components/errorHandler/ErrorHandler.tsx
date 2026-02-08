'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import TopAlert from "../alertUsers/CustomAlert"

export default function ErrorHandler() {
  const router = useRouter()
  const pathname = usePathname()
  const cancelledRef = useRef(false)
  const [alert, setAlert] = useState<{ msg: string; type: "info" | "error" | "success" } | null>(null)

  useEffect(() => {
    cancelledRef.current = false

    // Перехватываем глобальный fetch
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const res = await originalFetch(...args)

        // HTTP ошибки
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            // перенаправление на логин
            if (!cancelledRef.current) router.push("/sign")
          } else if (res.status >= 500) {
            // серверная ошибка
            setAlert({ msg: `Server error ${res.status}`, type: "error" })
          } else if (res.status === 404) {
            setAlert({ msg: `Resource not found (404)`, type: "info" })
          }
        }

        return res
      } catch (err) {
        // Потеря соединения
        setAlert({ msg: "Network error: сервер недоступен", type: "error" })
        throw err // пробрасываем дальше
      }
    }

    return () => {
      cancelledRef.current = true
      window.fetch = originalFetch
    }
  }, [router, pathname])

  return (
    <TopAlert
      visible={!!alert}
      message={alert?.msg || ""}
      type={alert?.type || "info"}
      onClose={() => setAlert(null)}
      duration={5000}
    />
  )
}
