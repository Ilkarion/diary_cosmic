"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import "./animatedBg.scss"

type Star = {
  x: number
  y: number
  radius: number
  alpha: number
  fade: number
  depth: number
}

export default function StarryNightBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    if (!ctx) return

    let stars: Star[] = []
    let animationId = 0

    const mouse = { x: 0, y: 0 }

    function getViewport() {
      return {
        width: window.visualViewport?.width || window.innerWidth,
        height: window.visualViewport?.height || window.innerHeight
      }
    }

    function resizeCanvas() {
      const { width, height } = getViewport()
      const dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr

      canvas.style.width = width + "px"
      canvas.style.height = height + "px"

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      createStars(width, height)
    }

    function createStars(width: number, height: number) {
      const density = 0.00008
      const count = Math.floor(width * height * density)

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        fade: Math.random() * 0.01,
        depth: Math.random() * 0.6 + 0.4
      }))
    }

    function draw() {
      const { width, height } = getViewport()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (theme === "dark") {
        ctx.fillStyle = "#0B0119"
        ctx.fillRect(0, 0, width, height)

        for (const star of stars) {
          star.alpha += star.fade
          if (star.alpha <= 0 || star.alpha >= 1) star.fade *= -1

          const offsetX = (mouse.x - width / 2) * star.depth * 0.02
          const offsetY = (mouse.y - height / 2) * star.depth * 0.02

          ctx.beginPath()
          ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${star.alpha})`
          ctx.shadowBlur = 6
          ctx.shadowColor = "white"
          ctx.fill()
        }
      } else {
        ctx.fillStyle = "#F1F5FE"
        ctx.fillRect(0, 0, width, height)
      }

      animationId = requestAnimationFrame(draw)
    }

    function handleMouse(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function handleTouch(e: TouchEvent) {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }

    resizeCanvas()
    draw()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("orientationchange", resizeCanvas)
    window.visualViewport?.addEventListener("resize", resizeCanvas)

    window.addEventListener("mousemove", handleMouse)
    window.addEventListener("touchmove", handleTouch)

    return () => {
      cancelAnimationFrame(animationId)

      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("orientationchange", resizeCanvas)
      window.visualViewport?.removeEventListener("resize", resizeCanvas)

      window.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("touchmove", handleTouch)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="canvasBg" aria-hidden />
}