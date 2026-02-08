"use client";

import { useState, useRef, useEffect } from "react";
import "./calendar.scss";

import { useTranslations } from "next-intl";

export default function Calendar({
  date,
  setDate,
}: {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}) {
  const t = useTranslations("NewEntryPage")
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const openCalendar = () => {
    setOpen(true);
  };

  // закрытие при клике вне
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
  const d = new Date(date);
  const nice = d.toLocaleDateString(t("dateLocal"), {
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
          {t("date")}
        </button>
      )}

      {open && (
        <div className="popup" ref={popupRef}>
          <input
            title="-"
            type="date"
            className="calendar"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="ok-btn" onClick={handleOk}>
            OK
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
