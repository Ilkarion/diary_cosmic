"use client";
import "./newEntry.scss";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";

import { FeelingOption, ResearchTask, TodayData, Highlight } from "./entry-types/types";
import Highlighter from "./components/highlighter/Highlighter";

import { saveEditor, renderSaved, startData } from "./logicNewEntry/functions";
import Calendar from "./components/calendar/Calendar";
import Feeling from "./components/feelings/Feeling";
import TagsAdd from "./components/tags/TagsAdd";
import ColorResearch from "./components/highlighter/colorResearch";



export default function Page() {

  const [tasks, setTasks] = useState<ResearchTask[]>([]);
  const [savedData, setSavedData] = useState<TodayData | null>(startData);

  const [title, setTitle] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [feel, setFeel] = useState<FeelingOption[]>([]);


  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>(["hello", "bye", "hell", "hemilion"])

//---------------------------------------------------------
  const [highLights, setHighLights] = useState<TodayData["highlights"]>([]) //all separeted highlighted text
  const [allColorTags, setAllColorTags] = useState<ResearchTask[]>([])



  
//for tags
const removeLocalTag = (tag: string) => {
  setTags((prev) => prev.filter(t => t !== tag));
  // allTags НЕ трогаем
};
const removeGlobalTag = (tag: string) => {
  // удалить из глобального списка
  setAllTags((prev) => prev.filter(t => t !== tag));

  // и из текущей записи (если вдруг был выбран)
  setTags((prev) => prev.filter(t => t !== tag));
};



  //SAVE
  const handleSave = () => {
    const data = saveEditor(feel, title, date, tags, tasks, highLights, allColorTags, allTags);
    if(data === null) {return}
    setSavedData(data);
    console.log(JSON.stringify(data, null, 2));
  };


  // AUTO RENDER SAVED
  useEffect(() => {
    if (!savedData) return;
    renderSaved(setFeel, setTitle, setDate, setTags, setTasks, savedData, setHighLights, setAllColorTags);
  }, [savedData]);

  return (
    <div className="main-wraper-new-entry">
      <div className="header-wrapper-newEntry">
        <div className="headerNewEntry">
            <Link href={"/user"}><span>←</span> Back</Link>
            <span>New Day Record</span>
        </div>
        <div className="highlighter-wrapper">
          <Highlighter highLightTekst={tasks} setHighLightTekst={setTasks} allSavedTags={allColorTags} setAllSavedTags={setAllColorTags}/>
        </div>
      </div>
      <div className="diary-wrap">
        <input type="text" placeholder="Entry title" className="titleField"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}/>

        <Calendar date={date} setDate={setDate}/>

        <div className="feelingsWraper">
          <Feeling option="happy" feels={feel} setFeel={setFeel}/>
          <Feeling option="sad" feels={feel} setFeel={setFeel}/>
          <Feeling option="peacful" feels={feel} setFeel={setFeel}/>
          <Feeling option="frustrated" feels={feel} setFeel={setFeel}/>
          <Feeling option="thoughtful" feels={feel} setFeel={setFeel}/>
          <Feeling option="inspired" feels={feel} setFeel={setFeel}/>
        </div>

        {/* <ColorText tasks={tasks}/> */}
        <ColorResearch
        setHighLights={setHighLights}
        setTasks={setTasks}
        researchTasks={tasks}
        highlights={highLights}
        setAllColorTags={setAllColorTags}
      />
      


      <TagsAdd
        tags={tags}
        setTags={setTags}
        allTags={allTags}
        setAllTags={setAllTags}
        removeLocalTag={removeLocalTag}
        removeGlobalTag={removeGlobalTag}
      />

        

        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
