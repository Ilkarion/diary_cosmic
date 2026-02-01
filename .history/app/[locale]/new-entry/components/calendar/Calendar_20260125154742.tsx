"use client";

import { useState } from "react";
import "./calendar.scss";

export default function Calendar({date, setDate}:
  {
    date:string,
    setDate: React.Dispatch<React.SetStateAction<string>>
  }) {
  const [open, setOpen] = useState(false);
  const [rawDate, setRawDate] = useState("");

  const handleOk = () => {
    if (!rawDate) return;

    const date = new Date(rawDate);
    const nice = date.toLocaleDateString("en-US", {
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
      {!date && <button className="open-btn" onClick={() => setOpen(true)}>Date</button>}

      {open && (
        <div className="popup">
          <input
            placeholder="Date"
            type="date"
            className="calendar"
            value={rawDate}
            onChange={(e) => setRawDate(e.target.value)}
          />

          <button className="ok-btn" onClick={handleOk}>ok</button>
        </div>
      )}

      {date && <p className="result" onClick={() => setOpen(true)}>{date}</p>}
    </div>
  );
}
