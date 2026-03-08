'use client'

import { useState, useEffect, useMemo, useCallback } from "react"
import { ArrowLeft, Calendar as CalendarIcon, Sparkles } from "lucide-react"
import "./moodTracker.scss"
import { fetchDiary } from "../allFunctions/newEntry/functions"
import { addTextErrors } from "../store/errorsStore/functions"
import Link from "next/link"
import { getRecords_TagsFrontEnd, setRecords_TagsStore, setUpdateFalse } from "../store/recordsStore/functions"

interface RecordEntry {
  id_record: string
  date: string
  feels: string[]
  color_Tags: { name: string; color: string }[]
}

interface Mood {
  emoji: string
  label: string
  color: string
  glowColor: string
}

const MOODS: Mood[] = [
  { emoji: "😊", label: "happy", color: "#fbbf24", glowColor: "rgba(251,191,36,0.5)" },
  { emoji: "😢", label: "sad", color: "#3b82f6", glowColor: "rgba(59,130,246,0.5)" },
  { emoji: "😌", label: "peaceful", color: "#10b981", glowColor: "rgba(16,185,129,0.5)" },
  { emoji: "😤", label: "frustrated", color: "#ef4444", glowColor: "rgba(239,68,68,0.5)" },
  { emoji: "🤔", label: "thoughtful", color: "#a855f7", glowColor: "rgba(168,85,247,0.5)" },
  { emoji: "✨", label: "inspired", color: "#ec4899", glowColor: "rgba(236,72,153,0.5)" },
]

function Button({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  return <button className="custom-button" onClick={onClick}>{children}</button>
}

export default function Page() {
  const [diaryRecords, setDiaryRecords] = useState<RecordEntry[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  useEffect(() => {
    async function initData() {
      try {
        const dataFront = getRecords_TagsFrontEnd()

        if (dataFront && Array.isArray(dataFront.diaryRecords) && dataFront.diaryRecords.length > 0) {
          // Берем данные из Zustand
          setDiaryRecords(dataFront.diaryRecords)
        } else {
          // Если данных нет, делаем fetch
          const data = await fetchDiary()

          if (data && Array.isArray(data.diaryRecords)) {
            // Сохраняем в Zustand
            setRecords_TagsStore(data)
            // Сохраняем локально
            setDiaryRecords(data.diaryRecords)
            setUpdateFalse()
          } else {
            console.warn("Fetch diary returned invalid structure", data)
          }
        }
      } catch (error) {
        addTextErrors(`Failed to fetch diary: ${error}`, "error")
      }
    }

    initData()
  }, [])

  const allColors = useMemo(() => {
    const colorsSet = new Set<string>()
    diaryRecords.forEach(r => r.color_Tags.forEach(t => colorsSet.add(t.name)))
    return Array.from(colorsSet)
  }, [diaryRecords])

  const filteredRecords = useMemo(() => {
    if (selectedColors.length === 0) return diaryRecords
    return diaryRecords.filter(r => r.color_Tags.some(tag => selectedColors.includes(tag.name)))
  }, [diaryRecords, selectedColors])

  const getMoodForDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayRecords = filteredRecords.filter(r => new Date(r.date).toISOString().split("T")[0] === dateStr)
    const feels: string[] = []
    dayRecords.forEach(r => feels.push(...r.feels))
    return Array.from(new Set(feels)).slice(0, 3)
  }, [filteredRecords])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const start = new Date(firstDay)
    start.setDate(start.getDate() - firstDay.getDay())

    const days = []
    const cur = new Date(start)
    for (let i = 0; i < 42; i++) {
      const moods = getMoodForDate(cur)
      days.push({
        date: new Date(cur),
        moods,
        isCurrentMonth: cur.getMonth() === month,
        isToday: cur.toDateString() === new Date().toDateString()
      })
      cur.setDate(cur.getDate() + 1)
    }
    return days
  }, [currentMonth, getMoodForDate])

  const totalMoodEntries = filteredRecords.filter(r => r.feels.length > 0).length

  const currentStreak = useMemo(() => {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (getMoodForDate(d).length > 0) streak++
      else break
    }
    return streak
  }, [getMoodForDate])

  const mostPopularMood = useMemo(() => {
    const monthRecords = filteredRecords.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
    })
    const countMap: Record<string, number> = {}
    monthRecords.forEach(r => r.feels.forEach(f => countMap[f] = (countMap[f] || 0) + 1))
    const sorted = Object.entries(countMap).sort((a,b)=>b[1]-a[1])
    return sorted[0]?.[0] || null
  }, [filteredRecords, currentMonth])

  const getMoodEmoji = (label: string) => MOODS.find(m => m.label === label)?.emoji || ""

  return (
    <div className="mood-tracker">
      <div className="content">
        <div className="header">
          <div className="header-left">
            <Link href={"/user"}><ArrowLeft /> Back</Link>
            <h1>Emotional Cosmos</h1>
          </div>
          <div className="header-right">
            <Sparkles />
            <span>{currentStreak} day streak</span>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card"><CalendarIcon /> Total Moods: {totalMoodEntries}</div>
          <div className="stat-card">Current Streak: {currentStreak} days</div>
        </div>

        <div className="filter-panel">
        {allColors.map(c => {
            // Находим пример цвета для этого тега в данных
            const exampleRecord = diaryRecords.find(r => r.color_Tags.some(t => t.name === c))
            const colorObj = exampleRecord?.color_Tags.find(t => t.name === c)
            const color = colorObj?.color || 'var(--icon-color)' // fallback, если цвета нет

            const isSelected = selectedColors.includes(c)

            return (
            <div
                key={c}
                className={`filter-btn ${isSelected ? "selected" : ""}`}
                style={{
                borderColor: color,
                color: isSelected ? color : 'var(--text-color-trans)',
                background: isSelected ? 'var(--bg-calendar-input)' : 'transparent',
                boxShadow: isSelected ? `0 0 8px ${color}` : 'none'
                }}
                onClick={() => {
                if (isSelected) setSelectedColors(selectedColors.filter(s => s!==c))
                else setSelectedColors([...selectedColors, c])
                }}
            >
                {c}
            </div>
            )
        })}
        </div>

        {mostPopularMood && (
          <div className="most-popular">
            Most Popular Mood: {getMoodEmoji(mostPopularMood)} ({mostPopularMood})
          </div>
        )}

        <div className="calendar">
          {calendarDays.map((day, i) => (
            <div key={i} className={`day ${day.isCurrentMonth ? "current" : "other"} ${day.isToday ? "today" : ""}`}>
              <span>{day.date.getDate()}</span>
              {day.moods.length > 0 &&
                <div className="emoji-wrapper">
                  {day.moods.map((mood, idx) => <span key={idx} className="emoji">{getMoodEmoji(mood)}</span>)}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}