'use client'

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { addTextErrors } from "../store/errorsStore/functions"

export default function TokenKeeper() {

  const lastFetchRef = useRef(0)
  const cancelledRef = useRef(false)
  const router = useRouter()

  const sendPing = async () => {
    try {
      await fetch("https://your-book-backend.onrender.com/api/ping", {
        credentials: "include"
      })
    } catch {}
    lastFetchRef.current = Date.now()
  }

  const refreshToken = async () => {
    try {
      const res = await fetch(
        "https://your-book-backend.onrender.com/api/refresh",
        { method: "POST", credentials: "include" }
      )
      return res.ok
    } catch {
      return false
    }
  }

  useEffect(() => {
    cancelledRef.current = false
    lastFetchRef.current = Date.now()

    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      lastFetchRef.current = Date.now()

      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : input.url

      let res = await originalFetch(input, init)

      // auth endpoints не трогаем
      if (
        url.includes("/me") ||
        url.includes("/refresh") ||
        url.includes("/ping")
      ) return res

      if ((res.status === 401 || res.status === 403) && !cancelledRef.current) {
        const refreshed = await refreshToken()

        if (refreshed) res = await originalFetch(input, init)
        else router.push("/sign")
      }

      if (!res.ok && res.status >= 500) {
        addTextErrors(`Server error ${res.status}`, "error")
      }

      return res
    }

    const refreshInterval = setInterval(() => {
      refreshToken().catch(() => {})
    }, 10 * 60 * 1000)

    const idleInterval = setInterval(() => {
      if (Date.now() - lastFetchRef.current > 10 * 60 * 1000) sendPing()
    }, 10 * 60 * 1000)

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