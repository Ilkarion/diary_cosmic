'use client'
import "./scss/check.scss"
import { useTranslations } from "next-intl"

import { userInfoCheck } from "./functions/checkAuth"
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page() {

  useEffect(() => {
    async function checkUser() {
      const status =  await userInfoCheck()
console.log("checkAuthUser error: " + status)
      if (status === 200) {
        redirect("/user");
      } else if (status === 403 || status===404) {
        redirect("/sign");
      } else {
        console.log("checkAuthUser error: " + status)
      }
    }

    checkUser();
  }, []);
    return(
        <div className="bg-check">
            <p className="bg-check__text">Wait. Checking your authorization...</p>
        </div>
    )
};
