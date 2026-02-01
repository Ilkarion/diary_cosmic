'use client'

import "./highlighter.scss"
import { useState } from "react";
import { ResearchTask } from "../../entry-types/types";

export default function Highlighter(
  {
    highLightTekst,
    setHighLightTekst,
    allSavedTags = [], // 🔥 передаём все теги из родителя (глобально сохранённые)
  }: {
    setHighLightTekst: React.Dispatch<React.SetStateAction<ResearchTask[]>>;
    highLightTekst: ResearchTask[];
    allSavedTags?: ResearchTask[]; // все теги, созданные ранее в других записях
  }
) {
  const [newTaskColor, setNewTaskColor] = useState("#66ff99");
  const [newTaskName, setNewTaskName] = useState("");

  const isColorExists = highLightTekst.some(t => t.color === newTaskColor);

  const handleAdd = () => {
    if (!newTaskName.trim()) return;

    // prohibition of identical colors
    if (isColorExists) return;

    setHighLightTekst(prev => [
      ...prev,
      { name: newTaskName.trim(), color: newTaskColor },
    ]);

    setNewTaskName("");
  };

  const handleQuickAdd = (tag: ResearchTask) => {
    const alreadyAdded = highLightTekst.some(t => t.color === tag.color);
    if (alreadyAdded) return;

    setHighLightTekst(prev => [...prev, tag]);
  };

  return (
    <>
      <div className="task-creator">
        <input
          className="input"
          placeholder="color name…"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />

        <div className="wrapper-picker">
          <input
            title="color"
            type="color"
            className="colorPick"
            value={newTaskColor}
            onChange={(e) => setNewTaskColor(e.target.value)}
          />
        </div>

        <button
          className="btn neon"
          onClick={handleAdd}
          disabled={isColorExists || !newTaskName.trim()}
          title={isColorExists ? "This color already exists" : ""}
        >
          Add
        </button>
      </div>

      {/* 🔥 Быстрый выбор ранее созданных тегов */}
      {allSavedTags.length > 0 && (
        <div className="quick-tags">
          {allSavedTags.map((tag, i) => {
            const disabled = highLightTekst.some(t => t.color === tag.color);

            return (
              <button
                key={i}
                className="quick-tag"
                style={{
                  borderColor: tag.color,
                  color: tag.color,
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
                disabled={disabled}
                onClick={() => handleQuickAdd(tag)}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
