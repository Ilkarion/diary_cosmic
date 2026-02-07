import { FeelingOption, ResearchTask, TodayData, Highlight, AllTags_Records, DiaryRecordPayload } from "../entry-types/types";

//API
export async function fetchDiary() {
  try {
    const response = await fetch("http://localhost:3001/api/diary", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data)
    return data;
  } catch (err) {
    console.error("fetchDiary network error: " + err);
    return null;
  }
}


const addDiaryRecord = async (record: DiaryRecordPayload) => {
  try {
    const res = await fetch("http://localhost:3001/api/diary-send", {
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





export const saveEditor = (
  feels: FeelingOption[],
  title: string,
  date: string,
  tags: string[],
  researchTasks: ResearchTask[],
  highlights: Highlight[],
  allColorTags: ResearchTask[],
  allTags: string[],
  mode: string,
): TodayData | null => {

  if (!title.trim()) {
    alert("You have nothing in title. Please name your record.");
    return null;
  }

  if (feels.length === 0) {
    alert("Choose at least 1 feeling.");
    return null;
  }

  // Quill text check
  const plainText = highlights
    .map(h => h.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    alert("Text field is empty. Please write something.");
    return null;
  }

  if (plainText.length < 10) {
    alert("Text must contain at least 10 characters.");
    return null;
  }

  if (plainText.length > 5000) {
    alert(`Text must contain max 5000 symbols. You have: ${plainText.length}`);
    return null;
  }

  const newRecord:DiaryRecordPayload = {
    title: title,
    date: date,
    feels: feels,
    tags:tags,
    color_Tags: researchTasks,
    highlights: highlights,

    all_Tags: allTags,
    all_Color_Tags: allColorTags
  }
  if(mode==="create") {
    addDiaryRecord(newRecord);
  }

  return {
    title:"",
    date:"",
    feels:[],
    tags:[],
    researchTasks:[],
    highlights:[],
    allColorTags,
    allTags,
  };
};


export const renderSaved = (
  setFeel: React.Dispatch<React.SetStateAction<FeelingOption[]>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDate: React.Dispatch<React.SetStateAction<string>>,
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  applyTasks: (tasks: TodayData["researchTasks"]) => void,
  data: TodayData,
  setHighLights: React.Dispatch<React.SetStateAction<TodayData["highlights"]>>,
  setAllColorTags: React.Dispatch<React.SetStateAction<TodayData["allColorTags"]>>,
  setAllTags: React.Dispatch<React.SetStateAction<string[]>>
) => {
  // восстановление полей
  setTitle(data.title);
  setDate(data.date);
  setFeel(data.feels);
  setTags(data.tags);
  applyTasks(data.researchTasks);
  setHighLights(data.highlights);


  setAllColorTags(data.allColorTags);
  setAllTags(data.allTags)
};

export const startData:TodayData =   {

  "title": "Introduce yorself)",
  "date": "Friday, December 26, 2025",
  "feels": [
    "happy",
    "peacful",
    "inspired"
  ],
  "tags": ["hemilion"],

  "researchTasks": [
    {
      "name": "green",
      "color": "#66ff99"
    },
    {
      "name": "purple",
      "color": "#de66ff"
    }
  ],
  "highlights": [
    {
      "text": "Hi!",
      "color": "rgba(222, 102, 255, 0.6)"
    },
    {
      "text": " My name",
      "color": ""
    },
    {
      "text": " is",
      "color": "rgba(102, 255, 153, 0.6)"
    },
    {
      "text": " Illia.\n",
      "color": ""
    }
  ],

  //different table in BackEnd
  "allColorTags": [
        {
      "name": "green",
      "color": "#66ff99"
    },
    {
      "name": "purple",
      "color": "#de66ff"
    },
        {
      "name": "green2",
      "color": "#68ff99"
    },
    {
      "name": "purple2",
      "color": "#de67ff"
    },
        {
      "name": "green3",
      "color": "#66ff39"
    },
    {
      "name": "purple3",
      "color": "#de56ff"
    }
  ],
  "allTags": ["apple", "Eliasz", "hemilion", "rainbow"]

}

export const startDataUser:AllTags_Records =   {
  diaryAllTags: {
    "all_Color_Tags": [
        {
      "name": "green",
      "color": "#66ff99"
    },
    {
      "name": "purple",
      "color": "#de66ff"
    },
        {
      "name": "green2",
      "color": "#68ff99"
    },
    {
      "name": "purple2",
      "color": "#de67ff"
    },
        {
      "name": "green3",
      "color": "#66ff39"
    },
    {
      "name": "purple3",
      "color": "#de56ff"
    }
  ],
    "all_Tags": ["apple", "Eliasz", "hemilion", "rainbow"]
  },

  diaryRecords: [
    {
    "title": "Introduce yorself)",
    "date": "Friday, December 26, 2025",
    "feels": [
      "happy",
      "peacful",
      "inspired"
    ],
    "tags": ["hemilion", "home", "sky", "sun"],

    "color_Tags": [
      {
        "name": "green",
        "color": "#66ff99"
      },
      {
        "name": "purple",
        "color": "#de66ff"
      }
    ],
    "highlights": [
      {
        "text": "Hi!",
        "color": "rgba(222, 102, 255, 0.6)"
      },
      {
        "text": " My name  ",
        "color": ""
      },
      {
        "text": " is",
        "color": "rgba(102, 255, 153, 0.6)"
      },
      {
        "text": " Illia.\n",
        "color": ""
      }
    ],      
    },
        {
    "title": "Introduce yorself)",
    "date": "Friday, December 26, 2025",
    "feels": [
      "happy",
      "peacful",
      "inspired"
    ],
    "tags": ["hemilion", "home", "sky", "sun"],

    "color_Tags": [
      {
        "name": "green",
        "color": "#66ff99"
      },
      {
        "name": "purple",
        "color": "#de66ff"
      }
    ],
    "highlights": [
      {
        "text": "Hi!",
        "color": "rgba(222, 102, 255, 0.6)"
      },
      {
        "text": " My name  ",
        "color": ""
      },
      {
        "text": " is",
        "color": "rgba(102, 255, 153, 0.6)"
      },
      {
        "text": " Illia.\n",
        "color": ""
      }
    ],      
    },
        {
    "title": "Introduce yorself)",
    "date": "Friday, December 26, 2025",
    "feels": [
      "happy",
      "peacful",
      "inspired"
    ],
    "tags": ["hemilion", "home", "sky", "sun"],

    "color_Tags": [
      {
        "name": "green",
        "color": "#66ff99"
      },
      {
        "name": "purple",
        "color": "#de66ff"
      }
    ],
    "highlights": [
      {
        "text": "Hi!",
        "color": "rgba(222, 102, 255, 0.6)"
      },
      {
        "text": " My name  ",
        "color": ""
      },
      {
        "text": " is",
        "color": "rgba(102, 255, 153, 0.6)"
      },
      {
        "text": " Illia.\n",
        "color": ""
      }
    ],      
    }
  ]



  //different table in BackEnd


}