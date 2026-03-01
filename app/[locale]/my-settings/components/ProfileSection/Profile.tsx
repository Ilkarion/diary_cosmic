'use client'

import { useState } from "react"
import "./profile.scss"
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions"
import Image from "next/image"
//Images Icons
import personIcon from "@/public/imgs/user.svg"

export default function Profile() {
    const [nickname, setNickname] = useState("")
    const [email, setEmail] = useState("")

    const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // предотвращаем перезагрузку страницы
        addTextErrors("Profile updated successfully!", "success")
    }

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