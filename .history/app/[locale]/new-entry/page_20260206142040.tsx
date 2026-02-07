"use client";
import "./newEntry.scss";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";

import { FeelingOption, ResearchTask, TodayData, Highlight } from "./entry-types/types";
import Highlighter from "./components/highlighter/Highlighter";

import { saveEditor, renderSaved, fetchDiary, fetchAllTags, fetchDiaryRecord } from "./logicNewEntry/functions";
import Calendar from "./components/calendar/Calendar";
import Feeling from "./components/feelings/Feeling";
import TagsAdd from "./components/tags/TagsAdd";
import ColorResearch from "./components/highlighter/colorResearch";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";



export default function Page() {

  const [tasks, setTasks] = useState<ResearchTask[]>([]);
  const [savedData, setSavedData] = useState<TodayData | null>();

  const [title, setTitle] = useState<string>("")

  const [date, setDate] = useState<string>("");        // human-readable
  const [feel, setFeel] = useState<FeelingOption[]>([]);


  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

//-----------------highlights-----------------------------
  const [highLights, setHighLights] = useState<TodayData["highlights"]>([]) //all separeted highlighted text
  const [allColorTags, setAllColorTags] = useState<ResearchTask[]>([])

  //---------------------get params from URL-------------------------
  const searchParams = useSearchParams()

  //waiting for server saved data---------------------
  const [saving, setSaving] = useState(false)
  
  const mode = searchParams.get('mode') ?? 'create';

  useEffect(() => {
    async function loadTags() {
      const data = await fetchAllTags();
      if (data) {
        setAllTags(data.all_Tags);
        setAllColorTags(data.all_Color_Tags);
      }
    }

    loadTags();
    // console.log("mode: " + mode) // work
    if (mode === "edit") {
      const record_id = searchParams.get('id');
      async function getRecordBy_id() {
        if(!record_id) return
        const record_data = await fetchDiaryRecord(record_id)
        console.log(record_data)
        setSavedData(record_data)
      }
      getRecordBy_id()
    }
  }, [mode, searchParams]);



//for tags
const removeLocalTag = (tag: string) => {
  setTags((prev) => prev.filter(t => t !== tag));
};
const removeGlobalTag = (tag: string) => {
  setAllTags((prev) => prev.filter(t => t !== tag));
  setTags((prev) => prev.filter(t => t !== tag));
};


  const router = useRouter()
  //SAVE
  const handleSave = () => {
    if(mode==="edit") {
      const id_record = searchParams.get("id")
      if(!id_record) return
      const data = saveEditor(feel, title, date, tags, tasks, 
      highLights, allColorTags, allTags, mode, setSaving, id_record);
      setSavedData(data)
      router.push(`/new-entry?mode=create`); // пример пути
    }
    
    if(mode==="create") {
      const data = saveEditor(feel, title, date, tags, tasks, 
        highLights, allColorTags, allTags, mode, setSaving, null);

      if(data === null) {return}
      setTitle(data.title)
      setTasks(data.color_Tags)
      setTags(data.tags)
      setHighLights(data.highlights)
      setFeel(data.feels)
      setDate(data.date)
      setAllTags(data.all_Tags)
      setAllColorTags(data.all_Color_Tags)
    }
  };


  // AUTO RENDER SAVED
  useEffect(() => {
    if (!savedData) return;
    if(mode==="create") {
      return
    } else if(mode==="edit") {
      renderSaved(setFeel, setTitle, setDate, setTags, setTasks, savedData, setHighLights, setAllColorTags, setAllTags);
    }
    
  }, [savedData, mode]);

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

        <Calendar
          date={date}
          setDate={setDate}
        />

        <div className="feelingsWraper">
          <Feeling option="happy" feels={feel} setFeel={setFeel}/>
          <Feeling option="sad" feels={feel} setFeel={setFeel}/>
          <Feeling option="peacful" feels={feel} setFeel={setFeel}/>
          <Feeling option="frustrated" feels={feel} setFeel={setFeel}/>
          <Feeling option="thoughtful" feels={feel} setFeel={setFeel}/>
          <Feeling option="inspired" feels={feel} setFeel={setFeel}/>
        </div>

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

        

        <button className="save-btn" onClick={handleSave} disabled={saving}>Save</button>
      </div>
    </div>
  );
}
