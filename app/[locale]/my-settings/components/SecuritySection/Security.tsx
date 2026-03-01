'use client'
import { useState } from "react";
import "./security.scss"
import { addTextErrors } from "@/app/[locale]/store/errorsStore/functions";
import Image from "next/image";

//Icons
import keyIcon from "@/public/imgs/password.svg"
export default function Security() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
const handleSavePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
        addTextErrors("Please fill all password fields", "info");
    }
    setCurrentPassword("");
    setNewPassword("");
    addTextErrors("Password updated successfully!", "success");
  };

  return (
    <section className="security-card">
      <h3 className="security-title">
        <div className="security-icon"><Image src={keyIcon} alt=""/></div> Security
      </h3>
      <form onSubmit={handleSavePassword} className="security-form">
        <div className="security-field">
          <label htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="security-field">
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="security-btn">
          Update Password
        </button>
      </form>
    </section>
  );
};

