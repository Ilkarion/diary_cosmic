import {getTranslations} from 'next-intl/server';

import starsIcon from "@/public/imgs/stars.svg"
import telescopeWhiteIcon from "@/public/imgs/telescopeWhite.svg"

import Image from "next/image";

import "./homePage.scss"
import Card from "./components/homeCard/Card";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations("HomePage")

  return (
    <div>
      <div className="starsIcon spin">
        <Image src={starsIcon} alt="" />
        <Image src={starsIcon} alt=""  className="positionBlur blur-2xl"/>
      </div>
      <h1 className="headerHomePage">{t("title")}</h1>
      <p className="shortGoal">{t("quote")}</p>
      <Link href={"/checkAuthUser"} className="homePageBtn">
        <div className="telescopeBtn">
          <Image src={telescopeWhiteIcon} alt=""/>
        </div>
        {t("btn-text")}
      </Link>

      <div className="cardSection">
        <Card 
        imageName="book" 
        title={t("cardGroup.card1.title")} 
        text={t("cardGroup.card1.text")}/>
        <Card 
        imageName="stars" 
        title={t("cardGroup.card2.title")} 
        text={t("cardGroup.card2.text")}/>
        <Card 
        imageName="telescope" 
        title={t("cardGroup.card3.title")}
        text={t("cardGroup.card3.text")}/>
      </div>
    </div>
  );
}
