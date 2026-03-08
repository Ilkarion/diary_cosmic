"use client";
import { FeelingOption } from "../../../allTypes/typesTS";
import "./feeling.scss";
import React from "react";

import { useTranslations } from "next-intl";
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions";

export default function Feeling({
  option,
  feels,
  setFeel,
}: {
  option: FeelingOption;
  feels: FeelingOption[];
  setFeel: React.Dispatch<React.SetStateAction<FeelingOption[]>>;
}) {
  const t = useTranslations("NewEntryPage.feelings")
  const pick: Record<FeelingOption, string> = {
    happy: `😆${t("feel1")}`,
    sad: `😔${t("feel2")}`,
    peaceful: `😌${t("feel3")}`,
    frustrated: `😤${t("feel4")}`,
    thoughtful: `🧐${t("feel5")}`,
    inspired: `✨${t("feel6")}`,
  };

  const isSelected = feels.includes(option);

  function handleClick() {
    if (!isSelected && feels.length >= 3) {
      addTextErrors("You can choose max 3 options", "info")
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
