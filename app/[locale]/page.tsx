import { useTranslations } from "next-intl";

import starsIcon from "@/public/imgs/stars.svg"
import telescopeWhiteIcon from "@/public/imgs/telescopeWhite.svg"

import Image from "next/image";

import "./homePage.scss"
import Card from "./components/homeCard/Card";
import Link from "next/link";

export default function Home() {

  return (
    <div>
      <div className="starsIcon spin">
        <Image src={starsIcon} alt="" />
        <Image src={starsIcon} alt=""  className="positionBlur blur-2xl"/>
      </div>
      <h1 className="headerHomePage">Cosmic Diary</h1>
      <p className="shortGoal">{"Explore the universe of your own memories. Write down your thoughts, feelings, and daily experiences in a creative, immersive space. Each entry becomes a star in your personal cosmos."}
      </p>
      <Link href={"/checkAuthUser"} className="homePageBtn">
        <div className="telescopeBtn">
          <Image src={telescopeWhiteIcon} alt=""/>
        </div>
        Get Started
      </Link>

      <div className="cardSection">
        <Card 
        imageName="book" 
        title="Daily Records" 
        text="Write your thoughts and experiences as cosmic entries in your personal universe"/>
        <Card 
        imageName="stars" 
        title="Mood Tracking" 
        text="Track your emotional journey through the stars with beautiful visualizations"/>
        <Card 
        imageName="telescope" 
        title="Explore Memories" 
        text="Navigate through your past entries displayed as planets orbiting in space"/>
      </div>
    </div>
  );
}
