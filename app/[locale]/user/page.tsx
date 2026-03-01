'use client'
import { useEffect, useState } from "react";
import CardOption from "./components/cardOption/cardOption"
import ShowUser from "./components/showUserData/showUser"
import "./user.scss"
import { fetchDiary,  } from "../allFunctions/newEntry/functions";
import { AllTags_Records } from "../allTypes/typesTS";
import RecentEntries from "./components/recentEntries/RecentEntries";
import { cleanDiaryByGlobalColorsAndTags } from "./functions/cleanHighlights";

import { useTranslations } from "next-intl";
import { getFetchedOnceStatus, getRecords_TagsFrontEnd, getUpdateStatus, setfetchedOnceTrue, setRecords_TagsStore, setUpdateFalse } from "../store/recordsStore/functions";





export default function Page() {
    const [data, setData] = useState<AllTags_Records>()


    const [showRecent, setShowRecent] = useState(false)
    const t = useTranslations("UserMain")
    useEffect(() => {

      async function getDiary() {

        const frontData = getRecords_TagsFrontEnd();
        const update = getUpdateStatus()
        const fetchedOnce = getFetchedOnceStatus()
        const shouldFetch = update || !fetchedOnce;

        let dataDiary: AllTags_Records;

        if (shouldFetch) {
          dataDiary = await fetchDiary();

          if (!dataDiary || dataDiary.diaryRecords.length===0) return;

          const cleaned = cleanDiaryByGlobalColorsAndTags(dataDiary);

          setData(cleaned);
          setRecords_TagsStore(cleaned);

          // теперь мы сделали fetch хотя бы один раз
          setfetchedOnceTrue()
          setUpdateFalse();
          setShowRecent(cleaned.diaryRecords.length > 0);

        } else {
          // просто отдаем frontData
          if (!frontData) return;
          setData(frontData);
          setShowRecent(frontData.diaryRecords.length > 0);
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
