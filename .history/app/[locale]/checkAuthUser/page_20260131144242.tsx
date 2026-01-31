'use client'
import "./scss/check.scss"
import { useTranslations } from "next-intl"

import { userInfoCheck } from "./functions/checkAuth"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    
    async function checkUser() {
      try {
        const status =  await userInfoCheck()
        if (status === 200) {
            router.push("/user");
          } else if (status === 403 || status===404) {
            router.push("/sign");
          } else {
            console.log("checkAuthUser error: " + status)
        }

      }catch(error) {
        if(error instanceof Error) {
          // console.log("checkAuthUser error: " + error.message)
          alert("Sorry, but our database is currently being updated...")
          router.push("/")
        }
      }

    }

    checkUser();
  }, [router]);
    return(
        <div className="bg-check">
            <p className="bg-check__text">Wait. Checking your authorization...</p>
        </div>
    )
};
