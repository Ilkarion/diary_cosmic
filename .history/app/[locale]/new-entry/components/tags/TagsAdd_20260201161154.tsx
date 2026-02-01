"use client";
import { useState, useMemo } from "react";
import "./tagsAdd.scss";

export default function TagsAdd({
  tags,
  setTags,
  allTags,
  setAllTags
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  allTags: string[];
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [value, setValue] = useState("");

  // фильтрация подсказок по первым буквам
  const suggestions = useMemo(() => {
    if (value.length < 2) return [];
    return allTags
      .filter(
        (t) =>
          t.toLowerCase().startsWith(value.toLowerCase()) &&
          !tags.includes(t)
      )
      .slice(0, 5);
  }, [value, allTags, tags]);

  function addTag(tag: string) {
    if(!allTags.includes(tag)) {
      setAllTags([...allTags, tag])
    }
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      addTag(value.trim());
    }
  }

  function removeTag(tagName: string) {
    setTags(tags.filter((tag) => tag !== tagName));
  }

  return (
    <>
      <p className="titleTags">Tags</p>

      <div className="tagsShow">
        {tags.map((tag_name, key) => (
          <div
            key={key}
            className="tagName"
            onClick={() => removeTag(tag_name)}
          >
            <span>{tag_name}</span>
          </div>
        ))}
      </div>

      <div className="tagsInputWrapper">
        <input
          type="text"
          placeholder="Add tags (Press Enter)"
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
