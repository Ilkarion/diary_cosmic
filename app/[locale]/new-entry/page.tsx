"use client";
import "./newEntry.scss";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";

import { FeelingOption, ResearchTask, TodayData } from "../allTypes/typesTS";
import Highlighter from "./components/highlighter/Highlighter";

import { saveEditor, renderSaved, fetchDiaryRecord, deleteDiaryRecord } from "../allFunctions/newEntry/functions";
import Calendar from "./components/calendar/Calendar";
import Feeling from "./components/feelings/Feeling";
import TagsAdd from "./components/tags/TagsAdd";
import ColorResearch from "./components/highlighter/colorResearch";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";
import { addTextErrors } from "../store/errorsStore/functions";
import { getRecords_TagsBackEnd, getRecords_TagsFrontEnd, setUpdateTrue } from "../store/recordsStore/functions";



export default function Page() {
  const t = useTranslations("NewEntryPage")

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

  const [feelMenuOpen, setFeelMenuOpen] = useState(false);
  
  const mode = searchParams.get('mode') ?? 'create';

  useEffect(() => {
    async function loadTags() {

      const data_Tags = getRecords_TagsFrontEnd().diaryAllTags
      if (data_Tags && data_Tags.all_Color_Tags.length > 0) {
        setAllTags(data_Tags.all_Tags);
        setAllColorTags(data_Tags.all_Color_Tags);
      } else {
        await getRecords_TagsBackEnd()
        const data_TagsRecords = getRecords_TagsFrontEnd().diaryAllTags
        setAllTags(data_TagsRecords.all_Tags);
        setAllColorTags(data_TagsRecords.all_Color_Tags);
      }
    }

    loadTags();
    if (mode === "edit") {
      const record_id = searchParams.get('id');
      async function getRecordBy_id() {
        if(!record_id) return
        const record_data = await fetchDiaryRecord(record_id)
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

const deleteEditableRecord = ()=>{
  const mode = searchParams.get("mode")
  if(mode==="edit") {
    async function deleteAsyncRecord(id_record:string) {
      await deleteDiaryRecord(id_record)
      addTextErrors("This record was deleted)!", "success")
      router.push("/new-entry?mode=create")
      setSavedData({
        id_record: "",
        title: "",
        date: "",
        feels: [],
        tags: [],
        color_Tags: [],
        highlights: [],
        all_Color_Tags: savedData?.all_Color_Tags ?? [],
        all_Tags: savedData?.all_Tags ?? []
      })
    }
    const id_record = savedData?.id_record
    if(id_record){
      deleteAsyncRecord(id_record)
      setUpdateTrue()
    } else {
      addTextErrors("Sorry, i can't delete this record.\nCan't find its id", "error")
    }
  }
}
  const router = useRouter()
  //SAVE
const handleSave = async () => {  // <- async функция
  if (mode === "edit") {
    const id_record = searchParams.get("id");
    if (!id_record) return;

    const data = await saveEditor(
      feel, title, date, tags, tasks,
      highLights, allColorTags, allTags, mode, setSaving, id_record
    );

    if (data) {
      setAllColorTags(data.all_Color_Tags);
      setAllTags(data.all_Tags);
      setSavedData(data);
    }
    addTextErrors("Record updated successfully", "success");
    router.push(`/new-entry?mode=create`);
  }

  if (mode === "create") {
    const data = await saveEditor(
      feel, title, date, tags, tasks,
      highLights, allColorTags, allTags, mode, setSaving, null
    );

    if (!data) return;
    addTextErrors("New record created", "success")

    setTitle(data.title);
    setTasks(data.color_Tags);
    setTags(data.tags);
    setHighLights(data.highlights);
    setFeel(data.feels);
    setDate(data.date);
    setAllTags(data.all_Tags);
    setAllColorTags(data.all_Color_Tags);
  }
  setUpdateTrue()
};



  // AUTO RENDER SAVED
  useEffect(() => {
    if (!savedData) return;
    if(mode==="create") {
      return
    } else if(mode==="edit") {
      renderSaved(setFeel, setTitle, setDate, setTags, setTasks, savedData, setHighLights);
    }
    
  }, [savedData, mode]);

  return (
    <div className="main-wraper-new-entry">
      <div className="header-wrapper-newEntry">
        <div className="headerNewEntry">
            <Link href={"/user"}><span>←</span> {t("form.header.return")}</Link>
            <span>{t("form.header.title")}</span>
        </div>
        <div className="highlighter-wrapper">
          <Highlighter highLightTekst={tasks} 
          setHighLightTekst={setTasks} 
          allSavedTags={allColorTags} 
          setAllSavedTags={setAllColorTags}/>
        </div>
      </div>
      <div className="diary-wrap">
        <input type="text" placeholder={`${t("form.header.title")}...`} className="titleField"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}/>

        {date && mode==="edit" &&<Calendar date={date} setDate={setDate} mode="edit"/>}
        {mode==="create" &&<Calendar date={date} setDate={setDate} mode="create"/>}
        
<div className="feelingsWraper">

  {/* Desktop version */}
  <div className="feelingsDesktop">
    <Feeling option="happy" feels={feel} setFeel={setFeel}/>
    <Feeling option="sad" feels={feel} setFeel={setFeel}/>
    <Feeling option="peaceful" feels={feel} setFeel={setFeel}/>
    <Feeling option="frustrated" feels={feel} setFeel={setFeel}/>
    <Feeling option="thoughtful" feels={feel} setFeel={setFeel}/>
    <Feeling option="inspired" feels={feel} setFeel={setFeel}/>
  </div>

  {/* Mobile dropdown */}
  <div className="feelingsDropdown">
    <button
      type="button"
      className="feelingsDropdownBtn"
      onClick={() => setFeelMenuOpen((p) => !p)}
    >
      {feel.length ? feel.join(", ") : "Select feelings"}
    </button>

    {feelMenuOpen && (
      <div className="feelingsDropdownMenu">
        <Feeling option="happy" feels={feel} setFeel={setFeel}/>
        <Feeling option="sad" feels={feel} setFeel={setFeel}/>
        <Feeling option="peaceful" feels={feel} setFeel={setFeel}/>
        <Feeling option="frustrated" feels={feel} setFeel={setFeel}/>
        <Feeling option="thoughtful" feels={feel} setFeel={setFeel}/>
        <Feeling option="inspired" feels={feel} setFeel={setFeel}/>
      </div>
    )}
  </div>

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

        

        <div className="btnWraperNewEntry">
          <button className="save-btn" onClick={handleSave} disabled={saving}>{t("form.saveBtn")}</button>
          {mode==="edit" && <button className="delete_editMode_btn" onClick={deleteEditableRecord}>{t("form.deleteBtn")}</button>}
        </div>
      </div>
    </div>
  );
}
