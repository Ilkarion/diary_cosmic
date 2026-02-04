'use client'
import { useEffect, useState } from "react";
import CardOption from "./components/cardOption/cardOption"
import ShowUser from "./components/showUserData/showUser"
import "./user.scss"
import { fetchDiary } from "../new-entry/logicNewEntry/functions";
import { FeelingOption, ResearchTask } from "../new-entry/entry-types/types";


interface AllTags_Records {
    diaryAllTags: {
        all_Color_Tags: { name: string, color: string }[],
        all_Tags: string[]
    },
    diaryRecords: {
          title: string;
          date: string;
          feels: FeelingOption[];
          highlights: { text: string; color: string }[];
          colorTags: ResearchTask[];
          tags: string[];
    }[]
}



export default function Page() {
    const [data, setData] = useState()
    
useEffect(() => {
  async function getDiary() {
    const dataDiary = await fetchDiary();
    // setSavedData(dataDiary)
    setData(dataDiary)
  }
  getDiary();
}, []);
    return(
        <div className="userPanel">
            <ShowUser />
            <div className="bluredCloud1"></div>
            <div className="wraperCardsPanel">
                <div className="optionCardsPanel">
                    <CardOption option={"New Entry"}/>
                    <CardOption option={"My Journal"}/>
                    <CardOption option={"Mood Tracker"}/>
                    <CardOption option={"Statistics"}/>
                    <CardOption option={"Discover"}/>
                    <CardOption option={"Settings"}/>
                </div>
            </div>
            <div className="bluredCloud2"></div>
            <div className="recentEntries">
                <h2>Recent Entries</h2>
                <div className="showEntries">
                   <p>No entries yet. Start your cosmic journey by creating your first entry!</p> 
                </div>
            </div>
        </div>
    )
};
