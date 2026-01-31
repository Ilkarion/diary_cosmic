'use client'



import { useState } from "react";

import { ResearchTask } from "../../entry-types/types";

export default function Highlighter(
    {highLightTekst, setHighLightTekst}:
    {setHighLightTekst:React.Dispatch<React.SetStateAction<ResearchTask[]>>,
    highLightTekst:ResearchTask[]}) 
    {
    const [newTaskColor, setNewTaskColor] = useState("#66ff99");
    const [newTaskName, setNewTaskName] = useState("");


    return(
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
                placeholder=""
                type="color"
                className="colorPick"
                value={newTaskColor}
                onChange={(e) => setNewTaskColor(e.target.value)}
                />
            </div>

            <button
            className="btn neon"
            onClick={() => {
                if (!newTaskName.trim()) return;
                setHighLightTekst([...highLightTekst, { name: newTaskName, color: newTaskColor }]);
                setNewTaskName("");
            }}
            >
            Add
            </button>
        </div>
        </>
    )
};
