import Image from "next/image"

import bookIcon from "@/public/imgs/book.svg"
import starsIcon from "@/public/imgs/stars.svg"
import telescopeIcon from "@/public/imgs/telescope.svg"

import "./card.scss"


export default function Card({imageName, title, text}:{imageName:string, title:string, text:string}) {
    const nameIcon = () => {
        if(imageName==="book") {
            return bookIcon
        } else if(imageName==="stars") {
            return starsIcon
        } else { return telescopeIcon }
    }
    return(
        <>
            <div className="card">
                <div className="blureBg"></div>
                <div className="card__icon"><Image src={nameIcon()} alt=""/></div>
                <p className="card__name">{title}</p>
                <p className="card__describe">{text}</p>
            </div>
            
        </>
    )
};
