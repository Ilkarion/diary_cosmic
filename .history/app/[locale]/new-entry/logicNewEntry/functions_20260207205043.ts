import { FeelingOption, ResearchTask, TodayData, Highlight, AllTags_Records, DiaryRecordPayload, DiaryRecordPayload2 } from "../entry-types/types";

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
    const res = await fetch("https://your-book-backend-1.onrender.com/api/diary", { 
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }, 
    });
    if (res.status === 403 || res.status === 401) {
      await refreshToken();
      return await fetch("https://your-book-backend-1.onrender.com/api/diary", { credentials: "include" });
    }
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


const addDiaryRecord = async (record: DiaryRecordPayload2) => {
  try {
    const res = await fetch("https://your-book-backend-1.onrender.com/api/diary-send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // важно, чтобы куки (access_token) отправлялись
      body: JSON.stringify(record),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error adding record:", data.message);
      return null;
    }

    console.log("Record added successfully:", data);
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
};

// frontend/api/diary.ts

export async function fetchAllTags() {
  try {
    const res = await fetch("https://your-book-backend-1.onrender.com/api/diary-allTags", {
      method: "POST",
      credentials: "include", // важно для отправки cookie с токеном
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch tags");
    }

    const data = await res.json();
    return {
      all_Tags: data.all_Tags,
      all_Color_Tags: data.all_Color_Tags,
    };
  } catch (err) {
    if (err instanceof Error) console.error("Error fetching tags:", err.message);
    return null;
  }
}

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
    console.error("Server error:", text);
    throw new Error("Failed to update record");
  }

  return res.json();
}


//get record by id
export async function fetchDiaryRecord(id: string) {
  const res = await fetch(`https://your-book-backend-1.onrender.com/api/diary-record/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch record");
  }
  return res.json();
}


//delete record
export async function deleteDiaryRecord(id_record:string) {
  const res = await fetch(`https://your-book-backend-1.onrender.com/api/diary-delete/${id_record}`, {
    method: "DELETE",
    credentials: "include", // важно для cookies с JWT
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete record");
  }

  return data;
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
): Promise<TodayData | null> => {   // <- async и Promise
  setSaving(true);

  if (!title.trim()) {
    alert("You have nothing in title. Please name your record.");
    setSaving(false);
    return null;
  }

  if (feels.length === 0) {
    alert("Choose at least 1 feeling.");
    setSaving(false);
    return null;
  }

  if (!date || date === "Invalid Date") {
    alert("Choose date");
    setSaving(false);
    return null;
  }

  const plainText = highlights
    .map(h => h.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    alert("Text field is empty. Please write something.");
    setSaving(false);
    return null;
  }

  if (plainText.length < 10) {
    alert("Text must contain at least 10 characters.");
    setSaving(false);
    return null;
  }

  if (plainText.length > 5000) {
    alert(`Text must contain max 5000 symbols. You have: ${plainText.length}`);
    setSaving(false);
    return null;
  }

  if (mode === "edit") {
    if (!id) {
      alert("I cant update this record. Bcs id isnt correct");
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
      all_Color_Tags,
    };

    await editDiaryRecord(updatedRecord); // <- теперь await работает
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
      all_Color_Tags,
    };

    await addDiaryRecord(newRecord); // <- тоже async
    setSaving(false);
  }

  return {
    id_record: "",
    title: "",
    date: "",
    feels: [],
    tags: [],
    color_Tags: [],
    highlights: [],
    all_Color_Tags,
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


function refreshToken() {
  throw new Error("Function not implemented.");
}
// export const startData:TodayData =   {

//   "title": "Introduce yorself)",
//   "date": "Friday, December 26, 2025",
//   "feels": [
//     "happy",
//     "peacful",
//     "inspired"
//   ],
//   "tags": ["hemilion"],

//   "researchTasks": [
//     {
//       "name": "green",
//       "color": "#66ff99"
//     },
//     {
//       "name": "purple",
//       "color": "#de66ff"
//     }
//   ],
//   "highlights": [
//     {
//       "text": "Hi!",
//       "color": "rgba(222, 102, 255, 0.6)"
//     },
//     {
//       "text": " My name",
//       "color": ""
//     },
//     {
//       "text": " is",
//       "color": "rgba(102, 255, 153, 0.6)"
//     },
//     {
//       "text": " Illia.\n",
//       "color": ""
//     }
//   ],

//   //different table in BackEnd
//   "allColorTags": [
//         {
//       "name": "green",
//       "color": "#66ff99"
//     },
//     {
//       "name": "purple",
//       "color": "#de66ff"
//     },
//         {
//       "name": "green2",
//       "color": "#68ff99"
//     },
//     {
//       "name": "purple2",
//       "color": "#de67ff"
//     },
//         {
//       "name": "green3",
//       "color": "#66ff39"
//     },
//     {
//       "name": "purple3",
//       "color": "#de56ff"
//     }
//   ],
//   "allTags": ["apple", "Eliasz", "hemilion", "rainbow"]

// }

// export const startDataUser:AllTags_Records =   {
//   diaryAllTags: {
//     "all_Color_Tags": [
//         {
//       "name": "green",
//       "color": "#66ff99"
//     },
//     {
//       "name": "purple",
//       "color": "#de66ff"
//     },
//         {
//       "name": "green2",
//       "color": "#68ff99"
//     },
//     {
//       "name": "purple2",
//       "color": "#de67ff"
//     },
//         {
//       "name": "green3",
//       "color": "#66ff39"
//     },
//     {
//       "name": "purple3",
//       "color": "#de56ff"
//     }
//   ],
//     "all_Tags": ["apple", "Eliasz", "hemilion", "rainbow"]
//   },

//   diaryRecords: [
//     {
//     "title": "Introduce yorself)",
//     "date": "Friday, December 26, 2025",
//     "feels": [
//       "happy",
//       "peacful",
//       "inspired"
//     ],
//     "tags": ["hemilion", "home", "sky", "sun"],

//     "color_Tags": [
//       {
//         "name": "green",
//         "color": "#66ff99"
//       },
//       {
//         "name": "purple",
//         "color": "#de66ff"
//       }
//     ],
//     "highlights": [
//       {
//         "text": "Hi!",
//         "color": "rgba(222, 102, 255, 0.6)"
//       },
//       {
//         "text": " My name  ",
//         "color": ""
//       },
//       {
//         "text": " is",
//         "color": "rgba(102, 255, 153, 0.6)"
//       },
//       {
//         "text": " Illia.\n",
//         "color": ""
//       }
//     ],      
//     },
//         {
//     "title": "Introduce yorself)",
//     "date": "Friday, December 26, 2025",
//     "feels": [
//       "happy",
//       "peacful",
//       "inspired"
//     ],
//     "tags": ["hemilion", "home", "sky", "sun"],

//     "color_Tags": [
//       {
//         "name": "green",
//         "color": "#66ff99"
//       },
//       {
//         "name": "purple",
//         "color": "#de66ff"
//       }
//     ],
//     "highlights": [
//       {
//         "text": "Hi!",
//         "color": "rgba(222, 102, 255, 0.6)"
//       },
//       {
//         "text": " My name  ",
//         "color": ""
//       },
//       {
//         "text": " is",
//         "color": "rgba(102, 255, 153, 0.6)"
//       },
//       {
//         "text": " Illia.\n",
//         "color": ""
//       }
//     ],      
//     },
//         {
//     "title": "Introduce yorself)",
//     "date": "Friday, December 26, 2025",
//     "feels": [
//       "happy",
//       "peacful",
//       "inspired"
//     ],
//     "tags": ["hemilion", "home", "sky", "sun"],

//     "color_Tags": [
//       {
//         "name": "green",
//         "color": "#66ff99"
//       },
//       {
//         "name": "purple",
//         "color": "#de66ff"
//       }
//     ],
//     "highlights": [
//       {
//         "text": "Hi!",
//         "color": "rgba(222, 102, 255, 0.6)"
//       },
//       {
//         "text": " My name  ",
//         "color": ""
//       },
//       {
//         "text": " is",
//         "color": "rgba(102, 255, 153, 0.6)"
//       },
//       {
//         "text": " Illia.\n",
//         "color": ""
//       }
//     ],      
//     }
//   ]



//   //different table in BackEnd


// }