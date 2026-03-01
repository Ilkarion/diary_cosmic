

//showUser.tsx:
export type UserData = { 
  user?: {
    username: string
    email: string
    created_at: string
  }
}



//customAlert.tsx && ErrorHandler.tsx:
export type AlertType = "success" | "error" | "info" 


export interface Tag {
  name: string;
  color: string;
}

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
  id_record: string;
  title: string;
  date: string;
  feels: FeelingOption[];
  tags: string[];
  color_Tags: ResearchTask[];
  highlights: { text: string; color: string }[];
  all_Color_Tags: ResearchTask[];
  all_Tags: string[]
}

export interface dailyRecord {
  id_user: number;
  id_record: string;
  title: string;
  date: string;
  feels: FeelingOption[];
  highlights: { text: string; color: string }[];
  color_Tags: ResearchTask[];
  created_at: string;
  tags: string[];
}


export interface AllTags_Records {
    diaryAllTags: {
        all_Color_Tags: { name: string, color: string }[],
        all_Tags: string[]
    },
    diaryRecords: dailyRecord[]
}

export interface DiaryRecordPayload {
  id_record: string;
  title: string;
  date: string;
  feels: string[];
  tags: string[];
  color_Tags: ResearchTask[];
  highlights: Highlight[];

  all_Tags: string[];
  all_Color_Tags:  { name: string, color: string }[];
}

export interface DiaryRecordPayload2 {
  id_record?: string;
  title: string;
  date: string;
  feels: string[];           // здесь можешь заменить на FeelingOption[]
  tags: string[];
  color_Tags: ResearchTask[];      // здесь можешь заменить на ResearchTask[]
  highlights: Highlight[];      // здесь можешь заменить на Highlight[]

  all_Tags: string[];
  all_Color_Tags:  { name: string, color: string }[];
}

export interface dailyRecordMap {
  id_user?: number;
  id_record: string;
  title: string;
  date: string;
  feels: FeelingOption[];
  highlights: { text: string; color: string }[];
  color_Tags: ResearchTask[];
  tags: string[];
  created_at: string;
}


export interface dailyRecordForFlow {
  id_record: string;
  title: string;
  date: string;
  feels: FeelingOption[];
  highlights: { text: string; color: string }[];
  color_Tags: ResearchTask[];
  tags: string[];
  created_at: string;
}