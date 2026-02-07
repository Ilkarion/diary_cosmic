'use client'

import "./cardOption.scss"
import Image from "next/image"
//Images
import pulseIcon from "@/public/imgs/pulse.svg"
import telescopeIcon from "@/public/imgs/telescope.svg"
import settingsIcon from "@/public/imgs/settings.svg"
import editIcon from "@/public/imgs/edit.svg"
import starsIcon from "@/public/imgs/stars.svg"
import { redirect } from "next/navigation"



export default function CardOption({option, mode="default", id_record="default"}:{option: string, mode?:string, id_record?:string}) {
    const optionPack = {
        image:  option==="New Entry" ? editIcon : 
                option==="My Journal" ? telescopeIcon : 
                option==="Mood Tracker" ? pulseIcon :
                option==="Statistics" ? starsIcon :
                option==="Discover" ? telescopeIcon : settingsIcon,

        p1Text: option==="New Entry" ? "New Entry" : 
                option==="My Journal" ? "My Journal" : 
                option==="Mood Tracker" ? "Mood Tracker" :
                option==="Statistics" ? "Statistics" :
                option==="Discover" ? "Discover" : "Settings",
        
        p2Text: option==="New Entry" ? "Create a new day record" : 
                option==="My Journal" ? "Explore your memories" : 
                option==="Mood Tracker" ? "Track your emotions" :
                option==="Statistics" ? "View your activity" :
                option==="Discover" ? "Get inspired to write" : "Customize your space",
        
        hoverColor: option==="New Entry" ? "entry" : 
                    option==="My Journal" ? "journal" : 
                    option==="Mood Tracker" ? "tracker" :
                    option==="Statistics" ? "statistics" :
                    option==="Discover" ? "discover" : "discover",

    }


    function handleClick(option:string) {
        if(option==="New Entry")  {
            if(mode==="create") {
                redirect(`/new-entry?mode=${mode}`)  
            } else if(mode==="edit") {
                redirect(`/new-entry?mode=${mode}&id=${id_record}`)
            }
            
        }

        if(option==="My Journal") {
            redirect('/my-Journal')
        }
    }

    return(
        <>
            <div className={`cardOption ${optionPack.hoverColor}`} onClick={()=>handleClick(option)}>
                <div className="icon_wrapper">
                    <div className="cardOption__icon">
                        <Image src={optionPack.image} alt=""/>
                    </div>
                </div>
                <p>{optionPack.p1Text}</p>
                <p>{optionPack.p2Text}</p>
            </div>
        </>
    )
};
