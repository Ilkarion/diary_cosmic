"use client";
import { useState, useMemo } from "react";
import "./tagsAdd.scss";

import { useTranslations } from "next-intl";

export default function TagsAdd({
  tags,
  setTags,
  allTags,
  setAllTags,
  removeLocalTag,
  removeGlobalTag
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  allTags: string[];
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
  removeLocalTag: (tag: string) => void;
  removeGlobalTag: (tag: string) => void;
}) {
  const t = useTranslations("NewEntryPage")
  const [value, setValue] = useState("");
  const [activeMenuTag, setActiveMenuTag] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!allTags || value.length < 2) return [];
    return allTags
      .filter(
        (t) =>
          t.toLowerCase().startsWith(value.toLowerCase()) &&
          !tags.includes(t)
      )
      .slice(0, 5);
  }, [value, allTags, tags]);

function addTag(tag: string) {
  const clean = tag.trim();
  if (!clean) return;

  setAllTags((prev) => {
    const safePrev = prev || []; // если prev undefined, делаем пустой массив
    return safePrev.includes(clean) ? safePrev : [...safePrev, clean];
  });

  setTags((prev) => {
    const safePrev = prev || [];
    return safePrev.includes(clean) ? safePrev : [...safePrev, clean];
  });

  setValue("");
}

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      addTag(value);
    }
  }

  return (
    <>
      <p className="titleTags">{t("tagsAdd.title")}</p>

      <div className="tagsShow">
        {tags.map((tag_name, key) => (
          <div key={key} className="tagName" onClick={() =>
              setActiveMenuTag((prev) =>prev === tag_name ? null : tag_name)}>
            <span>{tag_name}</span>

            {activeMenuTag === tag_name && (
              <div className="tagMenu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocalTag(tag_name);
                    setActiveMenuTag(null);
                  }}
                >
                  {t("deleteOptions.option1")}
                </button>

                <div className="divineLine"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeGlobalTag(tag_name);
                    setActiveMenuTag(null);
                  }}
                >
                  {t("deleteOptions.option2")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="tagsInputWrapper">
        <input
          type="text"
          placeholder={t("tagsAdd.placeholder")}
          className="tagsField"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={15}
        />

        {suggestions.length > 0 && (
          <div className="tagsSuggestions">
            {suggestions.map((sug, i) => (
              <div
                key={i}
                className="suggestItem"
                onClick={() => addTag(sug)}
              >
                {sug}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
