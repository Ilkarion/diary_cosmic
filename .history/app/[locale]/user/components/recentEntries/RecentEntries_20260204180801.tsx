'use client'
//types
import { FeelingOption } from "@/app/[locale]/new-entry/entry-types/types";

//styles
import "./recentEntries.scss"

//react
import { useEffect } from "react";

//functions
import { fetchDiary } from "@/app/[locale]/new-entry/logicNewEntry/functions";


export default function RecentEntries() {
    
useEffect(() => {
  async function getDiary() {
    const dataDiary = await fetchDiary();
    // setSavedData(dataDiary)
    console.log(dataDiary)
  }
  getDiary();
}, []);
    //title
    //date
    //feelings
    const pick: Record<FeelingOption, string> = {
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
            <div>
                <p>Title</p>
                <p>14 August, 2026</p>
                <div>
                    <div>
                        <span>_Peacfull</span>
                    </div>
                    
                    <div>
                        <span>_Sad</span>
                    </div>
                    
                    <div>
                        <span>_Happy</span>
                    </div>
                </div>
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui illum voluptatem optio suscipit labore deleniti esse natus! Iusto, odit debitis. Sed ipsa officiis voluptatum, repellat pariatur adipisci eum. Minima, magnam?</div>

                <div>
                    <span>home</span>
                    <span>sun</span>
                    <span>sky</span>
                </div>
            
            
            </div>
        </>
    )
};
