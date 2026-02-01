"use client";

import { useState, useEffect, useRef } from "react";
import "./calendar.scss";

export default function Calendar({ date, setDate }:
  {
    date: string,
    setDate: React.Dispatch<React.SetStateAction<string>>
  }) {
  const [open, setOpen] = useState(false);
  const [rawDate, setRawDate] = useState("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  const openCalendar = () => {
    // подставляем дату при открытии, а не в useEffect
    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        const iso = parsed.toISOString().split("T")[0];
        setRawDate(iso);
      }
    }
    setOpen(true);
  };

  // клик вне попапа — закрывает
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleOk = () => {
    if (!rawDate) {
      setOpen(false);
      return;
    }

    const d = new Date(rawDate);
    const nice = d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setDate(nice);
    setOpen(false);
  };

  return (
    <div className="date-picker">
      {!date && (
        <button className="open-btn" onClick={openCalendar}>
          Date
        </button>
      )}

      {open && (
        <div className="popup" ref={popupRef}>
          <input
            placeholder="Date"
            type="date"
            className="calendar"
            value={rawDate}
            onChange={(e) => setRawDate(e.target.value)}
          />

          <button className="ok-btn" onClick={handleOk}>
            ok
          </button>
        </div>
      )}

      {date && (
        <p className="result" onClick={openCalendar}>
          {date}
        </p>
      )}
    </div>
  );
}
