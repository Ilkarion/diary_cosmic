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
import ColorTags from "./components/ColorTagsUser"


export default function RecentEntries({diaryRecord}:{diaryRecord: dailyRecord}) {

    //title
    //date
    //feelings
    const pick = {
        happy: "😆",
        sad: "😔",
        peacful: "😌",
        frustrated: "😤",
        thoughtful: "🧐",
        inspired: "✨",
      };
    //colored text(max 100symbols)
    //tags
    return(
        <>
            <div className="recentWrapper">
                    <div className="titleFeelsWrapper">
                        <p className="recentTitle">{diaryRecord.title}</p>
                        <div className="recentlyFeels">
                            {diaryRecord.feels.map((feel, key) =>
                                <span key={key}>{pick[feel]}</span>
                            )}
                        </div>
                    </div>
                <div className="divineLine"></div>
                <p className="recentDate">{diaryRecord.date}</p>
                <ColorTags tags={diaryRecord.color_Tags}/>
                <ColorText highlights={diaryRecord.highlights}/>

                <div className="recentTags">
                    {diaryRecord.tags.map((tag, key) => {
                        console.log(tag)
                        return <span key={key}>#{tag}</span>
                    }
                        
                    )}
                </div>
            
            
            </div>
        </>
    )
};
