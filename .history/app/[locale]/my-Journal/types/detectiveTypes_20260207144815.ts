import { FeelingOption, ResearchTask } from "../../new-entry/entry-types/types";

// types/detectiveTypes.ts


export interface dailyRecordMap {
  id_record?: string;
  title: string;
  date: string;
  feels: FeelingOption[];
  highlights: { text: string; color: string }[];
  color_Tags: ResearchTask[];
  tags: string[];
  created_at: string;
}