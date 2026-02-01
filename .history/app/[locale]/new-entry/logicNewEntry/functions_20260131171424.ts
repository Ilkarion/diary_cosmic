import { FeelingOption, ResearchTask, TodayData, Highlight } from "../entry-types/types";


export const saveEditor = (
  feels: FeelingOption[],
  title: string,
  date: string,
  tags: string[],
  researchTasks: ResearchTask[],
  highlights: Highlight[]
): TodayData => {



  return {
    title,
    date,
    feels,
    tags,
    researchTasks,
    highlights
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
  setHighLights: React.Dispatch<React.SetStateAction<TodayData["highlights"]>>
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
  ]

}