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

    const mouse = { x: 0, y: 0 }
    let stars: Star[] = []
    let animationId = 0
    let lastTime = 0
    const FPS = 30
    const interval = 1000 / FPS
    
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1

      const width = window.innerWidth
      const height = window.innerHeight

      canvas.style.width = "100vw"
      canvas.style.height = "100vh"

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)

      // ВАЖНО: сбрасываем и масштабируем ОДИН раз
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
        depth: Math.random() * 0.6 + 0.4,
      }))
    }

    let lastDpr = window.devicePixelRatio

    function draw(time: number) {
      const currentDpr = window.devicePixelRatio
      if (currentDpr !== lastDpr) {
        lastDpr = currentDpr
        resizeCanvas()
      }

      if (time - lastTime < interval) {
        animationId = requestAnimationFrame(draw)
        return
      }
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (theme === "dark") {
        ctx.fillStyle = "#0B0119"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        for (const star of stars) {
          star.alpha += star.fade
          if (star.alpha <= 0 || star.alpha >= 1) star.fade *= -1

          const offsetX =
            (mouse.x - window.innerWidth / 2) * star.depth * 0.02
          const offsetY =
            (mouse.y - window.innerHeight / 2) * star.depth * 0.02

          ctx.beginPath()
          ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${star.alpha})`
          ctx.shadowBlur = 6
          ctx.shadowColor = "white"
          ctx.fill()
        }
      } else {
        ctx.fillStyle = "#F1F5FE"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      }

      animationId = requestAnimationFrame(draw)
    }


    function handleMouse(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    resizeCanvas()
    draw(0)

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(document.body)

    window.addEventListener("mousemove", handleMouse)

    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
      window.removeEventListener("mousemove", handleMouse)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="canvasBg" aria-hidden />
}
