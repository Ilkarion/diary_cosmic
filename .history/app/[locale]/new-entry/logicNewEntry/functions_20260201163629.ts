import { FeelingOption, ResearchTask, TodayData, Highlight } from "../entry-types/types";


export const saveEditor = (
  feels: FeelingOption[],
  title: string,
  date: string,
  tags: string[],
  researchTasks: ResearchTask[],
  highlights: Highlight[],
  allColorTags: ResearchTask[]
): TodayData | null => {

  if (!title.trim()) {
    alert("You have nothing in title. Please name your record.");
    return null;
  }

  if (feels.length === 0) {
    alert("Choose at least 1 feeling.");
    return null;
  }

  //Quill text check
  const plainText = highlights.map(h => h.text).join("").replace(/\s+/g, " ").trim();
  if (!plainText) {
    alert("Text field is empty. Please write something.");
    return null;
  }
  if (plainText.length < 10) {
    alert("Text must contain at least 10 characters.");
    return null;
  }

  return {
    title,
    date,
    feels,
    tags,
    researchTasks,
    highlights,
    allColorTags
  };
};

export const renderSaved = (
  setFeel: React.Dispatch<React.SetStateAction<FeelingOption[]>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDate: React.Dispatch<React.SetStateAction<string>>,
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  applyTasks: (tasks: TodayData["researchTasks"]) => void,
  data: TodayData,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setHighLights: React.Dispatch<React.SetStateAction<TodayData["highlights"]>>,
  setAllColorTags: React.Dispatch<React.SetStateAction<TodayData["allColorTags"]>>
) => {
  // восстановление полей
  setTitle(data.title);
  setDate(data.date);
  setFeel(data.feels);
  setTags(data.tags);
  applyTasks(data.researchTasks);

  const fullText = "Hi! My name is Illia"


  setValue(fullText);
  setHighLights(data.highlights);
  setAllColorTags(data.allColorTags);
};

export const startData:TodayData =   {

  "title": "Introduce yorself)",
  "date": "Friday, December 26, 2025",
  "feels": [
    "happy",
    "peacful",
    "inspired"
  ],
  "tags": ["bye", "hemilion"],

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
  "allTags": ["apple", "Eliasz", "homelion", "rainbow"]

}