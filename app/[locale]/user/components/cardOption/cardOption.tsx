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

import { useTranslations } from "next-intl"



export default function CardOption({option, mode="default", id_record="default"}:{option: string, mode?:string, id_record?:string}) {
    const t = useTranslations("UserPages")
    
    const optionPack = {
        image:  option==="New Entry" ? editIcon : 
                option==="My Journal" ? telescopeIcon : 
                option==="Mood Tracker" ? pulseIcon :
                option==="Statistics" ? starsIcon :
                option==="Discover" ? telescopeIcon : settingsIcon,

        p1Text: option==="New Entry" ? t("page1.title") : 
                option==="My Journal" ? t("page2.title") : 
                option==="Mood Tracker" ? t("page3.title") :
                option==="Statistics" ? t("page4.title") :
                option==="Discover" ? t("page5.title") : t("page6.title"),
        
        p2Text: option==="New Entry" ? t("page1.text") : 
                option==="My Journal" ? t("page2.text") : 
                option==="Mood Tracker" ? t("page3.text") :
                option==="Statistics" ? t("page4.text") :
                option==="Discover" ? t("page5.text") : t("page6.text"),
        
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
        if(option==="Settings") {
            redirect('/my-settings')
        }
        if(option==="Mood Tracker") {
            redirect('/mood-tracker')
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
