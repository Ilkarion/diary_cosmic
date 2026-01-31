import { FeelingOption, ResearchTask, TodayData } from "../entry-types/types";


export const saveEditor = (
  feels: FeelingOption[],
  title: string,
  date: string,
  tags: string[],
  researchTasks: ResearchTask[]
): TodayData => {

  //highlighed text
  const highlights: TodayData["highlights"] = [];

  //btns for highlighting
  // --> researchTasks


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
  const highlights: TodayData["highlights"] = [
    {
      text: "Hi!",
      color: ""
    },
    {
      text: " My name is Illia",
      color: ""
    }
  ];


  setValue(fullText);
  setHighLights(highlights);
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
      "name": "sss",
      "color": "#66ff99"
    },
    {
      "name": "aadc",
      "color": "#ba66ff"
    },
    {
      "name": "ss",
      "color": "#ffcf66"
    }
  ],
  "highlights": [
    {
      "text": "Hi! My name is ",
      "color": ""
    },
    {
      "text": "Illia",
      "color": "orange"
    },
  ]
}