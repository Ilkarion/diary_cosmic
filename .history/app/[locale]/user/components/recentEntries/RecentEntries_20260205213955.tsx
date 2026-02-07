'use client'
//types
import { dailyRecord } from "@/app/[locale]/new-entry/entry-types/types";

//styles
import "./recentEntries.scss"

//react
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

//components
import ColorText from "./components/colorText";
import ColorTags from "./components/ColorTagsUser";

export default function RecentEntries({ diaryRecord }: { diaryRecord: dailyRecord }) {
    const router = useRouter();

    const [showEdit, setShowEdit] = useState(false);
    const clickCount = useRef(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    //emoji picker
    const pick = {
        happy: "😆",
        sad: "😔",
        peacful: "😌",
        frustrated: "😤",
        thoughtful: "🧐",
        inspired: "✨",
    };

    // тройной быстрый клик для появления кнопки
    const handleComponentClick = () => {
        clickCount.current += 1;

        if (clickTimer.current) clearTimeout(clickTimer.current);

        clickTimer.current = setTimeout(() => {
            clickCount.current = 0;
        }, 200); // 0.6 секунды для тройного клика

        if (clickCount.current === 2) {
            setShowEdit(true);
            clickCount.current = 0;
        }
    };

    const handleEditClick = () => {
        router.push(`/new-entry?mode="edit"&id=${diaryRecord.id_record}`); // пример пути
    };

    // скрытие кнопки при клике в любом месте, кроме самой кнопки
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (showEdit && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setShowEdit(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [showEdit]);

    return (
        <div className="recentWrapper" onClick={handleComponentClick}>
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
                <div
                    ref={buttonRef}
                    className="editIcon"
                    onClick={handleEditClick}
                >
                    ✏️
                </div>
            )}
        </div>
    );
}
