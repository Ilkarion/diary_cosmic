"use client";

import { useEffect, useState } from "react";
import "./calendar.scss";
import { useTranslations } from "next-intl";

export default function Calendar({
  date,
  setDate,
  mode, // "edit" | "create"
}: {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
}) {
  const t = useTranslations("NewEntryPage");

  const getToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatNice = (value: string) =>
    new Date(value).toLocaleDateString(t("dateLocal"), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDefault = (value: string) => {
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // хуки вызываем всегда
  const initialDate = mode === "create" ? getToday() : formatDefault(date || getToday());
  const [internalDate, setInternalDate] = useState(initialDate);

  const handleDateChange = (value: string) => {
    setInternalDate(value);
    setDate(formatNice(value));
  };

  useEffect(()=>{
    const goodLookingDate = formatNice(internalDate)
    setDate(goodLookingDate)
  }, [])

  return (
    <div className="date-picker">
      <input
        title="-"
        type="date"
        className="calendar"
        value={internalDate}
        onChange={(e) => handleDateChange(e.target.value)}
      />
      {date && <p className="result">{date}</p>}
    </div>
  );
}