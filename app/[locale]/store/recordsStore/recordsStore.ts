import {create} from "zustand"

import { AllTags_Records } from "../../allTypes/typesTS"

type RecordsStore = {
    update: boolean,
    fetchedOnce: boolean,
    allTagsRecords: AllTags_Records
}

export const useRecordsStore = create<RecordsStore>(()=>({
    update: true,
    fetchedOnce: false,
    allTagsRecords: {
        diaryAllTags: {
            all_Color_Tags: [],
            all_Tags: []
        },
        diaryRecords: []        
    }
}))




/* 
export interface AllTags_Records {
    diaryAllTags: {
        all_Color_Tags: { name: string, color: string }[],
        all_Tags: string[]
    },
    diaryRecords: [
        {
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
    ]
}

*/