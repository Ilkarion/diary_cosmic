'use client'

import { useEffect, useRef } from "react"
import { addTextErrors } from "../../store/errorsStore/functions"

export default function ServerWakeWatcher() {

  const shownRef = useRef(false)
  const activeRequestsRef = useRef(0)

  useEffect(() => {

    const originalFetch = window.fetch

    window.fetch = async (...args) => {

      activeRequestsRef.current++

      const timer = setTimeout(() => {
        if (!shownRef.current) {
          shownRef.current = true
          addTextErrors("Wait server is waking up...", "info")
        }
      }, 5000)

      try {
        const res = await originalFetch(...args)
        return res
      } catch (err) {
        throw err
      } finally {
        clearTimeout(timer)

        activeRequestsRef.current--

        // если запросов больше нет — разрешаем показывать сообщение снова
        if (activeRequestsRef.current === 0) {
          shownRef.current = false
        }
      }
    }

    return () => {
      window.fetch = originalFetch
    }

  }, [])

  return null
}