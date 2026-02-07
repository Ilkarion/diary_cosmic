'use client'

import "./highlighter.scss"
import { useState } from "react";
import { ResearchTask } from "../../entry-types/types";
import Image from "next/image";
import moreOptionsIcon from "@/public/imgs/more-options.svg"

export default function Highlighter(
  {
    highLightTekst,
    setHighLightTekst,
    allSavedTags = [],
    setAllSavedTags, 
  }: {
    setHighLightTekst: React.Dispatch<React.SetStateAction<ResearchTask[]>>;
    highLightTekst: ResearchTask[];
    allSavedTags?: ResearchTask[];
    setAllSavedTags: React.Dispatch<React.SetStateAction<ResearchTask[]>>; 
  }
) {
  const [newTaskColor, setNewTaskColor] = useState("#66ff99");
  const [newTaskName, setNewTaskName] = useState("");
  const [access, setAccess] = useState(false)

  const isColorExists = highLightTekst.some(t => t.color === newTaskColor);

  const handleAdd = () => {
    if (!newTaskName.trim()) return;
    if (isColorExists) return;

    const newTag = { name: newTaskName.trim(), color: newTaskColor };

    // ✅ добавляем в текущие теги записи
    setHighLightTekst(prev => [...prev, newTag]);

    // ✅ добавляем в глобальные теги (если такого ещё нет)
    if(allSavedTags.length === 0) {
      setAllSavedTags(prev => {
        const exists = prev.some(t => t.color === newTag.color);
        if (exists) return prev;
        return [...prev, newTag];
      });
    }


    setNewTaskName("");
  };

  const handleQuickAdd = (tag: ResearchTask) => {
    const alreadyAdded = highLightTekst.some(t => t.color === tag.color);
    if (alreadyAdded) return;

    // ✅ добавляем в текущие теги записи
    setHighLightTekst(prev => [...prev, tag]);
    // ❌ НЕ удаляем из allSavedTags (он должен существовать в системе)
  };

  // 🔥 быстрые теги, которые ещё НЕ выбраны в этой записи
  const availableQuickTags = allSavedTags.filter(
    tag => !highLightTekst.some(t => t.color === tag.color)
  );

  return (
    <>
      <div className="task-creator">
        <div className="textFieldColor">
            <input
              className="input"
              placeholder="color name…"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <div className="moreOptionsIcon" onClick={()=>setAccess(!access)}>
                <Image src={moreOptionsIcon} alt="available colors"/>
            </div>
        </div>

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
        >
          Add
        </button>
      </div>

      {/* Quick selection of previously created tags (ONLY available ones) */}
      {availableQuickTags.length > 0 && (
        <div className="quick-tags">
          {access &&
            availableQuickTags.map((tag, i) => (
                <button
                key={i}
                className="quick-tag"
                style={{
                    borderColor: tag.color,
                    color: tag.color,
                }}
                onClick={() => handleQuickAdd(tag)}
                >
                {tag.name}
                </button>
            ))}
        </div>
      )}
    </>
  );
}
