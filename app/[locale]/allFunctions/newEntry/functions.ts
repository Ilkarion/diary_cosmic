import { refreshToken } from "../user/functions";
import { FeelingOption, ResearchTask, TodayData, Highlight, DiaryRecordPayload2 } from '../../allTypes/typesTS';
import { addTextErrors } from "../../store/errorsStore/functions";

//clean colors:
export const cleanHighlightsByGlobalColors = (
  highlights: Highlight[],
  allColorTags: ResearchTask[]
): Highlight[] => {
  const allowed = new Set(
    allColorTags.map(t => t.color.toLowerCase())
  );

  return highlights.map(h => {
    if (!h.color) return h;

    const isAllowed = [...allowed].some(hex =>{
      if(!hex) {return hex=""}
      h.color.toLowerCase().includes(hex.replace("#", ""))
  });

    return {
      ...h,
      color: isAllowed ? h.color : "",
    };
  });
};



//API
export async function fetchDiary() {
  try {
    const request = () =>
      fetch("https://your-book-backend-1.onrender.com/api/diary", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

    let res = await request();

    if (!res.ok) {
      await refreshToken();
      res = await request();
    }

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}



const addDiaryRecord = async (record: DiaryRecordPayload2) => {
  try {
    const request = () =>
      fetch("https://your-book-backend-1.onrender.com/api/diary-send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

    let res = await request();

    if (!res.ok) {
      await refreshToken();
      res = await request();
    }

    if (!res.ok) throw new Error("Request failed");

    return res.json();
  } catch (err) {
    console.error("Add diary error:", err);
    return null;
  }
};

// frontend/api/diary.ts

// export async function fetchAllTags() {
//   try {
//     const request = () =>
//       fetch("https://your-book-backend-1.onrender.com/api/diary-allTags", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//       });

//     let res = await request();

//     if (!res.ok) {
//       await refreshToken();
//       res = await request();
//     }

//     if (!res.ok) {
//       return null 
//     };

//     const data = await res.json();
//     return {
//       all_Tags: data.all_Tags,
//       all_Color_Tags: data.all_Color_Tags,
//     };
//   } catch {
//     return null;
//   }
// }//REMOVE THAT AND From BACKEND TOO


//edit record
export async function editDiaryRecord(record: TodayData) {
  const res = await fetch("https://your-book-backend-1.onrender.com/api/diary-edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      record,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    addTextErrors(`Server error:${text}`, 'error')
    throw new Error("Failed to update record");
  }

  return res.json();
}


//get record by id
export async function fetchDiaryRecord(id: string) {
  try {
    const request = () =>
      fetch(`https://your-book-backend-1.onrender.com/api/diary-record/${id}`, {
        credentials: "include",
      });

    let res = await request();

    if (!res.ok) {
      await refreshToken();
      res = await request();
    }

    if (!res.ok) {
      addTextErrors("Failed to get your record :(", "error")
      throw new Error("Failed");
    }

    return res.json();
  } catch {
    return null;
  }
}



//delete record
export async function deleteDiaryRecord(id_record: string) {
  try {
    const request = () =>
      fetch(`https://your-book-backend-1.onrender.com/api/diary-delete/${id_record}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

    let res = await request();

    if (!res.ok) {
      await refreshToken();
      res = await request();
    }

    if (!res.ok) {
      addTextErrors("Delete failed", "error")
      throw new Error("Delete failed")

    }
    return res.json();
  } catch {
    return null;
  }
}



export const saveEditor = async (
  feels: FeelingOption[],
  title: string,
  date: string,
  tags: string[],
  color_Tags: ResearchTask[],
  highlights: Highlight[],
  all_Color_Tags: ResearchTask[],
  all_Tags: string[],
  mode: string,
  setSaving: React.Dispatch<React.SetStateAction<boolean>>,
  id?: string | null,
): Promise<TodayData | null> => {
  setSaving(true);

  if (!title.trim()) {
    addTextErrors("You have nothing in title. Please name your record.", "info");
    setSaving(false);
    return null;
  }

  if (feels.length === 0) {
    addTextErrors("Choose at least 1 feeling.", "info");
    setSaving(false);
    return null;
  }

  if (!date || date === "Invalid Date") {
    addTextErrors("Choose date", "info");
    setSaving(false);
    return null;
  }

  const plainText = highlights.map(h => h.text).join("").replace(/\s+/g, " ").trim();
  if (!plainText) {
    addTextErrors("Big text field is empty. Please write something.", "info");
    setSaving(false);
    return null;
  }

  if (plainText.length < 10) {
    addTextErrors("Text must contain at least 10 characters.", "info");
    setSaving(false);
    return null;
  }

  if (plainText.length > 5000) {
    addTextErrors(`Text must contain max 5000 symbols. You have: ${plainText.length}`, "info");
    setSaving(false);
    return null;
  }

  // Объединяем новые цветовые теги с глобальными
  const newColorTags = color_Tags.filter(
    tag => !all_Color_Tags.some(t => t.name === tag.name && t.color === tag.color)
  );
  const updatedAllColorTags = [...all_Color_Tags, ...newColorTags];

  if (mode === "edit") {
    if (!id) {
      addTextErrors("I can't update this record. Id is missing.", "info");
      setSaving(false);
      return null;
    }

    const updatedRecord: TodayData = {
      id_record: id,
      title,
      date,
      feels,
      tags,
      color_Tags,
      highlights,
      all_Tags,
      all_Color_Tags: updatedAllColorTags,
    };

    await editDiaryRecord(updatedRecord);
    setSaving(false);

  } else {
    const newRecord: DiaryRecordPayload2 = {
      title,
      date,
      feels,
      tags,
      color_Tags,
      highlights,
      all_Tags,
      all_Color_Tags: updatedAllColorTags,
    };

    await addDiaryRecord(newRecord);
    setSaving(false);
  }

  return {
    id_record: "",
    title,
    date,
    feels: [],
    tags: [],
    color_Tags: [],
    highlights: [],
    all_Color_Tags: updatedAllColorTags,
    all_Tags,
  };
};



export const renderSaved = (
  setFeel: React.Dispatch<React.SetStateAction<FeelingOption[]>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDate: React.Dispatch<React.SetStateAction<string>>,
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  applyTasks: (tasks: TodayData["color_Tags"]) => void,
  data: TodayData,
  setHighLights: React.Dispatch<React.SetStateAction<TodayData["highlights"]>>,
) => {
  // восстановление полей
  setTitle(data.title);
  setDate(data.date);
  setFeel(data.feels);
  setTags(data.tags);
  applyTasks(data.color_Tags);
  setHighLights(data.highlights);

};

