'use client'
//types
import { dailyRecord, FeelingOption } from "@/app/[locale]/new-entry/entry-types/types";

//styles
import "./recentEntries.scss"

//react
import { useEffect } from "react";

//functions
import { fetchDiary } from "@/app/[locale]/new-entry/logicNewEntry/functions";
import ColorText from "./components/colorText";


export default function RecentEntries({diaryRecord}:{diaryRecord: dailyRecord}) {

    //title
    //date
    //feelings
    const pick = {
        happy: "😆Happy",
        sad: "😔Sad",
        peacful: "😌Peacful",
        frustrated: "😤Frustrated",
        thoughtful: "🧐Thoughtful",
        inspired: "✨Inspired",
      };
    //colored text(max 100symbols)
    //tags
    return(
        <>
            <div className="recentWrapper">
                <p className="recentTitle">{diaryRecord.title}</p>
                <p className="recentDate">{diaryRecord.date}</p>
                <div>
                    {diaryRecord.feels.map((feel, key) => 
                    <div key={key}>
                        <span>{pick[feel]}</span>
                    </div>
                    )}
                </div>
                <ColorText highlights={diaryRecord.highlights}/>

                <div>
                    {diaryRecord.tags.map((tag, key) => 
                        <span key={key}>{tag}</span>
                    )}
                </div>
            
            
            </div>
        </>
    )
};
