"use client";
import { FeelingOption } from "../../entry-types/types";
import "./feeling.scss";
import React from "react";


export default function Feeling({
  option,
  feels,
  setFeel,
}: {
  option: FeelingOption;
  feels: FeelingOption[];
  setFeel: React.Dispatch<React.SetStateAction<FeelingOption[]>>;
}) {
  const pick: Record<FeelingOption, string> = {
    happy: "😆Happy",
    sad: "😔Sad",
    peacful: "😌Peacful",
    frustrated: "😤Frustrated",
    thoughtful: "🧐Thoughtful",
    inspired: "✨Inspired",
  };
if(!feels) { return}
  const isSelected = feels.includes(option);

  function handleClick() {
    if (!isSelected && feels.length >= 3) {
      alert("You can choose max 3 options");
      return;
    }

    if (isSelected) {
      setFeel(feels.filter((f) => f !== option));
    } else {
      setFeel([...feels, option]);
    }
  }

  return (
    <div
      className={`feel ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <span>{pick[option]}</span>
    </div>
  );
}
