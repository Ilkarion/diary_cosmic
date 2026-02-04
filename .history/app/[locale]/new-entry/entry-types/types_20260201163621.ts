export type ResearchTask = {
  name: string;
  color: string;
};

export type Highlight = {
  text: string;
  color: string;
};

export type FeelingOption =
  | "happy"
  | "sad"
  | "peacful"
  | "frustrated"
  | "thoughtful"
  | "inspired";

export interface TodayData {
  title: string;
  date: string;
  feels: FeelingOption[];
  tags: string[];
  researchTasks: ResearchTask[];
  highlights: { text: string; color: string }[];
  allColorTags: ResearchTask[];
  allTags: string[]
}

