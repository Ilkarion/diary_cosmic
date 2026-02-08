'use client'

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function TokenKeeper() {
  const lastFetchRef = useRef<number>(0) // инициализация нулём
  const pathname = usePathname()
  const sendPing = async () => {
    try {
      await fetch("https://your-book-backend-1.onrender.com/api/ping", {
        credentials: "include",
      })
    } catch {
      //ignore this api just for ping
    }
    lastFetchRef.current = Date.now()
  }

  useEffect(() => {
    // установим начальное значение на клиенте
    lastFetchRef.current = Date.now()

    // перехват fetch для обновления lastFetchRef
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      lastFetchRef.current = Date.now()
      return originalFetch(...args)
    }

    // авто-рефреш токена каждые 10 минут
    const refreshInterval = setInterval(() => {
      fetch("https://your-book-backend-1.onrender.com/api/refresh", {
        method: "POST",
        credentials: "include",
      }).catch(() => {})
    }, 10 * 60 * 1000)

    // idle ping каждые 5 секунд
    const idleInterval = setInterval(() => {
      if (Date.now() - lastFetchRef.current > 45000) {
        sendPing()
      }
    }, 45000)

    // первый пинг сразу
    sendPing()

    return () => {
      clearInterval(refreshInterval)
      clearInterval(idleInterval)
      window.fetch = originalFetch
    }
  }, [])

  return null
}
