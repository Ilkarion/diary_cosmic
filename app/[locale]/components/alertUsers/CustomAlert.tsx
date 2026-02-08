'use client'

import { useEffect } from "react"
import styles from "./customAlert.module.scss"

type AlertType = "success" | "error" | "info"

export default function TopAlert({
  message,
  type = "info",
  visible,
  onClose,
  duration = 3000,
}: {
  message: string
  type?: AlertType
  visible: boolean
  onClose: () => void
  duration?: number
}) {
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [visible, duration, onClose])

  if (!visible) return null

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      {message}
    </div>
  )
}
