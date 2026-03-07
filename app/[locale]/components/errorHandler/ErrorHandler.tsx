'use client'

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { addTextErrors } from "../../store/errorsStore/functions"

export default function ErrorHandler() {
  const router = useRouter()
  const cancelledRef = useRef(false)
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

            if (!cancelledRef.current) router.push("/checkAuthUser")
          } else if (res.status >= 500) {
            // серверная ошибка
            addTextErrors(`Server error ${res.status}`, "error")
          } else if (res.status === 404) {
            router.push("/checkAuthUser")
          }
        }
        return res
      } catch (err) {
        // Lost connection
        addTextErrors("Network error: Server is not available", "error")
        throw err 
      }
    }

    return () => {
      cancelledRef.current = true
      window.fetch = originalFetch
    }
  }, [])
  return null;
}
