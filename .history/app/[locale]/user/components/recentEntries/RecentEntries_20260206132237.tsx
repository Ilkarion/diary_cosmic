'use client'
//types
import { dailyRecord } from "@/app/[locale]/new-entry/entry-types/types";

//styles
import "./recentEntries.scss"

//react
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

//components
import ColorText from "./components/colorText";
import ColorTags from "./components/ColorTagsUser";

//images
import Image from "next/image";
import editIcon from "@/public/imgs/edit_record.svg"


export default function RecentEntries({ diaryRecord }: { diaryRecord: dailyRecord }) {
    const router = useRouter();

    const [showEdit, setShowEdit] = useState(false);


    //emoji picker
    const pick = {
        happy: "😆",
        sad: "😔",
        peacful: "😌",
        frustrated: "😤",
        thoughtful: "🧐",
        inspired: "✨",
    };



    const handleEditClick = () => {
        router.push(`/new-entry?mode="edit"&id="${diaryRecord.id_record}"`); // пример пути
    };



    return (
        <div className="recentWrapper">
            <div className="titleFeelsWrapper">
                <p className="recentTitle">{diaryRecord.title}</p>
                <div className="recentlyFeels">
                    {diaryRecord.feels.map((feel, key) => (
                        <span key={key}>{pick[feel]}</span>
                    ))}
                </div>
            </div>

            <div className="divineLine"></div>
            <p className="recentDate">{diaryRecord.date}</p>

            <ColorTags tags={diaryRecord.color_Tags} />
            <ColorText highlights={diaryRecord.highlights} />

            <div className="recentTags">
                {diaryRecord.tags.map((tag, key) => (
                    <span key={key}>#{tag}</span>
                ))}
            </div>

                <div className="editIcon" onClick={handleEditClick}>
                    <Image src={editIcon} alt="edit record"/>
                </div>
        </div>
    );
}
