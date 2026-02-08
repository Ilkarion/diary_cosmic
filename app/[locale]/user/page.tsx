'use client'
import { useEffect, useState } from "react";
import CardOption from "./components/cardOption/cardOption"
import ShowUser from "./components/showUserData/showUser"
import "./user.scss"
import { fetchDiary,  } from "../new-entry/logicNewEntry/functions";
import { AllTags_Records } from "../new-entry/entry-types/types";
import RecentEntries from "./components/recentEntries/RecentEntries";
import { cleanDiaryByGlobalColorsAndTags } from "./functions/cleanHighlights";

import { useTranslations } from "next-intl";





export default function Page() {
    const [data, setData] = useState<AllTags_Records>()

    const [showRecent, setShowRecent] = useState(false)
    const t = useTranslations("UserMain")
useEffect(() => {
  async function getDiary() {
    const dataDiary = await fetchDiary();
    if (!dataDiary) return;
    console.log(dataDiary)
    const cleaned = cleanDiaryByGlobalColorsAndTags(dataDiary); // 👈 чистим тут

    setData(cleaned);

    if (!cleaned.diaryRecords || cleaned.diaryRecords.length === 0) {
      setShowRecent(false);
    } else {
      setShowRecent(true);
    }
  }

  getDiary();
}, []);



    return(
        <div className="userPanel">
            <ShowUser />
            <div className="bluredCloud1"></div>
            <div className="wraperCardsPanel">
                <div className="optionCardsPanel">
                    <CardOption option={"New Entry"} mode="create"/>
                    <CardOption option={"My Journal"}/>
                    <CardOption option={"Mood Tracker"}/>
                    <CardOption option={"Statistics"}/>
                    <CardOption option={"Discover"}/>
                    <CardOption option={"Settings"}/>
                </div>
            </div>
            <div className="bluredCloud2"></div>
            <div className="recentEntries">
                <h2>{t("titleEntries")}</h2>
                <div className="showEntries">
                    {showRecent && data ?
                    data.diaryRecords.map((item, key) => {
                        return <RecentEntries diaryRecord={item} key={key}/>
                    }
                    
                )
                        : 
                    <p>{t("noEntries")}</p> 
                    }
                   
                </div>
            </div>
        </div>
    )
};
