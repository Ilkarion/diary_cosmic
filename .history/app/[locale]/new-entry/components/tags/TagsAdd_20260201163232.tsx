"use client";
import { useState, useMemo } from "react";
import "./tagsAdd.scss";

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
  const [value, setValue] = useState("");
  const [activeMenuTag, setActiveMenuTag] = useState<string | null>(null);

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
    setAllTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setValue("");
  }

  return (
    <>
      <p className="titleTags">Tags</p>

      <div className="tagsShow">
        {tags.map((tag_name, key) => (
          <div
            key={key}
            className="tagName"
            onClick={() =>
              setActiveMenuTag((prev) =>
                prev === tag_name ? null : tag_name
              )
            }
          >
            <span>{tag_name}</span>

            {activeMenuTag === tag_name && (
              <div className="tagMenu">
                <button onClick={removeFromEntry}>Remove from this record</button>
                <div className="divineLine"></div>
                <button onClick={deleteForever}>Delete forever</button>
            </div>
            )}

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
