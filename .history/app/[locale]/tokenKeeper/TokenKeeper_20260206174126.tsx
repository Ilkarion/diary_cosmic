'use client'

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function TokenKeeper() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      // страницы, где НЕ надо редиректить

      try {
        let res = await fetch("http://localhost:3001/api/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        // сервер спит — показываем alert только на /sign
        if (!res.ok && pathname === "/sign") {
          alert("Server paused. Wait 2-5 minutes -- Token Keeper")
        }
        if(res.status === 404) {
            router.push("/sign")
            return
          }
        // expired access token
        if (res.status === 401 || res.status === 403) {
          const refresh = await fetch("http://localhost:3001/api/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          // refresh failed → редирект (только если страница защищённая)
          if (!refresh.ok && !cancelled && pathname==="/") {
            if (!cancelled) {
              router.push("/sign")
            }
            return
          }
          

          // retry /me
          res = await fetch("http://localhost:3001/api/me", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
        }

        // still bad → редирект на защищённой странице
        if (!res.ok && !cancelled && pathname==="/") {
          router.push("/sign")
        }

      } catch {
        if (!cancelled && pathname==="/") {
          router.push("/sign")
        }
      }
    }

    checkAuth()

    const interval = setInterval(() => {
      fetch("http://localhost:3001/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
    }, 10 * 60 * 1000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [router, pathname]) // ← важно!

  return null
}
