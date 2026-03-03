'use client'

import { useState } from "react"
import "./profile.scss"
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions"
import Image from "next/image"
//Images Icons
import personIcon from "@/public/imgs/user.svg"
import { getUserInfo, setUpdateUser } from "@/app/[locale]/store/userInfo/functions"
import { changeEmailRequest, changeUsername } from "@/app/[locale]/allFunctions/mySettings/functions"

export default function Profile() {
    const username = getUserInfo().username
    const gmail = getUserInfo().email
    const [nickname, setNickname] = useState(username)
    const [email, setEmail] = useState(gmail)

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>,) => {
    e.preventDefault();
    try {
        if (nickname === username && gmail === email) {
            addTextErrors("No changes in your username or email", "info",)
            return

        }else if (nickname !== username && gmail === email) {
            const res = await changeUsername(nickname);
            addTextErrors(res.message, "success");
            setUpdateUser(true)
            return;
        }else if(nickname === username && gmail !== email) {
            const res = await changeEmailRequest(email);
            addTextErrors(res.message, "success");
            setUpdateUser(true)
            return;
        } else if(nickname != username && gmail !== email) {
            const res = await changeUsername(nickname);
            addTextErrors(res.message, "success");
            
            const resE = await changeEmailRequest(email);
            addTextErrors(resE.message, "success");
            setUpdateUser(true)
        }
        

    } catch (e) {
        if (e instanceof Error)
        addTextErrors(e.message, "error");
    }
    };

    return (
        <section className="profile-card">
            <h3 className="profile-title">
                <div className="profile-icon"><Image src={personIcon} alt=""/></div> Profile
            </h3>
            <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="profile-field">
                    <label htmlFor="nickname">Nickname</label>
                    <input
                        id="nickname"
                        type="text"
                        placeholder="Enter your new nickname"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />
                </div>
                <div className="profile-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your new email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" className="profile-btn">
                    Save Profile
                </button>
            </form>
        </section>
    )
}