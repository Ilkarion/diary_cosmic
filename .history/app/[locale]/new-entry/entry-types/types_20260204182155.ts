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

export interface AllTags_Records {
    diaryAllTags: {
        all_Color_Tags: { name: string, color: string }[],
        all_Tags: string[]
    },
    diaryRecords: {
          title: string;
          date: string;
          feels: FeelingOption[];
          highlights: { text: string; color: string }[];
          colorTags: ResearchTask[];
          tags: string[];
    }[]
}