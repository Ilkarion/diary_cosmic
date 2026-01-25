'use client'
import { useEffect, useState } from "react"
import { userInfo } from "../../functions/funstions"
import { redirect } from "next/navigation"
import "./showUserData.scss"
type UserData = {
  user: {
    username: string
    email: string
    created_at: string
  }
}

export default function ShowUser() {
  const [data, setData] = useState<UserData | null>(null)

  //checks if token exists. if no -> redirect to sign form
  useEffect(() => {
    async function getUserData() {
      const dataUser = await userInfo()
      if(dataUser === "No token") {
        redirect("/sign")
      }
      setData(dataUser)
    }
    getUserData()
  }, [])

  return (
    <>
      {data && (
        <div className="greetingText">
          <h1>Welcome back, {data.user.username}</h1>
          <p>Your cosmic journey continues...</p>
        </div>
      )}
    </>
  )
}
