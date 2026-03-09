"use client";

import { useEffect, useState } from "react";
import "./calendar.scss";
import { useTranslations } from "next-intl";

export default function Calendar({
  date,
  setDate,
  mode, // "edit" | "create"
}: {
  date: string; // ISO date: YYYY-MM-DD
  setDate: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
}) {
  const t = useTranslations("NewEntryPage");

  // --- get today's ISO date ---
  const getToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`; // YYYY-MM-DD
  };

  // --- format date for display only ---
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

  // --- initial ISO date for input ---
  const initialDate =
    mode === "create" ? getToday() : formatDefault(date || getToday());

  const [internalDate, setInternalDate] = useState(initialDate);

  // --- handle change ---
  const handleDateChange = (value: string) => {
    setInternalDate(value);
    setDate(value); // store ISO date only, safe for filtering
  };

  // --- sync on mount ---
  useEffect(() => {
    setDate(internalDate); // make sure parent state is set
  }, []);

  return (
    <div className="date-picker">
      <input
        title="-"
        type="date"
        className="calendar"
        value={internalDate}
        onChange={(e) => handleDateChange(e.target.value)}
      />
      {internalDate && <p className="result">{formatNice(internalDate)}</p>}
    </div>
  );
}