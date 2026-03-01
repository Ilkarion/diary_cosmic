'use client'

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { addTextErrors } from "../store/errorsStore/functions"

export default function TokenKeeper() {
  const lastFetchRef = useRef<number>(0)
  const cancelledRef = useRef(false)
  const router = useRouter()

  const sendPing = async () => {
    try {
      await fetch("https://your-book-backend-1.onrender.com/api/ping", {
        credentials: "include",
      })
    } catch {
      // игнорируем ошибки ping
    }
    lastFetchRef.current = Date.now()
  }

  const refreshToken = async () => {
    try {
      const res = await fetch("https://your-book-backend-1.onrender.com/api/refresh", {
        method: "POST",
        credentials: "include",
      })
      return res.ok
    } catch {
      return false
    }
  }

  useEffect(() => {
    cancelledRef.current = false
    lastFetchRef.current = Date.now()

    // Перехват fetch для обновления lastFetchRef и авто-рефреш при 401/403
    const originalFetch = window.fetch
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      lastFetchRef.current = Date.now()

      let res = await originalFetch(...args)

      if ((res.status === 401 || res.status === 403) && !cancelledRef.current) {
        const refreshed = await refreshToken()
        if (refreshed) {
          res = await originalFetch(...args)
        } else {
          router.push("/sign")
        }
      }

      if (!res.ok) {
        if (res.status >= 500) addTextErrors(`Server error ${res.status}`, "error")
        if (res.status === 404) router.push("/sign")
      }

      return res
    }

    // авто-рефреш каждые 10 минут
    const refreshInterval = setInterval(() => {
      refreshToken().catch(() => {})
    }, 10 * 60 * 1000)

    // idle ping каждые 10 минут
    const idleInterval = setInterval(() => {
      if (Date.now() - lastFetchRef.current > 10 * 60 * 1000) {
        sendPing()
      }
    }, 10 * 60 * 1000)

    // первый пинг сразу
    sendPing()

    return () => {
      cancelledRef.current = true
      window.fetch = originalFetch
      clearInterval(refreshInterval)
      clearInterval(idleInterval)
    }
  }, [router])

  return null
}