'use client'
//types
import { dailyRecord } from "@/app/[locale]/new-entry/entry-types/types";

//styles
import "./recentEntries.scss"

//react
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

//functions
import ColorText from "./components/colorText";
import ColorTags from "./components/ColorTagsUser";

export default function RecentEntries({ diaryRecord }: { diaryRecord: dailyRecord }) {
    const router = useRouter();

    const [showEdit, setShowEdit] = useState(false);
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);

    //emoji picker
    const pick = {
        happy: "😆",
        sad: "😔",
        peacful: "😌",
        frustrated: "😤",
        thoughtful: "🧐",
        inspired: "✨",
    };

    // обработка наведения
    const handleMouseEnter = () => {
        hoverTimer.current = setTimeout(() => {
            setShowEdit(true);
        }, 1500); // 1.5 секунды
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setShowEdit(false);
    };

    const handleEditClick = () => {
        router.push(`/new-entry?mode="edit"&id=${diaryRecord.id_record}`); // пример пути
    };

    return (
        <div
            className="recentWrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
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

            {showEdit && (
                <div className="editIcon" onClick={handleEditClick}>
                    ✏️
                </div>
            )}
        </div>
    );
}
